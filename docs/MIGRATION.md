# Partage du core des viewports entre synthétiseurs et blueprints

Ce document décrit comment partager la logique des viewports (pan, reset, puis zoom) entre `features/synthesizers` et une nouvelle `features/blueprints`, en respectant l'architecture FCIS.

Statut : **en cours**. Les étapes 1, 2 et 3 sont faites, ainsi que les points 4.1, 4.2 et 4.3.

## Prérequis

La migration du pan du synthétiseur est terminée (`596fac1 feat(pan): connect the new panSynthesizer feature`). Son plan a été supprimé par `045d1a0` et reste consultable avec `git show 596fac1:docs/MIGRATION.md`.

## Constat

Les processes `pan` et `reset` de [`features/synthesizers/core/processes/synthesizers`](../features/synthesizers/core/processes/synthesizers) mélangent deux responsabilités :

1. **un calcul géométrique, indépendant du domaine** : le nouveau viewport à afficher, et le fait qu'il ait changé ou non (`positionsDiffer`, `isDefaultViewport`) ;
2. **une décision propre au synthétiseur** : produire l'effet `synthesizers.viewport.save` avec l'`id` du synthétiseur.

Seule la première peut être partagée. La seconde doit rester dans chaque domaine, sinon le core des blueprints dépendrait des effets des synthétiseurs.

L'éditeur de blueprints a les mêmes besoins. [`Blueprint`](../types/blueprints/Blueprint.ts) porte lui aussi `x`, `y` et `scale`, et son pan passe par le même composant `sp-stage`. Depuis la migration du pan, il ne sauvegarde plus : [`Creator.vue`](../components/blueprint/Creator.vue) écoute `@panned`, qui n'est plus émis.

## Organisation cible

```
features/
  shared/
    data/Uuid.type.ts                 ← déplacé depuis synthesizers
    http/                             ← déplacé depuis synthesizers/shell/api
  viewports/                          ← nouveau, ne connaît ni synthétiseur ni blueprint
    core/
      data/Position.type.ts
      data/Viewport.type.ts
      shared/Constants.ts
      shared/viewport.ts
      processes/pan.process.ts        ← calcul pur, sans effet
      processes/reset.process.ts      ← calcul pur, sans effet
    shell/legacy/viewport.adapter.ts  ← toViewport, applyViewport, makeApplyFacts génériques
  synthesizers/
    core/processes/synthesizers/pan.process.ts    ← produit l'effet synthesizers.viewport.save
    core/processes/synthesizers/reset.process.ts
    shell/effect.ts
    shell/api/saveViewport.http.ts
    shell/legacy/viewport.adapter.ts              ← makePanSynthesizer, makeResetSynthesizer
  blueprints/                         ← nouveau
    core/data/Effect.type.ts
    core/processes/pan.process.ts     ← produit l'effet blueprints.viewport.save
    shell/effect.ts
    shell/api/saveViewport.http.ts
    shell/legacy/viewport.adapter.ts  ← makePanBlueprint
```

### Règles de dépendance

```
synthesizers  ──►  viewports  ◄──  blueprints
      │                │               │
      └────────────►  shared  ◄────────┘
```

- `viewports` n'importe ni `synthesizers` ni `blueprints` ;
- `synthesizers` et `blueprints` ne s'importent pas l'un l'autre ;
- aucun core n'importe un shell ;
- `shared` n'importe aucune feature.

Chaque étape se vérifie avec :

```sh
grep -rn "features/synthesizers\|\.\./synthesizers" features/viewports features/blueprints features/shared
grep -rn "features/blueprints\|\.\./blueprints" features/viewports features/synthesizers features/shared
grep -rn "/shell/" features/*/core
```

Ces trois commandes ne doivent rien renvoyer.

## Alternative écartée : injecter une fabrique d'effets

Le core partagé pourrait recevoir une fabrique, `makePan<E>(toEffect: (vp: Viewport) => E)`, et produire directement `effects: E[]`.

C'est compatible avec FCIS, car la fabrique est pure. Mais cette approche ajoute des génériques et une indirection pour un gain faible. Avec un booléen `changed`, le core partagé ignore complètement la notion d'effet, et chaque domaine décide de façon explicite de ce qu'il fait d'un changement.

## Étapes

Chaque étape correspond à un commit. Les étapes 1 à 3 sont des refactorings : le comportement visible ne change pas, et les tests existants doivent rester verts sans modification de leurs assertions. Seuls leurs imports changent.

Les déplacements se font avec `git mv`, pour conserver l'historique des fichiers.

### 1. Extraire les données et comparaisons partagées — ✅ fait

Objectif : créer `features/viewports/core` et `features/shared/data`, sans aucun changement de comportement.

#### Déplacements

| Depuis `features/synthesizers/core/` | Vers |
|---|---|
| `data/Uuid.type.ts` | `features/shared/data/Uuid.type.ts` |
| `data/Position.type.ts` | `features/viewports/core/data/Position.type.ts` |
| type `Viewport` de `data/Synthesizer.type.ts` | `features/viewports/core/data/Viewport.type.ts` |
| `shared/Constants.ts` | `features/viewports/core/shared/Constants.ts` |
| `shared/viewport.ts` | `features/viewports/core/shared/viewport.ts` |
| `shared/__tests__/viewport.test.ts` | `features/viewports/core/shared/__tests__/viewport.test.ts` |

`Constants.ts` ne contient que `DEFAULT_POSITION` et `DEFAULT_VIEWPORT`, donc le fichier se déplace en entier.

Dans `Synthesizer.type.ts`, la définition de `Viewport` et son commentaire sont remplacés par un import depuis `features/viewports`. `Synthesizer` reste défini comme `Viewport & { … }`. On ne réexporte pas `Viewport` depuis `Synthesizer.type.ts` : tous les imports pointent vers la nouvelle source.

#### Imports à mettre à jour

Relevés avec `grep -rn "Position.type\|Uuid.type\|shared/Constants\|shared/viewport\|Synthesizer.type" features` :

- `Uuid` : `data/{AudioModule,Cable,InnerNode,Synthesizer,Effect}.type.ts`, `processes/synthesizers/{pan,reset}.process.ts` et leurs tests, `shell/api/saveViewport.http.ts` et son test, `shell/legacy/viewport.adapter.ts` et son test, `features/shared/tests/{mockAudioModule,mockInnerNode,mockSynthesizer}.ts` ;
- `Viewport` : `data/Effect.type.ts`, `processes/synthesizers/{pan,reset}.process.ts` et leurs tests, `shell/api/saveViewport.http.ts`, `shell/legacy/viewport.adapter.ts` et son test ;
- `Position` : `processes/synthesizers/pan.process.ts`, `shell/legacy/viewport.adapter.ts` ;
- `DEFAULT_VIEWPORT` : `processes/synthesizers/reset.process.ts` et son test, `shell/api/__tests__/saveViewport.test.ts`, `shell/legacy/__tests__/viewport.test.ts`.

#### Suppressions faites en même temps, hors du plan

Pendant cette étape, des fichiers inutilisés ont été supprimés. Aucun fichier `.ts` ou `.vue` du projet ne les référençait :

- `features/shared/tests/mock{AudioModule,AudioNode,InnerNode,Synthesizer}.ts` ;
- `core/processes/inner_links/connectNodes.process.ts` ;
- `core/processes/inner_nodes/create.process.ts` et son test (4 tests), dont l'import cassé de `Uuid` ;
- `core/processes/modules/createVoice.process.ts` et son test (5 tests).

Conséquences :

- les mises à jour d'imports listées plus haut pour les mocks sont sans objet ;
- les 5 erreurs tsc qui existaient avant la migration ont disparu, car elles venaient de ces fichiers ;
- la règle « `shared` n'importe aucune feature » est désormais respectée, car les mocks étaient les seuls à l'enfreindre ;
- **la nouvelle référence est de 41 tests** (30 dans `synthesizers`, 11 dans `viewports`), soit 68 avec `features/shared`. Les étapes suivantes se comparent à ce chiffre.

#### Vérifications

- [x] `npx vitest run features` est vert : 8 fichiers, 68 tests, dont 41 dans `synthesizers` et `viewports`. Les 50 tests d'avant l'étape, moins les 9 tests supprimés, sont tous présents ;
- [x] `npx tsc --noEmit -p .` ne signale aucune erreur dans `features/` ;
- [x] les commandes de vérification des dépendances ne renvoient rien ;
- [x] `grep -rn "Viewport\b" features/synthesizers/core/data/Synthesizer.type.ts` ne montre plus qu'un import et l'intersection `Viewport & {`.

Commits, à indexer séparément avec `git add` :

1. `chore: remove unused synthesizer processes and test mocks` : les suppressions ci-dessus ;
2. `refactor(viewports): extract the shared viewport data and comparisons` : l'étape 1.

### 2. Processes partagés `panViewport` et `resetViewport` — ✅ fait

Objectif : déplacer le calcul et le jugement dans `features/viewports`. Les processes du synthétiseur ne font plus que traduire un changement en effet.

#### Core partagé

```ts
// features/viewports/core/processes/pan.process.ts
export type ViewportChange = { viewport: Viewport, changed: boolean }

export type PanViewportFct = (from: Viewport, to: Position) => ViewportChange

export const panViewport: PanViewportFct = (from, to) => {
  const viewport = { position: { x: to.x, y: to.y }, scale: from.scale }
  return { viewport, changed: positionsDiffer(from.position, to) }
}
```

```ts
// features/viewports/core/processes/reset.process.ts
export type ResetViewportFct = (viewport: Viewport) => ViewportChange

export const resetViewport: ResetViewportFct = viewport => ({
  viewport: DEFAULT_VIEWPORT,
  changed: !isDefaultViewport(viewport)
})
```

Les noms `panViewport` et `resetViewport` évitent un alias à l'import dans les processes du domaine, qui s'appellent déjà `pan` et `reset`. `ViewportChange` est défini dans `core/data/ViewportChange.type.ts`, à côté des autres types, pour que `zoom` puisse le réutiliser.

#### Core du synthétiseur

```ts
// features/synthesizers/core/processes/synthesizers/pan.process.ts
export const pan: PanFct = (id, from, to) => {
  const { viewport, changed } = panViewport(from, to)
  return { viewport, effects: changed ? [ { type: "synthesizers.viewport.save", id, viewport } ] : [] }
}
```

```ts
// features/synthesizers/core/processes/synthesizers/reset.process.ts
export const reset: ResetFct = (id, from) => {
  const { viewport, changed } = resetViewport(from)
  return { viewport, effects: changed ? [ { type: "synthesizers.viewport.save", id, viewport } ] : [] }
}
```

Les signatures `PanFct` et `ResetFct` ne changent pas.

#### Tests

L'ordre compte : on prouve d'abord la non-régression, puis on allège.

1. **Avant toute modification des tests du synthétiseur**, réécrire les deux processes et vérifier que `pan.test.ts` et `reset.test.ts` passent sans changement. C'est la preuve que la réécriture ne change rien.
2. Créer `features/viewports/core/processes/__tests__/pan.test.ts` en reprenant les cas de l'actuel `pan.test.ts`, avec des assertions sur `{ viewport, changed }` :
   - [x] déplacement sur X seul, puis sur Y seul : `changed` vaut `true` ;
   - [x] position inchangée : `changed` vaut `false` ;
   - [x] le scale de départ est conservé ;
   - [x] viewport de départ gelé (`Object.freeze`) ;
   - [x] le viewport renvoyé ne partage pas sa référence avec `to`.
3. Créer `features/viewports/core/processes/__tests__/reset.test.ts` en reprenant l'actuel `reset.test.ts` :
   - [x] écart sur X seul, Y seul, scale seul : `changed` vaut `true` ;
   - [x] viewport déjà par défaut : `changed` vaut `false` ;
   - [x] viewport gelé ;
   - [x] le viewport renvoyé est toujours `DEFAULT_VIEWPORT`.
4. Réduire les tests du synthétiseur à ce qui relève de cette couche. Il reste deux tests par process, qui comparent le résultat complet avec `toEqual` :
   - [x] un changement produit exactement un effet `synthesizers.viewport.save`, avec le bon `id` et le viewport renvoyé. Pour `pan`, le scale de départ vaut 2, pour vérifier que l'effet contient bien le scale conservé ;
   - [x] une absence de changement ne produit aucun effet.

   Un troisième test, « le viewport renvoyé est celui calculé par le core partagé », était prévu. Il est inutile, car `toEqual` vérifie déjà le viewport renvoyé dans les deux tests.

#### Vérifications

- [x] `npx vitest run features` est vert : 10 fichiers, **72 tests**. C'est la nouvelle référence pour l'étape 3 (79 après la création des tests de `viewports`, moins 3 pour `pan` et 4 pour `reset`) ;
- [x] `npx tsc --noEmit -p .` ne signale aucune erreur dans `features/` ;
- [x] les commandes de vérification des dépendances ne renvoient rien ;
- [x] mutation : en remplaçant `positionsDiffer(from.position, to)` par `true` dans `panViewport`, un test de `viewports` échoue. Même chose avec `!isDefaultViewport(viewport)` dans `resetViewport` ;
- [x] mutation des processes du synthétiseur : chacune des mutations suivantes fait échouer un test, pour `pan` comme pour `reset` :
  - effet toujours produit, ou jamais produit ;
  - `id` constant ;
  - effet contenant `from` ;
  - viewport renvoyé remplacé par `from` ;
  - `type` modifié.

Commit : `refactor(viewports): build synthesizers pan and reset on a shared core`.

### 3. Shell partagé : couche HTTP et adapter legacy — ✅ fait

Objectif : rendre réutilisables par les blueprints tout ce qui ne dépend pas du synthétiseur dans le shell.

#### Couche HTTP

`saveViewport.http.ts` des blueprints aura besoin de `HttpPut`, `HttpError`, `withAuthenticationGuard` et du `put` Nuxt. Ces fichiers ne parlent pas de synthétiseur, ils passent donc dans `features/shared/http` :

| Depuis `features/synthesizers/shell/api/` | Vers `features/shared/http/` |
|---|---|
| `http.ts` | `http.ts` |
| `axios.http.ts` | `axios.http.ts` |
| `nuxt.http.ts` | `nuxt.http.ts` (corriger l'import relatif de `composables/usetab`) |
| `__tests__/http.test.ts` | `__tests__/http.test.ts` |
| `__tests__/utils/recorder.ts` | `__tests__/utils/recorder.ts` |

`saveViewport.http.ts` et son test restent dans `features/synthesizers/shell/api`, car ils connaissent l'URL `/proxy/synthesizers/:id`. Ils importent désormais depuis `features/shared/http`.

`features/shared` contient alors du code shell (`nuxt.http.ts`). C'est acceptable tant qu'aucun core ne l'importe, ce que vérifie la troisième commande de vérification des dépendances.

#### Adapter générique

`toViewport` et `applyViewport` ne lisent que `x`, `y` et `scale`. Ils passent dans `features/viewports/shell/legacy/viewport.adapter.ts` et travaillent sur `ScaledCoordinates` ([`types/utils/Coordinates`](../types/utils/Coordinates.ts)), que `Synthesizer` et `Blueprint` satisfont tous les deux :

```ts
// features/viewports/shell/legacy/viewport.adapter.ts
export const toViewport = (target: ScaledCoordinates): Viewport => ({
  position: { x: target.x, y: target.y }, scale: target.scale
})

export const applyViewport = (target: ScaledCoordinates, viewport: Viewport): void => {
  target.x = viewport.position.x
  target.y = viewport.position.y
  target.scale = viewport.scale
}

export type ViewportFacts<E extends Effect> = { viewport: Viewport, effects: E[] }

export type FactsApplier<E extends Effect> = (target: ScaledCoordinates, facts: ViewportFacts<E>) => Promise<void>

export const makeApplyFacts = <E extends Effect>(run: (effect: E) => Promise<void>): FactsApplier<E> =>
  async (target, { viewport, effects }) => {
    applyViewport(target, viewport)
    await Promise.all(effects.map(run))
  }
```

L'adapter du synthétiseur ne garde que ce qui lui est propre :

```ts
// features/synthesizers/shell/legacy/viewport.adapter.ts
export const applyFacts: FactsApplier<SynthesizersEffect> = makeApplyFacts(runEffect)

export const makePanSynthesizer: PanSynthesizerFactory = apply =>
  async (synth, from, to) => {
    const facts = pan(synth.id as Uuid, { ...toViewport(synth), position: from }, to)
    await apply(synth, facts)
  }
// makeResetSynthesizer, panSynthesizer, resetSynthesizer : inchangés
```

Les noms exportés `panSynthesizer` et `resetSynthesizer` ne changent pas. [`pages/synthesizers/[id].vue`](../pages/synthesizers/[id].vue), qui les importe tous les deux, n'a rien à modifier.

#### Tests

- [x] `toViewport`, `applyViewport` et `applyFacts` migrent vers `features/viewports/shell/legacy/__tests__/viewport.test.ts`. La cible est un simple objet `{ x, y, scale }` et l'effet un faux `{ type: "test.effect" }`, pour prouver que l'adapter ne dépend d'aucun domaine ;
- [x] `makeResetSynthesizer` et `makePanSynthesizer` restent dans `features/synthesizers/shell/legacy/__tests__/viewport.test.ts`, y compris le test du point délicat (synthétiseur placé à `to`, scale différent de 1).

#### Écarts avec le plan

- **`RunEffectFct<E>` est défini dans [`features/shared/facts.ts`](../features/shared/facts.ts)**, à côté d'`Effect`, et non dans l'adapter. Il décrit l'exécution d'un effet en général. Les `effect.ts` de chaque domaine l'importent donc depuis `shared`, sans dépendre de l'adapter legacy des viewports.
- **`SynthesizersEffects` est renommé `SynthesizersEffect`**, puisque le type décrit un seul effet. Le renommage est complet. Les extraits de code de l'étape 4 utilisent par analogie `BlueprintsEffect`.
- **`core/shared/SynthesizerMap.type.ts` a été supprimé.** Aucun fichier ne l'utilisait. Cette suppression va dans un commit séparé.

#### Vérifications

- [x] `npx vitest run features` est vert : 11 fichiers, 72 tests, soit le même nombre qu'à la fin de l'étape 2 ;
- [x] `npx tsc --noEmit -p .` ne signale aucune erreur dans `features/`, `pages/` ni `components/` ;
- [x] les commandes de vérification des dépendances ne renvoient rien ;
- [x] dans le navigateur : un pan et un reset du synthétiseur sauvegardent toujours (onglet réseau, `PUT /proxy/synthesizers/:id` avec `x`, `y`, `scale`). Validé à la main.

Commits :

1. `chore: remove unused SynthesizerMap type` ;
2. `refactor(viewports): share the legacy viewport adapter and the http layer`.

### 4. Feature `blueprints` : pan

Objectif : réparer la sauvegarde du pan dans l'éditeur de blueprints, sur le même modèle que le synthétiseur.

#### 4.1. Vérifier l'API avant d'écrire du code — ✅ fait

- [x] `PUT /proxy/blueprints/:id` accepte un corps limité à `x`, `y` et `scale`, sans écraser les autres champs. Vérifié dans le dépôt `api` (commit `1b0ad53`) :
  - la route `put '/:id'` de `controllers/blueprints/blueprints.rb` appelle `Services::Blueprints::Update#find_and_update` ;
  - `services/blueprints/update.rb` applique `payload.slice(:name, :slots, :experimental, :x, :y, :scale)`. Seuls les champs présents dans le corps sont donc modifiés ;
  - `spec/controllers/blueprints/update_spec.rb` envoie déjà des corps partiels (`name` seul, `slots` seul) et vérifie que la réponse vaut 200 ;
  - la réponse (`views/blueprints/_blueprint`) renvoie `x`, `y` et `scale`.

Deux points à connaître, non bloquants :

- **Types des champs.** Dans `models/blueprints/blueprint.rb`, `x` et `y` sont des `Integer` et `scale` un `Float`. C'est la même chose que pour le viewport du synthétiseur (`models/social/membership.rb`), donc le comportement en cas de position décimale sera identique à celui déjà validé à l'étape 3.
- **Couverture des tests de l'API.** Aucun test de l'API ne vérifie une mise à jour de `x`, `y` ou `scale` sur un blueprint. On peut en ajouter un dans `spec/controllers/blueprints/update_spec.rb`, mais c'est hors du périmètre du front.

#### 4.2. Core — ✅ fait

```ts
// features/blueprints/core/data/Effect.type.ts
export type BlueprintsEffect = Effect & (
  | { type: "blueprints.viewport.save", id: Uuid, viewport: Viewport }
)
```

```ts
// features/blueprints/core/processes/pan.process.ts
export type PanFct = (id: Uuid | null, from: Viewport, to: Position) => { viewport: Viewport, effects: BlueprintsEffect[] }

export const pan: PanFct = (id, from, to) => {
  const { viewport, changed } = panViewport(from, to)
  return { viewport, effects: id !== null && changed ? [ { type: "blueprints.viewport.save", id, viewport } ] : [] }
}
```

**Différence avec le synthétiseur : le blueprint peut ne pas avoir d'`id`.** En mode création, `Creator.vue` ne crée le blueprint côté API qu'à la première sauvegarde (`if (!blueprint.value.id)`). Un pan avant cette sauvegarde n'a rien à sauvegarder : le viewport est appliqué, mais aucun effet n'est produit. C'est une règle métier, elle vit donc dans le core et non dans l'adapter.

**Représentation de l'absence d'`id`.** Le core représente l'absence d'`id` par `null`, et il le teste strictement avec `id !== null`, en accord avec son type `Uuid | null`. Le legacy, lui, utilise une chaîne vide : [`pages/blueprints/New.vue`](../pages/blueprints/New.vue) crée le blueprint avec `id: ""`, et `Identified` type `id` comme un `string`, jamais `null`. La conversion de `""` vers `null` relève de la traduction entre legacy et core. Elle se fait donc dans l'adapter (étape 4.3), pas dans le core.

Tests (`features/blueprints/core/processes/__tests__/pan.test.ts`) :

- [x] un changement avec un `id` produit exactement un effet `blueprints.viewport.save`. Le scale de départ vaut 2, pour vérifier qu'il est conservé ;
- [x] une absence de changement ne produit aucun effet ;
- [x] un changement sans `id` ne produit aucun effet, mais le viewport renvoyé est bien le nouveau.

Vérifications :

- [x] `npx vitest run features` est vert : 12 fichiers, **75 tests**, soit 72 plus les 3 tests du core des blueprints. C'est la nouvelle référence pour la suite de l'étape 4 ;
- [x] `npx tsc --noEmit -p .` ne signale aucune erreur ;
- [x] les commandes de vérification des dépendances ne renvoient rien : `blueprints` n'importe rien de `synthesizers` ;
- [x] mutations : chacune fait échouer au moins un test :
  - effet toujours produit, ou jamais produit ;
  - condition sur l'`id` retirée ;
  - condition sur `changed` retirée ;
  - `id` constant ;
  - effet contenant `from` ;
  - viewport renvoyé remplacé par `from` ;
  - `type` modifié.

Nommage retenu : comme pour le synthétiseur, le process du core s'appelle `pan` (type `PanFct`). Le nom `panBlueprint` reste libre pour l'adapter de l'étape 4.3.

Un process `reset` n'est utile que si l'éditeur de blueprints propose un bouton de réinitialisation de la vue. Ce n'est pas le cas aujourd'hui, donc il est hors périmètre.

#### 4.3. Shell — ✅ fait

- `features/blueprints/shell/api/saveViewport.http.ts`, calqué sur celui du synthétiseur, vers `/proxy/blueprints/${id}` ;
- `features/blueprints/shell/effect.ts`, avec `makeRunEffect(put)` et un `switch` sur `BlueprintsEffect` terminé par `assertNever` ;
- `features/blueprints/shell/legacy/viewport.adapter.ts` :

  ```ts
  export const applyFacts: FactsApplier<BlueprintsEffect> = makeApplyFacts(runEffect)

  export const makePanBlueprint: PanBlueprintFactory = apply =>
    async (blueprint, from, to) => {
      const facts = pan(blueprint.id ? blueprint.id as Uuid : null, { ...toViewport(blueprint), position: from }, to)
      await apply(blueprint, facts)
    }

  export const panBlueprint = makePanBlueprint(applyFacts)
  ```

  **Attention à la conversion de l'`id`.** Il faut utiliser un test de vérité (`blueprint.id ? … : null`) et non `blueprint.id ?? null`. `??` ne remplace que `null` et `undefined` : avec `"" ?? null`, le core recevrait `""` et produirait un effet, ce qui donnerait un `PUT /proxy/blueprints/` sans identifiant.

Tests :

- [x] `saveViewport.http.ts` : seuls `x`, `y` et `scale` sont envoyés à la bonne URL, et une erreur HTTP est propagée (sur le modèle de `features/synthesizers/shell/api/__tests__/saveViewport.test.ts`) ;
- [x] `effect.ts` (`__tests__/effect.test.ts`), où l'on teste `makeRunEffect(put)` avec un `recorder`. Quatre cas sont vérifiés :
  - l'effet `blueprints.viewport.save` envoie une seule requête, avec le bon `id` et le bon viewport, et la promesse se résout avec `undefined` ;
  - un échec HTTP est absorbé : la promesse se résout avec `undefined`, sans nouvel essai ;
  - une exception levée par `put` est propagée ;
  - un type d'effet inconnu est rejeté par `assertNever`, sans qu'aucune requête soit envoyée ;
- [x] `effect.ts`, tests de type (`__tests__/effect.test-d.ts`) : le runner a le type `RunEffectFct<BlueprintsEffect>`, et refuse un effet `synthesizers.viewport.save`. Ce refus est vérifié par `toBeCallableWith`, accompagné d'un `@ts-expect-error`, sans exécuter l'appel ;
- [x] `makePanBlueprint` : mêmes cas que `makePanSynthesizer`, dont le point délicat (blueprint placé à `to`, scale différent de 1). Plus un cas avec `id: ""`, comme en mode création, où `apply` reçoit le nouveau viewport mais aucun effet. Ce test échoue si l'adapter utilise `??` au lieu d'un test de vérité.

Écarts avec le plan, validés :

- **Message d'`assertNever` simplifié.** Dans [`features/shared/facts.ts`](../features/shared/facts.ts), l'erreur ne contient plus que la valeur sérialisée (`JSON.stringify(value)`). Le préfixe « Effet non géré : » a été retiré. Les tests de type d'effet inconnu vérifient donc `JSON.stringify("<type>")`. Ce changement s'applique aussi au synthétiseur.
- **Tests de `effect.ts` ajoutés aussi pour le synthétiseur** (`features/synthesizers/shell/__tests__/`), sur le même modèle. Il manquait ces tests depuis l'étape 3.
- **Les `.test-d.ts` sont aussi exécutés par vitest**, car `vitest.config.ts` les inclut. Un appel réel dans ces fichiers est donc exécuté : il faut passer par `expectTypeOf(...).toBeCallableWith(...)` pour ne vérifier que le typage. Le mode `--typecheck` n'est pas utilisable aujourd'hui, car il signale 165 erreurs sans rapport (par exemple dans `utils/midi`).

Vérifications :

- [x] `npx vitest run features` est vert : 18 fichiers, **93 tests**. C'est la nouvelle référence pour le point 4.4 ;
- [x] `npx tsc --noEmit -p .` ne signale aucune erreur ;
- [x] les commandes de vérification des dépendances ne renvoient rien ;
- [x] mutations : les 8 mutations de `effect.ts` et les 6 mutations de l'adapter font chacune échouer au moins un test.

#### 4.4. Composants

- [`blueprint/Structure/Index.vue`](../components/blueprint/Structure/Index.vue) : écouter `@pan-released` sur `sp-stage` et appeler `panBlueprint(blueprint, from, to)`. Supprimer `panned` du type `Emits`. Le composant reçoit déjà le blueprint en prop, donc il n'a pas besoin de remonter l'événement.
- [`Creator.vue`](../components/blueprint/Creator.vue) : supprimer `@panned="c => applyPanning(c)"` et la fonction `applyPanning`.

Conséquence : un pan ne passe plus par `onSaveRequest`, donc plus par la validation du formulaire. Pour un simple déplacement de la vue, c'est le comportement voulu : un formulaire incomplet ne doit pas empêcher de sauvegarder la position. **À confirmer.**

#### Vérifications

Automatiques :

- [ ] `npx vitest run features` est vert ;
- [ ] `npx tsc --noEmit -p .` ne signale aucune nouvelle erreur ;
- [ ] les commandes de vérification des dépendances ne renvoient rien ;
- [ ] `grep -rn "panned" components pages` ne renvoie plus rien (hors `components/stage/Index.vue`, l'ancien stage, non concerné).

Manuelles, dans le navigateur, onglet réseau ouvert, sur l'onglet Structure de l'éditeur de blueprints :

- [ ] un pan suivi d'un rechargement de la page conserve la position ;
- [ ] la requête `PUT /proxy/blueprints/:id` ne contient que `x`, `y`, `scale` et les tokens ;
- [ ] un clic sans déplacement ne déclenche aucune requête ;
- [ ] en mode création, avant la première sauvegarde, un pan ne déclenche aucune requête ;
- [ ] avec un token invalide, un pan renvoie vers `/` ;
- [ ] l'onglet Appearance fonctionne toujours (il n'écoute aucun événement de pan) ;
- [ ] le pan du synthétiseur fonctionne toujours.

Commit : `feat(blueprints): save the blueprint viewport on pan through the shared core`.

## Après cette migration

- **Zoom** : le futur process `zoom` s'écrit directement selon ce modèle. `features/viewports` porte le calcul et le jugement, avec la question du debounce. Chaque domaine ajoute une fine couche qui produit son effet.
- **`sp-stage`** : une fois le blueprint migré, plus personne n'écoute `panned`. Le calcul du drag peut alors migrer à son tour vers un process `drag` sans effet dans `features/viewports`.

## Points à trancher

- ~~**API blueprints** : mise à jour partielle acceptée ou non (étape 4.1).~~ Tranché : la mise à jour partielle est acceptée (voir l'étape 4.1).
- **Validation du formulaire** : la contourner pour la sauvegarde du viewport (étape 4.4).
- **Emplacement du module** : `features/viewports` est proposé plutôt que `features/shared/viewports`, parce qu'il a son propre découpage core/shell, comme une feature. Si `shared` doit regrouper tout ce qui est transverse, les deux emplacements fonctionnent.
- **Couche HTTP dans `shared`** : elle y introduit du code shell. L'autre solution serait un module `features/http`. Le choix n'a pas d'impact sur le reste du plan.

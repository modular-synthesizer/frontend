# Migration du zoom vers l'architecture FCIS

Ce document décrit la migration du zoom de la vue vers `features/`, sur le modèle du pan et du reset. On commence par le zoom du synthétiseur. Le zoom de l'éditeur de blueprints suivra, sur le même core.

Statut : **proposition**, rien n'est implémenté.

## Prérequis

Le partage du core des viewports entre synthétiseurs et blueprints est terminé et mergé (`1295e14`, #128). Son plan reste consultable avec `git show 1295e14:docs/MIGRATION.md`.

Référence de tests au départ : `npx vitest run features` donne **93 tests** verts.

## Constat

### Le zoom aujourd'hui

- [`components/sp/stage/Index.vue`](../components/sp/stage/Index.vue), `onwheel` : à chaque événement `wheel`, le stage calcule le nouveau scale avec `zoom(innerTarget.value, $event)` ([`utils/functions/geometry.ts`](../utils/functions/geometry.ts)). Il modifie directement `innerTarget.value.scale`, c'est-à-dire le synthétiseur lui-même, puis émet `zoom(scale)`.
- Le calcul est le suivant : `Math.abs(scale + deltaY * -ZOOM_RATIO)`, borné entre `MAX_ZOOM_OUT` (0.5) et `MAX_ZOOM_IN` (2). Les constantes se trouvent dans [`utils/constants.ts`](../utils/constants.ts), avec `ZOOM_RATIO = 0.005`.
- Dans [`pages/synthesizers/[id].vue`](../pages/synthesizers/[id].vue), `@zoom="onzoom"` réécrit la même valeur dans `synthesizer.scale`. **Rien n'est sauvegardé.**
- Depuis la migration du pan, le scale n'est sauvegardé que si un pan avec déplacement suit le zoom, car l'effet de pan contient le viewport complet. C'était la « régression temporaire acceptée » de cette migration : un zoom suivi d'un simple clic ne sauvegarde plus rien.
- L'éditeur de blueprints n'écoute pas `zoom`. Il dépend uniquement du fait que le stage modifie le scale en direct.

### Un défaut dans le calcul actuel

Le `Math.abs` produit un résultat faux quand on dézoome fortement. Par exemple, avec un scale de 0.5 et un `deltaY` de 400 : `0.5 - 2 = -1.5`, puis `abs` donne `1.5`. **Un fort dézoom produit donc un zoom avant.** La borne inférieure ne protège pas de ce cas, puisque l'`abs` est appliqué avant elle. Le nouveau core ne reprendra pas ce `abs` (voir « Points à trancher »).

### La vraie difficulté : quand sauvegarder ?

Le pan a une fin naturelle, le `mouseup`. Le zoom n'en a pas : une molette envoie des dizaines d'événements `wheel` par seconde, sans événement de fin. Sauvegarder à chaque événement enverrait des dizaines de requêtes par seconde. Il faut donc attendre que l'utilisateur s'arrête, c'est-à-dire **différer la sauvegarde** (debounce).

## Décisions de conception

### 1. Le core calcule à chaque événement, le shell gère le délai

- **Le core est appelé à chaque événement `wheel`.** Il calcule le nouveau scale (borné) et indique s'il a changé. Il reste pur : il ne connaît ni le temps, ni les timers.
- **Le délai avant la sauvegarde est une affaire de temps, donc de shell.** Un runner d'effets « différé » regroupe les effets reçus pendant le délai et n'exécute que le dernier.
- L'affichage, lui, est mis à jour immédiatement, à chaque événement, par `applyViewport`.

Alternative écartée : un événement `zoomReleased` émis par le stage après une période d'inactivité, sur le modèle de `panReleased`. Le stage, un composant legacy, porterait alors une règle temporelle impossible à tester, et la page devrait garder le scale de départ entre deux événements.

### 2. Un effet dédié qui ne sauvegarde que le scale

Le zoom produit un nouvel effet, `synthesizers.scale.save`, qui envoie **seulement `scale`**. Il ne réutilise pas `synthesizers.viewport.save`.

Pourquoi : avec un effet contenant le viewport complet, un zoom suivi rapidement d'un pan provoquerait une course entre les deux sauvegardes.

1. Le pan sauvegarde immédiatement `{ nouvelle position, scale }`.
2. Le zoom différé part 500 ms plus tard avec `{ ancienne position, scale }`, et **écrase la nouvelle position**.

Avec un effet limité au scale, les deux sauvegardes ne se marchent plus dessus. L'API accepte un corps partiel : `services/synthesizers.rb` fait `membership.update!(**payload.slice(:x, :y, :scale))`.

### 3. Un runner différé générique et testable

L'ancien `composables/debounce.ts` n'est pas réutilisé, pour trois raisons :

- il repose sur un dictionnaire global partagé par tout le front ;
- il appelle directement `setTimeout`, ce qui le rend impossible à tester sans faux timers ;
- il utilise le type `Function`.

Le nouveau runner reçoit en paramètre un **planificateur** (`schedule`, `cancel`), injecté comme `put` l'est dans `makeRunEffect`. Il est générique sur le type d'effet, ce qui permettra au zoom du blueprint de le réutiliser tel quel.

## Organisation cible

```
features/
  shared/
    effects/debounce.ts                  ← nouveau : runner différé générique (shell)
  viewports/
    core/shared/Constants.ts             ← + ZOOM_RATIO, MIN_SCALE, MAX_SCALE
    core/shared/viewport.ts              ← + clampScale
    core/processes/zoom.process.ts       ← nouveau : zoomViewport (calcul pur, sans effet)
  synthesizers/
    core/data/Effect.type.ts             ← + synthesizers.scale.save
    core/processes/synthesizers/zoom.process.ts   ← nouveau : produit l'effet
    shell/api/saveScale.http.ts          ← nouveau : PUT { scale }
    shell/effect.ts                      ← + case synthesizers.scale.save
    shell/legacy/viewport.adapter.ts     ← + makeZoomSynthesizer, zoomSynthesizer
components/sp/stage/Index.vue            ← + événement zoomRequested
pages/synthesizers/[id].vue              ← @zoom-requested au lieu de @zoom
```

Les règles de dépendance du plan précédent s'appliquent sans changement. Chaque étape se vérifie avec :

```sh
grep -rn "features/synthesizers\|\.\./synthesizers" features/viewports features/blueprints features/shared
grep -rn "features/blueprints\|\.\./blueprints" features/viewports features/synthesizers features/shared
grep -rn "/shell/" features/*/core
```

Ces trois commandes ne doivent rien renvoyer.

## Étapes

Chaque étape correspond à un commit. Les tests de mutation se font sur une copie, jamais sur les fichiers de travail.

### 1. Core partagé : `zoomViewport`

Objectif : déplacer le calcul du zoom dans `features/viewports/core`, sous une forme pure et testée.

#### Constantes

Dans `features/viewports/core/shared/Constants.ts`, ajouter `ZOOM_RATIO` (0.005), `MIN_SCALE` (0.5) et `MAX_SCALE` (2). Ces noms décrivent des bornes de scale, ce qui est plus clair que `MAX_ZOOM_OUT` et `MAX_ZOOM_IN`.

Les constantes de `utils/constants.ts` restent en place : l'ancien calcul du stage les utilise encore pour le blueprint. Elles seront supprimées lors de la migration du zoom du blueprint.

#### Fonction partagée

Dans `features/viewports/core/shared/viewport.ts` :

```ts
export const clampScale = (scale: number): number => Math.min(Math.max(MIN_SCALE, scale), MAX_SCALE)
```

#### Process

```ts
// features/viewports/core/processes/zoom.process.ts
export type ZoomViewportFct = (from: Viewport, deltaY: number) => ViewportChange

export const zoomViewport: ZoomViewportFct = (from, deltaY) => {
  const scale = clampScale(from.scale - deltaY * ZOOM_RATIO)
  return {
    viewport: { position: { x: from.position.x, y: from.position.y }, scale },
    changed: scale !== from.scale
  }
}
```

- Le process reçoit le `deltaY` brut de l'événement, et non l'événement lui-même : le core ne connaît pas le DOM.
- La position est copiée, jamais partagée, pour la même raison que pour le pan.
- `changed` est faux quand on est déjà en butée. Zoomer au-delà de `MAX_SCALE` ne déclenche donc aucune sauvegarde.

#### Tests

Fichiers : `features/viewports/core/shared/__tests__/viewport.test.ts` (pour `clampScale`) et `features/viewports/core/processes/__tests__/zoom.test.ts`.

- [ ] `clampScale` : une valeur dans les bornes est inchangée ; une valeur sous `MIN_SCALE` donne `MIN_SCALE` ; une valeur au-dessus de `MAX_SCALE` donne `MAX_SCALE` ; les bornes elles-mêmes sont inchangées ;
- [ ] `deltaY` négatif : le scale augmente de `-deltaY * ZOOM_RATIO`, et `changed` vaut `true` ;
- [ ] `deltaY` positif : le scale diminue, et `changed` vaut `true` ;
- [ ] `deltaY` nul : `changed` vaut `false` ;
- [ ] en butée haute (scale à `MAX_SCALE`, `deltaY` négatif) : le scale reste `MAX_SCALE`, et `changed` vaut `false`. Même chose en butée basse ;
- [ ] **le défaut de l'`abs`** : avec un scale de 0.5 et un `deltaY` de 400, le scale reste 0.5. Avec l'ancien calcul, il passait à 1.5 ;
- [ ] la position est conservée et le viewport renvoyé ne partage pas sa référence avec `from.position` ;
- [ ] le process fonctionne avec un viewport gelé (`Object.freeze`).

Choisir des valeurs exactement représentables en binaire (par exemple un `deltaY` de -100 depuis un scale de 1, qui donne 1.5), pour que `toEqual` ne soit pas piégé par les arrondis.

#### Vérifications

- [ ] `npx vitest run features` est vert ;
- [ ] `npx tsc --noEmit -p .` ne signale aucune erreur ;
- [ ] les commandes de vérification des dépendances ne renvoient rien ;
- [ ] mutations à vérifier :
  - le `clampScale` retiré ;
  - le `abs` réintroduit ;
  - le signe de `deltaY` inversé ;
  - `changed` forcé à `true` ;
  - la position partagée au lieu d'être copiée.

Commit : `feat(viewports): add the shared zoom computation`.

### 2. Core du synthétiseur : effet `synthesizers.scale.save` et process `zoom`

#### Effet

```ts
// features/synthesizers/core/data/Effect.type.ts
export type SynthesizersEffect = Effect & (
  | { type: "synthesizers.viewport.save", id: Uuid, viewport: Viewport }
  | { type: "synthesizers.scale.save", id: Uuid, scale: number }
)
```

L'ajout de ce cas fait échouer tsc dans `features/synthesizers/shell/effect.ts`, grâce à `assertNever`, tant que l'étape 3 n'est pas faite. C'est le comportement attendu : **les étapes 2 et 3 vont dans le même commit**, ou bien l'étape 3 doit suivre immédiatement.

#### Process

```ts
// features/synthesizers/core/processes/synthesizers/zoom.process.ts
export type ZoomFct = (id: Uuid, from: Viewport, deltaY: number) => { viewport: Viewport, effects: SynthesizersEffect[] }

export const zoom: ZoomFct = (id, from, deltaY) => {
  const { viewport, changed } = zoomViewport(from, deltaY)
  return { viewport, effects: changed ? [ { type: "synthesizers.scale.save", id, scale: viewport.scale } ] : [] }
}
```

#### Tests

Sur le modèle des tests de `pan` du synthétiseur, en comparant le résultat complet avec `toEqual` :

- [ ] un zoom qui change le scale produit exactement un effet `synthesizers.scale.save`, avec le bon `id` et le nouveau scale, et **sans position** ;
- [ ] un zoom en butée ne produit aucun effet.

#### Vérifications

- [ ] vitest, tsc et les commandes de vérification des dépendances ;
- [ ] mutations :
  - effet toujours produit, ou jamais produit ;
  - `id` constant ;
  - `scale` de l'effet remplacé par `from.scale` ;
  - type d'effet remplacé par `synthesizers.viewport.save`.

### 3. Shell du synthétiseur : `saveScale` et `runEffect`

- `features/synthesizers/shell/api/saveScale.http.ts`, calqué sur `saveViewport.http.ts`, qui fait un `PUT /proxy/synthesizers/${id}` avec le corps `{ scale }` ;
- dans `features/synthesizers/shell/effect.ts`, un `case "synthesizers.scale.save"` qui appelle `saveScale(put)(effect.id, effect.scale)`, puis `.or(undefined)`.

#### Tests

- [ ] `saveScale.http.ts` : seul `scale` est envoyé, à la bonne URL, et une erreur HTTP est propagée ;
- [ ] `effect.test.ts` : l'effet `synthesizers.scale.save` envoie une seule requête vers la bonne URL, avec `{ scale }`, et se résout avec `undefined` ;
- [ ] `effect.test-d.ts` : le runner accepte `synthesizers.scale.save` (avec `toBeCallableWith`, sans exécuter l'appel).

Commit, avec l'étape 2 : `feat(synthesizers): save the synthesizer scale through a dedicated effect`.

### 4. Shell partagé : runner différé

Objectif : n'exécuter que le dernier effet reçu pendant un délai, par synthétiseur.

```ts
// features/shared/effects/debounce.ts
export type Scheduler = { schedule: (callback: () => void, delay: number) => unknown, cancel: (handle: unknown) => void }

export type DebounceOptions<E extends Effect> = { delay: number, keyOf: (effect: E) => string, scheduler: Scheduler }

export const makeDebouncedRun = <E extends Effect>(run: RunEffectFct<E>, options: DebounceOptions<E>): RunEffectFct<E> => …
```

- **Une clé par effet** (`keyOf`), par exemple `${effect.type}:${effect.id}`. Deux synthétiseurs ne s'annulent pas entre eux, et le pan, qui passe par le runner direct, n'est jamais retardé.
- **Le dernier effet l'emporte** : chaque nouvel effet de même clé annule le précédent et relance le délai.
- **La promesse renvoyée se résout immédiatement**, sans attendre l'exécution différée. Sinon, `applyFacts` resterait bloqué pendant toute la durée du délai.
- **Toutes les erreurs de l'exécution différée sont ignorées** (décision prise). Le runner intercepte toute exception levée par `run` et l'abandonne, sans la journaliser. Les erreurs HTTP sont déjà absorbées par `runEffect`, donc seule une exception levée par `put` est concernée. Cette interception est quand même obligatoire : sans elle, l'exception donnerait un rejet de promesse non géré, puisque plus personne n'attend l'exécution différée.
- **Pas de sauvegarde en quittant la page** (décision prise). Si l'utilisateur quitte la page pendant le délai, la sauvegarde en attente est perdue. Le runner n'a donc pas de méthode `flush`, et la page n'a rien à faire dans `onBeforeUnmount`. On perd au plus les 500 dernières millisecondes de zoom.
- Le planificateur de production est `{ schedule: setTimeout, cancel: clearTimeout }`, et le délai est de **500 ms**, comme les autres sauvegardes différées du front (`knob/Wrapper.vue`, `blueprint/Structure/Node/List.vue`).

#### Tests

Avec un faux planificateur, qui enregistre les callbacks et permet de les déclencher à la main. On évite ainsi les faux timers de vitest.

- [ ] un effet seul n'est pas exécuté immédiatement, puis l'est une fois le délai écoulé ;
- [ ] trois effets de même clé : seul le dernier est exécuté, une seule fois ;
- [ ] deux effets de clés différentes : les deux sont exécutés ;
- [ ] la promesse renvoyée se résout avant l'exécution de l'effet ;
- [ ] une exception levée par `run` pendant l'exécution différée est ignorée : aucun rejet non géré, et un effet suivant de même clé est toujours exécuté normalement ;
- [ ] le délai transmis au planificateur est bien celui des options.

#### Vérifications

- [ ] vitest, tsc et les commandes de vérification des dépendances ;
- [ ] mutations :
  - l'effet précédent n'est plus annulé ;
  - la clé est ignorée ;
  - l'exécution est immédiate ;
  - l'erreur n'est plus interceptée.

Commit : `feat(shared): add a debounced effect runner`.

### 5. Adapter legacy du synthétiseur

```ts
// features/synthesizers/shell/legacy/viewport.adapter.ts
export const debouncedApplyFacts: FactsApplier<SynthesizersEffect> = makeApplyFacts(
  makeDebouncedRun(runEffect, { delay: 500, keyOf: e => `${e.type}:${e.id}`, scheduler: timeoutScheduler })
)

export const makeZoomSynthesizer: ZoomSynthesizerFactory = apply =>
  async (synth, from, deltaY) => {
    const facts = zoom(synth.id as Uuid, { ...toViewport(synth), scale: from }, deltaY)
    await apply(synth, facts)
  }

export const zoomSynthesizer = makeZoomSynthesizer(debouncedApplyFacts)
```

**Le point délicat est le même que pour le pan.** Quand l'adapter est appelé, le stage a déjà modifié le scale du synthétiseur avec l'ancien calcul. `toViewport(synth)` renvoie donc le scale **d'arrivée**. Il faut le remplacer par le scale de départ, `from`, que le stage transmet. Sans ce remplacement, `zoom` partirait d'un scale déjà zoomé, et chaque cran de molette compterait double.

`applyViewport` réécrit ensuite le scale calculé par le core. C'est donc lui qui l'emporte sur le calcul du stage, ce qui corrige au passage le défaut de l'`abs` pour le synthétiseur.

#### Tests

- [ ] un zoom qui change le scale : `apply` est appelé une seule fois, avec le même synthétiseur (`toBe`) et les bons faits (`toEqual`) ;
- [ ] un zoom en butée : `apply` reçoit des faits sans effet ;
- [ ] **le point délicat** : le synthétiseur de test est placé là où le stage le laisse, c'est-à-dire avec le scale déjà modifié. On vérifie que le calcul part bien de `from`. Ce test doit échouer si l'adapter utilise `toViewport(synth)` sans remplacer le scale ;
- [ ] une erreur de `apply` est propagée.

Commit : `feat(synthesizers): add the zoomSynthesizer adapter`.

### 6. Stage et page

#### Stage

Dans [`components/sp/stage/Index.vue`](../components/sp/stage/Index.vue), ajouter un événement `zoomRequested`, à côté de `zoom` :

```ts
type Emits = {
  zoom: [ number ],
  zoomRequested: [ from: number, deltaY: number ],
  panReleased: [ from: Coordinates, to: Coordinates ]
}

function onwheel($event: WheelEvent) {
  const from = innerTarget.value.scale
  const zoomValue: number = zoom(innerTarget.value, $event)
  innerTarget.value.scale = zoomValue;
  emit('zoom', zoomValue)
  emit('zoomRequested', from, $event.deltaY)
}
```

- Le scale de départ est **lu avant** la modification.
- `zoom` et la modification en direct ne changent pas : l'éditeur de blueprints en dépend encore. Ils seront supprimés lors de la migration du zoom du blueprint, avec `utils/functions/geometry.ts#zoom` et les constantes de `utils/constants.ts`.

#### Page

Dans [`pages/synthesizers/[id].vue`](../pages/synthesizers/[id].vue) :

- remplacer `@zoom="onzoom"` par `@zoom-requested="(from, deltaY) => zoomSynthesizer(synthesizer, from, deltaY)"` ;
- supprimer la fonction `onzoom` ;
- importer `zoomSynthesizer` à côté de `panSynthesizer` et `resetSynthesizer`.

#### Vérifications

Automatiques :

- [ ] vitest, tsc et les commandes de vérification des dépendances ;
- [ ] `grep -rn "onzoom" pages components` ne renvoie plus rien.

Manuelles, dans le navigateur, onglet réseau ouvert :

- [ ] un mouvement de molette continu déclenche **une seule** requête `PUT /proxy/synthesizers/:id`, environ 500 ms après l'arrêt, avec seulement `scale` et les tokens ;
- [ ] un zoom suivi d'un rechargement de la page conserve le scale ;
- [ ] un zoom en butée haute ou basse ne déclenche aucune requête ;
- [ ] un fort dézoom ne produit plus de zoom avant (défaut de l'`abs`) ;
- [ ] **un zoom suivi immédiatement d'un pan**, puis un rechargement : la position et le scale sont tous les deux conservés ;
- [ ] le pan et le reset du synthétiseur fonctionnent toujours ;
- [ ] le zoom de l'éditeur de blueprints fonctionne toujours à l'affichage. Il n'est toujours pas sauvegardé seul, ce qui est hors périmètre ;
- [ ] avec un token invalide, un zoom renvoie vers `/` une fois le délai écoulé.

Commit : `feat(synthesizers): save the zoom through the FCIS feature`.

## Après cette migration

- **Zoom de l'éditeur de blueprints** : il réutilise `zoomViewport` et `makeDebouncedRun` tels quels. Il ajoute un effet `blueprints.scale.save`, un process `zoom` qui gère l'absence d'`id` comme le pan, `saveScale` vers `/proxy/blueprints/:id`, et un adapter `zoomBlueprint`. `Structure/Index.vue` écoute `@zoom-requested`. Ensuite, on supprime l'ancien calcul du stage, l'événement `zoom`, `utils/functions/geometry.ts#zoom` et les constantes de `utils/constants.ts`.
- **Fin de la régression du pan** : une fois le zoom sauvegardé seul, un zoom suivi d'un simple clic est de nouveau persisté.

## Points à trancher

- **Correction du défaut de l'`abs`.** Le plan le corrige dans le core, ce qui change le comportement visible : un fort dézoom reste en butée basse au lieu de rezoomer. C'est un correctif, mais il faut le valider.
- **Délai du debounce.** Le plan propose 500 ms, comme les autres sauvegardes différées du front. Puisque rien n'est sauvegardé en quittant la page, une valeur plus courte réduit ce qu'on peut perdre.
- **Zoom centré sur le curseur.** Aujourd'hui, le zoom se fait autour de l'origine du stage, et non autour du curseur. Garder ce comportement est hors périmètre. Le core pourrait l'accueillir plus tard, en recevant la position du curseur et en ajustant la position du viewport.

## Décisions prises

- **Pas de sauvegarde du zoom en attente quand l'utilisateur quitte la page.** La perte est limitée au délai du debounce, et le runner reste simple : pas de `flush`, pas de `onBeforeUnmount`.
- **Toutes les erreurs de sauvegarde du zoom sont ignorées**, sans journalisation. Les erreurs HTTP sont déjà absorbées par `runEffect`, et les exceptions sont interceptées et abandonnées par le runner différé. Un token invalide déconnecte quand même l'utilisateur, car `withAuthenticationGuard` réinitialise la session avant de renvoyer l'erreur, que celle-ci soit ensuite ignorée ou non.

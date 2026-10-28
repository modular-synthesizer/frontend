# Migration du pan du synthétiseur vers l'architecture FCIS

Ce document décrit la migration du déplacement de la vue (pan) d'un synthétiseur vers `features/synthesizers`, sur le modèle de la réinitialisation de la vue (`reset`).

## Objectif

À la fin d'un pan, la décision de sauvegarder ou non est prise dans le core. La sauvegarde passe ensuite par l'effet `synthesizers.viewport.save` déjà existant.

Effets attendus :

- seuls `x`, `y` et `scale` sont envoyés à l'API, au lieu du synthétiseur entier ;
- un clic sans déplacement ne déclenche plus de requête ;
- une session expirée pendant un pan déconnecte l'utilisateur, grâce à `withAuthenticationGuard`.

## État actuel

- [`components/sp/stage/Index.vue`](../components/sp/stage/Index.vue) calcule le déplacement pendant le drag. Il modifie directement l'objet `target`, qui est le synthétiseur lui-même, puis émet `panned` au `mouseup`.
- Ce composant est partagé avec l'éditeur de blueprints ([`Structure/Index.vue`](../components/blueprint/Structure/Index.vue), [`Appearance/Index.vue`](../components/blueprint/Appearance/Index.vue)).
- Dans [`pages/synthesizers/[id].vue`](../pages/synthesizers/[id].vue), `@panned` appelle `repositories.synthesizers.update(synthesizer)`. Cette méthode fait un `api_put` de l'objet complet ([`Repository.ts:33`](../lib/repositories/utils/Repository.ts)).
- `panned` est émis à chaque `mouseup` qui suit un `mousedown`, même sans déplacement.

**Conséquence importante.** Quand `panned` est émis, le synthétiseur a déjà été modifié. La position de départ est perdue, donc il est impossible de savoir s'il y a eu un déplacement. Il faut transmettre cette position de départ : c'est l'étape 2.

## Étapes

### 1. Core : process `pan` — ✅ fait

Fichier : `features/synthesizers/core/processes/synthesizers/pan.process.ts`

```ts
export type PanFct = (id: Uuid, from: Viewport, to: Position) => { viewport: Viewport, effects: SynthesizersEffects[] }
```

- Le viewport renvoyé contient une **copie** de `to` et le scale de départ : `{ position: { x: to.x, y: to.y }, scale: from.scale }`. Le pan ne modifie jamais le scale. Ce même viewport sert à l'effet.
- L'effet `synthesizers.viewport.save` n'est produit que si `to` diffère de `from.position`.

Les comparaisons sont regroupées dans `features/synthesizers/core/shared/viewport.ts` :

- `positionsDiffer`, utilisé par `pan` ;
- `viewportsDiffer`, qui ajoute la comparaison du scale ;
- `isDefaultViewport`, qui remplace la fonction `isDefault` locale de `reset`.

Le futur process `zoom` pourra s'appuyer sur ce module.

Tests de `pan` (`__tests__/pan.test.ts`) :

- [x] un déplacement sur X seulement, puis sur Y seulement, produit un effet. Ces deux cas suffisent, le cas « deux axes » n'apporte rien de plus ;
- [x] une position inchangée ne produit aucun effet ;
- [x] le scale de départ est conservé dans le viewport et dans l'effet ;
- [x] le process fonctionne avec un viewport de départ gelé (`Object.freeze`) ;
- [x] le viewport renvoyé ne partage pas sa référence avec `to`. Le stage modifie l'objet en direct, donc le core doit copier la position.

Tests du module `viewport` (`core/shared/__tests__/viewport.test.ts`) :

- [x] chaque fonction est testée directement, avec un écart sur X seul, sur Y seul, sur le scale seul (sauf `positionsDiffer`, qui ne compare pas le scale) et un cas d'égalité.

Les tests de `reset` restent inchangés et verts après le passage à `isDefaultViewport`.

### 2. Shell : émettre `panReleased(from, to)` depuis `sp-stage` — ✅ fait

#### Principe : déplacer pendant le drag, ne sauvegarder qu'au relâchement

Un pan se déroule en deux phases, qu'il faut traiter différemment.

| Phase | Événement | Ce qui se passe | Core appelé | Sauvegarde |
|---|---|---|---|---|
| Début | `mousedown` sur le fond du stage | Mémorisation d'une copie de la position de départ de la cible | Non | Non |
| Déplacement | chaque `mousemove` | Le stage modifie `x` et `y` de la cible pour que l'affichage suive la souris | Non | Non |
| Fin | `mouseup` ou `mouseleave` | Émission de `panned(cible)`, inchangé, puis de `panReleased(départ, arrivée)` | Oui, `pan`, à partir de l'étape 4 | Seulement si la position a changé |

Les positions intermédiaires ne sont qu'un état d'affichage temporaire. Ce ne sont pas des faits métier. Ce découpage existe déjà dans `sp-stage` : le callback `dragged` modifie la cible à chaque `mousemove`, et le callback `dropped` n'est appelé qu'au relâchement. Cette étape **conserve** ce découpage et ajoute un événement de fin qui porte le départ et l'arrivée.

Pourquoi ne pas appeler le core à chaque `mousemove` :

- `pan` produirait un effet de sauvegarde à chaque mouvement, soit des dizaines de requêtes par seconde ;
- la seule décision métier, « faut-il sauvegarder ? », ne peut être prise qu'en connaissant le départ et l'arrivée, donc à la fin ;
- le calcul du déplacement (décalage, division par le scale) vit dans `sp-stage` et sert aussi à l'éditeur de blueprints. Le migrer sort du périmètre.

Évolution possible plus tard, lors de la migration du calcul du drag : un process `drag` sans effet, appelé à chaque `mousemove`, qui renverrait seulement le viewport à afficher. `pan` resterait le seul process à produire un effet.

#### Ce qui a été fait dans [`components/sp/stage/Index.vue`](../components/sp/stage/Index.vue)

1. Un **nouvel événement** `panReleased`, à côté de `panned`, avec deux positions nommées dans l'ordre du core :
   ```ts
   type Emits = {
     zoom: [ number ],
     panned: [ Coordinates ],
     panReleased: [ from: Coordinates, to: Coordinates ]
   }
   ```
   `panned` n'est pas modifié, pour ne prendre aucun risque sur l'éditeur de blueprints.
2. Au `mousedown`, une **copie** de la position de la **cible**, pas de la souris :
   ```ts
   start.value = { x: innerTarget.value.x, y: innerTarget.value.y }
   ```
3. Au relâchement, les deux événements sont émis. L'arrivée est elle aussi une copie de la cible, pas l'objet vivant :
   ```ts
   dropped(() => {
     emit('panned', innerTarget.value)
     emit('panReleased', start.value, { x: innerTarget.value.x, y: innerTarget.value.y })
   });
   ```
4. Le calcul du drag (`event`, `originOffset`, callback `dragged`) et `onmouseup` sont **strictement inchangés**.

Deux erreurs à éviter, rencontrées pendant l'implémentation :

- copier `getCoords($event)` au lieu de la position de la cible. On compare alors la souris au départ avec la cible à l'arrivée, et un clic sans déplacement déclenche une sauvegarde ;
- lire `$event` dans le callback `dropped`. C'est l'événement du `mousedown`, capturé par la fermeture, pas celui du relâchement.

#### Cas limites, vérifiés dans le code

- **Clic sans déplacement.** `panReleased` est émis avec `from` égal à `to`. C'est le core (`positionsDiffer`) qui décide de ne pas sauvegarder, pas le stage. Le stage reste sans logique métier.
- **La souris sort du stage pendant le drag.** `@mouseleave` appelle `onmouseup`, donc les deux événements sont émis et la position est sauvegardée. Les callbacks sont ensuite réinitialisés, donc un `mouseup` plus tard ne déclenche pas une seconde émission.
- **Drag d'un module.** [`Draggable.vue`](../components/sp/stage/Draggable.vue) écoute `@mousedown.prevent.stop`. Le `onmousedown` du stage n'est donc pas appelé, `start` n'est pas modifié et le callback `dropped` est celui du module. Aucun événement de pan n'est émis.
- **Pendant le drag, le synthétiseur est modifié en direct.** `innerTarget` enveloppe la même instance que `synthesizer` dans la page. L'affichage suit donc la souris sans passer par la page. À l'étape 3, `applyViewport` réécrit les mêmes valeurs, ce qui est sans effet.

#### Compatibilité avec les autres utilisateurs du stage

- [`blueprint/Structure/Index.vue`](../components/blueprint/Structure/Index.vue) et [`Creator.vue`](../components/blueprint/Creator.vue) écoutent `panned`, qui n'a pas changé. Le blueprint continue de sauvegarder à chaque relâchement, y compris sans déplacement. C'est hors périmètre.
- [`blueprint/Appearance/Index.vue`](../components/blueprint/Appearance/Index.vue) n'écoute aucun événement de pan.
- [`pages/synthesizers/[id].vue`](../pages/synthesizers/[id].vue) écoute encore `panned` jusqu'à l'étape 4.

Personne n'écoute `panReleased` pour l'instant. Ce commit ne change donc pas le comportement visible.

Le prix de ce choix : un même relâchement émet deux événements, et ce sera le cas tant que le blueprint utilisera `panned`. Quand le pan du blueprint sera migré à son tour, `panned` pourra être supprimé.

#### Vérifications

Le repo n'a ni `@vue/test-utils` ni environnement DOM configuré pour vitest. Cette étape se vérifie donc à la main, avec un `@pan-released="(from, to) => console.log(from, to)"` temporaire dans la page et l'onglet réseau ouvert :

- [ ] après un clic sans déplacement, `from` et `to` sont égaux ;
- [ ] après un pan, `to` correspond à la nouvelle position du synthétiseur ;
- [ ] pendant un pan, l'affichage suit la souris et **aucune requête** ne part pendant le mouvement ;
- [ ] un drag de module ne déclenche aucun événement de pan ;
- [ ] le pan de l'éditeur de blueprints (onglet Structure) fonctionne et sauvegarde toujours.

Alternatives écartées :

- un second argument ajouté à `panned` : il était aussi compatible, mais modifiait un événement partagé avec le blueprint ;
- un événement `pan-started` écouté par la page : plus verbeux, et il laisse à la page la responsabilité de garder un état entre deux événements, alors que le stage connaît déjà le début du drag.

### 3. Shell : adapter `panSynthesizer` — ✅ fait

Fichier : [`features/synthesizers/shell/legacy/viewport.adapter.ts`](../features/synthesizers/shell/legacy/viewport.adapter.ts), à côté de `resetSynthesizer`.

#### Rôle

L'adapter fait le lien entre le monde legacy (l'objet `Synthesizer` de `~/types`, modifié en direct par le stage) et le core (`Viewport`, `Position`, effets). Il ne prend **aucune décision** : c'est `pan` qui décide s'il faut sauvegarder.

#### Ce qui a été fait

Les deux adapters, `reset` et `pan`, reposent sur une même brique : appliquer les faits renvoyés par le core.

```ts
export type ViewportFacts = { viewport: Viewport, effects: SynthesizersEffects[] }

export type FactsApplier = (synth: Synthesizer, facts: ViewportFacts) => Promise<void>

export const makeApplyFacts: FactsApplierFactory = run => async (synth, { viewport, effects }) => {
  applyViewport(synth, viewport)
  await Promise.all(effects.map(run))
}

export const applyFacts: FactsApplier = makeApplyFacts(runEffect)
```

- **Le viewport est appliqué avant les effets.** L'affichage garde donc la nouvelle position même si la sauvegarde échoue.
- **Les erreurs des effets remontent** jusqu'à l'appelant (`await`). En production, `runEffect` les absorbe déjà, mais l'adapter ne les perd pas.

L'adapter de pan reçoit un `FactsApplier`, sur le modèle de `makeRunEffect(put)` :

```ts
export type PanSynthesizerFct = (s: Synthesizer, from: Position, to: Position) => Promise<void>

export const makePanSynthesizer: PanSynthesizerFactory = apply =>
  async (synth, from, to) => {
    const facts = pan(synth.id as Uuid, { ...toViewport(synth), position: from }, to)
    await apply(synth, facts)
  }

export const panSynthesizer = makePanSynthesizer(applyFacts)
```

- **L'ordre est `(from, to)`**, le même que pour `panReleased` et `pan(id, from, to)`.
- **Le point délicat : le viewport de départ.** Quand l'adapter est appelé, le stage a déjà déplacé le synthétiseur. `toViewport(synth)` renvoie donc la position d'**arrivée**, et il faut la remplacer par `from`. Sans ce remplacement, `pan` comparerait l'arrivée avec elle-même et ne sauvegarderait jamais.
- **Le scale vient du synthétiseur**, puisqu'un pan ne le modifie pas.

Changement hors du périmètre initial : `resetSynthesizer` suit le même modèle (`makeResetSynthesizer(applyFacts)`), ce qui le rend testable. Les noms exportés `resetSynthesizer` et `panSynthesizer` ne changent pas, donc la page n'a rien à modifier pour `reset`.

#### Tests

Fichier : `features/synthesizers/shell/legacy/__tests__/viewport.test.ts`. Les faux remplacent le `run` (pour `applyFacts`) ou le `FactsApplier` (pour les adapters) et enregistrent ce qu'ils reçoivent.

- [x] `toViewport` et `applyViewport` : chaque champ est vérifié avec des valeurs non triviales ;
- [x] `applyFacts` : le viewport est appliqué avec ou sans effet, les effets sont exécutés, et l'erreur d'un effet remonte sans annuler l'application du viewport ;
- [x] `makeResetSynthesizer` : `apply` est appelé une seule fois (`toHaveLength(1)`), avec le même synthétiseur (`toBe`) et les bons faits (`toEqual`), avec ou sans effet ; une erreur de `apply` remonte ;
- [x] `makePanSynthesizer` : mêmes vérifications, plus le test du point délicat.

Le test du point délicat place le synthétiseur **là où le stage le laisse**, c'est-à-dire à la position `to`, avec un scale différent de 1. C'est indispensable : si le synthétiseur de test est placé à `from`, le test passe même quand l'adapter ne remplace pas la position. Vérifié par mutation : en remplaçant `{ ...toViewport(synth), position: from }` par `toViewport(synth)`, ce test échoue.

Les imports de `viewport.adapter.ts` fonctionnent dans vitest : les imports `~/…` ne servent qu'aux types, et `nuxt.http.ts` n'appelle `useSession` qu'au moment d'une requête.

### 4. Page : brancher l'adapter — ✅ fait

Dans [`pages/synthesizers/[id].vue`](../pages/synthesizers/[id].vue), l'écoute de `panned` est remplacée par celle de `panReleased` :

```vue
@pan-released="(from, to) => panSynthesizer(synthesizer, from, to)"
```

La ligne `@panned="repositories.synthesizers.update(synthesizer)"` est supprimée. `repositories` reste utilisé dans la page pour le chargement, donc son import reste.

#### Écart avec l'étape 2 : suppression de `panned`

Contrairement à ce que prévoyait l'étape 2, `panned` est supprimé dès cette étape :

- [`components/sp/stage/Index.vue`](../components/sp/stage/Index.vue) n'émet plus que `panReleased` au relâchement ;
- [`blueprint/Structure/Index.vue`](../components/blueprint/Structure/Index.vue) ne retransmet plus `panned`. Son type `Emits` déclare encore `panned`, mais l'événement n'est plus émis.

**Conséquence acceptée :** le pan de l'éditeur de blueprints ne sauvegarde plus. [`Creator.vue`](../components/blueprint/Creator.vue) écoute toujours `@panned` (`applyPanning`), mais ne le reçoit jamais. Cette régression est volontaire et sera corrigée plus tard, lors de la migration du pan du blueprint.

### 5. Vérifications

Automatiques :

- [x] `npx vitest run features/synthesizers` est vert (8 fichiers, 50 tests) ;
- [x] `npx tsc --noEmit -p .` ne signale aucune nouvelle erreur dans les fichiers modifiés. Les erreurs restantes (`inner_nodes/__tests__/create.test.ts`, `modules/createVoice*`) concernent des fichiers que cette migration ne touche pas.

Manuelles, dans le navigateur, onglet réseau ouvert :

- [ ] un pan suivi d'un rechargement de la page conserve la position ;
- [ ] la requête `PUT /proxy/synthesizers/:id` ne contient que `x`, `y`, `scale` et les tokens ;
- [ ] un clic sans déplacement ne déclenche aucune requête ;
- ~~le pan de l'éditeur de blueprints (Structure et Appearance) fonctionne toujours~~ : ne s'applique plus, le pan du blueprint est volontairement cassé (voir l'étape 4) ;
- [ ] avec un token invalide, un pan renvoie vers `/`.

## Points d'attention

- **Le zoom n'est plus sauvegardé lors d'un simple clic.** Aujourd'hui, le zoom n'est sauvegardé que grâce au `update` complet déclenché par `panned`, clic sans déplacement compris. Après la migration :
  - un pan **avec** déplacement sauvegarde toujours le scale courant, car l'effet contient le viewport complet ;
  - un zoom suivi d'un simple clic ne sauvegarde plus rien.

  Cette régression est temporaire et acceptée : elle disparaît avec la migration du zoom, qui sauvegardera lui-même le scale.
- **Les autres champs du synthétiseur ne sont plus envoyés.** Vérifier que rien ne comptait sur le `update` complet déclenché au pan pour sauvegarder un autre champ, par exemple le nom.
- **Le pan du blueprint ne sauvegarde plus.** `panned` a été supprimé du stage (voir l'étape 4). Cette régression est acceptée et sera corrigée lors de la migration du pan du blueprint.
- **L'objet vivant.** Pendant le drag, le stage modifie le synthétiseur lui-même. `panReleased` émet des copies, et le core copie aussi la position reçue (voir le test de l'étape 1). Aucune couche ne doit garder une référence vers la cible.

## Hors périmètre

- La migration du zoom, avec sa question de debounce. C'est la prochaine migration.
- Le calcul du drag dans `sp-stage`, qui reste dans le composant.
- Le pan de l'éditeur de blueprints, cassé par cette migration et à réparer ensuite.

## Découpage en commits

1. ✅ `9758d43 feat(pan): implement the core functions for pan` : module `core/shared/viewport.ts`, passage de `reset` à `isDefaultViewport`, process `pan`, et leurs tests ;
2. ✅ `dfc6caf feat(pan): add a new event for temporary migration` : événement `panReleased` dans `sp-stage` ;
3. ✅ `55fae65 fix(pan): add the adapter layer to be able to use it in the legacy system` : `makeApplyFacts`, `makeResetSynthesizer`, `makePanSynthesizer` et leurs tests ;
4. `feat(pan): plug the pan process in the synthesizer page` : étape 4, avec la suppression de `panned` dans le stage et dans `blueprint/Structure`.

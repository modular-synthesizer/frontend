# Plan de migration d'une fonctionnalité : « Recentrer la vue »

Première fonctionnalité migrée vers le pattern « functional core / imperative shell » décrit dans [ARCHITECTURE.md](ARCHITECTURE.md). Il s'agit du bouton boussole du menu du synthé.

## 1. Pourquoi celle-là

- **Petite** : 4 lignes de logique ([utils/functions/synthesizers.ts](../utils/functions/synthesizers.ts), fonction `reset`) et un seul appelant ([components/synthesizer/Menu.vue](../components/synthesizer/Menu.vue)).
- **Complète** : elle traverse les trois couches. Il y a une décision métier (le core), un appel HTTP (le shell) et un bouton (l'UI). C'est le bon gabarit pour valider le pattern avant d'attaquer le graphe audio.
- Les permissions (`membershipType`) sont encore plus petites, mais elles sont déjà pures. Il n'y aurait pas de shell à construire, donc on n'apprendrait pas grand-chose.

## 2. Ce qui se passe aujourd'hui

```ts
export async function reset(synthesizer: Synthesizer) {
  synthesizer.x = 0; synthesizer.y = 0; synthesizer.scale = 1.0;   // mutation d'une prop
  await repositories.synthesizers.update(synthesizer);             // PUT de tout l'objet
}
```

| Problème | Conséquence |
|---|---|
| La décision, la mutation et l'I/O sont dans la même fonction | Impossible à tester sans mocker `repositories` |
| `Menu.vue` modifie sa prop `synthesizer` à travers `reset` | La mutation est invisible depuis la page. Le stage ([sp/stage/Index.vue](../components/sp/stage/Index.vue)) ne réagit que parce qu'il partage la même référence |
| On envoie un PUT de **tout** le synthé (`members`, `modules`…) | Un payload inutilement lourd, et un risque d'écraser des données côté API |
| Il y a un PUT même si la vue est déjà centrée | Requête inutile |
| En cas d'échec, `make_request` lève une erreur `fatal` ([composables/api.ts](../composables/api.ts)) | L'état local est déjà modifié, et l'utilisateur arrive sur la page d'erreur |

## 3. La cible

```
Menu.vue ──emit('recenter')──▶ [id].vue (container)
                                  │ recenterSynthesizer(synth)          ← shell
                                  │   ├─ toViewport(synth)              ← adaptateur legacy → core
                                  │   ├─ resetViewport(viewport)        ← CORE pur
                                  │   │     ⇒ { viewport, effects[] }
                                  │   ├─ applyViewport(synth, viewport) ← mutation, dans le shell
                                  │   └─ runEffects(effects)            ← PUT { x, y, scale } → Result
```

Le plan reprend les conventions déjà présentes dans `features/` : `core/data/*.type.ts`, `core/processes/<domaine>/<verbe>.process.ts`, les alias de type `XxxFct`, les dossiers `__tests__/` et le `Result` de [features/shared/results/result.ts](../features/shared/results/result.ts). Elles diffèrent légèrement de l'arborescence `core/model` proposée dans [ARCHITECTURE.md](ARCHITECTURE.md). Il est proposé de garder celles du code et de mettre ARCHITECTURE.md à jour.

## 4. Plan, commit par commit

### Commit 1 : modèle de données du core

`features/synthesizers/core/data/Viewport.type.ts`

```ts
export type Viewport = { position: Position, scale: number }
export const DEFAULT_VIEWPORT: Viewport = { position: { x: 0, y: 0 }, scale: 1 }
```

`features/synthesizers/core/data/Effect.type.ts`

```ts
export type Effect =
  | { type: 'synthesizer.saveViewport', synthesizerId: Uuid, viewport: Viewport }
```

Ce type est l'union discriminée qui accueillera les futurs effets (`audio.setParam`, etc.). Il ne contient aucune fonction ni aucun objet Web Audio API, conformément à la règle n°1 d'ARCHITECTURE.md.

### Commit 2 : la décision pure, avec ses tests

`features/synthesizers/core/processes/viewport/reset.process.ts`

```ts
export type ViewportUpdate = { viewport: Viewport, effects: Effect[] }
export type ResetViewportFct = (id: Uuid, current: Viewport) => ViewportUpdate

export const resetViewport: ResetViewportFct = (id, current) =>
  isDefault(current)
    ? { viewport: current, effects: [] }
    : { viewport: DEFAULT_VIEWPORT, effects: [{ type: 'synthesizer.saveViewport', synthesizerId: id, viewport: DEFAULT_VIEWPORT }] }
```

`__tests__/reset.test.ts` : des tests sous forme de tableau de cas, **sans aucun `vi.fn` / `vi.spyOn`** :

- une vue déjà par défaut ne produit aucun effet et renvoie le viewport inchangé ;
- une vue déplacée (x ou y ≠ 0) renvoie `DEFAULT_VIEWPORT` et un effet `saveViewport` portant le bon id ;
- une vue seulement zoomée (scale ≠ 1) produit aussi un effet ;
- l'entrée n'est pas modifiée (on passe un `Object.freeze(...)`).

⚠️ Il faut utiliser des **imports relatifs** dans le core. [vitest.config.ts](../vitest.config.ts) ne déclare pas l'alias `~`. Les tests existants passent malgré tout parce qu'ils n'utilisent que des `import type` ([create.test.ts](../features/synthesizers/core/processes/inner_nodes/__tests__/create.test.ts) importe d'ailleurs un chemin qui n'existe plus).

### Commit 3 : le shell HTTP

`features/synthesizers/shell/api/saveViewport.ts`

```ts
export const saveViewport = async (id: Uuid, { position, scale }: Viewport): Promise<Result<void, ApiError>> =>
  api_put(`/proxy/synthesizers/${id}`, { ...position, scale }).then(() => ok(undefined), e => ko(...))
```

- Le PUT n'envoie que `{ x, y, scale }`, plus les jetons ajoutés par `createPayload`.
- La fonction renvoie un `Result` au lieu de lever une erreur fatale. Il faudra peut-être passer par `axios` directement, puisque `make_request` intercepte les erreurs pour les rendre fatales.

`features/synthesizers/shell/effects.ts`

```ts
export const runEffect = (effect: Effect) => {
  switch (effect.type) { case 'synthesizer.saveViewport': return saveViewport(effect.synthesizerId, effect.viewport) }
}
```

Le `switch` est exhaustif sur `Effect['type']`. TypeScript signalera donc tout futur effet non géré.

### Commit 4 : l'adaptateur legacy ↔ core (temporaire)

`features/synthesizers/shell/legacy/viewport.adapter.ts`

- `toViewport(s: LegacySynthesizer): Viewport` convertit `x/y` en `position`.
- `applyViewport(s, v)` écrit `x`, `y` et `scale` sur l'objet réactif legacy. **C'est la seule mutation, et elle est confinée dans le shell.**
- `recenterSynthesizer(s)` enchaîne `toViewport`, `resetViewport`, `applyViewport` et `runEffects`.

Ce fichier est une couche anticorruption. Il sera supprimé en phase 3 (store Pinia), quand le state du synthé sera détenu par le nouveau modèle.

### Commit 5 : branchement de l'UI

- Dans [Menu.vue](../components/synthesizer/Menu.vue), `@click="reset(synthesizer)"` devient `@click="emit('recenter')"`. On retire l'import de `reset` et Menu ne modifie plus sa prop.
- Dans [pages/synthesizers/[id].vue](../pages/synthesizers/[id].vue), on ajoute `@recenter="recenterSynthesizer(synthesizer)"` sur `<synthesizer-menu>`.

### Commit 6 : suppression du legacy

- Supprimer `reset` et l'import de `repositories` dans [utils/functions/synthesizers.ts](../utils/functions/synthesizers.ts) : plus aucun appelant (vérifiable avec un grep).

## 5. Tests et vérifications

| Couche | Test | Outil |
|---|---|---|
| Core `resetViewport` | Tableau de cas, valeur en entrée → valeur en sortie, aucun mock | vitest (déjà en place) |
| Shell `runEffect` / `saveViewport` | Un test avec un faux client HTTP qui enregistre la requête : URL, payload limité à `{x, y, scale}`, `ko` en cas de 500 | vitest |
| UI `Menu.vue` | Un clic émet `recenter` | Nécessite `@vue/test-utils` + `happy-dom` (phase 0 d'ARCHITECTURE.md, pas encore installés). Sinon, vérification manuelle |
| Manuel | Déplacer et zoomer, cliquer sur la boussole : le stage revient à l'origine et un seul PUT léger part (onglet Réseau). Recliquer : aucun PUT. Recharger : la position est conservée | navigateur |

**Critères de « terminé »** : `npx vitest run` passe (36 tests au vert au moment de la rédaction), aucun `vi.fn` dans `core/processes/viewport/__tests__`, le core n'importe ni Vue, ni Nuxt, ni `api_*`, et `reset` a disparu de `utils/`.

## 6. Hors périmètre et points à vérifier

- **À vérifier côté API, non confirmé** : est-ce que `PUT /synthesizers/:id` accepte un payload partiel `{x, y, scale}` sans effacer les autres champs ? Si ce n'est pas le cas, le commit 3 doit envoyer l'objet complet, comme aujourd'hui. Il faudra aussi compléter [features/synthesizers/api/schema.json](../features/synthesizers/api/schema.json) avec cette route.
- **Comportement en cas d'échec** : proposition de garder l'état local recentré et d'afficher une notification non bloquante au lieu de la page d'erreur fatale. C'est un changement de comportement volontaire, à valider. L'alternative est un rollback vers l'ancien viewport, qui est facile puisque le shell l'a sous la main.
- **Fonctionnalités voisines, laissées pour les itérations suivantes** : le pan (`@panned` dans [pages/synthesizers/[id].vue](../pages/synthesizers/[id].vue), même PUT de l'objet complet) et le zoom (`zoom` dans [utils/functions/geometry.ts](../utils/functions/geometry.ts), qui n'est **jamais persisté** sauf au pan suivant, ce qui ressemble à un bug). Une fois ce plan déroulé, elles réutiliseront directement `Viewport`, `Effect` et `saveViewport`.

---

*Sources : lecture du dépôt (fichiers cités en lien), [ARCHITECTURE.md](ARCHITECTURE.md), et exécution de `npx vitest run` (4 fichiers, 36 tests au vert).*

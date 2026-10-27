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

### 2. Shell : transmettre la position de départ depuis `sp-stage`

#### Principe : déplacer pendant le drag, ne sauvegarder qu'au relâchement

Un pan se déroule en deux phases, qu'il faut traiter différemment.

| Phase | Événement | Ce qui se passe | Core appelé | Sauvegarde |
|---|---|---|---|---|
| Début | `mousedown` sur le fond du stage | Mémorisation d'une copie de la position de départ | Non | Non |
| Déplacement | chaque `mousemove` | Le stage modifie `x` et `y` de la cible pour que l'affichage suive la souris | Non | Non |
| Fin | `mouseup` ou `mouseleave` | Émission **unique** de `panned(arrivée, départ)` | Oui, `pan` | Seulement si la position a changé |

Les positions intermédiaires ne sont qu'un état d'affichage temporaire. Ce ne sont pas des faits métier. Ce découpage existe déjà dans `sp-stage` : le callback `dragged` modifie la cible à chaque `mousemove`, et le callback `dropped` n'est appelé qu'au relâchement. Cette étape **conserve** ce découpage et ajoute seulement la position de départ à l'événement de fin.

Pourquoi ne pas appeler le core à chaque `mousemove` :

- `pan` produirait un effet de sauvegarde à chaque mouvement, soit des dizaines de requêtes par seconde ;
- la seule décision métier, « faut-il sauvegarder ? », ne peut être prise qu'en connaissant le départ et l'arrivée, donc à la fin ;
- le calcul du déplacement (décalage, division par le scale) vit dans `sp-stage` et sert aussi à l'éditeur de blueprints. Le migrer sort du périmètre.

Évolution possible plus tard, lors de la migration du calcul du drag : un process `drag` sans effet, appelé à chaque `mousemove`, qui renverrait seulement le viewport à afficher. `pan` resterait le seul process à produire un effet.

#### Modifications dans [`components/sp/stage/Index.vue`](../components/sp/stage/Index.vue)

1. Typer l'événement avec deux positions nommées :
   ```ts
   type Emits = {
     zoom: [ number ],
     panned: [ to: Coordinates, from: Coordinates ],
   }
   ```
2. Au `mousedown`, enregistrer une **copie** de la position de départ, avant de modifier quoi que ce soit :
   ```ts
   const start: Ref<Coordinates> = ref({ x: 0, y: 0 });

   function onmousedown($event: MouseEvent) {
     start.value = { x: innerTarget.value.x, y: innerTarget.value.y };
     // … calcul de event et originOffset, callback dragged : inchangés
     dropped(() => emit('panned', { x: innerTarget.value.x, y: innerTarget.value.y }, start.value));
   }
   ```
   La position d'arrivée est elle aussi copiée. Aujourd'hui, `panned` émet `innerTarget.value`, c'est-à-dire la cible elle-même. Si on émettait cet objet vivant à côté d'une copie, les deux arguments auraient un comportement différent.
3. Ne rien changer à `onmousemove`, à `dragged` ni à `onmouseup`.

#### Cas limites, vérifiés dans le code actuel

- **Clic sans déplacement.** `panned` est émis avec une arrivée égale au départ. C'est le core (`positionsDiffer`) qui décide de ne pas sauvegarder, pas le stage. Le stage reste sans logique métier.
- **La souris sort du stage pendant le drag.** `@mouseleave` appelle `onmouseup`, donc `panned` est émis et la position est sauvegardée. Ce comportement est conservé. Les callbacks sont ensuite réinitialisés, donc un `mouseup` plus tard ne déclenche pas une seconde émission.
- **Drag d'un module.** [`Draggable.vue`](../components/sp/stage/Draggable.vue) écoute `@mousedown.prevent.stop`. Le `onmousedown` du stage n'est donc pas appelé, `start` n'est pas modifié et le callback `dropped` est celui du module. Aucun `panned` n'est émis.
- **Pendant le drag, le synthétiseur est modifié en direct.** `innerTarget` enveloppe la même instance que `synthesizer` dans la page. L'affichage suit donc la souris sans passer par la page. À l'étape 3, `applyViewport` réécrit les mêmes valeurs, ce qui est sans effet.

#### Compatibilité avec les autres utilisateurs du stage

- [`blueprint/Structure/Index.vue`](../components/blueprint/Structure/Index.vue) relaie `c => emit('panned', c)` et ignore le second argument. [`Creator.vue`](../components/blueprint/Creator.vue) (`applyPanning`) ne lit que `c.x` et `c.y` : recevoir une copie au lieu de l'objet vivant ne change rien. Le blueprint continue de sauvegarder à chaque relâchement, y compris sans déplacement. C'est hors périmètre.
- [`blueprint/Appearance/Index.vue`](../components/blueprint/Appearance/Index.vue) n'écoute pas `panned`.
- [`pages/synthesizers/[id].vue`](../pages/synthesizers/[id].vue) ignore les arguments jusqu'à l'étape 4.

Ce commit peut donc être livré seul, sans changement de comportement visible.

#### Vérifications

Le repo n'a ni `@vue/test-utils` ni environnement DOM configuré pour vitest. Cette étape se vérifie donc à la main, avec l'onglet réseau ouvert :

- [ ] pendant un pan du synthétiseur, l'affichage suit la souris et **aucune requête** ne part pendant le mouvement ;
- [ ] au relâchement, une seule requête part. Jusqu'à l'étape 4, c'est encore le `update` complet de la page ;
- [ ] un drag de module ne déclenche aucun `panned` ;
- [ ] le pan de l'éditeur de blueprints (onglet Structure) fonctionne et sauvegarde toujours ;
- [ ] en sortant du stage pendant un pan, la position est sauvegardée une seule fois.

Alternative écartée : un nouvel événement `pan-started` écouté par la page. Il est plus verbeux et il laisse à la page la responsabilité de garder un état entre deux événements, alors que le stage connaît déjà le début du drag.

### 3. Shell : adapter `panSynthesizer`

Dans [`features/synthesizers/shell/legacy/viewport.adapter.ts`](../features/synthesizers/shell/legacy/viewport.adapter.ts), sur le modèle de `resetSynthesizer` :

```ts
export type PanSynthesizerFct = (s: Synthesizer, to: Position, from: Position) => Promise<void>
```

1. construire le viewport de départ à partir de `from` et de `synth.scale` ;
2. appeler `pan(synth.id as Uuid, viewport, to)` ;
3. appliquer le viewport renvoyé avec `applyViewport`. C'est redondant avec la modification faite par le stage, mais le core reste la source de vérité ;
4. exécuter les effets avec `runEffect`.

### 4. Page : brancher l'adapter

Dans [`pages/synthesizers/[id].vue`](../pages/synthesizers/[id].vue) :

```vue
@panned="(to, from) => panSynthesizer(synthesizer, to, from)"
```

Supprimer ensuite l'import de `repositories` s'il n'est plus utilisé dans la page. Il l'est encore pour le chargement du synthétiseur, à vérifier.

### 5. Vérifications

Automatiques :

- [ ] `npx vitest run features/synthesizers` est vert ;
- [ ] `npx tsc --noEmit -p .` ne signale aucune nouvelle erreur dans les fichiers modifiés.

Manuelles, dans le navigateur, onglet réseau ouvert :

- [ ] un pan suivi d'un rechargement de la page conserve la position ;
- [ ] la requête `PUT /proxy/synthesizers/:id` ne contient que `x`, `y`, `scale` et les tokens ;
- [ ] un clic sans déplacement ne déclenche aucune requête ;
- [ ] le pan de l'éditeur de blueprints (Structure et Appearance) fonctionne toujours ;
- [ ] avec un token invalide, un pan renvoie vers `/`.

## Points d'attention

- **Le zoom n'est plus sauvegardé lors d'un simple clic.** Aujourd'hui, le zoom n'est sauvegardé que grâce au `update` complet déclenché par `panned`, clic sans déplacement compris. Après la migration :
  - un pan **avec** déplacement sauvegarde toujours le scale courant, car l'effet contient le viewport complet ;
  - un zoom suivi d'un simple clic ne sauvegarde plus rien.

  Cette régression est temporaire et acceptée : elle disparaît avec la migration du zoom, qui sauvegardera lui-même le scale.
- **Les autres champs du synthétiseur ne sont plus envoyés.** Vérifier que rien ne comptait sur le `update` complet déclenché au pan pour sauvegarder un autre champ, par exemple le nom.
- **L'objet émis est un objet vivant.** `panned` émet `innerTarget.value`, qui est le synthétiseur lui-même. Le core et l'adapter ne doivent pas garder cette référence (voir le test de l'étape 1).

## Hors périmètre

- La migration du zoom, avec sa question de debounce. C'est la prochaine migration.
- Le calcul du drag dans `sp-stage`, qui reste dans le composant.
- Le pan de l'éditeur de blueprints.

## Découpage en commits

1. `refactor(viewport): share viewport comparisons between processes`, pour `core/shared/viewport.ts`, ses tests et le passage de `reset` à `isDefaultViewport` ;
2. `feat(pan synthesizer): add the pan process in the core`, avec ses tests ;
3. `feat(pan synthesizer): emit the starting position on panned`, pour `sp-stage` ;
4. `feat(pan synthesizer): plug the pan process in the synthesizer page`, pour l'adapter et la page.

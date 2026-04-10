# Core Engine Rules

Le dossier **`core/`** contient le **moteur du jeu**.  
Il doit rester **totalement indépendant de l'application**.

Le but est de garder un moteur :

- testable
- portable
- prévisible
- facile à maintenir

---

# 1️⃣ Pas de React

Le moteur ne doit **jamais dépendre de React**.

Interdit dans `core/` :

- `useState`
- `useEffect`
- composants React
- hooks React

Exemple **interdit** :

```ts
import { useState } from "react"
```

Le moteur doit être du TypeScript pur.
```ts
export class GameEngine {
  state: GameState

  constructor(level: Level) {
    this.state = createInitialState(level)
  }
}
```

# 2️⃣ Pas d’API externe

Le moteur ne doit **pas dépendre d'un service externe**.
Interdit dans core/ :

- AsyncStorage
- fetch
- Firebase
- Supabase
- SQLite
- localStorage

Le moteur doit pouvoir fonctionner **en dehors de l'application**.
Exemple :

- dans un **éditeur de niveaux**
- dans un **test unitaire**
- dans un **serveur backend**
- dans une **version web**

Les accès externes doivent être placés dans :
```ts 
src/services
```

# 3️⃣ Logique déterministe

Les fonctions du moteur doivent être **déterministes**.
Cela signifie :

Avec les mêmes entrées, la fonction retourne toujours le même résultat.

Exemple correct :
```ts 
GameEngine.applyMove(state, move)
```
Entrée :
```ts 
state
move
```
Sortie :
```ts 
newState
```

Même entrée → même sortie.

Exemple
```ts 
function applyMove(state: GameState, move: Move): GameState {
  const newState = { ...state }

  newState.path.push(move.pointId)

  return newState
}
```

Aucune dépendance externe.

# Résumé
Le dossier core/ doit respecter ces règles :

1. **Pas de React**
2. **Pas d'API externe**
3. **Logique déterministe**

Si ces règles sont respectées, le moteur devient :

- testable
- portable
- stable
- scalable


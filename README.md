# TP-IHM - Suite de Tests Playwright pour TodoList Angular

## 📋 Vue d'ensemble

Ce projet contient une suite complète de **25 tests automatisés** pour l'application TodoList Angular, développée avec **Playwright** et **TypeScript**. Les tests suivent une approche **boîte noire** (black-box testing) en utilisant uniquement les sélecteurs visibles par l'utilisateur et un **Oracle JSON** pour valider la cohérence des données.

**URL de l'application testée** : `https://alexdmr.github.io/l3m-2023-2024-angular-todolist/`

---

## 🚀 Lancement des tests

```bash
# Installer les dépendances (si nécessaire)
npm install

# Lancer tous les tests
npx playwright test

## 📂 Structure du Projet

```
testUI/
├── tests/
│   ├── todo-page-test.ts    # Page Object Model (POM) - Encapsule tous les sélecteurs et actions
│   ├── test1.spec.ts         # SECTION 1 : Fonctionnalités de base (3 tests)
│   ├── test2.spec.ts         # SECTION 2 : Gestion des états & filtres (3 tests)
│   ├── test3.spec.ts         # SECTION 3 : Cas limites & entrées (2 tests)
│   ├── test4.spec.ts         # SECTION 4 : Fonctionnalités avancées Undo/Redo (2 tests)
│   ├── test5.spec.ts         # SECTION 5 : Zone spécifique Étape 2 (2 tests)
│   └── test6.spec.ts         # SECTION 6 : Tests complémentaires (12 tests)
├── playwright.config.ts      # Configuration globale de Playwright
└── package.json              # Dépendances du projet
```

---

## 🏗️ Architecture des Tests

### Page Object Model (POM)

Le projet utilise le pattern **Page Object Model** pour une meilleure maintenabilité :

- **`todo-page-test.ts`** : Classe `TodoPage` qui encapsule :
  - Tous les sélecteurs d'éléments de la page
  - Toutes les actions utilisateur (ajout, modification, suppression, etc.)
  - Toutes les vérifications (assertions)
  - Interface fluide (chaînage de méthodes) : chaque méthode retourne `Promise<this>`

**Exemple d'utilisation** :
```typescript
const todo = new TodoPage(page);
await todo.navigate()
    .addTodo('Ma tâche')
    .verifyTodoVisible('Ma tâche')
    .changeTypeTodo('Ma tâche')
    .verifyTaskIsCompleted('Ma tâche');
```



## 📊 Détail des Tests par Section

### SECTION 1 : FONCTIONNALITÉS DE BASE (NOMINAL & CYCLE DE VIE)

**Fichier** : `test1.spec.ts` | **Nombre de tests** : 3

#### Test 1 : Scénario 1 - Ajout de tâche et vérification de la cohérence JSON
**Objectif** : Vérifier que l'ajout fonctionne et que le JSON (Oracle) est mis à jour.

- Ajout d'une tâche simple (`Test Nominal`)
- Vérification de l'affichage dans l'UI
- Vérification de la cohérence avec l'Oracle JSON
- Vérification de l'état initial (`done: false`)
- Changement d'état et vérification JSON (`done: true`)

#### Test 2 : Scénario Lifecycle - Cycle de vie complet
**Objectif** : Valider le flux complet d'une tâche dans la liste principale.

- **Étape 1 - Ajout** : Création d'une tâche (`Task v1.0`)
- **Étape 2 - Modification** : Modification via double-clic (`Task v2.0 (Edited)`)
- **Étape 3 - Cocher** : Marquer la tâche comme faite
- **Étape 4 - Suppression** : Suppression via le petit 'x'
- Vérification finale : Liste vide

#### Test 3 : Modification de texte via double-clic (Liste du haut)
**Objectif** : Tester la modification dans la liste principale et la synchronisation avec Étape 2.

- Modification d'une tâche (`Fix Bug A` → `Fix Bug A+`)
- Vérification de la disparition de l'ancien texte
- Vérification de l'apparition du nouveau texte
- Test de rollback via Étape 2 (retour à l'ancien texte)

---

### SECTION 2 : GESTION DES ÉTATS & FILTRES

**Fichier** : `test2.spec.ts` | **Nombre de tests** : 3

#### Test 4 : Scénario 4 - Changement d'état (Cocher/Décocher) et vérification JSON
**Objectif** : Tester le changement d'état des tâches et la cohérence JSON.

- Cocher une tâche → Vérification UI + JSON (`done: true`)
- Décocher une tâche → Vérification UI + JSON (`done: false`)

#### Test 5 : Filtrage des tâches (Actifs / Complétés)
**Objectif** : Tester les trois filtres et leur comportement.

- **Filtre "Actifs"** : Affiche uniquement les tâches non complétées
- **Filtre "Complétés"** : Affiche uniquement les tâches complétées
- **Filtre "Tous"** : Affiche toutes les tâches

#### Test 6 : Suppression unitaire (X) vs Suppression de masse
**Objectif** : Comparer les différentes méthodes de suppression.

- **Suppression unitaire (petit 'x')** : Suppression d'une tâche spécifique via hover
- **Suppression unitaire (grand 'X' - Étape 2)** : Suppression via la zone du bas
- **Suppression de masse** : Suppression de toutes les tâches cochées via "Supprimer cochées"
- Vérification finale : Liste vide

---

### SECTION 3 : CAS LIMITES & ENTRÉES

**Fichier** : `test3.spec.ts` | **Nombre de tests** : 2

#### Test 7 : Scénario 3 - Valeurs limites (Entrée vide non autorisée)
**Objectif** : Vérifier que les entrées invalides sont rejetées.

- Tentative d'ajout avec **chaîne vide** → Doit être rejetée
- Tentative d'ajout avec **espaces uniquement** → Doit être rejetée (trim)

#### Test 8 : Scénario 5 - Ajout via le champ secondaire (Étape 2)
**Objectif** : Tester l'ajout via le champ de saisie secondaire.

- Ajout de tâche via le champ de saisie de la zone "Étape 2"
- Vérification de l'affichage dans la liste principale

---

### SECTION 4 : FONCTIONNALITÉS AVANCÉES (ANNULER / REFAIRE)

**Fichier** : `test4.spec.ts` | **Nombre de tests** : 2

#### Test 9 : Scénario 2 - Annuler (Undo) et Refaire (Redo) un ajout
**Objectif** : Tester la fonctionnalité Undo/Redo sur l'ajout.

- **Étape 1** : Ajout d'une tâche (`Tâche à annuler`)
- **Étape 2** : Annuler (Undo) → La tâche disparaît, JSON vide (`"items": []`)
- **Étape 3** : Refaire (Redo) → La tâche réapparaît, JSON mis à jour

#### Test 10 : Annuler (Undo) et Refaire (Redo) une suppression
**Objectif** : Tester la fonctionnalité Undo/Redo sur la suppression.

- **Étape 1** : Ajout d'une tâche
- **Étape 2** : Suppression de la tâche
- **Étape 3** : Annuler (Undo) → La tâche revient
- **Étape 4** : Refaire (Redo) → La tâche redisparaît

---

### SECTION 5 : ZONE SPÉCIFIQUE (ÉTAPE 2)

**Fichier** : `test5.spec.ts` | **Nombre de tests** : 2

#### Test 11 : Scénario Étape 2 - Modification de texte et changement d'état
**Objectif** : Tester les interactions spécifiques à la zone Étape 2.

- **Modification via Étape 2** : Changement du texte de la première tâche (`Task Original` → `Task Modified`)
- **Cocher via Étape 2** : Changement d'état via la zone du bas
- **Décocher via Étape 2** : Retour à l'état non complété

#### Test 12 : Scénario Étape 2 - Vérification du filtrage dans la zone du bas
**Objectif** : Vérifier que les filtres s'appliquent correctement à la zone Étape 2.

- Préparation : 2 tâches (1 complétée, 1 active)
- **Filtre "Actifs"** : Modification d'état du premier élément visible
- **Filtre "Complétés"** : Vérification de l'affichage
- **Filtre "Tous"** : Vérification que toutes les tâches sont visibles

---

### SECTION 6 : TESTS COMPLÉMENTAIRES (BORNE & ROBUSTESSE)

**Fichier** : `test6.spec.ts` | **Nombre de tests** : 13

#### Test 13 : Ajout de tâche avec texte très long
**Objectif** : Tester la gestion des chaînes de caractères très longues.

- Test avec chaîne de **500 caractères** (répétition de 'A')
- Vérification de l'affichage dans l'UI
- Vérification de la présence dans le JSON Oracle

#### Test 14 : Ajout de tâche avec caractères spéciaux et Unicode
**Objectif** : Tester la gestion des caractères spéciaux et Unicode.

- Test avec caractères spéciaux (`<>&"'`)
- Test avec émojis (🎉✅🚀)
- Test avec accents et caractères Unicode
- Vérification de l'affichage et du JSON

#### Test 15 : Protection contre injection HTML
**Objectif** : Vérifier la protection contre les attaques XSS.

-  Test avec code HTML/JavaScript potentiellement dangereux (`<script>alert("XSS")</script>`)
- Vérification que le code n'est pas exécuté (échappement)
- Vérification que le texte est affiché tel quel, pas interprété

#### Test 16 : Annuler (Undo) et Refaire (Redo) une modification
**Objectif** : Tester Undo/Redo sur la modification de texte.

- **Étape 1** : Ajout d'une tâche (`Original Task`)
- **Étape 2** : Modification (`Modified Task`)
- **Étape 3** : Annuler (Undo) → Retour au texte original
- **Étape 4** : Refaire (Redo) → Retour au texte modifié

#### Test 17 : Annuler (Undo) et Refaire (Redo) un changement d'état
**Objectif** : Tester Undo/Redo sur le changement d'état (checkbox).

- **Étape 1** : Ajout d'une tâche
- **Étape 2** : Cocher la tâche
- **Étape 3** : Annuler (Undo) → Décocher
- **Étape 4** : Refaire (Redo) → Cocher à nouveau

#### Test 18 : Séquences multiples d'Undo/Redo
**Objectif** : Tester les séquences complexes d'Undo/Redo.

- Création de 3 tâches (`Task 1`, `Task 2`, `Task 3`)
- **Undo multiple (3 fois)** : Annulation séquentielle → Liste vide
- **Redo multiple (3 fois)** : Restauration séquentielle → Toutes les tâches restaurées

#### Test 19 : Modification d'état dans un filtre actif
**Objectif** : Vérifier la réactivité des filtres lors des changements d'état.

- Préparation : 2 tâches actives
- **Dans le filtre "Actifs"** : Cocher une tâche → Disparition immédiate
-  **Dans le filtre "Complétés"** : Décocher une tâche → Disparition immédiate
- Vérification de la réactivité en temps réel

#### Test 20 : Cohérence JSON après modification de texte
**Objectif** : Vérifier la cohérence du JSON Oracle après modification.

- Ajout d'une tâche (`Original`)
- Modification (`Modified`)
- Vérification que le JSON contient le nouveau texte
- Vérification que l'ancien texte n'est plus présent

#### Test 21 : Cohérence JSON après suppression de masse
**Objectif** : Vérifier la cohérence du JSON Oracle après suppression de masse.

- Création de 3 tâches
- Cocher toutes les tâches
- Suppression de toutes les tâches cochées
- Vérification que le JSON est vide (`"items": []`)

#### Test 22 : Modification de tâche avec texte vide
**Objectif** : Tester le comportement lors de la modification avec texte vide.

- Ajout d'une tâche
- Tentative de modification avec chaîne vide
- Vérification du comportement (rejet, suppression, ou acceptation selon l'implémentation)

#### Test 23 : Annuler (Undo) et Refaire (Redo) une suppression de masse
**Objectif** : Tester Undo/Redo sur la suppression de masse.

- Création de 3 tâches
- Cocher toutes les tâches
- Suppression de toutes les tâches cochées
- **Annuler (Undo)** → Toutes les tâches reviennent (avec état cochée)
- **Refaire (Redo)** → Toutes les tâches redisparaissent

#### Test 24 : Modification via Étape 2 et vérification JSON
**Objectif** : Vérifier la cohérence JSON lors des modifications via Étape 2.

- Ajout d'une tâche (`Original`)
- Modification via Étape 2 (`Modified via Step 2`)
- Vérification de l'affichage
- Vérification de la cohérence JSON (`done: false`)

#### Test 25 : Changement d'état via Étape 2 et vérification JSON
**Objectif** : Vérifier la cohérence JSON lors des changements d'état via Étape 2.

- Ajout d'une tâche
- **Cocher via Étape 2** → Vérification JSON (`done: true`)
- **Décocher via Étape 2** → Vérification JSON (`done: false`)

---

## 🎯 Fonctionnalités Testées

### Fonctionnalités CRUD
- [x] **Créer** : Ajout de tâches (champ principal + champ Étape 2)
- [x] **Lire** : Affichage dans liste principale + zone Étape 2
- [x] **Modifier** : Double-clic, zone Étape 2, synchronisation
- [x] **Supprimer** : Petit 'x', grand 'X', suppression de masse

### Gestion des États
- [x] Cocher/Décocher (liste principale)
- [x] Cocher/Décocher (zone Étape 2)
- [x] Synchronisation des états entre zones
- [x] Vérification JSON après changement d'état

### Filtres
- [x] Filtre "Tous"
- [x] Filtre "Actifs"
- [x] Filtre "Complétés"
- [x] Réactivité des filtres lors des changements d'état
- [x] Application des filtres à la zone Étape 2

### Historique (Undo/Redo)
- [x] Undo/Redo sur ajout
- [x] Undo/Redo sur suppression
- [x] Undo/Redo sur modification
- [x] Undo/Redo sur changement d'état
- [x] Undo/Redo sur suppression de masse
- [x] Séquences multiples d'Undo/Redo

### Validation & Robustesse
- [x] Rejet des entrées vides
- [x] Rejet des espaces uniquement
- [x] Gestion des caractères spéciaux
- [x] Protection contre injection HTML
- [x] Gestion des chaînes très longues (500 caractères)
- [x] Modification avec texte vide
- [x] Opérations sur liste vide

tests/testx.spec.ts : Scénarios de test. Contient les cas de tests organisés par fonctionnalité (Nominal, Filtres, Étape 2, Undo/Redo, etc.).

playwright.config.ts : Configuration globale de Playwright.


## 📊 Résultats & Analyse

Suite à l'exécution de la campagne de tests, voici le bilan de la qualité logicielle :

### ✅ Fonctionnalités Validées

L'ensemble des fonctionnalités "Happy Path" fonctionnent correctement :

Ajout, Modification (via double-clic et zone Étape 2), et Suppression (unitaire et de masse) sont fonctionnels.

Le basculement entre Tous, Actifs et Complétés met à jour la vue correctement.

Les fonctions Annuler et Refaire (Undo/Redo) restaurent bien les états précédents.

### ⚠️ Anomalie Détectée (Bug)

Lors du test des Valeurs Limites (Scénario 3), un comportement inattendu a été identifié :

L'application autorise l'ajout de tâches vides ou composées uniquement d'espaces blancs.

# TP-IHM


##▶️ Lancement des tests (Commandes)

npx playwright test

##📂 Structure du Projet

tests/todo-page-test.ts : Page Object. Encapsule les sélecteurs et les actions. Chaque méthode retourne Promise<this> pour permettre le chaînage (Fluent Interface).

tests/testx.spec.ts : Scénarios de test. Contient les cas de tests organisés par fonctionnalité (Nominal, Filtres, Étape 2, Undo/Redo, etc.).

playwright.config.ts : Configuration globale de Playwright.

##🤖 Prompts Utilisés (Documentation IA)

Ce projet a été généré à l'aide d'une approche itérative avec une IA générative. Voici les prompts clés utilisés pour produire le code final :

Prompt 1 : Architecture & Initialisation

"Agis en tant qu'expert QA. Génère une suite de tests Playwright (TypeScript) pour l'application TodoList Angular, en utilisant le Page Object Model (POM).
Contraintes :

Approche Boîte Noire (Sélecteurs visibles utilisateur + Oracle JSON).

Architecture Fluide (Chaque action retourne this).

Couverture : Cycle de vie nominal, Filtres, Undo/Redo."

Prompt 2 : Gestion de la zone "Étape 2"

"Ajoute des méthodes dans le Page Object pour gérer la zone spécifique 'Étape 2' en bas de page.
Défi : Les tâches sont dans des <input> (valeur) et non des labels (texte).
Solution demandée : Utilise des sélecteurs robustes comme input[value='...'] pour modifier le texte, cocher la case associée, et supprimer via le bouton 'X'."

Prompt 3 : Suppression au survol (Hover)

"Le bouton de suppression 'x' dans la liste principale n'est visible qu'au survol de la souris.
Implémente une méthode deleteViaSmallX(taskName) qui :

Trouve la ligne de la tâche.

Simule un .hover() sur la ligne.

Clique sur le bouton .destroy qui apparaît."

Prompt 4 : Scénarios de Filtres Dynamiques

"Génère un test pour vérifier la réactivité des filtres (Actifs/Complétés).
Scénario : Dans l'onglet 'Actifs', cocher une tâche et vérifier qu'elle disparaît immédiatement. Dans l'onglet 'Complétés', décocher une tâche et vérifier qu'elle disparaît immédiatement."

##📊 Résultats & Analyse

Suite à l'exécution de la campagne de tests, voici le bilan de la qualité logicielle :

###✅ Fonctionnalités Validées

L'ensemble des fonctionnalités "Happy Path" fonctionnent correctement :

Ajout, Modification (via double-clic et zone Étape 2), et Suppression (unitaire et de masse) sont fonctionnels.

Le basculement entre Tous, Actifs et Complétés met à jour la vue correctement.

Les fonctions Annuler et Refaire (Undo/Redo) restaurent bien les états précédents.

###⚠️ Anomalie Détectée (Bug)

Lors du test des Valeurs Limites (Scénario 3), un comportement inattendu a été identifié :

L'application autorise l'ajout de tâches vides ou composées uniquement d'espaces blancs.

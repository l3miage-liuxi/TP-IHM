import { test } from '@playwright/test';
import { TodoPage } from './todo-page-test';

test.describe('Angular TodoList - SECTION 6 : TESTS COMPLÉMENTAIRES (BORNE & ROBUSTESSE)', () => {

    // ============================================================
    // SECTION 6 : TESTS COMPLÉMENTAIRES (BORNE & ROBUSTESSE)
    // ============================================================

    /**
     * Test des valeurs limites : Chaînes très longues
     */
    test('Scénario : Ajout de tâche avec texte très long', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Test avec une chaîne de 500 caractères
        const longText = 'A'.repeat(500);
        await todo.addTodo(longText);
        await todo.verifyTodoVisible(longText);
        await todo.verifyJsonContains(longText);
    });

    /**
     * Test des caractères spéciaux et Unicode
     */
    test('Scénario : Ajout de tâche avec caractères spéciaux et Unicode', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Test avec caractères spéciaux
        const specialChars = 'Task with <>&"\' and émojis 🎉✅🚀';
        await todo.addTodo(specialChars);
        await todo.verifyTodoVisible(specialChars);
        await todo.verifyJsonContains(specialChars);
    });

    /**
     * Test des caractères HTML potentiellement dangereux
     */
    test('Scénario : Protection contre injection HTML', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        const htmlInjection = '<script>alert("XSS")</script>';
        await todo.addTodo(htmlInjection);
        
        // Vérifier que le texte est échappé (ne doit pas exécuter le script)
        await todo.verifyTodoVisible(htmlInjection);
        // Le texte doit être affiché tel quel, pas interprété
    });

    /**
     * Test : Undo/Redo sur la modification de texte
     */
    test('Scénario : Annuler (Undo) et Refaire (Redo) une modification', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        const originalText = 'Original Task';
        const modifiedText = 'Modified Task';

        // 1. Ajout
        await todo.addTodo(originalText);
        await todo.verifyTodoVisible(originalText);

        // 2. Modification
        await todo.editTaskInMainList(originalText, modifiedText);
        await todo.verifyTodoVisible(modifiedText);
        await todo.verifyTodoHidden(originalText);

        // 3. Annuler -> Retour à l'original
        await todo.clickUndo();
        await todo.verifyTodoVisible(originalText);
        await todo.verifyTodoHidden(modifiedText);

        // 4. Refaire -> Retour à la modification
        await todo.clickRedo();
        await todo.verifyTodoVisible(modifiedText);
        await todo.verifyTodoHidden(originalText);
    });

    /**
     * Test : Undo/Redo sur le changement d'état (checkbox)
     */
    test('Scénario : Annuler (Undo) et Refaire (Redo) un changement d\'état', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        const taskName = 'Task State Change';

        // 1. Ajout
        await todo.addTodo(taskName);
        await todo.verifyTaskIsUncompleted(taskName);

        // 2. Cocher
        await todo.changeTypeTodo(taskName);
        await todo.verifyTaskIsCompleted(taskName);

        // 3. Annuler -> Décocher
        await todo.clickUndo();
        await todo.verifyTaskIsUncompleted(taskName);

        // 4. Refaire -> Cocher à nouveau
        await todo.clickRedo();
        await todo.verifyTaskIsCompleted(taskName);
    });

    /**
     * Test : Séquences multiples d'Undo/Redo
     */
    test('Scénario : Séquences multiples d\'Undo/Redo', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Créer plusieurs tâches
        await todo.addTodo('Task 1');
        await todo.addTodo('Task 2');
        await todo.addTodo('Task 3');

        // Vérifier qu'elles sont toutes visibles
        await todo.verifyTodoVisible('Task 1');
        await todo.verifyTodoVisible('Task 2');
        await todo.verifyTodoVisible('Task 3');

        // Undo multiple
        await todo.clickUndo(); // Annule Task 3
        await todo.verifyTodoHidden('Task 3');
        await todo.verifyTodoVisible('Task 2');

        await todo.clickUndo(); // Annule Task 2
        await todo.verifyTodoHidden('Task 2');
        await todo.verifyTodoVisible('Task 1');

        await todo.clickUndo(); // Annule Task 1
        await todo.verifyListIsEmpty();

        // Redo multiple
        await todo.clickRedo(); // Restaure Task 1
        await todo.verifyTodoVisible('Task 1');

        await todo.clickRedo(); // Restaure Task 2
        await todo.verifyTodoVisible('Task 2');

        await todo.clickRedo(); // Restaure Task 3
        await todo.verifyTodoVisible('Task 3');
    });

    /**
     * Test : Filtres avec modification dynamique d'état
     */
    test('Scénario : Modification d\'état dans un filtre actif', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Préparation : 2 tâches actives
        await todo.addTodo('Active Task 1');
        await todo.addTodo('Active Task 2');

        // Filtrer sur "Actifs"
        await todo.clickFilterActive();
        await todo.verifyTodoVisible('Active Task 1');
        await todo.verifyTodoVisible('Active Task 2');

        // Cocher une tâche dans le filtre "Actifs"
        await todo.changeTypeTodo('Active Task 1');
        
        // La tâche doit disparaître immédiatement du filtre "Actifs"
        await todo.verifyTodoHidden('Active Task 1');
        await todo.verifyTodoVisible('Active Task 2');

        // Basculer sur "Complétés" pour vérifier
        await todo.clickFilterCompleted();
        await todo.verifyTodoVisible('Active Task 1');
        await todo.verifyTodoHidden('Active Task 2');

        // Décocher dans "Complétés"
        await todo.changeTypeTodo('Active Task 1');
        
        // La tâche doit disparaître du filtre "Complétés"
        await todo.verifyTodoHidden('Active Task 1');
    });

    /**
     * Test : Vérification de la cohérence JSON après modification
     */
    test('Scénario : Cohérence JSON après modification de texte', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        const originalText = 'Original';
        const modifiedText = 'Modified';

        await todo.addTodo(originalText);
        await todo.verifyJsonContains(originalText);
        await todo.verifyJsonContains('"done": false');

        // Modification
        await todo.editTaskInMainList(originalText, modifiedText);
        await todo.verifyJsonContains(modifiedText);
        await todo.verifyJsonContains('"done": false');
        // L'ancien texte ne doit plus être dans le JSON
    });

    /**
     * Test : Vérification JSON après suppression de masse
     */
    test('Scénario : Cohérence JSON après suppression de masse', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        await todo.addTodo('Task A');
        await todo.addTodo('Task B');
        await todo.addTodo('Task C');

        // Cocher toutes les tâches
        await todo.changeTypeTodo('Task A');
        await todo.changeTypeTodo('Task B');
        await todo.changeTypeTodo('Task C');

        // Supprimer toutes les tâches cochées
        await todo.clearCompleted();

        // Vérifier que le JSON est vide
        await todo.verifyJsonContains('"items": []');
        await todo.verifyListIsEmpty();
    });

    /**
     * Test : Opérations sur liste vide (robustesse)
     */
    test('Scénario : Tentative d\'opérations sur liste vide', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Vérifier que la liste est vide
        await todo.verifyListIsEmpty();

        // Tentative de suppression (ne doit pas causer d'erreur)
        // Le bouton "Supprimer cochées" ne doit pas être visible
        await todo.verifyClearCompletedButtonHidden();

        // Tentative d'Undo sur liste vide (ne doit pas causer d'erreur)
        await todo.clickUndo();
        await todo.verifyListIsEmpty();
    });

    
    /**
     * Test : Modification avec texte vide (doit être rejetée ou gérée)
     */
    test('Scénario : Modification de tâche avec texte vide', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        const originalText = 'Original Task';

        await todo.addTodo(originalText);
        await todo.verifyTodoVisible(originalText);

        // Tentative de modification avec texte vide
        // Selon l'implémentation, cela peut soit :
        // 1. Rejeter la modification (garder l'original)
        // 2. Supprimer la tâche
        // 3. Accepter (bug potentiel)
        
        // Test : Essayer de modifier avec chaîne vide
        await todo.editTaskInMainList(originalText, '');
        
        // Vérifier le comportement (à adapter selon l'implémentation réelle)
        // Option 1 : La tâche reste avec le texte original
        // Option 2 : La tâche est supprimée
        // Pour l'instant, on vérifie juste qu'il n'y a pas d'erreur
    });

    
    
    /**
     * Test : Undo/Redo après suppression de masse
     */
    test('Scénario : Annuler (Undo) et Refaire (Redo) une suppression de masse', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        await todo.addTodo('Task 1');
        await todo.addTodo('Task 2');
        await todo.addTodo('Task 3');

        // Cocher toutes les tâches
        await todo.changeTypeTodo('Task 1');
        await todo.changeTypeTodo('Task 2');
        await todo.changeTypeTodo('Task 3');

        // Supprimer toutes les tâches cochées
        await todo.clearCompleted();
        await todo.verifyListIsEmpty();

        // Annuler -> Les tâches reviennent
        await todo.clickUndo();
        await todo.verifyTodoVisible('Task 1');
        await todo.verifyTodoVisible('Task 2');
        await todo.verifyTodoVisible('Task 3');
        // Les tâches doivent être cochées
        await todo.verifyTaskIsCompleted('Task 1');
        await todo.verifyTaskIsCompleted('Task 2');
        await todo.verifyTaskIsCompleted('Task 3');

        // Refaire -> Les tâches redisparaissent
        await todo.clickRedo();
        await todo.verifyListIsEmpty();
    });

    /**
     * Test : Modification via Étape 2 avec vérification JSON
     */
    test('Scénario : Modification via Étape 2 et vérification JSON', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        const originalText = 'Original';
        const modifiedText = 'Modified via Step 2';

        await todo.addTodo(originalText);
        await todo.verifyJsonContains(originalText);

        // Modification via Étape 2
        await todo.change1erTextViaStep2(modifiedText);
        await todo.verifyTodoVisible(modifiedText);
        await todo.verifyJsonContains(modifiedText);
        await todo.verifyJsonContains('"done": false');
    });

    /**
     * Test : Changement d'état via Étape 2 avec vérification JSON
     */
    test('Scénario : Changement d\'état via Étape 2 et vérification JSON', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        const taskName = 'Task for Step 2';

        await todo.addTodo(taskName);
        await todo.verifyJsonContains('"done": false');

        // Cocher via Étape 2
        await todo.changeType1erTaskViaStep2();
        await todo.verifyTaskIsCompleted(taskName);
        await todo.verifyJsonContains('"done": true');

        // Décocher via Étape 2
        await todo.changeType1erTaskViaStep2();
        await todo.verifyTaskIsUncompleted(taskName);
        await todo.verifyJsonContains('"done": false');
    });

});


import { test } from '@playwright/test';
import { TodoPage } from './todo-page-test';

test.describe('Angular TodoList - SECTION 1 : FONCTIONNALITÉS DE BASE (NOMINAL & CYCLE DE VIE)', () => {

    // ============================================================
    // SECTION 1 : FONCTIONNALITÉS DE BASE (NOMINAL & CYCLE DE VIE)
    // ============================================================

    /**
     * Scénario Nominal : Ajout simple & Vérification Oracle
     * Objectif : Vérifier que l'ajout fonctionne et que le JSON (Oracle) est mis à jour.
     */
    test('Scénario 1 : Ajout de tâche et vérification de la cohérence JSON', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        await todo.addTodo('Test Nominal');
        
        // Vérification UI + Oracle JSON
        await todo.verifyTodoVisible('Test Nominal');
        await todo.verifyJsonContains('Test Nominal');
        
        // Vérification de l'état initial (non fait)
        await todo.verifyJsonContains('"done": false');
        
        // Changement d'état et vérification JSON
        await todo.changeTypeTodo('Test Nominal');
        await todo.verifyJsonContains('"done": true');
    });

    /**
     * Cycle de vie complet : Ajout -> Modification -> Cocher -> Supprimer
     * Objectif : Valider le flux complet d'une tâche dans la liste principale.
     */
    test('Scénario Lifecycle : Cycle de vie complet (Ajout -> Modif -> Cocher -> Suppr)', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // 1. Ajout
        const initialTask = 'Task v1.0';
        await todo.addTodo(initialTask);
        await todo.verifyTodoVisible(initialTask);

        // 2. Modification (Double-clic)
        const updatedTask = 'Task v2.0 (Edited)';
        await todo.editTaskInMainList(initialTask, updatedTask);
        await todo.verifyTodoHidden(initialTask);
        await todo.verifyTodoVisible(updatedTask);

        // 3. Cocher (Marquer comme fait)
        await todo.changeTypeTodo(updatedTask);
        await todo.verifyTaskIsCompleted(updatedTask);

        // 4. Suppression (Petit 'x')
        await todo.deleteViaSmallX(updatedTask);
        await todo.verifyTodoHidden(updatedTask);
        await todo.verifyListIsEmpty();
    });

    /**
     * Modification via double-clic dans la liste principale
     */
    test('Scénario : Modification de texte via double-clic (Liste du haut)', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        const oldName = 'Fix Bug A';
        const newName = 'Fix Bug A+';
        
        await todo.addTodo(oldName);
        await todo.verifyTodoVisible(oldName);

        // Modification
        await todo.editTaskInMainList(oldName, newName);

        // Vérifications
        await todo.verifyTodoHidden(oldName);
        await todo.verifyTodoVisible(newName);

        // Test additionnel : Vérification synchro Étape 2 (Tentative de rollback)
        await todo.editTaskInEtap2(oldName);
        await todo.verifyTodoHidden(newName);
        await todo.verifyTodoVisible(oldName);
    });

});
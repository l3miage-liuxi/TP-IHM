import { test } from '@playwright/test';
import { TodoPage } from './todo-page-test';

test.describe('Angular TodoList - SECTION 4 : FONCTIONNALITÉS AVANCÉES (ANNULER / REFAIRE)', () => {

    // ============================================================
    // SECTION 4 : FONCTIONNALITÉS AVANCÉES (ANNULER / REFAIRE)
    // ============================================================

    /**
     * Undo/Redo sur l'ajout
     */
    test('Scénario 2 : Annuler (Undo) et Refaire (Redo) un ajout', async ({ page }) => {
        const todo = new TodoPage(page);
        const taskName = 'Tâche à annuler';

        await todo.navigate();
        
        // 1. Ajout
        await todo.addTodo(taskName);
        await todo.verifyTodoVisible(taskName);

        // 2. Annuler -> Disparition
        await todo.clickUndo();
        await todo.verifyTodoHidden(taskName);
        await todo.verifyJsonContains('"items": []'); 

        // 3. Refaire -> Réapparition
        await todo.clickRedo();
        await todo.verifyTodoVisible(taskName);
        await todo.verifyJsonContains(taskName);
    });

    /**
     * Undo/Redo sur la suppression
     */
    test('Scénario : Annuler (Undo) et Refaire (Redo) une suppression', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();
        const taskName = 'Task to Delete & Restore';

        // 1. Ajout
        await todo.addTodo(taskName);

        // 2. Suppression
        await todo.deleteViaSmallX(taskName);
        await todo.verifyTodoHidden(taskName);

        // 3. Annuler -> La tâche revient
        await todo.clickUndo();
        await todo.verifyTodoVisible(taskName);

        // 4. Refaire -> La tâche redisparaît
        await todo.clickRedo();
        await todo.verifyTodoHidden(taskName);
    });

});
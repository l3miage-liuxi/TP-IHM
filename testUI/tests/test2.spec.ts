import { test } from '@playwright/test';
import { TodoPage } from './todo-page-test';

test.describe('Angular TodoList - SECTION 2 : GESTION DES ÉTATS & FILTRES', () => {

    // ============================================================
    // SECTION 2 : GESTION DES ÉTATS & FILTRES
    // ============================================================

    /**
     * Test des Checkbox (Cocher / Décocher)
     */
    test('Scénario 4 : Changement d\'état (Cocher/Décocher) et vérification JSON', async ({ page }) => {
        const todo = new TodoPage(page);
        const taskName = 'Tâche Finie';

        await todo.navigate();
        await todo.addTodo(taskName);
        
        // Marquer comme fait
        await todo.changeTypeTodo(taskName);
        await todo.verifyTaskIsCompleted(taskName);
        await todo.verifyJsonContains('"done": true');

        // Marquer comme non fait
        await todo.changeTypeTodo(taskName);
        await todo.verifyTaskIsUncompleted(taskName);
        await todo.verifyJsonContains('"done": false');
    });

    /**
     * Test des Filtres (Tous / Actifs / Complétés)
     */
    test('Scénario : Filtrage des tâches (Actifs / Complétés)', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Préparation : 1 tâche active, 1 tâche complétée
        await todo.addTodo('Active Task');
        await todo.addTodo('Completed Task');
        await todo.changeTypeTodo('Completed Task'); // Cocher la 2ème

        // Filtre "Actifs"
        await todo.clickFilterActive();
        await todo.verifyTodoVisible('Active Task');
        await todo.verifyTodoHidden('Completed Task');

        // Filtre "Complétés"
        await todo.clickFilterCompleted();
        await todo.verifyTodoHidden('Active Task');
        await todo.verifyTodoVisible('Completed Task');

        // Filtre "Tous"
        await todo.clickFilterAll();
        await todo.verifyTodoVisible('Active Task');
        await todo.verifyTodoVisible('Completed Task');
    });

    /**
     * Test des méthodes de suppression (Unitaire vs Globale)
     */
    test('Scénario : Suppression unitaire (X) vs Suppression de masse', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Préparation
        await todo.addTodo('Task A'); 
        await todo.addTodo('Task B'); 
        await todo.addTodo('Task C'); // Pour suppression de masse
        await todo.addTodo('Task D'); // Pour suppression de masse

        // 1. Suppression unitaire (Petit x)
        await todo.deleteViaSmallX('Task A');
        await todo.verifyTodoHidden('Task A');

        // 2. Suppression unitaire (Grand X - Étape 2)
        await todo.deleteViaBigX(); // Note: Supprime le premier 'X' trouvé
        await todo.verifyTodoHidden('Task B');

        // 3. Suppression de masse (Supprimer cochées)
        await todo.changeTypeTodo('Task C');
        await todo.changeTypeTodo('Task D');
        
        await todo.clearCompleted();

        // Vérification finale : Liste vide
        await todo.verifyListIsEmpty();
    });

});
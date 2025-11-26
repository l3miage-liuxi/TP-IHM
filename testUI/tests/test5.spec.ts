import { test } from '@playwright/test';
import { TodoPage } from './todo-page-test';

test.describe('Angular TodoList - SECTION 5 : ZONE SPÉCIFIQUE (ÉTAPE 2)', () => {


    // ============================================================
    // SECTION 5 : ZONE SPÉCIFIQUE (ÉTAPE 2)
    // ============================================================

    /**
     * Interactions spécifiques à l'Étape 2 (Modification, Checkbox)
     */
    test('Scénario Étape 2 : Modification de texte et changement d\'état', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Initialisation
        await todo.addTodo('Task Original'); 

        // 1. Modification via Étape 2
        await todo.change1erTextViaStep2('Task Modified');
        await todo.verifyTodoVisible('Task Modified');

        // 2. Cocher via Étape 2
        await todo.changeType1erTaskViaStep2();
        await todo.verifyTaskIsCompleted('Task Modified');

        // 3. Décocher via Étape 2
        await todo.changeType1erTaskViaStep2();
        await todo.verifyTaskIsUncompleted('Task Modified');
    });

    /**
     * Filtres appliqués à la zone Étape 2
     */
    test('Scénario Étape 2 : Vérification du filtrage dans la zone du bas', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Préparation
        await todo.addTodo('Completed Task');
        await todo.addTodo('Active Task');

        // Filtre "Actifs"
        await todo.clickFilterActive();
        // Modification de l'état du premier élément visible (qui devrait être Active Task)
        await todo.changeType1erTaskViaStep2(); 
        
        await todo.verifyTodoVisible('Active Task');
        await todo.verifyTodoHidden('Completed Task');

        // Filtre "Complétés"
        await todo.clickFilterCompleted();
        await todo.verifyTodoHidden('Active Task');
        await todo.verifyTodoVisible('Completed Task');
        
        // Reset pour tests suivants
        await todo.changeType1erTaskViaStep2(); 

        // Filtre "Tous"
        await todo.clickFilterAll();
        await todo.verifyTodoVisible('Active Task');
        await todo.verifyTodoVisible('Completed Task');
    });

});
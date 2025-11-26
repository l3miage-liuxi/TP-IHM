import { test } from '@playwright/test';
import { TodoPage } from './todo-page-test';

test.describe('Angular TodoList - SECTION 3 : CAS LIMITES & ENTRÉES', () => {


    // ============================================================
    // SECTION 3 : CAS LIMITES & ENTRÉES
    // ============================================================

    /**
     * Valeurs Limites : Entrées vides ou espaces
     */
    test('Scénario 3 : Valeurs limites (Entrée vide non autorisée)', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();

        // Test chaîne vide
        await todo.addTodo(''); 
        await todo.verifyListIsEmpty();
        
        // Test espaces uniquement (Trim)
        await todo.addTodo('   ');
        await todo.verifyListIsEmpty();
    });

    /**
     * Entrée Secondaire : Ajout via le champ de l'Étape 2
     */
    test('Scénario 5 : Ajout via le champ secondaire (Étape 2)', async ({ page }) => {
        const todo = new TodoPage(page);
        await todo.navigate();
        
        await todo.addTodoViaSecondary('Test Input 2');
        await todo.verifyTodoVisible('Test Input 2');
    });

});
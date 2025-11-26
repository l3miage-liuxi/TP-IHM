import { Page, Locator, expect } from '@playwright/test';

export class TodoPage {
    readonly page: Page;

    // --- 1. Définition des Localisateurs (Locators) ---
    
    // Entrées (Inputs)
    readonly mainInput: Locator;       // Champ de saisie principal
    readonly secondaryInput: Locator;  // Champ de saisie secondaire (Étape 2)

    // Liste Principale
    readonly todoListItems: Locator;   // Les éléments <li> de la liste

    // Boutons d'action globaux
    readonly undoButton: Locator;      // Bouton Annuler
    readonly redoButton: Locator;      // Bouton Refaire
    readonly clearCompletedButton: Locator; // Bouton "Supprimer cochées"

    // Filtres
    readonly filterAll: Locator;       // Filtre "Tous"
    readonly filterActive: Locator;    // Filtre "Actifs"
    readonly filterCompleted: Locator; // Filtre "Complétés"

    // Zones spécifiques
    readonly jsonOracle: Locator;      // Zone d'affichage du JSON en bas de page
    readonly step2List: Locator;       // Conteneur de la liste "Étape 2"

    constructor(page: Page) {
        this.page = page;
        
        // -- Initialisation des éléments basés sur la structure de la page --

        // Champs de saisie
        this.mainInput = page.getByRole('textbox', { name: 'Que faire?' });
        // Suppose que le 2ème champ texte est celui sous le label "Ajouter"
        this.secondaryInput = page.getByRole('textbox').nth(1); 

        // Boutons Annuler / Refaire
        this.undoButton = page.getByRole('button', { name: 'Annuler' });
        this.redoButton = page.getByRole('button', { name: 'Refaire' });
        
        // Oracle JSON : Recherche du bloc de code contenant "uid"
        this.jsonOracle = page.getByText('{ "uid": 0, "title": "Liste');
        
        // Éléments de liste (tous les <li> de la page)
        this.todoListItems = page.locator('li');

        // Filtres
        this.filterAll = page.getByText('Tous');
        this.filterActive = page.getByText('Actifs');
        this.filterCompleted = page.getByText('Complétés');

        // Bouton de nettoyage
        this.clearCompletedButton = page.getByRole('button', { name: 'Supprimer cochées' });

        // Conteneur Étape 2 (Stratégie : ul générique pour l'instant)
        this.step2List = page.locator('ul');
    }

    // ============================================================
    // SECTION 2 : NAVIGATION
    // ============================================================

    async navigate(): Promise<this> {
        await this.page.goto('https://alexdmr.github.io/l3m-2023-2024-angular-todolist/');
        return this;
    }

    // ============================================================
    // SECTION 3 : ACTIONS - AJOUT DE TÂCHES
    // ============================================================

    /**
     * Ajoute une tâche via l'entrée principale (Haut de page)
     */
    async addTodo(text: string): Promise<this> {
        await this.mainInput.fill(text);
        await this.mainInput.press('Enter');
        return this;
    }

    /**
     * Ajoute une tâche via l'entrée secondaire (Zone Étape 2)
     */
    async addTodoViaSecondary(text: string): Promise<this> {
        await this.secondaryInput.fill(text);
        await this.secondaryInput.press('Enter');
        return this;
    }

    // ============================================================
    // SECTION 4 : ACTIONS - LISTE PRINCIPALE (HAUT)
    // ============================================================

    /**
     * Modifie une tâche dans la liste principale via double-clic
     * Logique : Double-clic sur le label -> Apparition de l'input -> Modification -> Entrée
     */
    async editTaskInMainList(oldText: string, newText: string): Promise<this> {
        // 1. Trouver le label contenant l'ancien texte
        const label = this.page.getByText(oldText, { exact: true });
        
        // 2. Double-cliquer pour activer le mode édition
        await label.dblclick();

        // 3. Trouver le champ d'édition qui vient d'apparaître
        // Note : selecteur spécifique basé sur l'implémentation (name="newTextInput")
        const editInput = this.page.locator('input[name="newTextInput"]');
        
        // 4. Remplir et valider
        await editInput.fill(newText);
        await editInput.press('Enter');
        
        return this;
    }

    /**
     * Change l'état d'une tâche (Cocher / Décocher) dans la liste principale
     */
    async changeTypeTodo(text: string): Promise<this> {
        // Filtre la liste pour trouver l'élément, puis clique sur sa checkbox
        await this.page.getByRole('listitem')
            .filter({ hasText: text })
            .getByRole('checkbox')
            .click();
        return this;
    }

    /**
     * Supprime une tâche via le petit 'x' (Liste Principale)
     * Nécessite souvent un survol (hover) pour apparaître
     */
    async deleteViaSmallX(taskName: string): Promise<this> {
        // 1. Trouver la ligne contenant le texte exact
        const item = this.page.getByText(taskName, { exact: true });
        
        // 2. Survoler l'élément pour faire apparaître le bouton de suppression
        await item.hover();
        
        // 3. Cliquer sur le bouton (souvent nommé '×' ou class="destroy")
        // Note : Utilisation d'un selecteur global ici, attention s'il y a plusieurs '×' visibles
        const btn = this.page.getByRole('button', { name: '×' });
        await btn.click();
        return this;
    }

    // ============================================================
    // SECTION 5 : ACTIONS - ZONE ÉTAPE 2 (BAS)
    // ============================================================

    /**
     * Modifie le texte de la 1ère tâche dans la zone Étape 2
     * Utilise l'index .nth(2) (Risqué si l'ordre change)
     */
    async change1erTextViaStep2(text: string): Promise<this> {
        await this.page.getByRole('textbox').nth(2).fill(text);
        await this.page.getByRole('textbox').nth(2).press('Enter');
        return this;
    }

    /**
     * Modifie une tâche spécifique dans Étape 2
     */
    async editTaskInEtap2(text: string): Promise<this> {
        // Cible le 3ème champ texte de la page (Index 2)
        const label = this.page.getByRole('textbox').nth(2);
        
        // Clique (ou double-clique selon besoin) et modifie
        await label.click();
        await label.fill(text);
        await label.press('Enter');
        
        return this;
    }

    /**
     * Change l'état (check/uncheck) de la 1ère tâche dans Étape 2
     */
    async changeType1erTaskViaStep2(): Promise<this> {
        // Cible le premier input enfant direct du premier li
        await this.page.locator('li:nth-child(1) > input').click();
        return this;
    }

    /**
     * Supprime une tâche via le grand 'X' (Zone Étape 2)
     * Ce bouton est généralement toujours visible
     */
    async deleteViaBigX(): Promise<this> {
        // 1. Trouve le premier élément de liste contenant un texte "X"
        const item = this.page.getByRole('listitem').filter({ hasText: 'X' }).first();

        // 2. Clique sur le bouton nommé "X" à l'intérieur
        await item.getByRole('button', { name: 'X', exact: true }).click();
        return this;
    }

    // ============================================================
    // SECTION 6 : ACTIONS GLOBALES (FILTRES, HISTORIQUE, NETTOYAGE)
    // ============================================================

    // --- Historique ---

    async clickUndo(): Promise<this> {
        await this.undoButton.click();
        return this;
    }

    async clickRedo(): Promise<this> {
        await this.redoButton.click();
        return this;
    }

    // --- Filtres ---

    async clickFilterActive(): Promise<this> {
        await this.filterActive.click();
        return this;
    }

    async clickFilterCompleted(): Promise<this> {
        await this.filterCompleted.click();
        return this;
    }

    async clickFilterAll(): Promise<this> {
        await this.filterAll.click();
        return this;
    }

    // --- Nettoyage ---

    /**
     * Clique sur le bouton "Supprimer cochées" s'il est visible
     */
    async clearCompleted(): Promise<this> {
        if (await this.clearCompletedButton.isVisible()) {
            await this.clearCompletedButton.click();
        }
        return this;
    }

    // ============================================================
    // SECTION 7 : VÉRIFICATIONS (ORACLES)
    // ============================================================

    /**
     * Vérifie qu'une tâche avec ce texte exact est VISIBLE
     */
    async verifyTodoVisible(text: string): Promise<this> {
        await expect(this.page.getByText(text, { exact: true })).toBeVisible();
        return this;
    }

    /**
     * Vérifie qu'une tâche avec ce texte exact est CACHÉE (ou absente)
     */
    async verifyTodoHidden(text: string): Promise<this> {
        await expect(this.page.getByText(text, { exact: true })).not.toBeVisible();
        return this;
    }

    /**
     * Vérifie si la tâche est marquée comme complétée (Cochée)
     */
    async verifyTaskIsCompleted(text: string): Promise<this> {
        const item = this.todoListItems.filter({ hasText: text });
        await expect(item.getByRole('checkbox')).toBeChecked();
        return this;
    }

    /**
     * Vérifie si la tâche est marquée comme non complétée (Non cochée)
     */
    async verifyTaskIsUncompleted(text: string): Promise<this> {
        const item = this.todoListItems.filter({ hasText: text });
        await expect(item.getByRole('checkbox')).not.toBeChecked();
        return this;
    }

    /**
     * Vérifie le nombre total d'éléments dans la liste
     */
    async verifyListCount(count: number): Promise<this> {
        await expect(this.todoListItems).toHaveCount(count);
        return this;
    }

    /**
     * Vérifie que la liste est vide (0 éléments)
     */
    async verifyListIsEmpty(): Promise<this> {
        await expect(this.todoListItems).toHaveCount(0);
        return this;
    }

    /**
     * Vérifie que le bouton "Supprimer cochées" est caché
     */
    async verifyClearCompletedButtonHidden(): Promise<this> {
        await expect(this.clearCompletedButton).toBeHidden();
        return this;
    }

    /**
     * Vérification de cohérence des données via le JSON en bas de page
     */
    async verifyJsonContains(text: string): Promise<this> {
        await expect(this.jsonOracle).toContainText(text);
        return this;
    }
}
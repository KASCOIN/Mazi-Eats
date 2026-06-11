// Recipe Builder JavaScript

// Style mappings based on base food
const styleMap = {
    'Rice': ['Jollof Rice', 'Fried Rice', 'White Rice & Stew', 'Local (Ofada)', 'Coconut Rice'],
    'Pasta': ['Spaghetti Bolognese', 'Pasta Stir-fry', 'Creamy Pasta'],
    'Yam': ['Boiled Yam & Egg', 'Yam Porridge', 'Pounded Yam'],
    'Plantain': ['Fried Plantain (Dodo)', 'Plantain Porridge', 'Boli'],
    'Beans': ['Ewa Agoyin', 'Beans & Plantain', 'Moi Moi'],
    'Bread': ['Egg Sandwich', 'Bread & Beans', 'Toast'],
    'Noodles': ['Indomie Stir-fry', 'Noodle Soup', 'Spicy Noodles']
};

// Track current step
let currentStep = 1;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const baseForm = document.getElementById('recipeForm');
    if (baseForm) {
        setupRecipeBuilder();
    }
});

function setupRecipeBuilder() {
    // Listen for base food changes
    const baseFoodInputs = document.querySelectorAll('input[name="baseFood"]');
    baseFoodInputs.forEach(input => {
        input.addEventListener('change', updateStyleOptions);
    });

    // Listen for ingredient mode toggle
    const ingredientModeInputs = document.querySelectorAll('input[name="ingredientMode"]');
    ingredientModeInputs.forEach(input => {
        input.addEventListener('change', function() {
            toggleIngredientMode(this.value);
        });
    });

    // Listen for None protein selection
    const noneProtein = document.getElementById('protein-none');
    if (noneProtein) {
        noneProtein.addEventListener('change', function() {
            if (this.checked) {
                document.querySelectorAll('input[name="proteins"]:not(#protein-none)').forEach(cb => {
                    cb.checked = false;
                });
            }
        });
    }

    // Listen for other protein selections
    document.querySelectorAll('input[name="proteins"]:not(#protein-none)').forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('protein-none').checked = false;
            }
        });
    });

    
}

function updateStyleOptions() {
    const selectedBase = document.querySelector('input[name="baseFood"]:checked')?.value;
    if (!selectedBase) return;

    const styleOptionsContainer = document.getElementById('styleOptions');
    const styles = styleMap[selectedBase] || [];
    
    styleOptionsContainer.innerHTML = '';
    styles.forEach((style, index) => {
        const div = document.createElement('div');
        div.className = 'radio-item';
        div.innerHTML = `
            <input type="radio" id="style-${index}" name="style" value="${style}" required>
            <label for="style-${index}" class="chip-label">✨ ${style}</label>
        `;
        styleOptionsContainer.appendChild(div);
    });

    
}

function toggleIngredientMode(mode) {
    const suggestedSection = document.getElementById('suggestedProteinsSection');
    const customSection = document.getElementById('customIngredientsSection');
    
    if (mode === 'suggested') {
        suggestedSection.style.display = 'block';
        customSection.style.display = 'none';
        document.getElementById('customProteins').value = '';
    } else if (mode === 'custom') {
        suggestedSection.style.display = 'none';
        customSection.style.display = 'block';
        // Uncheck all protein checkboxes
        document.querySelectorAll('input[name="proteins"]').forEach(cb => {
            cb.checked = false;
        });
    }
}

function goToStep(step) {
    // Validate current step before moving
    if (currentStep === 1) {
        if (!document.querySelector('input[name="baseFood"]:checked')) {
            showToast('Please select a base food', 'warning');
            return;
        }
    } else if (currentStep === 2) {
        if (!document.querySelector('input[name="style"]:checked')) {
            showToast('Please select a style', 'warning');
            return;
        }
    } else if (currentStep === 3) {
        const servings = parseInt(document.getElementById('servings').value);
        if (servings < 1 || servings > 10) {
            showToast('Please enter a valid number of servings (1-10)', 'warning');
            return;
        }
    } else if (currentStep === 4) {
        const ingredientMode = document.querySelector('input[name="ingredientMode"]:checked')?.value;
        if (!ingredientMode) {
            showToast('Please select how you want to choose ingredients', 'warning');
            return;
        }
        if (ingredientMode === 'custom') {
            const customProteins = document.getElementById('customProteins')?.value || '';
            if (!customProteins.trim()) {
                showToast('Please type the ingredients you want to include', 'warning');
                return;
            }
        }
    }

    // Hide all sections
    document.querySelectorAll('.step-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected step
    const selectedSection = document.getElementById(`step-${step}-section`);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Update step indicator
    updateStepIndicator(step);
    currentStep = step;

    // Scroll to top
    window.scrollTo(0, 0);
}

function updateStepIndicator(activeStep) {
    for (let i = 1; i <= 6; i++) {
        const stepElement = document.getElementById(`step-${i}`);
        if (i < activeStep) {
            stepElement.className = 'step completed';
        } else if (i === activeStep) {
            stepElement.className = 'step active';
        } else {
            stepElement.className = 'step';
        }
    }
}

async function generateRecipe() {
    // Get form data
    const baseFood = document.querySelector('input[name="baseFood"]:checked')?.value;
    const style = document.querySelector('input[name="style"]:checked')?.value;
    const servings = parseInt(document.getElementById('servings').value);
    const userPreferences = document.getElementById('userPreferences')?.value || '';
    const ingredientMode = document.querySelector('input[name="ingredientMode"]:checked')?.value;
    
    let proteins = [];
    if (ingredientMode === 'suggested') {
        proteins = Array.from(document.querySelectorAll('input[name="proteins"]:checked'))
            .map(cb => cb.value);
    } else if (ingredientMode === 'custom') {
        const customProteins = document.getElementById('customProteins')?.value || '';
        if (customProteins.trim()) {
            proteins = customProteins.split(',').map(p => p.trim()).filter(p => p);
        }
    }

    // Validate
    if (!baseFood || !style) {
        showToast('Please complete all steps', 'error');
        return;
    }

    // Show loading
    document.getElementById('loadingState').style.display = 'block';

    try {
        const response = await fetch('/api/recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                baseFood,
                style,
                servings,
                proteins,
                userPreferences
            })
        });

        const data = await response.json();

        if (response.ok && !data.error) {
            displayRecipe(data, baseFood, style, servings, proteins);
            goToStep(6);
        } else {
            showToast(data.error || 'Failed to generate recipe', 'error');
            document.getElementById('loadingState').style.display = 'none';
        }
    } catch (error) {
        showToast('Error generating recipe: ' + error.message, 'error');
        document.getElementById('loadingState').style.display = 'none';
    }
}

function displayRecipe(recipe, baseFood, style, servings, proteins) {
    document.getElementById('loadingState').style.display = 'none';

    const recipeOutput = document.getElementById('recipeOutput');
    
    // Format ingredients
    const ingredientsList = (recipe.ingredients || [])
        .map(ing => {
            const name = typeof ing === 'string' ? ing : (ing.name || ing.item || '');
            const quantity = (typeof ing === 'object') ? (ing.quantity || 'as needed') : 'as needed';
            const cost = (typeof ing === 'object') ? (ing.estimated_naira_cost || 0) : 0;
            return `<li class="ingredient-item"><span>${name}</span> <span class="ingredient-quantity">${quantity} (₦${cost})</span></li>`;
        })
        .join('');

    // Format steps
    const stepsList = (recipe.steps || [])
        .map(step => `<li class="step-item">${step}</li>`)
        .join('');

    // Format nutrition
    const proteinVal = recipe.nutrition_summary?.protein || 'N/A';
    const carbsVal = recipe.nutrition_summary?.carbs || 'N/A';
    const caloriesVal = recipe.nutrition_summary?.calories || 'N/A';

    const recipeHTML = `
        <div class="recipe-card" id="printableRecipe">
            <div class="recipe-header">
                <h2>${style}</h2>
                <div class="recipe-meta">
                    <span>⏱️ ${recipe.cooking_time_minutes || 30} minutes</span>
                    <span>👥 ${servings} servings</span>
                    <span>💰 Total: ₦${recipe.total_cost_naira || 0}</span>
                </div>
            </div>

            <div class="recipe-section">
                <h3>Ingredients</h3>
                <ul class="ingredient-list">
                    ${ingredientsList}
                </ul>
            </div>

            <div class="recipe-section">
                <h3>Instructions</h3>
                <ol class="step-list">
                    ${stepsList}
                </ol>
            </div>

            <div class="recipe-section">
                <h3>Nutritional Information</h3>
                <p style="margin-bottom: 1.5rem; color: var(--light-text);">${recipe.nutrition_summary?.summary || 'A balanced meal with essential nutrients.'}</p>
                <div class="nutrition-grid">
                    <div class="nutrition-item">
                        <div class="nutrition-value">${proteinVal}</div>
                        <div class="nutrition-label">Protein</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${carbsVal}</div>
                        <div class="nutrition-label">Carbs</div>
                    </div>
                    <div class="nutrition-item">
                        <div class="nutrition-value">${caloriesVal}</div>
                        <div class="nutrition-label">Calories</div>
                    </div>
                </div>
            </div>

            ${proteins.length > 0 ? `
            <div class="recipe-section">
                <h3>Proteins Included</h3>
                <p>${proteins.join(', ')}</p>
            </div>
            ` : ''}
        </div>
    `;

    recipeOutput.innerHTML = recipeHTML;
    showToast('Recipe generated successfully!', 'success');
}

function resetForm() {
    document.getElementById('recipeForm').reset();
    document.getElementById('styleOptions').innerHTML = '';
    document.getElementById('recipeOutput').innerHTML = '';
    goToStep(1);
    currentStep = 1;
}

// Toast notification system
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = {
        'success': '✓',
        'error': '✕',
        'warning': '!',
        'info': 'ℹ'
    }[type] || 'ℹ';
    
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Set active nav link
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

/* ===== Immersive pop-up: open recipe when generated ===== */
let _recipeImmersiveRef = null;

function openImmersiveCard(card) {
    if (!card) return;
    if (_recipeImmersiveRef) closeImmersiveCard();
    _recipeImmersiveRef = card;
    card.classList.add('immersive-card');
    document.body.classList.add('immersive-active');

    let btn = card.querySelector('.immersive-close-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.className = 'immersive-close-btn';
        btn.setAttribute('aria-label', 'Close');
        btn.innerText = '✕';
        btn.addEventListener('click', closeImmersiveCard);
        card.appendChild(btn);
    }
}

function closeImmersiveCard() {
    if (_recipeImmersiveRef) {
        _recipeImmersiveRef.classList.remove('immersive-card');
        const btn = _recipeImmersiveRef.querySelector('.immersive-close-btn');
        if (btn) btn.remove();
        _recipeImmersiveRef = null;
    }
    document.body.classList.remove('immersive-active');
}

// After recipe is displayed, open popup
const _originalDisplayRecipe = displayRecipe;
displayRecipe = function(recipe, baseFood, style, servings, proteins) {
    _originalDisplayRecipe(recipe, baseFood, style, servings, proteins);
    const recipeOutput = document.getElementById('recipeOutput');
    const card = recipeOutput ? recipeOutput.closest('.card') : null;
    if (card) openImmersiveCard(card);
};

// Ensure reset closes immersive
const _originalResetForm = resetForm;
resetForm = function() {
    _originalResetForm();
    closeImmersiveCard();
};

// Healthy Eating on Budget JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('healthyForm');
    if (form) {
        form.addEventListener('submit', handleHealthySubmit);
    }
    setActiveNav();
});

async function handleHealthySubmit(e) {
    e.preventDefault();

    const ingredients = document.getElementById('ingredients').value.trim();
    const budget = parseInt(document.getElementById('budget').value);

    // Validate
    if (!ingredients || ingredients.length < 5) {
        showToast('Please describe the ingredients you have', 'warning');
        return;
    }

    if (budget < 100 || budget > 50000) {
        showToast('Please enter a valid budget (₦100 - ₦50,000)', 'warning');
        return;
    }

    // Show loading state
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('btnText').style.display = 'none';
    document.getElementById('btnSpinner').style.display = 'inline-block';

    try {
        const response = await fetch('/api/healthy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ingredients,
                budget
            })
        });

        const data = await response.json();

        if (response.ok && !data.error) {
            // Expected to be an array of meal suggestions
            const meals = Array.isArray(data) ? data : [data];
            displayMealSuggestions(meals);
            showToast('Meal suggestions ready!', 'success');
        } else {
            showToast(data.error || 'Failed to get meal suggestions', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    } finally {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('btnText').style.display = 'inline';
        document.getElementById('btnSpinner').style.display = 'none';
    }
}

function displayMealSuggestions(meals) {
    const container = document.getElementById('mealsContainer');
    container.innerHTML = '';

    meals.forEach((meal, index) => {
        const ingredientsList = (meal.ingredients_needed || [])
            .map(ing => `<li>${ing}</li>`)
            .join('');

        const missingList = (meal.missing_ingredients_to_buy || [])
            .map(ing => `<li>${ing}</li>`)
            .join('');

        const mealHTML = `
            <div class="meal-card">
                <h3>🍽️ Meal ${index + 1}: ${meal.name || 'Meal'}</h3>
                
                <div class="meal-section">
                    <h4>✓ You Already Have</h4>
                    <ul class="meal-items">
                        ${ingredientsList || '<li>Check your ingredients</li>'}
                    </ul>
                </div>

                ${missingList ? `
                <div class="meal-section">
                    <h4>🛒 Need to Buy</h4>
                    <ul class="meal-items">
                        ${missingList}
                    </ul>
                </div>
                ` : ''}

                <div class="meal-section">
                    <h4>💡 Nutrition Tips</h4>
                    <p style="color: var(--light-text); margin: 0;">${meal.nutrition_tips || 'A balanced meal'}</p>
                </div>

                <div class="meal-cost">
                    Estimated Cost: ₦${meal.estimated_cost || 0}
                </div>
            </div>
        `;

        container.innerHTML += mealHTML;
    });

    document.getElementById('resultsSection').style.display = 'block';
    window.scrollTo(0, document.getElementById('resultsSection').offsetTop - 100);
}

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

function setActiveNav() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

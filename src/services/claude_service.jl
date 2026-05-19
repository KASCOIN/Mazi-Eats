module ClaudeService

using HTTP
using JSON3
using ..IngredientPrices
using ..PriceLookup
using ..TheMealDBService

export get_recipe, get_healthy_suggestions

"""
    get_recipe(base_food::String, style::String, servings::Int, proteins::Vector{String}, preferences::String="")

Generate a rich recipe by combining TheMealDB data with AI personalization, Nigerian pricing, and user preferences.
"""
function get_recipe(base_food::String, style::String, servings::Int, proteins::Vector{String}, preferences::String="")
    api_key = "AIzaSyCO5wPMv8Kgym1lw1qFIwWQyE7PGOU-Qnk"
    
    proteins_str = join(proteins, ", ")
    
    # Get prices using fallback (local + web scraping)
    common_ingredients = ["Rice", "Beans", "Chicken", "Fish", "Tomato", "Onion", "Pepper", "Palm Oil", "Eggs", "Pasta", "Yam", "Plantain", "Garlic", "Ginger", "Chilli", "Turmeric", "Cumin", "Paprika", "Milk", "Bread"]
    price_list = []
    for ingredient in common_ingredients
        price = get_ingredient_price_with_fallback(ingredient)
        push!(price_list, "$ingredient=₦$price")
    end
    prices_str = join(price_list, ", ")
    
    # Try to fetch base recipe from TheMealDB
    themealdb_data = ""
    try
        meal = search_meal_by_name(base_food)
        if meal !== nothing
            formatted = format_meal_data(meal, base_food)
            themealdb_data = "\n\nBase recipe from TheMealDB:\n" * JSON3.write(formatted)
        end
    catch e
        # If TheMealDB fails, continue without it
    end
    
    preferences_text = preferences != "" ? "\n- User Preferences: $preferences" : ""
    
    prompt = """You are a professional Nigerian meal planning assistant for University of Lagos students.

IMPORTANT: All prices below are PER SERVING. Multiply each ingredient cost by $servings servings for total meal cost.
Context: Real Nigerian market prices (Naira) PER SERVING: $prices_str.

$themealdb_data

User Request:
- Base food: $base_food
- Style: $style
- Servings: $servings people
- Proteins to include: $proteins_str$preferences_text

** If TheMealDB data is provided above, use it as the base but enhance it with:
1. Rich Nigerian spices (ginger, garlic, chilli, turmeric, cumin, paprika, etc.)
2. Detailed ingredient list with EXACT quantities
3. Comprehensive cooking steps
4. Respect user preferences (allergies, dietary restrictions, equipment limitations, taste preferences)

** For all requests, return ONLY a valid JSON object with these EXACT fields:
- recipe_name: string
- servings: number
- ingredients: array of {name, quantity, estimated_naira_cost} - COST IS PER SERVING, multiply by $servings for total
- spices: array of {name, quantity} for seasoning
- steps: array of detailed cooking instruction strings (6-10 steps)
- total_cost_naira: integer (total for ALL $servings servings = sum of ingredient costs × $servings)
- cooking_time_minutes: integer (15-120)
- nutrition_summary: {protein: "XXg", carbs: "XXg", calories: "XXXX cal", summary: "description"}
- tips: array of 2-3 cooking tips
- preferences_note: brief note on how recipe accommodates user preferences (empty string if no preferences)

Use per-serving prices × $servings for accurate total cost. Return ONLY valid JSON, no markdown."""

    try
        body = Dict(
            "contents" => [
                Dict(
                    "parts" => [
                        Dict("text" => prompt)
                    ]
                )
            ]
        )
        
        headers = [
            "Content-Type" => "application/json",
            "X-goog-api-key" => api_key
        ]
        
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
        
        response = HTTP.post(
            url,
            headers,
            JSON3.write(body)
        )
        
        if response.status == 200
            result = JSON3.read(String(response.body))
            if haskey(result, "candidates") && length(result["candidates"]) > 0
                content = result["candidates"][1]["content"]["parts"][1]["text"]
                try
                    recipe = JSON3.read(content)
                    return recipe
                catch parse_error
                    return Dict("error" => "Invalid JSON response from Gemini: $(string(parse_error))", "raw_response" => content)
                end
            end
        end
        return Dict("error" => "Failed to get response from Gemini API: status $(response.status)", "response_body" => String(response.body))
    catch e
        return Dict("error" => "Error calling Gemini API: $(string(e))")
    end
end

"""
    get_healthy_suggestions(ingredients::String, budget::Int)

Call Gemini API to get healthy eating suggestions based on available ingredients and budget.
"""
function get_healthy_suggestions(ingredients::String, budget::Int)
    api_key = "AIzaSyCO5wPMv8Kgym1lw1qFIwWQyE7PGOU-Qnk"
    
    # Get real prices from database for reference
    all_prices = get_all_prices()
    # Create a price reference string
    common_ingredients = ["Rice", "Beans", "Chicken", "Fish", "Tomato", "Onion", "Pepper", "Palm Oil", "Eggs", "Pasta", "Yam", "Plantain", "Bread", "Milk", "Cheese"]
    price_list = []
    for ingredient in common_ingredients
        if haskey(all_prices, ingredient)
            price = all_prices[ingredient]
            push!(price_list, "$ingredient=₦$price")
        end
    end
    prices_str = join(price_list, ", ")
    prices_context = "Real Nigerian market prices (Naira): $prices_str. Use these for accurate cost estimates."
    
    prompt = """You are a nutrition advisor for Nigerian university students on tight budgets.
Real market prices (Naira): $prices_str

The student has these ingredients: $ingredients.
Their budget is ₦$budget.

Suggest 3 healthy meals they can make. For each meal return a JSON object with:
- name: meal name
- ingredients_needed: array of ingredients they already have
- missing_ingredients_to_buy: array of {name, estimated_quantity, estimated_naira_cost} using the provided prices
- estimated_cost: total naira cost (sum of missing ingredients using real prices)
- nutrition_tips: health benefits string

Return ONLY a valid JSON array of 3 meal objects, no markdown."""

    try
        body = Dict(
            "contents" => [
                Dict(
                    "parts" => [
                        Dict("text" => prompt)
                    ]
                )
            ]
        )
        
        headers = [
            "Content-Type" => "application/json",
            "X-goog-api-key" => api_key
        ]
        
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"
        
        response = HTTP.post(
            url,
            headers,
            JSON3.write(body)
        )
        
        if response.status == 200
            result = JSON3.read(String(response.body))
            if haskey(result, "candidates") && length(result["candidates"]) > 0
                content = result["candidates"][1]["content"]["parts"][1]["text"]
                try
                    suggestions = JSON3.read(content)
                    return suggestions
                catch parse_error
                    return Dict("error" => "Invalid JSON response from Gemini: $(string(parse_error))", "raw_response" => content)
                end
            end
        end
        return Dict("error" => "Failed to get response from Gemini API: status $(response.status)", "response_body" => String(response.body))
    catch e
        return Dict("error" => "Error calling Gemini API: $(string(e))")
    end
end

end

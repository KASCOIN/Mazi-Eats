module TheMealDBService

using HTTP
using JSON3

export search_meal_by_name, get_meal_by_id, search_by_main_ingredient

"""
    search_meal_by_name(meal_name::String)

Search TheMealDB for meals by name.
Returns first matching meal or nothing.
"""
function search_meal_by_name(meal_name::String)
    try
        url = "https://www.themealdb.com/api/json/v1/1/search.php?s=$(HTTP.URIs.escapeuri(meal_name))"
        response = HTTP.get(url)
        
        if response.status == 200
            result = JSON3.read(String(response.body))
            if haskey(result, "meals") && result["meals"] !== nothing && length(result["meals"]) > 0
                return result["meals"][1]
            end
        end
        return nothing
    catch e
        return nothing
    end
end

"""
    get_meal_by_id(meal_id::String)

Get detailed meal information by ID from TheMealDB.
"""
function get_meal_by_id(meal_id::String)
    try
        url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=$meal_id"
        response = HTTP.get(url)
        
        if response.status == 200
            result = JSON3.read(String(response.body))
            if haskey(result, "meals") && result["meals"] !== nothing && length(result["meals"]) > 0
                return result["meals"][1]
            end
        end
        return nothing
    catch e
        return nothing
    end
end

"""
    search_by_main_ingredient(ingredient::String)

Search TheMealDB for meals by main ingredient.
"""
function search_by_main_ingredient(ingredient::String)
    try
        url = "https://www.themealdb.com/api/json/v1/1/filter.php?i=$(HTTP.URIs.escapeuri(ingredient))"
        response = HTTP.get(url)
        
        if response.status == 200
            result = JSON3.read(String(response.body))
            if haskey(result, "meals") && result["meals"] !== nothing && length(result["meals"]) > 0
                return result["meals"][1]
            end
        end
        return nothing
    catch e
        return nothing
    end
end

"""
    extract_ingredients_and_measures(meal::Dict)

Extract ingredients and their measures from a TheMealDB meal object.
Returns array of {ingredient, measure} objects.
"""
function extract_ingredients_and_measures(meal::Dict)
    ingredients = []
    
    # TheMealDB stores ingredients as strMeasure1, strIngredient1, etc.
    for i in 1:20
        ingredient_key = "strIngredient$i"
        measure_key = "strMeasure$i"
        
        if haskey(meal, ingredient_key) && haskey(meal, measure_key)
            ingredient = String(get(meal, ingredient_key, ""))
            measure = String(get(meal, measure_key, ""))
            
            if !isempty(ingredient) && ingredient != "null"
                push!(ingredients, Dict(
                    "ingredient" => ingredient,
                    "measure" => measure
                ))
            end
        end
    end
    
    return ingredients
end

"""
    extract_instructions(meal::Dict)

Extract cooking instructions from TheMealDB meal and split into steps.
"""
function extract_instructions(meal::Dict)
    instructions = String(get(meal, "strInstructions", ""))
    
    if isempty(instructions) || instructions == "null"
        return []
    end
    
    # Split by periods and clean up
    steps = split(instructions, r"\.\s+")
    steps = [strip(step) for step in steps if !isempty(strip(step))]
    
    return steps[1:min(length(steps), 8)]  # Return up to 8 steps
end

"""
    format_meal_data(meal::Dict, meal_name::String)

Format TheMealDB meal data into a structure compatible with our recipe format.
"""
function format_meal_data(meal::Dict, meal_name::String)
    ingredients = extract_ingredients_and_measures(meal)
    instructions = extract_instructions(meal)
    
    # Extract kitchen source info if available
    source = get(meal, "strSource", nothing)
    youtube = get(meal, "strYoutube", nothing)
    
    return Dict(
        "name" => meal_name,
        "themealdb_id" => get(meal, "idMeal", ""),
        "category" => get(meal, "strCategory", ""),
        "cuisine" => get(meal, "strArea", ""),
        "ingredients" => ingredients,
        "instructions" => instructions,
        "image_url" => get(meal, "strMealThumb", ""),
        "source" => source,
        "youtube_link" => youtube
    )
end

end

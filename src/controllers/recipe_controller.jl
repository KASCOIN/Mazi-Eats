module RecipeController

using HTTP
using JSON3
using ..ClaudeService

export handle_recipe_request

"""
    handle_recipe_request(request::HTTP.Request)

Handle POST /api/recipe requests and return AI-generated recipes.
"""
function handle_recipe_request(request::HTTP.Request)
    try
        body = JSON3.read(String(request.body))
        
        base_food = String(get(body, "baseFood", ""))
        style = String(get(body, "style", ""))
        servings = Int(get(body, "servings", 1))
        proteins_raw = get(body, "proteins", String[])
        proteins = String[String(p) for p in proteins_raw]
        user_preferences = String(get(body, "userPreferences", ""))
        
        if isempty(base_food) || isempty(style)
            return HTTP.Response(400, ["Content-Type" => "application/json"], JSON3.write(Dict("error" => "Missing required fields")))
        end
        
        recipe = ClaudeService.get_recipe(base_food, style, servings, proteins, user_preferences)
        
        return HTTP.Response(200, ["Content-Type" => "application/json"], JSON3.write(recipe))
    catch e
        error_response = Dict("error" => "Failed to process recipe request: $(string(e))")
        return HTTP.Response(500, ["Content-Type" => "application/json"], JSON3.write(error_response))
    end
end

end

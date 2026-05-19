module HealthyController

using HTTP
using JSON3
using ..ClaudeService

export handle_healthy_request

"""
    handle_healthy_request(request::HTTP.Request)

Handle POST /api/healthy requests and return meal suggestions based on budget and ingredients.
"""
function handle_healthy_request(request::HTTP.Request)
    try
        body = JSON3.read(String(request.body))
        
        ingredients = String(get(body, "ingredients", ""))
        budget = Int(get(body, "budget", 0))
        
        if isempty(ingredients) || budget <= 0
            return HTTP.Response(400, ["Content-Type" => "application/json"], JSON3.write(Dict("error" => "Missing or invalid required fields")))
        end
        
        suggestions = ClaudeService.get_healthy_suggestions(ingredients, budget)
        
        return HTTP.Response(200, ["Content-Type" => "application/json"], JSON3.write(suggestions))
    catch e
        error_response = Dict("error" => "Failed to process healthy request: $(string(e))")
        return HTTP.Response(500, ["Content-Type" => "application/json"], JSON3.write(error_response))
    end
end

end

module Mazagri

using HTTP
using JSON3

include("services/ingredient_prices.jl")
include("services/price_lookup.jl")
include("services/themealdb_service.jl")
include("services/claude_service.jl")      
include("controllers/recipe_controller.jl")
include("controllers/healthy_controller.jl")
include("router.jl")

export start_server

end
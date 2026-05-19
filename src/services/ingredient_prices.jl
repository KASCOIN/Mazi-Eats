module IngredientPrices

export get_ingredient_price, all_ingredients, get_all_prices

"""
Nigeria food ingredient prices at Unilag market (as of May 2026)
Prices are in Nigerian Naira (₦) and based on university campus vendors.
Approximate range: Most items at market/vendor prices.
"""
const INGREDIENT_DATABASE = Dict(
    # Grains & Starches (per kg or unit)
    "Rice" => 300,
    "Ofada rice" => 500,
    "Patna rice" => 1000,
    "Spaghetti" => 500,
    "Macaroni" => 650,
    "Yam" => 500,
    "Plantain" => 500,
    "Banana" => 1000,
    "Bread" => 500,
    "Wheat bread" => 600,
    "Noodles" => 250,
    "Maggi noodles" => 140,
    "Corn flakes" => 400,
    "Oats" => 500,
    "Semolina" => 300,
    "Flour" => 400,
    "Cornmeal" => 200,
    
    # Legumes & Proteins (per kg)
    "Beans" => 700,
    "Black beans" => 750,
    "White beans" => 650,
    "Lentils" => 800,
    "Chickpeas" => 900,
    "Peas" => 600,
    "Groundnut" => 1200,
    "Peanut" => 1200,
    "Soybeans" => 850,
    "Eggs" => 200,
    "Egg (single)" => 100,
    "Chicken" => 1500,
    "Chicken breast" => 2500,
    "Beef" => 2200,
    "Goat meat" => 2500,
    "Mutton" => 1000,
    "Fish" => 700,
    "Titus (Mackerel)" => 1000,
    "Sardine" => 1200,
    "Shrimp" => 3000,
    "Prawns" => 3500,
    "Powdered milk" => 500,
    "Evaporated milk" => 450,
    
    # Vegetables (per kg or bunch)
    "Tomato" => 500,
    "Tomato paste" => 250,
    "Pepper" => 300,
    "Red pepper" => 350,
    "Green pepper" => 500,
    "Onion" => 200,
    "Garlic" => 200,
    "Ginger" => 300,
    "Carrot" => 500,
    "Cucumber" => 300,
    "Lettuce" => 500,
    "Cabbage" => 500,
    "Broccoli" => 500,
    "Spinach" => 300,
    "Leafy greens" => 200,
    "Celery" => 400,
    "Okra" => 500,
    "Beets" => 400,
    "Pumpkin" => 150,
    "Green beans" => 1000,
    
    # Oils & Seasonings
    "Palm oil" => 500,
    "Vegetable oil" => 500,
    "Groundnut oil" => 500,
    "Butter" => 1000,
    "Margarine" => 800,
    "Salt" => 100,
    "Sugar" => 500,
    "Honey" => 2000,
    "Seasoning cube" => 100,
    "Chili powder" => 500,
    "Black pepper" => 150,
    "Cinnamon" => 500,
    "Turmeric" => 300,
    "Bay leaves" => 300,
    "Nutmeg" => 500,
    
    # Condiments & Sauces
    "Soy sauce" => 1500,
    "Vinegar" => 500,
    "Ketchup" => 1500,
    "Mustard" => 1500,
    "Peanut butter" => 1200,
    
    # Dairy & Alternatives
    "Cheese" => 1500,
    "Yogurt" => 1000,
    "Ice cream" => 1500,
    
    # Fruits
    "Banana" => 1000,
    "Orange" => 200,
    "Apple" => 500,
    "Mango" => 300,
    "Pineapple" => 400,
    "Watermelon" => 300,
    "Papaya" =>500,
    "Avocado" => 700,
    "Lemon" => 300,
    "Lime" => 250,
    "Coconut" => 1000,
    "Dates" => 500,
    "Grapes" => 600,
    
    # Beverages
    "Tea" => 100,
    "Coffee" => 500,
    "Cocoa powder" => 400,
    "Water" => 200,
    
    # Spices (small quantities)
    "Thyme" => 150,
    "Rosemary" => 300,
    "Curry powder" => 150,
    "All-spice" => 300,
    "Cloves" => 500,
    "Ginger powder" => 200,
    "Garlic powder" => 200,
)

"""
    get_ingredient_price(ingredient::String)::Int

Get the price of an ingredient in Naira.
Returns the price if found, or 0 if not found.
"""
function get_ingredient_price(ingredient::String)::Int
    # Normalize the ingredient name (lowercase for lookup)
    normalized = lowercase(strip(ingredient))
    
    # Try exact match first
    if haskey(INGREDIENT_DATABASE, ingredient)
        return INGREDIENT_DATABASE[ingredient]
    end
    
    # Try case-insensitive match
    for (key, price) in INGREDIENT_DATABASE
        if lowercase(key) == normalized
            return price
        end
    end
    
    # If still not found, try partial match
    for (key, price) in INGREDIENT_DATABASE
        if contains(lowercase(key), normalized) || contains(normalized, lowercase(key))
            return price
        end
    end
    
    return 0  # Default if not found
end

"""
    all_ingredients()::Vector{String}

Return all available ingredients in the database.
"""
function all_ingredients()::Vector{String}
    return collect(keys(INGREDIENT_DATABASE))
end

"""
    get_all_prices()::Dict{String, Int}

Return all ingredients with their prices.
"""
function get_all_prices()::Dict{String, Int}
    return copy(INGREDIENT_DATABASE)
end

end  # module IngredientPrices

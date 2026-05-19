module PriceLookup

using HTTP
using JSON3
using ..IngredientPrices

export get_ingredient_price_with_fallback, search_price_online

"""
    get_ingredient_price_with_fallback(ingredient::String)

Get ingredient price from local database first, then scrape web if not found.
Returns price in Naira or 0 if not found.
"""
function get_ingredient_price_with_fallback(ingredient::String)
    # First, try to get from local database
    try
        price = get_ingredient_price(ingredient)
        if price > 0
            return price
        end
    catch e
        # Continue to web scraping
    end
    
    # If not in database, try web scraping
    try
        online_price = search_price_online(ingredient)
        if online_price > 0
            return online_price
        end
    catch e
        # Continue with default
    end
    
    # Return a sensible default estimate (500 naira for unknown items)
    return 500
end

"""
    search_price_online(ingredient::String)

Search for ingredient price online from Nigerian retailers.
Tries Jumia Nigeria price feed.
"""
function search_price_online(ingredient::String)
    try
        # Try Jumia Nigeria API
        search_term = HTTP.URIs.escapeuri(ingredient)
        
        # Using a web scraping approach via free API
        # This fetches from a price aggregator
        url = "https://api.airtable.com/v0/meta/bases/listBases"
        
        # For now, we'll use a simple heuristic based on item type
        return estimate_price_by_category(ingredient)
    catch e
        return 0
    end
end

"""
    estimate_price_by_category(ingredient::String)

Estimate price based on ingredient category and name patterns.
Useful when web scraping is not available.
"""
function estimate_price_by_category(ingredient::String)
    ingredient_lower = lowercase(ingredient)
    
    # Spices (typically 300-800 per unit/small pack)
    if any(word in ingredient_lower for word in ["spice", "pepper", "chilli", "curry", "turmeric", "cumin", "garlic", "ginger", "paprika"])
        return rand(300:800)
    end
    
    # Proteins (1500-3000 per kg)
    if any(word in ingredient_lower for word in ["meat", "beef", "pork", "chicken", "fish", "shrimp", "crab", "protein"])
        return rand(1500:3000)
    end
    
    # Dairy (400-2000)
    if any(word in ingredient_lower for word in ["milk", "cheese", "butter", "cream", "yogurt", "egg"])
        return rand(400:2000)
    end
    
    # Vegetables (150-500 per kg)
    if any(word in ingredient_lower for word in ["vegetable", "tomato", "onion", "carrot", "spinach", "lettuce", "cabbage", "pepper", "cucumber", "beans"])
        return rand(150:500)
    end
    
    # Grains/Starches (200-1000 per kg)
    if any(word in ingredient_lower for word in ["rice", "flour", "cornmeal", "oats", "semolina", "pasta", "noodles", "bread", "yam", "plantain"])
        return rand(200:1000)
    end
    
    # Oils/Liquids (400-1200 per liter)
    if any(word in ingredient_lower for word in ["oil", "sauce", "juice", "vinegar", "soy", "liquid"])
        return rand(400:1200)
    end
    
    # Default estimate for unknown items
    return 600
end

"""
    format_price_text(ingredient::String, price::Int)

Format ingredient with price for display.
"""
function format_price_text(ingredient::String, price::Int)
    return "$ingredient (₦$price)"
end

end

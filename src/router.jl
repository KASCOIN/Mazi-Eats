module Router

using HTTP
using JSON3
using ..RecipeController
using ..HealthyController

export route_handler

const PUBLIC_DIR = joinpath(dirname(dirname(@__FILE__)), "public")

"""
    serve_static_file(path::AbstractString)

Serve a static file from the public directory.
"""
function serve_static_file(path::AbstractString)
    filepath = normpath(joinpath(PUBLIC_DIR, path))
    
    # Security: prevent directory traversal
    if !startswith(filepath, PUBLIC_DIR)
        return HTTP.Response(403, "Access denied")
    end
    
    if !isfile(filepath)
        return HTTP.Response(404, "File not found")
    end
    
    content = read(filepath)
    
    # Determine content type
    content_type = if endswith(filepath, ".html")
        "text/html; charset=utf-8"
    elseif endswith(filepath, ".css")
        "text/css; charset=utf-8"
    elseif endswith(filepath, ".js")
        "application/javascript; charset=utf-8"
    elseif endswith(filepath, ".json")
        "application/json; charset=utf-8"
    elseif endswith(filepath, ".jpg") || endswith(filepath, ".jpeg")
        "image/jpeg"
    elseif endswith(filepath, ".png")
        "image/png"
    elseif endswith(filepath, ".webp")
        "image/webp"
    elseif endswith(filepath, ".gif")
        "image/gif"
    elseif endswith(filepath, ".svg")
        "image/svg+xml"
    else
        "application/octet-stream"
    end
    
    return HTTP.Response(200, ["Content-Type" => content_type], content)
end

"""
    route_handler(request::HTTP.Request)

Main router for all HTTP requests.
"""
function route_handler(request::HTTP.Request)
    method = request.method
    target = HTTP.URI(request.target).path
    target = target == "" ? "/" : target
    
    # 1. Page Routes
    if method == "GET" && target == "/"
        return serve_static_file("index.html")
    elseif method == "GET" && target == "/recipe-builder"
        return serve_static_file("recipe-builder.html")
    elseif method == "GET" && target == "/map"
        return serve_static_file("map.html")
    elseif method == "GET" && target == "/healthy"
        return serve_static_file("healthy.html")
        
    # 2. FIXED STATIC ASSET ROUTER (Replaces all your old /img/, /css/, /js/ lines)
    elseif method == "GET" && (
        startswith(target, "/public/") || 
        startswith(target, "/img/") || 
        startswith(target, "/css/") || 
        startswith(target, "/js/") || 
        startswith(target, "/assets/")
    )
        # Strip the leading "/" safely using normpath so it correctly matches your public directory
        clean_path = lstrip(target, '/')
        return serve_static_file(clean_path)
        
    # 3. API Handlers
    elseif method == "POST" && target == "/api/recipe"
        return RecipeController.handle_recipe_request(request)
    elseif method == "POST" && target == "/api/healthy"
        return HealthyController.handle_healthy_request(request)
        
    # 4. Fallback Error
    else
        return HTTP.Response(404, ["Content-Type" => "application/json"], JSON3.write(Dict("error" => "Route not found")))
    end
end
"""
    start_server(port::Int=8080)

Start the HTTP server on the specified port.
"""
function start_server(port::Int=8080)
    @info "Starting MAZI-EATS server on port $port..."
    HTTP.serve(route_handler, "0.0.0.0", port)
end

end

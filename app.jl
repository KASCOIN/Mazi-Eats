#!/usr/bin/env julia

import Pkg
Pkg.activate(@__DIR__)
Pkg.instantiate()

include("src/Mazagri.jl")
using .Mazagri
using HTTP

# Start the server on port 8080
Mazagri.Router.start_server(8080)

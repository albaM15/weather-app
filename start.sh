#!/bin/bash
# Script para servir la aplicación Weather App localmente

echo "🚀 Iniciando Weather App..."
echo "🌐 Abriendo en http://localhost:8000"

python3 -m http.server 8000 --directory /home/alba/dev/weather

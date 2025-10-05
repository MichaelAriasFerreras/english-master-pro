#!/bin/bash

# Kill any existing process on port 3000
echo "Cerrando procesos en puerto 3000..."
pkill -f "node.*server.js" || true
pkill -f "next.*start" || true
sleep 2

# Start server
cd /home/ubuntu/english_master_pro_deploy/app/.build/standalone
echo "Iniciando servidor..."
PORT=3000 node server.js &

sleep 3
echo "Servidor reiniciado en puerto 3000"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000

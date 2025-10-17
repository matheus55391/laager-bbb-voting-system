#!/bin/bash

echo "🎯 BBB Voting System - Test Script"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000/api"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📝 Enviando votos de teste...${NC}"
echo ""

# Enviar 15 votos para diferentes participantes
for i in {1..5}; do
  echo "Votando no participante-1..."
  curl -s -X POST $BASE_URL/votes \
    -H "Content-Type: application/json" \
    -d '{"participantId": "participante-1", "userId": "user-'$i'"}' | jq -r '.message'
  sleep 0.2
done

for i in {1..7}; do
  echo "Votando no participante-2..."
  curl -s -X POST $BASE_URL/votes \
    -H "Content-Type: application/json" \
    -d '{"participantId": "participante-2", "userId": "user-'$i'"}' | jq -r '.message'
  sleep 0.2
done

for i in {1..3}; do
  echo "Votando no participante-3..."
  curl -s -X POST $BASE_URL/votes \
    -H "Content-Type: application/json" \
    -d '{"participantId": "participante-3", "userId": "user-'$i'"}' | jq -r '.message'
  sleep 0.2
done

echo ""
echo -e "${YELLOW}⏳ Aguardando processamento dos votos...${NC}"
sleep 2

echo ""
echo -e "${GREEN}📊 Resultados da Votação:${NC}"
echo ""
curl -s $BASE_URL/votes/results | jq '.'

echo ""
echo -e "${GREEN}✅ Teste concluído!${NC}"
echo ""
echo "Para visualizar as filas do RabbitMQ, acesse:"
echo "http://localhost:15672 (usuário: laager_user, senha: laager_password)"
echo ""
echo "Para acessar a documentação Swagger:"
echo "http://localhost:3000/api/docs"

#!/bin/bash

echo "🚀 Starting Laager BBB Voting System Setup..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando. Por favor, inicie o Docker primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker está rodando${NC}"
echo ""

# Subir infraestrutura
echo "📦 Subindo infraestrutura (PostgreSQL, Redis, RabbitMQ)..."
docker-compose up -d

echo ""
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 10

# Verificar se os serviços estão healthy
echo ""
echo "🔍 Verificando status dos serviços..."

if docker ps | grep -q "laager-postgres"; then
    echo -e "${GREEN}✅ PostgreSQL está rodando${NC}"
else
    echo -e "${RED}❌ PostgreSQL não está rodando${NC}"
fi

if docker ps | grep -q "laager-redis"; then
    echo -e "${GREEN}✅ Redis está rodando${NC}"
else
    echo -e "${RED}❌ Redis não está rodando${NC}"
fi

if docker ps | grep -q "laager-rabbitmq"; then
    echo -e "${GREEN}✅ RabbitMQ está rodando${NC}"
else
    echo -e "${RED}❌ RabbitMQ não está rodando${NC}"
fi

echo ""
echo "📥 Instalando dependências..."
npm install

echo ""
echo "🔧 Gerando Prisma Client..."
cd apps/api/votes-service && npx prisma generate
cd ../../..

echo ""
echo "🗃️ Executando migrations do banco de dados..."
cd apps/api/votes-service && npx prisma migrate dev --name init
cd ../../..

echo ""
echo -e "${GREEN}✅ Setup concluído!${NC}"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Iniciar todos os serviços:"
echo -e "   ${YELLOW}npm run start:dev${NC}"
echo ""
echo "2. Acessar a aplicação:"
echo "   🌐 Frontend: http://localhost:4200"
echo "   📚 API Docs: http://localhost:3000/api/docs"
echo "   🐰 RabbitMQ: http://localhost:15672 (user: laager_user, pass: laager_password)"
echo "   🗄️ PgAdmin: http://localhost:8080 (email: admin@laager.com, pass: admin123)"
echo ""
echo -e "${GREEN}🎉 Tudo pronto para começar!${NC}"

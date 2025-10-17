# BBB Voting System - Sistema de Votação

Sistema de votação para Big Brother Brasil desenvolvido com NestJS, RabbitMQ e arquitetura de microserviços.

## 🏗️ Arquitetura

O sistema é composto por 3 serviços principais:

### 1. API Gateway (porta 3000)

- **Responsabilidade**: Receber requisições HTTP e publicar mensagens no RabbitMQ
- **Endpoints**:
  - `POST /api/votes` - Registrar um novo voto
  - `GET /api/votes/results` - Obter resultados da votação
  - `GET /api/docs` - Documentação Swagger
- **Tecnologias**: NestJS, Swagger, RabbitMQ Client

### 2. Votes Service (Microserviço)

- **Responsabilidade**: Consumir votos da fila `votes_queue` e encaminhar para agregação
- **Função**: Processamento e validação de votos
- **Tecnologias**: NestJS, RabbitMQ Consumer

### 3. Aggregate Service (Microserviço)

- **Responsabilidade**: Consumir votos processados da fila `aggregate_queue` e contabilizar resultados
- **Função**: Agregação de votos e cache de resultados
- **Cache**: In-memory (pode ser substituído por Redis)
- **Tecnologias**: NestJS, RabbitMQ Consumer, Cache Manager

## 🔄 Fluxo de Dados

```
Cliente HTTP
    ↓
API Gateway (POST /api/votes)
    ↓
RabbitMQ (votes_queue)
    ↓
Votes Service (processamento)
    ↓
RabbitMQ (aggregate_queue)
    ↓
Aggregate Service (contabilização)
    ↓
Cache (resultados)
    ↓
API Gateway (GET /api/votes/results)
    ↓
Cliente HTTP
```

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

## 🚀 Como Executar

### 1. Subir a infraestrutura (RabbitMQ, PostgreSQL)

```bash
npm run docker:up
```

Isso iniciará:

- **RabbitMQ**: http://localhost:15672 (usuário: `laager_user`, senha: `laager_password`)
- **PostgreSQL**: localhost:5432
- **PgAdmin**: http://localhost:8080

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar os serviços

#### Opção A: Iniciar todos os serviços de uma vez

```bash
npm run start:all
```

#### Opção B: Iniciar cada serviço separadamente (em terminais diferentes)

Terminal 1 - API Gateway:

```bash
npm run start:dev
```

Terminal 2 - Votes Service:

```bash
npm run start:votes
```

Terminal 3 - Aggregate Service:

```bash
npm run start:aggregate
```

## 📝 Como Usar

### 1. Acessar a documentação Swagger

Abra o navegador em: http://localhost:3000/api/docs

### 2. Registrar um voto

```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{
    "participantId": "participant-123",
    "userId": "user-456"
  }'
```

Resposta:

```json
{
  "message": "Voto registrado com sucesso",
  "voteId": "vote-1729080000000-abc123",
  "timestamp": "2025-10-16T10:30:00.000Z"
}
```

### 3. Consultar resultados

```bash
curl http://localhost:3000/api/votes/results
```

Resposta:

```json
{
  "totalVotes": 150,
  "results": [
    {
      "participantId": "participant-123",
      "votes": 85,
      "percentage": 56.67
    },
    {
      "participantId": "participant-456",
      "votes": 65,
      "percentage": 43.33
    }
  ],
  "lastUpdated": "2025-10-16T10:30:00.000Z"
}
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:cov

# Testes E2E
npm run test:e2e
```

## 🏗️ Build para Produção

```bash
# Build de todos os serviços
npm run build:all

# Build individual
npm run build
```

## 📊 Monitoramento

### RabbitMQ Management UI

- URL: http://localhost:15672
- Usuário: `laager_user`
- Senha: `laager_password`

### Visualizar filas:

- `votes_queue`: Fila de votos recebidos
- `aggregate_queue`: Fila de votos processados

## 🛠️ Scripts Disponíveis

| Script                    | Descrição                        |
| ------------------------- | -------------------------------- |
| `npm run start:dev`       | Inicia API Gateway em modo watch |
| `npm run start:votes`     | Inicia Votes Service             |
| `npm run start:aggregate` | Inicia Aggregate Service         |
| `npm run start:all`       | Inicia todos os serviços         |
| `npm run build:all`       | Build de todos os serviços       |
| `npm run docker:up`       | Sobe containers Docker           |
| `npm run docker:down`     | Para containers Docker           |
| `npm run docker:logs`     | Visualiza logs dos containers    |

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# API Gateway
PORT=3000

# RabbitMQ
RABBITMQ_URL=amqp://laager_user:laager_password@localhost:5672/laager_vhost

# PostgreSQL (futuro uso)
DATABASE_URL=postgresql://laager_user:laager_password@localhost:5432/laager_voting
```

## 📁 Estrutura do Projeto

```
laager-bbb-voting-system/
├── apps/
│   ├── api-gateway/           # API REST Gateway
│   │   └── src/
│   │       ├── app/
│   │       │   ├── votes/     # Controller de votos
│   │       │   └── dto/       # Data Transfer Objects
│   │       └── main.ts
│   ├── votes-service/         # Microserviço de processamento
│   │   └── src/
│   │       ├── app/
│   │       └── main.ts
│   └── aggregate-service/     # Microserviço de agregação
│       └── src/
│           ├── app/
│           │   └── cache/     # Serviço de cache
│           └── main.ts
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔐 Segurança

Para produção, considere:

- Implementar autenticação JWT
- Rate limiting
- Validação de dados mais robusta
- HTTPS
- Filas duráveis no RabbitMQ
- Redis para cache distribuído

## 🚀 Melhorias Futuras

- [ ] Implementar Redis para cache distribuído
- [ ] Adicionar autenticação e autorização
- [ ] Implementar rate limiting
- [ ] Adicionar logging estruturado
- [ ] Implementar health checks
- [ ] Adicionar métricas e monitoring (Prometheus)
- [ ] Dockerizar os serviços Node.js
- [ ] Implementar CI/CD

## 📄 Licença

MIT

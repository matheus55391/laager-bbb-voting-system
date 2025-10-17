# 🎯 BBB Voting System - Sistema de Votação

Sistema de votação em tempo real para Big Brother Brasil, desenvolvido com arquitetura de microserviços, NestJS, RabbitMQ e Next.js.

[![Nx](https://img.shields.io/badge/Built%20with-Nx-143055?style=flat-square&logo=nx)](https://nx.dev)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat-square&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com)

## 📋 Índice

-   [Sobre o Projeto](#-sobre-o-projeto)
-   [Arquitetura](#-arquitetura)
-   [Tecnologias](#-tecnologias)
-   [Como Executar](#-como-executar)
-   [Documentação](#-documentação)
-   [Estrutura do Projeto](#-estrutura-do-projeto)
-   [Scripts Disponíveis](#-scripts-disponíveis)

## 🎯 Sobre o Projeto

Sistema completo de votação com:

-   ✅ **API REST** para recebimento de votos
-   ✅ **Processamento assíncrono** com filas RabbitMQ
-   ✅ **Microserviços** independentes e escaláveis
-   ✅ **Cache** para performance em resultados
-   ✅ **Frontend moderno** com Next.js 15
-   ✅ **Documentação Swagger** automática
-   ✅ **Docker Compose** para infraestrutura

## 🏗️ Arquitetura

```
┌──────────────┐
│   Frontend   │  Next.js (porta 4200)
│  (Browser)   │
└──────┬───────┘
       │ HTTP
       ▼
┌──────────────┐
│ API Gateway  │  NestJS (porta 3000)
│   + Swagger  │
└──────┬───────┘
       │ RabbitMQ
       ▼
┌──────────────┐
│ Votes Queue  │  votes_queue
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Votes     │  Microserviço de processamento
│   Service    │
└──────┬───────┘
       │ RabbitMQ
       ▼
┌──────────────┐
│Aggregate Queue aggregate_queue
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Aggregate   │  Microserviço de agregação
│   Service    │  + Cache in-memory
└──────────────┘
```

### Componentes

| Componente            | Responsabilidade                  | Porta |
| --------------------- | --------------------------------- | ----- |
| **Frontend**          | Interface web para votação        | 4200  |
| **API Gateway**       | Receber requisições HTTP          | 3000  |
| **Votes Service**     | Processar votos                   | -     |
| **Aggregate Service** | Contabilizar e cachear resultados | -     |
| **RabbitMQ**          | Message broker                    | 5672  |

## 🚀 Tecnologias

### Backend

-   **[NestJS](https://nestjs.com)** 11.0 - Framework Node.js
-   **[RabbitMQ](https://www.rabbitmq.com)** - Message broker
-   **[Swagger/OpenAPI](https://swagger.io)** - Documentação de API
-   **TypeScript** 5.9 - Superset JavaScript

### Frontend

-   **[Next.js](https://nextjs.org)** 15.2 - React Framework
-   **[React](https://react.dev)** 19.2 - UI Library
-   **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS
-   **[shadcn/ui](https://ui.shadcn.com)** - Componentes React
-   **[TanStack Query](https://tanstack.com/query)** - Data fetching
-   **[React Hook Form](https://react-hook-form.com)** - Gerenciamento de formulários
-   **[Zod](https://zod.dev)** - Validação de schemas

### DevOps & Tools

-   **[Nx](https://nx.dev)** 21.6 - Monorepo tooling
-   **[Docker](https://www.docker.com)** - Containerização
-   **[PostgreSQL](https://www.postgresql.org)** - Banco de dados (infraestrutura)
-   **Jest** - Testing framework

## 🚀 Como Executar

### Pré-requisitos

-   Node.js 18+
-   Docker e Docker Compose
-   npm ou yarn

### 1. Clone o repositório

```bash
git clone https://github.com/matheus55391/laager-bbb-voting-system.git
cd laager-bbb-voting-system
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Suba a infraestrutura (RabbitMQ, PostgreSQL)

```bash
npm run docker:up
```

### 4. Inicie os serviços

**Opção A: TUDO de uma vez (backend + frontend) - RECOMENDADO ⭐**

```bash
npm run start:dev
```

**Opção B: Apenas backend**

```bash
npm run start:backend
```

**Opção C: Apenas frontend**

```bash
npm run start:web
```

### 5. Acesse as aplicações

-   🌐 **Frontend**: http://localhost:4200
-   🔌 **API**: http://localhost:3000/api
-   📚 **Swagger**: http://localhost:3000/api/docs
-   🐰 **RabbitMQ Management**: http://localhost:15672 (laager_user / laager_password)

## 📚 Documentação

Documentação detalhada disponível na pasta `/docs`:

-   **[SETUP.md](./docs/SETUP.md)** - Guia completo de instalação e uso
-   **[IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)** - Resumo da implementação
-   **[PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)** - Estrutura detalhada do projeto

## 📁 Estrutura do Projeto

```
laager-bbb-voting-system/
├── apps/
│   ├── api/                      # Backend - Microserviços
│   │   ├── api-gateway/          # REST API (porta 3000)
│   │   ├── votes-service/        # Processador de votos
│   │   ├── aggregate-service/    # Agregador de resultados
│   │   └── e2e/                  # Testes End-to-End
│   │       ├── api-gateway-e2e/
│   │       ├── votes-service-e2e/
│   │       └── aggregate-service-e2e/
│   └── frontend/                 # Next.js App (porta 4200)
├── docs/                         # Documentação
├── docker-compose.yml            # Infraestrutura Docker
└── package.json                  # Scripts e dependências
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento

| Script                    | Descrição                           |
| ------------------------- | ----------------------------------- |
| `npm run start:dev`       | ⭐ Inicia TUDO (backend + frontend) |
| `npm run start:backend`   | Inicia apenas serviços backend      |
| `npm run start:web`       | Inicia frontend                     |
| `npm run start:gateway`   | Inicia apenas API Gateway           |
| `npm run start:votes`     | Inicia apenas Votes Service         |
| `npm run start:aggregate` | Inicia apenas Aggregate Service     |

### Build

| Script              | Descrição                  |
| ------------------- | -------------------------- |
| `npm run build:all` | Build de todos os serviços |
| `npm run build`     | Build do API Gateway       |
| `npm run build:web` | Build do frontend          |

### Docker

| Script                | Descrição       |
| --------------------- | --------------- |
| `npm run docker:up`   | Sobe containers |
| `npm run docker:down` | Para containers |
| `npm run docker:logs` | Visualiza logs  |

### Testes

| Script             | Descrição           |
| ------------------ | ------------------- |
| `npm test`         | Roda testes         |
| `npm run test:cov` | Testes com coverage |
| `npm run test:e2e` | Testes E2E          |

## 📊 Exemplo de Uso

### Via Frontend (http://localhost:4200)

1. Acesse a interface web
2. Selecione um participante
3. Clique em "Votar"
4. Veja os resultados atualizados

### Via API (cURL)

**Registrar voto:**

```bash
curl -X POST http://localhost:3000/api/votes \
  -H "Content-Type: application/json" \
  -d '{"participantId": "participant-123"}'
```

**Consultar resultados:**

```bash
curl http://localhost:3000/api/votes/results
```

## 🔍 Monitoramento

-   **RabbitMQ Management**: http://localhost:15672
-   **PgAdmin**: http://localhost:8080
-   **Swagger API Docs**: http://localhost:3000/api/docs

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:cov

# Testes E2E
npm run test:e2e
```

## 📈 Melhorias Futuras

-   [ ] Implementar Redis para cache distribuído
-   [ ] Persistência de votos no PostgreSQL
-   [ ] Autenticação JWT
-   [ ] Rate limiting
-   [ ] WebSocket para atualização em tempo real
-   [ ] Gráficos interativos no frontend
-   [ ] Containerização dos serviços Node.js
-   [ ] CI/CD pipeline
-   [ ] Monitoring com Prometheus/Grafana

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Matheus**

-   GitHub: [@matheus55391](https://github.com/matheus55391)

---

⭐ **Desenvolvido com [Nx](https://nx.dev)**

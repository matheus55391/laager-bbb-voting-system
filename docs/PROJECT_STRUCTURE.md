# 📁 Estrutura do Projeto

## 🎯 Organização Atual

O projeto foi reorganizado para melhor separação de responsabilidades:

```
laager-bbb-voting-system/
├── apps/
│   ├── api/                          # 🔷 Backend - Todos os microserviços
│   │   ├── api-gateway/              # Gateway REST (porta 3000)
│   │   │   └── src/app/              # Controllers, DTOs, Modules
│   │   │
│   │   ├── votes-service/            # Processador de votos
│   │   │   └── src/app/              # Lógica de processamento
│   │   │
│   │   ├── aggregate-service/        # Agregador de votos
│   │   │   └── src/app/              # Cache e agregação
│   │   │
│   │   └── e2e/                      # 🧪 Testes End-to-End
│   │       ├── api-gateway-e2e/
│   │       ├── votes-service-e2e/
│   │       └── aggregate-service-e2e/
│   │
│   └── frontend/                     # 🌐 Frontend - Next.js App
│       ├── src/
│       │   ├── app/                  # Next.js App Router
│       │   ├── components/           # Componentes React + shadcn/ui
│       │   └── lib/                  # Utilitários
│       └── public/                   # Assets estáticos
│
├── docs/                             # 📚 Documentação
│   ├── SETUP.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── PROJECT_STRUCTURE.md
│
├── dist/                             # 🔨 Build output (gerado pelo Nx)
├── node_modules/                     # 📦 Dependências
│
├── docker-compose.yml                # 🐳 Infraestrutura (RabbitMQ, PostgreSQL)
├── package.json                      # Scripts e dependências do workspace
├── tsconfig.base.json                # Configuração TypeScript + path aliases
├── nx.json                           # Configuração do monorepo Nx
└── README.md                         # Documentação principal
```

### 📂 Detalhamento das Pastas

#### `/apps/api/*` - Microserviços Backend

Cada microserviço segue a mesma estrutura:

-   **`src/app/`**: Código principal (controllers, services, modules)
-   **`src/main.ts`**: Bootstrap da aplicação
-   **`webpack.config.js`**: Configuração de build
-   **`tsconfig.app.json`**: Configuração TypeScript do projeto
-   **`package.json`**: Metadados e configuração Nx

**api-gateway**: Recebe requisições HTTP, documenta com Swagger, publica no RabbitMQ
**votes-service**: Consome `votes_queue`, processa votos, publica no `aggregate_queue`
**aggregate-service**: Consome `aggregate_queue`, mantém cache in-memory dos resultados

#### `/apps/api/e2e/*` - Testes End-to-End

Testes de integração que validam o sistema completo:

-   **`api-gateway-e2e/`**: Testa requisições HTTP reais ao gateway
-   **`votes-service-e2e/`**: Testa processamento de votos com RabbitMQ
-   **`aggregate-service-e2e/`**: Testa agregação e cache de resultados

Esses testes são executados com `npm run test:e2e` e simulam cenários reais de uso.

#### `/apps/frontend` - Aplicação Next.js

-   **`src/app/`**: App Router do Next.js 15 (rotas, layouts, páginas)
-   **`src/components/`**: Componentes React reutilizáveis
-   **`src/components/ui/`**: Componentes shadcn/ui (button, card, form, etc.)
-   **`public/`**: Assets estáticos servidos diretamente
-   **`tailwind.config.ts`**: Configuração do Tailwind CSS

#### `/docs` - Documentação do Projeto

-   **SETUP.md**: Guia completo de instalação e execução
-   **IMPLEMENTATION_SUMMARY.md**: Resumo técnico da implementação
-   **PROJECT_STRUCTURE.md**: Este arquivo (organização do projeto)

## 🔑 Path Aliases

Configurados no `tsconfig.base.json` para facilitar imports:

```typescript
// Antes (imports relativos):
import { VoteDto } from '../../../dto/vote.dto';

// Depois (com aliases):
import { VoteDto } from '@api/api-gateway/app/dto/vote.dto';
```

### Aliases disponíveis:

| Alias                      | Path                               |
| -------------------------- | ---------------------------------- |
| `@api/api-gateway/*`       | `apps/api/api-gateway/src/*`       |
| `@api/votes-service/*`     | `apps/api/votes-service/src/*`     |
| `@api/aggregate-service/*` | `apps/api/aggregate-service/src/*` |
| `@frontend/*`              | `apps/frontend/src/*`              |
| `@shared/*`                | `libs/shared/src/*`                |

## 🔌 Portas Utilizadas

| Serviço       | Porta | URL                            |
| ------------- | ----- | ------------------------------ |
| API Gateway   | 3000  | http://localhost:3000/api      |
| Swagger Docs  | 3000  | http://localhost:3000/api/docs |
| Frontend      | 4200  | http://localhost:4200          |
| RabbitMQ AMQP | 5672  | amqp://localhost:5672          |
| RabbitMQ Mgmt | 15672 | http://localhost:15672         |
| PostgreSQL    | 5432  | postgresql://localhost:5432    |
| PgAdmin       | 8080  | http://localhost:8080          |

## 🔄 Fluxo de Comunicação

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────┐         ┌──────────────┐
│  Frontend   │────────▶│ API Gateway  │
│  (Port 4200)│ HTTP    │  (Port 3000) │
└─────────────┘         └──────┬───────┘
                               │ RabbitMQ
                               │ (votes_queue)
                               ▼
                        ┌──────────────┐
                        │    Votes     │
                        │   Service    │
                        └──────┬───────┘
                               │ RabbitMQ
                               │ (aggregate_queue)
                               ▼
                        ┌──────────────┐
                        │  Aggregate   │
                        │   Service    │
                        │   (Cache)    │
                        └──────────────┘
```

### Padrões de Mensageria

-   **EventPattern**: Mensagens fire-and-forget (publicar/consumir eventos)

    -   `vote_submitted`: API Gateway → Votes Service
    -   `vote_processed`: Votes Service → Aggregate Service

-   **MessagePattern**: Requisição/resposta (RPC)
    -   `get_results`: API Gateway ↔ Aggregate Service

## 📦 Workspaces npm

O `package.json` root está configurado para reconhecer os workspaces:

```json
{
    "workspaces": ["apps/api/*", "apps/frontend", "libs/*"]
}
```

Isso permite:

-   Compartilhar dependências entre projetos
-   Usar `npm install` no root para instalar tudo
-   Hoisting de dependências comuns

## 🛠️ Scripts Principais

### Desenvolvimento

```bash
# Iniciar todos os serviços backend
npm run start:dev

# Iniciar frontend
npm run start:web

# Iniciar tudo (backend + frontend)
npm run start:all

# Serviços individuais
npm run start:gateway
npm run start:votes
npm run start:aggregate
```

### Build

```bash
# Build de todos os serviços
npm run build:all

# Build individual
npm run build            # api-gateway
npm run build:web        # frontend
```

### Docker

```bash
# Subir infraestrutura
npm run docker:up

# Parar infraestrutura
npm run docker:down

# Ver logs
npm run docker:logs
```

## 🎯 Benefícios da Nova Estrutura

### ✅ Separação Clara

-   **Backend** (`/apps/api/*`): Todos os microserviços em um só lugar
-   **Frontend** (`/apps/frontend`): Aplicação web separada

### ✅ Escalabilidade

-   Fácil adicionar novos microserviços em `/apps/api/`
-   Frontend pode ser deployado independentemente
-   Possibilidade de ter múltiplos frontends (mobile, admin, etc.)

### ✅ Manutenibilidade

-   Path aliases facilitam navegação
-   Estrutura previsível
-   Configurações organizadas

### ✅ Compatibilidade Nx

-   Nx pode fazer cache de builds
-   Testes afetados rodam automaticamente
-   Graph de dependências claro

## 📝 Convenções

### Nomenclatura de Arquivos

-   **Microserviços**: `nome-service/` (kebab-case)
-   **Testes E2E**: `nome-service-e2e/`
-   **Componentes React**: `ComponentName.tsx` (PascalCase)
-   **Utilitários**: `utility-name.ts` (kebab-case)
-   **DTOs**: `entity-name.dto.ts`
-   **Controllers**: `entity-name.controller.ts`
-   **Services**: `entity-name.service.ts`

### Padrões de Organização

-   Cada microserviço contém sua própria lógica de negócio isolada
-   DTOs são validados usando decorators do `class-validator`
-   Configurações compartilhadas ficam no `tsconfig.base.json`
-   Path aliases facilitam imports entre projetos

## 🔍 Ferramentas de Desenvolvimento

### Nx Console (VS Code Extension)

Recomendado para:

-   Visualizar o graph do projeto
-   Rodar tarefas via UI
-   Gerar código com generators

### Comandos úteis

```bash
# Visualizar graph de dependências
npx nx graph

# Rodar testes afetados
npx nx affected:test

# Build apenas o que mudou
npx nx affected:build

# Limpar cache
npx nx reset
```

## 📚 Referências

-   [Nx Documentation](https://nx.dev)
-   [NestJS Documentation](https://docs.nestjs.com)
-   [Next.js Documentation](https://nextjs.org/docs)
-   [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials)

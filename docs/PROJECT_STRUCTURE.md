# 📁 Estrutura do Projeto

## Visão Geral

O projeto utiliza **Nx Monorepo** com estrutura modular separando frontend, backend e bibliotecas compartilhadas.

---

## 🌳 Árvore de Diretórios

```
laager-bbb-voting-system/
│
├── apps/                           # Aplicações
│   ├── api/                        # Backend (microserviços)
│   │   ├── api-gateway/            # API REST Gateway
│   │   └── vote/                   # Vote Service (microserviço)
│   │
│   └── web/                        # Frontend Next.js
│
├── libs/                           # Bibliotecas compartilhadas
│   └── common/                     # DTOs e interfaces
│
├── prisma/                         # Database
│   ├── schema.prisma              # Schema do banco
│   ├── migrations/                 # Migrations SQL
│   └── seed.ts                     # Dados iniciais
│
├── scripts/                        # Scripts de automação
│   └── setup.sh                    # Setup inicial
│
├── docs/                           # Documentação
│   ├── ARCHITECTURE.md             # Arquitetura
│   ├── PROJECT_STRUCTURE.md        # Este arquivo
│   ├── DATABASE.md                 # Prisma e schema
│   ├── LIBS.md                     # Libs compartilhadas
│   └── LAAGER_REQUIREMENTS_COMPLETE.md
│
├── docker-compose.yml              # Infraestrutura
├── nx.json                         # Configuração Nx
├── package.json                    # Dependencies e scripts
├── tsconfig.base.json              # TypeScript base
└── README.md                       # Documentação principal
```

---

## 📦 Apps

### 1. API Gateway (`apps/api/api-gateway`)

**Responsabilidade**: API REST HTTP

```
apps/api/api-gateway/
├── src/
│   ├── main.ts                     # Bootstrap NestJS
│   │
│   ├── app/
│   │   ├── app.module.ts           # Módulo principal
│   │   │
│   │   ├── controllers/
│   │   │   ├── health.controller.ts      # GET /health
│   │   │   └── votes.controller.ts       # POST/GET /votes
│   │   │
│   │   └── middleware/
│   │       ├── logger.middleware.ts      # Logging HTTP
│   │       └── rate-limit.middleware.ts  # 🛡️ Anti-bot
│   │
│   └── assets/
│
├── jest.config.ts
├── tsconfig.json
└── webpack.config.js
```

**Arquivos-chave:**

#### `src/main.ts`

```typescript
// Bootstrap da aplicação
// - Configuração Swagger
// - CORS
// - Validation Pipes
// - Porta 3000
```

#### `app/controllers/votes.controller.ts`

```typescript
// Endpoints REST
@Controller('votes')
export class VotesController {
    // POST /votes - Registrar voto
    // GET /votes - Consultar resultados
    // GET /votes/stats/hourly - Estatísticas
}
```

#### `app/middleware/rate-limit.middleware.ts`

```typescript
// Proteção anti-bot
// - Limite: 10 votos/minuto por IP
// - Storage: Redis
// - Response: HTTP 429
```

---

### 2. Vote Service (`apps/api/vote`)

**Responsabilidade**: Processamento de votos (microserviço)

```
apps/api/vote/
├── src/
│   ├── main.ts                     # Bootstrap microserviço
│   │
│   ├── app/
│   │   ├── app.module.ts           # Módulo principal
│   │   ├── app.controller.ts       # Handlers RabbitMQ
│   │   ├── app.service.ts
│   │   │
│   │   └── services/
│   │       ├── votes.service.ts    # ⚙️ Lógica de negócio
│   │       ├── prisma.service.ts   # 🗄️ Database ORM
│   │       └── redis.service.ts    # 💾 Cache
│   │
│   └── assets/
│
├── project.json
├── tsconfig.json
└── webpack.config.js
```

**Arquivos-chave:**

#### `src/main.ts`

```typescript
// Microserviço RabbitMQ
// - Transport: RMQ
// - Queue: votes_queue
// - Pattern: MessagePattern
```

#### `app/app.controller.ts`

```typescript
// Handlers RabbitMQ
@Controller()
export class AppController {
  @MessagePattern('vote.create')
  handleVote()

  @MessagePattern('vote.getStatus')
  handleGetStatus()

  @MessagePattern('vote.getHourlyStats')
  handleGetHourlyStats()
}
```

#### `app/services/votes.service.ts`

```typescript
// Lógica de negócio principal
export class VotesService {
    processVote(); // Processar voto
    getVotingStatus(); // Consultar status
    getHourlyStats(); // Estatísticas por hora
    syncRedisFromDatabase(); // Sync cache
}
```

#### `app/services/prisma.service.ts`

```typescript
// Wrapper do Prisma Client
// - Connection lifecycle
// - Error handling
```

#### `app/services/redis.service.ts`

```typescript
// Cache management
export class RedisService {
    getVoteCount(); // Buscar contador
    incrementVoteCount(); // Incrementar
    setVoteCount(); // Definir
    getTotalVotes(); // Total geral
    clearAllVotes(); // Limpar cache
}
```

---

### 3. Web Frontend (`apps/web`)

**Responsabilidade**: Interface do usuário

```
apps/web/
├── src/
│   ├── app/                        # App Router (Next.js 15)
│   │   ├── layout.tsx              # Layout raiz
│   │   ├── page.tsx                # 🗳️ Tela de votação
│   │   ├── providers.tsx           # Providers React
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx            # 📊 Dashboard admin
│   │   │
│   │   └── result/
│   │       └── page.tsx            # 📈 Resultados
│   │
│   ├── components/
│   │   ├── voting/
│   │   │   └── voting-card.tsx     # Card de participante
│   │   │
│   │   ├── dashboard/
│   │   │   ├── dashboard-stats.tsx
│   │   │   ├── votes-chart.tsx
│   │   │   └── votes-per-hour-chart.tsx
│   │   │
│   │   └── ui/                     # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── chart.tsx
│   │       └── ... (40+ components)
│   │
│   ├── queries/
│   │   └── vote/
│   │       ├── use-participants-query.ts  # Fetch participantes
│   │       ├── use-vote-mutation.ts       # Mutation votar
│   │       └── use-voting-stats-query.ts  # Fetch resultados
│   │
│   ├── services/
│   │   └── voting.service.ts       # API client (axios)
│   │
│   ├── lib/
│   │   ├── api-client.ts           # Axios instance
│   │   ├── query-client.ts         # TanStack Query config
│   │   └── utils.ts                # Utilities (cn, etc)
│   │
│   ├── types/
│   │   ├── participant.ts          # Tipos de participante
│   │   └── voting.ts               # Tipos de votação
│   │
│   └── contexts/
│       └── tanstack-query-provider.tsx
│
├── public/
│   ├── images/
│   │   ├── icons/
│   │   └── logos/
│   └── fonts/
│
├── components.json                  # shadcn/ui config
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

**Arquivos-chave:**

#### `src/app/page.tsx`

```typescript
// Tela principal de votação
// - Lista participantes (dynamic from API)
// - Captura seleção
// - Submit voto (mutation)
```

#### `src/queries/vote/use-vote-mutation.ts`

```typescript
// TanStack Query mutation
export const useVoteMutation = () => {
    return useMutation({
        mutationFn: votingApi.submitVote,
        onSuccess: () => invalidateQueries(),
    });
};
```

#### `src/services/voting.service.ts`

```typescript
// API Client
export const votingApi = {
  submitVote()      // POST /votes
  getResults()      // GET /votes
  getFormattedResults()
}
```

---

## 📚 Libs

### Common (`libs/common`)

**Responsabilidade**: DTOs e interfaces compartilhadas entre apps

```
libs/common/
├── src/
│   ├── index.ts                    # Barrel exports
│   │
│   └── lib/
│       ├── vote/
│       │   └── dto/
│       │       ├── vote.dto.ts             # VoteDto
│       │       └── vote-response.dto.ts    # VoteResponseDto
│       │
│       ├── results/
│       │   └── dto/
│       │       └── results-response.dto.ts # ResultsResponseDto
│       │
│       ├── stats/
│       │   ├── hourly-stats.dto.ts         # HourlyStatsDto
│       │   └── dto/
│       │       └── stats-response.dto.ts
│       │
│       └── participant/
│           └── interfaces/
│               └── participant.interface.ts
│
├── project.json
└── tsconfig.json
```

**[📦 Ver detalhes completos em LIBS.md](./LIBS.md)**

---

## 🗄️ Prisma

### Schema (`prisma/schema.prisma`)

```prisma
model Participant {
  id        String   @id @default(uuid())
  name      String
  nickname  String?
  photoUrl  String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  votes Vote[]

  @@index([isActive])
  @@map("participants")
}

model Vote {
  id            String   @id @default(uuid())
  participantId String
  userId        String?
  userAgent     String?
  createdAt     DateTime @default(now())

  participant Participant @relation(...)

  @@index([participantId])
  @@index([createdAt])
  @@map("votes")
}
```

**[🗄️ Ver detalhes completos em DATABASE.md](./DATABASE.md)**

---

## 📜 Scripts

### `scripts/setup.sh`

**Uso**: `npm run setup`

```bash
# Setup completo do projeto
1. Verifica pré-requisitos (Node, Docker)
2. Instala dependências (npm install)
3. Cria .env
4. Sobe Docker Compose
5. Prisma generate
6. Prisma migrate
7. Prisma seed
```

---

## 🔧 Configuração

### `nx.json`

```json
{
    "defaultProject": "api-gateway",
    "tasksRunnerOptions": {
        "default": {
            "runner": "nx/tasks-runners/default",
            "options": {
                "cacheableOperations": ["build", "test", "lint"]
            }
        }
    }
}
```

### `tsconfig.base.json`

```json
{
    "compilerOptions": {
        "paths": {
            "@laager-bbb-voting-system/common": ["libs/common/src/index.ts"]
        }
    }
}
```

**Path Alias**: Permite importar DTOs com:

```typescript
import { VoteDto } from '@laager-bbb-voting-system/common';
```

### `docker-compose.yml`

```yaml
services:
    postgres: # Port 5432
    redis: # Port 6379
    rabbitmq: # Port 5672, 15672 (management)
```

---

## 🎯 Convenções

### Nomenclatura de Arquivos

-   **Services**: `*.service.ts`
-   **Controllers**: `*.controller.ts`
-   **DTOs**: `*.dto.ts`
-   **Interfaces**: `*.interface.ts`
-   **Components**: `kebab-case.tsx`
-   **Hooks**: `use-*.ts`

### Estrutura de Imports

```typescript
// 1. External libs
import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

// 2. Internal libs
import { VoteDto } from '@laager-bbb-voting-system/common';

// 3. Local imports
import { PrismaService } from './prisma.service';
import { RedisService } from './redis.service';
```

### Git Workflow

```
main (production)
  └── develop (staging)
       └── feature/* (features)
```

---

## 📊 Métricas do Projeto

```
Total Files:     ~200
Lines of Code:   ~5000
Languages:       TypeScript, Prisma, SQL
Components:      50+ (shadcn/ui)
API Endpoints:   5
RabbitMQ Patterns: 3
Database Tables: 2
```

---

## 🚀 Como Navegar

1. **Entender arquitetura**: Leia `docs/ARCHITECTURE.md`
2. **Configurar projeto**: Execute `npm run setup`
3. **Ver database**: Leia `docs/DATABASE.md`
4. **Entender libs**: Leia `docs/LIBS.md`
5. **Requisitos Laager**: Leia `docs/LAAGER_REQUIREMENTS_COMPLETE.md`

---

## 📚 Referências

-   [Nx Documentation](https://nx.dev)
-   [NestJS Project Structure](https://docs.nestjs.com/first-steps)
-   [Next.js App Router](https://nextjs.org/docs/app)
-   [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

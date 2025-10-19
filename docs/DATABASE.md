# 🗄️ Database - Prisma Schema

## Visão Geral

O sistema utiliza **PostgreSQL** como banco de dados principal, gerenciado pelo **Prisma ORM**.

**Estratégia de Dados**:

-   ✅ **Single Source of Truth**: Tabela `votes` (Postgres)
-   ⚡ **Cache Layer**: Redis (somente leitura, volatilidade permitida)
-   🔄 **Sync Strategy**: Reconstrução de cache a partir do Postgres quando necessário

---

## 📊 Schema

### Localização

```
prisma/
├── schema.prisma          # Schema principal
├── migrations/            # Histórico de migrations SQL
│   └── 20240101_init/
│       └── migration.sql
└── seed.ts                # Dados iniciais (seed)
```

---

## 🗂️ Models

### 1. **Participant** (Participantes do BBB)

```prisma
model Participant {
  id        String   @id @default(uuid())
  name      String   @db.VarChar(255)
  nickname  String?  @db.VarChar(100)
  photoUrl  String?  @db.Text
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  votes Vote[]

  @@index([isActive])
  @@map("participants")
}
```

#### Campos

| Campo       | Tipo     | Constraints             | Descrição                   |
| ----------- | -------- | ----------------------- | --------------------------- |
| `id`        | UUID     | PK, Auto-generated      | Identificador único         |
| `name`      | String   | Max 255 chars, NOT NULL | Nome completo               |
| `nickname`  | String?  | Max 100 chars, NULLABLE | Apelido (ex: "João")        |
| `photoUrl`  | String?  | NULLABLE                | URL da foto do participante |
| `isActive`  | Boolean  | Default TRUE, Indexed   | Se pode receber votos       |
| `createdAt` | DateTime | Auto-generated          | Data de criação             |
| `updatedAt` | DateTime | Auto-updated            | Data da última atualização  |

#### Relacionamentos

-   **1:N** com `Vote` (um participante tem N votos)

#### Índices

-   `isActive` - Otimiza query de participantes ativos

#### SQL Equivalente

```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_participants_is_active ON participants(is_active);
```

---

### 2. **Vote** (Votos - Source of Truth)

```prisma
model Vote {
  id            String   @id @default(uuid())
  participantId String   @map("participant_id")
  userId        String?  @map("user_id") @db.VarChar(255)
  ipAddress     String?  @map("ip_address") @db.Inet
  userAgent     String?  @map("user_agent") @db.Text
  createdAt     DateTime @default(now()) @map("created_at")

  participant Participant @relation(
    fields: [participantId],
    references: [id],
    onDelete: Cascade
  )

  @@index([participantId])
  @@index([createdAt])
  @@index([userId])
  @@index([ipAddress])
  @@map("votes")
}
```

#### Campos

| Campo           | Tipo     | Constraints                      | Descrição                      |
| --------------- | -------- | -------------------------------- | ------------------------------ |
| `id`            | UUID     | PK, Auto-generated               | Identificador único do voto    |
| `participantId` | UUID     | FK → Participant, Indexed        | Quem recebeu o voto            |
| `userId`        | String?  | Max 255 chars, NULLABLE, Indexed | ID do votante (se autenticado) |
| `ipAddress`     | INET?    | NULLABLE, Indexed                | 🛡️ IP do votante (anti-bot)    |
| `userAgent`     | String?  | NULLABLE                         | 🛡️ User-Agent do navegador     |
| `createdAt`     | DateTime | Auto-generated, Indexed          | Timestamp do voto              |

#### Relacionamentos

-   **N:1** com `Participant` (muitos votos para um participante)
-   **Cascade Delete**: Se participante for deletado, votos também são

#### Índices

| Índice              | Campos          | Propósito                                 |
| ------------------- | --------------- | ----------------------------------------- |
| `idx_participantId` | `participantId` | JOIN com participants                     |
| `idx_createdAt`     | `createdAt`     | Queries temporais (estatísticas por hora) |
| `idx_userId`        | `userId`        | Anti-fraude (limite por usuário)          |
| `idx_ipAddress`     | `ipAddress`     | 🛡️ Rate limiting (10 votos/min por IP)    |

#### SQL Equivalente

```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  user_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_votes_participant_id ON votes(participant_id);
CREATE INDEX idx_votes_created_at ON votes(created_at);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_ip_address ON votes(ip_address);
```

---

## 🔄 Migrations

### Comandos

#### Criar nova migration

```bash
npm run prisma:migrate      # npx prisma migrate dev --name <description>
```

#### Aplicar migrations (produção)

```bash
npx prisma migrate deploy
```

#### Verificar status

```bash
npx prisma migrate status
```

#### Resetar database (⚠️ apenas DEV)

```bash
npx prisma migrate reset
```

### Histórico de Migrations

```
prisma/migrations/
├── 20240101000000_init/
│   └── migration.sql          # Tabelas participants e votes
│
└── 20240102000000_add_anti_bot_fields/
    └── migration.sql          # Adição de ipAddress e userAgent
```

---

## 🌱 Seed

### Arquivo: `prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Limpar dados existentes
    await prisma.vote.deleteMany();
    await prisma.participant.deleteMany();

    // Criar participantes do BBB 25 (exemplo)
    const participants = await prisma.participant.createMany({
        data: [
            {
                name: 'João Silva',
                nickname: 'João',
                isActive: true,
            },
            {
                name: 'Maria Santos',
                nickname: 'Maria',
                isActive: true,
            },
        ],
    });

    console.log(`✅ Created ${participants.count} participants`);

    const totalParticipants = await prisma.participant.count();
    const totalVotes = await prisma.vote.count();

    console.log(`
📊 Database seeded successfully!
   - Participants: ${totalParticipants}
   - Votes: ${totalVotes}
  `);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
```

### Executar Seed

```bash
npm run prisma:seed     # npx prisma db seed
```

**Quando usar**:

-   ✅ Primeiro setup do projeto
-   ✅ Após reset do banco de dados
-   ✅ Adicionar novos participantes do BBB

---

## 📈 Queries Importantes

### Estatísticas por Hora (Raw SQL)

```typescript
// apps/api/vote/src/app/services/votes.service.ts
async getHourlyStats(): Promise<HourlyStatsDto[]> {
  const stats = await this.prisma.$queryRaw<
    { hour: Date; participant_id: string; vote_count: BigInt }[]
  >`
    SELECT
      DATE_TRUNC('hour', created_at) AS hour,
      participant_id,
      COUNT(*) AS vote_count
    FROM votes
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    GROUP BY hour, participant_id
    ORDER BY hour DESC
  `;

  return stats.map(stat => ({
    hour: stat.hour.toISOString(),
    participantId: stat.participant_id,
    voteCount: Number(stat.vote_count)
  }));
}
```

**Performance**:

-   ✅ Usa índice em `created_at`
-   ✅ Filtra últimas 24 horas
-   ✅ Agrupa por hora (não por minuto, evita overhead)

### Total de Votos por Participante

```typescript
// Prisma Query
const results = await prisma.vote.groupBy({
    by: ['participantId'],
    _count: {
        _all: true,
    },
    orderBy: {
        _count: {
            participantId: 'desc',
        },
    },
});
```

### Contar Votos de um IP nas Últimas 24h

```typescript
const votesFromIp = await prisma.vote.count({
    where: {
        ipAddress: '192.168.1.1',
        createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
    },
});
```

---

## ⚡ Cache Layer (Redis)

### Estratégia de Sincronização

```typescript
// apps/api/vote/src/app/services/votes.service.ts

async syncRedisFromDatabase(): Promise<void> {
  // 1. Buscar votos agrupados do Postgres
  const votes = await this.prisma.vote.groupBy({
    by: ['participantId'],
    _count: { _all: true }
  });

  // 2. Limpar Redis
  await this.redis.clearAllVotes();

  // 3. Reconstruir cache
  for (const vote of votes) {
    await this.redis.setVoteCount(
      vote.participantId,
      vote._count._all
    );
  }

  console.log('✅ Redis synced from database');
}
```

**Quando executar**:

-   ✅ Startup do microserviço (`onModuleInit`)
-   ✅ Após falha no Redis
-   ✅ Divergência detectada entre Redis e Postgres

### Comparação Redis vs Postgres

| Aspecto          | Postgres        | Redis                 |
| ---------------- | --------------- | --------------------- |
| **Propósito**    | Source of Truth | Cache de leitura      |
| **Persistência** | ✅ Durável      | ⚠️ Volatilidade OK    |
| **Velocidade**   | ~100ms          | ~1ms                  |
| **Uso**          | Write + Read    | Read only             |
| **Sync**         | -               | Rebuild from Postgres |

---

## 🔧 Configuração Prisma

### `schema.prisma` - Generator

```prisma
generator client {
    provider = "prisma-client-js"
    output   = "../node_modules/.prisma/client"
}
```

**Output**: Cliente gerado em `node_modules/.prisma/client`

### `schema.prisma` - Datasource

```prisma
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}
```

**Variável de Ambiente**:

```bash
DATABASE_URL="postgresql://laager:laager@localhost:5432/laager_bbb_voting_db"
```

### `package.json` - Scripts

```json
{
    "scripts": {
        "prisma:generate": "prisma generate",
        "prisma:migrate": "prisma migrate dev",
        "prisma:seed": "prisma db seed",
        "prisma:studio": "prisma studio"
    },
    "prisma": {
        "seed": "ts-node prisma/seed.ts"
    }
}
```

---

## 🛠️ Ferramentas

### Prisma Studio (GUI)

```bash
npm run prisma:studio
# Abre em http://localhost:5555
```

**Features**:

-   ✅ Visualizar dados
-   ✅ Editar registros
-   ✅ Executar queries
-   ✅ Ver relacionamentos

### Prisma Client (TypeScript)

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Queries tipadas
const participant = await prisma.participant.findUnique({
    where: { id: 'uuid-123' },
    include: { votes: true },
});
```

---

## 🎯 Boas Práticas

### 1. Usar Transactions para Operações Críticas

```typescript
await prisma.$transaction(async (tx) => {
    const vote = await tx.vote.create({ data: voteData });
    await tx.participant.update({
        where: { id: participantId },
        data: { updatedAt: new Date() },
    });
});
```

### 2. Sempre Incluir Índices

```prisma
@@index([createdAt])  // Para queries temporais
@@index([ipAddress])  // Para anti-bot
```

### 3. Validar Foreign Keys

```prisma
participant Participant @relation(
  fields: [participantId],
  references: [id],
  onDelete: Cascade  // ✅ Define comportamento
)
```

### 4. Usar Enums para Status

```prisma
enum ParticipantStatus {
  ACTIVE
  ELIMINATED
  WINNER
}

model Participant {
  status ParticipantStatus @default(ACTIVE)
}
```

---

## 📊 Métricas

### Performance Esperada

| Query                  | Tempo (ms) | Índice Usado    |
| ---------------------- | ---------- | --------------- |
| Criar voto             | ~10-20     | -               |
| Buscar participante    | ~5-10      | PRIMARY KEY     |
| Contar votos (groupBy) | ~50-100    | `participantId` |
| Estatísticas por hora  | ~100-200   | `createdAt`     |

### Tamanho Estimado

```
1 milhão de votos:
- Tabela votes: ~200 MB
- Índices: ~100 MB
- Total: ~300 MB
```

---

## 🚨 Troubleshooting

### Erro: "Can't reach database server"

```bash
# Verificar se Postgres está rodando
docker ps | grep postgres

# Reiniciar container
docker-compose restart postgres
```

### Migration Falhou

```bash
# Ver status
npx prisma migrate status

# Resetar (⚠️ apaga dados)
npx prisma migrate reset
```

### Redis Desatualizado

```bash
# Re-sync automático no startup do microserviço
# Ou manualmente:
curl http://localhost:3001/sync-redis
```

---

## 📚 Referências

-   [Prisma Documentation](https://www.prisma.io/docs)
-   [PostgreSQL INET Type](https://www.postgresql.org/docs/current/datatype-net-types.html)
-   [Prisma Indexes](https://www.prisma.io/docs/concepts/components/prisma-schema/indexes)
-   [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)

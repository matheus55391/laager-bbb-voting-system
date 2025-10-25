# 📦 Libs - Bibliotecas Compartilhadas

## Visão Geral

A biblioteca `@laager-bbb-voting-system/common` centraliza **DTOs**, **interfaces** e **tipos** compartilhados entre os serviços.

**Propósito**: Evitar duplicação de código e garantir consistência de tipos entre API Gateway, Vote Service e Web Frontend.

---

## 📂 Estrutura

```
libs/common/
├── src/
│   ├── index.ts                    # ⚡ Barrel exports
│   │
│   └── lib/
│       ├── vote/
│       │   └── dto/
│       │       ├── vote.dto.ts             # Request DTO
│       │       └── vote-response.dto.ts    # Response DTO
│       │
│       ├── results/
│       │   └── dto/
│       │       └── results-response.dto.ts # Resultados
│       │
│       ├── stats/
│       │   ├── hourly-stats.dto.ts         # Estatísticas por hora
│       │   └── dto/
│       │       └── stats-response.dto.ts
│       │
│       └── participant/
│           └── interfaces/
│               └── participant.interface.ts # Interface de participante
│
├── project.json
├── tsconfig.json
└── tsconfig.lib.json
```

---

## 🎯 Barrel Exports (`index.ts`)

```typescript
// Vote
export * from './lib/vote/dto/vote.dto';
export * from './lib/vote/dto/vote-response.dto';

// Stats
export * from './lib/stats/dto/stats-response.dto';
export * from './lib/stats/hourly-stats.dto';

// Results
export * from './lib/results/dto/results-response.dto';

// Participant
export * from './lib/participant/interfaces/participant.interface';
```

**Uso**: Permite importar qualquer DTO com:

```typescript
import { VoteDto, VoteResponseDto } from '@laager-bbb-voting-system/common';
```

---

## 📄 DTOs Detalhados

### 1. **VoteDto** (Request)

**Arquivo**: `lib/vote/dto/vote.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class VoteDto {
    @ApiProperty({
        description: 'ID do participante a ser votado',
        example: 'participant-123',
    })
    @IsNotEmpty()
    @IsString()
    participantId!: string;

    @ApiProperty({
        description: 'ID do usuário votante (opcional)',
        example: 'user-456',
        required: false,
    })
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiProperty({
        description: 'Endereço IP do votante (preenchido pelo servidor)',
        example: '192.168.1.1',
        required: false,
    })
    @IsOptional()
    @IsString()

    @ApiProperty({
        description: 'User-Agent do navegador (preenchido pelo servidor)',
        example: 'Mozilla/5.0...',
        required: false,
    })
    @IsOptional()
    @IsString()
    userAgent?: string;
}
```

**Uso**:

```typescript
// API Gateway - apps/api/api-gateway/src/app/controllers/votes.controller.ts
@Post()
async vote(@Body() voteDto: VoteDto) {
  return this.client.send('vote.create', voteDto);
}
```

**Validações**:

-   ✅ `participantId`: Obrigatório, string
-   ⚪ `userId`: Opcional
-   🛡️ `userAgent`: Opcional (preenchido pelo servidor)

**Campos Anti-Bot**:


```typescript
const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
const userAgent = req.headers['user-agent'];

voteDto.userAgent = userAgent;
```

---

### 2. **VoteResponseDto** (Response)

**Arquivo**: `lib/vote/dto/vote-response.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class VoteResponseDto {
    @ApiProperty({
        description: 'Mensagem de sucesso',
        example: 'Voto registrado com sucesso',
    })
    message!: string;

    @ApiProperty({
        description: 'ID do voto',
        example: 'vote-789',
    })
    voteId!: string;

    @ApiProperty({
        description: 'Timestamp do voto',
        example: '2025-10-16T10:30:00.000Z',
    })
    timestamp!: string;
}
```

**Uso**:

```typescript
// Vote Service - apps/api/vote/src/app/app.service.ts
async processVote(voteDto: VoteDto): Promise<VoteResponseDto> {
  const vote = await this.prisma.vote.create({ data: voteDto });

  return {
    message: 'Voto registrado com sucesso',
    voteId: vote.id,
    timestamp: vote.createdAt.toISOString()
  };
}
```

---

### 3. **ResultsResponseDto** (Resultados)

**Arquivo**: `lib/results/dto/results-response.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class ParticipantResult {
    @ApiProperty({
        description: 'ID do participante',
        example: 'participant-123',
    })
    participantId!: string;

    @ApiProperty({
        description: 'Número de votos recebidos',
        example: 1500,
    })
    votes!: number;

    @ApiProperty({
        description: 'Percentual de votos',
        example: 45.5,
    })
    percentage!: number;
}

export class ResultsResponseDto {
    @ApiProperty({
        description: 'Total de votos computados',
        example: 3300,
    })
    totalVotes!: number;

    @ApiProperty({
        description: 'Resultados por participante',
        type: [ParticipantResult],
    })
    results!: ParticipantResult[];

    @ApiProperty({
        description: 'Timestamp da última atualização',
        example: '2025-10-16T10:30:00.000Z',
    })
    lastUpdated!: string;
}
```

**Uso**:

```typescript
// API Gateway - apps/api/api-gateway/src/app/controllers/votes.controller.ts
@Get()
async getResults(): Promise<ResultsResponseDto> {
  return this.client.send('vote.getStatus', {});
}
```

**Resposta JSON**:

```json
{
    "totalVotes": 3300,
    "results": [
        {
            "participantId": "participant-123",
            "votes": 1500,
            "percentage": 45.5
        },
        {
            "participantId": "participant-456",
            "votes": 1800,
            "percentage": 54.5
        }
    ],
    "lastUpdated": "2025-10-16T10:30:00.000Z"
}
```

---

### 4. **HourlyStatsDto** (Estatísticas)

**Arquivo**: `lib/stats/hourly-stats.dto.ts`

```typescript
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para estatísticas de votos por hora
 */
export class HourlyStatsDto {
    @ApiProperty({
        description: 'Hora do período (formato ISO 8601)',
        example: '2025-10-18T14:00:00.000Z',
    })
    hour: string;

    @ApiProperty({
        description: 'Total de votos nesta hora',
        example: 3500,
    })
    votes: number;
}

/**
 * DTO de resposta para estatísticas horárias
 */
export class HourlyStatsResponseDto {
    @ApiProperty({
        description: 'Estatísticas de votos agrupadas por hora',
        type: [HourlyStatsDto],
    })
    hourlyStats: HourlyStatsDto[];

    @ApiProperty({
        description: 'Total geral de votos',
        example: 15000,
    })
    totalVotes: number;

    @ApiProperty({
        description: 'Data/hora da última atualização',
        example: '2025-10-18T15:30:45.123Z',
    })
    lastUpdated: string;
}
```

**Uso**:

```typescript
// API Gateway
@Get('stats/hourly')
async getHourlyStats(): Promise<HourlyStatsResponseDto> {
  return this.client.send('vote.getHourlyStats', {});
}
```

**Resposta JSON**:

```json
{
    "hourlyStats": [
        { "hour": "2025-10-18T14:00:00.000Z", "votes": 3500 },
        { "hour": "2025-10-18T13:00:00.000Z", "votes": 2800 },
        { "hour": "2025-10-18T12:00:00.000Z", "votes": 4100 }
    ],
    "totalVotes": 15000,
    "lastUpdated": "2025-10-18T15:30:45.123Z"
}
```

---

### 5. **IParticipant** (Interface)

**Arquivo**: `lib/participant/interfaces/participant.interface.ts`

```typescript
export interface IParticipant {
    id: string;
    name: string;
    votes?: number;
    percentage?: number;
}
```

**Uso**:

```typescript
// Frontend - apps/web/src/types/participant.ts
import { IParticipant } from '@laager-bbb-voting-system/common';

export type Participant = IParticipant & {
    nickname?: string;
    photoUrl?: string;
};
```

---

## 🔧 Configuração

### TypeScript Path Alias

**Arquivo**: `tsconfig.base.json`

```json
{
    "compilerOptions": {
        "paths": {
            "@laager-bbb-voting-system/common": ["libs/common/src/index.ts"]
        }
    }
}
```

**Resultado**: Permite importar de qualquer projeto:

```typescript
// Ao invés de:
import { VoteDto } from '../../../libs/common/src/lib/vote/dto/vote.dto';

// Usar:
import { VoteDto } from '@laager-bbb-voting-system/common';
```

---

## 🚀 Como Usar

### 1. No API Gateway (NestJS)

```typescript
import { VoteDto, VoteResponseDto } from '@laager-bbb-voting-system/common';

@Controller('votes')
export class VotesController {
    @Post()
    async vote(@Body() voteDto: VoteDto): Promise<VoteResponseDto> {
        return this.client.send('vote.create', voteDto).toPromise();
    }
}
```

### 2. No Vote Service (NestJS Microservice)

```typescript
import { VoteDto, VoteResponseDto } from '@laager-bbb-voting-system/common';

@Controller()
export class AppController {
    @MessagePattern('vote.create')
    async handleVote(voteDto: VoteDto): Promise<VoteResponseDto> {
        return this.votesService.processVote(voteDto);
    }
}
```

### 3. No Frontend (Next.js)

```typescript
import { ResultsResponseDto } from '@laager-bbb-voting-system/common';

export const votingApi = {
    async getResults(): Promise<ResultsResponseDto> {
        const { data } = await apiClient.get<ResultsResponseDto>('/votes');
        return data;
    },
};
```

---

## 🎯 Decorators do NestJS

### @ApiProperty (Swagger)

```typescript
@ApiProperty({
  description: 'Descrição do campo',
  example: 'Valor de exemplo',
  required: false,  // Opcional
})
```

**Resultado**: Gera documentação Swagger automática em `/api-docs`

### @IsNotEmpty, @IsString (Validação)

```typescript
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@IsNotEmpty()  // Campo obrigatório
@IsString()    // Deve ser string
participantId!: string;

@IsOptional()  // Campo opcional
@IsString()
userId?: string;
```

**Resultado**: Validação automática no ValidationPipe do NestJS

---

## 🧪 Validações Automáticas

### ValidationPipe (main.ts)

```typescript
// apps/api/api-gateway/src/main.ts
app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true, // Remove campos não declarados
        forbidNonWhitelisted: true, // Retorna erro se receber campo extra
        transform: true, // Transforma tipos automaticamente
    })
);
```

**Exemplo de Erro**:

```json
// Request:
{ "participantId": "" }

// Response (400 Bad Request):
{
  "statusCode": 400,
  "message": ["participantId should not be empty"],
  "error": "Bad Request"
}
```

---

## 📊 Uso dos DTOs no Sistema

```
Frontend (Web)
    │
    │ POST /votes { participantId }
    ▼
API Gateway (VotesController)
    │
    │ Valida com VoteDto
    │
    │ RabbitMQ: vote.create
    ▼
Vote Service (AppController)
    │
    │ @MessagePattern('vote.create')
    │ Recebe VoteDto
    ▼
VotesService
    │
    │ Salva no Postgres (Prisma)
    │ Incrementa Redis
    │
    │ Retorna VoteResponseDto
    ▼
API Gateway
    │
    │ HTTP 201 Created
    ▼
Frontend (Web)
    │
    │ Success notification
```

---

## 🛡️ Vantagens da Lib Compartilhada

| Vantagem             | Descrição                                  |
| -------------------- | ------------------------------------------ |
| **Type Safety**      | TypeScript garante tipos consistentes      |
| **DRY**              | Evita duplicação de código                 |
| **Validação**        | Decorators do `class-validator`            |
| **Swagger**          | Documentação automática com `@ApiProperty` |
| **Manutenibilidade** | Mudança em 1 lugar afeta todos os serviços |
| **Consistência**     | Mesma estrutura de dados em API e Frontend |

---

## 🔄 Fluxo de Dados

### POST /votes (Criar Voto)

```
1. Frontend envia: { participantId: "uuid-123" }
2. API Gateway valida com VoteDto
4. RabbitMQ envia para Vote Service
5. Vote Service processa e retorna VoteResponseDto
6. API Gateway retorna ao Frontend
```

### GET /votes (Buscar Resultados)

```
1. Frontend solicita resultados
2. API Gateway chama Vote Service via RabbitMQ
3. Vote Service consulta Redis/Postgres
4. Vote Service retorna ResultsResponseDto
5. API Gateway retorna ao Frontend
```

### GET /votes/stats/hourly (Estatísticas)

```
1. Frontend/Dashboard solicita stats
2. API Gateway chama Vote Service
3. Vote Service executa SQL (DATE_TRUNC)
4. Vote Service retorna HourlyStatsResponseDto
5. API Gateway retorna ao Frontend
```

---

## 📚 Convenções

### Nomenclatura

-   **Request DTOs**: `*.dto.ts` (ex: `VoteDto`)
-   **Response DTOs**: `*-response.dto.ts` (ex: `VoteResponseDto`)
-   **Interfaces**: `*.interface.ts` (ex: `IParticipant`)

### Organização

```
lib/
├── <domain>/              # vote, stats, results, participant
│   ├── dto/               # DTOs de request/response
│   └── interfaces/        # Interfaces TypeScript
```

### Barrel Exports

**Sempre** exportar no `index.ts`:

```typescript
export * from './lib/vote/dto/vote.dto';
```

**Nunca** importar diretamente:

```typescript
// ❌ Não fazer:
import { VoteDto } from '@laager-bbb-voting-system/common/lib/vote/dto/vote.dto';

// ✅ Fazer:
import { VoteDto } from '@laager-bbb-voting-system/common';
```

---

## 🧪 Testing

### Unit Test (Jest)

```typescript
import { VoteDto } from '@laager-bbb-voting-system/common';

describe('VoteDto', () => {
    it('should validate participantId', () => {
        const dto = new VoteDto();
        dto.participantId = '';

        // Expect validation error
        expect(validate(dto)).rejects.toThrow();
    });
});
```

---

## 📦 Build

### Comando

```bash
nx build common
```

**Output**: `dist/libs/common/`

### Uso em Produção

```typescript
// package.json
{
  "dependencies": {
    "@laager-bbb-voting-system/common": "file:./dist/libs/common"
  }
}
```

---

## 🚨 Troubleshooting

### Erro: "Cannot find module '@laager-bbb-voting-system/common'"

**Solução**:

```bash
# Verificar tsconfig.base.json
cat tsconfig.base.json | grep paths

# Rebuild lib
nx build common
```

### Validação não funciona

**Solução**:

```bash
# Verificar instalação
npm install class-validator class-transformer

# Verificar ValidationPipe em main.ts
app.useGlobalPipes(new ValidationPipe());
```

---

## 📚 Referências

-   [NestJS Validation](https://docs.nestjs.com/techniques/validation)
-   [class-validator](https://github.com/typestack/class-validator)
-   [Swagger/OpenAPI](https://docs.nestjs.com/openapi/introduction)
-   [Nx Library](https://nx.dev/concepts/more-concepts/library-types)

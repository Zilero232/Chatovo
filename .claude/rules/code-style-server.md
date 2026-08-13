---
paths:
  - "apps/server/**/*.ts"
---

<!-- COMPRESSED editing-версия: автозагружается при правке файлов apps/server (paths-фронтматтер). -->
<!-- Полная конвенция модулей — apps/server/CLAUDE.md; общий кодстайл — docs/style.md. Держи в синхроне при изменении правила. -->

# Code Style — server (NestJS 11 на Bun + Prisma)

Расширяет общий `code-style.md`. Полная конвенция модулей, auth, realtime, ops — `apps/server/CLAUDE.md`.

## 1. Структура модуля

```
modules/rooms/
├── index.ts                    # public API — Module + сервисы для инъекции
├── rooms.module.ts
├── rooms.controller.ts         # transport only
├── services/
│   ├── index.ts
│   ├── rooms.service.types.ts  # <Fn>Input
│   └── rooms.service.ts
└── dto/rooms.dto.ts            # createZodDto(...) из @chatovo/schemas
```

`services/` всегда, даже под один сервис — один файл на домен работы, не жирный `<name>.service.ts` в корне модуля. Кросс-модульный импорт — только через barrel (`from '../realtime'`), не deep (`from '../realtime/emit'`). Контроллеры и DTO наружу не экспортируются.

## 2. Слои

- **Controller** — валидированный вход (`@Body() dto`), вызов сервиса, возврат значения. Без Prisma и бизнес-правил. Не собирай ответ руками — пусть сериализуется.
- **Service** — бизнес-логика. Инжектит `PrismaService` (`this.prisma.<model>`), другие сервисы, `AppConfigService`, `EventEmitter2`. Принимает простые аргументы (никакого `Request`), возвращает данные или **бросает** `ConflictException` / `NotFoundException` / `ForbiddenException` / `BadRequestException`. Ответы об ошибке не конструируем — глобальный `AllExceptionsFilter` превращает throw в `{ error: string }`.
- **lib/** — переиспользуемые guard-функции (`assertRoomExists`, `assertCanManageRoom`) и Prisma-селекты (`roomSelect`, `senderSelect`). Обычные функции на `basePrisma`, не провайдеры. Не переобъявляй их в модулях.

## 3. Сигнатуры

**2+ параметра → один объект**, тип `<Fn>Input` в `<module>.service.types.ts`. Одноаргументные (`listFriends(userId)`) остаются позиционными. То же правило на клиенте — общий `code-style.md` §2.

В файле сервиса/контроллера — **ничего кроме класса**. Константы → `config/<name>.config.ts`. Чистые функции → `lib/<fn-name>/` (папка на функцию: `<fn-name>.ts` + `index.ts` + `<fn-name>.types.ts` при 2+ параметрах).

## 4. Валидация

DTO — только `createZodDto(schema)` из `nestjs-zod`, схема из `@chatovo/schemas`. `class-validator` / `class-transformer` запрещены: они форкнут контракт, который клиент уже валидирует через `zodResolver`. Одна схема = валидация запроса + OpenAPI + валидация формы на клиенте.

## 5. Независимые `await` — параллельно

Как в общем правиле: второй вызов не использует результат первого → `Promise.all`.

**На сервере порядок чаще значим — не параллель:** guard перед мутацией (`assertCanManageRoom` → `delete`), проверка существования перед связанным чтением, запись перед чтением тех же данных, шаги транзакции. Параллелить можно независимые чтения.

```ts
// ✗ НЕ параллелить — guard обязан отработать до мутации
await assertCanManageRoom({ roomId, userId });
await this.prisma.room.delete({ where: { id: roomId } });
```

## 6. Side effects — через доменные события

Доменные сервисы не импортируют Telegram / email / push. Инжектят `EventEmitter2` и эмитят типизированное событие из `common/events/domain-events.ts`; `*.listener.ts` в `modules/notifications/` обрабатывает и держит свой try/catch. Плоские модули без DI (`call-store`, `emit-chat-event`) — через `emitDomainEvent`.

Fire-and-forget `.then()` без `.catch()` запрещён.

## 7. Prisma

`PrismaService` — подкласс `PrismaClient`, инжектится, модели зовутся напрямую. Без `$extends` и глобального маппинга ошибок: конфликты проверяем явно (`assertRoomNameAvailable` до create/rename) и бросаем нужный `HttpException`. `basePrisma` — только для better-auth, не в фиче-сервисах.

## 8. Локальные отличия от клиентского стиля

- `import type` не enforce-ится (`ts/consistent-type-imports` выключен для `apps/server/**`) — Nest резолвит зависимости по метаданным декораторов.
- Декораторы (`@Injectable`, `@Controller`, `@AllowAnonymous`, `@Session`) — не «комментарии», правило «без комментариев» их не касается.
- `process.env` в фиче-коде запрещён — только `AppConfigService.get('KEY')`.

## 9. Комментарии

Как в общем правиле: `modules/` — прикладной код, комментариев нет. Узкое исключение — короткий JSDoc у **экспортируемых** хелперов `src/lib/`, если сигнатура не объясняет контракт. Внутренние функции не документируются.

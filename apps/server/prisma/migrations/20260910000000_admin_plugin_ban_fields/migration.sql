-- Move moderation state onto the better-auth admin plugin fields.
-- blocked_at / blocked_reason become banned / ban_reason; blocked_by_id is kept
-- as banned_by_id because the plugin has no "who issued the ban" column.

ALTER TABLE "user" ADD COLUMN "banned" BOOLEAN DEFAULT false;
ALTER TABLE "user" ADD COLUMN "ban_reason" TEXT;
ALTER TABLE "user" ADD COLUMN "ban_expires" TIMESTAMPTZ(3);
ALTER TABLE "user" ADD COLUMN "banned_at" TIMESTAMPTZ(3);
ALTER TABLE "user" ADD COLUMN "banned_by_id" TEXT;

UPDATE "user"
SET "banned" = ("blocked_at" IS NOT NULL),
    "ban_reason" = "blocked_reason",
    "banned_at" = "blocked_at",
    "banned_by_id" = "blocked_by_id";

DROP INDEX IF EXISTS "user_blocked_at_idx";

ALTER TABLE "user" DROP COLUMN "blocked_at";
ALTER TABLE "user" DROP COLUMN "blocked_reason";
ALTER TABLE "user" DROP COLUMN "blocked_by_id";

CREATE INDEX "user_banned_idx" ON "user"("banned");

ALTER TABLE "session" ADD COLUMN "impersonated_by" TEXT;

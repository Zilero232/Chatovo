-- Moderation: abuse reports plus the block flags RuStore requires for a UGC app.
-- Every statement is additive; nothing is dropped or rewritten.

-- CreateEnum
CREATE TYPE "AbuseTarget" AS ENUM ('user', 'message', 'room');

-- CreateEnum
CREATE TYPE "AbuseReason" AS ENUM ('spam', 'harassment', 'hate', 'sexual', 'violence', 'illegal', 'other');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "blocked_at" TIMESTAMPTZ(3),
ADD COLUMN     "blocked_by_id" TEXT,
ADD COLUMN     "blocked_reason" TEXT;

-- CreateTable
CREATE TABLE "abuse_reports" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "target" "AbuseTarget" NOT NULL,
    "target_id" TEXT NOT NULL,
    "reason" "AbuseReason" NOT NULL,
    "comment" TEXT,
    "room_id" TEXT,
    "reporter_id" TEXT NOT NULL,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "handled_at" TIMESTAMPTZ(3),
    "handled_by_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "abuse_reports_pkey" PRIMARY KEY ("id")
);

-- Backs the duplicate check: one pending report per reporter per target.
-- CreateIndex
CREATE INDEX "abuse_reports_reporter_id_target_target_id_handled_idx" ON "abuse_reports"("reporter_id", "target", "target_id", "handled");

-- CreateIndex
CREATE INDEX "abuse_reports_handled_created_at_idx" ON "abuse_reports"("handled", "created_at" DESC);

-- CreateIndex
CREATE INDEX "abuse_reports_target_target_id_idx" ON "abuse_reports"("target", "target_id");

-- CreateIndex
CREATE INDEX "user_blocked_at_idx" ON "user"("blocked_at");

-- AddForeignKey
ALTER TABLE "abuse_reports" ADD CONSTRAINT "abuse_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abuse_reports" ADD CONSTRAINT "abuse_reports_handled_by_id_fkey" FOREIGN KEY ("handled_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

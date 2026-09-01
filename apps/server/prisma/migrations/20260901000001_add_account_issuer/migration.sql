-- better-auth 1.7 keys accounts by (issuer, accountId) instead of providerId alone.
-- Existing rows all come from email/password sign-up, whose issuer is "local:credential".

-- AlterTable
ALTER TABLE "account" ADD COLUMN     "issuer" TEXT NOT NULL DEFAULT 'local:credential';

-- CreateIndex
CREATE UNIQUE INDEX "account_issuer_accountId_key" ON "account"("issuer", "accountId");

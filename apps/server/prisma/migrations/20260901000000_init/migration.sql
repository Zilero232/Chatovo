-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."FriendshipStatus" AS ENUM ('pending', 'accepted');

-- CreateEnum
CREATE TYPE "public"."RoomKind" AS ENUM ('group', 'dm');

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMPTZ(3),
    "refreshTokenExpiresAt" TIMESTAMPTZ(3),
    "scope" TEXT,
    "password" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."friendship" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,
    "status" "public"."FriendshipStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "room_id" TEXT NOT NULL,
    "sender_id" TEXT,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(3),
    "edited_at" TIMESTAMPTZ(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile" (
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "profileUrl" TEXT,
    "bannerColor" TEXT,
    "bio" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."push_device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "push_device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."rooms" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "password" TEXT,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dm_user_a_id" TEXT,
    "dm_user_b_id" TEXT,
    "kind" "public"."RoomKind" NOT NULL DEFAULT 'group',

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "friendTag" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(3) NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "public"."account"("userId" ASC);

-- CreateIndex
CREATE INDEX "friendship_addresseeId_status_idx" ON "public"."friendship"("addresseeId" ASC, "status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "friendship_requesterId_addresseeId_key" ON "public"."friendship"("requesterId" ASC, "addresseeId" ASC);

-- CreateIndex
CREATE INDEX "friendship_requesterId_status_idx" ON "public"."friendship"("requesterId" ASC, "status" ASC);

-- CreateIndex
CREATE INDEX "messages_room_id_created_at_idx" ON "public"."messages"("room_id" ASC, "created_at" ASC);

-- CreateIndex
CREATE INDEX "messages_sender_id_idx" ON "public"."messages"("sender_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "push_device_token_key" ON "public"."push_device"("token" ASC);

-- CreateIndex
CREATE INDEX "push_device_userId_idx" ON "public"."push_device"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_kind_dm_user_a_id_dm_user_b_id_key" ON "public"."rooms"("kind" ASC, "dm_user_a_id" ASC, "dm_user_b_id" ASC);

-- CreateIndex
CREATE INDEX "rooms_kind_idx" ON "public"."rooms"("kind" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_name_key" ON "public"."rooms"("name" ASC);

-- CreateIndex
CREATE INDEX "rooms_owner_id_idx" ON "public"."rooms"("owner_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token" ASC);

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "public"."session"("userId" ASC);

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "public"."user"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_friendTag_key" ON "public"."user"("friendTag" ASC);

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "public"."verification"("identifier" ASC);

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."friendship" ADD CONSTRAINT "friendship_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."friendship" ADD CONSTRAINT "friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."push_device" ADD CONSTRAINT "push_device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rooms" ADD CONSTRAINT "rooms_dm_user_a_id_fkey" FOREIGN KEY ("dm_user_a_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rooms" ADD CONSTRAINT "rooms_dm_user_b_id_fkey" FOREIGN KEY ("dm_user_b_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."rooms" ADD CONSTRAINT "rooms_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;


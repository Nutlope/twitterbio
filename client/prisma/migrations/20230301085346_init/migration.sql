-- CreateTable
CREATE TABLE "field" (
    "field_id" SERIAL NOT NULL,
    "field_name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "placeholder" VARCHAR(255),
    "required" BOOLEAN NOT NULL,
    "tool_id" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL DEFAULT 'Active',
    "options" JSONB,
    "default_value" VARCHAR(255),
    "command" TEXT NOT NULL DEFAULT '""',

    CONSTRAINT "fields_pkey" PRIMARY KEY ("field_id")
);

-- CreateTable
CREATE TABLE "form_field_options" (
    "id" SERIAL NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "field_id" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool" (
    "tool_id" SERIAL NOT NULL,
    "tool_name" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "prompt" VARCHAR(5000) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "created_by" VARCHAR(255) NOT NULL,
    "model" VARCHAR(255) DEFAULT 'text-davinci-003',
    "temperature" DOUBLE PRECISION DEFAULT 0.7,
    "max_tokens" INTEGER DEFAULT 150,
    "top_p" DOUBLE PRECISION DEFAULT 1,
    "frequency_penalty" DOUBLE PRECISION DEFAULT 1,
    "presence_penalty" DOUBLE PRECISION DEFAULT 0,
    "long_markdown_description" VARCHAR(5000) DEFAULT '',
    "tags" VARCHAR(255) DEFAULT '[]',
    "example_response" VARCHAR(5000) DEFAULT '',
    "n_responses" INTEGER DEFAULT 1,
    "stop" JSON NOT NULL DEFAULT '["***NO STOP SEQUENCE***"]',

    CONSTRAINT "schemas_pkey" PRIMARY KEY ("tool_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "token_type" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "scope" TEXT,
    "id_token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_token" TEXT NOT NULL,
    "access_token" TEXT,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_token_key" ON "VerificationRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_identifier_token_key" ON "VerificationRequest"("identifier", "token");

-- AddForeignKey
ALTER TABLE "field" ADD CONSTRAINT "fields_schema_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tool"("tool_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "form_field_options" ADD CONSTRAINT "options_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "field"("field_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

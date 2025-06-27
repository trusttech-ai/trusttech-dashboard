-- CreateTable
CREATE TABLE "MessagesLog" (
    "id" UUID NOT NULL,
    "host_number" VARCHAR(25),
    "host_name" VARCHAR(25),
    "user_number" VARCHAR(25),
    "user_name" TEXT,
    "user_message" TEXT,
    "bot_response" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessagesLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewindCron" (
    "id" UUID NOT NULL,
    "host_name" VARCHAR(25),
    "host_number" VARCHAR(25),
    "user_number" VARCHAR(25) NOT NULL,
    "user_name" VARCHAR(25),
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewindCron_pkey" PRIMARY KEY ("id")
);

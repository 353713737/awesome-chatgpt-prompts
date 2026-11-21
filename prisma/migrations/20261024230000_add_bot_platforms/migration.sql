-- AlterTable
ALTER TABLE "prompts" ADD COLUMN "botPlatforms" "BotPlatform"[] DEFAULT ARRAY[]::"BotPlatform"[];

-- Backfill from the single-platform column, which stays in place until a later migration drops it
UPDATE "prompts"
SET "botPlatforms" = ARRAY["botPlatform"]
WHERE "botPlatform" IS NOT NULL
  AND ("botPlatforms" IS NULL OR cardinality("botPlatforms") = 0);

-- CreateIndex
CREATE INDEX "prompts_botPlatforms_idx" ON "prompts" USING GIN ("botPlatforms");

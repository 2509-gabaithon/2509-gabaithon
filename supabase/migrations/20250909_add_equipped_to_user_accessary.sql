-- Add equipped column to user_accessary table for managing equipped accessories
ALTER TABLE "public"."user_accessary" ADD COLUMN "equipped" boolean DEFAULT false;

-- Add unique constraint to ensure only one accessory can be equipped per user
CREATE UNIQUE INDEX "user_accessary_equipped_unique" ON "public"."user_accessary" ("user_id") WHERE "equipped" = true;

-- Comment for clarity
COMMENT ON COLUMN "public"."user_accessary"."equipped" IS 'Whether this accessory is currently equipped by the user. Only one accessory per user can be equipped.';

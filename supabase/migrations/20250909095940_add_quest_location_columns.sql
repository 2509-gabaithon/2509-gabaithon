-- Add lat and lng columns to quest table for future location-based features
ALTER TABLE "public"."quest" 
ADD COLUMN "lat" double precision,
ADD COLUMN "lng" double precision;

COMMENT ON COLUMN "public"."quest"."lat" IS 'Latitude coordinate for quest location';
COMMENT ON COLUMN "public"."quest"."lng" IS 'Longitude coordinate for quest location';

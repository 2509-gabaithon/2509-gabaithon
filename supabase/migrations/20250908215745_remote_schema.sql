alter table "public"."accessary" add column "description" text;

alter table "public"."nyuyoku_log" drop column "lat";

alter table "public"."nyuyoku_log" drop column "lng";

alter table "public"."nyuyoku_log" drop column "place_id";

alter table "public"."nyuyoku_log" add column "onsen_lat" double precision;

alter table "public"."nyuyoku_log" add column "onsen_lng" double precision;

alter table "public"."nyuyoku_log" add column "onsen_place_id" text not null;



CREATE TABLE "saves-api-keys" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"expires_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"is_revoked" boolean DEFAULT false,
	"scopes" jsonb DEFAULT '["*"]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "saves-collections" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "saves-content-collections" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"content_id" text NOT NULL,
	"collection_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saves-content-tags" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"content_id" text NOT NULL,
	"tag_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saves-tags" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"user_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saves-content" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "saves-content" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "saves-content" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "saves-content" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "saves-api-keys" ADD CONSTRAINT "saves-api-keys_user_id_saves-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."saves-users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves-collections" ADD CONSTRAINT "saves-collections_user_id_saves-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."saves-users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves-content-collections" ADD CONSTRAINT "saves-content-collections_content_id_saves-content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."saves-content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves-content-collections" ADD CONSTRAINT "saves-content-collections_collection_id_saves-collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."saves-collections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves-content-tags" ADD CONSTRAINT "saves-content-tags_content_id_saves-content_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."saves-content"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves-content-tags" ADD CONSTRAINT "saves-content-tags_tag_id_saves-tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."saves-tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves-tags" ADD CONSTRAINT "saves-tags_user_id_saves-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."saves-users"("id") ON DELETE no action ON UPDATE no action;
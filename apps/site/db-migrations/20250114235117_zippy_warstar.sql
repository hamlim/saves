CREATE TABLE "saves-content" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"user_id" text NOT NULL,
	"content" jsonb
);
--> statement-breakpoint
CREATE TABLE "saves-sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saves-users" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"username" text,
	"github_id" text,
	"avatar_url" text,
	"name" text,
	"email" text
);
--> statement-breakpoint
ALTER TABLE "saves-content" ADD CONSTRAINT "saves-content_user_id_saves-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."saves-users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saves-sessions" ADD CONSTRAINT "saves-sessions_user_id_saves-users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."saves-users"("id") ON DELETE no action ON UPDATE no action;
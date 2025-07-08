ALTER TABLE "users" ADD COLUMN "email_varified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_varification_token" varchar(250);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_varification_token_expire" timestamp with time zone;
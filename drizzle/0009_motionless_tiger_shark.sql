ALTER TABLE "users" ADD COLUMN "password_reset_token" varchar(300);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_reset_token_expire" timestamp with time zone;
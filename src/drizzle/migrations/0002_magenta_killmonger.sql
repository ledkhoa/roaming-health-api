CREATE TABLE "workplaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"address1" varchar(255) NOT NULL,
	"address2" varchar(128),
	"city" varchar(128) NOT NULL,
	"state" varchar(13) NOT NULL,
	"zip" varchar(5) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workers" DROP CONSTRAINT "workers_email_unique";--> statement-breakpoint
CREATE INDEX "workplaces_name_idx" ON "workplaces" USING btree ("name");--> statement-breakpoint
CREATE INDEX "workplaces_city_idx" ON "workplaces" USING btree ("city");--> statement-breakpoint
CREATE INDEX "workplaces_state_idx" ON "workplaces" USING btree ("state");--> statement-breakpoint
CREATE INDEX "workers_first_name_idx" ON "workers" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX "workers_last_name_idx" ON "workers" USING btree ("last_name");--> statement-breakpoint
CREATE UNIQUE INDEX "workers_email_idx" ON "workers" USING btree ("email");
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"external_id" uuid,
	"created_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "accounts_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "bill_settlements" (
	"id" uuid PRIMARY KEY NOT NULL,
	"bill_id" uuid NOT NULL,
	"amount_cents" bigint NOT NULL,
	"paid_at" date NOT NULL,
	"reversed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bills" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"type" varchar(12) NOT NULL,
	"description" varchar(255) NOT NULL,
	"group_id" uuid NOT NULL,
	"installment_number" integer NOT NULL,
	"installments_total" integer NOT NULL,
	"due_date" date NOT NULL,
	"amount_cents" bigint NOT NULL,
	"paid_cents" bigint DEFAULT 0 NOT NULL,
	"canceled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bill_settlements" ADD CONSTRAINT "bill_settlements_bill_id_bills_id_fk" FOREIGN KEY ("bill_id") REFERENCES "public"."bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bill_settlements_bill_idx" ON "bill_settlements" USING btree ("bill_id");--> statement-breakpoint
CREATE INDEX "bills_account_due_idx" ON "bills" USING btree ("account_id","due_date");--> statement-breakpoint
CREATE INDEX "bills_group_idx" ON "bills" USING btree ("group_id");
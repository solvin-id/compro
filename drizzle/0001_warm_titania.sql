CREATE TABLE "portfolio" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"year" text NOT NULL,
	"sector" text NOT NULL,
	"description" text NOT NULL,
	"client" text,
	"problem" text,
	"solution" text,
	"outcome" text,
	"tech_stack" text,
	"image" text,
	"status" text DEFAULT 'draft',
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "portfolio_slug_unique" UNIQUE("slug")
);

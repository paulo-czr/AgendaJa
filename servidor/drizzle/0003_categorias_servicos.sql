CREATE TABLE "categorias_servicos" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_organizacao" integer NOT NULL,
	"nome" varchar(60) NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "servicos" ADD COLUMN "id_categoria" integer;--> statement-breakpoint
ALTER TABLE "categorias_servicos" ADD CONSTRAINT "categorias_servicos_id_organizacao_organizacoes_id_fk" FOREIGN KEY ("id_organizacao") REFERENCES "public"."organizacoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categorias_servicos_organizacao_nome_unico" ON "categorias_servicos" USING btree ("id_organizacao","nome");--> statement-breakpoint
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_id_categoria_categorias_servicos_id_fk" FOREIGN KEY ("id_categoria") REFERENCES "public"."categorias_servicos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicos" DROP COLUMN "categoria";
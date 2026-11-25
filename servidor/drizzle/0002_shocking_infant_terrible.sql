ALTER TABLE "servicos" RENAME COLUMN "preco" TO "preco_centavos";--> statement-breakpoint
ALTER TABLE "servicos" ALTER COLUMN "nome_servico" SET DATA TYPE varchar(120);--> statement-breakpoint
ALTER TABLE "servicos" ALTER COLUMN "descricao_servico" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "servicos" ADD COLUMN "categoria" varchar(60);--> statement-breakpoint
ALTER TABLE "servicos" ADD COLUMN "desativado_em" timestamp with time zone;
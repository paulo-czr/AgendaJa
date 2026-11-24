ALTER TABLE "organizacoes" ADD COLUMN "telefone" varchar(20);--> statement-breakpoint
ALTER TABLE "organizacoes" ADD COLUMN "duracao_padrao_minutos" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "configuracoes_agenda" ADD COLUMN "inicio_pausa" varchar(5);--> statement-breakpoint
ALTER TABLE "configuracoes_agenda" ADD COLUMN "fim_pausa" varchar(5);--> statement-breakpoint
CREATE UNIQUE INDEX "organizacoes_id_usuario_unico" ON "organizacoes" USING btree ("id_usuario");--> statement-breakpoint
CREATE UNIQUE INDEX "configuracoes_agenda_organizacao_dia_unico" ON "configuracoes_agenda" USING btree ("id_organizacao","dia_semana");
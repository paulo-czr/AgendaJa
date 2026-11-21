CREATE TYPE "public"."papel_usuario" AS ENUM('cliente', 'prestador');--> statement-breakpoint
CREATE TYPE "public"."agendamento_status" AS ENUM('pendente', 'confirmado', 'cancelado', 'concluido');--> statement-breakpoint
CREATE TYPE "public"."tipo_token_autenticacao" AS ENUM('verificacao_email', 'recuperacao_senha', 'refresh_token');--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(150) NOT NULL,
	"email" varchar(255) NOT NULL,
	"senha_hash" text NOT NULL,
	"telefone" varchar(20) NOT NULL,
	"role" "papel_usuario" DEFAULT 'cliente' NOT NULL,
	"email_verificado" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "organizacoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer NOT NULL,
	"nome_fantasia" varchar(255) NOT NULL,
	"documento" varchar(20) NOT NULL,
	"endereco" text,
	"capacidade_simultanea" integer DEFAULT 1 NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizacoes_documento_unique" UNIQUE("documento")
);
--> statement-breakpoint
CREATE TABLE "servicos" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_organizacao" integer NOT NULL,
	"nome_servico" varchar(255) NOT NULL,
	"descricao_servico" text,
	"preco" numeric(10, 2) NOT NULL,
	"duracao_minutos" integer NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agendamentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_cliente" integer NOT NULL,
	"id_servico" integer NOT NULL,
	"data_hora_inicio" timestamp with time zone NOT NULL,
	"data_hora_fim" timestamp with time zone NOT NULL,
	"status" "agendamento_status" DEFAULT 'pendente' NOT NULL,
	"observacoes" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bloqueios_agenda" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_organizacao" integer NOT NULL,
	"data_hora_inicio" timestamp with time zone NOT NULL,
	"data_hora_fim" timestamp with time zone NOT NULL,
	"motivo" varchar(255),
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "configuracoes_agenda" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_organizacao" integer NOT NULL,
	"dia_semana" integer NOT NULL,
	"horario_abertura" varchar(5) NOT NULL,
	"horario_fechamento" varchar(5) NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relatorios" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_cliente" integer NOT NULL,
	"id_servico" integer NOT NULL,
	"id_usuario" integer NOT NULL,
	"id_agendamento" integer,
	"nome_prestador" varchar(255) NOT NULL,
	"observacao" text,
	"descricao_relatorio" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tokens_autenticacao" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_usuario" integer NOT NULL,
	"token_hash" text NOT NULL,
	"tipo" "tipo_token_autenticacao" NOT NULL,
	"expira_em" timestamp with time zone NOT NULL,
	"usado_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tokens_autenticacao_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "organizacoes" ADD CONSTRAINT "organizacoes_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_id_organizacao_organizacoes_id_fk" FOREIGN KEY ("id_organizacao") REFERENCES "public"."organizacoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_id_cliente_usuarios_id_fk" FOREIGN KEY ("id_cliente") REFERENCES "public"."usuarios"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agendamentos" ADD CONSTRAINT "agendamentos_id_servico_servicos_id_fk" FOREIGN KEY ("id_servico") REFERENCES "public"."servicos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bloqueios_agenda" ADD CONSTRAINT "bloqueios_agenda_id_organizacao_organizacoes_id_fk" FOREIGN KEY ("id_organizacao") REFERENCES "public"."organizacoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "configuracoes_agenda" ADD CONSTRAINT "configuracoes_agenda_id_organizacao_organizacoes_id_fk" FOREIGN KEY ("id_organizacao") REFERENCES "public"."organizacoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_id_cliente_usuarios_id_fk" FOREIGN KEY ("id_cliente") REFERENCES "public"."usuarios"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_id_servico_servicos_id_fk" FOREIGN KEY ("id_servico") REFERENCES "public"."servicos"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relatorios" ADD CONSTRAINT "relatorios_id_agendamento_agendamentos_id_fk" FOREIGN KEY ("id_agendamento") REFERENCES "public"."agendamentos"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tokens_autenticacao" ADD CONSTRAINT "tokens_autenticacao_id_usuario_usuarios_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
const mensagensPorPeriodo = {
	madrugada: [
		'O mundo está mais quietinho por agora. Aproveite esse momento.',
		'Que a tranquilidade desta madrugada acompanhe seus pensamentos.',
		'Entre uma estrela e outra, sempre há espaço para novos sonhos.',
		'A noite também tem sua beleza. Aproveite o silêncio.',
		'As pessoas realmente leem isto?',
		'Se você está lendo isso, provavelmente deveria estar dormindo.',
		'A coruja aqui recomenda mais algumas horas de sono.',
		'Não conte para ninguém, mas a madrugada é meu horário favorito.',
		'O espaço não é completamente silencioso: existem ondas e vibrações que podem ser convertidas em sons.',
	],

	manha: [
		'Que hoje seja um daqueles dias que começam bem e terminam melhor ainda.',
		'Um novo dia, novas possibilidades e muitos motivos para sorrir.',
		'Que não faltem motivos para agradecer e sorrir nesta manhã.',
		'Respire fundo, aproveite o momento e deixe o dia acontecer.',
		'Toda manhã traz consigo a oportunidade de recomeçar.',
		'Que seu café seja bom e seu dia seja ainda melhor.',
		'Que tal um cafézinho ?',
		'As pessoas realmente leem isto?',
		'Se você já tomou café, está oficialmente pronto para quase tudo.',
		'Hoje é um ótimo dia para fingir que sabe o que está fazendo. Todos fazemos isso.',
		'Lembre-se: até o despertador merece ser perdoado.',
		'O primeiro despertador só podia tocar às 4 horas da manhã. Que falta de consideração!',
		'Esta mensagem foi revisada por absolutamente ninguém.',
		'Não precisa ter tudo planejado para continuar caminhando.',
	],

	tarde: [
		'Que o restante do seu dia seja leve e cheio de boas surpresas.',
		'Uma pausa para respirar também faz parte.',
		'Que a tarde traga boas notícias e motivos para sorrir.',
		'Nem tudo precisa ser corrido. Aproveite também os pequenos momentos.',
		'Que nunca falte um motivo para deixar o dia mais bonito.',
		'Um pouquinho de leveza para continuar a jornada.',
		'As pessoas realmente leem isto?',
		'Já bebeu água hoje? Este é seu lembrete não solicitado.',
		'Você está indo muito bem. Inclusive, por estar lendo mensagens aleatórias.',
		'O animal nacional da Escócia é o unicórnio.',
		'Pequenos progressos também são progressos.',
		'Segundo meus cálculos, você merece um café.',
		'Esta mensagem foi revisada por absolutamente ninguém.',
		'Não precisa ter tudo planejado para continuar caminhando.',
	],

	noite: [
		'Que a noite traga a tranquilidade que o dia merece.',
		'Por hoje, está tudo bem desacelerar. Descanse!',
		'Que seus sonhos sejam tão bonitos quanto os planos que você carrega.',
		'O dia está chegando ao fim. Aproveite seu merecido descanso.',
		'Deixe as preocupações para amanhã. Hoje é hora de relaxar.',
		'Que não falte paz no coração e tranquilidade nesta noite.',
		'As pessoas realmente leem isto?',
		'Se você está trabalhando até agora, considere isso um abraço virtual.',
		'Seu sofá está com saudades.',
		'Amanhã você resolve. Hoje você merece descansar.',
		'Parabéns por mais um dia. Não é pouca coisa!',
	],
};

function escolherAleatorio<T>(lista: T[]): T {
	return lista[Math.floor(Math.random() * lista.length)];
}

export function mensagemDoDia(): string {
	const hora = new Date().getHours();
	if (hora < 5) return escolherAleatorio(mensagensPorPeriodo.madrugada);
	if (hora < 12) return escolherAleatorio(mensagensPorPeriodo.manha);
	if (hora < 18) return escolherAleatorio(mensagensPorPeriodo.tarde);
	return escolherAleatorio(mensagensPorPeriodo.noite);
}

// 15 Min
export const INTERVALO_MENSAGEM_MS = 15 * 60 * 1000;

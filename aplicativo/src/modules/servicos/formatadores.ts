const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
});

export function formatarPrecoCentavos(centavos: number): string {
	return formatadorMoeda.format(centavos / 100);
}

export function formatarDuracao(minutos: number): string {
	if (minutos < 60) {
		return `${minutos} min`;
	}

	const horas = Math.floor(minutos / 60);
	const restante = minutos % 60;
	return restante > 0 ? `${horas}h ${restante}min` : `${horas}h`;
}

/** Converte texto digitado (ex.: "45,50" ou "45.50") para inteiro em centavos. */
export function parsearPrecoParaCentavos(valor: string): number | null {
	const normalizado = valor.trim().replace(/\./g, '').replace(',', '.');
	if (!normalizado) {
		return null;
	}

	const numero = Number(normalizado);
	if (!Number.isFinite(numero) || numero < 0) {
		return null;
	}

	return Math.round(numero * 100);
}

export function formatarCentavosParaInput(centavos: number): string {
	return (centavos / 100).toFixed(2).replace('.', ',');
}

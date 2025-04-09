export function currency(value: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(value);
}

export function datetime(value: number | string | Date): string {
	const date = new Date(value);
	const options: Intl.DateTimeFormatOptions = {
		timeStyle: "medium",
		dateStyle: "short",
		hour12: false,
	};
	return Intl.DateTimeFormat("pt-BR", options).format(date);
}

export function date(value: number | string | Date): string {
	const date = new Date(value);
	const options: Intl.DateTimeFormatOptions = {
		dateStyle: "short",
		hour12: false,
		timeZone: "UTC",
	};
	return Intl.DateTimeFormat("pt-BR", options).format(date);
}

export default {
	date,
	datetime,
	currency,
};

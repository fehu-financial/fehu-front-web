export default class Formatter {
	currency(value: number): string {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	}

	datetime(value: number | string | Date): string {
		const date = new Date(value);
		const options: Intl.DateTimeFormatOptions = {
			timeStyle: "medium",
			dateStyle: "short",
			hour12: false,
		};
		return Intl.DateTimeFormat("pt-BR", options).format(date);
	}

	date(value: number | string | Date): string {
		const date = new Date(value);
		const options: Intl.DateTimeFormatOptions = {
			dateStyle: "short",
			hour12: false,
		};
		return Intl.DateTimeFormat("pt-BR", options).format(date);
	}
}

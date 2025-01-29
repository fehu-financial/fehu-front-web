export default class Formatter {
	static currency(value: number): string {
		return new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(value);
	}

	static datetime(value: number | string | Date): string {
		const date = new Date(value);
		const options: Intl.DateTimeFormatOptions = {
			timeStyle: "medium",
			dateStyle: "short",
			hour12: false,
		};
		return Intl.DateTimeFormat("pt-BR", options).format(date);
	}

	static date(value: number | string | Date): string {
		const date = new Date(value);
		const options: Intl.DateTimeFormatOptions = {
			dateStyle: "short",
			hour12: false,
		};
		return Intl.DateTimeFormat("pt-BR", options).format(date);
	}

	none() {
		return null;
	}
}

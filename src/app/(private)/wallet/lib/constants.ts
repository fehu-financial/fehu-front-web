export const BANKS = {
	ITAU: {
		name: "Itaú Unibanco",
		logo: "/images/banks/itau.svg",
		gradient: "from-orange-500 to-orange-600",
		color: "#ff6200",
	},
	BRADESCO: {
		name: "Banco Bradesco",
		logo: "/images/banks/bradesco.svg",
		gradient: "from-red-600 to-red-700",
		color: "#cc092f",
	},
	SANTANDER: {
		name: "Banco Santander",
		logo: "/images/banks/santander.svg",
		gradient: "from-red-500 to-red-600",
		color: "#ec0000",
	},
	NUBANK: {
		name: "Nubank",
		logo: "/images/banks/nubank.svg",
		gradient: "from-purple-600 to-purple-700",
		color: "#8a05be",
	},
	BANCO_DO_BRASIL: {
		name: "Banco do Brasil",
		logo: "/images/banks/bb.svg",
		gradient: "from-yellow-400 to-yellow-500",
		color: "#fbb914",
	},
	CAIXA: {
		name: "Caixa Econômica Federal",
		logo: "/images/banks/caixa.svg",
		gradient: "from-blue-700 to-blue-800",
		color: "#0066cc",
	},
	INTER: {
		name: "Banco Inter",
		logo: "/images/banks/inter.svg",
		gradient: "from-orange-400 to-orange-500",
		color: "#ea7100",
	},
	C6_BANK: {
		name: "C6 Bank",
		logo: "/images/banks/c6.svg",
		gradient: "from-neutral-800 to-neutral-900",
		color: "#1a1a1a",
	},
	BTG_PACTUAL: {
		name: "BTG Pactual",
		logo: "/images/banks/btg.svg",
		gradient: "from-blue-800 to-blue-900",
		color: "#1e3a8a",
	},
	SICREDI: {
		name: "Sicredi",
		logo: "/images/banks/sicredi.svg",
		gradient: "from-green-500 to-green-600",
		color: "#22c55e",
	},
	XP: {
		name: "XP Investimentos",
		logo: "/images/banks/xp.svg",
		gradient: "from-slate-800 to-slate-900",
		color: "#000000",
	},
	BANCO_PAN: {
		name: "Banco PAN",
		logo: "/images/banks/pan.svg",
		gradient: "from-cyan-400 to-cyan-500",
		color: "#06b6d4",
	},
	MERCADO_PAGO: {
		name: "Mercado Pago",
		logo: "/images/banks/mercadopago.svg",
		gradient: "from-sky-400 to-sky-500",
		color: "#00aaff",
	},
	PAGBANK: {
		name: "PagBank",
		logo: "/images/banks/pagbank.svg",
		gradient: "from-yellow-400 to-yellow-500",
		color: "#fcb900",
	},
} as const;

export const CREDIT_CARD_BRANDS = [
	{ id: "VISA", label: "Visa", logo: "/images/credit-cards/brands/visa.svg" },
	{
		id: "MASTERCARD",
		label: "Mastercard",
		logo: "/images/credit-cards/brands/mastercard.svg",
	},
	{ id: "ELO", label: "Elo", logo: "/images/credit-cards/brands/elo.svg" },
	{
		id: "AMEX",
		label: "American Express",
		logo: "/images/credit-cards/brands/amex.svg",
	},
	{
		id: "HIPERCARD",
		label: "Hipercard",
		logo: "/images/credit-cards/brands/hipercard.svg",
	},
	{
		id: "DINERS",
		label: "Diners Club",
		logo: "/images/credit-cards/brands/diners.svg",
	},
	{
		id: "DISCOVER",
		label: "Discover",
		logo: "/images/credit-cards/brands/discover.svg",
	},
	{ id: "AURA", label: "Aura", logo: "/images/credit-cards/brands/aura.svg" },
	{ id: "JCB", label: "JCB", logo: "/images/credit-cards/brands/jcb.svg" },
] as const;

export const ACCOUNT_TYPES = [
	{ value: "CHECKING", label: "Conta Corrente" },
	{ value: "SAVINGS", label: "Poupança" },
	{ value: "PAYMENT", label: "Conta de Pagamento" },
] as const;

export const CREDIT_CARD_ISSUERS = [
	{ id: "ITAU", label: "Itaú" },
	{ id: "BRADESCO", label: "Bradesco" },
	{ id: "SANTANDER", label: "Santander" },
	{ id: "NUBANK", label: "Nubank" },
	{ id: "BANCO_DO_BRASIL", label: "Banco do Brasil" },
	{ id: "CAIXA", label: "Caixa Econômica Federal" },
	{ id: "INTER", label: "Banco Inter" },
	{ id: "SICOOB", label: "Sicoob" },
	{ id: "SICREDI", label: "Sicredi" },
	{ id: "ORIGINAL", label: "Banco Original" },
	{ id: "SAFRA", label: "Banco Safra" },
	{ id: "BTG", label: "BTG Pactual" },
	{ id: "C6", label: "C6 Bank" },
	{ id: "NEON", label: "Neon" },
	{ id: "PICPAY", label: "PicPay" },
	{ id: "NEXT", label: "Next" },
	{ id: "WILL_BANK", label: "Will Bank" },
	{ id: "MERCADO_PAGO", label: "Mercado Pago" },
	{ id: "PAGBANK", label: "PagBank" },
	{ id: "OTHER", label: "Outro" },
] as const;

export type BankKey = keyof typeof BANKS;
export type CardBrand = (typeof CREDIT_CARD_BRANDS)[number]["id"];
export type AccountType = (typeof ACCOUNT_TYPES)[number]["value"];
export type CardIssuer = (typeof CREDIT_CARD_ISSUERS)[number]["id"];

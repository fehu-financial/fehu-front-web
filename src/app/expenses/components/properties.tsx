import {
	Building2,
	BusFront,
	CarFront,
	CheckCircle,
	CircleEllipsis,
	CreditCard,
	DollarSign,
	HeartPulse,
	House,
	OctagonAlert,
	PenLine,
	Shield,
	ShoppingCart,
	TicketsPlane,
	Utensils,
} from "lucide-react";

export const statuses = [
	{
		id: "PAID",
		label: "Pago",
		color: "green-500",
		icon: CheckCircle,
	},
	{
		id: "PENDING",
		label: "Pendente",
		color: "yellow-500",
		icon: CircleEllipsis,
	},
	{
		id: "OVERDUE",
		label: "Atrasado",
		color: "red-500",
		icon: OctagonAlert,
	},
];

export const categories = [
	{
		id: "CREDIT_CARD",
		label: "Cartão de Crédito",
		icon: CreditCard,
		color: "bg-blue-600",
	},
	{
		id: "CONDO",
		label: "Condomínio",
		icon: Building2,
		color: "bg-stone-600",
	},
	{
		id: "MARKET",
		label: "Mercado",
		icon: ShoppingCart,
		color: "bg-green-600",
	},
	{
		id: "VEHICLE",
		label: "Veículo",
		icon: CarFront,
		color: "bg-purple-600",
	},
	{
		id: "FEED",
		label: "Alimentação",
		icon: Utensils,
		color: "bg-orange-600",
	},
	{
		id: "HEALTH",
		label: "Saúde",
		icon: HeartPulse,
		color: "bg-red-600",
	},
	{
		id: "INSURANCE",
		label: "Seguro",
		icon: Shield,
		color: "bg-fuchsia-600",
	},
	{
		id: "LEISURE",
		label: "Lazer",
		icon: TicketsPlane,
		color: "bg-teal-600",
	},
	{
		id: "TAXES",
		label: "Impostos",
		icon: DollarSign,
		color: "bg-red-600",
	},
	{
		id: "TRANSPORT",
		label: "Transporte",
		icon: BusFront,
		color: "bg-zinc-600",
	},
	{
		id: "WORK",
		label: "Trabalho",
		icon: Building2,
		color: "bg-slate-600",
	},
	{
		id: "SUBSCRIPTION",
		label: "Assinatura",
		icon: PenLine,
		color: "bg-rose-600",
	},
	{
		id: "HOME",
		label: "Casa",
		icon: House,
		color: "bg-sky-600",
	},
];

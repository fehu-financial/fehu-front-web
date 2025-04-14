"use client";

import type { User } from "@/actions/get-user";
import { type CardTheme, MotionCard } from "@/components/ui/motion-card";
import useCookies from "@/hooks/use-cookies";
import { motion } from "motion/react";

const financialData = [
	{
		id: "investments",
		title: "Investimentos",
		icon: "PiggyBank",
		items: [
			"Renda Fixa (CDBs, LCIs, LCAs)",
			"Renda Variável (Ações, BDRs, FIIs)",
			"Poupança",
			"Tesouro Direto",
		],
		buttonText: "Gerenciar Investimentos",
		href: "/investments",
		theme: "primary" as CardTheme,
	},
	{
		id: "expenses",
		title: "Despesas",
		icon: "CreditCard",
		items: [
			"Cartões de Crédito",
			"Financiamentos",
			"Taxas de Condomínio",
			"Contas Recorrentes",
		],
		buttonText: "Acompanhar Despesas",
		href: "/expenses",
		theme: "secondary" as CardTheme,
	},
	{
		id: "budgets",
		title: "Orçamentos",
		icon: "BarChart3",
		items: [
			"Planejamento de Viagens",
			"Reformas Residenciais",
			"Projetos Especiais",
			"Acompanhamento de Metas",
		],
		buttonText: "Planejar Orçamentos",
		href: "/budgets",
		theme: "tertiary" as CardTheme,
	},
];

export default function Home() {
	const user = useCookies<User | null>("user", null, "json");
	const currentHour = new Date().getHours();
	const greeting =
		currentHour < 12 ? "Bom dia" : currentHour < 18 ? "Boa tarde" : "Boa noite";
	const username = user.value?.name;

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2,
			},
		},
	};

	return (
		<div className="flex h-full flex-col">
			<section className="w-full py-8 md:py-16 lg:py-24 xl:py-32">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
								{greeting}, {username?.split(" ").at(0)?.toUpperCase()}!
							</h1>
							<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
								Estamos empolgados para ajudá-lo a assumir o controle de suas
								finanças com o Fehu Financial.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="w-full py-8">
				<motion.div
					// ref={containerRef}
					className="mx-auto max-w-5xl grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					{financialData.map((card, index) => (
						<MotionCard
							key={card.id}
							id={card.id}
							title={card.title}
							icon={card.icon}
							items={card.items}
							buttonText={card.buttonText}
							href={card.href}
							theme={card.theme}
							index={index}
						/>
					))}
				</motion.div>
			</section>
		</div>
	);
}

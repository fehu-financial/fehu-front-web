"use client";

import { type Category, fetchCategories } from "@/actions/categories";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import * as LucideIcons from "lucide-react";

interface CategorySelectProps {
	placeholder?: string;
	onValueChange?: (value: string) => void;
	defaultValue?: string;
	className?: string;
}

// Função utilitária para aceitar tanto string (nome do ícone) quanto componente (LucideIcon)
function getIcon(icon: string | React.ComponentType<{ size?: number }>) {
	if (typeof icon === "string") {
		return LucideIcons[
			icon as keyof typeof LucideIcons
		] as React.ComponentType<{ size?: number }>;
	}
	return icon;
}

export function CategorySelect({
	placeholder = "Selecione uma categoria",
	onValueChange,
	defaultValue,
	className,
}: CategorySelectProps) {
	const { data: categories, isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		staleTime: 1000 * 60 * 360,
	});

	if (isLoading) {
		return (
			<Select disabled>
				<SelectTrigger>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
			</Select>
		);
	}

	if (!categories) {
		return (
			<Select disabled>
				<SelectTrigger>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
			</Select>
		);
	}

	return (
		<Select onValueChange={onValueChange} defaultValue={defaultValue}>
			<SelectTrigger>
				<SelectValue placeholder="Selecione uma categoria" />
			</SelectTrigger>
			<SelectContent>
				<div className="grid grid-cols-1 gap-2 p-2">
					{/* Grupo: Receitas */}
					<span className="text-xs font-semibold text-muted-foreground px-2 pt-2">
						Receitas
					</span>
					{categories.income?.map((category) => {
						const Icon = getIcon(category.icon);
						return (
							<SelectItem
								key={category.id}
								value={category.id}
								className="flex items-center rounded-lg cursor-pointer p-2 hover:bg-accent w-full"
							>
								<div className="flex space-x-2 items-center">
									<div
										className={cn(
											"rounded-full p-1.5 font-bold",
											category?.color,
										)}
									>
										{Icon && <Icon size={16} />}
									</div>
									<span>{category?.label}</span>
								</div>
							</SelectItem>
						);
					})}

					{/* Grupo: Despesas */}
					<span className="text-xs font-semibold text-muted-foreground px-2 pt-4">
						Despesas
					</span>
					{categories.expenses?.map((category) => {
						const Icon = getIcon(category.icon);
						return (
							<div key={category.id}>
								<SelectItem
									value={category.id}
									className="flex items-center rounded-lg cursor-pointer p-2 hover:bg-accent w-full"
								>
									<div className="flex space-x-2 items-center">
										<div
											className={cn(
												"rounded-full p-1.5 font-bold",
												category?.color,
											)}
										>
											{Icon && <Icon size={16} />}
										</div>
										<span>{category?.label}</span>
									</div>
								</SelectItem>
								{/* Subcategorias */}
								{category.subcategories?.map((sub) => {
									const SubIcon = getIcon(sub.icon);
									return (
										<SelectItem
											key={sub.id}
											value={sub.id}
											className="flex items-center rounded-lg cursor-pointer p-2 pl-8 hover:bg-accent w-full text-sm opacity-90"
										>
											<div className="flex space-x-2 items-center">
												<div
													className={cn(
														"rounded-full p-1 font-bold",
														category?.color,
													)}
												>
													{SubIcon && <SubIcon size={14} />}
												</div>
												<span>{sub.label}</span>
											</div>
										</SelectItem>
									);
								})}
							</div>
						);
					})}
				</div>
			</SelectContent>
		</Select>
	);
}

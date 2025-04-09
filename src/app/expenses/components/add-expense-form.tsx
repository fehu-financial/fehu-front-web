"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { createExpense } from "@/core/actions/expenses";
import { getSelectedWorkspace } from "@/core/actions/wokspaces";
import { ExpenseSchema } from "@/core/domain/expense";
import Formatter from "@/core/lib/formatter";
import { cn } from "@/core/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { categories, recurrencies } from "./properties";

export default function AddExpenseForm() {
	const [loading, setLoading] = useState(false);

	const form = useForm<z.infer<typeof ExpenseSchema>>({
		resolver: zodResolver(ExpenseSchema),
		defaultValues: {
			title: "",
			description: "",
			amount: 0,
			date: new Date(),
			recurrence: undefined,
		},
	});

	async function onSubmit(data: z.infer<typeof ExpenseSchema>) {
		setLoading(true);
		const selectedWorkspace = await getSelectedWorkspace();
		if (!selectedWorkspace) throw new Error("Workspace not selected");

		const response = await createExpense({
			createExpenseInput: {
				workspaceId: selectedWorkspace.id,
				workspaceType: selectedWorkspace.type,
				title: data.title,
				description: data.description,
				totalAmount: data.amount,
				category: data.category || "",
				dueDate: data.date,
				recurrence: data.recurrence ? { interval: data.recurrence as any } : undefined,
			},
		});
		setLoading(false);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="amount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									type="number"
									step="0.01"
									{...field}
									onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Date</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant={"outline"}
											className={cn(" pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
										>
											{field.value ? Formatter.date(field.value) : <span>Pick a date</span>}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										disabled={(date) => date < new Date()}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Categoria</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecione uma das categorias" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{categories.map((category) => (
										<SelectItem key={category.id} value={category.id}>
											<div className={cn("flex space-x-2 py-1 items-center")}>
												<div className={cn("rounded-full p-1.5 font-bold", category ? category?.color : "gray-600")}>
													{category && <category.icon size={14} />}
												</div>
												<span>{category?.label}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="recurrence"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Recorrencia</FormLabel>
							<ToggleGroup
								variant="outline"
								type="single"
								value={field.value}
								onValueChange={(value) => field.onChange(value)}
							>
								{recurrencies.map((recurrence) => (
									<ToggleGroupItem key={recurrence.id} value={recurrence.id}>
										{recurrence.label}
									</ToggleGroupItem>
								))}
							</ToggleGroup>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={loading}>
					{loading ? <Spinner /> : "Confirmar"}
				</Button>
			</form>
		</Form>
	);
}

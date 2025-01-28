"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useExpenses } from "./ExpensesContext";

const categories = [
	"Food",
	"Utilities",
	"Entertainment",
	"Transportation",
	"Health",
	"Education",
	"Insurance",
	"Other",
];

export default function AddExpenseForm() {
	const { addExpense } = useExpenses();
	const [date, setDate] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [amount, setAmount] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (date && description && category && amount) {
			addExpense({
				date,
				description,
				category,
				amount: Number.parseFloat(amount),
			});
			setDate("");
			setDescription("");
			setCategory("");
			setAmount("");
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-xl font-semibold flex items-center">
					<PlusCircle className="mr-2 h-5 w-5" />
					Add New Expense
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						required
					/>
					<Input
						placeholder="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<Select value={category} onValueChange={setCategory} required>
						<SelectTrigger>
							<SelectValue placeholder="Select category" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((cat) => (
								<SelectItem key={cat} value={cat}>
									{cat}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Input
						type="number"
						placeholder="Amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						required
						min="0"
						step="0.01"
					/>
					<Button type="submit" className="w-full">
						Add Expense
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

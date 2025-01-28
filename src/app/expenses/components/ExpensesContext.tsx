"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type Expense = {
	id: string;
	date: string;
	description: string;
	category: string;
	amount: number;
};

type ExpensesContextType = {
	expenses: Expense[];
	addExpense: (expense: Omit<Expense, "id">) => void;
	deleteExpense: (id: string) => void;
	updateExpense: (id: string, updatedExpense: Partial<Expense>) => void;
};

const ExpensesContext = createContext<ExpensesContextType | undefined>(
	undefined,
);

export const useExpenses = () => {
	const context = useContext(ExpensesContext);
	if (!context) {
		throw new Error("useExpenses must be used within an ExpensesProvider");
	}
	return context;
};

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [expenses, setExpenses] = useState<Expense[]>([]);

	useEffect(() => {
		// In a real application, you would fetch this data from an API
		const mockExpenses: Expense[] = [
			{
				id: "1",
				date: "2023-05-01",
				description: "Groceries",
				category: "Food",
				amount: 150.75,
			},
			{
				id: "2",
				date: "2023-05-03",
				description: "Electric Bill",
				category: "Utilities",
				amount: 85.2,
			},
			{
				id: "3",
				date: "2023-05-05",
				description: "Netflix Subscription",
				category: "Entertainment",
				amount: 15.99,
			},
			{
				id: "4",
				date: "2023-05-07",
				description: "Gas",
				category: "Transportation",
				amount: 45.5,
			},
			{
				id: "5",
				date: "2023-05-10",
				description: "Gym Membership",
				category: "Health",
				amount: 50.0,
			},
			{
				id: "6",
				date: "2023-05-12",
				description: "Restaurant Dinner",
				category: "Food",
				amount: 75.3,
			},
			{
				id: "7",
				date: "2023-05-15",
				description: "Mobile Phone Bill",
				category: "Utilities",
				amount: 60.0,
			},
			{
				id: "8",
				date: "2023-05-18",
				description: "Movie Tickets",
				category: "Entertainment",
				amount: 25.0,
			},
			{
				id: "9",
				date: "2023-05-20",
				description: "Public Transport Pass",
				category: "Transportation",
				amount: 80.0,
			},
			{
				id: "10",
				date: "2023-05-23",
				description: "Pharmacy",
				category: "Health",
				amount: 35.5,
			},
			{
				id: "11",
				date: "2023-05-25",
				description: "Online Course",
				category: "Education",
				amount: 199.99,
			},
			{
				id: "12",
				date: "2023-05-28",
				description: "Home Insurance",
				category: "Insurance",
				amount: 120.0,
			},
		];
		setExpenses(mockExpenses);
	}, []);

	const addExpense = (expense: Omit<Expense, "id">) => {
		const newExpense = { ...expense, id: Date.now().toString() };
		setExpenses([...expenses, newExpense]);
	};

	const deleteExpense = (id: string) => {
		setExpenses(expenses.filter((expense) => expense.id !== id));
	};

	const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
		setExpenses(
			expenses.map((expense) =>
				expense.id === id ? { ...expense, ...updatedExpense } : expense,
			),
		);
	};

	return (
		<ExpensesContext.Provider
			value={{ expenses, addExpense, deleteExpense, updateExpense }}
		>
			{children}
		</ExpensesContext.Provider>
	);
};

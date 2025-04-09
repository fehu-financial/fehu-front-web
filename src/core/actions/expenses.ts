"use server";

import { cookies } from "next/headers";
import type { Expense } from "../domain/expense";
import { ExpenseMapper } from "../mappers/expense-mapper";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const AUTH_TOKEN =
	process.env.NEXT_PUBLIC_AUTH ||
	"Bearer eyJraWQiOiJRK0Foc3Q4eDBpaUtIUkNJS0lqdUZqdyt1SmtSQ1wvbktGVDhtaTVrMmxZcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NDc4MzQwOC03MGYxLTcwOTUtMjIyMC01N2NhMjEwM2NjYTciLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfQUJ3WUpiVmZaX0dvb2dsZSJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9BQndZSmJWZloiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI0NG11bHJqZWRvYjZka3VmZXJhNDc3bmIwOCIsIm9yaWdpbl9qdGkiOiJkYTNiYjQyYS00NmUzLTRkZDYtYjE1Ny0zN2IwMjhjY2IxOWQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNzM2OTg3NDI1LCJleHAiOjE3MzY5OTEwMjUsImlhdCI6MTczNjk4NzQyNSwianRpIjoiZjAxNTViZWMtNDczMC00ODI4LTljNGItZmM2ZWE1ODY0OWM0IiwidXNlcm5hbWUiOiJHb29nbGVfMTE4MTQwMzU2NzYyMjk3MTA5NzQ1In0.IEWzAp99Y-q7ykCaVCpX15_2HjE3VZbfm-x2txlIxlB2vuxnOkxa5K9iGFR3YtK53lgOXpKP_kJBGRlUDwticzcm20kvglkZB9S4csyuPwLuBjocHt9G5WNTa7xcobiYODnWr5wdvsoT0HtjV46JnWuaobxQjbnsyUJ5dPzQJhzRinSDc6j4vfyekQtI-JEH2Q7Fa3tBHXzF2tjZZwToWtuSULQboiATzyOKfYJCzCAvfuUCasbf-d7aR5t3ENAA7K9OGLTf-rBJOPAPwXnYcSZYnVnI59LyeZ14eqidQ6mvqHMM5cF1hIiXN7kXLI6CC6kyKDw8VgBdMUvw4MIwcg";

export async function getExpenses(filters: any): Promise<Expense[]> {
	try {
		const cookieStore = await cookies();
		const workspaceCookie = cookieStore.get("workspace")?.value;
		if (!workspaceCookie) {
			console.warn("No workspace selected");
			return [];
		}

		// const selectedWorkspace = JSON.parse(atob(workspaceCookie));
		console.log("Selected Workspace", filters.workspaces);

		const response = await fetch(
			`${API_BASE_URL}/expenses?workspaces=${encodeURIComponent(filters.workspaces)}&startDate=${encodeURIComponent(filters.startDate)}&endDate=${encodeURIComponent(filters.endDate)}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: AUTH_TOKEN,
				},
				// next: { revalidate: 60 }, // Revalidate cache every minute
			},
		);

		if (!response.ok) {
			console.error("Failed to fetch expenses:", await response.text());
			throw new Error("Failed to fetch expenses");
		}

		const retur = await response.json();
		console.log("API Response", retur);
		return retur;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function createExpense(input: any): Promise<Expense> {
	try {
		const response = await fetch(`${API_BASE_URL}/expenses`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input),
			cache: "no-store", // Don't cache mutations
		});

		if (!response.ok) {
			console.error("Failed to create expense:", await response.text());
			throw new Error("Failed to create expense");
		}

		const expense = await response.json();

		if (!expense) {
			throw new Error("Failed to create expense");
		}

		return JSON.parse(JSON.stringify(ExpenseMapper.toDomain(expense)));
	} catch (error) {
		console.error(error);
		throw new Error("Failed to create expense");
	}
}

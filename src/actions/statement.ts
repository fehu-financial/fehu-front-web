"use server";

import { fetchWithAuth } from "@/data/http-client";
import type { Statement } from "@/types/statement";

const API_BASE_URL = process.env.FEHU_BFF_API_URL;
const AUTH_TOKEN =
	process.env.NEXT_PUBLIC_AUTH ||
	"Bearer eyJraWQiOiJRK0Foc3Q4eDBpaUtIUkNJS0lqdUZqdyt1SmtSQ1wvbktGVDhtaTVrMmxZcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NDc4MzQwOC03MGYxLTcwOTUtMjIyMC01N2NhMjEwM2NjYTciLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfQUJ3WUpiVmZaX0dvb2dsZSJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9BQndZSmJWZloiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI0NG11bHJqZWRvYjZka3VmZXJhNDc3bmIwOCIsIm9yaWdpbl9qdGkiOiJkYTNiYjQyYS00NmUzLTRkZDYtYjE1Ny0zN2IwMjhjY2IxOWQiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNzM2OTg3NDI1LCJleHAiOjE3MzY5OTEwMjUsImlhdCI6MTczNjk4NzQyNSwianRpIjoiZjAxNTViZWMtNDczMC00ODI4LTljNGItZmM2ZWE1ODY0OWM0IiwidXNlcm5hbWUiOiJHb29nbGVfMTE4MTQwMzU2NzYyMjk3MTA5NzQ1In0.IEWzAp99Y-q7ykCaVCpX15_2HjE3VZbfm-x2txlIxlB2vuxnOkxa5K9iGFR3YtK53lgOXpKP_kJBGRlUDwticzcm20kvglkZB9S4csyuPwLuBjocHt9G5WNTa7xcobiYODnWr5wdvsoT0HtjV46JnWuaobxQjbnsyUJ5dPzQJhzRinSDc6j4vfyekQtI-JEH2Q7Fa3tBHXzF2tjZZwToWtuSULQboiATzyOKfYJCzCAvfuUCasbf-d7aR5t3ENAA7K9OGLTf-rBJOPAPwXnYcSZYnVnI59LyeZ14eqidQ6mvqHMM5cF1hIiXN7kXLI6CC6kyKDw8VgBdMUvw4MIwcg";

interface StatementFilters {
	workspaces: string[];
	startDate: string;
	endDate: string;
}

export async function getStatement(
	filters: StatementFilters,
): Promise<Statement | null> {
	if (!filters.workspaces) {
		console.warn("No workspace selected");
		return null;
	}

	try {
		const url = new URL(`${API_BASE_URL}/statements`);
		url.searchParams.append("workspaces", filters.workspaces.join(","));
		url.searchParams.append("startDate", filters.startDate);
		url.searchParams.append("endDate", filters.endDate);

		return await fetchWithAuth(url.toString(), {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error fetching statement:", error);
		return null;
	}
}

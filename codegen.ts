import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: {
		"http://localhost:4000/graphql": {
			headers: {
				Authorization:
					"Bearer eyJraWQiOiJRK0Foc3Q4eDBpaUtIUkNJS0lqdUZqdyt1SmtSQ1wvbktGVDhtaTVrMmxZcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0NDc4MzQwOC03MGYxLTcwOTUtMjIyMC01N2NhMjEwM2NjYTciLCJjb2duaXRvOmdyb3VwcyI6WyJ1cy1lYXN0LTFfQUJ3WUpiVmZaX0dvb2dsZSJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9BQndZSmJWZloiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI0NG11bHJqZWRvYjZka3VmZXJhNDc3bmIwOCIsIm9yaWdpbl9qdGkiOiJiMWRlZGI0Yi1lNzhjLTQ3ZDgtYWIxMy0zYTY5NTk3NjliMzMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXV0aF90aW1lIjoxNzM3NjUzNjkxLCJleHAiOjE3Mzc2NTcyOTEsImlhdCI6MTczNzY1MzY5MSwianRpIjoiNzk3MmVkOGYtN2M0Ni00MGJlLTg0MjItYWRhMjMyYmM1ZjRkIiwidXNlcm5hbWUiOiJHb29nbGVfMTE4MTQwMzU2NzYyMjk3MTA5NzQ1In0.BeQuZYPLp1uzE0F_Nk18MepbyftzxEHGDRFYXU3_B4uVHAcTWTzwmRMmym4O0ZSQBxBukv4MnjFnW6Ul2utuosqJ-TB3oScmvhzUtP60nL9W2b8seK6jawZRxwMLUH1DboH0iS4HBiYj53mc7mbyGD3yjSAMTiHB9owOizR2Ce7O4rM-dl87iTHhEB6GqMRKwhrWWAQsx9qP9Ib8axy4laDFadnI6zypPsaCkA13o7P97H0f9QeJNIDsyG5Zf8qEKwpDv5VnZWPNgGF7Z4Av_0YHDaq0rg_mNbbk8wiEoP7aPNa9mgCfXk_EzWNRrY5xTtueQbxNJF_PgW21KrWP6g", // Replace with your actual token
			},
		},
	},
	documents: "src/**/*.graphql",
	generates: {
		"src/core/data/graphql/client/types.ts": {
			plugins: ["typescript", "typescript-operations", "typescript-urql"],
			config: {
				withHooks: false,
			},
		},
	},
};

export default config;

import { getUserInfo } from "@/actions/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const origin = url.origin;
	const code = url.searchParams.get("code");

	if (!code) {
		return NextResponse.redirect(`${origin}/signin?error=missing_code`);
	}

	if (
		!process.env.COGNITO_REDIRECT_URI ||
		!process.env.COGNITO_CLIENT_ID ||
		!process.env.COGNITO_CLIENT_SECRET ||
		!process.env.COGNITO_DOMAIN
	) {
		console.error("Erro: variáveis de ambiente importantes não definidas.");
		return NextResponse.redirect(`${origin}/sigin?error=missing_config`);
	}

	const params = new URLSearchParams();
	params.append("grant_type", "authorization_code");
	params.append("code", code);
	params.append("redirect_uri", process.env.COGNITO_REDIRECT_URI);
	params.append("client_id", process.env.COGNITO_CLIENT_ID);

	try {
		const cognitoResponse = await fetch(
			`${process.env.COGNITO_DOMAIN}/oauth2/token`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${Buffer.from(
						`${process.env.COGNITO_CLIENT_ID}:${process.env.COGNITO_CLIENT_SECRET}`,
					).toString("base64")}`,
				},
				body: params.toString(),
			},
		);

		if (!cognitoResponse.ok) {
			console.error(
				"Erro ao buscar token do Cognito:",
				cognitoResponse.status,
				cognitoResponse.statusText,
			);
			return NextResponse.redirect(`${origin}/signin?error=invalid_token`);
		}

		const { access_token, expires_in } = await cognitoResponse.json();

		const user = await getUserInfo(access_token);

		const response = NextResponse.redirect(origin);

		const cookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: "lax",
			path: "/",
			maxAge: expires_in ?? 3600,
		} as const;

		response.cookies.set("access_token", access_token, cookieOptions);
		response.cookies.set("user", JSON.stringify(user));

		return response;
	} catch (error) {
		console.error("Erro inesperado ao buscar token do Cognito:", error);
		return NextResponse.redirect(`${origin}/signin?error=unexpected_error`);
	}
}

import { NextResponse } from "next/server";

if (
	!process.env.COGNITO_DOMAIN ||
	!process.env.COGNITO_CLIENT_ID ||
	!process.env.COGNITO_REDIRECT_URI
) {
	throw new Error(
		"Missing required environment variables for Cognito authentication",
	);
}

const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const REDIRECT_URI = process.env.COGNITO_REDIRECT_URI;

export async function GET() {
	const loginUrl = `${COGNITO_DOMAIN}/login?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
		REDIRECT_URI,
	)}&scope=email+openid+profile`;

	return NextResponse.redirect(loginUrl);
}

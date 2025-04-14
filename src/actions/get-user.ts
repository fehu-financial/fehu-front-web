"use server";

import { cookies } from "next/headers";

export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
}

export async function getUserInfo(accessToken?: string): Promise<User> {
	const userAccessToken =
		accessToken ?? (await cookies()).get("access_token")?.value;

	if (!userAccessToken) {
		throw new Error("Access token not found");
	}

	const response = await fetch(
		`${process.env.COGNITO_DOMAIN}/oauth2/userInfo`,
		{
			headers: {
				Authorization: `Bearer ${userAccessToken}`,
			},
		},
	);
	if (!response.ok) {
		throw new Error("Failed to fetch user info");
	}
	const userInfo = await response.json();
	return {
		id: userInfo.sub,
		name: userInfo.name,
		email: userInfo.email,
		avatar: userInfo.picture,
	};
}

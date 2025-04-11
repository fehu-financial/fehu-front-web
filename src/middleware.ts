import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const nextUrl = request.nextUrl.clone();

	if (nextUrl.pathname === "/") {
		nextUrl.pathname = "/home";
		return NextResponse.redirect(nextUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};

import { type NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/signin"];

export function middleware(request: NextRequest) {
	const nextUrl = request.nextUrl.clone();

	if (publicRoutes.includes(nextUrl.pathname)) {
		return NextResponse.next();
	}

	const isAuthenticated =
		(request.cookies.get("access_token")?.value ?? "").length > 0;

	if (!isAuthenticated) {
		nextUrl.pathname = "/signin";
		return NextResponse.redirect(nextUrl);
	}

	if (nextUrl.pathname === "/") {
		nextUrl.pathname = "/home";
		return NextResponse.redirect(nextUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|fehu-logo.svg|sitemap.xml|robots.txt|manifest.webmanifest|sw.js|apple-touch-icon.png|icon-192x192.png|icon-512x512.png|icon-192x192-maskable.png|icon-512x512-maskable.png|images/).*)",
	],
};

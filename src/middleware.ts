import { type NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/signin"];

export function middleware(request: NextRequest) {
	const nextUrl = request.nextUrl.clone();

	// Skip service worker and PWA files completely
	if (
		nextUrl.pathname === "/sw.js" ||
		nextUrl.pathname === "/manifest.webmanifest" ||
		nextUrl.pathname.startsWith("/api/") ||
		nextUrl.pathname.startsWith("/_next/") ||
		nextUrl.pathname.startsWith("/images/")
	) {
		return NextResponse.next();
	}

	if (publicRoutes.includes(nextUrl.pathname)) {
		return NextResponse.next();
	}

	const isAuthenticated =
		(request.cookies.get("access_token")?.value ?? "").length > 0;

	if (!isAuthenticated) {
		nextUrl.pathname = "/signin";
		const response = NextResponse.redirect(nextUrl);
		// Add header to help service worker identify auth redirects
		response.headers.set("x-middleware-redirect", "auth");
		return response;
	}

	if (nextUrl.pathname === "/") {
		nextUrl.pathname = "/home";
		const response = NextResponse.redirect(nextUrl);
		// Add header to help service worker identify home redirects
		response.headers.set("x-middleware-redirect", "home");
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|fehu-logo.svg|sitemap.xml|robots.txt|manifest.webmanifest|sw.js|apple-touch-icon.png|icon-192x192.png|icon-512x512.png|icon-192x192-maskable.png|icon-512x512-maskable.png|images/).*)",
	],
};

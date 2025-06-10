// Service Worker for Fehu Financial PWA
const CACHE_NAME = "fehu-financial-v1";
const CACHE_STATIC_NAME = "fehu-static-v1";
const CACHE_DYNAMIC_NAME = "fehu-dynamic-v1";

// Essential files to cache immediately
const STATIC_FILES = [
	"/",
	"/manifest.webmanifest",
	"/icon-192x192.png",
	"/icon-512x512.png",
	"/apple-touch-icon.png",
	"/favicon.ico",
];

// Handle push notifications
self.addEventListener("push", (event) => {
	console.log("Push event received:", event);

	if (!event.data) {
		console.log("No data in push event");
		return;
	}

	try {
		const data = event.data.json();
		console.log("Push data:", data);

		const options = {
			body: data.body || "Nova notificação do Fehu Financial",
			icon: data.icon || "/icon-192x192.png",
			badge: data.badge || "/icon-192x192.png",
			vibrate: data.vibrate ? [100, 50, 100] : undefined,
			data: {
				dateOfArrival: Date.now(),
				url: data.url || "/",
				...data.data,
			},
			actions: [
				{
					action: "open",
					title: "Abrir App",
					icon: "/icon-192x192.png",
				},
				{
					action: "close",
					title: "Fechar",
					icon: "/icon-192x192.png",
				},
			],
			tag: data.tag || "fehu-notification",
			requireInteraction: data.requireInteraction || false,
		};

		event.waitUntil(
			self.registration.showNotification(
				data.title || "Fehu Financial",
				options,
			),
		);
	} catch (error) {
		console.error("Error showing notification:", error);

		// Fallback notification
		event.waitUntil(
			self.registration.showNotification("Fehu Financial", {
				body: "Nova notificação",
				icon: "/icon-192x192.png",
				tag: "fehu-fallback",
			}),
		);
	}
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
	console.log("Notification clicked:", event.notification);

	event.notification.close();

	if (event.action === "close") {
		return;
	}

	const urlToOpen = event.notification.data?.url || "/";

	event.waitUntil(
		clients
			.matchAll({
				type: "window",
				includeUncontrolled: true,
			})
			.then((clientList) => {
				const hadWindowToFocus = clientList.some((windowClient) => {
					const fullUrl = new URL(urlToOpen, self.location.origin).href;
					if (windowClient.url === fullUrl && "focus" in windowClient) {
						windowClient.focus();
						return true;
					}
					return false;
				});

				if (!hadWindowToFocus && clients.openWindow) {
					return clients.openWindow(urlToOpen);
				}
			})
			.catch((error) => {
				console.error("Error handling notification click:", error);
			}),
	);
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
	console.log("Notification closed:", event.notification.tag);
});

// Install event - cache essential resources
self.addEventListener("install", (event) => {
	console.log("Service Worker installing...");

	event.waitUntil(
		Promise.all([
			caches.open(CACHE_STATIC_NAME).then((cache) =>
				cache
					.addAll(STATIC_FILES)
					.then(() => {
						console.log("Static files cached successfully");
					})
					.catch((error) => {
						console.error("Failed to cache static files:", error);
					}),
			),
			// Clear any cached redirects from previous versions
			caches.keys().then((cacheNames) =>
				Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName.includes("redirect") || cacheName.includes("temp")) {
							console.log("Clearing redirect cache:", cacheName);
							return caches.delete(cacheName);
						}
					})
				)
			),
			self.skipWaiting(),
		]),
	);
});

// Activate event - clean up old caches and claim clients
self.addEventListener("activate", (event) => {
	console.log("Service Worker activating...");

	event.waitUntil(
		Promise.all([
			caches
				.keys()
				.then((cacheNames) =>
					Promise.all(
						cacheNames.map((cacheName) => {
							if (
								cacheName !== CACHE_STATIC_NAME &&
								cacheName !== CACHE_DYNAMIC_NAME &&
								cacheName !== CACHE_NAME
							) {
								console.log("Deleting old cache:", cacheName);
								return caches.delete(cacheName);
							}
						}),
					),
				)
				.then(() => {
					console.log("Old caches cleaned up");
				}),
			self.clients.claim(),
		]),
	);
});

// Fetch event - implement smart caching strategy with proper redirect handling
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Only handle GET requests from same origin
	if (request.method !== "GET" || url.origin !== self.location.origin) {
		return;
	}

	// Skip API calls, auth, dynamic content, service worker, and routes that may redirect
	if (
		url.pathname.startsWith("/api/") ||
		url.pathname.startsWith("/auth/") ||
		url.pathname.startsWith("/_next/") ||
		url.pathname === "/sw.js" ||
		url.pathname === "/" || // Skip root path that gets redirected
		url.pathname === "/signin" || // Skip auth routes
		url.searchParams.has("no-cache")
	) {
		return;
	}

	event.respondWith(
		(async () => {
			// Check cache first
			const cachedResponse = await caches.match(request);

			// For navigation requests, be more conservative about caching
			if (request.mode === "navigate") {
				try {
					const networkResponse = await fetch(request, {
						redirect: "follow", // Explicitly handle redirects
					});

					// Never cache redirect responses or authentication-related responses
					if (
						networkResponse.status >= 300 && networkResponse.status < 400 ||
						networkResponse.url.includes('/signin') ||
						networkResponse.url.includes('/auth')
					) {
						console.log(
							"Redirect or auth response, bypassing cache:",
							networkResponse.status,
							networkResponse.url,
						);
						return networkResponse;
					}

					// Only cache successful, final navigation responses
					if (networkResponse.ok && networkResponse.type === "basic" && !networkResponse.redirected) {
						try {
							const responseClone = networkResponse.clone();
							const cache = await caches.open(CACHE_DYNAMIC_NAME);
							await cache.put(request, responseClone);
						} catch (cacheError) {
							console.warn("Failed to cache navigation response:", cacheError);
						}
					}
					return networkResponse;
				} catch (error) {
					console.error("Navigation fetch failed:", error);
					// For navigation failures, don't serve cached redirects
					if (cachedResponse && !cachedResponse.redirected) {
						return cachedResponse;
					}
					return createOfflineResponse();
				}
			}

			// For non-navigation requests, use cache-first strategy
			if (cachedResponse) {
				// Update cache in background
				updateCache(request).catch((error) =>
					console.warn("Background cache update failed:", error),
				);
				return cachedResponse;
			}

			// Fetch from network and cache
			try {
				const networkResponse = await fetch(request, {
					redirect: "follow",
				});

				// Don't cache redirect responses
				if (networkResponse.status >= 300 && networkResponse.status < 400) {
					return networkResponse;
				}

				// Only cache successful responses
				if (networkResponse.ok && networkResponse.type === "basic") {
					// Cache static assets
					if (
						request.destination === "script" ||
						request.destination === "style" ||
						request.destination === "image" ||
						request.destination === "font"
					) {
						try {
							const responseClone = networkResponse.clone();
							const cache = await caches.open(CACHE_DYNAMIC_NAME);
							await cache.put(request, responseClone);
						} catch (cacheError) {
							console.warn("Failed to cache asset:", cacheError);
						}
					}
				}
				return networkResponse;
			} catch (error) {
				console.error("Fetch failed:", error);
				return createOfflineResponse();
			}
		})(),
	);
});

// Helper function to update cache in background
async function updateCache(request) {
	try {
		const response = await fetch(request, {
			redirect: "follow",
		});

		// Don't cache redirect responses or auth-related responses
		if (
			response.status >= 300 && response.status < 400 ||
			response.redirected ||
			response.url.includes('/signin') ||
			response.url.includes('/auth') ||
			response.headers.get('x-middleware-redirect')
		) {
			console.log(
				"Redirect or auth response, not updating cache:",
				response.status,
				response.url,
			);
			return;
		}

		// Only cache successful basic responses
		if (response.ok && response.type === "basic") {
			const cache = await caches.open(CACHE_DYNAMIC_NAME);
			await cache.put(request, response.clone());
			console.log("Cache updated for:", request.url);
		}
	} catch (error) {
		console.warn("Failed to update cache:", error);
	}
}

// Helper function to create offline response
function createOfflineResponse() {
	return new Response(
		`
		<!DOCTYPE html>
		<html lang="pt-BR">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Offline - Fehu Financial</title>
			<style>
				body {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					color: white;
					margin: 0;
					padding: 0;
					min-height: 100vh;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.container {
					text-align: center;
					padding: 2rem;
					background: rgba(255, 255, 255, 0.1);
					border-radius: 1rem;
					backdrop-filter: blur(10px);
					border: 1px solid rgba(255, 255, 255, 0.2);
					max-width: 400px;
				}
				.icon {
					font-size: 4rem;
					margin-bottom: 1rem;
				}
				h1 {
					margin: 0 0 1rem 0;
					font-size: 1.5rem;
				}
				p {
					margin: 0 0 2rem 0;
					opacity: 0.9;
				}
				.button {
					background: rgba(255, 255, 255, 0.2);
					color: white;
					border: 1px solid rgba(255, 255, 255, 0.3);
					padding: 0.75rem 1.5rem;
					border-radius: 0.5rem;
					font-size: 1rem;
					cursor: pointer;
					transition: all 0.2s ease;
				}
				.button:hover {
					background: rgba(255, 255, 255, 0.3);
					transform: translateY(-2px);
				}
			</style>
		</head>
		<body>
			<div class="container">
				<div class="icon">📱</div>
				<h1>Você está offline</h1>
				<p>Não foi possível carregar esta página. Verifique sua conexão com a internet.</p>
				<button class="button" onclick="window.location.reload()">Tentar novamente</button>
			</div>
		</body>
		</html>
		`,
		{
			status: 200,
			statusText: "OK",
			headers: new Headers({
				"Content-Type": "text/html; charset=utf-8",
			}),
		},
	);
}

// Handle background sync (if supported)
if ("sync" in self.registration) {
	self.addEventListener("sync", (event) => {
		console.log("Background sync event:", event.tag);

		if (event.tag === "background-sync") {
			event.waitUntil(doBackgroundSync());
		}
	});
}

// Helper function for background sync
async function doBackgroundSync() {
	try {
		console.log("Performing background sync...");
		// This could sync offline transactions, update cache, etc.
	} catch (error) {
		console.error("Background sync failed:", error);
	}
}

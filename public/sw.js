// Service Worker for Fehu Financial PWA
const CACHE_NAME = "fehu-financial-v1";
const CACHE_STATIC_NAME = "fehu-static-v1";
const CACHE_DYNAMIC_NAME = "fehu-dynamic-v1";

// Essential files to cache immediately
const STATIC_FILES = [
	"/",
	"/manifest.json",
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
			renotify: true,
			requireInteraction: data.requireInteraction || false,
			silent: data.silent || false,
			timestamp: Date.now(),
		};

		event.waitUntil(
			self.registration.showNotification(
				data.title || "Fehu Financial",
				options,
			),
		);
	} catch (error) {
		console.error("Error parsing push data:", error);
		// Show fallback notification
		event.waitUntil(
			self.registration.showNotification("Fehu Financial", {
				body: "Nova notificação disponível",
				icon: "/icon-192x192.png",
				badge: "/icon-192x192.png",
			}),
		);
	}
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
	console.log("Notification click received:", event);

	event.notification.close();

	// Handle action clicks
	if (event.action === "close") {
		return;
	}

	// Get URL to open (default action or 'open' action)
	const urlToOpen = event.notification.data?.url || "/";
	const fullUrl = new URL(urlToOpen, self.location.origin).href;

	event.waitUntil(
		clients
			.matchAll({
				type: "window",
				includeUncontrolled: true,
			})
			.then((clientList) => {
				// Check if there is already a window/tab open with the target URL
				for (const client of clientList) {
					if (client.url === fullUrl && "focus" in client) {
						return client.focus();
					}
				}

				// If not, open the target URL in a new window/tab
				if (clients.openWindow) {
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
	// Track notification closure analytics here if needed
});

// Install event - cache essential resources
self.addEventListener("install", (event) => {
	console.log("Service Worker installing...");

	event.waitUntil(
		Promise.all([
			// Cache static files
			caches
				.open(CACHE_STATIC_NAME)
				.then((cache) =>
					cache
						.addAll(STATIC_FILES)
						.then(() => {
							console.log("Static files cached successfully");
						})
						.catch((error) => {
							console.error("Failed to cache static files:", error);
						}),
				),
			// Skip waiting to activate immediately
			self.skipWaiting(),
		]),
	);
});

// Activate event - clean up old caches and claim clients
self.addEventListener("activate", (event) => {
	console.log("Service Worker activating...");

	event.waitUntil(
		Promise.all([
			// Clean up old caches
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
			// Take control of all pages immediately
			self.clients.claim(),
		]),
	);
});

// Fetch event - implement smart caching strategy
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Only handle GET requests from same origin
	if (request.method !== "GET" || url.origin !== self.location.origin) {
		return;
	}

	// Skip API calls, auth, and dynamic content
	if (
		url.pathname.startsWith("/api/") ||
		url.pathname.startsWith("/auth/") ||
		url.searchParams.has("no-cache")
	) {
		return;
	}

	event.respondWith(
		caches.match(request).then((cachedResponse) => {
			// Return cached version if available
			if (cachedResponse) {
				// For navigation requests, try to update cache in background
				if (request.mode === "navigate") {
					event.waitUntil(updateCache(request));
				}
				return cachedResponse;
			}

			// Fetch from network and cache dynamically
			return fetch(request)
				.then((networkResponse) => {
					// Only cache successful responses
					if (networkResponse.status === 200) {
						const responseClone = networkResponse.clone();

						// Cache static assets and pages
						if (
							request.destination === "document" ||
							request.destination === "script" ||
							request.destination === "style" ||
							request.destination === "image"
						) {
							caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
								cache.put(request, responseClone);
							});
						}
					}
					return networkResponse;
				})
				.catch((error) => {
					console.error("Fetch failed:", error);

					// For navigation requests, return offline page or cached homepage
					if (request.destination === "document") {
						return caches.match("/") || createOfflineResponse();
					}

					// For other resources, return a basic response
					return createOfflineResponse();
				});
		}),
	);
});

// Helper function to update cache in background
async function updateCache(request) {
	try {
		const response = await fetch(request);
		if (response.status === 200) {
			const cache = await caches.open(CACHE_DYNAMIC_NAME);
			await cache.put(request, response.clone());
		}
	} catch (error) {
		console.error("Background cache update failed:", error);
	}
}

// Helper function to create offline response
function createOfflineResponse() {
	return new Response(
		`
		<!DOCTYPE html>
		<html>
		<head>
			<title>Fehu Financial - Offline</title>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<style>
				body { 
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					text-align: center; 
					padding: 2rem; 
					background: #f8fafc;
					color: #334155;
				}
				.container { 
					max-width: 400px; 
					margin: 0 auto; 
				}
				.icon { 
					font-size: 4rem; 
					margin-bottom: 1rem; 
				}
				h1 { 
					color: #1e293b;
					margin-bottom: 0.5rem;
				}
				p { 
					margin-bottom: 1rem;
					color: #64748b;
				}
				.button {
					background: #3b82f6;
					color: white;
					padding: 0.75rem 1.5rem;
					border: none;
					border-radius: 0.5rem;
					text-decoration: none;
					display: inline-block;
					cursor: pointer;
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
		// Implement background sync logic here
		console.log("Performing background sync...");
		// This could sync offline transactions, update cache, etc.
	} catch (error) {
		console.error("Background sync failed:", error);
	}
}

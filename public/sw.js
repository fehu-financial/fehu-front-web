// Service Worker for Fehu Financial PWA
self.addEventListener("push", (event) => {
	console.log("Push event received:", event);

	if (event.data) {
		const data = event.data.json();
		const options = {
			body: data.body,
			icon: data.icon || "/icon-192x192.png",
			badge: "/icon-192x192.png",
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: "2",
				url: data.url || "/",
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
			tag: "fehu-notification",
			renotify: true,
			requireInteraction: false,
			silent: false,
		};

		event.waitUntil(
			self.registration.showNotification(
				data.title || "Fehu Financial",
				options,
			),
		);
	}
});

self.addEventListener("notificationclick", (event) => {
	console.log("Notification click received.");

	event.notification.close();

	if (event.action === "close") {
		// Just close the notification
		return;
	}

	// Default action or 'open' action
	const urlToOpen = event.notification.data?.url || "/";

	event.waitUntil(
		clients
			.matchAll({
				type: "window",
				includeUncontrolled: true,
			})
			.then((clientList) => {
				// Check if there is already a window/tab open with the target URL
				for (let i = 0; i < clientList.length; i++) {
					const client = clientList[i];
					if (
						client.url === new URL(urlToOpen, self.location.origin).href &&
						"focus" in client
					) {
						return client.focus();
					}
				}

				// If not, then open the target URL in a new window/tab
				if (clients.openWindow) {
					return clients.openWindow(urlToOpen);
				}
			}),
	);
});

self.addEventListener("notificationclose", (event) => {
	console.log("Notification closed:", event.notification.tag);
});

// Install event - cache essential resources
self.addEventListener("install", (event) => {
	console.log("Service Worker installing...");

	event.waitUntil(
		caches.open("fehu-v1").then((cache) =>
			cache
				.addAll([
					"/",
					"/manifest.json",
					"/icon-192x192.png",
					"/icon-512x512.png",
				])
				.catch((error) => {
					console.log("Cache addAll failed:", error);
				}),
		),
	);

	// Force the waiting service worker to become the active service worker
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	console.log("Service Worker activating...");

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== "fehu-v1") {
							console.log("Deleting old cache:", cacheName);
							return caches.delete(cacheName);
						}
					}),
				),
			)
			.then(() => {
				// Ensure the service worker takes control of all pages immediately
				return self.clients.claim();
			}),
	);
});

// Fetch event - serve cached content when offline (optional, basic implementation)
self.addEventListener("fetch", (event) => {
	// Only handle GET requests
	if (event.request.method !== "GET") {
		return;
	}

	// Skip cross-origin requests
	if (!event.request.url.startsWith(self.location.origin)) {
		return;
	}

	event.respondWith(
		fetch(event.request).catch(() => {
			// If fetch fails, try to serve from cache
			return caches.match(event.request).then((response) => {
				if (response) {
					return response;
				}
				// If no cache match, return a basic offline page or the main page
				if (event.request.destination === "document") {
					return caches.match("/");
				}
			});
		}),
	);
});

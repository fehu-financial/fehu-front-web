import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Fehu Financial",
		short_name: "Fehu",
		description:
			"Gerencie investimentos, despesas e tudo mais com Fehu Financial",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		orientation: "portrait",
		scope: "/",
		lang: "pt-BR",
		categories: ["finance", "productivity", "business"],
		// PWA features
		display_override: ["window-controls-overlay", "standalone", "browser"],
		// Shortcuts for quick actions
		shortcuts: [
			{
				name: "Nova Transação",
				short_name: "Transação",
				description: "Adicionar uma nova transação",
				url: "/transactions/new",
				icons: [
					{
						src: "/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
				],
			},
			{
				name: "Carteiras",
				short_name: "Carteiras",
				description: "Visualizar suas carteiras",
				url: "/wallet",
				icons: [
					{
						src: "/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
				],
			},
			{
				name: "Investimentos",
				short_name: "Investimentos",
				description: "Acompanhar seus investimentos",
				url: "/investments",
				icons: [
					{
						src: "/icon-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
				],
			},
		],
		// Enhanced icons with purpose and platform support
		icons: [
			{
				src: "/favicon.ico",
				sizes: "16x16 32x32",
				type: "image/x-icon",
				purpose: "any",
			},
			{
				src: "/favicon-16x16.png",
				sizes: "16x16",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/favicon-32x32.png",
				sizes: "32x32",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icon-192x192-maskable.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-512x512-maskable.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
				purpose: "any",
			},
		],
		// Protocol handlers for custom schemes
		protocol_handlers: [
			{
				protocol: "web+fehu",
				url: "/handle/%s",
			},
		],
		// File handlers (if needed for importing financial data)
		file_handlers: [
			{
				action: "/import",
				accept: {
					"text/csv": [".csv"],
					"application/json": [".json"],
				},
			},
		],
		// Share target for receiving shared content
		share_target: {
			action: "/share",
			method: "POST",
			enctype: "multipart/form-data",
			params: {
				title: "title",
				text: "text",
				url: "url",
				files: [
					{
						name: "files",
						accept: ["image/*", "text/csv", "application/json"],
					},
				],
			},
		},
	} as const;
}

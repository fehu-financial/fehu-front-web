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
		icons: [
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
				src: "/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
				purpose: "any",
			},
		],
	};
}

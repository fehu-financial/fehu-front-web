/**
 * Validates if a string is a valid HEX color code
 */
export function isValidHexColor(hex: string): boolean {
	const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
	return hexRegex.test(hex);
}

/**
 * Converts HSL values to HEX color code
 */
export function hslToHex(h: number, s: number, l: number): string {
	l /= 100;
	const a = (s * Math.min(l, 1 - l)) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color)
			.toString(16)
			.padStart(2, "0");
	};
	return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Converts HEX color code to HSL values
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
	const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
	const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
	const b = Number.parseInt(hex.slice(5, 7), 16) / 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return {
		h: Math.round(h * 360),
		s: Math.round(s * 100),
		l: Math.round(l * 100),
	};
}

/**
 * Generates a predefined color palette
 */
export function generateColorPalette(): string[] {
	const colors: string[] = [];

	// Add grayscale colors
	for (let i = 0; i <= 10; i++) {
		const gray = Math.round((i / 10) * 255);
		const hex = gray.toString(16).padStart(2, "0");
		colors.push(`#${hex}${hex}${hex}`);
	}

	// Add vibrant colors
	const hues = [0, 30, 60, 120, 180, 240, 300, 330];
	const saturations = [50, 75, 100];
	const lightnesses = [25, 50, 75];

	hues.forEach((h) => {
		saturations.forEach((s) => {
			lightnesses.forEach((l) => {
				colors.push(hslToHex(h, s, l));
			});
		});
	});

	return colors;
}

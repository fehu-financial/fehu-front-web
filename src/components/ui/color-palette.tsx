"use client";

import { generateColorPalette } from "@/lib/color-utils";

interface ColorPaletteProps {
	onColorSelect: (color: string) => void;
	selectedColor: string;
}

export function ColorPalette({
	onColorSelect,
	selectedColor,
}: ColorPaletteProps) {
	const colors = generateColorPalette();

	return (
		<div className="grid grid-cols-11 gap-1 p-2">
			{colors.map((color, index) => (
				<button
					key={`${color}-${index}`}
					type="button"
					className={`
            w-6 h-6 rounded border-2 transition-all duration-200 hover:scale-110 focus:scale-110 focus:outline-none
            ${selectedColor === color ? "border-gray-900 shadow-lg" : "border-gray-300"}
          `}
					style={{ backgroundColor: color }}
					onClick={() => onColorSelect(color)}
					title={color}
					aria-label={`Select color ${color}`}
				/>
			))}
		</div>
	);
}

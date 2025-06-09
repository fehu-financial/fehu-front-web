"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

interface ColorPickerProps {
	initialColor?: string;
	onColorChange?: (color: string) => void;
	className?: string;
}

export default function ColorPicker({
	initialColor = "#3b82f6",
	onColorChange,
	className = "",
}: ColorPickerProps) {
	const [selectedColor, setSelectedColor] = useState(initialColor);
	const [hexInput, setHexInput] = useState(initialColor);
	const [isValidHex, setIsValidHex] = useState(true);
	const [copied, setCopied] = useState(false);

	// Predefined color palette
	const colorPalette = [
		"#ef4444",
		"#f97316",
		"#f59e0b",
		"#eab308",
		"#84cc16",
		"#22c55e",
		"#10b981",
		"#14b8a6",
		"#06b6d4",
		"#0ea5e9",
		"#3b82f6",
		"#6366f1",
		"#8b5cf6",
		"#a855f7",
		"#d946ef",
		"#ec4899",
		"#f43f5e",
		"#64748b",
		"#6b7280",
		"#374151",
		"#111827",
		"#ffffff",
		"#f8fafc",
		"#e2e8f0",
		"#cbd5e1",
	];

	// Generate color shades for each base color
	const generateShades = (baseColor: string) => {
		const shades = [];
		const hex = baseColor.replace("#", "");
		const r = Number.parseInt(hex.substr(0, 2), 16);
		const g = Number.parseInt(hex.substr(2, 2), 16);
		const b = Number.parseInt(hex.substr(4, 2), 16);

		for (let i = 0; i < 5; i++) {
			const factor = 0.2 + i * 0.2;
			const newR = Math.round(r * factor + 255 * (1 - factor));
			const newG = Math.round(g * factor + 255 * (1 - factor));
			const newB = Math.round(b * factor + 255 * (1 - factor));

			shades.push(
				`#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`,
			);
		}
		return shades;
	};

	const validateHex = (hex: string): boolean => {
		const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		return hexRegex.test(hex);
	};

	const handleColorSelect = useCallback(
		(color: string) => {
			setSelectedColor(color);
			setHexInput(color);
			setIsValidHex(true);
			onColorChange?.(color);
		},
		[onColorChange],
	);

	const handleHexInputChange = (value: string) => {
		setHexInput(value);
		const isValid = validateHex(value);
		setIsValidHex(isValid);

		if (isValid) {
			setSelectedColor(value);
			onColorChange?.(value);
		}
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(selectedColor);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy color code:", err);
		}
	};

	return (
		<Card className={`w-full max-w-md mx-auto ${className}`}>
			<CardHeader>
				<CardTitle className="text-center">Color Picker</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Selected Color Display */}
				{/* <div className="text-center space-y-3">
          <div
            className="w-24 h-24 mx-auto rounded-lg border-2 border-gray-200 shadow-inner"
            style={{ backgroundColor: selectedColor }}
            aria-label={`Selected color: ${selectedColor}`}
          />
          <div className="flex items-center justify-center gap-2">
            <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">{selectedColor.toUpperCase()}</code>
            <Button size="sm" variant="outline" onClick={copyToClipboard} className="h-8 w-8 p-0">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div> */}

				{/* Manual HEX Input */}
				{/* <div className="space-y-2">
          <Label htmlFor="hex-input">HEX Code</Label>
          <Input
            id="hex-input"
            type="text"
            value={hexInput}
            onChange={(e) => handleHexInputChange(e.target.value)}
            placeholder="#3b82f6"
            className={`font-mono ${!isValidHex ? "border-red-500" : ""}`}
          />
          {!isValidHex && <p className="text-sm text-red-500">Please enter a valid HEX code (e.g., #3b82f6)</p>}
        </div> */}

				{/* Color Palette */}
				<div className="space-y-3">
					<Label>Color Palette</Label>
					<div className="grid grid-cols-5 gap-2">
						{colorPalette.map((color, index) => (
							<button
								key={index}
								className={`w-10 h-10 rounded-md border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
									selectedColor === color
										? "border-gray-800 ring-2 ring-blue-500"
										: "border-gray-200"
								}`}
								style={{ backgroundColor: color }}
								onClick={() => handleColorSelect(color)}
								aria-label={`Select color ${color}`}
							/>
						))}
					</div>
				</div>

				{/* Color Shades */}
				<div className="space-y-3">
					<Label>Color Shades</Label>
					<div className="grid grid-cols-5 gap-2">
						{generateShades(selectedColor).map((shade, index) => (
							<button
								key={index}
								className="w-10 h-10 rounded-md border-2 border-gray-200 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
								style={{ backgroundColor: shade }}
								onClick={() => handleColorSelect(shade)}
								aria-label={`Select shade ${shade}`}
							/>
						))}
					</div>
				</div>

				{/* HTML Color Input (Native Color Picker) */}
				<div className="space-y-2">
					<Label htmlFor="color-input">Color Wheel</Label>
					<div className="flex items-center gap-3">
						<input
							id="color-input"
							type="color"
							value={selectedColor}
							onChange={(e) => handleColorSelect(e.target.value)}
							className="w-12 h-12 rounded-md border-2 border-gray-200 cursor-pointer"
						/>
						<span className="text-sm text-gray-600">
							Click to open color wheel
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

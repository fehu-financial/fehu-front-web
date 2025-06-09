"use client";

import { isValidHexColor } from "@/lib/color-utils";
import { useCallback, useEffect, useState } from "react";

interface ColorState {
	hex: string;
	isValid: boolean;
}

export function useColorPicker(
	initialColor = "#3B82F6",
	onColorChange?: (color: string) => void,
) {
	const [colorState, setColorState] = useState<ColorState>({
		hex: isValidHexColor(initialColor) ? initialColor.toUpperCase() : "#3B82F6",
		isValid: true,
	});

	const [inputValue, setInputValue] = useState(colorState.hex);

	useEffect(() => {
		setInputValue(colorState.hex);
	}, [colorState.hex]);

	const updateColor = useCallback(
		(hex: string) => {
			const normalizedHex = hex.toUpperCase();
			const isValid = isValidHexColor(normalizedHex);

			setColorState({
				hex: isValid ? normalizedHex : colorState.hex,
				isValid,
			});

			if (isValid && onColorChange) {
				onColorChange(normalizedHex);
			}
		},
		[colorState.hex, onColorChange],
	);

	const handleHexInputChange = useCallback(
		(value: string) => {
			setInputValue(value);

			// Add # if not present
			const formattedValue = value.startsWith("#") ? value : `#${value}`;

			if (isValidHexColor(formattedValue)) {
				updateColor(formattedValue);
			} else {
				setColorState((prev) => ({ ...prev, isValid: false }));
			}
		},
		[updateColor],
	);

	const selectPaletteColor = useCallback(
		(hex: string) => {
			updateColor(hex);
		},
		[updateColor],
	);

	return {
		colorState,
		inputValue,
		handleHexInputChange,
		selectPaletteColor,
		updateColor,
	};
}

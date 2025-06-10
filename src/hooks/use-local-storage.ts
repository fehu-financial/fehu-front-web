"use client";

import { useEffect, useState } from "react";
function useLocalStorage<T>(
	key: string,
	defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [value, setValue] = useState<T>(() => {
		try {
			const storedValue = localStorage.getItem(key);
			return storedValue ? (JSON.parse(storedValue) as T) : defaultValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return defaultValue;
		}
	});

	useEffect(() => {
		try {
			if (value === null) return;
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.error(`Error setting localStorage key "${key}":`, error);
		}
	}, [key, value]);

	return [value, setValue];
}

export default useLocalStorage;

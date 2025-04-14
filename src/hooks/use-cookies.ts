import Cookies from "js-cookie";
import { useCallback, useState } from "react";

type UseCookieReturn<T> = {
	value: T;
	setCookie: (newValue: T, options?: Cookies.CookieAttributes) => void;
	removeCookie: () => void;
};

export default function useCookie<T>(
	name: string,
	defaultValue: T,
	type: "json" | "base64" | "string" = "string",
): UseCookieReturn<T> {
	const parseCookie = (cookie: string | undefined): T => {
		if (!cookie) return defaultValue;
		try {
			if (type === "base64") {
				return JSON.parse(atob(cookie)) as T;
			}
			if (type === "json") {
				return JSON.parse(cookie) as T;
			}
			return cookie as T;
		} catch (error) {
			console.error(`Failed to parse cookie "${name}":`, error);
			return defaultValue;
		}
	};

	const [value, setValue] = useState<T>(() => {
		const cookie = Cookies.get(name);
		return parseCookie(cookie);
	});

	const setCookie = useCallback(
		(newValue: T, options?: Cookies.CookieAttributes) => {
			try {
				let serializedValue: string;
				if (type === "base64") {
					serializedValue = btoa(JSON.stringify(newValue));
				} else if (type === "json") {
					serializedValue = JSON.stringify(newValue);
				} else {
					serializedValue = String(newValue);
				}
				Cookies.set(name, serializedValue, options);
				setValue(newValue);
			} catch (error) {
				console.error(`Failed to set cookie "${name}":`, error);
			}
		},
		[name, type],
	);

	const removeCookie = useCallback(() => {
		Cookies.remove(name);
		setValue(defaultValue);
	}, [name, defaultValue]);

	return { value, setCookie, removeCookie };
}

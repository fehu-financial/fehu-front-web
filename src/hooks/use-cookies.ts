import Cookies, { type CookieAttributes } from "js-cookie";
import { useCallback, useState } from "react";

type UseCookieReturn<T> = {
	value: T;
	setCookie: (newValue: T, options?: CookieAttributes) => void;
	removeCookie: () => void;
};

export default function useCookie<T>(
	name: string,
	defaultValue: T,
	type?: "json" | "base64" | "string",
): UseCookieReturn<T> {
	const [value, setValue] = useState<T>(() => {
		const cookie = Cookies.get(name);
		console.log("cookie", cookie);
		const parsedCookie: T =
			type === "base64"
				? atob(cookie || "")
				: type === "json"
					? JSON.parse(cookie || "")
					: cookie;

		if (parsedCookie) return parsedCookie;
		if (!defaultValue || defaultValue === null) return defaultValue;

		// const parsedDefaultValue = btoa(JSON.stringify(defaultValue));
		// Cookies.set(name, parsedDefaultValue);
		return defaultValue;
	});

	const setCookie = useCallback(
		(newValue: T, options?: CookieAttributes) => {
			if (!newValue || newValue === null) return;
			Cookies.set(name, btoa(JSON.stringify(newValue)), options);
			setValue(newValue);
		},
		[name],
	);

	const removeCookie = useCallback(() => {
		Cookies.remove(name);
		setCookie(defaultValue);
	}, [name, defaultValue, setCookie]);

	return { value, setCookie, removeCookie };
}

import type React from "react";

interface SpinnerProps {
	size?: "sm" | "md" | "lg";
	color?: string;
	className?: string;
}

export default function Spinner({
	size = "md",
	color = "currentColor",
	className = "",
}: SpinnerProps): React.ReactElement {
	const sizeMap = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-8 w-8",
	};

	return (
		<output className={`inline-block animate-spin ${className}`}>
			<svg
				className={`${sizeMap[size]}`}
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-labelledby="spinnerTitle"
			>
				<title id="spinnerTitle">Loading spinner</title>
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke={color} strokeWidth="3" />
				<path
					className="opacity-75"
					fill={color}
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			<span className="sr-only">Loading...</span>
		</output>
	);
}

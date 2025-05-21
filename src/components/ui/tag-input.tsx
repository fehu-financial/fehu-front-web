"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

export interface TagInputProps {
	value: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
	className?: string;
}

export function TagInput({
	value,
	onChange,
	placeholder,
	className,
}: TagInputProps) {
	const [input, setInput] = React.useState("");
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if ((e.key === "Enter" || e.key === ",") && input.trim()) {
			e.preventDefault();
			if (!value.includes(input.trim())) {
				onChange([...value, input.trim()]);
			}
			setInput("");
		} else if (e.key === "Backspace" && !input && value.length > 0) {
			onChange(value.slice(0, -1));
		}
	};

	const handleRemove = (tag: string) => {
		onChange(value.filter((t) => t !== tag));
	};

	return (
		<div
			className={cn(
				"flex flex-wrap gap-2 items-center border rounded-md px-2 py-1 min-h-[42px] bg-background",
				className,
			)}
		>
			{value.map((tag) => (
				<Badge
					key={tag}
					className="flex items-center gap-1 pr-1 bg-muted text-foreground"
				>
					<span>{tag}</span>
					<button
						type="button"
						className="ml-1 rounded hover:bg-muted-foreground/20 p-0.5"
						onClick={() => handleRemove(tag)}
						aria-label={`Remover tag ${tag}`}
					>
						<X className="w-3 h-3" />
					</button>
				</Badge>
			))}
			<Input
				ref={inputRef}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleInputKeyDown}
				placeholder={placeholder}
				className="flex-1 min-w-[120px] border-none shadow-none focus:ring-0 focus:border-transparent bg-transparent p-0 m-0"
				style={{ width: input.length ? `${input.length + 1}ch` : "2ch" }}
			/>
		</div>
	);
}

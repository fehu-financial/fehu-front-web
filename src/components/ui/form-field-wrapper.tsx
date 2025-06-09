import clsx from "clsx";
import type { ReactNode } from "react";
import type {
	Control,
	ControllerRenderProps,
	FieldPath,
	FieldValues,
} from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./form";

interface FormFieldWrapperProps<T extends FieldValues = FieldValues> {
	name: FieldPath<T>;
	label: ReactNode;
	required?: boolean;
	control: Control<T>;
	description?: ReactNode;
	render?: (field: ControllerRenderProps<T, FieldPath<T>>) => ReactNode;
	children?: ReactNode;
	itemProps?: React.HTMLAttributes<HTMLDivElement>;
	labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
	className?: string;
}

export function FormFieldWrapper<T extends FieldValues = FieldValues>({
	name,
	label,
	required,
	control,
	description,
	render,
	children,
	itemProps,
	labelProps,
	className,
}: FormFieldWrapperProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem
					{...itemProps}
					className={clsx(itemProps?.className, className)}
				>
					<FormLabel {...labelProps}>
						{label}
						{required && <span className="text-destructive ml-1">*</span>}
					</FormLabel>
					<FormControl>{render ? render(field) : children}</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

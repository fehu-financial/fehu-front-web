import type React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface PeriodFilterProps {
	defaultValue?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	width?: string;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
	defaultValue = "",
	onChange,
	placeholder = "Select period",
	width = "180px",
}) => {
	const periodOptions = [
		{ value: "1W", label: "Last Week" },
		{ value: "1M", label: "Last Month" },
		{ value: "3M", label: "Last 3 Months" },
		{ value: "1Y", label: "Last Year" },
		{ value: "ALL", label: "All Time" },
	];

	return (
		<Select defaultValue={defaultValue} onValueChange={onChange}>
			<SelectTrigger className={`w-[${width}]`}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{periodOptions.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default PeriodFilter;

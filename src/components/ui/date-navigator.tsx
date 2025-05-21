import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
	endOfMonth,
	format,
	isAfter,
	isBefore,
	isSameMonth,
	startOfMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DateNavigatorProps {
	onDateSelect: (startDate: Date, endDate: Date) => void;
	initialMonth?: Date;
	minDate?: Date;
	maxDate?: Date;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({
	onDateSelect,
	initialMonth = new Date(),
	minDate,
	maxDate,
}) => {
	const [isMonthMode, setIsMonthMode] = useState(true);
	const [currentDate, setCurrentDate] = useState(initialMonth);
	const [selectedRange, setSelectedRange] = useState<DateRange>(() => ({
		from: startOfMonth(currentDate),
		to: endOfMonth(currentDate),
	}));

	useEffect(() => {
		if (isMonthMode) {
			const monthStart = startOfMonth(currentDate);
			const monthEnd = endOfMonth(currentDate);

			setSelectedRange({
				from: monthStart,
				to: monthEnd,
			});

			onDateSelect(monthStart, monthEnd);
		}
	}, [currentDate, isMonthMode, onDateSelect]);

	const handleDateRangeChange = (range: DateRange | undefined) => {
		if (!range?.from) return;

		const from = range.from;
		const to = range.to || from;

		setSelectedRange({ from, to });

		const fromIsStartOfMonth = from.getDate() === 1;
		const toIsEndOfMonth = to.getDate() === endOfMonth(to).getDate();
		const isExactMonth =
			isSameMonth(from, to) && fromIsStartOfMonth && toIsEndOfMonth;

		if (isExactMonth) {
			setCurrentDate(from);
			setIsMonthMode(true);
		} else {
			setIsMonthMode(false);
			onDateSelect(from, to);
		}
	};

	const goToPreviousMonth = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() - 1);
		setCurrentDate(newDate);
		setIsMonthMode(true);
	};

	const goToNextMonth = () => {
		const newDate = new Date(currentDate);
		newDate.setMonth(newDate.getMonth() + 1);
		setCurrentDate(newDate);
		setIsMonthMode(true);
	};

	const resetToCurrentMonth = () => {
		setCurrentDate(new Date());
		setIsMonthMode(true);
	};

	const getDisplayText = () => {
		if (isMonthMode) {
			return format(currentDate, "MMMM yyyy");
		}

		if (selectedRange.from && selectedRange.to) {
			return `${format(selectedRange.from, "d MMM yyyy")} - ${format(selectedRange.to, "d MMM yyyy")}`;
		}

		return "";
	};

	const isPreviousMonthDisabled = () => {
		if (!minDate) return false;

		const previousMonth = new Date(currentDate);
		previousMonth.setMonth(previousMonth.getMonth() - 1);

		return isBefore(startOfMonth(previousMonth), startOfMonth(minDate));
	};

	const isNextMonthDisabled = () => {
		if (!maxDate) return false;

		const nextMonth = new Date(currentDate);
		nextMonth.setMonth(nextMonth.getMonth() + 1);

		return isAfter(endOfMonth(nextMonth), endOfMonth(maxDate));
	};

	return (
		<div className="flex items-center justify-between">
			<Button
				variant="outline"
				size="icon"
				onClick={goToPreviousMonth}
				disabled={isPreviousMonthDisabled()}
				aria-label="Previous month"
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			<div className="flex-1 flex flex-col items-center">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className={cn("pl-3 text-left font-normal")}
						>
							<h2 className="text-xl font-bold">{getDisplayText()}</h2>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="center">
						<Calendar
							mode="range"
							selected={selectedRange}
							onSelect={handleDateRangeChange}
							numberOfMonths={2}
							defaultMonth={selectedRange.from}
							fromDate={minDate}
							toDate={maxDate}
							initialFocus
						/>
						<div className="flex justify-between p-3">
							<Button variant="outline" onClick={resetToCurrentMonth}>
								Current Month
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			<Button
				variant="outline"
				size="icon"
				onClick={goToNextMonth}
				disabled={isNextMonthDisabled()}
				aria-label="Next month"
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
};

export default DateNavigator;

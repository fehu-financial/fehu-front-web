import Formatter from "@/lib/formatter";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface SummaryStatsProps {
	title?: string;
	icon?: LucideIcon;
	value: number;
	stats?: {
		percent: number;
		text: string;
	};
}

const SummaryStats = ({ title, value = 0, stats, ...props }: SummaryStatsProps) => (
	<Card className="w-full">
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium">{title}</CardTitle>
			{props.icon && <props.icon />}
		</CardHeader>
		<CardContent>
			<div className="text-2xl font-bold">{new Formatter().currency(value)}</div>
			<p className="text-xs text-muted-foreground">
				{stats && (
					<span className={stats.percent > 0 ? "text-green-300" : "text-red-300"}>
						{stats.percent > 0 ? `+${stats.percent}% ` : `${stats.percent}% `}
					</span>
				)}
				{stats?.text}
			</p>
		</CardContent>
	</Card>
);
export { SummaryStats };

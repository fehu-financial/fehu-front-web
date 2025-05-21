import { cn } from "@/lib/utils";

interface PageContainerProps {
	title?: string;
	description?: string;
	className?: string;
	children: React.ReactNode;
	header?: React.ReactNode;
}

export function PageContainer({
	title,
	description,
	className,
	children,
	header,
}: PageContainerProps) {
	return (
		<div
			className={cn("min-h-full overflow-auto scrollbar-hide p-6", className)}
		>
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
					<p className="text-muted-foreground">{description}</p>
				</div>
				{header}
			</div>
			{children}
		</div>
	);
}

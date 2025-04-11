import { cn } from "@/lib/utils";

type MainProps = {
	className?: string;
	children: React.ReactNode;
};

export function Main({ children, className }: MainProps) {
	return (
		<main className={cn(className, "flex flex-1 flex-col")}>{children}</main>
	);
}

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/core/lib/utils";

type MainProps = {
	className?: string;
	children: React.ReactNode;
};

export function Main({ children, className }: MainProps) {
	return (
		<main className={cn(className, "flex flex-1 overflow-hidden")}>
			<ScrollArea className="w-full mx-auto sm:px-6 lg:px-10 py-4">{children}</ScrollArea>
		</main>
	);
}

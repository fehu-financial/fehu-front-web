"use client";

import { ArrowRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface NavLinkProps {
	title: string;
	subtitle?: string;
	href: string;
}

const NavLink = ({ title, subtitle, href }: NavLinkProps) => {
	const router = useRouter();
	const pathname = usePathname();

	const handleRouting = () => router.push(`${pathname}/${href}`);

	return (
		<Card className="flex items-center justify-between cursor-pointer hover:bg-accent" onClick={handleRouting}>
			<div>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-xl font-semibold">{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-xs text-muted-foreground">{subtitle}</p>
				</CardContent>
			</div>
			<span className="mr-4">
				<ArrowRight />
			</span>
		</Card>
	);
};

export { NavLink };

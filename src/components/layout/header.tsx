import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Eye, Bell } from "lucide-react";

export function Header() {
	return (
		<header className="col-start-2 row-start-1 flex justify-between p-4 mx-10">
			<div />
			<div>
				<div className="flex items-center space-x-4">
					<Toggle className="h-10 w-10">
						<Eye className="h-6 w-6" />
					</Toggle>
					<Popover>
						<PopoverTrigger asChild>
							<Button className="h-10 w-10 hover:bg-transparent" variant="ghost" size="icon">
								<div className="relative">
									<Bell className="h-6 w-6" />
									<Badge variant="dot">1</Badge>
								</div>
							</Button>
						</PopoverTrigger>
						<PopoverContent>Notificações</PopoverContent>
					</Popover>
					<Popover>
						<PopoverTrigger>
							<Avatar className="h-10 w-10">
								<AvatarImage
									className="object-cover"
									src="https://img.quizur.com/f/img638e533eeb84c8.93300145.png?lastEdited=1670271808"
								/>
								<AvatarFallback>EE</AvatarFallback>
							</Avatar>
						</PopoverTrigger>
						<PopoverContent>Perfil</PopoverContent>
					</Popover>
				</div>
			</div>
		</header>
	);
}

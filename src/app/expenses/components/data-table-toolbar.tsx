"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon } from "lucide-react";

export function DataTableToolbar() {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="ml-auto hidden h-8 lg:flex space-x-1"
					onClick={() => console.log("Add expense")}
				>
					<PlusIcon size={16} className="ml-2" />
					<span>Add</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				{" "}
				<div className="grid gap-4">
					<div className="space-y-2">
						<h4 className="font-medium leading-none">Dimensions</h4>
						<p className="text-sm text-muted-foreground">
							Set the dimensions for the layer.
						</p>
					</div>
					<div className="grid gap-2">
						<div className="grid grid-cols-3 items-center gap-4">
							{/* <Label htmlFor="width">Width</Label> */}
							<Input
								id="width"
								defaultValue="100%"
								className="col-span-2 h-8"
							/>
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							{/* <Label htmlFor="maxWidth">Max. width</Label> */}
							<Input
								id="maxWidth"
								defaultValue="300px"
								className="col-span-2 h-8"
							/>
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							{/* <Label htmlFor="height">Height</Label> */}
							<Input
								id="height"
								defaultValue="25px"
								className="col-span-2 h-8"
							/>
						</div>
						<div className="grid grid-cols-3 items-center gap-4">
							{/* <Label htmlFor="maxHeight">Max. height</Label> */}
							<Input
								id="maxHeight"
								defaultValue="none"
								className="col-span-2 h-8"
							/>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

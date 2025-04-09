"use client";

import { cn } from "@/core/lib/utils";
import type React from "react";

interface GoalBarProps {
	from?: number;
	current: number;
	objectives: number[];
	min?: number;
	max?: number;
}

const GoalBar: React.FC<GoalBarProps> = ({ from, current, objectives, min = -50, max = 50 }) => {
	const range = max - min;
	const getPosition = (value: number) => ((value - min) / range) * 100;
	const sortedObjectives = [...objectives].sort((a, b) => a - b);

	return (
		<div className="relative w-full h-2 bg-secondary rounded-full">
			{/* Progress bar */}
			<div
				className={cn(
					"absolute h-full transition-all duration-500 ease-in-out",
					current < 0 ? "bg-destructive" : "bg-emerald-500",
				)}
				style={{ width: `${getPosition(current)}%` }}
			/>

			{/* Objective markers */}
			{sortedObjectives.map((objective, index) => (
				<ObjectiveMarker key={`${index}-${objective}`} objective={objective} getPosition={getPosition} />
			))}

			{/* Current value marker */}
			<CurrentValueMarker current={current} getPosition={getPosition} />
		</div>
	);
};

interface MarkerProps {
	objective: number;
	getPosition: (value: number) => number;
}

const ObjectiveMarker: React.FC<MarkerProps> = ({ objective, getPosition }) => (
	<div
		className="absolute top-0 w-2 rounded-full h-full bg-foreground opacity-75"
		style={{ left: `${getPosition(objective)}%` }}
	>
		<div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
			<span className="text-[10px] text-muted-foreground font-medium">{objective}</span>
		</div>
	</div>
);

interface CurrentValueMarkerProps {
	current: number;
	getPosition: (value: number) => number;
}

const CurrentValueMarker: React.FC<CurrentValueMarkerProps> = ({ current, getPosition }) => (
	<div
		className="absolute top-[-4px] w-4 transition-all duration-500 ease-in-out rounded-full h-4 bg-foreground border-2 border-accent transform -translate-x-1/2"
		style={{ left: `${getPosition(current)}%` }}
	>
		<div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
			<span className="text-xs font-bold">{current}</span>
		</div>
	</div>
);

export default GoalBar;

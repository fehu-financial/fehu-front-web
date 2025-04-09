import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="min-h-full overflow-auto scrollbar-hide p-6">
			<div className="flex justify-between items-center mb-8">
				<Skeleton className="h-10 w-64 mb-8" />
				<Skeleton className="h-8 w-32 mb-8" />
			</div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
				{Array.from({ length: 5 }).map((_, index) => (
					<div key={index} className="p-4 border rounded-lg shadow-sm space-y-4">
						<div className="flex justify-between">
							<Skeleton className="h-6 w-3/4 mb-2" />
							<Skeleton className="h-6 w-6 mb-2 rounded-lg" />
						</div>
						<Skeleton className="h-14 w-full mb-4" />
						<Skeleton className="h-6 w-1/2" />
					</div>
				))}
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y">
					<thead>
						<tr>
							{Array.from({ length: 5 }).map((_, index) => (
								<th
									key={index}
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									<Skeleton className="h-4 w-24" />
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y ">
						{Array.from({ length: 5 }).map((_, rowIndex) => (
							<tr key={rowIndex}>
								{Array.from({ length: 5 }).map((_, colIndex) => (
									<td key={colIndex} className="px-6 py-4 whitespace-nowrap">
										<Skeleton className="h-4 w-32" />
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

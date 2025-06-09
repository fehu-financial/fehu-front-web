import { Skeleton } from "@/components/ui/skeleton";

export function WalletSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{Array.from(
					{ length: 3 },
					(_, i) => `wallet-card-${Date.now()}-${i}`,
				).map((key) => (
					<div key={key} className="p-6 rounded-xl bg-muted animate-pulse">
						<Skeleton className="h-6 w-32 mb-2" />
						<Skeleton className="h-8 w-24 mb-4" />
						<Skeleton className="h-4 w-28" />
					</div>
				))}
			</div>

			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-80" />
					<Skeleton className="h-10 w-32" />
				</div>

				<div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
					{Array.from(
						{ length: 3 },
						(_, i) => `wallet-item-${Date.now()}-${i}`,
					).map((key) => (
						<div key={key} className="space-y-4">
							<Skeleton className="h-32 w-full rounded-xl" />
							<div className="space-y-2">
								<Skeleton className="h-6 w-full" />
								<Skeleton className="h-48 w-full rounded-lg" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

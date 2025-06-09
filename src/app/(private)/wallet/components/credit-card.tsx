import { cn } from "@/lib/utils";
import type { CreditCard as CreditCardType } from "@/types/wallet";
import Image from "next/image";
import { memo } from "react";
import { CREDIT_CARD_BRANDS } from "../lib/constants";
import { formatCardNumber, getCardGradient } from "../lib/utils";

interface CreditCardProps {
	creditCard: CreditCardType;
	className?: string;
}

const getBrandLogo = (brand: string) => {
	const brandInfo = CREDIT_CARD_BRANDS.find(
		(b) => b.id === brand.toUpperCase(),
	);
	return brandInfo?.logo || null;
};

export const CreditCard = memo(({ creditCard, className }: CreditCardProps) => {
	const maskedNumber = formatCardNumber(creditCard.lastFourDigits);
	const brandLogo = getBrandLogo(creditCard.brand);
	const cardGradient = getCardGradient(creditCard.color);

	return (
		<div
			className={cn(
				"relative h-48 w-80 rounded-xl p-6 text-white shadow-lg transition-all duration-300",
				"cursor-pointer hover:shadow-xl",
				`bg-gradient-to-r ${cardGradient}`,
				className,
			)}
			style={{
				background: creditCard.color
					? `linear-gradient(135deg, ${creditCard.color}, #1a1a1a)`
					: undefined,
			}}
		>
			<div className="flex h-full flex-col justify-between">
				{/* Header with bank logo */}
				<div className="flex justify-between items-start">
					<div className="h-8 w-16">
						<div className="text-xs font-semibold text-white/80">
							{creditCard.issuer}
						</div>
					</div>
				</div>

				{/* Card number */}
				<div className="space-y-4">
					<div className="text-xl tracking-widest font-mono">
						{maskedNumber}
					</div>

					{/* Footer with brand logo */}
					<div className="flex justify-between items-end">
						<div className="space-y-1">
							<div className="text-xs text-white/60 uppercase tracking-wide">
								Válido até
							</div>
							<div className="text-sm font-medium">
								{new Intl.DateTimeFormat("pt-BR", {
									month: "2-digit",
									year: "2-digit",
								}).format(new Date(creditCard.expiration))}
							</div>
						</div>

						{brandLogo && (
							<div className="h-8 flex items-center">
								<Image
									src={brandLogo}
									alt={creditCard.brand}
									width={48}
									height={24}
									className="object-contain"
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
});

CreditCard.displayName = "CreditCard";

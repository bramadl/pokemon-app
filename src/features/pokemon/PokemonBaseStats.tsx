import React from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

import { Card } from "../../components/Card";

export const PokemonBaseStats: React.FC<{
	stats: {};
}> = React.memo(({ stats }) => {
	const maxValue = Math.floor(0.01 * (2 * 45 + 0 + Math.floor(0.25 * 0)) * 100) + 100 + 10;
	console.log(maxValue);

	return (
		<Card
			id="baseStatsSection"
			header={
				<React.Fragment>
					<div className="flex items-center gap-2">
						<HiOutlineMenuAlt1 className="text-3xl text-green-400" />
						<h3 className="text-lg font-semibold">Base Stats</h3>
					</div>
					<div className="flex items-center justify-center bg-white/10 text-white/50 py-0.5 px-3 rounded-full">
						<span className="font-semibold text-sm">312</span>
					</div>
				</React.Fragment>
			}
		>
			<ul className="flex flex-col gap-4">
				<li className="flex gap-8">
					<div className="w-20">
						<span className="font-bold">HP:</span> <span>45</span>
					</div>
					<div className="flex-1"></div>
				</li>
			</ul>
		</Card>
	);
});

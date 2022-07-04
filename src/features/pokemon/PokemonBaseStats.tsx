import React from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

import { Card } from "../../components/Card";

import { stringifySlug } from "../../utils/strings";

export const PokemonBaseStats: React.FC<{
	stats: [];
	weight: number;
}> = React.memo(({ stats, weight }) => {
	const statsMapped = stats.map((stat: any) => ({
		name: stat.stat.name,
		baseStat: stat.base_stat,
	}));

	const toKg = Number((weight / 10).toFixed(1));
	const toLbs = Number((toKg * 2.2).toFixed(1));

	const total = statsMapped
		.map((stat) => stat.baseStat)
		.reduce((a, b) => a + b, 0);

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
						<span className="font-semibold text-sm">{total}</span>
					</div>
				</React.Fragment>
			}
		>
			<ul className="flex flex-col gap-4">
				{statsMapped.map((stat) => (
					<li key={stat.name} className="flex gap-8">
						<div className="w-48">
							<span className="font-bold capitalize">
								{stringifySlug(stat.name)}:
							</span>{" "}
							<span>{stat.baseStat}</span>
						</div>
						<div className="flex-1">
							<progress className="w-full" value={stat.baseStat} max={256} />
						</div>
					</li>
				))}
				<li className="flex gap-8">
					<div className="w-48">
						<span className="font-bold capitalize">Weight:</span>
					</div>
					<div className="flex-1">
						<span>
							{toKg} kg or {toLbs} lbs
						</span>
					</div>
				</li>
			</ul>
		</Card>
	);
});

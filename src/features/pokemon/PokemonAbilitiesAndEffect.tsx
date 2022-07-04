import React from "react";
import { RiInformationFill } from "react-icons/ri";
import { useQueries } from "react-query";
import { fetchAbilityByUrl } from "../../api/fetchAbilities";
import { Card } from "../../components/Card";
import { PokemonAbilityDetail } from "./PokemonAbilityDetail";

export const PokemonAbilitiesAndEffect: React.FC<{
	abilities: {
		ability: {
			name: string;
			url: string;
		};
	}[];
}> = React.memo(({ abilities }) => {
	const queries = useQueries(
		abilities.map(({ ability: { url } }) => {
			return {
				queryKey: ["pokemon", url],
				queryFn: () => fetchAbilityByUrl(url),
				refetchOnWindowFocus: false,
			};
		})
	);

	if (queries.some((query) => query.isLoading)) return null;

	const abilitiesData = queries.map((query) => query.data);
	const effects = abilitiesData.map(
		(data) => ({
			name: data.name,
			effect: data.effect_entries.find(
				(entry: {
					effect: string;
					language: {
						name: string;
					};
				}) => entry.language.name === "en"
			).effect
		})
	);

	return (
		<Card
			id="abilitiesAndEffectSection"
			header={
				<div className="flex items-center gap-2">
					<RiInformationFill className="text-3xl text-orange-400" />
					<h3 className="text-lg font-semibold">Abilities and Effects</h3>
				</div>
			}
		>
			<ul className="flex flex-col gap-4">
				{effects.map(({ name, effect }, index) => (
					<li key={index}>
						<PokemonAbilityDetail name={name} effect={effect} />
					</li>
				))}
			</ul>
		</Card>
	);
});

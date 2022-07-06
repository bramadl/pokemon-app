import React, { useContext } from "react";
import { RiInformationFill } from "react-icons/ri";
import { useQueries } from "react-query";
import { ClipLoader } from "react-spinners";

import { fetchAbilityByUrl } from "../../api/fetchAbilities";

import { Card } from "../../components/Card";

import pokemonHelper from "./pokemon.helpers";
import { PokemonThemeContext } from "./PokemonDetail";

type AbilityProps = {
	ability: {
		name: string;
		url: string;
	};
};

const CardWrapper: React.FC<{
	children: React.ReactNode | React.ReactFragment;
}> = ({ children }) => {
	const pokemonThemeContext = useContext(PokemonThemeContext);

	return (
		<Card
			id="abilitiesAndEffectSection"
			header={
				<div className="flex items-center gap-2">
					<RiInformationFill className={`text-3xl ${pokemonThemeContext}`} />
					<h3 className="text-base font-semibold">Abilities and Effects</h3>
				</div>
			}
		>
			{children}
		</Card>
	);
};

export const PokemonAbilitiesAndEffect: React.FC<{
	abilities: AbilityProps[];
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

	if (queries.some((query) => query.isLoading)) {
		return (
			<CardWrapper>
				<div className="flex items-center justify-center">
					<ClipLoader color="#FFFFFF" />
				</div>
			</CardWrapper>
		);
	}

	const effects = pokemonHelper.makeEffects(queries);

	return (
		<CardWrapper>
			<ul className="flex flex-col gap-4">
				{effects.map(({ name, effect }, index) => (
					<li key={index}>
						<h4 className="font-medium text-lg capitalize">{name}</h4>
						{effect ? (
							<p className="mt-2 text-white/80">{effect}</p>
						) : (
							<p className="mt-2 text-white/50 italic">No effect provided</p>
						)}
					</li>
				))}
			</ul>
		</CardWrapper>
	);
});

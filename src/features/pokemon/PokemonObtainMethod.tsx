import React, { ReactNode, useContext, useEffect } from "react";
import { MdCatchingPokemon } from "react-icons/md";
import { useQuery } from "react-query";
import { ClipLoader } from "react-spinners";

import { fetchPokemonSpecies } from "../../api/fetchPokemon";

import { Card } from "../../components/Card";

import pokemonHelper from "./pokemon.helpers";

import { stringifySlug } from "../../utils/strings";

import { PokemonThemeContext } from "./PokemonDetail";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { fetchEvolutionChain } from "../../api/fetchEvolutionChain";

type ChainProps = {
	evolution_details: any[];
	evolves_to: any[];
	species: {
		name: string;
	};
};

const CardWrapper: React.FC<{
	header: React.ReactNode | React.ReactFragment;
}> = ({ header }) => {
	return <Card id="carchRateSection" header={header} />;
};

export const PokemonObtainMethod: React.FC<{
	name: string;
	pokemonId: number;
}> = React.memo(({ name, pokemonId }) => {
	const pokemonThemeContext = useContext(PokemonThemeContext);

	const { data, isLoading: isFetchingSpecies } = useQuery(
		["pokemon-species", name],
		() => fetchPokemonSpecies(name),
		{
			refetchOnWindowFocus: false,
		}
	);

	const {
		data: evolution_chain,
		refetch,
		isLoading: isFetchingEvolution,
	} = useQuery(
		["evolution-chain", name],
		() => fetchEvolutionChain(data.evolution_chain.url),
		{
			enabled: false,
			refetchOnWindowFocus: false,
		}
	);

	return (
		<CardWrapper
			header={
				<div className="flex items-start gap-2">
					<IoIosCheckmarkCircle className={`text-3xl ${pokemonThemeContext}`} />
					<div className="flex flex-col">
						<h3 className="text-lg font-semibold">How to Obtain</h3>
						<ul className="flex flex-col list-disc list-inside">
							<li>
                Hayooo
              </li>
						</ul>
					</div>
				</div>
			}
		/>
	);
});

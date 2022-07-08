import React, { useContext, useEffect } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useQuery } from "react-query";
import { CircleLoader } from "react-spinners";

import { fetchEvolutionChain } from "../../api/fetchEvolutionChain";
import { fetchPokemonSpeciesByUrl } from "../../api/fetchPokemon";

import { Card } from "../../components/Card";

import pokemonHelper from "./pokemon.helpers";
import { PokemonThemeContext } from "./PokemonDetail";

const CardWrapper: React.FC<{
	header: React.ReactNode | React.ReactFragment;
}> = ({ header }) => {
	return <Card id="obtainMethodSection" header={header} />;
};

export const PokemonObtainMethod: React.FC<{ species: { url: string } }> =
	React.memo(({ species: { url } }) => {
		const pokemonThemeContext = useContext(PokemonThemeContext);

		const { data: pokemonSpeciesData, isLoading: fetchingPokemonSpecies } = useQuery(
			["pokemon-species", url],
			() => fetchPokemonSpeciesByUrl(url),
			{
				refetchOnWindowFocus: false,
			}
		);


		const { data: pokemonEvolutionData, isLoading: fetchingPokemonEvolution, refetch: fetchPokemonEvolutionData } =
			useQuery(
				["evolution-chain", url],
				() => fetchEvolutionChain(pokemonSpeciesData.evolution_chain.url),
				{
					enabled: false,
					refetchOnWindowFocus: false,
				}
			);

		useEffect(() => {
			if (!fetchingPokemonSpecies) {
        if (pokemonSpeciesData.evolution_chain) {
          fetchPokemonEvolutionData()
        }
      };
		}, [fetchingPokemonSpecies]);

		if (fetchingPokemonEvolution) {
			return (
				<CardWrapper
					header={
						<div className="w-full flex items-center justify-center">
							<CircleLoader color="#FFFFFF" />
						</div>
					}
				/>
			);
		}

    if (!pokemonEvolutionData) return null;

		const obtainMethods = pokemonHelper.makeObtainMethods({
			name: pokemonSpeciesData.name,
			pokemonEvolutionData,
			pokemonSpeciesData,
		});

		return (
			<CardWrapper
				header={
					<div className="flex items-start gap-2">
						<IoIosCheckmarkCircle
							className={`text-3xl ${pokemonThemeContext}`}
						/>
						<div className="flex flex-col">
							<h3 className="text-base font-semibold">How to Obtain</h3>
							<ul
								className={`flex flex-col ${
									obtainMethods.length > 1 ? "list-disc list-inside" : ""
								}`}
							>
								{obtainMethods.map((method, index) => (
									<li key={index} className="text-sm">
										{method}
									</li>
								))}
							</ul>
						</div>
					</div>
				}
			/>
		);
	});

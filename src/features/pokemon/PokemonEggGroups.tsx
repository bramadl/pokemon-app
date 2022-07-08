import React, { useContext } from "react";
import { GiDinosaurEgg } from "react-icons/gi";
import { useQuery } from "react-query";
import { CircleLoader } from "react-spinners";

import { fetchPokemonSpeciesByUrl } from "../../api/fetchPokemon";

import { Card } from "../../components/Card";

import pokemonHelper from "./pokemon.helpers";
import { PokemonThemeContext } from "./PokemonDetail";

const CardWrapper: React.FC<{
	header: React.ReactNode | React.ReactFragment;
}> = ({ header }) => {
	return <Card id="eggGroupsSection" header={header} />;
};

export const PokemonEggGroups: React.FC<{ species: { url: string } }> =
	React.memo(({ species: { url } }) => {
		const pokemonThemeContext = useContext(PokemonThemeContext);

		const { data, isLoading } = useQuery(
			["eggs", url],
			() => fetchPokemonSpeciesByUrl(url),
			{
				refetchOnWindowFocus: false,
			}
		);

		if (isLoading) {
			return (
				<CardWrapper
					header={
						<div className="flex items-center justify-center">
							<CircleLoader color="#FFFFFF" />
						</div>
					}
				/>
			);
		}

		const { eggGroups, hatchCounter } = pokemonHelper.makeEggs(data);

		return (
			<CardWrapper
				header={
					<div className="flex items-center gap-2">
						<GiDinosaurEgg className={`text-3xl ${pokemonThemeContext}`} />
						<div className="flex flex-col">
							<h3 className="text-base font-semibold">
								{eggGroups.map((egg, index, array) => (
									<React.Fragment key={egg.name}>
										<span className="capitalize">{egg.name}</span>
										{index !== array.length - 1 && <span> and </span>}
									</React.Fragment>
								))}{" "}
								egg groups
							</h3>
							<p className="text-xs text-white/50 leading-none">
								{hatchCounter} of steps to hatch
							</p>
						</div>
					</div>
				}
			/>
		);
	});

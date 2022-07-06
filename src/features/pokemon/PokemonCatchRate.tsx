import React, { useContext } from "react";
import { MdCatchingPokemon } from "react-icons/md";
import { useQuery } from "react-query";
import { ClipLoader } from "react-spinners";

import { fetchPokemonSpecies } from "../../api/fetchPokemon";

import { Card } from "../../components/Card";

import pokemonHelper from "./pokemon.helpers";

import { stringifySlug } from "../../utils/strings";

import { PokemonThemeContext } from "./PokemonDetail";

const CardWrapper: React.FC<{
	header: React.ReactNode | React.ReactFragment;
}> = ({ header }) => {
	return <Card id="carchRateSection" header={header} />;
};

export const PokemonCatchRate: React.FC<{ name: string }> = React.memo(
	({ name }) => {
		const pokemonThemeContext = useContext(PokemonThemeContext);

		const { data, isLoading } = useQuery(
			["pokemon-species", name],
			() => fetchPokemonSpecies(name),
			{
				refetchOnWindowFocus: false,
			}
		);

		if (isLoading) {
			return (
				<CardWrapper
					header={
						<div className="w-full flex items-center justify-center">
							<ClipLoader color="#FFFFFF" />
						</div>
					}
				/>
			);
		}

		const captureRate = pokemonHelper.makeCaptureRate(data);

		return (
			<CardWrapper
				header={
					<div className="flex items-center gap-2">
						<MdCatchingPokemon className={`text-3xl ${pokemonThemeContext}`} />
						<div className="flex flex-col">
							<h3 className="text-base font-semibold">Catch Rate</h3>
							<p className="text-xs text-white/50 leading-none">
								<span className="capitalize">{stringifySlug(name)}</span> has a
								catch rate of {captureRate}%
							</p>
						</div>
					</div>
				}
			/>
		);
	}
);

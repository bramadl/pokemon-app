import React from "react";
import { MdCatchingPokemon } from "react-icons/md";
import { useQuery } from "react-query";
import { ClipLoader } from "react-spinners";

import { fetchPokemonSpecies } from "../../api/fetchPokemon";

import { Card } from "../../components/Card";

import pokemonHelper from "./pokemon.helpers";

import { stringifySlug } from "../../utils/strings";

const CardWrapper: React.FC<{
	header: React.ReactNode | React.ReactFragment;
}> = ({ header }) => {
	return <Card id="carchRateSection" header={header} />;
};

export const PokemonCatchRate: React.FC<{ name: string }> = ({ name }) => {
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
					<MdCatchingPokemon className="text-3xl text-green-400" />
					<div className="flex flex-col">
						<h3 className="text-lg font-semibold">Catch Rate</h3>
						<p className="text-xs text-white/50 leading-none">
							<span className="capitalize">{stringifySlug(name)}</span> has a
							catch rate of {captureRate}%
						</p>
					</div>
				</div>
			}
		/>
	);
};

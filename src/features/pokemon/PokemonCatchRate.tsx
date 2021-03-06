import React, { useContext } from "react";
import { MdCatchingPokemon } from "react-icons/md";
import { useQuery } from "react-query";
import { ClipLoader } from "react-spinners";

import { fetchPokemonSpeciesByUrl } from "../../api/fetchPokemon";

import { Card } from "../../components/Card";

import { stringifySlug } from "../../utils/strings";

import pokemonHelper from "./pokemon.helpers";
import { PokemonThemeContext } from "./PokemonDetail";

const CardWrapper: React.FC<{
	header: React.ReactNode | React.ReactFragment;
}> = ({ header }) => {
	return <Card id="carchRateSection" header={header} />;
};

export const PokemonCatchRate: React.FC<{ species: { url: string } }> = React.memo(
	({ species: { url } }) => {
		const pokemonThemeContext = useContext(PokemonThemeContext);

		const { data, isLoading } = useQuery(
			["pokemon-species", url],
			() => fetchPokemonSpeciesByUrl(url),
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
								<span className="capitalize">{stringifySlug(data.name)}</span> has a
								catch rate of {captureRate}%
							</p>
						</div>
					</div>
				}
			/>
		);
	}
);

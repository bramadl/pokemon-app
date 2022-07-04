import React from "react";
import { MdCatchingPokemon } from "react-icons/md";
import { useQuery } from "react-query";
import { fetchPokemonSpecies } from "../../api/fetchPokemon";
import { Card } from "../../components/Card";
import { stringifySlug } from "../../utils/strings";

const MAX_CATCH_RATE = 255;

export const PokemonCatchRate: React.FC<{
	name: string;
}> = ({ name }) => {
	const { data, isLoading } = useQuery(
		["pokemon-species", name],
		() => fetchPokemonSpecies(name),
		{
			refetchOnWindowFocus: false,
		}
	);

	if (isLoading) return null;

	const { capture_rate } = data;
	const captureRate = Math.round((100 / MAX_CATCH_RATE) * capture_rate);

	console.log(captureRate);

	return (
		<Card
			id="catchRateSection"
			header={
				<div className="flex items-center gap-2">
					<MdCatchingPokemon className="text-3xl text-green-400" />
					<div className="flex flex-col">
            <h3 className="text-lg font-semibold">Catch Rate</h3>
            <p className="text-xs text-white/50 leading-none">
              <span className="capitalize">{stringifySlug(name)}</span> {" "}
              has a catch rate of {captureRate}%
            </p>
          </div>
				</div>
			}
		/>
	);
};

import React, { useState } from "react";
import { RiInformationFill, RiMenuUnfoldFill } from "react-icons/ri";
import { useQuery } from "react-query";
import { CircleLoader } from "react-spinners";

import { fetchPokemonByName } from "../../api/fetchPokemon";

import { queryClient } from "../../App";

import { EmptyContent } from "../../components/MainPanel";
import { padNumber } from "../../utils/numbers";
import { stringifySlug } from "../../utils/strings";
import { elements } from "./pokemon.elements";
import { ElementKey } from "./pokemon.types";
import { PokemonAbilitiesAndEffect } from "./PokemonAbilitiesAndEffect";
import { PokemonBaseStats } from "./PokemonBaseStats";
import { PokemonCatchRate } from "./PokemonCatchRate";
import { PokemonFigure } from "./PokemonFigure";
import { PokemonTypeEffectiveness } from "./PokemonTypeEffectiveness";

export const PokemonDetail: React.FC<{ pokemon: string }> = React.memo(
	({ pokemon }) => {
		if (!pokemon) return <EmptyContent />;

		const { data, isLoading } = useQuery(
			["pokemon", pokemon],
			() => fetchPokemonByName(pokemon),
			{
				cacheTime: 5000,
				refetchOnWindowFocus: false,
			}
		);

		if (isLoading) return null;

		return (
			<section>
				<header className="mt-4 px-3">
					<button className="hover:bg-success-100/10 text-success-100 py-1.5 px-3 rounded transition ease-out duration-300">
						<RiMenuUnfoldFill className="text-xl" />
					</button>
				</header>

				<PokemonFigure pokemon={data} />

				<article className="flex justify-center gap-8 my-20 px-20">
					<div className="w-full max-w-xl flex flex-col gap-4">
						<PokemonAbilitiesAndEffect abilities={data.abilities} />
						<PokemonTypeEffectiveness types={data.types} />
						<PokemonBaseStats stats={data.stats} weight={data.weight} />
						<PokemonCatchRate name={data.name} />
					</div>
					<div className="w-full max-w-xl flex flex-col gap-4"></div>
				</article>
			</section>
		);
	}
);

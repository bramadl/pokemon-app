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
import { PokemonFigure } from "./PokemonFigure";
import { PokemonTypeEffectiveness } from "./PokemonTypeEffectiveness";

export const PokemonDetail: React.FC<{ pokemon: string }> = React.memo(
	({ pokemon }) => {
		if (!pokemon) return <EmptyContent />;

		const { data, error, isLoading } = useQuery(
			["pokemon", pokemon],
			() => fetchPokemonByName(pokemon),
			{
				cacheTime: 5000,
				refetchOnWindowFocus: false,
			}
		);

		if (isLoading) return null;

		const pokemonSprite =
			data.sprites.other.home.front_default ||
			data.sprites.front_default ||
			data.sprites.other["official-artwork"].front_default;

		const pokemonDex = padNumber(data.order, 3);

		const pokemonName = stringifySlug(data.name);

		const pokemonTypes = data.types.map(
			({ type }: { type: { name: ElementKey } }, index: number) => (
				<span
					key={type.name}
					className={`${
						elements[type.name].textClass
					} uppercase text-xl font-medium inline-flex items-center gap-2`}
				>
					{type.name}{" "}
					{index !== data.types.length - 1 && (
						<span className="text-white">+</span>
					)}
				</span>
			)
		);

		return (
			<section>
				<header className="mt-4 px-3">
					<button className="hover:bg-success-100/10 text-success-100 py-1.5 px-3 rounded transition ease-out duration-300">
						<RiMenuUnfoldFill className="text-xl" />
					</button>
				</header>

				<PokemonFigure
					name={pokemonName}
					sprite={pokemonSprite}
					pokedex={pokemonDex}
					types={pokemonTypes}
				/>

				<article className="flex justify-center gap-8 mt-8 px-20">
					<div className="w-full max-w-xl flex flex-col gap-4">
						<PokemonAbilitiesAndEffect abilities={data.abilities} />
						<PokemonTypeEffectiveness types={data.types} />
						<PokemonBaseStats stats={data.stats} />
					</div>
					<div className="w-full max-w-xl flex flex-col gap-4">

					</div>
				</article>
			</section>
		);
	}
);

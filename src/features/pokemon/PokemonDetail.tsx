import React, { createContext, useState } from "react";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useQuery } from "react-query";
import { BeatLoader } from "react-spinners";

import { fetchPokemonByName } from "../../api/fetchPokemon";

import { EmptyContent } from "../../components/MainPanel";
import { stringifySlug } from "../../utils/strings";
import { elements } from "./pokemon.elements";
import { ElementKey } from "./pokemon.types";

import { PokemonAbilitiesAndEffect } from "./PokemonAbilitiesAndEffect";
import { PokemonBaseStats } from "./PokemonBaseStats";
import { PokemonCatchRate } from "./PokemonCatchRate";
import { PokemonEggGroups } from "./PokemonEggGroups";
import { PokemonFigure } from "./PokemonFigure";
import { PokemonGenderRatio } from "./PokemonGenderRatio";
import { PokemonObtainMethod } from "./PokemonObtainMethod";
import { PokemonTypeEffectiveness } from "./PokemonTypeEffectiveness";

export const PokemonThemeContext = createContext("");

export const PokemonDetail: React.FC<{ pokemon: string }> = React.memo(
	({ pokemon }) => {
		if (!pokemon) return <EmptyContent />;

		const ref = React.createRef<HTMLElement>();
		const [hasScrolledDown, setHasScrolledDown] = useState(false);
		const { data, isLoading } = useQuery(
			["pokemon", pokemon],
			() => fetchPokemonByName(pokemon),
			{
				cacheTime: 5000,
				refetchOnWindowFocus: false,
			}
		);

		const scrollHandler = (event: React.UIEvent<HTMLDivElement>) => {
			const containerHeight = event.currentTarget.querySelector("header");
			if (containerHeight) {
				const scrollTop = event.currentTarget.scrollTop;
				setHasScrolledDown(scrollTop > containerHeight.clientHeight);
			}
		};

		const preminentElement: ElementKey = data?.types[0].type.name;
		const colorTheme = elements[preminentElement]?.textClass;

		return (
			<section
				ref={ref}
				className="w-full h-full overflow-auto"
				onScroll={scrollHandler}
			>
				<header
					className={`sticky top-0 left-0 w-full h-auto py-4 px-3 border-b ${
						hasScrolledDown
							? "border-white/10 bg-dark-200"
							: "border-transparent"
					} transition ease-out duration-300`}
				>
					<div className="flex items-center gap-4">
						<button className="hover:bg-success-100/10 text-success-100 py-1.5 px-3 rounded transition ease-out duration-300">
							<RiMenuUnfoldFill className="text-xl" />
						</button>

						<h2
							className={`capitalize text-xl font-bold ${
								hasScrolledDown ? "opacity-100" : "opacity-0"
							} transition ease-out duration-300`}
						>
							{stringifySlug(pokemon)}
						</h2>
					</div>
				</header>

				{isLoading ? (
					<div className="w-full h-full flex items-center justify-center">
						<BeatLoader color="rgba(255, 255, 255, 0.5)" />
					</div>
				) : (
					<>
						<PokemonFigure pokemon={data} />
						<PokemonThemeContext.Provider value={colorTheme}>
							<article className="flex justify-center gap-8 my-20 px-20">
								<div className="w-full max-w-xl flex flex-col gap-4">
									<PokemonAbilitiesAndEffect abilities={data.abilities} />
									<PokemonTypeEffectiveness types={data.types} />
									<PokemonBaseStats stats={data.stats} weight={data.weight} />
									<PokemonCatchRate name={data.name} />
									<PokemonGenderRatio name={data.name} />
									<PokemonEggGroups name={data.name} />
								</div>
								<div className="w-full max-w-xl flex flex-col gap-4">
									<PokemonObtainMethod name={data.name} pokemonId={data.id} />
								</div>
							</article>
						</PokemonThemeContext.Provider>
					</>
				)}
			</section>
		);
	}
);

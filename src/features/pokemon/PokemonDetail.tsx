import React, { createContext, useEffect, useState } from "react";
import { IoChevronForwardSharp } from "react-icons/io5";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { useQuery } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import { fetchPokemonById, fetchPokemonByName } from "../../api/fetchPokemon";

import { EmptyContent } from "../../components/MainPanel";
import { stringifySlug } from "../../utils/strings";
import { elements } from "./pokemon.elements";
import { ElementKey } from "./pokemon.types";

import { PokemonAbilitiesAndEffect } from "./PokemonAbilitiesAndEffect";
import { PokemonBaseStats } from "./PokemonBaseStats";
import { PokemonCatchRate } from "./PokemonCatchRate";
import { PokemonEggGroups } from "./PokemonEggGroups";
import { PokemonEvolutions } from "./PokemonEvolutions";
import { PokemonFigure } from "./PokemonFigure";
import { PokemonGameOccurences } from "./PokemonGameOccurences";
import { PokemonGenderRatio } from "./PokemonGenderRatio";
import { PokemonObtainMethod } from "./PokemonObtainMethod";
import { PokemonSprites } from "./PokemonSprites";
import { PokemonTypeEffectiveness } from "./PokemonTypeEffectiveness";

export const PokemonThemeContext = createContext("");

const PokemonDetailHeader: React.FC<{
	hasScrolledDown: boolean;
	pokemon: string;
}> = ({ hasScrolledDown, pokemon }) => {
	return (
		<header
			className={`sticky z-[1] top-0 left-0 w-full h-auto py-4 px-3 border-b ${
				hasScrolledDown ? "border-white/10 bg-dark-200" : "border-transparent"
			} transition ease-out duration-300`}
		>
			<div className="flex items-center gap-4">
				<button className="hidden md:block hover:bg-success-100/10 text-success-100 py-1.5 px-3 rounded transition ease-out duration-300">
					<RiMenuUnfoldFill className="text-xl" />
				</button>

				<Link
					to={"/pokemon"}
					className="md:hidden block hover:bg-success-100/10 text-success-100 py-1.5 px-3 rounded transition ease-out duration-300"
				>
					<IoChevronForwardSharp className="text-xl rotate-180" />
				</Link>

				<h2
					className={`capitalize text-xl font-bold ${
						hasScrolledDown ? "opacity-100" : "opacity-0"
					} transition ease-out duration-300`}
				>
					{stringifySlug(pokemon)}
				</h2>
			</div>
		</header>
	);
};

export const PokemonDetail: React.FC<{ pokemonId: number }> = React.memo(
	({ pokemonId }) => {
		if (!pokemonId) return <EmptyContent />;

		const [params, _] = useSearchParams();

		const ref = React.createRef<HTMLElement>();
		const [hasScrolledDown, setHasScrolledDown] = useState(false);
		const { data, isLoading } = useQuery(
			["pokemon", pokemonId],
			() => fetchPokemonById(pokemonId),
			{
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

		useEffect(() => {
			if (ref.current) {
				ref.current.scrollTo({
					top: 0,
					behavior: "smooth",
				});
			}
		}, [params.get("preview")]);

		const preminentElement: ElementKey = data?.types[0].type.name;
		const colorTheme = elements[preminentElement]?.textClass;

		return (
			<section
				ref={ref}
				className="w-full h-full overflow-auto"
				onScroll={scrollHandler}
			>
				{data && (
					<PokemonDetailHeader
						hasScrolledDown={hasScrolledDown}
						pokemon={data.name}
					/>
				)}

				{isLoading ? (
					<div className="w-full h-full flex items-center justify-center">
						<BeatLoader color="rgba(255, 255, 255, 0.5)" />
					</div>
				) : (
					<>
						<PokemonFigure pokemon={data} />
            <PokemonThemeContext.Provider value={colorTheme}>
              <article className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-4 xl:gap-8 my-20 px-4 md:px-12 xl:px-20">
                <div className="flex-1 w-full md:w-auto max-w-xl flex flex-col gap-4">
                  <PokemonAbilitiesAndEffect abilities={data.abilities} />
                  <PokemonTypeEffectiveness types={data.types} />
                  <PokemonBaseStats stats={data.stats} weight={data.weight} />
                  <PokemonCatchRate species={data.species} />
                  <PokemonGenderRatio species={data.species} />
                  <PokemonEggGroups species={data.species} />
                </div>

                <div className="flex-1 w-full md:w-auto max-w-xl flex flex-col gap-4">
                  <PokemonObtainMethod species={data.species} />
                  <PokemonGameOccurences gameIndices={data.game_indices} />
                  <PokemonEvolutions name={data.name} species={data.species} />
                  <PokemonSprites sprites={data.sprites} />
                </div>
              </article>
            </PokemonThemeContext.Provider>
					</>
				)}
			</section>
		);
	}
);

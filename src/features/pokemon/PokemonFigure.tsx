import React from "react";
import { padNumber } from "../../utils/numbers";
import { stringifySlug } from "../../utils/strings";
import { elements } from "./pokemon.elements";
import { ElementKey } from "./pokemon.types";

export const PokemonFigure: React.FC<{
	pokemon: any;
}> = React.memo(({ pokemon }) => {
	const pokemonSprite =
		pokemon.sprites.other.home.front_default ||
		pokemon.sprites.front_default ||
		pokemon.sprites.other["official-artwork"].front_default;

	const pokemonDex = padNumber(pokemon.order, 3);

	const pokemonName = stringifySlug(pokemon.name);

	const pokemonTypes = pokemon.types.map(
		({ type }: { type: { name: ElementKey } }, index: number) => (
			<span
				key={type.name}
				className={`${
					elements[type.name].textClass
				} uppercase text-xl font-medium inline-flex items-center gap-2`}
			>
				{type.name}{" "}
				{index !== pokemon.types.length - 1 && (
					<span className="text-white">+</span>
				)}
			</span>
		)
	);

	return (
		<section id="pokemonFigureSection">
			<figure className="flex items-center justify-center">
				<img alt={pokemonName} className="w-[300px] h-[300px]" src={pokemonSprite} />
			</figure>
			<div className="flex flex-col items-center justify-center mt-4">
				<p className="font-bold text-lg text-white/50">{pokemonDex}</p>
				<h2 className="font-bold text-4xl text-white capitalize">{pokemonName}</h2>
				<div className="flex items-center gap-2">{pokemonTypes}</div>
			</div>
		</section>
	);
});

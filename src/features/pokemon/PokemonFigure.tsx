import React from "react";

export const PokemonFigure: React.FC<{
  name: string;
  sprite: string;
  pokedex: string;
  types: React.ReactNode[];
}> = React.memo(({ name, sprite, pokedex, types }) => {
	return (
		<section id="pokemonFigureSection">
			<figure className="flex items-center justify-center">
				<img
					alt={name}
					className="w-[300px] h-[300px]"
					src={sprite}
				/>
			</figure>
			<div className="flex flex-col items-center justify-center mt-4">
				<p className="font-bold text-lg text-white/50">{pokedex}</p>
				<h2 className="font-bold text-4xl text-white capitalize">
					{name}
				</h2>
				<div className="flex items-center gap-2">{types}</div>
			</div>
		</section>
	);
});

import React from "react";
import { padNumber } from "../../utils/numbers";

import { Pokemon } from "./pokemon.types";
import { PokemonCard } from "./PokemonCard";

export const PokemonList: React.FC<{
	pokemons: Pokemon[];
}> = ({ pokemons }) => {
	return (
		<div>
			{pokemons.map((pokemon, index) => (
				<PokemonCard
					key={pokemon.id}
					pokedex={padNumber(index + 1, 3)}
					name={pokemon.name}
					sprite={pokemon.sprite}
					types={pokemon.types}
				/>
			))}
		</div>
	);
};

export default React.memo(PokemonList);

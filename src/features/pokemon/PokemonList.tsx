import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { padNumber } from "../../utils/numbers";

import { Pokemon } from "./pokemon.types";
import { PokemonCard } from "./PokemonCard";

export const PokemonList: React.FC<{
	pokemons: Pokemon[];
}> = ({ pokemons }) => {
	const [params, _] = useSearchParams();
	const previewParam = params.get("preview");

	const ref = React.createRef<HTMLDivElement>();

	useEffect(() => {
		if (ref.current) {
			const parentElement = ref.current.parentElement;
			if (parentElement) {
				const target = ref.current.querySelector<HTMLDivElement>(`#pokemon-${previewParam}`);
				if (target) {
					const top = target.offsetTop - target.offsetHeight - 16;
					parentElement.scrollTo({
						top,
						behavior: "smooth",
					});
				}
			}
		}
	}, [ref.current, pokemons, previewParam]);

	return (
		<div ref={ref}>
			{pokemons.map((pokemon, index) => (
				<PokemonCard
					key={pokemon.id}
					id={pokemon.id.toString()}
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

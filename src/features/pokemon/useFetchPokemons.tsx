import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import { fetchPokemon, fetchPokemonByUrl } from "../../api/fetchPokemon";
import { Pokemon, PokemonPage } from "./pokemon.types";

export const useFetchPokemons = () => {
	const { ref, inView } = useInView();
	const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(true);
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);

	const {
		data,
		fetchNextPage,
		isFetchingNextPage: fetching,
		isLoading,
		hasNextPage,
	} = useInfiniteQuery(
		"pokemons",
		({ pageParam = 0 }) => fetchPokemon({ pageParam }),
		{
			refetchOnWindowFocus: false,
			getNextPageParam: (lastPage: PokemonPage, allPages: PokemonPage[]) => {
				if (!lastPage.next) return undefined;

				const regex = /offset=\d+/gi;
				const offset = lastPage.next.match(regex);

				if (!offset) return undefined;

				const nextOffset = offset[0].split("=")[1];
				return nextOffset;
			},
			onSuccess: async (data) => {
				const urls = data.pages
					.map((page) => page.results)
					.flat(1)
					.map((data) => data.url);
				const fetches = Promise.all(urls.map((url) => fetchPokemonByUrl(url)));
				fetches.then((data) => {
					setPokemons(
						data.map((pokemon) => ({
							id: pokemon.id,
							name: pokemon.name,
							sprite:
								pokemon.sprites.other.home.front_default ||
								pokemon.sprites.front_default ||
								pokemon.sprites.other["official-artwork"].front_default,
							types: pokemon.types.map((type: any) => type.type),
						}))
					);
					setIsFetchingNextPage(false);
				});
			},
		}
	);

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView]);

	useEffect(() => {
		if (fetching) {
			setIsFetchingNextPage(true);
		}
	}, [fetching]);

	return {
		ref,
		data,
		pokemons,
		setPokemons,
		hasNextPage,
		isLoading,
		isFetchingNextPage,
		inView,
	};
};

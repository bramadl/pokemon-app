import React, { useEffect, useState, useTransition } from "react";
import { HiMenuAlt1 } from "react-icons/hi";
import { RiCloseFill } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import { CircleLoader } from "react-spinners";

import { AsidePanel } from "../components/AsidePanel";
import { MainPanel } from "../components/MainPanel";
import { Pokemon } from "../features/pokemon/pokemon.types";
import { PokemonDetail } from "../features/pokemon/PokemonDetail";

import PokemonList from "../features/pokemon/PokemonList";
import { useFetchPokemons } from "../features/pokemon/useFetchPokemons";
import { useDebounce } from "../hooks/useDebounce";

export const HomePage = () => {
  const [_transition, startTransition] = useTransition();
	const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
	const [searchValue, setSearchValue] = useState<string>("");
  const [previewParams, _setPreviewParams] = useSearchParams();
	const { isLoading, pokemons, ref, isFetchingNextPage } = useFetchPokemons();
	const debouncedSearchValue = useDebounce<string>(searchValue, 50);

	useEffect(() => {
		if (debouncedSearchValue) {
      startTransition(() => {
        setFilteredPokemons(
          [...pokemons].filter((pokemon) =>
            pokemon.name
              .toLowerCase()
              .includes(debouncedSearchValue.toLowerCase())
          )
        );
      });
		} else {
			startTransition(() => {
        setFilteredPokemons(pokemons);
      });
		}
	}, [debouncedSearchValue]);

  useEffect(() => {
    setFilteredPokemons(pokemons);
  }, [pokemons]);

  useEffect(() => {
    setSearchValue("");
  }, [previewParams.get("preview")]);

	return (
		<div id="homePage" className="w-full h-screen flex overflow-hidden">
			<div
				className={`fixed inset-0 z-10 flex items-center justify-center transition-all ease-out duration-300 ${
					isLoading || isFetchingNextPage ? "opacity-100" : "opacity-0"
				} pointer-events-none bg-dark-100`}
			>
				<CircleLoader color="#FFFFFF" />
			</div>

			{(!isFetchingNextPage || !isLoading) && (
				<React.Fragment>
					<AsidePanel
						headerPanel={
							<HomePageHeader
								searchValue={searchValue}
								setSearchValue={(value) => setSearchValue(value)}
							/>
						}
					>
						<PokemonList pokemons={filteredPokemons} />
						<div ref={ref} className="flex items-center justify-center py-4">
							{isFetchingNextPage && <CircleLoader color="#FFFFFF" />}
						</div>
					</AsidePanel>
					<MainPanel>
            <PokemonDetail pokemon={previewParams.get("preview")!} />
          </MainPanel>
				</React.Fragment>
			)}
		</div>
	);
};

const HomePageHeader: React.FC<{
	searchValue: string;
	setSearchValue: (value: string) => void;
}> = React.memo(({ searchValue, setSearchValue }) => {
	return (
		<div className="w-full">
			<div className="flex items-center gap-6">
				<button className="bg-white/5 hover:bg-white/10 text-white py-1.5 px-3 rounded transition ease-out duration-300">
					<HiMenuAlt1 className="text-xl" />
				</button>
				<h1 className="font-bold text-xl">National Dex</h1>
			</div>

			<div className="mt-4">
				<label className="block relative" htmlFor="search">
					<input
						className="w-full h-auto py-1.5 px-3 rounded bg-white/5 focus:bg-white/10 text-white placeholder-neutral-500 focus:outline-none transition ease-out duration-300"
						placeholder="Search Pokémon"
						value={searchValue}
						onChange={(event) => setSearchValue(event.target.value)}
					/>

					<button
						className={`absolute right-3 top-1/2 -translate-y-1/2 ${
							searchValue.trim().length
								? "opacity-100 pointer-events-auto"
								: "opacity-0 pointer-events-none"
						} transition ease-out duration-300`}
						onClick={() => setSearchValue("")}
					>
						<RiCloseFill />
					</button>
				</label>
			</div>
		</div>
	);
});

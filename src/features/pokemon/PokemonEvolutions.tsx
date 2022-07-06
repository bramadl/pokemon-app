import { Disclosure, Transition } from "@headlessui/react";
import React, { useContext, useEffect, useState } from "react";
import { GiLevelFour } from "react-icons/gi";
import { IoChevronForwardSharp } from "react-icons/io5";
import { useQueries, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { CircleLoader } from "react-spinners";
import { fetchEvolutionChain } from "../../api/fetchEvolutionChain";
import {
  fetchPokemonByName,
  fetchPokemonSpeciesByUrl,
} from "../../api/fetchPokemon";

import { Card } from "../../components/Card";
import { ChainLink, EvolutionDetail } from "../../interfaces/pokeapi";
import { stringifySlug } from "../../utils/strings";
import { parseEvolutionDetail } from "./pokemon.helpers";
import { sprites } from "./pokemon.sprites";
import { ElementKey } from "./pokemon.types";
import { PokemonThemeContext } from "./PokemonDetail";

const CardWrapper: React.FC<{
  children?: React.ReactNode | React.ReactFragment;
  header: React.ReactNode | React.ReactFragment;
}> = ({ children, header }) => {
  return (
    <Card id="evolutionsSection" header={header}>
      {children}
    </Card>
  );
};

const PokemonEvolutionDetails: React.FC<{
  evolutionLines: { name: string; url: string; details: EvolutionDetail[] }[];
}> = React.memo(({ evolutionLines }) => {
  const evolutions = evolutionLines.map((evolution, index, evolutions) => {
    const previousEvolution = index !== 0 && evolutions[index - 1].name;
    const currentEvolution = evolution.name;

    return {
      stage: index ? index : "B",
      pokemonName: currentEvolution,
      details: evolution.details.map((evolution) =>
        parseEvolutionDetail(evolution, { currentEvolution, previousEvolution })
      ),
    };
  });

  console.log(evolutions);

  return (
    <ul className="flex flex-col gap-4">
      {evolutions.map((evolution) => (
        <li key={evolution.pokemonName} className="flex items-start gap-2">
          <div className="w-6 h-6 flex items-center justify-center rounded-full border-2">
            <span className="font-bold">{evolution.stage}</span>
          </div>
          <div className="flex flex-col">
            <p className="font-bold capitalize">
              {stringifySlug(evolution.pokemonName)}
            </p>
            <div className="flex flex-col">
              {evolution.details.length ? (
                evolution.details.map((detail, index) => (
                  <p key={index} className="text-sm">
                    {detail}
                  </p>
                ))
              ) : (
                <p className="text-sm">Base Stage</p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
});

const PokemonEvolutionLines: React.FC<{
  evolutionLines: { name: string; url: string; details: EvolutionDetail[] }[];
  pokemonName: string;
}> = React.memo(({ evolutionLines, pokemonName }) => {
  const queries = useQueries(
    evolutionLines.map((evolution) => {
      return {
        queryKey: ["pokemon-evolution-line", evolution.name],
        queryFn: () => fetchPokemonByName(evolution.name),
        refetchOnWindowFocus: false,
      };
    })
  );

  if (queries.some((query) => query.isLoading)) {
    return <>"Loading"</>;
  }

  const pokemonData: {
    name: string;
    sprite: string;
    types: ElementKey[];
  }[] = queries.map((query) => ({
    name: query.data.name,
    sprite:
      query.data.sprites.other.home.front_default ||
      query.data.sprites.front_default ||
      query.data.sprites.other["official-artwork"].front_default,
    types: query.data.types.map((type: any) => type.type.name),
  }));

  return (
    <Disclosure>
      {({ open }) => (
        <React.Fragment>
          <Disclosure.Button className="w-full flex items-center justify-between gap-4 mb-4 group">
            <div className="flex items-center justify-between gap-4">
              <p className="capitalize font-bold">
                {stringifySlug(pokemonName)} Lines
              </p>
            </div>

            <IoChevronForwardSharp
              className={`text-2xl text-white/50 group-hover:text-white ${
                open ? "rotate-90" : ""
              } transition ease-out duration-300`}
            />
          </Disclosure.Button>

          <div className="flex items-center justify-center gap-2">
            {pokemonData.map((pokemon, index, pokemons) => (
              <React.Fragment key={pokemon.name}>
                <Link
                  to={`/pokemon?preview=${pokemon.name}`}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <figure className="w-16 h-16 flex items-center justify-center bg-white/10 hover:bg-white/5 rounded-full transition ease-out duration-300">
                    <img
                      alt="Front Default"
                      className="w-16 h-16"
                      loading="lazy"
                      src={pokemon.sprite}
                    />
                  </figure>
                  <p className="text-xs capitalize">
                    {stringifySlug(pokemon.name)}
                  </p>
                  <div className="flex items-center gap-1">
                    {pokemon.types.map((type) => (
                      <img
                        key={type}
                        alt={type}
                        className="w-5 h-5 object-cover"
                        src={sprites[type]}
                      />
                    ))}
                  </div>
                </Link>
                {index !== pokemons.length - 1 && (
                  <div className="w-8 h-1 -mt-10 bg-white/10 rounded-full" />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="overflow-hidden">
            <Transition
              enter="transition duration-300 ease-out"
              enterFrom="transform -translate-y-4 opacity-0"
              enterTo="transform translate-y-0 opacity-100"
              leave="transition duration-300 ease-in"
              leaveFrom="transform translate-y-0 opacity-100"
              leaveTo="transform -translate-y-4 opacity-0"
            >
              <Disclosure.Panel className={"flex flex-wrap gap-2 mt-4"}>
                <PokemonEvolutionDetails evolutionLines={evolutionLines} />
              </Disclosure.Panel>
            </Transition>
          </div>
        </React.Fragment>
      )}
    </Disclosure>
  );
});

export const PokemonEvolutions: React.FC<{
  name: string;
  species: { url: string };
}> = React.memo(({ name, species: { url } }) => {
  const pokemonThemeContext = useContext(PokemonThemeContext);

  const { data: pokemonSpecies } = useQuery(
    ["pokemon-species", url],
    () => fetchPokemonSpeciesByUrl(url),
    {
      refetchOnWindowFocus: false,
    }
  );

  const { data: evolutionChain, refetch } = useQuery(
    ["evolution-chain", url],
    () => fetchEvolutionChain(pokemonSpecies.evolution_chain.url),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (pokemonSpecies) refetch();
  }, [pokemonSpecies]);

  if (!evolutionChain) {
    return (
      <CardWrapper
        header={
          <div className="w-full flex items-center justify-center">
            <CircleLoader color="#FFFFFF" />
          </div>
        }
      />
    );
  }

  const makeEvolutionLines = (
    initialChain: ChainLink,
    evolutionLines: { name: string; url: string; details: EvolutionDetail[] }[]
  ): any => {
    const name = initialChain.species.name;
    const url = initialChain.species.url;
    const details = initialChain.evolution_details;
    const evolvesTos = initialChain.evolves_to;

    if (evolvesTos.length === 0) {
      evolutionLines.push({ name, url, details });
      return evolutionLines;
    } else {
      evolutionLines.push({ name, url, details });
      return evolvesTos.map((evolution) =>
        makeEvolutionLines(evolution, evolutionLines)
      );
    }
  };

  const initialChain = evolutionChain.chain as ChainLink;
  const evolutionLines: {
    name: string;
    url: string;
    details: EvolutionDetail[];
  }[] = [];
  makeEvolutionLines(initialChain, evolutionLines);

  return (
    <CardWrapper
      header={
        <div className="flex items-center gap-2">
          <GiLevelFour className={`text-3xl ${pokemonThemeContext}`} />
          <h3 className="text-base font-bold">Evolutions</h3>
        </div>
      }
    >
      <PokemonEvolutionLines
        evolutionLines={evolutionLines}
        pokemonName={name}
      />
    </CardWrapper>
  );
});

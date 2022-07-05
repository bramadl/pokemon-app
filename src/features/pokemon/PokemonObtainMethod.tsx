import React, { useContext, useEffect } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useQuery } from "react-query";
import { CircleLoader } from "react-spinners";

import { fetchEvolutionChain } from "../../api/fetchEvolutionChain";
import { fetchPokemonSpecies } from "../../api/fetchPokemon";

import { Card } from "../../components/Card";
import pokemonHelper from "./pokemon.helpers";

import { PokemonThemeContext } from "./PokemonDetail";

const CardWrapper: React.FC<{
  header: React.ReactNode | React.ReactFragment;
}> = ({ header }) => {
  return <Card id="carchRateSection" header={header} />;
};

export const PokemonObtainMethod: React.FC<{
  name: string;
  pokemonId: number;
}> = React.memo(({ name, pokemonId }) => {
  const pokemonThemeContext = useContext(PokemonThemeContext);

  const { data: pokemonSpeciesData, isLoading: isFetchingSpecies } = useQuery(
    ["pokemon-species", name],
    () => fetchPokemonSpecies(name),
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: pokemonEvolutionData,
    refetch: fetchPokemonEvolutionData,
    isLoading: isFetchingEvolution,
  } = useQuery(
    ["evolution-chain", name],
    () => fetchEvolutionChain(pokemonSpeciesData.evolution_chain.url),
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (pokemonSpeciesData) fetchPokemonEvolutionData();
  }, [pokemonSpeciesData]);

  if (!pokemonEvolutionData) {
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

  const obtainMethods = pokemonHelper.makeObtainMethods({
    name,
    pokemonEvolutionData,
    pokemonSpeciesData,
  });

  return (
    <CardWrapper
      header={
        <div className="flex items-start gap-2">
          <IoIosCheckmarkCircle className={`text-3xl ${pokemonThemeContext}`} />
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">How to Obtain</h3>
            <ul className="flex flex-col list-disc list-inside">
              {obtainMethods.map((method, index) => (
                <li key={index} className="text-sm">
                  {method}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    />
  );
});

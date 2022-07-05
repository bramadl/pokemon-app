import { UseQueryResult } from "react-query";

import { ElementKey } from "./pokemon.types";

import {
  ChainLink,
  EvolutionChain,
} from "../../interfaces/pokeapi";

import { recursiveFinding, uniqueArray } from "../../utils/arrays";
import { stringifySlug } from "../../utils/strings";

const pokemonHelper = {
  MAX_CATCH_RATE: 255,

  makeCaptureRate: (data: any) => {
    const { capture_rate } = data;
    const captureRate = Math.round(
      (100 / pokemonHelper.MAX_CATCH_RATE) * capture_rate
    );

    return captureRate;
  },

  makeDamageSets: (
    queries: UseQueryResult<any, unknown>[]
  ): { name: ElementKey; power: number }[] => {
    const queriesData = queries.map((query) => query.data);
    const damageRelations = queriesData.map((data) => data.damage_relations);

    let damageMapper: {
      name: ElementKey;
      power: number;
    }[] = uniqueArray([
      ...damageRelations
        .map((relation) =>
          relation.double_damage_from.map((damage: any) => ({
            name: damage.name,
            power: 2,
          }))
        )
        .flat(1),
      ...damageRelations
        .map((relation) =>
          relation.half_damage_from.map((damage: any) => ({
            name: damage.name,
            power: 0.5,
          }))
        )
        .flat(1),
    ]);

    const damageSets: { name: ElementKey; power: number }[] = damageMapper
      .map((damage, index, array) => {
        const otherDamage = array.find(
          (item) => item.name === damage.name && item.power !== damage.power
        );

        if (otherDamage) {
          const resolvedDamage = {
            name: otherDamage.name,
            power: otherDamage.power * damage.power,
          };

          return resolvedDamage;
        }

        return damage;
      })
      .filter((damage) => damage.power !== 1);

    return damageSets;
  },

  makeEffects: (queries: UseQueryResult<any, unknown>[]) => {
    const abilitiesData = queries.map((query) => query.data);
    const effects = abilitiesData.map((data) => ({
      name: data.name,
      effect: data.effect_entries.find(
        (entry: {
          effect: string;
          language: {
            name: string;
          };
        }) => entry.language.name === "en"
      )?.effect,
    }));

    return effects;
  },

  makeEggs: (data: any) => {
    const { egg_groups, hatch_counter } = data;
    const hatchCounter = 255 * (hatch_counter + 1);
    const eggGroups: { name: string }[] = egg_groups.map((egg: any) => ({
      name: egg.name,
    }));

    return {
      hatchCounter,
      eggGroups,
    };
  },

  makeGenderRatios: (data: any) => {
    let femaleRatio = (data.gender_rate / 8) * 100;
    let maleRatio = 100 - femaleRatio;

    if (data.gender_rate === -1) {
      femaleRatio = 0;
      maleRatio = 0;
    }

    return {
      femaleRatio,
      maleRatio,
    };
  },

  makeObtainMethods: ({
    pokemonSpeciesData,
    pokemonEvolutionData,
    name,
  }: {
    pokemonSpeciesData: any;
    pokemonEvolutionData: EvolutionChain;
    name: string;
  }) => {
    const obtainMethods: React.ReactNode[] = [];
    const isBasePokemon = !pokemonSpeciesData.evolves_from_species;

    if (isBasePokemon) {
      obtainMethods.push(
        <span className="text-white/50">This is a Base Stage pokémon</span>
      );
    } else {
      const currentPokemon = recursiveFinding(
        name,
        pokemonEvolutionData.chain as ChainLink
      );

      const previousEvolution = pokemonSpeciesData.evolves_from_species.name;
      const currentEvolution = currentPokemon.species.name;

      console.log("Current pokemon evolution detail: ", { currentPokemon });

      const listOfObtainMethods = currentPokemon.evolution_details.map(
        (evolution) => {
          let tempObtainMethod: React.ReactNode;
          const triggerName = evolution.trigger.name;

          switch (triggerName) {
            case "shed":
              tempObtainMethod = (
                <span>
                  <span className="font-bold capitalize">
                    {stringifySlug(previousEvolution)}
                  </span>{" "}
                  reaches level 20 and you have a spare slot in your party and a
                  Poké Ball in your bag
                </span>
              );

              if (evolution.held_item) {
                tempObtainMethod = (
                  <span>
                    Trade{" "}
                    <span className="font-bold capitalize">
                      {stringifySlug(previousEvolution)}
                    </span>{" "}
                    holding a{" "}
                    <span className="font-bold capitalize underline">
                      {stringifySlug(evolution.held_item.name)}
                    </span>
                  </span>
                );
              }
              break;

            case "trade":
              tempObtainMethod = (
                <span>
                  Trade{" "}
                  <span className="font-bold capitalize">
                    {stringifySlug(previousEvolution)}
                  </span>
                </span>
              );

              if (evolution.held_item) {
                tempObtainMethod = (
                  <span>
                    Trade{" "}
                    <span className="font-bold capitalize">
                      {stringifySlug(previousEvolution)}
                    </span>{" "}
                    holding a{" "}
                    <span className="font-bold capitalize underline">
                      {stringifySlug(evolution.held_item.name)}
                    </span>
                  </span>
                );
              }
              break;

            case "use-item":
              tempObtainMethod = (
                <span>
                  Use a{" "}
                  <span className="font-bold capitalize">
                    {stringifySlug(evolution.item.name)}
                  </span>{" "}
                  on{" "}
                  <span className="font-bold capitalize">
                    {stringifySlug(previousEvolution)}
                  </span>
                </span>
              );
              break;

            case "level-up":
              if (evolution.min_level) {
                tempObtainMethod = (
                  <span>
                    <span className="font-bold capitalize">
                      {stringifySlug(previousEvolution)}
                    </span>{" "}
                    reaches level{" "}
                    <span className="font-bold">{evolution.min_level}</span>
                  </span>
                );
              }

              if (evolution.min_level && evolution.time_of_day) {
                tempObtainMethod = (
                  <span>
                    Level up{" "}
                    <span className="font-bold capitalize">
                      {stringifySlug(previousEvolution)}
                    </span>{" "}
                    during{" "}
                    <span className="font-bold">{evolution.time_of_day}</span>
                  </span>
                );
              }

              if (evolution.min_happiness) {
                tempObtainMethod = (
                  <span>
                    Level up{" "}
                    <span className="font-bold capitalize">
                      {stringifySlug(previousEvolution)}
                    </span>{" "}
                    with high{" "}
                    <span className="font-bold underline">friendship</span>
                  </span>
                );
              }

              if (evolution.min_beauty) {
                tempObtainMethod = (
                  <span>
                    Level up{" "}
                    <span className="font-bold capitalize">
                      {stringifySlug(previousEvolution)}
                    </span>{" "}
                    with minimum happiness of{" "}
                    <span className="font-bold underline">
                      {evolution.min_beauty}
                    </span>
                  </span>
                );
              }

              if (evolution.held_item && evolution.time_of_day) {
                tempObtainMethod = (
                  <span>
                    Level up{" "}
                    <span className="font-bold capitalize">
                      {stringifySlug(previousEvolution)}
                    </span>{" "}
                    holding an{" "}
                    <span className="font-bold underline">
                      {evolution.held_item.name}
                    </span>{" "}
                    during the {evolution.time_of_day}
                  </span>
                );
              }

              if (evolution.known_move) {
                tempObtainMethod = (
                  <span>
                    Level up{" "}
                    <span className="font-bold capitalize">
                      {stringifySlug(currentEvolution)}
                    </span>{" "}
                    knowing the move{" "}
                    <span className="font-bold underline capitalize">
                      {evolution.known_move.name}
                    </span>
                  </span>
                );
              }
              break;
          }

          return tempObtainMethod;
        }
      );

      obtainMethods.push(...listOfObtainMethods);
    }

    return obtainMethods;
  },

  transformPower: (power: number) => (power === 2 ? "2x" : "1/2x"),
};

export default pokemonHelper;

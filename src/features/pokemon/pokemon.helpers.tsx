import { UseQueryResult } from "react-query";

import { ElementKey } from "./pokemon.types";

import {
	ChainLink,
	EvolutionChain,
	EvolutionDetail,
} from "../../interfaces/pokeapi";

import { recursiveFinding, uniqueArray } from "../../utils/arrays";
import { shouldUse, stringifySlug } from "../../utils/strings";
import React from "react";

const pokemonHelper = {
	MAX_CATCH_RATE: 255,

	recursivelyFindSprite: (sprites: any) => {
		const allNonNullSprites: { [index: string]: string }[] = [];

		const innerRecursiveFn = (sprites: any) => {
			for (const key in sprites) {
				if (sprites[key] !== null && typeof sprites[key] === "string") {
					allNonNullSprites.push({ [key]: sprites[key] });
				} else {
					if (sprites[key] !== null) {
						innerRecursiveFn(sprites[key]);
					}
				}
			}
		};

		innerRecursiveFn(sprites);

		const prefferedSprites = allNonNullSprites
			.map((sprite) => sprite.front_default)
			.filter((sprite) => sprite !== undefined);

		const homeDefault = prefferedSprites.filter((sprite) =>
			sprite.includes("other/home")
		)[0];
		const firstDefault = prefferedSprites[0];
		const artworkDefault = prefferedSprites.filter((sprite) =>
			sprite.includes("other/official-artwork")
		)[0];
		const fallbackDefault = prefferedSprites[0];

		return homeDefault || firstDefault || artworkDefault || fallbackDefault;
	},

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

			const listOfObtainMethods = currentPokemon.evolution_details.map(
				(evolution) => {
					return parseEvolutionDetail(evolution, {
						currentEvolution,
						previousEvolution,
					});
				}
			);

			obtainMethods.push(...listOfObtainMethods);
		}

		return obtainMethods;
	},

	transformPower: (power: number) => (power === 2 ? "2x" : "1/2x"),
};

export const parseEvolutionDetail = (
	evolution: EvolutionDetail,
	{
		currentEvolution,
		previousEvolution,
	}: { currentEvolution: any; previousEvolution: any }
): React.ReactNode => {
	const triggerName = evolution.trigger.name;

	let tempObtainMethod: React.ReactNode;

	switch (triggerName) {
		case "tower-of-waters":
			tempObtainMethod = (
				<span>
					Train in the{" "}
					<span className="font-bold capitalize">Tower Of Waters</span>
				</span>
			);
			break;

		case "tower-of-darkness":
			tempObtainMethod = (
				<span>
					Train in the{" "}
					<span className="font-bold capitalize">Tower Of Darkness</span>
				</span>
			);
			break;

		case "shed":
			tempObtainMethod = (
				<span>
					<span className="font-bold capitalize">
						{stringifySlug(previousEvolution)}
					</span>{" "}
					reaches level 20 and you have a spare slot in your party and a Poké
					Ball in your bag
				</span>
			);

			if (evolution.held_item) {
				tempObtainMethod = (
					<span>
						Trade{" "}
						<span className="font-bold capitalize">
							{stringifySlug(previousEvolution)}
						</span>{" "}
						holding {shouldUse(evolution.held_item.name)}{" "}
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
						holding {shouldUse(evolution.held_item.name)}{" "}
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
					Use {shouldUse(evolution.item.name)}{" "}
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
						during <span className="font-bold">{evolution.time_of_day}</span>
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
						with high <span className="font-bold underline">friendship</span>
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
						<span className="font-bold underline">{evolution.min_beauty}</span>
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
						holding {shouldUse(evolution.held_item.name)}{" "}
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
};

export default pokemonHelper;

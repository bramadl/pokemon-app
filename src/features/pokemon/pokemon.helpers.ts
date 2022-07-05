import { UseQueryResult } from "react-query";

import { ElementKey } from "./pokemon.types";

import { uniqueArray } from "../../utils/arrays";
import { fetchEgg } from "../../api/fetchEgg";

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

	transformPower: (power: number) => (power === 2 ? "2x" : "1/2x"),
};

export default pokemonHelper;

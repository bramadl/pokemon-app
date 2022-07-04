import React from "react";
import { BsStarFill } from "react-icons/bs";
import { useQueries } from "react-query";

import { fetchTypeByUrl } from "../../api/fetchType";

import { Card } from "../../components/Card";
import { elements } from "./pokemon.elements";
import { sprites } from "./pokemon.sprites";

import { ElementKey } from "./pokemon.types";
import { PokemonTypeDetail } from "./PokemonTypeDetail";

export const PokemonTypeEffectiveness: React.FC<{
	types: {
		type: {
			name: ElementKey;
			url: string;
		};
	}[];
}> = React.memo(({ types }) => {
	const queries = useQueries(
		types.map(({ type: { url } }) => {
			return {
				queryKey: ["pokemon", url],
				queryFn: () => fetchTypeByUrl(url),
				refetchOnWindowFocus: false,
			};
		})
	);

	if (queries.some((query) => query.isLoading)) return null;

	const queriesData = queries.map((query) => query.data);
	const damageRelations = queriesData.map((data) => data.damage_relations);

  const uniqueArray = (a: any[]) => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));
  const transformPower = (power: number) => power === 2 ? "2x" : "1/2x";

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
      .flat(1)
	]);

	const damageSets: { name: ElementKey, power: number }[] = damageMapper.map((damage, index, array) => {
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
	}).filter((damage) => damage.power !== 1);

	return (
		<Card
			id="abilitiesAndEffectSection"
			header={
				<div className="flex items-center gap-2">
					<BsStarFill className="text-3xl text-green-400" />
					<h3 className="text-lg font-semibold">Type Effectiveness</h3>
				</div>
			}
		>
			<ul className="flex flex-wrap gap-2">
				{damageSets.map((damage) => (
					<li
						key={damage.name}
						className={`flex items-center gap-1 py-1.5 px-3 rounded ${
							elements[damage.name].backgroundClass
						}`}
					>
						<PokemonTypeDetail
              color={elements[damage.name].textClass}
              name={damage.name}
              sprite={sprites[damage.name]}
              power={transformPower(damage.power)}
            />
					</li>
				))}
			</ul>
		</Card>
	);
});

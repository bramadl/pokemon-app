import React from "react";
import { BsStarFill } from "react-icons/bs";
import { useQueries } from "react-query";
import { ClipLoader } from "react-spinners";

import { fetchTypeByUrl } from "../../api/fetchType";

import { Card } from "../../components/Card";

import pokemonHelper from "./pokemon.helpers";

import { elements } from "./pokemon.elements";
import { sprites } from "./pokemon.sprites";
import { ElementKey } from "./pokemon.types";
import { PokemonTypeDetail } from "./PokemonTypeDetail";

type TypeProps = {
	type: {
		name: ElementKey;
		url: string;
	};
};

const CardWrapper: React.FC<{
	children: React.ReactNode | React.ReactFragment;
}> = ({ children }) => {
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
			{children}
		</Card>
	);
};

export const PokemonTypeEffectiveness: React.FC<{ types: TypeProps[] }> =
	React.memo(({ types }) => {
		const queries = useQueries(
			types.map(({ type: { url } }) => {
				return {
					queryKey: ["pokemon", url],
					queryFn: () => fetchTypeByUrl(url),
					refetchOnWindowFocus: false,
				};
			})
		);

		if (queries.some((query) => query.isLoading)) {
			return (
				<CardWrapper>
					<div className="flex items-center justify-center">
						<ClipLoader color="#FFFFFF" />
					</div>
				</CardWrapper>
			);
		}

		const damageSets = pokemonHelper.makeDamageSets(queries);

		return (
			<CardWrapper>
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
								power={pokemonHelper.transformPower(damage.power)}
							/>
						</li>
					))}
				</ul>
			</CardWrapper>
		);
	});

import React, { useContext } from "react";
import { BsStarFill } from "react-icons/bs";
import { useQueries } from "react-query";
import { ClipLoader } from "react-spinners";
import ReactTooltip from "react-tooltip";

import { fetchTypeByUrl } from "../../api/fetchType";

import { Card } from "../../components/Card";

import pokemonHelper from "./pokemon.helpers";

import { elements } from "./pokemon.elements";
import { sprites } from "./pokemon.sprites";
import { ElementKey } from "./pokemon.types";
import { PokemonThemeContext } from "./PokemonDetail";

type TypeProps = {
	type: {
		name: ElementKey;
		url: string;
	};
};

const CardWrapper: React.FC<{
	children: React.ReactNode | React.ReactFragment;
}> = ({ children }) => {
	const pokemonThemeContext = useContext(PokemonThemeContext);

	return (
		<Card
			id="abilitiesAndEffectSection"
			header={
				<div className="flex items-center gap-2">
					<BsStarFill className={`text-3xl ${pokemonThemeContext}`} />
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
						<>
							<li
								key={damage.name}
								className={`flex items-center gap-1 py-1.5 px-3 rounded ${
									elements[damage.name].backgroundClass
								}`}
								data-for={damage.name}
								data-tip
							>
								<img
									alt={damage.name}
									className="w-6 h-6 rounded-full object-cover"
									src={sprites[damage.name]}
								/>
								<span
									className={`font-semibold ${elements[damage.name].textClass}`}
								>
									{pokemonHelper.transformPower(damage.power)}
								</span>
							</li>
							<ReactTooltip
								id={damage.name}
								backgroundColor="#000000"
								arrowColor="#000000"
								effect="solid"
								multiline
							>
								<p>
									Received{" "}
									<strong>{pokemonHelper.transformPower(damage.power)}</strong>{" "}
									damage <br /> from{" "}
									<span className={elements[damage.name].textClass}>
										{damage.name}
									</span>{" "}
									type
								</p>
							</ReactTooltip>
						</>
					))}
				</ul>
			</CardWrapper>
		);
	});

{
	/* <p data-tip="<p>HTML tooltip</p>" data-html={true}></p> or <ReactTooltip html={true} />, but see Security Note below. */
}

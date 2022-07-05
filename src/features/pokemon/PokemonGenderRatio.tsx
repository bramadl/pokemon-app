import React, { useContext } from "react";
import { IoIosFemale, IoIosMale } from "react-icons/io";
import { RiPieChartFill } from "react-icons/ri";
import { useQuery } from "react-query";
import { ClipLoader } from "react-spinners";

import { fetchPokemonSpecies } from "../../api/fetchPokemon";

import { Card } from "../../components/Card";
import { stringifySlug } from "../../utils/strings";
import pokemonHelper from "./pokemon.helpers";
import { PokemonThemeContext } from "./PokemonDetail";

const CardWrapper: React.FC<{
	header: React.ReactNode | React.ReactFragment;
}> = ({ header }) => {
	return <Card id="carchRateSection" header={header} />;
};

export const PokemonGenderRatio: React.FC<{ name: string }> = React.memo(
	({ name }) => {
		const pokemonThemeContext = useContext(PokemonThemeContext);

		const { data, isLoading } = useQuery(
			["pokemon-species", name],
			() => fetchPokemonSpecies(name),
			{
				refetchOnWindowFocus: false,
			}
		);

		if (isLoading) {
			return (
				<CardWrapper
					header={
						<div className="w-full flex items-center justify-center">
							<ClipLoader color="#FFFFFF" />
						</div>
					}
				/>
			);
		}

		const { maleRatio, femaleRatio } = pokemonHelper.makeGenderRatios(data);
		const isGenderless = !(maleRatio > 0 && femaleRatio > 0);

		return (
			<CardWrapper
				header={
					<React.Fragment>
						<div className="flex items-center gap-2">
							<RiPieChartFill className={`text-3xl ${pokemonThemeContext}`} />
							<h3
								className={`text-lg font-semibold ${
									isGenderless ? "capitalize" : ""
								}`}
							>
								{isGenderless
									? `${stringifySlug(name)} is genderless`
									: "Gender Ratio"}
							</h3>
						</div>

						{!isGenderless && (
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2 text-blue-400">
									<IoIosMale className="text-2xl" />
									<span className="font-semibold">{maleRatio}%</span>
								</div>
								<div className="flex items-center gap-2 text-pink-400">
									<IoIosFemale className="text-2xl" />
									<span className="font-semibold">{femaleRatio}%</span>
								</div>
							</div>
						)}
					</React.Fragment>
				}
			/>
		);
	}
);

import React from "react";
import { IoIosFemale, IoIosMale } from "react-icons/io";
import { RiPieChartFill } from "react-icons/ri";
import { useQuery } from "react-query";

import { fetchPokemonSpecies } from "../../api/fetchPokemon";

import { Card } from "../../components/Card";

export const PokemonGenderRatio: React.FC<{ name: string }> = ({ name }) => {
  const { data, isLoading } = useQuery(["pokemon-species", name], () => fetchPokemonSpecies(name), {
    refetchOnWindowFocus: false,
  });

  if (isLoading) return null;

  const femaleRatio = (data.gender_rate / 8) * 100;
  const maleRatio = 100 - femaleRatio;

	return (
		<Card
			id="catchRateSection"
			header={
				<React.Fragment>
					<div className="flex items-center gap-2">
						<RiPieChartFill className="text-3xl text-green-400" />
						<h3 className="text-lg font-semibold">Gender Ratio</h3>
					</div>

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
				</React.Fragment>
			}
		/>
	);
};

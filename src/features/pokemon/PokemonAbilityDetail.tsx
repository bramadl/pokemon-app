import React from "react";
import { useQuery } from "react-query";

import { fetchAbilityByUrl } from "../../api/fetchAbilities";

export const PokemonAbilityDetail: React.FC<{
	name: string;
	effect: string;
}> = ({ name, effect }) => {
	return (
		<React.Fragment>
			<h4 className="font-medium text-lg capitalize">{name}</h4>
			<p className="mt-2 text-white/80">{effect}</p>
		</React.Fragment>
	);
};

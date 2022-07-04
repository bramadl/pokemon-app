import React from "react";

export const PokemonTypeDetail: React.FC<{
	color: string;
	name: string;
	sprite: string;
	power: string;
}> = ({ color, name, sprite, power }) => {
	return (
		<React.Fragment>
			<img
				alt={name}
				className="w-6 h-6 rounded-full object-cover"
				src={sprite}
			/>
			<span className={`font-semibold ${color}`}>{power}</span>
		</React.Fragment>
	);
};

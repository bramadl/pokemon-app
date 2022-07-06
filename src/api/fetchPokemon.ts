import axios from "axios";

export const fetchPokemon = async ({ pageParam = 0 }): Promise<any> => {
	const endpoint = `https://pokeapi.co/api/v2/pokemon?offset=${pageParam}&limit=1200`;
	const { data } = await axios.get(endpoint);
	return data;
};

export const fetchPokemonByUrl = async (url: string): Promise<any> => {
	const { data } = await axios.get(url);
	return data;
};

export const fetchPokemonByName = async (name: string): Promise<any> => {
	const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
	return data;
};

export const fetchPokemonSpecies = async (name: string): Promise<any> => {
	const { data } = await axios.get(
		`https://pokeapi.co/api/v2/pokemon-species/${name}`
	);
	return data;
};

export const fetchPokemonSpeciesByUrl = async (url: string): Promise<any> => {
	const { data } = await axios.get(url);
	return data;
};

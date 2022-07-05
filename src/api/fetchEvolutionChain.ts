import axios from "axios";

export const fetchEvolutionChain = async (url: string) => {
	const { data } = await axios.get(url);
	return data;
};

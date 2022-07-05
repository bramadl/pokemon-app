import axios from "axios";

export const fetchEgg = async (url: string) => {
	const { data } = await axios.get(url);
	return data;
};

import axios from "axios";

const BASE_URL: string = "https://pokeapi.co/api/v2/";

export const fetchAbilityByUrl = async (url: string): Promise<any> => {
  const { data } = await axios.get(url);
  return data;
};

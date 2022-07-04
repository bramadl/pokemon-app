import axios from "axios";

export const fetchTypeByUrl = async (url: string): Promise<any> => {
  const { data } = await axios.get(url);
  return data;
};

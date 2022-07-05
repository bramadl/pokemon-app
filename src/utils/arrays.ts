import { ChainLink } from "../interfaces/pokeapi";

export const uniqueArray = (a: any[]) =>
  [...new Set(a.map((o) => JSON.stringify(o)))].map((s) => JSON.parse(s));

export const recursiveFinding = (
  keyFinding: string,
  chain: ChainLink
): ChainLink => {
  const tryFind = chain.species.name === keyFinding;

  if (!tryFind) {
    const findAll = chain.evolves_to
      .map((evolution) => {
        return recursiveFinding(keyFinding, evolution);
      })
      .filter((found) => found);

    return findAll.find(
      (found) => found.species.name === keyFinding
    ) as ChainLink;
  } else {
    return chain;
  }
};

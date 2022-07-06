export type EvolutionChain = {
  id: number;
  chain: ChainLink;
};

export type ChainLink = {
  species: PokemonSpecies;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export type PokemonSpecies = {
  name: string;
  url: string;
};

export type EvolutionDetail = {
  item: {
    name: string;
  };
  trigger: {
    name: string;
  };
  gender: number;
  held_item: {
    name: string;
  };
  known_move: {
    name: string;
  };
  min_beauty: number;
  min_level: number;
  min_happiness: number;
  time_of_day: string;
};
export type PokemonGame = {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
};

export type PokemonPage = {
  count: number;
  next: string;
  prev: string;
  results: PokemonPageResult[];
};

export type PokemonPageResult = {
  name: string;
  url: string;
};

export type Pokemon = {
  id: number;
  name: string;
  sprite: string;
  types: PokemonSprite[];
};

export type PokemonSprite = {
  name: ElementKey;
};

export type ElementKey =
  | "bug"
  | "dark"
  | "dragon"
  | "electric"
  | "fairy"
  | "fighting"
  | "fire"
  | "flying"
  | "ghost"
  | "grass"
  | "ground"
  | "ice"
  | "normal"
  | "poison"
  | "psychic"
  | "rock"
  | "water"
  | "steel";

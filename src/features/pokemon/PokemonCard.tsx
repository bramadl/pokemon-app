import { IoChevronForwardOutline } from "react-icons/io5"
import { NavLink } from "react-router-dom";
import { stringifySlug } from "../../utils/strings";
import { sprites } from "./pokemon.sprites";
import { PokemonSprite } from "./pokemon.types";

export const PokemonCard: React.FC<{
  pokedex: string;
  name: string;
  sprite: string;
  types: PokemonSprite[];
}> = ({ pokedex, name, sprite, types }) => {
	return (
    <NavLink
      className="flex items-center justify-between gap-2 xl:gap-4 py-4 px-4 xl:px-8 border-b last:border-b-0 border-white/10 hover:bg-white/5"
      to={`/pokemon?preview=${name}`}
    >
      <figure className="flex-shrink-0">
        <img
          alt={name}
          className="w-10 h-10 xl:w-12 xl:h-12 object-cover"
          src={sprite}
        />
      </figure>

      <div className="flex-1">
        <span className="text-xs text-white/50">{pokedex}</span>
        <h2 className="capitalize">{stringifySlug(name)}</h2>
        <div className="flex items-center gap-1">
          {types.map((type) => (
            <img
              key={type.name}
              alt={type.name}
              className="w-5 h-5 object-cover"
              src={sprites[type.name]}
            />
          ))}
        </div>
      </div>

      <button className="xl:opacity-0 xl:pointer-events-none">
        <IoChevronForwardOutline className="text-xl xl:text-2xl text-white/50" />
      </button>
    </NavLink>
  );
};

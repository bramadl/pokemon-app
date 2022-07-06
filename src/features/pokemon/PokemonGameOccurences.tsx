import React, { useContext } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { RiGamepadFill } from "react-icons/ri";

import { PokemonThemeContext } from "./PokemonDetail";
import { IoChevronForwardSharp } from "react-icons/io5";
import { PokemonGame } from "./pokemon.types";
import { GameName, pokemonGames } from "./pokemon.games";

export const PokemonGameOccurences: React.FC<{
  gameIndices: PokemonGame[];
}> = React.memo(({ gameIndices }) => {
  const pokemonThemeContext = useContext(PokemonThemeContext);

  return (
    <div className="w-full h-auto rounded-lg bg-dark-200 transition-all ease-out duration-300">
      <Disclosure>
        {({ open }) => (
          <React.Fragment>
            <Disclosure.Button
              className={`w-full flex items-center justify-between gap-4 p-4 border-b ${
                open ? "border-white/10" : "border-transparent"
              } transition ease-out duration-300`}
            >
              <div className="flex items-center gap-2">
                <RiGamepadFill className={`text-3xl ${pokemonThemeContext}`} />
                <span className="text-base font-semibold">
                  {!!gameIndices.length ? (
                    <>Available in {gameIndices.length} games</>
                  ) : (
                    <>No game indices at the moment</>
                  )}
                </span>
              </div>

              <IoChevronForwardSharp
                className={`text-2xl text-white/50 ${
                  open ? "rotate-90" : ""
                } transition ease-out duration-300`}
              />
            </Disclosure.Button>

            <div className="overflow-hidden">
              <Transition
                enter="transition duration-300 ease-out"
                enterFrom="transform -translate-y-4 opacity-0"
                enterTo="transform translate-y-0 opacity-100"
                leave="transition duration-300 ease-in"
                leaveFrom="transform translate-y-0 opacity-100"
                leaveTo="transform -translate-y-4 opacity-0"
              >
                <Disclosure.Panel className={"flex flex-wrap gap-2 p-4"}>
                  {!!gameIndices.length && gameIndices.map((game) => (
                    <img
                      alt={pokemonGames[game.version.name as GameName].name}
                      className="w-16 h-16 object-cover rounded "
                      src={
                        pokemonGames[game.version.name as GameName].thumbnail
                      }
                    />
                  ))}
                  {!gameIndices.length && (
                    <p className="text-sm text-white/50 italic">This pokemon are not available in any game currently...</p>
                  )}
                </Disclosure.Panel>
              </Transition>
            </div>
          </React.Fragment>
        )}
      </Disclosure>
    </div>
  );
});

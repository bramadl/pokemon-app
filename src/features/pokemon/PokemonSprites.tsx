import React, { Fragment, useContext, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaImage } from "react-icons/fa";

import { Card } from "../../components/Card";
import { PokemonThemeContext } from "./PokemonDetail";

const CardHeader: React.FC<{
  children: React.ReactNode | React.ReactFragment;
}> = ({ children }) => {
  const pokemonThemeContext = useContext(PokemonThemeContext);

  return (
    <Card
      id="evolutionLineSection"
      header={
        <div className="flex items-center gap-2">
          <FaImage className={`text-3xl ${pokemonThemeContext}`} />
          <h3 className="text-base font-bold">Sprites</h3>
        </div>
      }
    >
      {children}
    </Card>
  );
};

const SpriteModal: React.FC<{ thumbnail: string; text: string }> = ({
  text,
  thumbnail,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="block"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <figure className="w-16 h-16 flex items-center justify-center bg-white/10 hover:bg-white/5 rounded-full transition ease-out duration-300">
          <img alt="Front Default" className="w-16 h-16" src={thumbnail} />
        </figure>
        <p className="text-xs text-center">{text}</p>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-3xl" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel>
                  <img alt="Front Default" className="w-80 h-80" src={thumbnail} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export const PokemonSprites: React.FC<{
  sprites: { other: { home: { front_default: string; front_shiny: string } } };
}> = React.memo(({ sprites }) => {
  const { front_default, front_shiny } = sprites.other.home;

  return (
    <CardHeader>
      <div className="flex items-center justify-evenly">
        <SpriteModal text="Regular" thumbnail={front_default} />
        <SpriteModal text="Shiny" thumbnail={front_shiny} />
      </div>
    </CardHeader>
  );
});

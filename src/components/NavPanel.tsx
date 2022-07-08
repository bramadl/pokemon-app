import React from "react";
import { BsStarFill } from "react-icons/bs";
import { IoMdCog } from "react-icons/io";
import { MdCatchingPokemon } from "react-icons/md";
import { NavLink } from "react-router-dom";

export const NavPanel = () => {
	return (
		<nav className="h-20 flex items-center justify-between gap-6 py-1 px-4 xl:px-8 border-t border-white/10">
			<NavItem
				icon={<MdCatchingPokemon className="text-2xl" />}
				text={"Pokémon"}
				to={"/pokemon"}
			/>
			<NavItem
				as="button"
				disabled
				icon={<BsStarFill className="text-2xl" />}
				text={"Types"}
			/>
			<NavItem
				as="button"
				disabled
				icon={<IoMdCog className="text-2xl" />}
				text={"Settings"}
			/>
		</nav>
	);
};

const NavItem: React.FC<{
	as?: "button" | "link";
	disabled?: boolean;
	icon: React.ReactNode;
	text: string;
	to?: string;
}> = ({ as, disabled, icon, text, to }) => {
	if (as === "button") {
		return (
			<button
				className={`w-20 h-full flex flex-col items-center disabled:text-white/25 disabled:cursor-not-allowed justify-center gap-2 rounded-md`}
				disabled={disabled}
			>
				{icon}
				<span className="text-sm">{text}</span>
			</button>
		);
	}

	return (
		<NavLink
			className={({ isActive }) =>
				`w-20 h-full flex flex-col items-center justify-center gap-2 rounded-md ${
					isActive ? "text-danger-100" : "text-white/25 hover:bg-white/5"
				}`
			}
			to={to!}
		>
			{icon}
			<span className="text-sm">{text}</span>
		</NavLink>
	);
};

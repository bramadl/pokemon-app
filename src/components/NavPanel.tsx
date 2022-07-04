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
				icon={<BsStarFill className="text-2xl" />}
				text={"Types"}
				to={"/types"}
			/>
			<NavItem
				icon={<IoMdCog className="text-2xl" />}
				text={"Settings"}
				to={"/settings"}
			/>
		</nav>
	);
};

const NavItem: React.FC<{
	icon: React.ReactNode;
	text: string;
	to: string;
}> = ({ icon, text, to }) => {
	return (
		<NavLink
			className={({ isActive }) =>
				`w-20 h-full flex flex-col items-center justify-center gap-2 rounded-md ${
					isActive ? "text-danger-100" : "text-white/25 hover:bg-white/5"
				}`
			}
			to={to}
		>
			{icon}
			<span className="text-sm">{text}</span>
		</NavLink>
	);
};

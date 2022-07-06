import React from "react";
import { NavPanel } from "./NavPanel";

export const AsidePanel: React.FC<{
	children: React.ReactNode;
	headerPanel: React.ReactNode;
}> = ({ children, headerPanel }) => {
	return (
		<aside className="w-full md:w-72 lg:w-96 2xl:w-[420px] h-screen flex flex-col justify-between bg-dark-200 md:border-r border-white/10 overflow-hidden">
			<header className="flex items-center justify-between gap-6 py-4 px-4 xl:px-8 border-b border-white/10">
				{headerPanel}
			</header>

			<section className="flex-1 overflow-auto">
				{children}
			</section>

			<NavPanel />
		</aside>
	);
};

import React from "react";

export const Card: React.FC<{
  id: string;
  children: React.ReactNode;
  header: React.ReactNode | React.ReactFragment;
}> = ({ id, header, children }) => {
	return (
		<section
			id={id}
			className="w-full h-auto rounded-lg bg-dark-200"
		>
			<header className="flex items-center justify-between gap-4 p-4 border-b border-white/10">
				{header}
			</header>

			<div className="p-4">
				{children}
			</div>
		</section>
	);
};

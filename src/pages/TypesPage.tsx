import { AsidePanel } from "../components/AsidePanel";
import { MainPanel } from "../components/MainPanel";

export const TypesPage = () => {
	return (
		<div id="typesPage" className="w-full h-screen flex overflow-hidden">
			<AsidePanel headerPanel={<TypesPageHeader />}>Types Page</AsidePanel>
			<MainPanel />
		</div>
	);
};

const TypesPageHeader = () => {
	const hasFilter = false;

	return (
		<>
			<h1 className="font-bold text-xl">Types</h1>
			{hasFilter && (
				<button className="hover:bg-danger-100/10 text-danger-100 py-1.5 px-3 rounded transition ease-out duration-300">
					Reset
				</button>
			)}
		</>
	);
};

import { AsidePanel } from "../components/AsidePanel";
import { MainPanel } from "../components/MainPanel";

export const SettingsPage = () => {
	return (
		<div id="settingsPage" className="w-full h-screen flex overflow-hidden">
			<AsidePanel headerPanel={<SettingsPageHeader />}>
				Settings Page
			</AsidePanel>
			<MainPanel />
		</div>
	);
};

const SettingsPageHeader = () => {
	const hasChanges = false;

	return (
		<>
			<h1 className="font-bold text-xl">Settings</h1>
			{hasChanges && (
				<button className="hover:bg-danger-100/10 text-danger-100 py-1.5 px-3 rounded transition ease-out duration-300">
					Apply
				</button>
			)}
		</>
	);
};

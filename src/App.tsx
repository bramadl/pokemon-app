import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import { SettingsPage } from "./pages/SettingsPage";
import { TypesPage } from "./pages/TypesPage";

export const queryClient = new QueryClient();

function App() {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (location.pathname === "/") {
			navigate("/pokemon", { replace: true });
		}
	}, [location]);

	return (
    <QueryClientProvider client={queryClient}>
      <div className="relative w-full h-screen text-white bg-black overflow-hidden">
        <Routes>
          <Route path="/pokemon" element={<HomePage />}></Route>
          <Route path="/types" element={<TypesPage />}></Route>
          <Route path="/settings" element={<SettingsPage />}></Route>
        </Routes>
      </div>
    </QueryClientProvider>
	);
}

export default App;

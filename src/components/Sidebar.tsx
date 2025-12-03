import { NavLink } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function Sidebar({ sidebarOpen }: { sidebarOpen: boolean }) {
  const mode = useAppSelector(state => state.theme.mode);
  const dark = mode === "dark";

  return (
    <aside
      className={`
        transition-width duration-500 ease-in-out overflow-hidden flex flex-col border-r
        ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
        ${sidebarOpen ? "w-72 p-6" : "w-0 p-0"}
      `}
    >
      {/* Branding */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-black font-bold">
            A
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${dark ? "text-white" : "text-gray-400"}`}>
              JPL Auction
            </h2>
            <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}>
              Theme • {dark ? "Dark" : "Light"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">

          {/* Dashboard */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : dark
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `
              }
            >
              <span>🏠</span>
              <span className={`font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>Dashboard</span>
            </NavLink>
          </li>

          {/* Auction */}
          <li>
            <NavLink
              to="/auction"
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : dark
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `
              }
            >
              <span>⚡</span>
              <span className={`font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>Auction</span>
            </NavLink>
          </li>

          {/* Summary */}
          <li>
            <NavLink
              to="/summary"
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : dark
                    ? "text-gray-300 hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `
              }
            >
              <span>📊</span>
              <span className={`font-medium ${dark ? "text-gray-400" : "text-gray-600"}`}>Summary</span>
            </NavLink>
          </li>

        </ul>
      </nav>

      {/* Footer */}
      <footer className={`text-xs mt-6 ${dark ? "text-gray-400" : "text-gray-500"}`}>
        Built with ❤️
      </footer>
    </aside>
  );
}

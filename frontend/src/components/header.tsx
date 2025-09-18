import { Link, useLocation } from "react-router-dom";
import { ShieldIcon } from "./shield.icon";

const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b border-gray-300/50 bg-gradient-to-br from-indigo-50 to-blue-100 backdrop-blur-md shadow-lg shadow-blue-100/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Логотип та назва */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
            <span className="text-white font-bold">
              <ShieldIcon />
            </span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
            Superhero Database
          </span>
        </Link>

        {/* Навігація */}
        <nav className="flex items-center gap-8">
          <Link
            to="/"
            className={`relative px-4 py-2 font-medium rounded-lg transition-all duration-300 group ${
              location.pathname === "/"
                ? "text-blue-600 bg-blue-50 shadow-inner"
                : "text-blue-400/80 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600"
            }`}
          >
            Home
            <span
              className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                location.pathname === "/" ? "w-3/5" : "w-0 group-hover:w-0"
              }`}
            />
          </Link>

          <Link
            to="/create"
            className="relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 group overflow-hidden"
          >
            <span className="relative z-10">Add Hero</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

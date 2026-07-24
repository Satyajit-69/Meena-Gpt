import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Bot, LogOut } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 shadow-lg">
      {/* Logo */}
      <Link
        to="/landing-page"
        className="flex items-center gap-3 group"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
          <Bot className="w-6 h-6 text-white" />
        </div>

        <h1 className="text-xl font-bold text-white transition group-hover:text-blue-400">
          Meena <span className="text-blue-400">GPT</span>
        </h1>
      </Link>

      {/* Profile Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition"
      >
        {isAuthenticated ? (
          <span className="text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className="text-white font-semibold">?</span>
        )}
      </button>

      {/* Dropdown */}
      {isMenuOpen && (
        <div className="absolute right-6 top-16 w-56 overflow-hidden rounded-xl border border-gray-700 bg-gray-800 shadow-2xl z-50">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => handleNavigation("/login")}
                className="w-full px-4 py-3 text-left text-white hover:bg-gray-700 transition"
              >
                Login
              </button>

              <button
                onClick={() => handleNavigation("/register")}
                className="w-full px-4 py-3 text-left text-white border-t border-gray-700 hover:bg-gray-700 transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <div className="border-b border-gray-700 px-4 py-3">
                <p className="font-semibold text-white truncate">
                  {user?.name}
                </p>

                <p className="text-sm text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-red-400 hover:bg-gray-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
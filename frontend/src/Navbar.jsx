import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { Bot, LogOut, User } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="relative bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between shadow-lg">

      {/* Left Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>

        <h1 className="text-white text-lg font-bold">
          Meena <span className="text-blue-400">GPT</span>
        </h1>

        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold">
          mini
        </span>
      </div>

      {/* User Section */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 border border-gray-700 transition"
      >
        <User className="w-5 h-5 text-white" />
      </button>

      {/* Dropdown */}
      {isMenuOpen && (
        <div className="absolute right-6 top-16 w-52 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">

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
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-white font-semibold truncate">
                  {user?.name}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={() => {
                  logout();
                  handleNavigation("/login");
                }}
                className="w-full px-4 py-3 text-left flex items-center gap-2 text-red-400 hover:bg-gray-700 transition"
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
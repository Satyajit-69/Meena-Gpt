import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { ChevronDown, LogOut, User } from "lucide-react";

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
          <i className="fa-solid fa-robot text-white text-sm" />
        </div>
        <h1 className="text-white text-lg font-bold">Meena GPT</h1>
        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold">mini</span>
      </div>

      {/* User Section */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer hover:bg-gray-700 border border-gray-700"
      >
        <User className="text-white" size={18} />
      </button>

      {/* Dropdown */}
      {isMenuOpen && (
        <div className="absolute right-6 top-16 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fadeIn z-50">

          {!isAuthenticated ? (
            <>
              <button className="px-4 py-2 w-full text-left hover:bg-gray-700" onClick={() => handleNavigation("/login")}>
                Login
              </button>
              <button className="px-4 py-2 w-full text-left hover:bg-gray-700 border-t border-gray-700" onClick={() => handleNavigation("/register")}>
                Register
              </button>
            </>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-gray-700 text-gray-300">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-xs truncate">{user?.email}</p>
              </div>

              <button
                className="px-4 py-2 w-full text-left hover:bg-gray-700 flex items-center gap-2 text-red-400"
                onClick={() => {
                  logout();
                  handleNavigation("/login");
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

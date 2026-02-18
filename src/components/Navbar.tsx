import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cake, Sparkles, Package, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu & Gallery', path: '/menu' },
    { name: 'AI Cake Chef', path: '/ai-chef', icon: <Sparkles className="w-4 h-4 mr-1 inline" /> },
    { name: 'Custom Order', path: '/order' },
    { name: 'Track Order', path: '/track-order', icon: <Package className="w-4 h-4 mr-1 inline" /> },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Cake className="h-8 w-8 text-rose-500" />
              <span className="font-serif font-bold text-2xl text-gray-800">
                Samyra's <span className="text-rose-500">Yummy Cakes</span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(link.path)
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-gray-800 hover:text-rose-500 hover:bg-gray-50'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${isActive('/dashboard')
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    }`}
                >
                  <User className="w-4 h-4" />
                  My Orders
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all hover:shadow-md flex items-center gap-1.5"
              >
                <User className="w-4 h-4" /> Login
              </Link>
            )}
          </div>

          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-gray-800 hover:text-rose-500 hover:bg-gray-50'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth */}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-rose-100 text-rose-700 px-5 py-2 rounded-full text-sm font-bold mt-2"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="block w-full text-center text-gray-500 hover:text-red-500 px-5 py-2 text-sm font-medium mt-1"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center bg-rose-500 text-white px-5 py-2 rounded-full text-sm font-bold mt-2"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
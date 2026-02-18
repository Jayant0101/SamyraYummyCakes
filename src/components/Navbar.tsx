import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cake, Sparkles, Package, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { clsx } from 'clsx';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 20);
  });

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
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={clsx(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 py-2" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
              <Cake className="h-8 w-8 text-rose-500" />
            </motion.div>
            <span className="font-serif font-bold text-2xl text-gray-800 tracking-tight">
              Samyra's <span className="text-rose-500 group-hover:text-rose-600 transition-colors">Yummy Cakes</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  isActive(link.path)
                    ? "text-rose-600 bg-rose-50 font-semibold"
                    : "text-gray-600 hover:text-rose-600 hover:bg-white/50"
                )}
              >
                {link.icon}
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 mx-4 rounded-full"
                  />
                )}
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="pl-4 ml-4 border-l border-gray-200 flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={clsx(
                        "flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold shadow-md transition-all",
                        isActive('/dashboard') ? "bg-rose-500 text-white shadow-rose-200" : "bg-white text-gray-700 border border-gray-100 hover:border-rose-200"
                      )}
                    >
                      <User className="w-4 h-4" /> My Orders
                    </motion.button>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-rose-200/50 flex items-center gap-2 transition-all"
                  >
                    <User className="w-4 h-4" /> Login
                  </motion.button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-rose-50 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    isActive(link.path)
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-rose-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    {link.name}
                  </div>
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-100">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center w-full bg-rose-100 text-rose-700 px-5 py-3 rounded-xl font-bold"
                    >
                      <User className="w-4 h-4 mr-2" /> My Orders
                    </Link>
                    <button
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="flex items-center justify-center w-full text-gray-500 hover:text-red-500 py-2"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center w-full bg-rose-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-rose-200"
                  >
                    <User className="w-4 h-4 mr-2" /> Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
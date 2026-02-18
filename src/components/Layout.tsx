import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import { motion, AnimatePresence } from 'framer-motion';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isAdmin = location.pathname === '/admin';

    if (isAdmin) return <>{children}</>;

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-900 relative selection:bg-rose-200">
            {/* Global Background Elements */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-cream via-white to-rose-50 opacity-80" />
            <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <main className="flex-grow relative z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            <ChatWidget />
            <Footer />
        </div>
    );
};

export default Layout;

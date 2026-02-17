import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Assumes existing component
import Footer from './components/Footer'; // Assumes existing component
import ChatWidget from './components/ChatWidget'; // Assumes existing component
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const Contact = lazy(() => import('./pages/Contact'));
const AIChef = lazy(() => import('./pages/AIChef'));

// Loading fallback component
const PageLoader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
    </div>
);

const ScrollToTop = () => {
    const { pathname } = React.useMemo(() => window.location, []);
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <Router>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen font-sans text-gray-900 relative bg-rose-50">
                    <Navbar />
                    <main className="flex-grow">
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/menu" element={<Menu />} />
                                <Route path="/order" element={<CustomOrder />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/ai-chef" element={<AIChef />} />
                            </Routes>
                        </Suspense>
                    </main>
                    <ChatWidget />
                    <Footer />
                </div>
            </Router>
        </ErrorBoundary>
    );
};

export default App;

import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';

// Lazy load pages for performance
const Menu = lazy(() => import('./pages/Menu'));
const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const Contact = lazy(() => import('./pages/Contact'));
const AIChef = lazy(() => import('./pages/AIChef'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));

// Loading fallback
const PageLoader = () => (
    <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
    </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Layout wrapper — hides Navbar/Footer on Admin page
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isAdmin = location.pathname === '/admin';

    if (isAdmin) return <>{children}</>;

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-900 relative bg-rose-50">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <ChatWidget />
            <Footer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <Router>
                <AuthProvider>
                    <ScrollToTop />
                    <Layout>
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/menu" element={<Menu />} />
                                <Route path="/order" element={<CustomOrder />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/ai-chef" element={<AIChef />} />
                                <Route path="/track-order" element={<OrderTracking />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/dashboard" element={<UserDashboard />} />
                                <Route path="/admin" element={<AdminDashboard />} />
                            </Routes>
                        </Suspense>
                    </Layout>
                    <Analytics />
                </AuthProvider>
            </Router>
        </ErrorBoundary>
    );
};

export default App;

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CustomOrder from './pages/CustomOrder';
import Contact from './pages/Contact';
import AIChef from './pages/AIChef';
import ChatWidget from './components/ChatWidget';

// Wrapper to handle scroll restoration manually if needed, 
// though react-router's ScrollRestoration component is usually sufficient in data routers, 
// in standard BrowserRouter/HashRouter we might need a simple effect component.
const ScrollToTop = () => {
  const { pathname } = React.useMemo(() => window.location, []);
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop /> {/* Ensures page starts at top on nav */}
      <div className="flex flex-col min-h-screen font-sans text-gray-900 relative">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/order" element={<CustomOrder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ai-chef" element={<AIChef />} />
          </Routes>
        </main>
        <ChatWidget />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
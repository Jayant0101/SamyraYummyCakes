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
      <ScrollToTop />
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
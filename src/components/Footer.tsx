import React from 'react';
import { Instagram, MapPin, Phone, Mail, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4 text-amber-100">Samyra's Yummy Cakes</h3>
            <p className="text-gray-400 mb-4 pr-4">
              Crafting memories one slice at a time. We specialize in custom cakes for birthdays, weddings, and all your special occasions.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl font-semibold mb-4 text-amber-100">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/menu" className="text-gray-400 hover:text-rose-400 transition-colors">Our Menu</Link></li>
              <li><Link to="/order" className="text-gray-400 hover:text-rose-400 transition-colors">Custom Orders</Link></li>
              <li><Link to="/ai-chef" className="text-gray-400 hover:text-rose-400 transition-colors">AI Cake Designer</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-rose-400 transition-colors flex items-center gap-1"><Package className="w-4 h-4" /> Track Order</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-rose-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl font-semibold mb-4 text-amber-100">Visit Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">123 Bakery Lane, Kharar, Punjab 140301</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span className="text-gray-400">+91 987 654 3210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span className="text-gray-400">orders@samyrascakes.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Samyra's Yummy Cakes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
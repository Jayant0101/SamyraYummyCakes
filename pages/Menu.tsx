import React, { useState } from 'react';
import { Cake } from '../types';
import { ShoppingBag } from 'lucide-react';

const mockCakes: Cake[] = [
  { id: 1, name: "Classic Chocolate Truffle", category: "Birthday", priceRange: "₹800 - ₹1200", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80", description: "Rich chocolate sponge with dark chocolate ganache." },
  { id: 2, name: "Floral Wedding Tier", category: "Wedding", priceRange: "₹3500 - ₹5000", image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80", description: "3-tier vanilla cake with edible sugar flowers." },
  { id: 3, name: "Red Velvet Heart", category: "Anniversary", priceRange: "₹1000 - ₹1500", image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=600&q=80", description: "Heart shaped red velvet with cream cheese frosting." },
  { id: 4, name: "Unicorn Fantasy", category: "Birthday", priceRange: "₹1500 - ₹2000", image: "https://images.unsplash.com/photo-1562777717-dc6984f65392?auto=format&fit=crop&w=600&q=80", description: "Colorful layers with golden horn and sprinkles." },
  { id: 5, name: "Assorted Cupcakes", category: "Cupcakes", priceRange: "₹600 / pack of 6", image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=600&q=80", description: "Mix of vanilla, strawberry, and chocolate." },
  { id: 6, name: "Fruit Delight", category: "Birthday", priceRange: "₹900 - ₹1300", image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80", description: "Fresh seasonal fruits with light whipped cream." },
];

const Menu: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const categories = ['All', 'Birthday', 'Wedding', 'Anniversary', 'Cupcakes'];

  const filteredCakes = filter === 'All' ? mockCakes : mockCakes.filter(c => c.category === filter);

  return (
    <div className="pt-8 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Menu & Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Browse our collection of signature cakes. Prices are indicative and may vary based on customization and weight.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                  ? 'bg-rose-500 text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-rose-100 hover:text-rose-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCakes.map((cake) => (
            <div key={cake.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in-up">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={cake.image} 
                  alt={cake.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rose-600">
                  {cake.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{cake.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{cake.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-rose-600 font-bold">{cake.priceRange}</span>
                  <a 
                    href={`https://wa.me/919876543210?text=Hi, I am interested in the ${cake.name}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-gray-100 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                    title="Order on WhatsApp"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Custom Order Banner */}
        <div className="mt-20 bg-rose-100 rounded-2xl p-8 md:p-12 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-4">Don't see what you're looking for?</h2>
          <p className="text-gray-600 mb-8">We specialize in custom designs! Tell us your theme and we'll create magic.</p>
          <a 
            href="/#/order" 
            className="inline-block px-8 py-3 bg-rose-500 text-white font-bold rounded-full hover:bg-rose-600 shadow-lg transition-transform hover:-translate-y-1"
          >
            Customize Your Cake
          </a>
        </div>
      </div>
    </div>
  );
};

export default Menu;
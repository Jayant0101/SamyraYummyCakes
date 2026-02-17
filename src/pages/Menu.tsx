import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Cake } from '../types';

const cakes: Cake[] = [
    { id: 1, name: 'Classic Chocolate Truffle', category: 'Birthday', priceRange: '₹800 - ₹2,500', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', description: 'Rich dark chocolate layers with velvety ganache.' },
    { id: 2, name: 'Red Velvet Dream', category: 'Wedding', priceRange: '₹1,200 - ₹4,000', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=600&q=80', description: 'Vibrant red sponge with cream cheese frosting.' },
    { id: 3, name: 'Vanilla Bean Elegance', category: 'Anniversary', priceRange: '₹700 - ₹2,000', image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=600&q=80', description: 'Light and fluffy vanilla sponge with fresh cream.' },
    { id: 4, name: 'Fondant Fantasy', category: 'Custom', priceRange: '₹2,000 - ₹8,000', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', description: 'Fully customizable fondant cakes for any theme.' },
    { id: 5, name: 'Strawberry Bliss', category: 'Birthday', priceRange: '₹900 - ₹3,000', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80', description: 'Fresh strawberry sponge with whipped cream layers.' },
    { id: 6, name: 'Butterscotch Crunch', category: 'Anniversary', priceRange: '₹750 - ₹2,200', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', description: 'Caramel butterscotch with crunchy praline topping.' },
    { id: 7, name: 'Pineapple Delight', category: 'Birthday', priceRange: '₹600 - ₹1,800', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80', description: 'Tropical pineapple sponge with cherry garnish.' },
    { id: 8, name: 'Black Forest', category: 'Custom', priceRange: '₹850 - ₹2,800', image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80', description: 'Classic chocolate with kirsch-soaked cherries and whipped cream.' },
    { id: 9, name: 'Rose & Pistachio', category: 'Wedding', priceRange: '₹1,500 - ₹5,000', image: 'https://images.unsplash.com/photo-1519869325930-281384570c4e?auto=format&fit=crop&w=600&q=80', description: 'Delicate rosewater sponge with pistachio buttercream.' },
];

const categories = ['All', 'Birthday', 'Wedding', 'Anniversary', 'Custom'];

const Menu: React.FC = () => {
    const [activeCategory, setActiveCategory] = React.useState('All');

    const filtered = activeCategory === 'All' ? cakes : cakes.filter(c => c.category === activeCategory);

    return (
        <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Menu & Gallery</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">Explore our handcrafted collection. Every cake is made fresh with premium ingredients.</p>
                    <div className="w-24 h-1 bg-rose-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 ${activeCategory === cat
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                                    : 'bg-white text-gray-700 hover:bg-rose-100 border border-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Cake Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(cake => (
                        <div key={cake.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={cake.image}
                                    alt={cake.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rose-600">
                                    {cake.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{cake.name}</h3>
                                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{cake.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-rose-600 font-bold text-lg">{cake.priceRange}</span>
                                    <Link
                                        to="/order"
                                        className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                    >
                                        <ShoppingBag className="w-4 h-4" /> Order
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-10 text-white shadow-xl">
                        <h2 className="font-serif text-3xl font-bold mb-3">Have a Unique Idea?</h2>
                        <p className="text-rose-100 mb-6 text-lg">Let us bring your vision to life. Customize flavor, design, and size.</p>
                        <Link
                            to="/order"
                            className="inline-block bg-white text-rose-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Customize Your Cake
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;

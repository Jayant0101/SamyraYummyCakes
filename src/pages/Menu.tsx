import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { getActiveProducts, Product } from '../services/productService';

const categories = ['All', 'Birthday', 'Wedding', 'Anniversary', 'Custom', 'Cupcakes'];

const Menu: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await getActiveProducts();
            setProducts(data);
            setLoading(false);
        };
        load();
    }, []);

    const filtered = activeCategory === 'All' ? products : products.filter(c => c.category === activeCategory);

    // Get unique categories from products + defaults
    const dynamicCategories = ['All', ...new Set(products.map(p => p.category))];
    const allCategories = [...new Set([...dynamicCategories, ...categories])];

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
                    {allCategories.map(cat => (
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

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
                    </div>
                )}

                {/* Cake Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(cake => (
                            <div key={cake.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={cake.image_url}
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
                                        <span className="text-rose-600 font-bold text-lg">{cake.price_range}</span>
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
                )}

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg">No cakes in this category yet.</p>
                    </div>
                )}

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

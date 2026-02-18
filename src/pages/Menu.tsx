import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2, Filter } from 'lucide-react';
import { getActiveProducts, Product } from '../services/productService';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

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

    // Get unique categories and sort
    const dynamicCategories = ['All', ...new Set(products.map(p => p.category))].sort();
    const displayCategories = dynamicCategories.length > 1 ? dynamicCategories : ['All', 'Birthday', 'Wedding', 'Anniversary', 'Custom'];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-br from-rose-50 via-white to-amber-50" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-5xl font-bold text-gray-900 mb-4"
                    >
                        Menu & <span className="text-rose-500">Gallery</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-lg max-w-2xl mx-auto font-light"
                    >
                        Explore our handcrafted collection. Every cake is a masterpiece baked with love and premium ingredients.
                    </motion.p>
                </div>

                {/* Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mb-16"
                >
                    {displayCategories.map((cat, idx) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${activeCategory === cat
                                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105'
                                : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-rose-600 shadow-sm'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filtered.map((cake, idx) => (
                                <GlassCard
                                    key={cake.id}
                                    className="p-0 overflow-hidden group hover:shadow-2xl transition-all duration-500"
                                    delay={idx * 0.1}
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <img
                                            src={cake.image_url}
                                            alt={cake.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-rose-600 shadow-sm">
                                            {cake.category}
                                        </div>
                                    </div>

                                    <div className="p-6 relative">
                                        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
                                            {cake.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2">
                                            {cake.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xl font-bold text-gray-900 font-serif">
                                                {cake.price_range}
                                            </span>
                                            <Link
                                                to="/order"
                                                className="btn-primary px-6 py-2 text-sm flex items-center gap-2 shadow-none hover:shadow-lg"
                                            >
                                                <ShoppingBag className="w-4 h-4" /> Order
                                            </Link>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-lg font-serif">No cakes found in this category.</p>
                        <button
                            onClick={() => setActiveCategory('All')}
                            className="mt-4 text-rose-500 hover:underline"
                        >
                            View all cakes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;

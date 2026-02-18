import { motion } from "framer-motion";
import React from "react";
import GlassCard from "./GlassCard";
import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="py-20 grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="text-5xl font-serif leading-tight mb-6 text-gray-900">
                    AI-Generated Cakes <br /> <span className="text-rose-500">Designed Just For You</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">Tell our AI Chef your vision and we'll craft a luxury masterpiece.</p>
                <Link to="/ai-chef" className="px-8 py-4 rounded-full bg-rose-500 text-white shadow-soft hover:bg-rose-600 hover:scale-105 transition-all font-bold inline-block">
                    Design Your Cake
                </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                <GlassCard className="p-4 bg-white/40">
                    {/* Using a placeholder image since local assets might be missing */}
                    <img
                        src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="hero cake"
                        className="w-full rounded-2xl object-cover h-[400px] shadow-sm transform hover:scale-[1.02] transition-transform duration-700"
                    />
                </GlassCard>
            </motion.div>
        </section>
    );
}

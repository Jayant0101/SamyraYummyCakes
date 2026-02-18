import React from "react";
import Hero from "../components/Hero";
import GlassCard from "../components/GlassCard";
import { motion } from "framer-motion";

const cakes = [
  { title: "Whimsical", img: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=600&q=80" },
  { title: "Elegant", img: "https://images.unsplash.com/photo-1563729768647-d078a3d3f1f5?auto=format&fit=crop&w=600&q=80" },
  { title: "Gluten-Free", img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80" }
];

export default function Home() {
  return (
    <div className="pb-20 pt-10 px-4">
      <Hero />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Curated Configurations</h2>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cakes.map((cake, i) => (
            <GlassCard key={i} className="p-0 overflow-hidden group cursor-pointer" delay={i * 0.1} hoverEffect>
              <div className="overflow-hidden h-64">
                <img
                  src={cake.img}
                  alt={cake.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-serif text-2xl text-gray-800 group-hover:text-rose-600 transition-colors">{cake.title}</h3>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
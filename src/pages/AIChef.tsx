import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCakeConcept, generateCakeImage } from '../services/api';
import { AIConcept } from '../types';
import { Sparkles, Loader2, Image as ImageIcon, RotateCw, ShoppingBag, Wand2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';

const AIChef: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState<AIConcept | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConceptGeneration = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setConcept(null);
    setGeneratedImage(null);

    try {
      const result = await generateCakeConcept(prompt);
      setConcept(result);
    } catch (err) {
      setError("Our AI Chef is taking a coffee break. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageGeneration = async () => {
    if (!concept?.visualPrompt) return;
    setImageLoading(true);
    try {
      const img = await generateCakeImage(concept.visualPrompt + " high quality professional food photography, cake on a stand, 8k resolution, cinematic lighting");
      setGeneratedImage(img);
    } catch (err) {
      setError("Could not sketch the cake right now.");
      console.error(err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleOrderThisCake = () => {
    navigate('/order', {
      state: {
        aiConcept: concept,
        aiImageUrl: generatedImage,
      }
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-rose-100/40 to-transparent -z-10" />
      <div className="absolute top-20 right-20 w-64 h-64 bg-gold/10 rounded-full blur-[80px] -z-10" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-soft mb-6"
          >
            <Sparkles className="w-8 h-8 text-rose-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            AI Cake <span className="text-gradient">Consultant</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
          >
            Describe your dream cake, and watch our AI Chef design it right before your eyes.
          </motion.p>
        </div>

        {/* Input Section */}
        <GlassCard className="mb-12 border-rose-100/50">
          <label className="block text-lg font-serif font-bold text-gray-700 mb-4">
            What's the occasion?
          </label>
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A whimsical woodland birthday cake for a 5-year-old, with mushrooms and a fox..."
              className="w-full px-6 py-5 pr-40 text-lg bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleConceptGeneration()}
            />
            <button
              onClick={handleConceptGeneration}
              disabled={loading || !prompt}
              className="absolute right-2 top-2 bottom-2 bg-rose-500 text-white px-6 rounded-lg font-bold hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-rose-200/50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
              <span className="hidden sm:inline">Design</span>
            </button>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mt-4 text-center bg-red-50 py-2 rounded-lg border border-red-100"
            >
              {error}
            </motion.p>
          )}
        </GlassCard>

        {/* Results Section */}
        {concept && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Concept Text */}
            <GlassCard className="h-full flex flex-col justify-between border-t-4 border-t-rose-400">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest uppercase text-gray-400">AI Generated Concept</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {concept.name}
                </h2>
                <div className="prose prose-rose mb-8">
                  <p className="text-gray-600 text-lg leading-relaxed border-l-4 border-rose-100 pl-4 italic">
                    {concept.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="font-serif font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" /> Flavor Palette
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {concept.suggestedFlavors.map((flavor, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-rose-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-default"
                      >
                        {flavor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                {!generatedImage && (
                  <button
                    onClick={handleImageGeneration}
                    disabled={imageLoading}
                    className="w-full btn-secondary flex items-center justify-center gap-2 group"
                  >
                    {imageLoading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5 text-rose-500" /> Baking Pixels...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Generate Visual Preview
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={handleOrderThisCake}
                  className="w-full btn-primary flex items-center justify-center gap-2 shadow-rose-200/50"
                >
                  <ShoppingBag className="w-5 h-5" /> Proceed to Order
                </button>
              </div>
            </GlassCard>

            {/* Visual Preview */}
            <GlassCard className="h-full min-h-[400px] p-0 overflow-hidden relative group bg-gray-50 flex items-center justify-center">
              {generatedImage ? (
                <>
                  <img
                    src={generatedImage}
                    alt="AI Generated Cake"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                    <button
                      onClick={handleImageGeneration}
                      className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-6 py-2 rounded-full hover:bg-white hover:text-rose-900 transition-all flex items-center gap-2"
                    >
                      <RotateCw className="w-4 h-4" /> Regenerate
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-8">
                  {imageLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin mb-4" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-rose-300 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-gray-500 font-medium animate-pulse">Creating your masterpiece...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">No visual generated yet</p>
                        <p className="text-sm">Click "Generate Visual Preview"</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIChef;
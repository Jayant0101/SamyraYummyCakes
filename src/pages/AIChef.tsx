import React, { useState } from 'react';
import { generateCakeConcept, generateCakeImage } from '../services/api';
import { AIConcept } from '../types';
import { Sparkles, Loader2, Image as ImageIcon, RotateCw } from 'lucide-react';

const AIChef: React.FC = () => {
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
      const img = await generateCakeImage(concept.visualPrompt + " high quality professional food photography, cake on a stand");
      setGeneratedImage(img);
    } catch (err) {
      setError("Could not sketch the cake right now.");
      console.error(err);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-white rounded-full shadow-md mb-4">
            <Sparkles className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">AI Cake Consultant</h1>
          <p className="text-gray-600">
            Can't decide? Tell our AI Chef about your occasion, and we'll design the perfect cake for you.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Describe your event and preferences</label>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A jungle themed birthday cake for a 5 year old boy who loves lions and chocolate..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleConceptGeneration()}
            />
            <button
              onClick={handleConceptGeneration}
              disabled={loading || !prompt}
              className="bg-rose-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              Design My Cake
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
        </div>

        {/* Results Section */}
        {concept && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
            <div className="md:flex">
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <div className="uppercase tracking-wide text-sm text-rose-500 font-bold mb-1">AI Recommendation</div>
                <h2 className="block mt-1 text-3xl leading-tight font-serif font-bold text-black mb-4">{concept.name}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{concept.description}</p>

                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-2">Suggested Flavor Profile:</h3>
                  <div className="flex flex-wrap gap-2">
                    {concept.suggestedFlavors.map((flavor, idx) => (
                      <span key={idx} className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold">
                        {flavor}
                      </span>
                    ))}
                  </div>
                </div>

                {!generatedImage && (
                  <button
                    onClick={handleImageGeneration}
                    disabled={imageLoading}
                    className="mt-auto bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 w-full"
                  >
                    {imageLoading ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" /> Generating Visualization...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5" /> Visualize This Cake
                      </>
                    )}
                  </button>
                )}

                <a
                  href={`https://wa.me/919876543210?text=I used your AI Chef and I want to order this concept: "${concept.name}" - ${concept.description}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block text-center text-rose-600 font-bold hover:underline"
                >
                  Order This Concept
                </a>
              </div>

              <div className="md:w-1/2 bg-gray-100 min-h-[400px] flex items-center justify-center relative">
                {generatedImage ? (
                  <img src={generatedImage} alt="AI Generated Cake" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-8 text-gray-400">
                    {imageLoading ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin w-10 h-10 text-rose-500 mb-2" />
                        <p>Baking pixels...</p>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                        <p>Click "Visualize" to see a preview</p>
                      </>
                    )}
                  </div>
                )}
                {generatedImage && (
                  <button
                    onClick={handleImageGeneration}
                    className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-700 hover:text-rose-500 shadow-md transition-colors"
                    title="Regenerate Image"
                  >
                    <RotateCw className={`w-5 h-5 ${imageLoading ? 'animate-spin' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChef;
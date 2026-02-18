import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Loader2, CheckCircle, Upload, MessageCircle, X, Image as ImageIcon, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { createOrder } from '../services/orderService';
import { uploadOrderImage } from '../services/storageService';
import { AIConcept } from '../types';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';

const flavors = ['Chocolate Truffle', 'Red Velvet', 'Vanilla', 'Butterscotch', 'Strawberry', 'Pineapple', 'Black Forest', 'Mango', 'Rose & Pistachio', 'Other'];
const occasions = ['Birthday', 'Wedding', 'Anniversary', 'Baby Shower', 'Corporate Event', 'Festival', 'Other'];
const weights = ['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg', '5 kg', 'Custom'];

const CustomOrder: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if navigated from AI Chef with pre-filled data
    const aiState = location.state as { aiConcept?: AIConcept; aiImageUrl?: string } | null;
    const aiConcept = aiState?.aiConcept || null;
    const aiImageUrl = aiState?.aiImageUrl || null;
    const isAIOrder = !!aiConcept;

    const [submitted, setSubmitted] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        flavor: aiConcept?.suggestedFlavors?.[0] || '',
        occasion: '',
        weight: '1 kg',
        details: aiConcept ? `AI Design: ${aiConcept.name}\n${aiConcept.description}` : '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert('Image must be less than 5MB'); return; }
        if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return; }
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => { setImageFile(null); setImagePreview(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl: string | undefined;

            if (imageFile) {
                setUploadProgress('Uploading image...');
                imageUrl = await uploadOrderImage(imageFile);
            }

            setUploadProgress('Placing order...');

            const order = await createOrder({
                customer_name: formData.name,
                customer_phone: formData.phone,
                event_date: formData.date,
                cake_flavor: formData.flavor,
                cake_weight: formData.weight,
                occasion: formData.occasion || (isAIOrder ? 'AI Designed' : 'Other'),
                details: formData.details,
                reference_image_url: imageUrl,
                ai_concept: aiConcept || undefined,
                ai_image_url: aiImageUrl || undefined,
            });
            setOrderId(order.id);
            setSubmitted(true);
        } catch (err) {
            console.error('Order submission error:', err);
            alert('Failed to submit order. Please try again.');
        } finally {
            setLoading(false);
            setUploadProgress('');
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-rose-50/50 -z-10" />
                <GlassCard className="max-w-lg w-full text-center p-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm"
                    >
                        <CheckCircle className="w-12 h-12 text-green-500" />
                    </motion.div>
                    <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
                    <p className="text-gray-600 mb-6">Your order has been submitted successfully.</p>

                    {isAIOrder && (
                        <div className="bg-purple-50 p-4 rounded-xl mb-6 border border-purple-100">
                            <p className="text-purple-700 text-sm font-bold flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" /> AI Design: {aiConcept!.name}
                            </p>
                        </div>
                    )}

                    <div className="bg-white border border-rose-100 rounded-xl p-4 mb-8 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-bold">Order ID</p>
                        <p className="text-3xl font-bold text-rose-600 font-mono tracking-widest">{orderId}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <a
                            href={`https://wa.me/919876543210?text=Hi! My order ID is ${orderId}. Please confirm. 🎂`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-full font-bold transition-all shadow-lg hover:shadow-green-200 flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                        </a>
                        <button
                            onClick={() => navigate('/track-order')}
                            className="bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 px-6 py-3.5 rounded-full font-bold transition-colors"
                        >
                            Track Order Status
                        </button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-rose-100/30 to-amber-50/30 -z-10" />

            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    {isAIOrder ? (
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                                <Sparkles className="w-4 h-4" /> AI-Designed Cake
                            </div>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Finalize Your Design</h1>
                            <p className="text-gray-600 text-lg">Just a few details to bring your AI concept to life.</p>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Custom Cake Order</h1>
                            <p className="text-gray-600 text-lg">Tell us about your dream cake and we'll bake it into reality!</p>
                            <div className="w-24 h-1 bg-rose-500 mx-auto mt-4 rounded-full"></div>
                        </motion.div>
                    )}
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Left Column (AI Preview or Info) */}
                    {isAIOrder && (
                        <div className="md:col-span-12 mb-6">
                            <GlassCard className="overflow-hidden p-0">
                                <div className="md:flex">
                                    <div className="md:w-1/3 bg-gray-100 min-h-[200px] relative">
                                        {aiImageUrl ? (
                                            <img src={aiImageUrl} alt={aiConcept!.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                                <p className="text-sm">No visualization</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:w-2/3 p-6 flex flex-col justify-center">
                                        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{aiConcept!.name}</h3>
                                        <p className="text-gray-600 mb-4">{aiConcept!.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {aiConcept!.suggestedFlavors.map((f, i) => (
                                                <span key={i} className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-bold border border-amber-100">{f}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                    {/* Main Form */}
                    <div className="md:col-span-12">
                        <GlassCard className="p-8 md:p-10">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Info */}
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">1</span> Contact Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text" name="name" required value={formData.name} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Info */}
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">2</span> Cake Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Event Date</label>
                                            <div className="relative">
                                                <input
                                                    type="date" name="date" required value={formData.date} onChange={handleChange}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all"
                                                />
                                                <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Occasion</label>
                                            <select
                                                name="occasion" required value={formData.occasion} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all appearance-none"
                                            >
                                                <option value="">Select Occasion</option>
                                                {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Flavor</label>
                                            <select
                                                name="flavor" required value={formData.flavor} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all appearance-none"
                                            >
                                                <option value="">Select Flavor</option>
                                                {flavors.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Weight</label>
                                            <select
                                                name="weight" value={formData.weight} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all appearance-none"
                                            >
                                                {weights.map(w => <option key={w} value={w}>{w}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Customization */}
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">3</span> Customization
                                    </h3>

                                    <div className="mb-6">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Reference Image (Optional)</label>
                                        {imagePreview ? (
                                            <div className="relative rounded-xl overflow-hidden border-2 border-rose-200 w-full max-w-xs">
                                                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-3 py-1.5 backdrop-blur-sm">
                                                    {imageFile?.name}
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-400 hover:bg-rose-50/50 transition-all cursor-pointer block group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-rose-100 transition-colors">
                                                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-rose-500" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-700">Click to upload a reference photo</p>
                                                <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG up to 5MB</p>
                                            </label>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Additional Requests</label>
                                        <textarea
                                            name="details" value={formData.details} onChange={handleChange} rows={4}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all resize-none"
                                            placeholder="Descriptive details about design, color theme, message on cake..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transform hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    {loading ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> {uploadProgress || 'Submitting...'}</>
                                    ) : (
                                        <><Send className="w-5 h-5" /> Place Order Now</>
                                    )}
                                </button>
                            </form>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomOrder;

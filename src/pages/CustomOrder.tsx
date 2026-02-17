import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Loader2, CheckCircle, Upload, MessageCircle, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { createOrder } from '../services/orderService';
import { uploadOrderImage } from '../services/storageService';
import { AIConcept } from '../types';

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

            // Upload custom image if selected
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

    // ─── Success Screen ───
    if (submitted) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
                    <p className="text-gray-600 mb-2">Your order has been submitted successfully.</p>
                    {isAIOrder && <p className="text-purple-600 text-sm mb-2">✨ AI Design: {aiConcept!.name}</p>}
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 my-6">
                        <p className="text-sm text-gray-600 mb-1">Your Order ID</p>
                        <p className="text-2xl font-bold text-rose-600 font-mono tracking-wider">{orderId}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Save this ID to track your order status.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={`https://wa.me/919876543210?text=Hi! My order ID is ${orderId}. Please confirm. 🎂`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                        </a>
                        <button
                            onClick={() => navigate('/track-order')}
                            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-bold transition-colors"
                        >
                            Track Order
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── AI Order: Simplified Form ───
    if (isAIOrder) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                            <Sparkles className="w-4 h-4" /> AI-Designed Cake
                        </div>
                        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
                        <p className="text-gray-600">Just a few details and your AI-designed cake will be on its way!</p>
                    </div>

                    {/* AI Concept Preview Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                        <div className="md:flex">
                            {/* Image Side */}
                            <div className="md:w-2/5 bg-gray-100 min-h-[250px] flex items-center justify-center">
                                {aiImageUrl ? (
                                    <img src={aiImageUrl} alt={aiConcept!.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-8 text-gray-400">
                                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No visualization generated</p>
                                    </div>
                                )}
                            </div>
                            {/* Details Side */}
                            <div className="md:w-3/5 p-6">
                                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{aiConcept!.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{aiConcept!.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {aiConcept!.suggestedFlavors.map((f, i) => (
                                        <span key={i} className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-bold">{f}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simplified Order Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Your Name *</label>
                                <input
                                    type="text" name="name" required value={formData.name} onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Phone Number *</label>
                                <input
                                    type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Event Date *</label>
                                <input
                                    type="date" name="date" required value={formData.date} onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Cake Weight *</label>
                                <select
                                    name="weight" required value={formData.weight} onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all bg-white"
                                >
                                    {weights.map(w => <option key={w} value={w}>{w}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Any additional notes?</label>
                            <textarea
                                name="details" value={formData.details} onChange={handleChange} rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all resize-none"
                                placeholder="Message on cake, dietary requirements..."
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                        >
                            {loading ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> {uploadProgress || 'Placing Order...'}</>
                            ) : (
                                <><Send className="w-5 h-5" /> Place Order</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ─── Regular Order Form (Full) ───
    return (
        <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Custom Cake Order</h1>
                    <p className="text-gray-600 text-lg">Tell us about your dream cake and we'll make it happen!</p>
                    <div className="w-24 h-1 bg-rose-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-6">
                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Full Name *</label>
                            <input
                                type="text" name="name" required value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Phone Number *</label>
                            <input
                                type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    {/* Event Date & Occasion */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Event Date *</label>
                            <input
                                type="date" name="date" required value={formData.date} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Occasion *</label>
                            <select
                                name="occasion" required value={formData.occasion} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all bg-white"
                            >
                                <option value="">Select occasion</option>
                                {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Flavor & Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Cake Flavor *</label>
                            <select
                                name="flavor" required value={formData.flavor} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all bg-white"
                            >
                                <option value="">Select flavor</option>
                                {flavors.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Cake Weight</label>
                            <select
                                name="weight" value={formData.weight} onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all bg-white"
                            >
                                {weights.map(w => <option key={w} value={w}>{w}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Design Reference Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Design Reference Image (Optional)</label>
                        {imagePreview ? (
                            <div className="relative rounded-lg overflow-hidden border-2 border-rose-200">
                                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-3 py-1.5">
                                    {imageFile?.name} ({(imageFile!.size / 1024).toFixed(0)} KB)
                                </div>
                            </div>
                        ) : (
                            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-rose-400 transition-colors cursor-pointer block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-600">Click to upload a reference image</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                            </label>
                        )}
                    </div>

                    {/* Additional Details */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-2">Additional Details</label>
                        <textarea
                            name="details" value={formData.details} onChange={handleChange} rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none transition-all resize-none"
                            placeholder="Message on cake, special dietary requirements, color preferences, etc."
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> {uploadProgress || 'Submitting...'}</>
                        ) : (
                            <><Send className="w-5 h-5" /> Place Order</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomOrder;

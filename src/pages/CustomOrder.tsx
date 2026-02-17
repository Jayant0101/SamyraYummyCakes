import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2, CheckCircle, Upload, MessageCircle, X, Image as ImageIcon } from 'lucide-react';
import { createOrder } from '../services/orderService';
import { uploadOrderImage } from '../services/storageService';

const flavors = ['Chocolate Truffle', 'Red Velvet', 'Vanilla', 'Butterscotch', 'Strawberry', 'Pineapple', 'Black Forest', 'Mango', 'Rose & Pistachio', 'Other'];
const occasions = ['Birthday', 'Wedding', 'Anniversary', 'Baby Shower', 'Corporate Event', 'Festival', 'Other'];
const weights = ['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg', '5 kg', 'Custom'];

const CustomOrder: React.FC = () => {
    const navigate = useNavigate();
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
        flavor: '',
        occasion: '',
        weight: '1 kg',
        details: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl: string | undefined;

            // Upload image if selected
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
                occasion: formData.occasion,
                details: formData.details,
                reference_image_url: imageUrl,
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

    const whatsappMessage = `Hi Samyra! 🎂 I just placed an order (${orderId}).%0A%0AName: ${formData.name}%0AEvent: ${formData.occasion}%0ADate: ${formData.date}%0AFlavor: ${formData.flavor}%0AWeight: ${formData.weight}%0ADetails: ${formData.details}`;

    if (submitted) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
                    <p className="text-gray-600 mb-2">Your order has been submitted successfully.</p>
                    {imageFile && <p className="text-green-600 text-sm mb-2">✅ Reference image uploaded!</p>}
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 my-6">
                        <p className="text-sm text-gray-600 mb-1">Your Order ID</p>
                        <p className="text-2xl font-bold text-rose-600 font-mono tracking-wider">{orderId}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Save this ID to track your order status.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={`https://wa.me/919876543210?text=${whatsappMessage}`}
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

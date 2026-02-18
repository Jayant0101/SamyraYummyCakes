import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';

const Contact: React.FC = () => {
    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-50 via-white to-amber-50 -z-10" />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-gray-900 mb-6">Contact Us</h1>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto font-light">
                            We'd love to hear from you! Reach out for orders, inquiries, or just to say hello.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Phone & WhatsApp */}
                        <GlassCard className="p-8">
                            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                            <div className="space-y-4">
                                <a href="tel:+919876543210" className="flex items-center gap-4 p-4 rounded-xl hover:bg-rose-50 transition-all group border border-transparent hover:border-rose-100">
                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                        <Phone className="w-5 h-5 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Call Us</p>
                                        <p className="font-serif text-xl font-bold text-gray-900">+91 987 654 3210</p>
                                    </div>
                                </a>

                                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-green-50 transition-all group border border-transparent hover:border-green-100">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                        <MessageCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">WhatsApp</p>
                                        <p className="font-serif text-xl font-bold text-gray-900">+91 987 654 3210</p>
                                    </div>
                                </a>

                                <a href="mailto:orders@samyrascakes.com" className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all group border border-transparent hover:border-blue-100">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Email</p>
                                        <p className="font-serif text-xl font-bold text-gray-900">orders@samyrascakes.com</p>
                                    </div>
                                </a>
                            </div>
                        </GlassCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Hours */}
                            <GlassCard className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><Clock className="w-5 h-5" /></div>
                                    <h3 className="font-serif text-lg font-bold text-gray-900">Business Hours</h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <span className="text-gray-500">Mon - Sat</span>
                                        <span className="font-bold text-gray-900">9:00 AM - 8:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">Sunday</span>
                                        <span className="font-bold text-gray-900">10:00 AM - 6:00 PM</span>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Location Info */}
                            <GlassCard className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-rose-50 rounded-lg text-rose-500"><MapPin className="w-5 h-5" /></div>
                                    <h3 className="font-serif text-lg font-bold text-gray-900">Location</h3>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    123 Bakery Lane,<br /> Kharar, Punjab 140301
                                </p>
                            </GlassCard>
                        </div>
                    </motion.div>

                    {/* Right Column: Map & Social */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* Google Map */}
                        <GlassCard className="p-0 overflow-hidden h-[400px] relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.3!2d76.65!3d30.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQ0JzI0LjAiTiA3NsKwMzknMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Samyra's Yummy Cakes Location"
                                className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-900">Visit Our Bakery</h3>
                                        <p className="text-xs text-gray-500">Get fresh cakes daily!</p>
                                    </div>
                                    <a
                                        href="https://www.google.com/maps/dir/?api=1&destination=30.74,76.65"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-md"
                                    >
                                        Directions
                                    </a>
                                </div>
                            </div>
                        </GlassCard>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Instagram */}
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="block group">
                                <GlassCard className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white border-none p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-transform">
                                    <Instagram className="w-8 h-8 mb-4" />
                                    <div>
                                        <p className="font-bold text-lg leading-tight mb-1">Follow Us on Instagram</p>
                                        <p className="text-white/80 text-xs">@samyrayummycakes</p>
                                    </div>
                                </GlassCard>
                            </a>

                            {/* Track Order Link */}
                            <Link to="/track-order" className="block group">
                                <GlassCard className="p-6 h-full flex flex-col justify-between hover:border-rose-300 transition-colors group-hover:shadow-lg">
                                    <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                                        <Clock className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg leading-tight mb-1">Track Order</p>
                                        <p className="text-rose-600 text-xs font-bold flex items-center gap-1">
                                            Check Status <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </p>
                                    </div>
                                </GlassCard>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

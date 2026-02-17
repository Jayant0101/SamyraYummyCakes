import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
    return (
        <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">We'd love to hear from you! Reach out for orders, inquiries, or just to say hello.</p>
                    <div className="w-24 h-1 bg-rose-500 mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Contact Details */}
                    <div className="space-y-6">
                        {/* Phone & WhatsApp */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                            <div className="space-y-5">
                                <a href="tel:+919876543210" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors group">
                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                                        <Phone className="w-5 h-5 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Call Us</p>
                                        <p className="font-bold text-gray-900">+91 987 654 3210</p>
                                    </div>
                                </a>

                                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
                                    className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                        <MessageCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">WhatsApp</p>
                                        <p className="font-bold text-gray-900">+91 987 654 3210</p>
                                    </div>
                                </a>

                                <a href="mailto:orders@samyrascakes.com" className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-rose-50 transition-colors group">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <Mail className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-bold text-gray-900">orders@samyrascakes.com</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Hours & Location */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-6 h-6 text-rose-500" />
                                <h3 className="font-serif text-xl font-bold text-gray-900">Business Hours</h3>
                            </div>
                            <div className="space-y-2 text-gray-700 ml-9">
                                <p className="flex justify-between"><span>Monday - Saturday</span><span className="font-bold">9:00 AM - 8:00 PM</span></p>
                                <p className="flex justify-between"><span>Sunday</span><span className="font-bold">10:00 AM - 6:00 PM</span></p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <MapPin className="w-6 h-6 text-rose-500" />
                                <h3 className="font-serif text-xl font-bold text-gray-900">Our Location</h3>
                            </div>
                            <p className="text-gray-700 ml-9 mb-4">123 Bakery Lane, Kharar, Punjab 140301</p>
                        </div>

                        {/* Instagram */}
                        <a href="https://instagram.com" target="_blank" rel="noreferrer"
                            className="flex items-center gap-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
                            <Instagram className="w-8 h-8" />
                            <div>
                                <p className="font-bold text-lg">Follow @samyrayummycakes</p>
                                <p className="text-white/80 text-sm">See our latest creations on Instagram</p>
                            </div>
                        </a>

                        {/* Track Order Link */}
                        <Link to="/track-order"
                            className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center border-2 border-dashed border-rose-300">
                            <p className="font-bold text-gray-900 text-lg mb-1">Already placed an order?</p>
                            <p className="text-rose-600 font-bold">Track Your Order →</p>
                        </Link>
                    </div>

                    {/* Google Map */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.3!2d76.65!3d30.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQ0JzI0LjAiTiA3NsKwMzknMDAuMCJF!5e0!3m2!1sen!2sin!4v1"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Samyra's Yummy Cakes Location"
                            className="w-full"
                        />
                        <div className="p-6">
                            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Samyra's Yummy Cakes</h3>
                            <p className="text-gray-600">123 Bakery Lane, Kharar, Punjab 140301</p>
                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=30.74,76.65"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-4 bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full font-bold text-sm transition-colors"
                            >
                                Get Directions
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;

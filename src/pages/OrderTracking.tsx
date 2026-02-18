import React, { useState } from 'react';
import { Search, Package, CheckCircle, ChefHat, Truck, Gift, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { getOrderById, getOrdersByPhone } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Received', icon: <Package className="w-4 h-4" /> },
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-4 h-4" /> },
    { key: 'baking', label: 'Baking', icon: <ChefHat className="w-4 h-4" /> },
    { key: 'ready', label: 'Ready', icon: <Gift className="w-4 h-4" /> },
    { key: 'out_for_delivery', label: 'Delivery', icon: <Truck className="w-4 h-4" /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> },
];

const getStepIndex = (status: OrderStatus) => {
    if (status === 'cancelled') return -1;
    return STATUS_STEPS.findIndex(s => s.key === status);
};

const OrderTracking: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        setLoading(true);
        setSearched(true);

        try {
            // Try as order ID first
            if (searchInput.startsWith('ORD-')) {
                const order = await getOrderById(searchInput.trim());
                setOrders(order ? [order] : []);
            } else {
                // Try as phone number
                const result = await getOrdersByPhone(searchInput.trim());
                setOrders(result);
            }
        } catch (err) {
            console.error(err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-rose-50 to-white -z-10" />

            <div className="max-w-3xl mx-auto py-12">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                    >
                        Track Your <span className="text-rose-500">Happiness</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-lg"
                    >
                        Enter your Order ID or phone number to see where your cake is!
                    </motion.p>
                </div>

                {/* Search */}
                <GlassCard className="p-2 mb-10 max-w-2xl mx-auto flex items-center bg-white/50 backdrop-blur-xl border border-white/60">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="e.g. ORD-1234 or +9198765..."
                        className="flex-1 px-6 py-4 bg-transparent outline-none text-gray-900 placeholder-gray-400 font-medium"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-rose-200"
                    >
                        {loading ? 'Searching...' : <><Search className="w-5 h-5" /> Track</>}
                    </button>
                </GlassCard>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {searched && orders.length === 0 && !loading && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-10">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">No Orders Found</h3>
                            <p className="text-gray-500">We couldn't find an order with that ID or number.</p>
                        </motion.div>
                    )}

                    {orders.map((order, idx) => {
                        const currentStep = getStepIndex(order.status);
                        const isCancelled = order.status === 'cancelled';

                        return (
                            <GlassCard key={order.id} className="p-8 mb-8" delay={idx * 0.1}>
                                {/* Order Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Order ID</span>
                                            <span className="font-mono text-lg font-bold text-gray-900">{order.id}</span>
                                        </div>
                                        <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-serif text-2xl font-bold text-gray-900">{order.cake_flavor}</div>
                                        <p className="text-gray-600 text-sm">{order.cake_weight}</p>
                                    </div>
                                </div>

                                {/* Status Timeline */}
                                {isCancelled ? (
                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-8">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="w-8 h-8 text-red-500" />
                                        </div>
                                        <p className="font-bold text-red-700 text-2xl font-serif mb-2">Order Cancelled</p>
                                        {order.owner_notes && <p className="text-red-600 bg-white/50 inline-block px-4 py-2 rounded-lg">{order.owner_notes}</p>}
                                    </div>
                                ) : (
                                    <div className="mb-10 px-2">
                                        <div className="relative">
                                            {/* Progress Bar Background */}
                                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full -z-10" />

                                            {/* Active Progress Bar */}
                                            <div
                                                className="absolute top-1/2 left-0 h-1 bg-rose-500 -translate-y-1/2 rounded-full -z-10 transition-all duration-1000 ease-out"
                                                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                                            />

                                            <div className="flex justify-between relative">
                                                {STATUS_STEPS.map((step, stepIdx) => {
                                                    const isCompleted = stepIdx <= currentStep;
                                                    const isCurrent = stepIdx === currentStep;

                                                    return (
                                                        <div key={step.key} className="flex flex-col items-center">
                                                            <div className={`
                                                                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500
                                                                ${isCompleted ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-white border-2 border-gray-100 text-gray-300'}
                                                                ${isCurrent ? 'scale-125 ring-4 ring-rose-100' : ''}
                                                            `}>
                                                                {step.icon}
                                                            </div>
                                                            <span className={`
                                                                absolute top-12 text-[10px] md:text-xs font-bold whitespace-nowrap transition-colors duration-300
                                                                ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-300'}
                                                            `}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="h-8"></div> {/* Spacer for labels */}
                                    </div>
                                )}

                                {/* Order Details Grid */}
                                <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                                        <p className="font-semibold text-gray-900">{order.customer_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Event Date</p>
                                        <p className="font-semibold text-gray-900">{new Date(order.event_date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Occasion</p>
                                        <p className="font-semibold text-gray-900">{order.occasion}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last Update</p>
                                        <p className="font-semibold text-gray-900"> {new Date(order.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>

                                {order.owner_notes && !isCancelled && (
                                    <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start">
                                        <span className="text-xl">👩‍🍳</span>
                                        <div>
                                            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Baker's Note</p>
                                            <p className="text-amber-900 italic">"{order.owner_notes}"</p>
                                        </div>
                                    </div>
                                )}
                            </GlassCard>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default OrderTracking;

import React, { useState } from 'react';
import { Search, Package, CheckCircle, ChefHat, Truck, Gift, Clock, AlertCircle } from 'lucide-react';
import { getOrderById, getOrdersByPhone } from '../services/orderService';
import { Order, OrderStatus } from '../types';

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
    { key: 'pending', label: 'Order Received', icon: <Package className="w-5 h-5" /> },
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-5 h-5" /> },
    { key: 'baking', label: 'Baking', icon: <ChefHat className="w-5 h-5" /> },
    { key: 'ready', label: 'Ready', icon: <Gift className="w-5 h-5" /> },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck className="w-5 h-5" /> },
    { key: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-5 h-5" /> },
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
        <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Track Your Order</h1>
                    <p className="text-gray-600 text-lg">Enter your Order ID or phone number to see the status.</p>
                    <div className="w-24 h-1 bg-rose-500 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            placeholder="Enter Order ID (e.g. ORD-XXXX) or Phone Number"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Search className="w-5 h-5" /> Track
                        </button>
                    </div>
                </div>

                {/* Results */}
                {searched && orders.length === 0 && !loading && (
                    <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">No Orders Found</h3>
                        <p className="text-gray-500">Please double-check your Order ID or phone number.</p>
                    </div>
                )}

                {orders.map(order => {
                    const currentStep = getStepIndex(order.status);
                    const isCancelled = order.status === 'cancelled';

                    return (
                        <div key={order.id} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-2">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="text-xl font-bold font-mono text-rose-600">{order.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Placed On</p>
                                    <p className="font-bold text-gray-800">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            {isCancelled ? (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
                                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                    <p className="font-bold text-red-700 text-lg">Order Cancelled</p>
                                    {order.owner_notes && <p className="text-red-600 text-sm mt-1">{order.owner_notes}</p>}
                                </div>
                            ) : (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between relative">
                                        {/* Progress Line */}
                                        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full z-0">
                                            <div
                                                className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-700"
                                                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                                            />
                                        </div>

                                        {STATUS_STEPS.map((step, idx) => {
                                            const isCompleted = idx <= currentStep;
                                            const isCurrent = idx === currentStep;
                                            return (
                                                <div key={step.key} className="flex flex-col items-center z-10 relative">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                                                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                                                            : 'bg-gray-200 text-gray-400'
                                                        } ${isCurrent ? 'ring-4 ring-rose-200 scale-110' : ''}`}>
                                                        {step.icon}
                                                    </div>
                                                    <span className={`text-xs mt-2 font-medium text-center max-w-[70px] ${isCompleted ? 'text-rose-600' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Order Details */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-gray-500 mb-1">Customer</p>
                                    <p className="font-bold text-gray-900">{order.customer_name}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-gray-500 mb-1">Event Date</p>
                                    <p className="font-bold text-gray-900">{new Date(order.event_date).toLocaleDateString('en-IN')}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-gray-500 mb-1">Flavor</p>
                                    <p className="font-bold text-gray-900">{order.cake_flavor}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-gray-500 mb-1">Weight</p>
                                    <p className="font-bold text-gray-900">{order.cake_weight}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-gray-500 mb-1">Occasion</p>
                                    <p className="font-bold text-gray-900">{order.occasion}</p>
                                </div>
                                {order.owner_notes && (
                                    <div className="bg-amber-50 rounded-lg p-3 col-span-2 md:col-span-1">
                                        <p className="text-amber-600 mb-1">Note from Baker</p>
                                        <p className="font-bold text-gray-900">{order.owner_notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Last Updated */}
                            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                Last updated: {new Date(order.updated_at).toLocaleString('en-IN')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTracking;

import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, deleteOrder } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { Lock, LogOut, Package, CheckCircle, ChefHat, Truck, Gift, Trash2, Phone, Clock, MessageSquare, Filter, RefreshCw } from 'lucide-react';

const ADMIN_PASSWORD = 'samyra2024'; // Simple password – replace with Supabase Auth for production

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: <Package className="w-4 h-4" /> },
    confirmed: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-100', icon: <CheckCircle className="w-4 h-4" /> },
    baking: { label: 'Baking', color: 'text-orange-700', bg: 'bg-orange-100', icon: <ChefHat className="w-4 h-4" /> },
    ready: { label: 'Ready', color: 'text-purple-700', bg: 'bg-purple-100', icon: <Gift className="w-4 h-4" /> },
    out_for_delivery: { label: 'Out for Delivery', color: 'text-indigo-700', bg: 'bg-indigo-100', icon: <Truck className="w-4 h-4" /> },
    delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-100', icon: <CheckCircle className="w-4 h-4" /> },
    cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100', icon: <Trash2 className="w-4 h-4" /> },
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    pending: 'confirmed',
    confirmed: 'baking',
    baking: 'ready',
    ready: 'out_for_delivery',
    out_for_delivery: 'delivered',
};

const AdminDashboard: React.FC = () => {
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
    const [noteInput, setNoteInput] = useState<Record<string, string>>({});
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const loadOrders = async () => {
        setLoading(true);
        const data = await getAllOrders();
        setOrders(data);
        setLoading(false);
    };

    useEffect(() => {
        if (authed) loadOrders();
    }, [authed]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) setAuthed(true);
        else alert('Incorrect password');
    };

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        const note = noteInput[orderId] || undefined;
        await updateOrderStatus(orderId, newStatus, note);
        setNoteInput(prev => ({ ...prev, [orderId]: '' }));
        loadOrders();
    };

    const handleDelete = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;
        await deleteOrder(orderId);
        loadOrders();
    };

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    const statusCounts = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Login Screen
    if (!authed) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
                <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
                    <p className="text-gray-500 mb-6 text-sm">Enter the admin password to manage orders.</p>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none mb-4"
                    />
                    <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-bold transition-colors">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                <h1 className="font-serif text-2xl font-bold text-gray-900">🧁 Order Dashboard</h1>
                <div className="flex items-center gap-3">
                    <button onClick={loadOrders} className="p-2 text-gray-500 hover:text-rose-500 transition-colors" title="Refresh">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={() => setAuthed(false)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </div>

            <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key as OrderStatus)}
                            className={`${cfg.bg} rounded-xl p-3 text-center transition-all hover:shadow-md ${filter === key ? 'ring-2 ring-offset-1 ring-rose-400' : ''}`}
                        >
                            <div className={`text-2xl font-bold ${cfg.color}`}>{statusCounts[key] || 0}</div>
                            <div className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</div>
                        </button>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <button onClick={() => setFilter('all')} className={`text-sm px-3 py-1 rounded-full ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border'}`}>
                        All ({orders.length})
                    </button>
                </div>

                {/* Orders List */}
                {filtered.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No orders found</p>
                    </div>
                )}

                <div className="space-y-4">
                    {filtered.map(order => {
                        const cfg = STATUS_CONFIG[order.status];
                        const next = NEXT_STATUS[order.status];
                        const isExpanded = expandedId === order.id;

                        return (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Order Row */}
                                <div
                                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer"
                                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono font-bold text-rose-600 text-sm">{order.id}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${cfg.bg} ${cfg.color}`}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </div>
                                        <p className="font-bold text-gray-900">{order.customer_name}</p>
                                        <p className="text-sm text-gray-500">{order.cake_flavor} · {order.cake_weight} · {order.occasion}</p>
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(order.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </div>
                                        <a href={`tel:${order.customer_phone}`} onClick={e => e.stopPropagation()} className="p-2 hover:bg-green-50 rounded-full">
                                            <Phone className="w-4 h-4 text-green-600" />
                                        </a>
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div className="px-4 sm:px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><span className="text-gray-500">Phone:</span> <span className="font-bold text-gray-900">{order.customer_phone}</span></div>
                                            <div><span className="text-gray-500">Event Date:</span> <span className="font-bold text-gray-900">{order.event_date}</span></div>
                                            {order.details && <div className="col-span-2"><span className="text-gray-500">Details:</span> <span className="text-gray-900">{order.details}</span></div>}
                                            {order.owner_notes && <div className="col-span-2"><span className="text-gray-500">Notes:</span> <span className="text-amber-700 font-bold">{order.owner_notes}</span></div>}
                                        </div>

                                        {/* AI Concept if available */}
                                        {order.ai_concept && (
                                            <div className="bg-purple-50 rounded-lg p-4">
                                                <p className="font-bold text-purple-800 mb-1">🤖 AI Design: {order.ai_concept.name}</p>
                                                <p className="text-purple-700 text-sm">{order.ai_concept.description}</p>
                                                {order.ai_image_url && (
                                                    <img src={order.ai_image_url} alt="AI Design" className="mt-2 rounded-lg w-full max-w-xs" />
                                                )}
                                            </div>
                                        )}

                                        {/* Action Area */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="text"
                                                value={noteInput[order.id] || ''}
                                                onChange={e => setNoteInput(prev => ({ ...prev, [order.id]: e.target.value }))}
                                                placeholder="Add note for customer (optional)"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 outline-none"
                                                onClick={e => e.stopPropagation()}
                                            />
                                            <div className="flex gap-2">
                                                {next && (
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, next)}
                                                        className="flex items-center gap-1 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                                                    >
                                                        <MessageSquare className="w-4 h-4" /> Move to {STATUS_CONFIG[next].label}
                                                    </button>
                                                )}
                                                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                                                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(order.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* WhatsApp Quick Reply */}
                                        <a
                                            href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}?text=Hi ${order.customer_name}! Update on your order ${order.id}: ${STATUS_CONFIG[order.status].label}. ${noteInput[order.id] || ''}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-green-600 font-bold hover:underline"
                                        >
                                            <MessageSquare className="w-4 h-4" /> Send WhatsApp Update
                                        </a>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

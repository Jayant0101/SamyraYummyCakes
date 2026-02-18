import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrdersByPhone } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { LogOut, Package, Clock, CheckCircle, Truck, ChefHat, XCircle, User, Loader2, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-4 h-4" /> },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <CheckCircle className="w-4 h-4" /> },
    baking: { label: 'Baking', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: <ChefHat className="w-4 h-4" /> },
    ready: { label: 'Ready for Pickup', color: 'bg-violet-100 text-violet-800 border-violet-200', icon: <Sparkles className="w-4 h-4" /> },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Truck className="w-4 h-4" /> },
    delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <Package className="w-4 h-4" /> },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="w-4 h-4" /> },
};

const UserDashboard: React.FC = () => {
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [phoneInput, setPhoneInput] = useState('');
    const [linkedPhone, setLinkedPhone] = useState('');

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
    }, [user, authLoading, navigate]);

    // Try to get phone from different sources
    useEffect(() => {
        if (user) {
            const phone = user.phone || user.user_metadata?.phone || localStorage.getItem(`user_phone_${user.id}`) || '';
            if (phone) setLinkedPhone(phone);
        }
    }, [user]);

    // Fetch orders when phone is linked using optimized query
    useEffect(() => {
        if (!linkedPhone) {
            setLoadingOrders(false);
            return;
        }
        const fetchOrders = async () => {
            setLoadingOrders(true);
            try {
                // Now using direct phone query instead of getting all orders
                const myOrders = await getOrdersByPhone(linkedPhone);
                // Also try fuzzy match if no orders found and phone has spaces
                if (myOrders.length === 0 && linkedPhone.includes(' ')) {
                    const compressedOrders = await getOrdersByPhone(linkedPhone.replace(/\s/g, ''));
                    setOrders(compressedOrders);
                } else {
                    setOrders(myOrders);
                }
            } catch (err) {
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, [linkedPhone]);

    const handleLinkPhone = (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneInput.trim() && user) {
            localStorage.setItem(`user_phone_${user.id}`, phoneInput.trim());
            setLinkedPhone(phoneInput.trim());
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
            </div>
        );
    }

    if (!user) return null;

    const displayName = user.user_metadata?.full_name || user.email || user.phone || 'Cake Lover';

    return (
        <div className="min-h-screen py-8 px-4 relative">
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-rose-50/80 to-transparent -z-10" />

            <div className="max-w-4xl mx-auto">
                {/* Header Card */}
                <GlassCard className="mb-8 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center shadow-inner">
                            <span className="font-serif text-3xl font-bold text-rose-600">
                                {displayName[0].toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-gray-900">Hello, {displayName}!</h1>
                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                {user.email && <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs border border-gray-100">{user.email}</span>}
                                {linkedPhone && <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs border border-gray-100">{linkedPhone}</span>}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary px-6 py-2 text-sm flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </GlassCard>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Stats or Promos */}
                    <div className="space-y-6">
                        {!linkedPhone && (
                            <GlassCard className="bg-gradient-to-br from-rose-500 to-pink-600 text-white border-none">
                                <h3 className="font-bold text-lg mb-2">Connect Order History</h3>
                                <p className="text-rose-100 text-sm mb-4">Enter your phone number to see past orders.</p>
                                <form onSubmit={handleLinkPhone} className="gap-2 flex flex-col">
                                    <input
                                        type="tel"
                                        value={phoneInput}
                                        onChange={(e) => setPhoneInput(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 rounded-lg text-gray-900 outline-none"
                                        placeholder="+91..."
                                    />
                                    <button type="submit" className="bg-white text-rose-600 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        Link Number
                                    </button>
                                </form>
                            </GlassCard>
                        )}

                        <GlassCard className="border-l-4 border-l-rose-400">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
                                    <Package className="w-6 h-6" />
                                </div>
                                <span className="text-3xl font-bold text-gray-900">{orders.length}</span>
                            </div>
                            <p className="text-gray-500 font-medium">Total Orders</p>
                        </GlassCard>

                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-yellow-300" />
                                <span className="font-bold uppercase tracking-wider text-xs">Pro Tip</span>
                            </div>
                            <p className="text-sm font-medium opacity-90 mb-4">
                                Need a unique cake? Try our AI Chef to design something no one has seen before!
                            </p>
                            <Link to="/ai-chef" className="block text-center bg-white/20 backdrop-blur-md border border-white/50 rounded-lg py-2 font-bold hover:bg-white/30 transition-colors">
                                Try AI Chef
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Order List */}
                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-serif text-2xl font-bold text-gray-900">Your Orders</h2>
                            <Link to="/order" className="btn-primary px-4 py-2 text-xs flex items-center gap-1 shadow-none">
                                + New Order
                            </Link>
                        </div>

                        {loadingOrders ? (
                            <div className="text-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-rose-400 mx-auto mb-2" />
                                <p className="text-gray-400">Fetching delicious data...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-16 bg-white/50 rounded-2xl border border-gray-100 border-dashed">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="font-bold text-gray-700 mb-1">No past orders found</h3>
                                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                                    {linkedPhone ? "We couldn't find any orders linked to this phone number." : "Link your phone number to see your history."}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => {
                                    const status = statusConfig[order.status];
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={order.id}
                                            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden"
                                        >
                                            {/* Status Badge */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="font-mono text-xs font-bold text-gray-400 tracking-wider">#{order.id.slice(0, 8)}...</span>
                                                    <h3 className="font-serif text-xl font-bold text-gray-900 mt-1">{order.cake_flavor}</h3>
                                                </div>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                                                    {status.icon} {status.label}
                                                </span>
                                            </div>

                                            {/* AI Badge */}
                                            {order.ai_concept && (
                                                <div className="absolute top-0 left-0">
                                                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-br-lg shadow-sm">
                                                        AI Designed
                                                    </div>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase tracking-wide font-bold mb-1">Details</p>
                                                    <p className="font-medium text-gray-700">{order.cake_weight} • {order.occasion}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-xs uppercase tracking-wide font-bold mb-1">Date</p>
                                                    <p className="font-medium text-gray-700">{new Date(order.event_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            {order.owner_notes && (
                                                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm flex gap-2">
                                                    <span className="text-xl">👩‍🍳</span>
                                                    <div>
                                                        <span className="font-bold text-amber-800 text-xs uppercase">Baker's Note</span>
                                                        <p className="text-amber-900 leading-snug">{order.owner_notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllOrders } from '../services/orderService';
import { Order, OrderStatus } from '../types';
import { LogOut, Package, Clock, CheckCircle, Truck, ChefHat, XCircle, User, Loader2 } from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-4 h-4" /> },
    baking: { label: 'Baking', color: 'bg-orange-100 text-orange-800', icon: <ChefHat className="w-4 h-4" /> },
    ready: { label: 'Ready', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-4 h-4" /> },
    delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800', icon: <Package className="w-4 h-4" /> },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" /> },
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
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    // Try to get phone from auth metadata
    useEffect(() => {
        if (user) {
            const phone = user.phone || user.user_metadata?.phone || localStorage.getItem(`user_phone_${user.id}`) || '';
            if (phone) {
                setLinkedPhone(phone);
            }
        }
    }, [user]);

    // Fetch orders when phone is linked
    useEffect(() => {
        if (!linkedPhone) {
            setLoadingOrders(false);
            return;
        }
        const fetchOrders = async () => {
            setLoadingOrders(true);
            try {
                const allOrders = await getAllOrders();
                const myOrders = allOrders.filter(
                    (o) => o.customer_phone === linkedPhone || o.customer_phone.replace(/\s/g, '') === linkedPhone.replace(/\s/g, '')
                );
                setOrders(myOrders);
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
            <div className="min-h-screen bg-rose-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
            </div>
        );
    }

    if (!user) return null;

    const displayName = user.user_metadata?.full_name || user.email || user.phone || 'User';

    return (
        <div className="min-h-screen bg-rose-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center">
                                <User className="w-7 h-7 text-rose-600" />
                            </div>
                            <div>
                                <h1 className="font-serif text-2xl font-bold text-gray-900">Hi, {displayName}!</h1>
                                <p className="text-sm text-gray-500">
                                    {user.email && <span>{user.email}</span>}
                                    {user.phone && <span> • {user.phone}</span>}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Phone Link Section (if no phone linked) */}
                {!linkedPhone && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
                        <h2 className="font-serif text-xl font-bold text-gray-900 mb-2">Link Your Phone Number</h2>
                        <p className="text-sm text-gray-600 mb-4">Enter the phone number you used when placing orders to see your order history.</p>
                        <form onSubmit={handleLinkPhone} className="flex gap-3">
                            <input
                                type="tel"
                                value={phoneInput}
                                onChange={(e) => setPhoneInput(e.target.value)}
                                required
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
                                placeholder="+91 98765 43210"
                            />
                            <button
                                type="submit"
                                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
                            >
                                Link
                            </button>
                        </form>
                    </div>
                )}

                {/* Orders */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="w-5 h-5 text-rose-500" /> My Orders
                        </h2>
                        <Link
                            to="/order"
                            className="text-sm bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full font-bold transition-all"
                        >
                            + New Order
                        </Link>
                    </div>

                    {loadingOrders ? (
                        <div className="text-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-rose-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Loading orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="font-bold text-gray-700 mb-1">No orders yet</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {linkedPhone
                                    ? 'No orders found with this phone number.'
                                    : 'Link your phone number above to see your orders.'}
                            </p>
                            <Link
                                to="/order"
                                className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-bold transition-all"
                            >
                                Order Your First Cake 🎂
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const status = statusConfig[order.status];
                                return (
                                    <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-mono text-sm font-bold text-rose-600">{order.id}</span>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${status.color}`}>
                                                        {status.icon} {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-bold">{order.cake_flavor}</span> • {order.cake_weight} • {order.occasion}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    📅 Event: {new Date(order.event_date).toLocaleDateString()} • Ordered: {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {order.ai_concept && (
                                                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold">
                                                    ✨ AI Design
                                                </span>
                                            )}
                                        </div>
                                        {order.owner_notes && (
                                            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                                                <span className="font-bold">📝 Note from bakery:</span> {order.owner_notes}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

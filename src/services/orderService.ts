import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Order, OrderStatus } from '../types';

// --- Local Storage Fallback (works without Supabase) ---
const LOCAL_ORDERS_KEY = 'samyra_orders';

const getLocalOrders = (): Order[] => {
    try {
        const data = localStorage.getItem(LOCAL_ORDERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch { return []; }
};

const saveLocalOrders = (orders: Order[]) => {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
};

const generateId = () => 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

// --- Public API ---

export const createOrder = async (orderData: Omit<Order, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Order> => {
    const now = new Date().toISOString();
    const newOrder: Order = {
        ...orderData,
        id: generateId(),
        status: 'pending',
        created_at: now,
        updated_at: now,
    };

    if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('orders').insert([newOrder]).select().single();
        if (error) throw new Error(error.message);
        return data;
    }

    // Fallback to localStorage
    const orders = getLocalOrders();
    orders.unshift(newOrder);
    saveLocalOrders(orders);
    return newOrder;
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
    if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
        if (error) return null;
        return data;
    }
    const orders = getLocalOrders();
    return orders.find(o => o.id === orderId) || null;
};

export const getOrdersByPhone = async (phone: string): Promise<Order[]> => {
    if (isSupabaseConfigured()) {
        // We try to match both exact phone and maybe variations if needed, but for now exact match is best for security/privacy.
        // If users format differently, we might miss orders, but that's better than leaking.
        // We could also try to strip spaces on the backend via a function, but standardizing input is easier.
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_phone', phone)
            .order('created_at', { ascending: false });

        if (error) return [];
        return data || [];
    }
    const orders = getLocalOrders();
    // Local fallback: simple exact match
    return orders.filter(o => o.customer_phone === phone);
};

export const getAllOrders = async (): Promise<Order[]> => {
    if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) return [];
        return data || [];
    }
    return getLocalOrders();
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus, ownerNotes?: string): Promise<Order | null> => {
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
        const updateData: Record<string, unknown> = { status, updated_at: now };
        if (ownerNotes !== undefined) updateData.owner_notes = ownerNotes;
        const { data, error } = await supabase.from('orders').update(updateData).eq('id', orderId).select().single();
        if (error) return null;
        return data;
    }

    const orders = getLocalOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    orders[idx].status = status;
    orders[idx].updated_at = now;
    if (ownerNotes !== undefined) orders[idx].owner_notes = ownerNotes;
    saveLocalOrders(orders);
    return orders[idx];
};

export const deleteOrder = async (orderId: string): Promise<boolean> => {
    if (isSupabaseConfigured()) {
        const { error } = await supabase.from('orders').delete().eq('id', orderId);
        return !error;
    }
    const orders = getLocalOrders();
    const filtered = orders.filter(o => o.id !== orderId);
    saveLocalOrders(filtered);
    return filtered.length < orders.length;
};

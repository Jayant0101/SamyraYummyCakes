import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface Product {
    id: string;
    name: string;
    category: string;
    price_range: string;
    description: string;
    image_url: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

// Default products (used as fallback when Supabase has no products)
const DEFAULT_PRODUCTS: Product[] = [
    { id: 'default-1', name: 'Classic Chocolate Truffle', category: 'Birthday', price_range: '₹800 - ₹2,500', image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', description: 'Rich dark chocolate layers with velvety ganache.', is_active: true, sort_order: 1, created_at: '', updated_at: '' },
    { id: 'default-2', name: 'Red Velvet Dream', category: 'Wedding', price_range: '₹1,200 - ₹4,000', image_url: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=600&q=80', description: 'Vibrant red sponge with cream cheese frosting.', is_active: true, sort_order: 2, created_at: '', updated_at: '' },
    { id: 'default-3', name: 'Vanilla Bean Elegance', category: 'Anniversary', price_range: '₹700 - ₹2,000', image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=600&q=80', description: 'Light and fluffy vanilla sponge with fresh cream.', is_active: true, sort_order: 3, created_at: '', updated_at: '' },
    { id: 'default-4', name: 'Fondant Fantasy', category: 'Custom', price_range: '₹2,000 - ₹8,000', image_url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80', description: 'Fully customizable fondant cakes for any theme.', is_active: true, sort_order: 4, created_at: '', updated_at: '' },
    { id: 'default-5', name: 'Strawberry Bliss', category: 'Birthday', price_range: '₹900 - ₹3,000', image_url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80', description: 'Fresh strawberry sponge with whipped cream layers.', is_active: true, sort_order: 5, created_at: '', updated_at: '' },
    { id: 'default-6', name: 'Butterscotch Crunch', category: 'Anniversary', price_range: '₹750 - ₹2,200', image_url: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80', description: 'Caramel butterscotch with crunchy praline topping.', is_active: true, sort_order: 6, created_at: '', updated_at: '' },
    { id: 'default-7', name: 'Pineapple Delight', category: 'Birthday', price_range: '₹600 - ₹1,800', image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80', description: 'Tropical pineapple sponge with cherry garnish.', is_active: true, sort_order: 7, created_at: '', updated_at: '' },
    { id: 'default-8', name: 'Black Forest', category: 'Custom', price_range: '₹850 - ₹2,800', image_url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80', description: 'Classic chocolate with kirsch-soaked cherries and whipped cream.', is_active: true, sort_order: 8, created_at: '', updated_at: '' },
    { id: 'default-9', name: 'Rose & Pistachio', category: 'Wedding', price_range: '₹1,500 - ₹5,000', image_url: 'https://images.unsplash.com/photo-1519869325930-281384570c4e?auto=format&fit=crop&w=600&q=80', description: 'Delicate rosewater sponge with pistachio buttercream.', is_active: true, sort_order: 9, created_at: '', updated_at: '' },
];

// --- localStorage fallback ---
const LOCAL_KEY = 'samyra_products';
const getLocalProducts = (): Product[] => {
    try {
        const data = localStorage.getItem(LOCAL_KEY);
        return data ? JSON.parse(data) : [];
    } catch { return []; }
};
const saveLocalProducts = (products: Product[]) => localStorage.setItem(LOCAL_KEY, JSON.stringify(products));

const generateId = () => 'PROD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

// --- Public API ---

export const getActiveProducts = async (): Promise<Product[]> => {
    if (isSupabaseConfigured()) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error || !data || data.length === 0) return DEFAULT_PRODUCTS;
        return data;
    }
    const local = getLocalProducts().filter(p => p.is_active);
    return local.length > 0 ? local : DEFAULT_PRODUCTS;
};

export const getAllProducts = async (): Promise<Product[]> => {
    if (isSupabaseConfigured()) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('sort_order', { ascending: true });
        if (error) return getLocalProducts();
        return data || [];
    }
    return getLocalProducts();
};

export const createProduct = async (input: ProductInput): Promise<Product> => {
    const now = new Date().toISOString();
    const product: Product = {
        ...input,
        id: generateId(),
        created_at: now,
        updated_at: now,
    };

    if (isSupabaseConfigured()) {
        const { data, error } = await supabase.from('products').insert([product]).select().single();
        if (error) throw new Error(error.message);
        return data;
    }

    const products = getLocalProducts();
    products.push(product);
    saveLocalProducts(products);
    return product;
};

export const updateProduct = async (id: string, updates: Partial<ProductInput>): Promise<Product | null> => {
    const now = new Date().toISOString();

    if (isSupabaseConfigured()) {
        const { data, error } = await supabase
            .from('products')
            .update({ ...updates, updated_at: now })
            .eq('id', id)
            .select()
            .single();
        if (error) return null;
        return data;
    }

    const products = getLocalProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...updates, updated_at: now };
    saveLocalProducts(products);
    return products[idx];
};

export const deleteProduct = async (id: string): Promise<boolean> => {
    if (isSupabaseConfigured()) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        return !error;
    }
    const products = getLocalProducts();
    const filtered = products.filter(p => p.id !== id);
    saveLocalProducts(filtered);
    return filtered.length < products.length;
};

export const uploadProductImage = async (file: File): Promise<string> => {
    if (isSupabaseConfigured()) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error } = await supabase.storage
            .from('order-images')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (error) throw new Error('Failed to upload image');

        const { data } = supabase.storage.from('order-images').getPublicUrl(filePath);
        return data.publicUrl;
    }

    // Fallback: data URL
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

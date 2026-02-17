import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Upload an image to Supabase Storage and return the public URL.
 * Falls back to a data URL if Supabase is not configured.
 */
export const uploadOrderImage = async (file: File): Promise<string> => {
    if (isSupabaseConfigured()) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `orders/${fileName}`;

        const { error } = await supabase.storage
            .from('order-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error);
            throw new Error('Failed to upload image');
        }

        const { data } = supabase.storage
            .from('order-images')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }

    // Fallback: convert to base64 data URL (stored in localStorage with the order)
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

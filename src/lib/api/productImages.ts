import { supabase } from "../supabase";

const BUCKET_NAME = "product-images";

export async function uploadProductImage(userId: string, file: File): Promise<string> {
    if (!userId) throw new Error("Yêu cầu thông tin userId để upload ảnh.");
    
    // Validate file type & size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error("Chỉ hỗ trợ định dạng JPG, PNG hoặc WebP.");
    }
    
    if (file.size > 5 * 1024 * 1024) {
        throw new Error("Kích thước file không được vượt quá 5MB.");
    }

    // Path structure: {userId}/{timestamp}-{randomString}.{ext}
    const ext = file.name.split('.').pop() || 'jpg';
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileName = `${Date.now()}-${randomString}.${ext}`;
    const storagePath = `${userId}/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, { 
            upsert: false, 
            contentType: file.type,
            cacheControl: "3600"
        });

    if (uploadError) {
        throw new Error(uploadError.message || "Lỗi khi upload ảnh.");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

    return publicUrl;
}

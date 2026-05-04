import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "product-images";

/**
 * Tạo signed URL để xem ảnh minh chứng của vendor.
 * Nếu URL là public (https://...) thì trả về trực tiếp,
 * nếu là path storage thì tạo signed URL.
 */
export async function createVendorDocumentSignedUrl(
    pathOrUrl: string,
    expiresInSeconds = 60 * 60 // 1 hour
): Promise<string> {
    // Nếu đã là URL đầy đủ thì trả về luôn
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
        return pathOrUrl;
    }

    // Là storage path, tạo signed URL
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(pathOrUrl, expiresInSeconds);

    if (error || !data) {
        throw new Error(error?.message || "Không thể tạo signed URL cho ảnh minh chứng.");
    }

    return data.signedUrl;
}

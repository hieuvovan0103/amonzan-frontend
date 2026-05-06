import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "return-condition-images";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 6;

function getFileExtension(file: File) {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension) return extension;
    if (file.type === "image/png") return "png";
    if (file.type === "image/webp") return "webp";
    return "jpg";
}

export function validateReturnConditionFiles(files: File[]) {
    if (files.length > MAX_FILES) {
        throw new Error(`Chỉ được tải lên tối đa ${MAX_FILES} ảnh hiện trạng.`);
    }

    files.forEach((file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            throw new Error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.");
        }

        if (file.size > MAX_FILE_SIZE) {
            throw new Error("Mỗi ảnh hiện trạng không được vượt quá 5MB.");
        }
    });
}

export async function uploadReturnConditionImages(orderId: string, files: File[]) {
    validateReturnConditionFiles(files);

    if (files.length === 0) return [];

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user?.id) {
        throw new Error("Bạn cần đăng nhập để tải ảnh hiện trạng.");
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
        const extension = getFileExtension(file);
        const randomString = Math.random().toString(36).slice(2, 8);
        const storagePath = `${userData.user.id}/${orderId}/${Date.now()}-${randomString}.${extension}`;

        const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, file, {
                upsert: false,
                contentType: file.type,
                cacheControl: "3600",
            });

        if (uploadError) {
            throw new Error(uploadError.message || "Không thể tải ảnh hiện trạng.");
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

        uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
}

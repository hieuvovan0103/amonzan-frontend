import { supabase } from './supabase';
import { BASE_URL } from './config';

export { BASE_URL };

/**
 * Hàm gọi API tùy chỉnh bọc ngoài fetch API mặc định.
 * Nó sẽ tự động lấy session từ Supabase và chèn chuỗi truy cập "Authorization: Bearer <token>" vào mọi Request.
 */
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Lấy token mới nhất
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = new Headers(options.headers || {});
  
  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`);
  }
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Tuỳ chọn: Nếu Backend (NestJS) trả 401 Unauthorized do token sai/hết hạn, có thể kích hoạt đăng xuất tự động
  if (response.status === 401) {
    console.warn("Token expired or invalid. Auto logging out...");
    await supabase.auth.signOut();
  }

  return response;
}

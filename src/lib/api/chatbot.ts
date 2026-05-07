import { fetchWithAuth } from '@/lib/apiClient';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatModel = 'openai' | 'gemini';

export async function sendChatMessage(
  messages: ChatMessage[],
  model: ChatModel = 'openai',
): Promise<string> {
  const response = await fetchWithAuth('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ messages, model }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Không thể kết nối với chatbot. Vui lòng thử lại.');
  }

  const data = await response.json();
  return data.reply as string;
}

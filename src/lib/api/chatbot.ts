import { BASE_URL } from '@/lib/config';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatModel = 'openai' | 'gemini';

export async function sendChatMessage(
  messages: ChatMessage[],
  model: ChatModel = 'openai',
): Promise<string> {
  const response = await fetch(`${BASE_URL}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, model }),
  });

  if (!response.ok) {
    throw new Error('Không thể kết nối với chatbot. Vui lòng thử lại.');
  }

  const data = await response.json();
  return data.reply as string;
}

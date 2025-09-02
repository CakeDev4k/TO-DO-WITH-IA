// Tipagem para mensagens do chat
export interface Message {
    type: 'user' | 'bot';
    message: string;
}

// Tipagem para a resposta do Gemini
export interface GeminiResponse {
    action: 'add_todo' | 'add_category' | 'generate_todo_list' | 'respond';
    text?: string;
    category?: string;
    name?: string;
    todos?: string[];
}
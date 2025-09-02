import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_REACT_APP_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const generateResponse = async (prompt: string, selectedCategory: string): Promise<string> => {
    const systemPrompt = `
      Analise a mensagem do usuário e responda SOMENTE com um objeto JSON estrito, sem texto extra, sem formatação de markdown (sem \`\`\`json ou qualquer outro envoltório), e sem comentários. Retorne apenas a string JSON pura.
      - Se for para adicionar um to-do: { "action": "add_todo", "text": "descrição do to-do", "category": "categoria especificada no prompt ou, se não especificada, usar '${selectedCategory}'" }
      - Se for para adicionar uma categoria: { "action": "add_category", "name": "nome da categoria" }
      - Se for para gerar uma lista de to-dos baseada em um tópico (ex: "me faça um todo para como fazer X"): { "action": "generate_todo_list", "category": "nome da categoria baseado no tópico", "todos": ["passo1", "passo2", ...] }
      - Para qualquer outra coisa: { "action": "respond", "text": "sua resposta conversacional" }
      Exemplo de input: "Adicione to-do: Estudar React na categoria Estudos"
      Exemplo de output: {"action":"add_todo","text":"Estudar React","category":"Estudos"}
      Exemplo de input: "Adicione to-do: Estudar React"
      Exemplo de output: {"action":"add_todo","text":"Estudar React","category":"${selectedCategory}"}
      Exemplo de input: "Me faça um todo para como fazer uma aplicação React"
      Exemplo de output: {"action":"generate_todo_list","category":"Aplicação React","todos":["Instalar Node.js","Criar projeto com create-react-app","Configurar componentes","Adicionar rotas","Fazer requisições API"]}
    `;
    const fullPrompt = `${systemPrompt}\nMensagem do usuário: ${prompt}`;
    const result = await model.generateContent(fullPrompt);

    return result.response.text();
};

export { generateResponse };
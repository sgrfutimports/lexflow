import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLegalDraft = async (
  docType: string,
  partyA: string,
  partyB: string,
  details: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Erro: Chave de API não configurada.";

  const prompt = `
    Aja como um advogado sênior especialista em direito brasileiro.
    Escreva um(a) ${docType} completo(a).
    Parte A (Cliente): ${partyA}
    Parte B (Parte Contrária): ${partyB}
    Detalhes do caso/pedido: ${details}

    Regras:
    1. Use linguagem jurídica formal e culta.
    2. Cite artigos de lei relevantes (Código Civil, CPC, Constituição) quando aplicável.
    3. Estruture com cabeçalho, qualificação das partes, dos fatos, do direito, dos pedidos e encerramento.
    4. Formate a saída em Markdown limpo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar o documento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ocorreu um erro ao comunicar com a IA.";
  }
};

export const askLegalAssistant = async (query: string, context?: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Erro: Chave de API não configurada.";

  const prompt = `
    Você é o LexFlow AI, um assistente jurídico inteligente.
    Responda à seguinte dúvida ou solicitação jurídica de forma precisa e concisa.
    
    Contexto adicional (se houver): ${context || 'Nenhum'}
    
    Pergunta: ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    return response.text || "Sem resposta.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro no serviço de IA.";
  }
};

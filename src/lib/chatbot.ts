const MISTRAL_API_KEY = process.env.EXPO_PUBLIC_MISTRAL_API_KEY;
const MISTRAL_AGENT_ID = process.env.EXPO_PUBLIC_MISTRAL_AGENT_ID;

export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
};

export async function chatWithAI(messages: ChatMessage[]): Promise<string> {
    if (!MISTRAL_API_KEY || !MISTRAL_AGENT_ID) {
        throw new Error('Mistral API key or Agent ID not configured');
    }

    const response = await fetch('https://api.mistral.ai/v1/agents/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
            agent_id: MISTRAL_AGENT_ID,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || 'Sorry, ik kon geen antwoord genereren.';
    return stripMarkdown(raw);
}

function stripMarkdown(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold**
        .replace(/\*(.+?)\*/g, '$1')        // *italic*
        .replace(/__(.+?)__/g, '$1')        // __bold__
        .replace(/_(.+?)_/g, '$1')          // _italic_
        .replace(/^#{1,6}\s+/gm, '')        // ### headers
        .replace(/`(.+?)`/g, '$1');         // `code`
}

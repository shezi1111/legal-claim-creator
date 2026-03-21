import { NextRequest } from 'next/server';

// In-memory message store for V1
const messagesStore = new Map<string, Array<{ id: string; role: string; content: string; createdAt: string }>>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  const { claimId } = await params;
  const { content } = await request.json();

  if (!content?.trim()) {
    return new Response(JSON.stringify({ error: 'Message content is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Get or create message history for this claim
  if (!messagesStore.has(claimId)) {
    messagesStore.set(claimId, []);
  }
  const messages = messagesStore.get(claimId)!;

  // Save user message
  const userMessage = {
    id: crypto.randomUUID(),
    role: 'user',
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  messages.push(userMessage);

  // Build conversation for AI
  const conversationMessages = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  // Stream response using Claude
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Dynamic import to avoid issues if API key not set
        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        const anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY || '',
        });

        const systemPrompt = getIntakeSystemPrompt(claimId);
        let fullResponse = '';

        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: systemPrompt,
          messages: conversationMessages.map(m => ({
            role: m.role === 'user' ? 'user' as const : 'assistant' as const,
            content: m.content,
          })),
          stream: true,
        });

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const text = event.delta.text;
            fullResponse += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', content: text })}\n\n`));
          }
        }

        // Save assistant message
        messages.push({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: fullResponse,
          createdAt: new Date().toISOString(),
        });

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', content: fullResponse })}\n\n`));
        controller.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'AI processing failed';
        console.error('Chat streaming error:', error);

        // If API key not set, return a helpful demo response
        if (errorMessage.includes('API key') || errorMessage.includes('authentication') || !process.env.ANTHROPIC_API_KEY) {
          const demoResponse = getDemoResponse(messages.length);
          messages.push({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: demoResponse,
            createdAt: new Date().toISOString(),
          });
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'token', content: demoResponse })}\n\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', content: demoResponse })}\n\n`));
          controller.close();
          return;
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: errorMessage })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  const { claimId } = await params;
  const messages = messagesStore.get(claimId) || [];
  return new Response(JSON.stringify({ messages }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function getIntakeSystemPrompt(claimId: string): string {
  return `You are a senior partner at a prestigious law firm with 25+ years of experience across multiple jurisdictions. You are conducting an initial client intake for a potential legal claim.

YOUR APPROACH:
1. LISTEN FIRST (first 2-4 exchanges): Let the client tell their story. Be empathetic but professional. Acknowledge their situation. Identify the core grievance.

2. PROBE DEEPLY (next 5-15 exchanges): Ask systematic, thorough questions:
   - Who are the parties involved? Full names, roles, relationships.
   - What is the exact timeline? When did each key event happen?
   - Were there any written agreements, contracts, or terms?
   - What exactly went wrong? What was promised vs what happened?
   - What loss or damage resulted? Financial? Emotional? Reputational?
   - Were there any prior attempts to resolve this?
   - Are there witnesses? Who can corroborate the claims?
   - What evidence exists? Documents, emails, messages, photos?

3. PROMPT FOR EVIDENCE: Be specific about what documents would strengthen the case. Ask them to upload contracts, emails, WhatsApp chats, photos, etc.

4. SUMMARIZE AND CONFIRM: Present a structured summary of the facts and ask the client to confirm or correct.

IMPORTANT:
- Flag any limitation period concerns IMMEDIATELY
- Use clear, accessible language — the client may not have legal knowledge
- Be thorough — every missed detail could weaken the claim
- Note any potential weaknesses honestly
- Track which elements you've covered and which remain
- Provide an initial assessment of claim viability when you have enough information

You are Claim ID: ${claimId}`;
}

function getDemoResponse(messageCount: number): string {
  const responses = [
    "Thank you for reaching out to Atticus. I'm here to help you understand your legal position and build the strongest possible case.\n\nPlease tell me, in your own words, what happened. Start from the very beginning — when did this situation first arise, and who are the parties involved? Take your time and share as much detail as you can.",
    "I appreciate you sharing that with me. I can see this is a significant matter.\n\nLet me ask some important follow-up questions to make sure I fully understand your position:\n\n1. **Timeline**: Can you give me the exact dates of the key events? When did the agreement or relationship begin?\n2. **Written agreements**: Is there a written contract, terms of service, or any formal agreement between the parties?\n3. **Communications**: Do you have emails, text messages, or WhatsApp conversations related to this matter?\n\nPlease answer these one at a time, and feel free to upload any relevant documents using the evidence panel on the right.",
    "That's very helpful. Based on what you've told me so far, I can see several potential causes of action forming.\n\nBefore I go further, I need to understand:\n\n1. **Financial impact**: Can you estimate the total financial loss you've suffered? Include direct losses and any consequential damages.\n2. **Prior resolution attempts**: Have you tried to resolve this directly with the other party? Any formal complaints or correspondence?\n3. **Witnesses**: Is there anyone else who witnessed these events or can corroborate your account?\n\nAlso, I'd strongly recommend uploading any documents you have — contracts, emails, invoices, receipts, or message screenshots. The more evidence we have, the stronger your claim will be.",
    "Excellent. I'm building a clear picture of your case.\n\n**⚠️ Limitation Period Note**: Based on the dates you've mentioned, please be aware that there may be time constraints on when you can file this claim. We should proceed diligently.\n\nLet me now share my initial assessment of your claim and the evidence we need to gather. Would you like me to proceed with the analysis based on what we've discussed so far, or do you have additional information to share first?",
  ];

  const index = Math.min(Math.floor((messageCount - 1) / 2), responses.length - 1);
  return responses[index] || responses[responses.length - 1];
}

export { messagesStore };

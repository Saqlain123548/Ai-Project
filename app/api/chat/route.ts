export const runtime = "nodejs";

import { NextResponse } from "next/server";
import OpenAI from "openai";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// In-memory storage for conversations (use database in production)
const conversations: Map<string, ChatMessage[]> = new Map();

export async function POST(req: Request) {
  try {
    const { message, conversationId }: { message: string; conversationId: string } = await req.json();
    const startTime = Date.now();

    // Initialize conversation if needed
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, [
        { role: "system", content: "You are Zehra, an intelligent and witty AI assistant. You provide helpful, accurate, and engaging responses. You have a calm and grounded personality but aren't afraid to show some personality." }
      ]);
    }

    // Add user message to history
    const currentHistory = conversations.get(conversationId) || [];
    currentHistory.push({ role: "user", content: message });
    conversations.set(conversationId, currentHistory);

    // Check for mock mode
    if (process.env.NODE_ENV === "development" && !process.env.OPENAI_API_KEY) {
      // Simulated response with typing effect
      const mockResponse = `I see you're testing Zehra! Here's what you said: "${message}". 

In development mode without an API key, I'm just echoing your messages. 

**When you add OPENAI_API_KEY, I'll be able to:**
- Answer your questions intelligently
- Help with coding tasks
- Have natural conversations
- Remember context from our chat

You can configure your API key in the environment variables! 🔑`;
      
      return NextResponse.json({
        reply: mockResponse,
        responseTime: Date.now() - startTime,
        history: currentHistory
      });
    }

    // Real OpenAI request
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: currentHistory as OpenAI.Chat.ChatCompletionMessageParam[],
    });

    const reply = response.choices[0]?.message?.content || "I couldn't generate a response.";

    // Add assistant response to history
    currentHistory.push({ role: "assistant", content: reply });
    conversations.set(conversationId, currentHistory);

    return NextResponse.json({
      reply,
      responseTime: Date.now() - startTime,
      history: currentHistory
    });
  } catch (err) {
    console.error("OPENAI ERROR:", err);
    return NextResponse.json({ error: "OpenAI failed" }, { status: 500 });
  }
}

// Endpoint to get conversation history
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  
  if (!conversationId) {
    return NextResponse.json({ conversations: Array.from(conversations.entries()) });
  }
  
  const history = conversations.get(conversationId) || [];
  return NextResponse.json({ history });
}

// Endpoint to delete a conversation
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");
  
  if (conversationId) {
    conversations.delete(conversationId);
    return NextResponse.json({ success: true, message: "Conversation deleted" });
  }
  
  return NextResponse.json({ error: "No conversation ID provided" }, { status: 400 });
}


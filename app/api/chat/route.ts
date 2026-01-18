import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';


export const maxDuration = 30;
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai('gpt-5.1'),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
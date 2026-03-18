import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText } from "ai";

const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  },
});

const REASONING_DISABLED_MODELS = ["qwen/qwen-turbo"];

export async function POST(req: Request) {
  const { messages, model, systemPrompt } = await req.json();

  const selectedModel = model || "deepseek/deepseek-v3.2";

  const result = streamText({
    model: openrouter.languageModel(selectedModel),
    system: systemPrompt || "You are a helpful assistant. Be concise and clear.",
    messages,
    ...(REASONING_DISABLED_MODELS.includes(selectedModel)
      ? { providerOptions: { openrouter: { reasoning: { exclude: true } } } }
      : {}),
  });

  return result.toDataStreamResponse();
}

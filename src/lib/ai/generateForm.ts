import OpenAI from "openai";
import { aiFormResponseSchema, type AIFormResponse } from "@/lib/zod/buildSchema";
import { nanoid } from "nanoid";

const SYSTEM_PROMPT = `You are a form-structure generator. Given a description, output ONLY a JSON object with this exact shape:
{
  "title": "string",
  "description": "string (optional)",
  "fields": [
    {
      "id": "short random alphanumeric string",
      "type": "one of: text, email, number, textarea, select, radio, checkbox, rating, file, date",
      "label": "human readable label",
      "placeholder": "optional placeholder text",
      "required": true/false,
      "options": ["only for select/radio/checkbox"],
      "minRating": 1,
      "maxRating": 5
    }
  ]
}
Rules:
- Use the simplest field type that fits the data being collected.
- For choice fields (select/radio/checkbox) provide 2-6 sensible options.
- For ratings, set minRating=1 and maxRating=5 unless the user specifies otherwise.
- Mark fields as required=true only when the description implies it.
- Do not include any explanation, markdown, code fences, or text outside the JSON.`;

const FIX_PROMPT_SUFFIX = `\n\nYour previous response failed validation. Return ONLY valid JSON matching the schema. Do not add commentary.`;

function getClient(): OpenAI {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) {
    throw new Error(
      "LLM_API_KEY is not set. Add it to .env.local to enable AI generation.",
    );
  }

  const provider = (process.env.LLM_PROVIDER ?? "openrouter").toLowerCase();
  let baseURL: string;
  switch (provider) {
    case "cerebras":
      baseURL = "https://api.cerebras.ai/v1";
      break;
    case "openrouter":
    default:
      baseURL = "https://openrouter.ai/api/v1";
      break;
  }

  return new OpenAI({ apiKey, baseURL });
}

function safeJsonParse(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("LLM response did not contain a JSON object");
  }
  return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
}

function normalizeIds(payload: AIFormResponse): AIFormResponse {
  return {
    ...payload,
    fields: payload.fields.map((f) => ({
      ...f,
      id: f.id && f.id.length > 0 ? f.id : nanoid(8),
    })),
  };
}

export async function generateForm(
  userPrompt: string,
): Promise<AIFormResponse> {
  const client = getClient();
  const model = process.env.LLM_MODEL ?? "openrouter/auto";

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ];

  const first = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.4,
    response_format: { type: "json_object" },
  });

  const firstContent = first.choices[0]?.message?.content ?? "";
  try {
    const parsed = aiFormResponseSchema.parse(safeJsonParse(firstContent));
    return normalizeIds(parsed);
  } catch (firstErr) {
    const retry = await client.chat.completions.create({
      model,
      messages: [
        ...messages,
        {
          role: "user",
          content: `${firstContent}\n\nError: ${(firstErr as Error).message}${FIX_PROMPT_SUFFIX}`,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });
    const retryContent = retry.choices[0]?.message?.content ?? "";
    const parsed = aiFormResponseSchema.parse(safeJsonParse(retryContent));
    return normalizeIds(parsed);
  }
}

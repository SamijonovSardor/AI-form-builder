import { NextResponse } from "next/server";
import { generateForm } from "@/lib/ai/generateForm";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt =
    typeof payload === "object" && payload !== null && "prompt" in payload
      ? String((payload as { prompt: unknown }).prompt ?? "").trim()
      : "";

  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  if (!process.env.LLM_API_KEY) {
    return NextResponse.json(
      { error: "LLM_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  try {
    const result = await generateForm(prompt);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[generate-form]", err);
    const message = err instanceof Error ? err.message : "Could not generate form";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

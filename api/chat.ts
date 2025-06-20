import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: body.messages,
  });

  return NextResponse.json({
    messages: [...body.messages, completion.choices[0].message],
  });
}

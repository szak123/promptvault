export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: `You are an expert prompt engineer who helps professionals write better prompts for AI tools. When given a prompt, return ONLY a raw JSON object with two keys: "improved" (the rewritten prompt as a string) and "explanation" (2-3 sentences explaining what you changed and why, in plain language). No markdown, no backticks, just the raw JSON object.`,
        messages: [{ role: 'user', content: `Improve this prompt:\n\n${prompt}` }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

    return NextResponse.json(parsed)
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

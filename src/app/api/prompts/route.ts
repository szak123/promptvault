import { NextResponse } from 'next/server'
import { STARTER_PROMPTS } from '@/lib/prompts'

export async function GET() {
  return NextResponse.json(STARTER_PROMPTS)
}

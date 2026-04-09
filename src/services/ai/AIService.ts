import { SPACES_SYSTEM_PROMPT, STAGING_SYSTEM_PROMPT } from './prompts'
import type { SpaceAnalysisResponse, StagingAnalysisResponse } from '@/types'

const OPENROUTER_API_URL = import.meta.env.DEV
  ? '/openrouter/api/v1/chat/completions'
  : 'https://openrouter.ai/api/v1/chat/completions'

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string

async function callOpenRouter(
  model: string,
  systemPrompt: string,
  imageDataUrl: string
): Promise<string> {
  if (!API_KEY || API_KEY === 'undefined') {
    throw new Error('OpenRouter API key is missing. Check that VITE_OPENROUTER_API_KEY is set in .env and restart the dev server.')
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://resetmyspace.app',
      'X-Title': 'Reset My Space',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: imageDataUrl },
            },
            {
              type: 'text',
              text: systemPrompt,
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.4,
      max_tokens: 1200,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('[OpenRouter]', response.status, err)
    throw new Error(`OpenRouter error ${response.status}: ${err}`)
  }

  const data = await response.json() as {
    choices: { message: { content: string } }[]
  }
  return data.choices[0].message.content
}

function parseJson<T>(raw: string): T {
  // Strip markdown fences if model ignores the instruction
  const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
  return JSON.parse(cleaned) as T
}

export async function analyzeSpace(
  imageDataUrl: string,
  model: string
): Promise<SpaceAnalysisResponse> {
  const raw = await callOpenRouter(model, SPACES_SYSTEM_PROMPT, imageDataUrl)
  const result = parseJson<SpaceAnalysisResponse>(raw)

  // Clamp score
  result.score = Math.max(0, Math.min(100, Math.round(result.score)))
  result.breakdownMetrics = result.breakdownMetrics.map((m) => ({
    ...m,
    score: Math.max(0, Math.min(100, Math.round(m.score))),
  }))

  return result
}

export async function analyzeStaging(
  imageDataUrl: string,
  model: string
): Promise<StagingAnalysisResponse> {
  const raw = await callOpenRouter(model, STAGING_SYSTEM_PROMPT, imageDataUrl)
  return parseJson<StagingAnalysisResponse>(raw)
}

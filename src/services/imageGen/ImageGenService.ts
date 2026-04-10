// In dev, route through Vite proxy to avoid CORS. Native Capacitor calls direct.
const REPLICATE_BASE = import.meta.env.DEV
  ? '/replicate/v1'
  : 'https://api.replicate.com/v1'
const API_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN as string

/**
 * Build model-specific input payload.
 * Different Replicate models have different field names and capabilities.
 */
function buildInput(model: string, imageBase64: string, prompt: string): Record<string, unknown> {
  const fullPrompt = `Interior design photo: ${prompt}. Photorealistic, professional interior photography, warm lighting, clean and organized.`
  const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`

  if (model.includes('flux-kontext')) {
    // Flux Kontext: image-editing model, uses input_image
    return {
      prompt: fullPrompt,
      input_image: imageDataUrl,
      output_format: 'webp',
      output_quality: 85,
    }
  }

  if (model.includes('flux-dev')) {
    // Flux Dev: text-to-image only, no image input
    return {
      prompt: fullPrompt,
      num_inference_steps: 28,
      guidance: 3.5,
      output_format: 'webp',
      output_quality: 85,
    }
  }

  // flux-1.1-pro and others: standard image-to-image
  return {
    prompt: fullPrompt,
    image: imageDataUrl,
    num_inference_steps: 28,
    guidance_scale: 3.5,
    strength: 0.75,
    output_format: 'webp',
    output_quality: 85,
  }
}

/**
 * Generate an optimized room rendering using Replicate.
 * Returns a URL to the generated image.
 */
export async function generateRoomRendering(
  imageDataUrl: string,
  prompt: string,
  model: string
): Promise<string> {
  if (!API_TOKEN) {
    throw new Error('Replicate API token is missing. Add VITE_REPLICATE_API_TOKEN to .env')
  }

  const base64 = imageDataUrl.replace(/^data:image\/\w+;base64,/, '')
  const [owner, name] = model.split('/')
  const createUrl = `${REPLICATE_BASE}/models/${owner}/${name}/predictions`

  const response = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      Prefer: 'wait',
    },
    body: JSON.stringify({
      input: buildInput(model, base64, prompt),
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Replicate error ${response.status}: ${err}`)
  }

  const prediction = await response.json() as {
    status: string
    output: string | string[] | null
    id: string
    urls?: { get: string }
  }

  if (prediction.status === 'processing' || prediction.status === 'starting') {
    return await pollPrediction(prediction.id)
  }

  return extractOutput(prediction.output)
}

async function pollPrediction(id: string): Promise<string> {
  const maxAttempts = 30
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 3000))

    const res = await fetch(`${REPLICATE_BASE}/predictions/${id}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    })
    const prediction = await res.json() as {
      status: string
      output: string | string[] | null
    }

    if (prediction.status === 'succeeded') {
      return extractOutput(prediction.output)
    }
    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(`Replicate prediction ${prediction.status}`)
    }
  }
  throw new Error('Replicate prediction timed out')
}

function extractOutput(output: string | string[] | null): string {
  if (!output) throw new Error('No output from Replicate')
  return Array.isArray(output) ? output[0] : output
}

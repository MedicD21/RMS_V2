/**
 * Amazon Product Advertising API 5.0 adapter.
 *
 * PA API requires server-side request signing (AWS Signature V4).
 * This adapter assumes you have a lightweight proxy endpoint that:
 *   1. Receives { query, limit } as POST body
 *   2. Signs the PA API request server-side
 *   3. Returns Product[] in our schema
 *
 * Set VITE_AMAZON_PROXY_URL in .env.production to your proxy URL.
 * Leave unset to use MockAmazonAdapter during development.
 */
import type { Product } from '@/types'
import type { AmazonService } from './AmazonService'

const PROXY_URL = import.meta.env.VITE_AMAZON_PROXY_URL as string | undefined

export const paApiAdapter: AmazonService = {
  async searchProducts(query: string, limit = 3): Promise<Product[]> {
    if (!PROXY_URL) {
      throw new Error('VITE_AMAZON_PROXY_URL is not set. Use MockAmazonAdapter in development.')
    }

    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit }),
    })

    if (!response.ok) {
      throw new Error(`Amazon proxy error ${response.status}`)
    }

    return response.json() as Promise<Product[]>
  },
}

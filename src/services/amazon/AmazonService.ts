import type { Product } from '@/types'

export interface AmazonService {
  searchProducts(query: string, limit?: number): Promise<Product[]>
}

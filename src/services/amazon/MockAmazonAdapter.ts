import type { Product } from '@/types'
import type { AmazonService } from './AmazonService'

const AFFILIATE_TAG = 'Reasonhome-20'

function affiliateUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`
}

// Curated realistic organizational products
// Placeholder images use placehold.co — swap for real PA API images in production
function placeholder(label: string): string {
  const encoded = encodeURIComponent(label)
  return `https://placehold.co/400x300/243D4A/E8953A?text=${encoded}&font=inter`
}

const MOCK_PRODUCTS: Product[] = [
  {
    asin: 'B07DFDS8CX',
    title: 'SONGMICS 3-Tier Storage Shelf Organizer with Bins',
    price: 39.99,
    imageUrl: placeholder('Shelf+Organizer'),
    affiliateUrl: affiliateUrl('B07DFDS8CX'),
  },
  {
    asin: 'B08BNHV1S1',
    title: 'mDesign Stackable Plastic Storage Organizer Bin with Handles',
    price: 24.99,
    imageUrl: placeholder('Storage+Bin'),
    affiliateUrl: affiliateUrl('B08BNHV1S1'),
  },
  {
    asin: 'B09Q56W84N',
    title: 'IRIS USA Modular Cable Management Box, Set of 2',
    price: 22.49,
    imageUrl: placeholder('Cable+Management'),
    affiliateUrl: affiliateUrl('B09Q56W84N'),
  },
  {
    asin: 'B01N3RSNXM',
    title: 'SimpleHouseware Under Bed Storage Bags, Set of 4',
    price: 28.97,
    imageUrl: placeholder('Under-Bed+Storage'),
    affiliateUrl: affiliateUrl('B01N3RSNXM'),
  },
  {
    asin: 'B08P4MGQJQ',
    title: 'Rubbermaid Brilliance Pantry Storage Containers, 10-Piece Set',
    price: 44.99,
    imageUrl: placeholder('Pantry+Containers'),
    affiliateUrl: affiliateUrl('B08P4MGQJQ'),
  },
  {
    asin: 'B07C5JWKV4',
    title: 'Bamboo Drawer Organizer Dividers, Set of 5',
    price: 18.99,
    imageUrl: placeholder('Drawer+Organizer'),
    affiliateUrl: affiliateUrl('B07C5JWKV4'),
  },
  {
    asin: 'B07GXCZ3GV',
    title: 'Over Door Shoe Organizer with 24 Pockets',
    price: 15.99,
    imageUrl: placeholder('Shoe+Organizer'),
    affiliateUrl: affiliateUrl('B07GXCZ3GV'),
  },
  {
    asin: 'B084HQXJ2V',
    title: 'Magnetic Spice Rack for Refrigerator, Set of 6',
    price: 31.99,
    imageUrl: placeholder('Spice+Rack'),
    affiliateUrl: affiliateUrl('B084HQXJ2V'),
  },
  {
    asin: 'B09NXC42VH',
    title: 'VIVO Dual Monitor Desk Mount Stand, Adjustable Arms',
    price: 49.99,
    imageUrl: placeholder('Monitor+Mount'),
    affiliateUrl: affiliateUrl('B09NXC42VH'),
  },
  {
    asin: 'B08N5M7S6K',
    title: 'Acrylic Makeup Organizer with Drawers, 7-Piece Set',
    price: 33.99,
    imageUrl: placeholder('Makeup+Organizer'),
    affiliateUrl: affiliateUrl('B08N5M7S6K'),
  },
]

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export const mockAmazonAdapter: AmazonService = {
  async searchProducts(_query: string, limit = 3): Promise<Product[]> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600))
    return shuffle(MOCK_PRODUCTS).slice(0, limit)
  },
}

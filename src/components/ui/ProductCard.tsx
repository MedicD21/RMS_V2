import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <div
      className="flex-shrink-0 w-44 rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Product image */}
      <div className="w-full h-36 overflow-hidden flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-contain p-2"
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget
            el.style.display = 'none'
            const parent = el.parentElement
            if (parent) {
              parent.innerHTML = '<span style="font-size:2rem">📦</span>'
            }
          }}
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p
          className="text-xs font-medium leading-snug line-clamp-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {product.title}
        </p>
        <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          {price}
        </p>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block text-center text-xs font-semibold py-2 rounded-xl transition-opacity active:opacity-70"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          View on Amazon
        </a>
      </div>
    </div>
  )
}

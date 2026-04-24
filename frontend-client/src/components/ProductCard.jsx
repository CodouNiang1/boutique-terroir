import { useCart } from '../context/CartContext'

const CATEGORY_EMOJI = {
  fruits: '🥭', legumes: '🧅', laitier: '🥛', miel: '🍯', conserves: '🫙'
}

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart()
  const inCart = cart.find(i => i.id === product.id)
  const outOfStock = product.stock === 0

  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      padding: '1.2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.7rem',
      boxShadow: 'var(--shadow)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      opacity: outOfStock ? 0.6 : 1,
    }}
      onMouseEnter={e => { if (!outOfStock) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,90,39,0.12)' }}}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
    >
      {/* Emoji visuel */}
      <div style={{
        fontSize: '3rem',
        textAlign: 'center',
        background: 'var(--cream)',
        borderRadius: '8px',
        padding: '1rem',
      }}>
        {CATEGORY_EMOJI[product.categorie] || '🌾'}
      </div>

      {/* Info */}
      <div>
        <span className={`tag tag-${product.categorie}`}>{product.categorie}</span>
        <h3 style={{ marginTop: '0.4rem', fontSize: '1rem', color: 'var(--text-dark)' }}>{product.nom}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '2px' }}>
          Par {product.producteur}
        </p>
      </div>

      {/* Attributs */}
      {product.attributs?.bio && (
        <span style={{ fontSize: '0.75rem', color: 'var(--forest)', fontWeight: 700 }}>🌱 Bio</span>
      )}

      {/* Prix + stock */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--forest)', fontFamily: 'Playfair Display, serif' }}>
          {product.prix.toLocaleString('fr-SN')} FCFA
        </span>
        <span style={{
          fontSize: '0.75rem',
          color: product.stock < 5 ? '#dc2626' : 'var(--text-light)',
          fontWeight: product.stock < 5 ? 700 : 400,
        }}>
          {outOfStock ? '❌ Rupture' : product.stock < 5 ? `⚠️ ${product.stock} restants` : `✅ ${product.stock} en stock`}
        </span>
      </div>

      {/* Bouton */}
      <button
        className="btn-primary"
        disabled={outOfStock}
        onClick={() => addToCart(product)}
        style={{ width: '100%' }}
      >
        {inCart ? `✓ Dans le panier (${inCart.quantite})` : 'Ajouter au panier'}
      </button>
    </div>
  )
}

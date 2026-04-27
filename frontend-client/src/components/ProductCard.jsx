import { useCart } from '../context/CartContext'

const CATEGORY_EMOJI = {
  fruits: '🍋', legumes: '🥦', fromages: '🧀', miel: '🍯',
  conserves: '🫙', cereales: '🌾', laitier: '🥛', huiles: '🫒'
}

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart()
  const inCart = cart.find(i => i.id === product.id)
  const outOfStock = product.stock === 0

  return (
    <div style={{
      background: 'white', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: 'var(--shadow)', opacity: outOfStock ? 0.6 : 1,
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { if (!outOfStock) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,90,39,0.12)' }}}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
    >
      {/* Image produit */}
      <div style={{
        height: '180px', background: 'var(--cream)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative',
      }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.nom}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <div style={{
          fontSize: '3.5rem', display: product.image_url ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%'
        }}>
          {CATEGORY_EMOJI[product.categorie] || '🌾'}
        </div>
        {product.attributs?.bio && (
          <span style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'var(--forest)', color: 'white',
            padding: '3px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
          }}>🌱 Bio</span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <span className={`tag tag-${product.categorie}`}>{product.categorie}</span>
        <h3 style={{ fontSize: '0.95rem', color: 'var(--text-dark)', margin: 0 }}>{product.nom}</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>Par {product.producteur}</p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--forest)', fontFamily: 'Playfair Display, serif' }}>
            {product.prix.toLocaleString('fr-SN')} FCFA
          </span>
          <span style={{
            fontSize: '0.72rem',
            color: product.stock < 5 ? '#dc2626' : 'var(--text-light)',
            fontWeight: product.stock < 5 ? 700 : 400,
          }}>
            {outOfStock ? '❌ Rupture' : product.stock < 5 ? `⚠️ ${product.stock} restants` : `✅ ${product.stock} en stock`}
          </span>
        </div>

        <button
          className="btn-primary"
          disabled={outOfStock}
          onClick={() => addToCart(product)}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          {inCart ? `✓ Dans le panier (${inCart.quantite})` : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  )
}

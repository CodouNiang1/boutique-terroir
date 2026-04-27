import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { itemCount } = useCart()
  return (
    <nav style={{
      background: 'white', borderBottom: '1px solid var(--border)',
      padding: '0 2rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: '68px',
      position: 'sticky', top: 0, zIndex: 100, boxShadow: 'var(--shadow)',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/logo.svg" alt="Logo Yaye Saye" style={{ width: '48px', height: '48px' }} />
        <div>
          <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--forest)', fontWeight: 700, margin: 0 }}>
            Boutique Yaye Saye
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', margin: 0, letterSpacing: '1px' }}>TERROIR LOCAL · SÉNÉGAL</p>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/boutique" style={{ color: 'var(--text-mid)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          Boutique
        </Link>
        <Link to="/suivi" style={{ color: 'var(--text-mid)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          Suivi commande
        </Link>
        <Link to="/cart" style={{
          position: 'relative', background: 'var(--forest)', color: 'white',
          padding: '8px 18px', borderRadius: '8px', textDecoration: 'none',
          fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem',
        }}>
          🛒 Panier
          {itemCount > 0 && (
            <span style={{
              background: 'var(--earth-light)', color: 'white', borderRadius: '50%',
              width: '22px', height: '22px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
            }}>{itemCount}</span>
          )}
        </Link>
      </div>
    </nav>
  )
}

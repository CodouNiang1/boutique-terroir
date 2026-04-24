import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { itemCount } = useCart()

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow)',
    }}>
      <Link to="/boutique" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.8rem' }}>🌿</span>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.4rem',
          color: 'var(--forest)',
          fontWeight: 700,
        }}>Terroir Local</span>
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/boutique" style={{ color: 'var(--text-mid)', textDecoration: 'none', fontWeight: 600 }}>
          Boutique
        </Link>
        <Link to="/cart" style={{
          position: 'relative',
          background: 'var(--forest)',
          color: 'white',
          padding: '8px 18px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          🛒 Panier
          {itemCount > 0 && (
            <span style={{
              background: 'var(--earth-light)',
              color: 'white',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>{itemCount}</span>
          )}
        </Link>
      </div>
    </nav>
  )
}

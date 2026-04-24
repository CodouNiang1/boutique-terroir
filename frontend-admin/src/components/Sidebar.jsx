import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Produits', icon: '🌾' },
  { to: '/orders', label: 'Commandes', icon: '📦' },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      padding: '1.5rem 0',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
        <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '4px' }}>ADMINISTRATION</p>
        <h2 style={{ fontSize: '1rem', color: 'var(--green)' }}>🌿 Terroir Local</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 0.75rem' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            style={({ isActive }) => ({
              padding: '10px 14px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: isActive ? 'var(--green)' : 'var(--text-mid)',
              background: isActive ? 'rgba(34,197,94,0.1)' : 'transparent',
              transition: 'all 0.15s',
            })}
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

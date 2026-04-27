import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'Lato, sans-serif' }}>

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(160deg, #1a3d1a 0%, #2d5a27 50%, #3d7a35 100%)',
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '2rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        {/* Logo */}
        <img src="/logo.svg" alt="Logo Boutique Yaye Saye" style={{ width: '130px', height: '130px', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }} />

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Bienvenue chez
        </p>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'white', margin: '0 0 0.5rem', lineHeight: 1.1 }}>
          Boutique Yaye Saye
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: 1.6 }}>
          Les produits du terroir sénégalais directement des producteurs locaux
        </p>

        <Link to="/boutique">
          <button style={{
            background: '#C49A3C', color: 'white', border: 'none',
            padding: '16px 40px', borderRadius: '50px', fontSize: '1.1rem',
            fontWeight: 700, cursor: 'pointer', fontFamily: 'Lato, sans-serif',
            letterSpacing: '0.5px', boxShadow: '0 4px 20px rgba(196,154,60,0.4)',
            transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            Découvrir la boutique →
          </button>
        </Link>

        <Link to="/suivi" style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textDecoration: 'none' }}>
          📦 Suivre ma commande
        </Link>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['15+', 'Produits locaux'], ['5', 'Régions'], ['100%', 'Sénégalais']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <p style={{ color: '#C49A3C', fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 700, margin: 0 }}>{n}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '4px 0 0', letterSpacing: '1px' }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION CATÉGORIES */}
      <div style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', textAlign: 'center', color: 'var(--forest)', marginBottom: '0.5rem' }}>
          Nos catégories
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem' }}>
          Des produits frais de nos producteurs partenaires
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.2rem' }}>
          {[
            { emoji: '🍋', label: 'Fruits', cat: 'fruits' },
            { emoji: '🥦', label: 'Légumes', cat: 'legumes' },
            { emoji: '🌾', label: 'Céréales', cat: 'cereales' },
            { emoji: '🥛', label: 'Laitier', cat: 'laitier' },
            { emoji: '🍯', label: 'Miel', cat: 'miel' },
            { emoji: '🫒', label: 'Huiles', cat: 'huiles' },
          ].map(c => (
            <Link key={c.cat} to={`/boutique?cat=${c.cat}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'white', borderRadius: '12px', padding: '1.5rem 1rem',
                textAlign: 'center', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(45,90,39,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{c.emoji}</div>
                <p style={{ color: 'var(--forest)', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>{c.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: '#1a3d1a', padding: '2rem', textAlign: 'center' }}>
        <img src="/logo.svg" alt="Logo" style={{ width: '50px', height: '50px', marginBottom: '0.75rem' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>
          © 2026 Boutique Yaye Saye · Terroir Local Sénégal
        </p>
      </div>
    </div>
  )
}

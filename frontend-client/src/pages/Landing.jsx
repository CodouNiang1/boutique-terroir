import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🌱', title: 'Produits Bio', desc: 'Sélectionnés auprès de coopératives locales certifiées' },
  { icon: '🚜', title: 'Producteurs locaux', desc: 'Mangues de Casamance, oignons de Potou, miel du Ferlo…' },
  { icon: '💰', title: 'Prix justes', desc: 'Sans intermédiaire, directement du producteur à vous' },
  { icon: '📦', title: 'Livraison rapide', desc: 'Commandez aujourd\'hui, recevez demain à Dakar' },
]

const HIGHLIGHTS = [
  { emoji: '🥭', nom: 'Mangues Kent', producteur: 'Casamance', prix: '1 500 FCFA/kg' },
  { emoji: '🧅', nom: 'Oignons de Potou', producteur: 'Potou', prix: '600 FCFA/kg' },
  { emoji: '🍯', nom: 'Miel de baobab', producteur: 'Louga', prix: '4 500 FCFA/pot' },
  { emoji: '🥛', nom: 'Lait caillé', producteur: 'Kolda', prix: '1 500 FCFA/pot' },
]

export default function Landing() {
  return (
    <div style={{ fontFamily: 'Lato, sans-serif' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(145deg, #1a3d15 0%, #2d5a27 50%, #4a8a40 100%)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cercles décoratifs */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        <div style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌿</div>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            color: 'white',
            lineHeight: 1.2,
            marginBottom: '1.2rem',
          }}>
            Le meilleur du terroir<br />
            <span style={{ color: '#a8d5a2' }}>sénégalais</span> chez vous
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Fruits, légumes, miel, produits laitiers — directement des coopératives et producteurs locaux du Sénégal.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/boutique">
              <button style={{
                background: '#e8d5a3',
                color: '#1a3d15',
                border: 'none',
                padding: '14px 36px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Lato, sans-serif',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)' }}
              >
                🛒 Voir les produits
              </button>
            </Link>
            <a href="#produits-vedettes" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.5)',
                padding: '14px 36px',
                borderRadius: '50px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Lato, sans-serif',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'transparent' }}
              >
                En savoir plus ↓
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section style={{ background: '#e8d5a3', padding: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
          {[
            { val: '15+', label: 'Produits locaux' },
            { val: '8', label: 'Coopératives partenaires' },
            { val: '5', label: 'Régions du Sénégal' },
            { val: '100%', label: 'Origine traçable' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: '#2d5a27' }}>{s.val}</p>
              <p style={{ fontSize: '0.85rem', color: '#5a4a2a', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Produits vedettes ────────────────────────────────────────── */}
      <section id="produits-vedettes" style={{ padding: '5rem 2rem', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem', color: 'var(--forest)' }}>
            Nos produits vedettes
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '3rem' }}>
            Une sélection de ce que le terroir sénégalais a de meilleur
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {HIGHLIGHTS.map(p => (
              <div key={p.nom} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{p.emoji}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{p.nom}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>📍 {p.producteur}</p>
                <p style={{ fontWeight: 700, color: 'var(--forest)', fontSize: '1rem' }}>{p.prix}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/boutique">
              <button className="btn-primary" style={{ padding: '14px 40px', fontSize: '1rem' }}>
                Voir tout le catalogue →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pourquoi nous ────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', textAlign: 'center', marginBottom: '3rem', color: 'var(--forest)' }}>
            Pourquoi choisir Terroir Local ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ fontSize: '2.2rem', background: 'var(--cream)', padding: '14px', borderRadius: '12px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-dark)' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
      }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>
          Prêt à commander ?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1rem' }}>
          Des producteurs sénégalais vous attendent
        </p>
        <Link to="/boutique">
          <button style={{
            background: 'white',
            color: 'var(--forest)',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Lato, sans-serif',
          }}>
            🛒 Commander maintenant
          </button>
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{
        background: '#0f1f0d',
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        padding: '1.5rem',
        fontSize: '0.85rem',
      }}>
        🌿 Terroir Local Sénégal — Coopérative agricole © 2026
      </footer>
    </div>
  )
}

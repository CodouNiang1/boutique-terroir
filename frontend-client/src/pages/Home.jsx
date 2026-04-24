import { useState, useEffect } from 'react'
import { getProducts, getTopProduits } from '../api'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['tous', 'fruits', 'legumes', 'laitier', 'miel', 'conserves']

export default function Home() {
  const [products, setProducts] = useState([])
  const [topProduits, setTopProduits] = useState([])
  const [categorie, setCategorie] = useState('tous')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    getProducts(categorie === 'tous' ? null : categorie)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [categorie])

  useEffect(() => {
    getTopProduits().then(setTopProduits).catch(() => {})
  }, [])

  const filtered = products.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.producteur.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%)',
        borderRadius: '16px',
        padding: '3rem 2rem',
        marginBottom: '2.5rem',
        textAlign: 'center',
        color: 'white',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          🌾 Nos produits du terroir
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, fontFamily: 'Lato, sans-serif' }}>
          Mangues, oignons, miel de baobab… directement des producteurs sénégalais
        </p>
      </div>

      {/* Top produits (bonus) */}
      {topProduits.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--earth)' }}>
            🏆 Produits les plus vendus
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {topProduits.map((p, i) => (
              <div key={p.produit_id} style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{ fontWeight: 700, color: 'var(--earth)' }}>#{i + 1}</span>
                <span>{p.nom}</span>
                <span style={{ color: 'var(--text-light)' }}>({p.total_vendu} vendus)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtres + Recherche */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.9rem',
            width: '250px',
            background: 'white',
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategorie(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '2px solid',
                borderColor: categorie === cat ? 'var(--forest)' : 'var(--border)',
                background: categorie === cat ? 'var(--forest)' : 'white',
                color: categorie === cat ? 'white' : 'var(--text-mid)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Grid produits */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
          Chargement des produits...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)' }}>
          Aucun produit trouvé
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.2rem',
        }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

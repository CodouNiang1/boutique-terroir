import { useEffect, useState } from 'react'
import { getProducts, updateProduct, deleteProduct, createProduct } from '../api'

const EMPTY_FORM = { nom: '', categorie: 'fruits', prix: '', stock: '', producteur: '', attributs: {} }

export default function Products() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)   // product being edited
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getProducts().then(setProducts).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const startEdit = (p) => {
    setEditing(p.id)
    setForm({ nom: p.nom, categorie: p.categorie, prix: p.prix, stock: p.stock, producteur: p.producteur, attributs: p.attributs })
    setShowForm(true)
  }

  const handleSave = async () => {
    const data = { ...form, prix: parseFloat(form.prix), stock: parseInt(form.stock) }
    if (editing) {
      await updateProduct(editing, data)
    } else {
      await createProduct(data)
    }
    setShowForm(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return
    await deleteProduct(id)
    load()
  }

  const filtered = products.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.categorie.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Produits</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{products.length} produits au catalogue</p>
        </div>
        <button className="btn btn-green" onClick={() => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true) }}>
          + Nouveau produit
        </button>
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
        }}>
          <div className="card" style={{ width: '480px', maxWidth: '95vw' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1.2rem' }}>
              {editing ? '✏️ Modifier le produit' : '➕ Nouveau produit'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { key: 'nom', label: 'Nom', type: 'text' },
                { key: 'producteur', label: 'Producteur', type: 'text' },
                { key: 'prix', label: 'Prix (€)', type: 'number' },
                { key: 'stock', label: 'Stock', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>{f.label}</label>
                  <input type={f.type} value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Catégorie</label>
                <select value={form.categorie} onChange={e => setForm(p => ({ ...p, categorie: e.target.value }))} style={{ width: '100%' }}>
                  {['fruits', 'legumes', 'fromages', 'miel', 'conserves'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button className="btn" style={{ background: 'var(--surface2)', color: 'var(--text)' }}
                onClick={() => { setShowForm(false); setEditing(null) }}>
                Annuler
              </button>
              <button className="btn btn-green" onClick={handleSave}>
                {editing ? 'Sauvegarder' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <input placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', width: '280px' }} />

      {/* Table */}
      <div className="card" style={{ overflow: 'auto' }}>
        <table>
          <thead><tr>
            <th>Produit</th><th>Catégorie</th><th>Producteur</th><th>Prix</th><th>Stock</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>Chargement...</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500 }}>{p.nom}</td>
                <td><span className={`tag tag-${p.categorie}`}>{p.categorie}</span></td>
                <td style={{ color: 'var(--text-dim)' }}>{p.producteur}</td>
                <td style={{ fontFamily: 'Space Mono, monospace' }}>{p.prix.toLocaleString('fr-SN')} FCFA</td>
                <td style={{ color: p.stock === 0 ? 'var(--red)' : p.stock < 5 ? 'var(--yellow)' : 'var(--green)', fontWeight: 700 }}>
                  {p.stock}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-blue" onClick={() => startEdit(p)}>Éditer</button>
                    <button className="btn btn-red" onClick={() => handleDelete(p.id)}>Suppr.</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

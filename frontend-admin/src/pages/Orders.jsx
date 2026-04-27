import { useEffect, useState } from 'react'
import { getOrders, getOrdersByClient } from '../api'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const STATUTS = [
  { value: 'commandee',   label: '📋 Reçue',        color: '#22c55e' },
  { value: 'preparation', label: '📦 Préparation',   color: '#eab308' },
  { value: 'en_route',    label: '🚚 En route',      color: '#3b82f6' },
  { value: 'livree',      label: '✅ Livrée',         color: '#16a34a' },
]

const PAIEMENT_LABELS = {
  wave: '🌊 Wave', orange_money: '🟠 Orange Money',
  free_money: '🔵 Free Money', cash: '💵 Livraison',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [clientFilter, setClientFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    setLoading(true)
    getOrders().then(setOrders).finally(() => setLoading(false))
  }

  const handleClientSearch = async () => {
    if (!clientFilter.trim()) return loadOrders()
    setLoading(true)
    getOrdersByClient(clientFilter).then(setOrders).finally(() => setLoading(false))
  }

  const updateStatut = async (orderId, newStatut) => {
    setUpdating(orderId)
    try {
      await axios.put(`${API_URL}/orders/${orderId}/statut`, { statut: newStatut })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statut: newStatut } : o))
    } catch { alert('Erreur lors de la mise à jour') }
    finally { setUpdating(null) }
  }

  const formatDate = (d) => new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const getStatutStyle = (statut) => {
    const s = STATUTS.find(x => x.value === statut)
    return s ? { background: s.color + '22', color: s.color } : {}
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Commandes</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{orders.length} commandes</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input placeholder="Filtrer par nom client..." value={clientFilter}
          onChange={e => setClientFilter(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleClientSearch()}
          style={{ width: '260px' }} />
        <button className="btn btn-blue" onClick={handleClientSearch}>Chercher</button>
        {clientFilter && (
          <button className="btn" style={{ background: 'var(--surface2)', color: 'var(--text)' }}
            onClick={() => { setClientFilter(''); loadOrders() }}>Réinitialiser</button>
        )}
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table>
          <thead><tr>
            <th>Réf.</th><th>Client</th><th>Téléphone</th><th>Région</th>
            <th>Paiement</th><th>Date</th><th>Total</th><th>Statut livraison</th><th>Détails</th>
          </tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>Chargement...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>Aucune commande</td></tr>
            ) : orders.map(o => (
              <>
                <tr key={o.id}>
                  <td style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    #{o.id.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ fontWeight: 500 }}>{o.prenom || ''} {o.client}</td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{o.telephone || '—'}</td>
                  <td style={{ fontSize: '0.85rem' }}>📍 {o.region || '—'}</td>
                  <td style={{ fontSize: '0.82rem' }}>{PAIEMENT_LABELS[o.paiement] || o.paiement || '—'}</td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{formatDate(o.date)}</td>
                  <td style={{ fontFamily: 'Space Mono, monospace', color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>
                    {o.total.toLocaleString('fr-SN')} FCFA
                  </td>
                  <td>
                    <select
                      value={o.statut || 'commandee'}
                      disabled={updating === o.id}
                      onChange={e => updateStatut(o.id, e.target.value)}
                      style={{
                        background: 'var(--surface2)', border: '1px solid var(--border)',
                        borderRadius: '6px', color: 'var(--text)', padding: '4px 8px',
                        fontSize: '0.8rem', cursor: 'pointer',
                        ...getStatutStyle(o.statut)
                      }}
                    >
                      {STATUTS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button className="btn" style={{ background: 'var(--surface2)', color: 'var(--text)', padding: '4px 10px' }}
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                      {expanded === o.id ? '▲' : '▼'}
                    </button>
                  </td>
                </tr>
                {expanded === o.id && (
                  <tr key={`${o.id}-detail`}>
                    <td colSpan={9} style={{ background: 'var(--surface2)', padding: '0.75rem 1rem' }}>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>ARTICLES :</p>
                      {o.articles.map((a, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span>{a.nom_produit}</span>
                          <span style={{ color: 'var(--text-dim)' }}>×{a.quantite}</span>
                          <span style={{ color: 'var(--green)' }}>{a.prix_unitaire.toLocaleString('fr-SN')} FCFA/u</span>
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const STATUT_CONFIG = {
  commandee:   { label: 'Commande reçue',   icon: '📋', color: '#2d5a27' },
  preparation: { label: 'En préparation',   icon: '📦', color: '#c49a3c' },
  en_route:    { label: 'En route',         icon: '🚚', color: '#1565c0' },
  livree:      { label: 'Livrée',           icon: '✅', color: '#2e7d32' },
}

export default function Suivi() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!orderId.trim()) return setError('Entrez un numéro de commande.')
    setLoading(true); setError(null); setOrder(null)
    try {
      const { data } = await axios.get(`${API}/orders/suivi/${orderId.trim()}`)
      setOrder(data)
    } catch {
      setError('Commande introuvable. Vérifiez le numéro.')
    } finally { setLoading(false) }
  }

  const currentStep = order?.suivi?.findIndex(s => s.statut === order.statut) ?? 0

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem 4rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>📦 Suivi de commande</h1>
      <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
        Entrez votre numéro de commande pour suivre votre livraison.
      </p>

      {/* Champ de recherche */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <input
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Ex : 6634a1b2c3d4e5f6a7b8c9d0"
          style={{
            flex: 1, padding: '12px 16px', borderRadius: '8px',
            border: '1.5px solid var(--border)', fontFamily: 'Lato, sans-serif',
            fontSize: '0.95rem', background: 'white',
          }}
        />
        <button className="btn-primary" onClick={handleSearch} disabled={loading} style={{ padding: '12px 24px' }}>
          {loading ? '...' : 'Rechercher'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem', color: '#dc2626', marginBottom: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {order && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Résumé commande */}
          <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>{order.client}</p>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', margin: '2px 0 0' }}>
                  Commande #{order.id.slice(-8).toUpperCase()}
                </p>
              </div>
              <span style={{
                background: 'rgba(45,90,39,0.1)', color: 'var(--forest)',
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
              }}>
                {STATUT_CONFIG[order.statut]?.icon} {STATUT_CONFIG[order.statut]?.label}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-mid)' }}>
              <span>📍 {order.region}</span>
              <span>💰 {order.total.toLocaleString('fr-SN')} FCFA</span>
              <span>📅 {new Date(order.date).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Timeline suivi */}
          <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-mid)' }}>Progression de la livraison</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {order.suivi.map((step, i) => {
                const cfg = STATUT_CONFIG[step.statut] || {}
                const isLast = i === order.suivi.length - 1
                return (
                  <div key={step.statut} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                    {/* Ligne verticale */}
                    {!isLast && (
                      <div style={{
                        position: 'absolute', left: '19px', top: '40px',
                        width: '2px', height: 'calc(100% - 10px)',
                        background: step.fait ? 'var(--forest)' : 'var(--border)',
                      }} />
                    )}
                    {/* Cercle */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                      background: step.fait ? 'var(--forest)' : 'var(--cream)',
                      border: `2px solid ${step.fait ? 'var(--forest)' : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', zIndex: 1,
                    }}>
                      {step.fait ? cfg.icon || '✓' : '○'}
                    </div>
                    {/* Contenu */}
                    <div style={{ paddingBottom: isLast ? 0 : '1.5rem', flex: 1 }}>
                      <p style={{
                        fontWeight: step.fait ? 700 : 400,
                        color: step.fait ? 'var(--text-dark)' : 'var(--text-light)',
                        margin: '8px 0 2px', fontSize: '0.95rem',
                      }}>{cfg.label || step.label}</p>
                      {step.date && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>
                          {new Date(step.date).toLocaleString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Articles */}
          <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-mid)' }}>Articles commandés</h2>
            {order.articles.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i < order.articles.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: '0.9rem' }}>{a.nom_produit} <span style={{ color: 'var(--text-light)' }}>×{a.quantite}</span></span>
                <span style={{ fontWeight: 600, color: 'var(--forest)', fontSize: '0.9rem' }}>{(a.prix_unitaire * a.quantite).toLocaleString('fr-SN')} FCFA</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

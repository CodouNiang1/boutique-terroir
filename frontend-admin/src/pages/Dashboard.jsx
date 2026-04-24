import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getCaParCategorie, getTopProduits, getLowStock, getOrders } from '../api'

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ef4444', '#a855f7']

export default function Dashboard() {
  const [ca, setCa] = useState([])
  const [top, setTop] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getCaParCategorie().then(setCa).catch(() => {})
    getTopProduits().then(setTop).catch(() => {})
    getLowStock().then(setLowStock).catch(() => {})
    getOrders().then(setOrders).catch(() => {})
  }, [])

  const totalCA = ca.reduce((s, c) => s + c.chiffre_affaires, 0)
  const totalOrders = orders.length

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', fontSize: '0.85rem' }}>
        Vue d'ensemble de la boutique
      </p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Chiffre d\'affaires', value: `${totalCA.toLocaleString('fr-SN')} FCFA`, color: 'var(--green)', icon: '💰' },
          { label: 'Commandes totales', value: totalOrders, color: 'var(--blue)', icon: '📦' },
          { label: 'Ruptures de stock', value: lowStock.length, color: lowStock.length > 0 ? 'var(--red)' : 'var(--green)', icon: '⚠️' },
          { label: 'Catégories actives', value: ca.length, color: 'var(--yellow)', icon: '📁' },
        ].map(kpi => (
          <div key={kpi.label} className="card" style={{ borderLeft: `3px solid ${kpi.color}` }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {kpi.icon} {kpi.label}
            </p>
            <p style={{ fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Space Mono, monospace', color: kpi.color }}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* CA par catégorie */}
        <div className="card">
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', color: 'var(--text-mid)' }}>CA PAR CATÉGORIE</h3>
          {ca.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>Pas de données</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ca} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="categorie" tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px' }}
                  formatter={(v) => [`${v.toLocaleString('fr-SN')} FCFA`, 'CA']}
                />
                <Bar dataKey="chiffre_affaires" radius={[4, 4, 0, 0]}>
                  {ca.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top produits */}
        <div className="card">
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1.2rem', color: 'var(--text-mid)' }}>TOP 5 PRODUITS</h3>
          {top.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>Pas de données</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {top.map((p, i) => (
                <div key={p.produit_id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontFamily: 'Space Mono', color: COLORS[i], fontWeight: 700, minWidth: '24px' }}>#{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem' }}>{p.nom}</p>
                    <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginTop: '4px' }}>
                      <div style={{
                        height: '4px',
                        background: COLORS[i],
                        borderRadius: '2px',
                        width: `${(p.total_vendu / top[0].total_vendu) * 100}%`
                      }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', minWidth: '60px', textAlign: 'right' }}>
                    {p.total_vendu} vdus
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ruptures de stock */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--red)' }}>⚠️ PRODUITS EN RUPTURE / FAIBLE STOCK (&lt; 5)</h3>
          {lowStock.length === 0 ? (
            <p style={{ color: 'var(--green)', fontSize: '0.875rem' }}>✅ Tous les produits ont un stock suffisant</p>
          ) : (
            <table>
              <thead><tr>
                <th>Produit</th><th>Catégorie</th><th>Producteur</th><th>Stock</th>
              </tr></thead>
              <tbody>
                {lowStock.map(p => (
                  <tr key={p.id}>
                    <td>{p.nom}</td>
                    <td><span className={`tag tag-${p.categorie}`}>{p.categorie}</span></td>
                    <td style={{ color: 'var(--text-dim)' }}>{p.producteur}</td>
                    <td style={{ color: p.stock === 0 ? 'var(--red)' : 'var(--yellow)', fontWeight: 700 }}>
                      {p.stock === 0 ? '❌ Rupture' : `⚠️ ${p.stock}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

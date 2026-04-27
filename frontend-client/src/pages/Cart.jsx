import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api'

const REGIONS = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack',
  'Diourbel', 'Tambacounda', 'Kolda', 'Fatick', 'Kaffrine',
  'Kédougou', 'Louga', 'Matam', 'Sédhiou'
]

const PAIEMENTS = [
  { value: 'wave', label: '🌊 Wave', desc: 'Paiement mobile Wave' },
  { value: 'orange_money', label: '🟠 Orange Money', desc: 'Paiement mobile Orange' },
  { value: 'free_money', label: '🔵 Free Money', desc: 'Paiement mobile Free' },
  { value: 'cash', label: '💵 Paiement à la livraison', desc: 'Espèces à la réception' },
]

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1.5px solid var(--border)',
  fontFamily: 'Lato, sans-serif',
  fontSize: '0.95rem',
  background: 'white',
  color: 'var(--text-dark)',
  outline: 'none',
}

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 700,
  color: 'var(--text-mid)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: '6px',
  display: 'block',
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart()
  const [form, setForm] = useState({
    nom: '', prenom: '', telephone: '', region: '', paiement: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleOrder = async () => {
    const { nom, prenom, telephone, region, paiement } = form
    if (!nom.trim()) return setError('Veuillez entrer votre nom.')
    if (!prenom.trim()) return setError('Veuillez entrer votre prénom.')
    if (!telephone.trim()) return setError('Veuillez entrer votre numéro de téléphone.')
    if (!region) return setError('Veuillez choisir votre région.')
    if (!paiement) return setError('Veuillez choisir un mode de paiement.')
    if (cart.length === 0) return setError('Votre panier est vide.')

    setLoading(true)
    setError(null)
    try {
      const result = await createOrder({
        client: nom.trim(),
        prenom: prenom.trim(),
        telephone: telephone.trim(),
        region,
        paiement,
        articles: cart.map(i => ({
          produit_id: i.id,
          nom_produit: i.nom,
          quantite: i.quantite,
          prix_unitaire: i.prix,
        })),
      })
      setSuccess(result)
      clearCart()
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la commande.')
    } finally {
      setLoading(false)
    }
  }

  // ── Confirmation ──────────────────────────────────────────────────────────
  if (success) {
    const paiementLabel = PAIEMENTS.find(p => p.value === success.paiement)?.label || success.paiement
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <div style={{
          background: 'white', borderRadius: '16px', padding: '3rem',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Commande confirmée !</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            Merci <strong>{success.prenom} {success.client}</strong> !<br />
            Numéro de suivi : <code style={{ background: 'var(--cream)', padding: '2px 8px', borderRadius: '4px' }}>
              #{success.id.slice(-8).toUpperCase()}
            </code> a été enregistrée.
          </p>

          <div style={{
            background: 'var(--cream)', borderRadius: '12px', padding: '1.2rem',
            marginBottom: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem'
          }}>
            <p style={{ fontSize: '0.85rem' }}>📍 <strong>Livraison :</strong> {success.region}</p>
            <p style={{ fontSize: '0.85rem' }}>📞 <strong>Téléphone :</strong> {success.telephone}</p>
            <p style={{ fontSize: '0.85rem' }}>💳 <strong>Paiement :</strong> {paiementLabel}</p>
          </div>

          <p style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--forest)', marginBottom: '2rem' }}>
            Total : {success.total.toLocaleString('fr-SN')} FCFA
          </p>
          <button className="btn-primary" style={{ padding: '12px 32px' }} onClick={() => navigate('/boutique')}>
            Continuer mes achats
          </button>
        </div>
      </div>
    )
  }

  // ── Panier vide ───────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ marginBottom: '0.75rem' }}>Votre panier est vide</h2>
        <Link to="/boutique"><button className="btn-primary">Voir les produits</button></Link>
      </div>
    )
  }

  // ── Panier + formulaire ───────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem 4rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>🛒 Mon Panier</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Articles ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <h2 style={{ fontSize: '1rem', color: 'var(--text-mid)', marginBottom: '0.25rem' }}>
            Articles ({cart.reduce((s, i) => s + i.quantite, 0)})
          </h2>
          {cart.map(item => (
            <div key={item.id} style={{
              background: 'white', borderRadius: 'var(--radius)',
              border: '1px solid var(--border)', padding: '1rem 1.2rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              boxShadow: 'var(--shadow)',
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.nom}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{item.producteur}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button onClick={() => updateQuantity(item.id, item.quantite - 1)}
                  style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', fontWeight: 700 }}>−</button>
                <span style={{ fontWeight: 700, minWidth: '22px', textAlign: 'center' }}>{item.quantite}</span>
                <button onClick={() => updateQuantity(item.id, item.quantite + 1)}
                  style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--cream)', cursor: 'pointer', fontWeight: 700 }}>+</button>
              </div>
              <p style={{ fontWeight: 700, color: 'var(--forest)', minWidth: '110px', textAlign: 'right', fontSize: '0.95rem' }}>
                {(item.prix * item.quantite).toLocaleString('fr-SN')} FCFA
              </p>
              <button onClick={() => removeFromCart(item.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1.1rem' }}>🗑️</button>
            </div>
          ))}
        </div>

        {/* ── Formulaire ── */}
        <div style={{
          background: 'white', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', padding: '1.5rem',
          boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '1rem',
        }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Informations de livraison</h2>

          {/* Nom + Prénom */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Nom</label>
              <input style={inputStyle} placeholder="Diallo" value={form.nom} onChange={e => set('nom', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Prénom</label>
              <input style={inputStyle} placeholder="Aminata" value={form.prenom} onChange={e => set('prenom', e.target.value)} />
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input style={inputStyle} placeholder="77 000 00 00" type="tel" value={form.telephone} onChange={e => set('telephone', e.target.value)} />
          </div>

          {/* Région */}
          <div>
            <label style={labelStyle}>Région de livraison</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.region} onChange={e => set('region', e.target.value)}>
              <option value="">-- Choisir une région --</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Mode de paiement */}
          <div>
            <label style={labelStyle}>Mode de paiement</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PAIEMENTS.map(p => (
                <label key={p.value} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
                  border: `1.5px solid ${form.paiement === p.value ? 'var(--forest)' : 'var(--border)'}`,
                  background: form.paiement === p.value ? 'rgba(45,90,39,0.05)' : 'white',
                  transition: 'all 0.15s',
                }}>
                  <input type="radio" name="paiement" value={p.value}
                    checked={form.paiement === p.value}
                    onChange={() => set('paiement', p.value)}
                    style={{ accentColor: 'var(--forest)', width: '16px', height: '16px' }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.label}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem', background: 'var(--cream)', borderRadius: '8px',
            marginTop: '0.25rem',
          }}>
            <span style={{ fontWeight: 600 }}>Total à payer</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--forest)' }}>
              {total.toLocaleString('fr-SN')} FCFA
            </span>
          </div>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.875rem', background: '#fef2f2', padding: '8px 12px', borderRadius: '6px' }}>
              ⚠️ {error}
            </p>
          )}

          <button className="btn-primary" style={{ padding: '14px', fontSize: '1rem' }}
            onClick={handleOrder} disabled={loading}>
            {loading ? '⏳ Envoi en cours...' : '✅ Confirmer la commande'}
          </button>
        </div>
      </div>
    </div>
  )
}
// Tracking note added via post-processing

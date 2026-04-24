import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (product, quantite = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantite: Math.min(i.quantite + quantite, product.stock) }
            : i
        )
      }
      return [...prev, { ...product, quantite }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.id !== productId))
  }

  const updateQuantity = (productId, quantite) => {
    if (quantite <= 0) return removeFromCart(productId)
    setCart(prev => prev.map(i => i.id === productId ? { ...i, quantite } : i))
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, i) => sum + i.prix * i.quantite, 0)
  const itemCount = cart.reduce((sum, i) => sum + i.quantite, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

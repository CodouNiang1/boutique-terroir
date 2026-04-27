import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Suivi from './pages/Suivi'
import './index.css'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/boutique" element={<><Navbar /><Home /></>} />
          <Route path="/cart" element={<><Navbar /><Cart /></>} />
          <Route path="/suivi" element={<><Navbar /><Suivi /></>} />
          <Route path="/suivi/:id" element={<><Navbar /><Suivi /></>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

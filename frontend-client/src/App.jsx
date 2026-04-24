import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Cart from './pages/Cart'
import './index.css'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Page d'accueil sans navbar */}
          <Route path="/" element={<Landing />} />
          {/* Pages boutique avec navbar */}
          <Route path="/boutique" element={<><Navbar /><Home /></>} />
          <Route path="/cart" element={<><Navbar /><Cart /></>} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

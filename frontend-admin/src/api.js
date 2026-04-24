import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export const getProducts = () => API.get('/products').then(r => r.data)
export const getLowStock = () => API.get('/products/admin/low-stock').then(r => r.data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data).then(r => r.data)
export const deleteProduct = (id) => API.delete(`/products/${id}`).then(r => r.data)
export const createProduct = (data) => API.post('/products', data).then(r => r.data)

export const getOrders = () => API.get('/orders').then(r => r.data)
export const getOrdersByClient = (name) => API.get(`/orders/client/${name}`).then(r => r.data)
export const getCaParCategorie = () => API.get('/orders/stats/ca-par-categorie').then(r => r.data)
export const getTopProduits = () => API.get('/orders/stats/top-produits').then(r => r.data)

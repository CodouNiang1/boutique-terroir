import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
})

export const getProducts = (categorie) =>
  API.get('/products', { params: categorie ? { categorie } : {} }).then(r => r.data)

export const getProduct = (id) =>
  API.get(`/products/${id}`).then(r => r.data)

export const createOrder = (order) =>
  API.post('/orders', order).then(r => r.data)

export const getTopProduits = () =>
  API.get('/orders/stats/top-produits').then(r => r.data)

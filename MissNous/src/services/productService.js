// MissNous Frontend - Product Service (API-based)
import api from './api';

export async function getProducts() {
  try {
    const products = await api.get('/products');
    return products;
  } catch (err) {
    console.error('Failed to fetch products:', err.message);
    return [];
  }
}

export async function addProduct(productData) {
  const product = await api.post('/products', productData);
  return product;
}

export async function updateProduct(productData) {
  const { _id, ...rest } = productData;
  const product = await api.put(`/products/${_id}`, rest);
  return product;
}

export async function deleteProduct(productId) {
  await api.delete(`/products/${productId}`);
}

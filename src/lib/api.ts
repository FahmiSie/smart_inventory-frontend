import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor: attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH API =====
export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ access_token: string; user: { id: string; username: string; name: string; role: string } }>(
      '/auth/login', { username, password }
    ),
  register: (data: { username: string; password: string; name: string; role?: string }) =>
    api.post('/auth/register', data),
};

// ===== PRODUCTS API =====
export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  imageUrl: string | null;
  stock: number;
  minStock: number;
  price: number | string;
  categoryId: string;
  supplierId: string | null;
  category: Category;
  supplier: { id: string; name: string } | null;
  movements?: StockMovement[];
  createdAt: string;
  updatedAt: string;
}

export const productsApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  getLowStock: () => api.get<Product[]>('/products/low-stock'),
  create: (formData: FormData) => api.post<Product>('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, formData: FormData) => api.patch<Product>(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// ===== CATEGORIES API =====
export interface Category {
  id: string;
  name: string;
  products?: Product[];
  _count?: { products: number };
}

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (data: { name: string }) => api.post<Category>('/categories', data),
  update: (id: string, data: { name: string }) => api.patch<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// ===== INVENTORY API =====
export interface StockMovement {
  id: string;
  productId: string;
  quantity: number;
  type: 'IN' | 'OUT';
  reason: string;
  evidencePath: string;
  product?: { name: string; sku: string };
  createdAt: string;
}

export const inventoryApi = {
  adjust: (formData: FormData) =>
    api.post('/inventory/adjust', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMovements: (productId?: string) =>
    api.get<StockMovement[]>('/inventory/movements', {
      params: productId ? { productId } : undefined,
    }),
  getProductMovements: (productId: string) =>
    api.get<StockMovement[]>(`/inventory/movements/${productId}`),
  getLowStock: () => api.get<Product[]>('/inventory/low-stock'),
};

// ===== SUPPLIERS API =====
export interface Supplier {
  id: string;
  name: string;
  contact: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

export const suppliersApi = {
  getAll: () => api.get<Supplier[]>('/suppliers'),
  getById: (id: string) => api.get<Supplier>(`/suppliers/${id}`),
};

// ===== REPORTS API =====
export const reportsApi = {
  getSummary: () => api.get<{ totalIn: number; totalOut: number }>('/reports/summary'),
  getAssetValue: () => api.get<{ totalAssetValue: number }>('/reports/asset-value'),
};

export default api;

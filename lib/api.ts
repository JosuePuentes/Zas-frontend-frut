const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zas-backend-frut.onrender.com';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Materia Prima
  getInventoryRaw: () => fetchApi<any[]>('/inventory-raw'),
  createInventoryRaw: (data: any) =>
    fetchApi('/inventory-raw', { method: 'POST', body: JSON.stringify(data) }),

  // Recetas
  getRecipes: () => fetchApi<any[]>('/recipes'),
  createRecipe: (data: any) =>
    fetchApi('/recipes', { method: 'POST', body: JSON.stringify(data) }),

  // Disponibilidad (POS)
  getAvailability: () => fetchApi<any[]>('/availability/batidos'),

  // Producción
  procesarDosis: (recipeId: string, cantidadDosis: number) =>
    fetchApi('/production/procesar-dosis', {
      method: 'POST',
      body: JSON.stringify({ recipe_id: recipeId, cantidad_dosis: cantidadDosis }),
    }),

  // Ventas
  createSale: (items: any[]) =>
    fetchApi('/sales', { method: 'POST', body: JSON.stringify({ items }) }),

  // Planificación
  getListaCompras: () => fetchApi<any[]>('/planning/lista-compras'),

  // Reportes
  getUtilidad: () => fetchApi<any>('/reports/utilidad'),
  getMasVendidos: (limite = 10) =>
    fetchApi<any[]>(`/reports/mas-vendidos?limite=${limite}`),

  // Alertas
  getCaducidad: () => fetchApi<any[]>('/alerts/caducidad'),
};

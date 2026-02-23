'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CategoriaProducto = 'fruta' | 'adicionales';
export type UnidadMedida = 'kg' | 'unidad';

export interface ProductoMateriaPrima {
  id: string;
  codigo: string;
  descripcion: string;
  categoria: CategoriaProducto;
  unidad: UnidadMedida;
  stock_minimo?: number;
}

export interface CompraMateriaPrima {
  id: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  fecha: string;
}

export interface ItemInventarioPreparacion {
  id: string;
  codigo: string;
  descripcion: string;
  cantidad: number;
  costoUnitario?: number;
}

export interface IngredienteReceta {
  materiaPrimaId: string;
  nombre: string;
  gramos: number;
}

export interface ProductoInventarioVenta {
  id: string;
  codigo: string;
  descripcion: string;
  precio: number;
  tamanioVaso: string;
  tieneEtiqueta: boolean;
  ingredientes: IngredienteReceta[];
  vasoId?: string;
  etiquetaId?: string;
  costoVaso?: number;
  costoEtiqueta?: number;
  cantidad: number;
}

export interface ClientePOS {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  esPuntoVenta: boolean;
  vecesComprado: number;
  createdAt: string;
}

export interface Venta {
  id: string;
  numeroFactura: string;
  clienteId?: string;
  clienteNombre: string;
  items: { productoId: string; nombre: string; cantidad: number; precioUnitario: number; total: number }[];
  subtotal: number;
  metodoPago: 'efectivo_bs' | 'efectivo_usd' | 'zelle' | 'pago_movil' | 'transferencia' | 'binance';
  montoRecibido?: number;
  vuelto?: number;
  comprobanteUrl?: string;
  fecha: string;
  totalCosto?: number;
  utilidad?: number;
}

export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  fecha: string;
}

const STORAGE_KEYS = {
  productos: 'sf_productos_materia_prima',
  compras: 'sf_compras_materia_prima',
  inventarioVenta: 'sf_inventario_venta',
  clientes: 'sf_clientes_pos',
  ventas: 'sf_ventas',
  gastos: 'sf_gastos',
};

function load<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function save<T>(key: string, val: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(val));
}

const InventarioContext = createContext<{
  productos: ProductoMateriaPrima[];
  compras: CompraMateriaPrima[];
  inventarioVenta: ProductoInventarioVenta[];
  clientes: ClientePOS[];
  ventas: Venta[];
  gastos: Gasto[];
  addProducto: (p: Omit<ProductoMateriaPrima, 'id'>) => void;
  updateProducto: (id: string, p: Partial<ProductoMateriaPrima>) => void;
  removeProducto: (id: string) => void;
  addCompra: (c: Omit<CompraMateriaPrima, 'id' | 'fecha'>) => void;
  addProductoVenta: (p: Omit<ProductoInventarioVenta, 'id'>) => void;
  updateProductoVenta: (id: string, p: Partial<ProductoInventarioVenta>) => void;
  removeProductoVenta: (id: string) => void;
  addCliente: (c: Omit<ClientePOS, 'id' | 'vecesComprado' | 'createdAt'>) => string;
  updateCliente: (id: string, c: Partial<ClientePOS>) => void;
  addVenta: (v: Omit<Venta, 'id' | 'fecha' | 'numeroFactura'>) => void;
  addGasto: (g: Omit<Gasto, 'id' | 'fecha'>) => void;
  getStockMateriaPrima: (productoId: string) => number;
  getCostoPromedioMateriaPrima: (productoId: string) => number;
  getInventarioPreparacion: () => ItemInventarioPreparacion[];
}>(null as any);

export function InventarioProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<ProductoMateriaPrima[]>(() => load(STORAGE_KEYS.productos, []));
  const [compras, setCompras] = useState<CompraMateriaPrima[]>(() => load(STORAGE_KEYS.compras, []));
  const [inventarioVenta, setInventarioVenta] = useState<ProductoInventarioVenta[]>(() => load(STORAGE_KEYS.inventarioVenta, []));
  const [clientes, setClientes] = useState<ClientePOS[]>(() => load(STORAGE_KEYS.clientes, []));
  const [ventas, setVentas] = useState<Venta[]>(() => load(STORAGE_KEYS.ventas, []));
  const [gastos, setGastos] = useState<Gasto[]>(() => load(STORAGE_KEYS.gastos, []));

  useEffect(() => { save(STORAGE_KEYS.productos, productos); }, [productos]);
  useEffect(() => { save(STORAGE_KEYS.compras, compras); }, [compras]);
  useEffect(() => { save(STORAGE_KEYS.inventarioVenta, inventarioVenta); }, [inventarioVenta]);
  useEffect(() => { save(STORAGE_KEYS.clientes, clientes); }, [clientes]);
  useEffect(() => { save(STORAGE_KEYS.ventas, ventas); }, [ventas]);
  useEffect(() => { save(STORAGE_KEYS.gastos, gastos); }, [gastos]);

  const addProducto = (p: Omit<ProductoMateriaPrima, 'id'>) => {
    setProductos((prev) => [...prev, { ...p, id: crypto.randomUUID() }]);
  };

  const updateProducto = (id: string, p: Partial<ProductoMateriaPrima>) => {
    setProductos((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  };

  const removeProducto = (id: string) => {
    setProductos((prev) => prev.filter((x) => x.id !== id));
  };

  const addCompra = (c: Omit<CompraMateriaPrima, 'id' | 'fecha'>) => {
    setCompras((prev) => [...prev, { ...c, id: crypto.randomUUID(), fecha: new Date().toISOString() }]);
  };

  const addProductoVenta = (p: Omit<ProductoInventarioVenta, 'id'>) => {
    setInventarioVenta((prev) => [...prev, { ...p, id: crypto.randomUUID() }]);
  };

  const updateProductoVenta = (id: string, p: Partial<ProductoInventarioVenta>) => {
    setInventarioVenta((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)));
  };

  const removeProductoVenta = (id: string) => {
    setInventarioVenta((prev) => prev.filter((x) => x.id !== id));
  };

  const addCliente = (c: Omit<ClientePOS, 'id' | 'vecesComprado' | 'createdAt'>): string => {
    const existente = clientes.find((x) => x.cedula === c.cedula);
    if (existente) {
      setClientes((prev) =>
        prev.map((x) => (x.id === existente.id ? { ...x, ...c, vecesComprado: x.vecesComprado + 1 } : x))
      );
      return existente.id;
    }
    const nuevo: ClientePOS = {
      ...c,
      id: crypto.randomUUID(),
      vecesComprado: 1,
      createdAt: new Date().toISOString(),
    };
    setClientes((prev) => [...prev, nuevo]);
    return nuevo.id;
  };

  const updateCliente = (id: string, c: Partial<ClientePOS>) => {
    setClientes((prev) => prev.map((x) => (x.id === id ? { ...x, ...c } : x)));
  };

  const addVenta = (v: Omit<Venta, 'id' | 'fecha' | 'numeroFactura'>) => {
    const numFactura = `F-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setVentas((prev) => [...prev, { ...v, id: crypto.randomUUID(), fecha: new Date().toISOString(), numeroFactura: numFactura }]);
  };

  const addGasto = (g: Omit<Gasto, 'id' | 'fecha'>) => {
    setGastos((prev) => [...prev, { ...g, id: crypto.randomUUID(), fecha: new Date().toISOString() }]);
  };

  const getStockMateriaPrima = (productoId: string): number => {
    const comprasProd = compras.filter((c) => c.productoId === productoId);
    return comprasProd.reduce((s, c) => s + c.cantidad, 0);
  };

  const getCostoPromedioMateriaPrima = (productoId: string): number => {
    const comprasProd = compras.filter((c) => c.productoId === productoId);
    const total = comprasProd.reduce((s, c) => s + c.cantidad, 0);
    const costo = comprasProd.reduce((s, c) => s + c.precioUnitario * c.cantidad, 0);
    return total > 0 ? costo / total : 0;
  };

  const getInventarioPreparacion = (): ItemInventarioPreparacion[] => {
    return inventarioVenta.map((p) => {
      let minBolsitas = Infinity;
      let costoTotal = (p.costoVaso ?? 0) + (p.costoEtiqueta ?? 0);
      for (const ing of p.ingredientes) {
        const prod = productos.find((x) => x.id === ing.materiaPrimaId);
        if (!prod) continue;
        const stock = getStockMateriaPrima(ing.materiaPrimaId);
        const comprasProd = compras.filter((c) => c.productoId === ing.materiaPrimaId);
        const totalComprado = comprasProd.reduce((s, c) => s + c.cantidad, 0);
        const costoComprado = comprasProd.reduce((s, c) => s + c.precioUnitario * c.cantidad, 0);
        const precioUnit = totalComprado > 0 ? costoComprado / totalComprado : 0;
        if (prod.unidad === 'kg') {
          costoTotal += (ing.gramos / 1000) * precioUnit;
          minBolsitas = Math.min(minBolsitas, ing.gramos > 0 ? Math.floor((stock * 1000) / ing.gramos) : Infinity);
        } else {
          costoTotal += ing.gramos * precioUnit;
          minBolsitas = Math.min(minBolsitas, ing.gramos > 0 ? Math.floor(stock / ing.gramos) : Infinity);
        }
      }
      return {
        id: p.id,
        codigo: p.codigo,
        descripcion: p.descripcion,
        cantidad: minBolsitas === Infinity ? 0 : minBolsitas,
        costoUnitario: costoTotal,
      };
    });
  };

  return (
    <InventarioContext.Provider
      value={{
        productos,
        compras,
        inventarioVenta,
        clientes,
        ventas,
        gastos,
        addProducto,
        updateProducto,
        removeProducto,
        addCompra,
        addProductoVenta,
        updateProductoVenta,
        removeProductoVenta,
        addCliente,
        updateCliente,
        addVenta,
        addGasto,
        getStockMateriaPrima,
        getCostoPromedioMateriaPrima,
        getInventarioPreparacion,
      }}
    >
      {children}
    </InventarioContext.Provider>
  );
}

export function useInventario() {
  const ctx = useContext(InventarioContext);
  if (!ctx) throw new Error('useInventario must be used within InventarioProvider');
  return ctx;
}

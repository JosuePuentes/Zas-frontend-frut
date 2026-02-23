'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartExtra {
  materia_prima_id: string;
  nombre: string;
  cantidad: number;
  precio_extra: number;
}

export interface CartItem {
  recipe_id: string;
  nombre_batido: string;
  cantidad: number;
  precio_unitario: number;
  extras: CartExtra[];
  costo_envase: number;
  envase_items: { materia_prima_id: string; cantidad: number }[];
  imagen?: string;
}

export type OrderStatus = 'pendiente' | 'verificado' | 'preparacion' | 'envio' | 'entregado';

export interface OrderItem {
  recipe_id: string;
  nombre_batido: string;
  cantidad: number;
  precio_unitario: number;
  extras: CartExtra[];
  costo_envase: number;
}

export interface Order {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  items: OrderItem[];
  subtotal: number;
  delivery: boolean;
  montoDelivery?: number;
  total: number;
  direccionEntrega?: string;
  ubicacionEntrega?: { lat: number; lng: number };
  sucursalId?: string;
  metodoPago: 'zelle' | 'pago_movil' | 'transferencia' | 'binance';
  referenciaPago?: string;
  bancoEmisor?: string;
  comprobanteUrl?: string;
  estado: OrderStatus;
  horaEstimadaEntrega?: string;
  createdAt: string;
}

const CART_KEY = 'zas_cart_cliente';
const ORDERS_KEY = 'zas_orders';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(CART_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function loadOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(ORDERS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (idx: number, delta: number) => void;
  removeFromCart: (idx: number) => void;
  clearCart: () => void;
  cartTotal: number;
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'estado'>, sucursalId?: string) => Order;
  getOrdersByCliente: (clienteId: string) => Order[];
  getAllOrders: (sucursalId?: string) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus, horaEstimada?: string) => void;
  assignOrderToSucursal: (orderId: string, sucursalId: string) => void;
}>(null as any);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setCart(loadCart());
    setOrders(loadOrders());
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.recipe_id === item.recipe_id && JSON.stringify(c.extras) === JSON.stringify(item.extras)
      );
      let next: CartItem[];
      if (existing) {
        next = prev.map((c) =>
          c === existing ? { ...c, cantidad: c.cantidad + item.cantidad } : c
        );
      } else {
        next = [...prev, item];
      }
      saveCart(next);
      return next;
    });
  };

  const updateQuantity = (idx: number, delta: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart[idx].cantidad = Math.max(0, newCart[idx].cantidad + delta);
      if (newCart[idx].cantidad === 0) newCart.splice(idx, 1);
      saveCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (idx: number) => {
    setCart((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      saveCart(next);
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  const cartTotal = cart.reduce(
    (s, i) =>
      s +
      i.precio_unitario * i.cantidad +
      i.extras.reduce((e, x) => e + x.precio_extra * x.cantidad * i.cantidad, 0),
    0
  );

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'estado'>, sucursalId?: string): Order => {
    const order: Order = {
      ...orderData,
      id: crypto.randomUUID(),
      estado: 'pendiente',
      sucursalId,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => {
      const next = [order, ...prev];
      saveOrders(next);
      return next;
    });
    return order;
  };

  const getOrdersByCliente = (clienteId: string) =>
    orders.filter((o) => o.clienteId === clienteId);

  const getAllOrders = (sucursalId?: string) => {
    if (!sucursalId) return orders;
    return orders.filter((o) => o.sucursalId === sucursalId);
  };

  const assignOrderToSucursal = (orderId: string, sucursalId: string) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === orderId ? { ...o, sucursalId } : o));
      saveOrders(next);
      return next;
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, horaEstimada?: string) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId
          ? { ...o, estado: status, horaEstimadaEntrega: horaEstimada ?? o.horaEstimadaEntrega }
          : o
      );
      saveOrders(next);
      return next;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        orders,
        createOrder,
        getOrdersByCliente,
        getAllOrders,
        updateOrderStatus,
        assignOrderToSucursal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

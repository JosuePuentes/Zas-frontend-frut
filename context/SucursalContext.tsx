'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  telefono?: string;
  activa: boolean;
  createdAt: string;
}

const SUCURSALES_KEY = 'zas_sucursales';
const MASTER_PIN_KEY = 'zas_master_pin';
const DEFAULT_PIN = '1234';

function loadSucursales(): Sucursal[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(SUCURSALES_KEY);
    if (s) return JSON.parse(s);
    const defaultSuc: Sucursal = {
      id: crypto.randomUUID(),
      nombre: 'Sucursal Principal',
      direccion: 'Maracaibo, Zulia',
      lat: 10.6427,
      lng: -71.6125,
      telefono: '+58 412 123 4567',
      activa: true,
      createdAt: new Date().toISOString(),
    };
    saveSucursales([defaultSuc]);
    return [defaultSuc];
  } catch {
    return [];
  }
}

function saveSucursales(s: Sucursal[]) {
  localStorage.setItem(SUCURSALES_KEY, JSON.stringify(s));
}

function getStoredPin(): string {
  if (typeof window === 'undefined') return DEFAULT_PIN;
  return localStorage.getItem(MASTER_PIN_KEY) || DEFAULT_PIN;
}

function savePin(pin: string) {
  localStorage.setItem(MASTER_PIN_KEY, pin);
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const SucursalContext = createContext<{
  sucursales: Sucursal[];
  addSucursal: (data: Omit<Sucursal, 'id' | 'createdAt'>, pin: string) => Promise<{ ok: boolean; error?: string }>;
  updateSucursal: (id: string, data: Partial<Sucursal>) => void;
  getSucursal: (id: string) => Sucursal | undefined;
  getSucursalMasCercana: (lat: number, lng: number) => Sucursal | null;
  verifyPin: (pin: string) => boolean;
  changePin: (oldPin: string, newPin: string) => boolean;
}>(null as any);

export function SucursalProvider({ children }: { children: ReactNode }) {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    setSucursales(loadSucursales());
  }, []);

  const verifyPin = (pin: string) => pin === getStoredPin();

  const changePin = (oldPin: string, newPin: string) => {
    if (oldPin !== getStoredPin()) return false;
    savePin(newPin);
    return true;
  };

  const addSucursal = async (data: Omit<Sucursal, 'id' | 'createdAt'>, pin: string): Promise<{ ok: boolean; error?: string }> => {
    if (pin !== getStoredPin()) return { ok: false, error: 'PIN incorrecto' };
    const newSuc: Sucursal = {
      ...data,
      id: crypto.randomUUID(),
      activa: data.activa ?? true,
      createdAt: new Date().toISOString(),
    };
    setSucursales((prev) => {
      const next = [...prev, newSuc];
      saveSucursales(next);
      return next;
    });
    return { ok: true };
  };

  const updateSucursal = (id: string, data: Partial<Sucursal>) => {
    setSucursales((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
      saveSucursales(next);
      return next;
    });
  };

  const getSucursal = (id: string) => sucursales.find((s) => s.id === id);

  const getSucursalMasCercana = (lat: number, lng: number): Sucursal | null => {
    const activas = sucursales.filter((s) => s.activa);
    if (activas.length === 0) return null;
    let minDist = Infinity;
    let nearest: Sucursal | null = null;
    for (const s of activas) {
      const d = haversine(lat, lng, s.lat, s.lng);
      if (d < minDist) {
        minDist = d;
        nearest = s;
      }
    }
    return nearest;
  };

  return (
    <SucursalContext.Provider
      value={{
        sucursales,
        addSucursal,
        updateSucursal,
        getSucursal,
        getSucursalMasCercana,
        verifyPin,
        changePin,
      }}
    >
      {children}
    </SucursalContext.Provider>
  );
}

export function useSucursal() {
  const ctx = useContext(SucursalContext);
  if (!ctx) throw new Error('useSucursal must be used within SucursalProvider');
  return ctx;
}

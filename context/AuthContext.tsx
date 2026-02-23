'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'cliente' | 'super_admin';
export type ModulePermission = 'dashboard' | 'pos' | 'inventario-materia-prima' | 'inventario-preparacion' | 'inventario-venta' | 'produccion' | 'planificacion' | 'alertas' | 'usuarios' | 'anuncios';

export interface User {
  id: string;
  email: string;
  usuario?: string;
  nombre: string;
  telefono?: string;
  rol: UserRole;
  permisos: ModulePermission[];
  createdAt?: string;
}

const STORAGE_KEY = 'zas_user';
const USERS_KEY = 'zas_users';

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

const ALL_PERMISSIONS: ModulePermission[] = ['dashboard', 'pos', 'inventario-materia-prima', 'inventario-preparacion', 'inventario-venta', 'produccion', 'planificacion', 'alertas', 'usuarios', 'anuncios'];

function getStoredUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(USERS_KEY);
    let users: User[] = s ? JSON.parse(s) : [];
    if (users.length === 0) {
      users = [{
        id: crypto.randomUUID(),
        email: 'admin@zas.com',
        usuario: 'admin',
        nombre: 'Administrador',
        telefono: '',
        rol: 'super_admin' as UserRole,
        permisos: ALL_PERMISSIONS,
      }];
      saveUsers(users);
    }
    return users;
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

const AuthContext = createContext<{
  user: User | null;
  ready: boolean;
  login: (identificador: string, password: string, tipo: 'admin' | 'cliente') => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  register: (email: string, password: string, nombre: string, telefono: string, rol: 'cliente' | 'admin', usuario?: string) => Promise<{ ok: boolean; error?: string }>;
  createUser: (email: string, password: string, nombre: string, telefono: string, rol: UserRole, permisos: ModulePermission[], usuario?: string) => Promise<{ ok: boolean; error?: string }>;
  getUsers: () => User[];
  hasPermission: (mod: ModulePermission) => boolean;
}>(null as any);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setReady(true);
  }, []);

  const login = async (identificador: string, password: string, tipo: 'admin' | 'cliente') => {
    const users = getStoredUsers();
    let found: User | undefined;
    if (tipo === 'cliente') {
      found = users.find((u) => u.rol === 'cliente' && u.email.toLowerCase() === identificador.toLowerCase());
      if (!found) return { ok: false, error: 'Cliente no encontrado. Usa tu correo electrónico.' };
      if (found.rol !== 'cliente') return { ok: false, error: 'Acceso denegado' };
    } else {
      found = users.find((u) => u.rol !== 'cliente' && (u.usuario?.toLowerCase() === identificador.toLowerCase() || u.email.toLowerCase() === identificador.toLowerCase()));
      if (!found) return { ok: false, error: 'Usuario administrativo no encontrado. Usa tu nombre de usuario.' };
      if (found.rol === 'cliente') return { ok: false, error: 'Los clientes deben usar el acceso con correo' };
    }
    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const register = async (email: string, password: string, nombre: string, telefono: string, rol: 'cliente' | 'admin', usuario?: string) => {
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, error: 'El email ya está registrado' };
    if (rol === 'admin' && usuario && users.some((u) => u.usuario?.toLowerCase() === usuario.toLowerCase()))
      return { ok: false, error: 'El usuario ya existe' };
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      usuario: rol === 'admin' ? (usuario || email.split('@')[0]) : undefined,
      nombre,
      telefono: telefono || undefined,
      rol,
      permisos: rol === 'admin' ? ['dashboard', 'pos', 'inventario-materia-prima', 'inventario-preparacion', 'inventario-venta', 'produccion', 'planificacion', 'alertas', 'anuncios'] : [],
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    if (rol === 'cliente') {
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('zas:cliente-registrado', { detail: { nombre, user: newUser } }));
    }
    if (rol === 'admin') {
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    }
    return { ok: true };
  };

  const createUser = async (email: string, password: string, nombre: string, telefono: string, rol: UserRole, permisos: ModulePermission[], usuario?: string) => {
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, error: 'El email ya está registrado' };
    if (rol !== 'cliente' && usuario && users.some((u) => u.usuario?.toLowerCase() === usuario.toLowerCase()))
      return { ok: false, error: 'El usuario ya existe' };
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      usuario: rol !== 'cliente' ? (usuario || email.split('@')[0]) : undefined,
      nombre,
      telefono: telefono || undefined,
      rol,
      permisos: rol === 'super_admin' ? ALL_PERMISSIONS : permisos,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    if (rol === 'cliente') {
      typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('zas:cliente-registrado', { detail: { nombre, user: newUser } }));
    }
    return { ok: true };
  };

  const getUsers = () => getStoredUsers();

  const hasPermission = (mod: ModulePermission) => {
    if (!user) return false;
    if (user.rol === 'super_admin') return true;
    return user.permisos.includes(mod);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, register, createUser, getUsers, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

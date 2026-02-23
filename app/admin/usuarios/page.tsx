'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import type { User, UserRole, ModulePermission } from '@/context/AuthContext';
import { Users, UserCircle, Plus, Loader2, Phone, Mail } from 'lucide-react';

const MODULE_LABELS: Record<ModulePermission, string> = {
  dashboard: 'Dashboard',
  pos: 'Punto de Venta',
  'inventario-materia-prima': 'Inventario Materia Prima',
  'inventario-preparacion': 'Inventario Preparación',
  'inventario-venta': 'Inventario de Venta',
  produccion: 'Producción',
  planificacion: 'Planificación',
  alertas: 'Alertas',
  usuarios: 'Usuarios',
};

const ROL_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  cliente: 'Cliente',
  super_admin: 'Super Admin',
};

export default function UsuariosPage() {
  const { getUsers, createUser, hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState<'clientes' | 'admins'>('clientes');
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState<UserRole>('admin');
  const [permisos, setPermisos] = useState<ModulePermission[]>(['dashboard', 'pos']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUsers = () => setUsers(getUsers());

  useEffect(() => {
    loadUsers();
  }, []);

  const clientes = users.filter((u) => u.rol === 'cliente');
  const admins = users.filter((u) => u.rol !== 'cliente');

  const togglePermiso = (mod: ModulePermission) => {
    setPermisos((p) => (p.includes(mod) ? p.filter((x) => x !== mod) : [...p, mod]));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await createUser(email, password, nombre, telefono, rol, permisos);
    setLoading(false);
    if (res.ok) {
      setShowModal(false);
      setNombre('');
      setEmail('');
      setPassword('');
      setTelefono('');
      setRol('admin');
      setPermisos(['dashboard', 'pos']);
      loadUsers();
    } else {
      setError(res.error || 'Error al crear usuario');
    }
  };

  if (!hasPermission('usuarios')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-600 font-medium">No tienes permiso para acceder a este módulo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold text-gray-800">
          Clientes y Usuarios
        </motion.h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white font-bold hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Crear usuario
        </button>
      </div>

      <div className="flex gap-2 border-b-2 border-frutal-mango/20">
        <button
          onClick={() => setTab('clientes')}
          className={`px-4 py-2 font-medium rounded-t-xl transition-colors ${
            tab === 'clientes' ? 'bg-frutal-kiwi text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Clientes ({clientes.length})
        </button>
        <button
          onClick={() => setTab('admins')}
          className={`px-4 py-2 font-medium rounded-t-xl transition-colors ${
            tab === 'admins' ? 'bg-frutal-mora text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Usuarios administrativos ({admins.length})
        </button>
      </div>

      {tab === 'clientes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-xl border-2 border-frutal-kiwi/30 p-6"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-frutal-kiwi/20">
                  <UserCircle className="w-6 h-6 text-frutal-kiwi" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{u.nombre}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{u.telefono || 'Sin teléfono'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {clientes.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <UserCircle className="w-16 h-16 mx-auto mb-4 text-frutal-kiwi/50" />
              <p>No hay clientes registrados</p>
            </div>
          )}
        </div>
      )}

      {tab === 'admins' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {admins.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-xl border-2 border-frutal-mora/30 p-6"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-frutal-mora/20">
                  <Users className="w-6 h-6 text-frutal-mora" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{u.nombre}</h3>
                  <p className="text-sm text-gray-600">{u.email}</p>
                  <p className="text-sm text-gray-600">{u.telefono || '-'}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-lg bg-frutal-mora/20 text-frutal-mora text-xs font-medium">
                    {ROL_LABELS[u.rol]}
                  </span>
                  {u.permisos.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {u.permisos.slice(0, 3).map((p) => (
                        <span key={p} className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                          {MODULE_LABELS[p]}
                        </span>
                      ))}
                      {u.permisos.length > 3 && <span className="text-xs text-gray-500">+{u.permisos.length - 3}</span>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border-2 border-frutal-mora/30 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Crear usuario o cliente</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-frutal-mora outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-frutal-mora outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-frutal-mora outline-none"
                  placeholder="+58 412 1234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-frutal-mora outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value as UserRole)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-frutal-mora outline-none"
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Administrador</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              {rol !== 'cliente' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Permisos (módulos)</label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(MODULE_LABELS) as ModulePermission[]).map((mod) => (
                      <label key={mod} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={permisos.includes(mod)}
                          onChange={() => togglePermiso(mod)}
                          className="rounded border-frutal-mora"
                        />
                        <span className="text-sm">{MODULE_LABELS[mod]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-xl border-2 border-gray-300 text-gray-700">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-frutal-fresa to-frutal-mora text-white font-bold disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

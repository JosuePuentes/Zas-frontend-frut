'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSucursal } from '@/context/SucursalContext';
import { motion } from 'framer-motion';
import { MapPin, Plus, Lock, Loader2, Building2 } from 'lucide-react';
import type { Sucursal } from '@/context/SucursalContext';

export default function SucursalesPage() {
  const { user, isMaster } = useAuth();
  const { sucursales, addSucursal, updateSucursal, verifyPin, changePin } = useSucursal();
  const [showAdd, setShowAdd] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [lat, setLat] = useState(10.6427);
  const [lng, setLng] = useState(-71.6125);
  const [telefono, setTelefono] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || !isMaster()) {
    return (
      <div className="p-6 text-center text-gray-600">
        Solo el usuario master puede gestionar sucursales.
      </div>
    );
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (!pin.trim()) {
      setPinError('Ingresa el PIN de verificación');
      return;
    }
    setLoading(true);
    const res = await addSucursal(
      { nombre, direccion, lat, lng, telefono: telefono || undefined, activa: true },
      pin
    );
    setLoading(false);
    if (res.ok) {
      setShowAdd(false);
      setNombre('');
      setDireccion('');
      setTelefono('');
      setPin('');
    } else {
      setPinError(res.error || 'Error');
    }
  };

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setPinError('Tu navegador no soporta geolocalización');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => setPinError('No se pudo obtener la ubicación')
    );
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-full rounded-2xl p-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold text-gray-800">Sucursales</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-frutal-kiwi text-white font-bold"
        >
          <Plus className="w-5 h-5" />
          Agregar sucursal
        </button>
      </motion.div>

      {showAdd && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdd}
          className="p-6 bg-white rounded-2xl shadow-lg border-2 border-frutal-mango/30"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-frutal-mora" />
            Nueva sucursal (requiere PIN)
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PIN de verificación</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-frutal-mora outline-none"
                maxLength={6}
              />
              {pinError && <p className="text-red-600 text-sm mt-1">{pinError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-frutal-mora outline-none"
                placeholder="Ej: Sucursal Centro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-frutal-mora outline-none"
                placeholder="Ej: Av. 5 de Julio, Maracaibo"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-frutal-mora outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-frutal-mora outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={obtenerUbicacion}
                  className="px-4 py-2 rounded-lg bg-frutal-mango/30 text-frutal-mango font-medium flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" />
                  Mi ubicación
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-frutal-mora outline-none"
                placeholder="+58 412 123 4567"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-frutal-kiwi text-white font-bold flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              Agregar
            </button>
          </div>
        </motion.form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sucursales.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 bg-white rounded-xl shadow-lg border-2 border-frutal-mango/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-frutal-kiwi/20">
                <Building2 className="w-6 h-6 text-frutal-kiwi" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800">{s.nombre}</h3>
                <p className="text-sm text-gray-600">{s.direccion}</p>
                {s.telefono && <p className="text-xs text-gray-500">{s.telefono}</p>}
                <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${s.activa ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {s.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Users, UserCheck, Clock, Phone, ChevronLeft, Plus } from 'lucide-react';

interface CategoriaData {
  cantidad: number;
  tiempoPromedio: string;
}

interface UrgenciaData {
  hospital: string;
  totalPacientes: number;
  enEspera: number;
  enAtencion: number;
  categorias: {
    [key: string]: CategoriaData;
  };
  ultimaActualizacion: string;
}

export default function Dashboard() {
  const [data, setData] = useState<UrgenciaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/urgencia-collipulli');
      if (!response.ok) throw new Error('Error al cargar datos');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a202c]">
        <RefreshCw className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a202c] text-white p-4 max-w-md mx-auto font-sans">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <ChevronLeft className="w-6 h-6" />
        <h1 className="text-xl font-bold">Fila en Urgencia</h1>
        <button onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {/* Badge */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#2d3748] px-4 py-1.5 rounded-full flex items-center gap-2 border border-gray-700">
          <div className="bg-emerald-500/20 p-1 rounded">
             <Plus className="w-3 h-3 text-emerald-400" />
          </div>
          <span className="text-sm font-medium">Red de Urgencias - Collipulli</span>
        </div>
      </div>

      {/* Hospital Info Card */}
      <div className="bg-red-600 rounded-3xl p-6 mb-6 relative overflow-hidden shadow-xl">
        <div className="flex justify-between items-start relative z-10">
          <div className="flex gap-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold leading-tight">Hospital de Collipulli</h2>
              <p className="text-white/80 text-sm">Unidad de Emergencia Hospitalaria</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center min-w-[70px]">
            <span className="block text-3xl font-black text-slate-800">{data?.totalPacientes || 0}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Total</span>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center text-sm font-medium relative z-10">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>Contacto Directo</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Atención 24 horas</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#2d3748] rounded-3xl p-6 text-center shadow-lg border border-gray-700/50">
          <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <span className="block text-4xl font-bold mb-1">{data?.enEspera || 0}</span>
          <span className="text-gray-400 text-sm font-medium">En espera</span>
        </div>
        <div className="bg-[#2d3748] rounded-3xl p-6 text-center shadow-lg border border-gray-700/50">
          <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <span className="block text-4xl font-bold mb-1">{data?.enAtencion || 0}</span>
          <span className="text-gray-400 text-sm font-medium">En atención</span>
        </div>
      </div>

      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">
        Pacientes por categoría (Tiempo Promedio)
      </h3>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4">
        <CategoryCard
          label="C1"
          value={data?.categorias.C1.cantidad || 0}
          time={data?.categorias.C1.tiempoPromedio || "0 min"}
          color="bg-red-800"
        />
        <CategoryCard
          label="C2"
          value={data?.categorias.C2.cantidad || 0}
          time={data?.categorias.C2.tiempoPromedio || "0 min"}
          color="bg-red-600"
        />
        <CategoryCard
          label="C3"
          value={data?.categorias.C3.cantidad || 0}
          time={data?.categorias.C3.tiempoPromedio || "0 min"}
          color="bg-amber-600"
        />
        <CategoryCard
          label="C4"
          value={data?.categorias.C4.cantidad || 0}
          time={data?.categorias.C4.tiempoPromedio || "0 min"}
          color="bg-blue-600"
        />
        <CategoryCard
          label="C5"
          value={data?.categorias.C5.cantidad || 0}
          time={data?.categorias.C5.tiempoPromedio || "0 min"}
          color="bg-emerald-600"
        />
        <CategoryCard
          label="AD"
          value={data?.categorias.AD.cantidad || 0}
          time={data?.categorias.AD.tiempoPromedio || "0 min"}
          color="bg-purple-600"
        />
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-[10px] flex items-center justify-center gap-2">
        <RefreshCw className="w-3 h-3" />
        <span>Actualizado: {data?.ultimaActualizacion || '---'}</span>
      </footer>
    </main>
  );
}

function CategoryCard({ label, value, time, color }: { label: string, value: number, time: string, color: string }) {
  return (
    <div className={`${color} rounded-2xl p-4 flex flex-col justify-between min-h-[100px] shadow-lg`}>
      <div className="flex justify-between items-start">
        <span className="font-bold text-lg">{label}</span>
        <span className="text-3xl font-black">{value}</span>
      </div>
      <div className="bg-black/20 w-fit px-2 py-0.5 rounded text-[10px] font-bold">
        {time}
      </div>
    </div>
  );
}

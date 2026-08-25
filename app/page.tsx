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

      // Si el API devolvió un objeto de error en lugar de los datos
      if (result.error) {
        throw new Error(result.detail || result.error);
      }

      setData(result);
      setError(null);
    } catch (err: any) {
      console.error("Fetch error:", err.message);
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
            <a href="tel:452552350" className="hover:underline">45-2552350</a>
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
      <div className="grid grid-cols-2 gap-4 mb-8">
        <CategoryCard
          label="C1"
          desc="Crítico"
          value={data?.categorias?.C1?.cantidad || 0}
          time={data?.categorias?.C1?.tiempoPromedio || "0 min"}
          color="bg-red-600"
        />
        <CategoryCard
          label="C2"
          desc="Grave"
          value={data?.categorias?.C2?.cantidad || 0}
          time={data?.categorias?.C2?.tiempoPromedio || "0 min"}
          color="bg-orange-600"
        />
        <CategoryCard
          label="C3"
          desc="Medio"
          value={data?.categorias?.C3?.cantidad || 0}
          time={data?.categorias?.C3?.tiempoPromedio || "0 min"}
          color="bg-amber-500"
        />
        <CategoryCard
          label="C4"
          desc="No Urgente"
          value={data?.categorias?.C4?.cantidad || 0}
          time={data?.categorias?.C4?.tiempoPromedio || "0 min"}
          color="bg-blue-600"
        />
        <CategoryCard
          label="C5"
          desc="General"
          value={data?.categorias?.C5?.cantidad || 0}
          time={data?.categorias?.C5?.tiempoPromedio || "0 min"}
          color="bg-emerald-600"
        />
        <CategoryCard
          label="AD"
          desc="Admisión"
          value={data?.categorias?.AD?.cantidad || 0}
          time={data?.categorias?.AD?.tiempoPromedio || "0 min"}
          color="bg-purple-600"
        />
      </div>

      {/* Legend Block */}
      <div className="bg-[#2d3748]/50 rounded-2xl p-4 border border-gray-700/50 mb-6">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Leyenda de Categorías</h4>
        <div className="grid grid-cols-2 gap-y-2">
          <LegendItem color="bg-red-600" label="C1" text="Crítico" />
          <LegendItem color="bg-orange-600" label="C2" text="Grave" />
          <LegendItem color="bg-amber-500" label="C3" text="Medio" />
          <LegendItem color="bg-blue-600" label="C4" text="No Urgente" />
          <LegendItem color="bg-emerald-600" label="C5" text="General" />
          <LegendItem color="bg-purple-600" label="AD" text="Admisión" />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-[10px] flex items-center justify-center gap-2">
        <RefreshCw className="w-3 h-3" />
        <span>Actualizado: {data?.ultimaActualizacion || '---'}</span>
      </footer>
    </main>
  );
}

function CategoryCard({ label, desc, value, time, color }: { label: string, desc: string, value: number, time: string, color: string }) {
  return (
    <div className={`${color} rounded-2xl p-4 flex flex-col justify-between min-h-[110px] shadow-lg transition-transform active:scale-95`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="font-bold text-lg block leading-none">{label}</span>
          <span className="text-[10px] opacity-80 font-medium">{desc}</span>
        </div>
        <span className="text-3xl font-black">{value}</span>
      </div>
      <div className="bg-black/20 w-fit px-2 py-0.5 rounded text-[10px] font-bold mt-2">
        {time}
      </div>
    </div>
  );
}

function LegendItem({ color, label, text }: { color: string, label: string, text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${color} w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shadow-sm`}>
        {label}
      </div>
      <span className="text-xs text-gray-300">{text}</span>
    </div>
  );
}

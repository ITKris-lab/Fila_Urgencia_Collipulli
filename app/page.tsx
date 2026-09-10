'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Users, Clock, Plus, Info, X, ExternalLink } from 'lucide-react';

interface CategoriaData {
  cantidad: number;
  tiempoPromedio: string;
}

interface UrgenciaData {
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
  const [showInfo, setShowInfo] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/urgencia-collipulli');
      if (!response.ok) throw new Error('Error al cargar datos');
      const result = await response.json();

      if (result.error) {
        throw new Error(result.detail || result.error);
      }

      setData(result);
    } catch (err) {
      console.error("Fetch error:", err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-red-600 animate-spin" />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const categoryDescriptions = [
    { id: 'C1', title: 'Riesgo Vital - Atención Inmediata', color: 'bg-red-600', desc: 'Pasará inmediatamente a box de reanimación.' },
    { id: 'C2', title: 'Emergencia Evidente - Atención antes de 30 min', color: 'bg-orange-600', desc: 'Se requiere evaluación médica urgente. De ser necesario pasará a un box de atención.' },
    { id: 'C3', title: 'Urgencia Inmediata', color: 'bg-amber-500', desc: 'Esperará llamado a categorización y regresará a sala de espera general.' },
    { id: 'C4', title: 'Urgencia Mediana', color: 'bg-blue-600', desc: 'Permanecerá en sala de espera general. Puede consultar en su CESFAM o SAPU.' },
    { id: 'C5', title: 'Atención General', color: 'bg-emerald-600', desc: 'Puede consultar en su CESFAM, SAPU o llamar a Salud Responde.' }
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-4 max-w-md mx-auto font-sans pb-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-100">
            <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} onClick={() => fetchData()} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight text-slate-800">Urgencia<span className="text-red-600">Collipulli</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">En tiempo real</p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(true)}
          className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors"
        >
          <Info className="w-6 h-6" />
        </button>
      </header>

      {/* Hospital Banner */}
      <div className="bg-red-600 rounded-3xl p-6 mb-6 relative overflow-hidden shadow-xl shadow-red-100">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
             <div className="bg-white p-3 rounded-2xl shadow-inner">
                <Users className="w-8 h-8 text-red-600" />
             </div>
             <div>
                <h2 className="text-white font-black text-2xl leading-none">Hospital de Collipulli</h2>
                <p className="text-red-100 text-xs font-bold mt-1 uppercase tracking-tighter opacity-80">Unidad de Emergencia</p>
             </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30">
              <span className="block text-white text-[10px] font-bold uppercase tracking-wider mb-0.5">Pacientes Totales</span>
              <span className="text-white text-3xl font-black">{data?.totalPacientes || 0}</span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white text-[10px] font-bold uppercase tracking-tighter">Abierto 24h</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 text-center">
          <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <span className="block text-2xl font-black text-slate-800 leading-none mb-1">{data?.enEspera || 0}</span>
          <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">En Espera</span>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 text-center">
          <Users className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
          <span className="block text-2xl font-black text-slate-800 leading-none mb-1">{data?.enAtencion || 0}</span>
          <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">En Atención</span>
        </div>
      </div>

      {/* Categories Grid */}
      <h3 className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3 pl-1">Pacientes por Categoría (tiempo promedio)</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <CategoryCard
          label="C1"
          desc="Riesgo Vital - Atención Inmediata"
          value={data?.categorias?.C1?.cantidad || 0}
          time={data?.categorias?.C1?.tiempoPromedio || "0 min"}
          color="bg-red-600"
        />
        <CategoryCard
          label="C2"
          desc="Emergencia Evidente"
          value={data?.categorias?.C2?.cantidad || 0}
          time={data?.categorias?.C2?.tiempoPromedio || "30 min"}
          color="bg-orange-600"
        />
        <CategoryCard
          label="C3"
          desc="Urgencia Inmediata"
          value={data?.categorias?.C3?.cantidad || 0}
          time={data?.categorias?.C3?.tiempoPromedio || "0 min"}
          color="bg-amber-500"
        />
        <CategoryCard
          label="C4"
          desc="Urgencia Mediana"
          value={data?.categorias?.C4?.cantidad || 0}
          time={data?.categorias?.C4?.tiempoPromedio || "0 min"}
          color="bg-blue-600"
        />
        <CategoryCard
          label="C5"
          desc="Atención General"
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

      {/* Telesalud Section (Moved to end) */}
      <a
        href="https://telesalud.gob.cl"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-blue-600 hover:bg-blue-700 transition-colors rounded-3xl p-4 mb-8 shadow-lg shadow-blue-100 border border-blue-500"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-base leading-none">Telesalud</p>
              <p className="text-blue-100 text-[9px] mt-1 font-bold uppercase">Solicitar atención virtual</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-white/50" />
        </div>
      </a>

      {/* Modal de Información */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800">¿Qué significa cada color?</h3>
                <button onClick={() => setShowInfo(false)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-6">
                  <p className="text-red-700 text-xs font-bold leading-tight uppercase tracking-tighter">
                    Recuerde que su atención se basa en la clasificación de su riesgo y no en el orden de llegada.
                  </p>
                </div>

                {categoryDescriptions.map((cat) => (
                  <div key={cat.id} className="flex gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className={`${cat.color} w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-white font-black text-lg shadow-sm`}>
                      {cat.id}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm mb-0.5">{cat.title}</p>
                      <p className="text-slate-500 text-xs leading-relaxed">{cat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowInfo(false)}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl mt-6 active:scale-95 transition-transform"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold mb-2">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizado: {data?.ultimaActualizacion || '---'}</span>
        </div>
        <p className="text-slate-300 text-[9px] uppercase tracking-widest">Hospital Collipulli • Unidad de TIC </p>
        <p className="text-slate-300 text-[9px] uppercase tracking-widest">Participación</p>
      </footer>
    </main>
  );
}

function CategoryCard({ label, desc, value, time, color }: { label: string, desc: string, value: number, time: string, color: string }) {
  return (
    <div className={`${color} rounded-2xl p-3 flex flex-col gap-1 shadow-md transition-all active:scale-95 border border-white/10 relative overflow-hidden group`}>
      <div className="flex justify-between items-center relative z-10">
        <span className="text-white font-black text-lg opacity-80">{label}</span>
        <span className="text-white font-black text-2xl tracking-tighter">{value}</span>
      </div>

      <p className="text-white/90 text-[10px] font-bold leading-tight uppercase relative z-10">{desc}</p>

      <div className="flex items-center gap-1.5 bg-black/10 backdrop-blur-sm rounded-full py-0.5 px-2 w-fit border border-white/10 relative z-10">
        <Clock className="w-2.5 h-2.5 text-white/70" />
        <span className="text-white text-[9px] font-bold">{time}</span>
      </div>
    </div>
  );
}

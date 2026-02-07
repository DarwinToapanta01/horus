import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ListaComentarios = () => {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVerificados = async () => {
            try {
                const res = await api.get('/reports');
                // Solo mostramos los que tienen 3 o más votos SÍ
                const verificados = res.data.filter(r => r.confirms >= 3);
                setReportes(verificados);
            } catch (error) {
                console.error('Error al cargar reportes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVerificados();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-8 relative overflow-hidden">
            {/* Luces de fondo con tonos emerald (verde) para comentarios */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-teal-600 rounded-full blur-[120px] opacity-15"></div>

            {/* Header */}
            <header className="relative z-10 mb-8">
                <button
                    onClick={() => navigate('/menu')}
                    className="mb-4 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Volver
                </button>

                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                        <span className="text-3xl">💬</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase">Debates Ciudadanos</h1>
                        <p className="text-slate-400 text-sm font-medium mt-1">Zonas verificadas por la comunidad</p>
                    </div>
                </div>
            </header>

            {/* Contenido */}
            <div className="relative z-10 space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Cargando debates...</p>
                    </div>
                ) : reportes.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl text-center">
                        <span className="text-5xl mb-4 block opacity-50">🔍</span>
                        <p className="text-slate-400 text-sm font-medium">No hay zonas verificadas para debatir aún.</p>
                        <p className="text-slate-500 text-xs mt-2">Las zonas necesitan 3+ votos de confirmación.</p>
                    </div>
                ) : (
                    reportes.map(r => (
                        <button
                            key={r.id}
                            onClick={() => navigate(`/reporte/${r.id}/comentarios`)}
                            className="w-full group relative overflow-hidden bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-3xl transition-all active:scale-95 hover:border-emerald-500/30 flex justify-between items-center shadow-xl"
                        >
                            {/* Gradiente hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3">
                                    <span className="text-2xl">📍</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm uppercase tracking-wide text-white">Zona #{r.id}</p>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">{r.description.substring(0, 40)}...</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                                            ✓ {r.confirms} votos
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* Footer */}
            {reportes.length > 0 && (
                <footer className="mt-8 text-center relative z-10">
                    <div className="inline-block px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                            {reportes.length} {reportes.length === 1 ? 'Zona Activa' : 'Zonas Activas'}
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default ListaComentarios;
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const VotacionLista = () => {
    const [reportes, setReportes] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [voto, setVoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingReportes, setLoadingReportes] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReportes();
    }, []);

    const fetchReportes = async () => {
        try {
            const res = await api.get('/reports');
            setReportes(res.data);
        } catch (err) {
            console.error("Error al obtener los reportes");
        } finally {
            setLoadingReportes(false);
        }
    };

    const getColorClass = (level) => {
        if (level >= 70) return 'bg-red-500';
        if (level >= 40) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getBorderColor = (level) => {
        if (level >= 70) return 'border-red-500/30';
        if (level >= 40) return 'border-amber-500/30';
        return 'border-emerald-500/30';
    };

    const getCircleColor = (level) => {
        if (level >= 70) return '#ef4444';
        if (level >= 40) return '#f59e0b';
        return '#10b981';
    };

    const handleVotar = async () => {
        if (voto === null) {
            alert("Por favor, selecciona SÍ o NO");
            return;
        }
        
        setLoading(true);

        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                await api.post('/votes', {
                    report_id: selectedReport.id,
                    type: voto,
                    user_lat: pos.coords.latitude,
                    user_lng: pos.coords.longitude
                });
                alert("¡Voto registrado exitosamente!");
                setSelectedReport(null);
                setVoto(null);
                fetchReportes();
            } catch (err) {
                alert(err.response?.data?.error || "Error al procesar el voto");
            } finally {
                setLoading(false);
            }
        }, () => {
            alert("Es necesario activar el GPS para votar.");
            setLoading(false);
        });
    };

    const reportesPendientes = reportes.filter(r => !r.is_expired);

    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-8 relative overflow-hidden">
            {/* Luces de fondo con tonos púrpura (votación) */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-15"></div>

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
                    <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                        <span className="text-3xl">🗳️</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase">Validar Reportes</h1>
                        <p className="text-slate-400 text-sm font-medium mt-1">Ayuda a verificar incidentes de la comunidad</p>
                    </div>
                </div>
            </header>

            {/* Contenido */}
            <div className="relative z-10 space-y-4 max-w-2xl mx-auto pb-8">
                {loadingReportes ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Cargando reportes...</p>
                    </div>
                ) : reportesPendientes.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl text-center">
                        <span className="text-5xl mb-4 block opacity-50">✅</span>
                        <p className="text-slate-400 text-sm font-medium">No hay reportes pendientes de validación.</p>
                        <p className="text-slate-500 text-xs mt-2">¡Excelente! Todos los reportes activos ya están verificados.</p>
                    </div>
                ) : (
                    reportesPendientes.map((r) => (
                        <div
                            key={r.id}
                            onClick={() => !r.user_has_voted && setSelectedReport(r)}
                            className={`group relative overflow-hidden bg-white/5 backdrop-blur-lg border rounded-3xl shadow-xl transition-all ${
                                r.user_has_voted 
                                    ? 'opacity-50 cursor-not-allowed border-white/10' 
                                    : `cursor-pointer active:scale-[0.98] hover:border-purple-500/30 border-white/10`
                            }`}
                        >
                            {/* Gradiente hover */}
                            {!r.user_has_voted && (
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            )}

                            {/* Header de la card */}
                            <div className={`relative z-10 px-5 py-3 font-bold text-sm uppercase tracking-wide flex justify-between items-center ${getColorClass(r.danger_level)}`}>
                                <span className="text-slate-900">Zona #{r.id}</span>
                                <span className="bg-black/20 px-3 py-1 rounded-full text-[10px] font-black">
                                    {r.user_has_voted ? '✓ VOTADO' : '⏳ PENDIENTE'}
                                </span>
                            </div>

                            {/* Contenido */}
                            <div className="relative z-10 p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                        <span>📅</span>
                                        <span>{r.formatted_date}</span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                        r.danger_level >= 70 
                                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                            : r.danger_level >= 40 
                                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    }`}>
                                        Nivel {r.danger_level}%
                                    </div>
                                </div>

                                {/* Barra de progreso de votación */}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-[10px] font-bold mb-2">
                                        <span className="text-emerald-400">SÍ: {r.confirms}</span>
                                        <span className="text-red-400">NO: {r.rejects}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                                        <div 
                                            className="h-full bg-emerald-500 transition-all" 
                                            style={{ width: `${(r.confirms / (r.confirms + r.rejects || 1)) * 100}%` }}
                                        />
                                        <div 
                                            className="h-full bg-red-500 transition-all" 
                                            style={{ width: `${(r.rejects / (r.confirms + r.rejects || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {!r.user_has_voted && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-purple-400 font-semibold uppercase tracking-wider">
                                        <span>Toca para validar</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* MODAL DE VOTACIÓN */}
            {selectedReport && (
                <div className="fixed inset-0 z-[2000] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fadeIn">
                    <div className="bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col">

                        {/* Mapa de Contexto */}
                        <div className="h-56 w-full relative border-b-4 border-purple-500/30">
                            <MapContainer
                                center={[selectedReport.latitude, selectedReport.longitude]}
                                zoom={16}
                                zoomControl={false}
                                dragging={false}
                                touchZoom={false}
                                scrollWheelZoom={false}
                                className="h-full w-full"
                                style={{ filter: 'brightness(0.75) contrast(1.1)' }}
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                <Marker position={[selectedReport.latitude, selectedReport.longitude]} />
                                <Circle
                                    center={[selectedReport.latitude, selectedReport.longitude]}
                                    radius={500}
                                    pathOptions={{
                                        fillColor: getCircleColor(selectedReport.danger_level),
                                        color: getCircleColor(selectedReport.danger_level),
                                        weight: 2,
                                        opacity: 0.8,
                                        fillOpacity: 0.25
                                    }}
                                />
                            </MapContainer>

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 via-transparent to-slate-800/90 pointer-events-none"></div>

                            {/* Badge flotante */}
                            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl z-[1001]">
                                <p className="text-[10px] uppercase font-black text-white tracking-wider">Ubicación del Incidente</p>
                            </div>

                            {/* Info de la zona en la parte inferior */}
                            <div className="absolute bottom-4 left-4 right-4 z-[1001]">
                                <div className="bg-slate-900/80 backdrop-blur-lg border border-white/20 p-4 rounded-2xl">
                                    <h3 className="text-white font-black uppercase text-sm tracking-tight">Zona #{selectedReport.id}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                            selectedReport.danger_level >= 70 
                                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                                : selectedReport.danger_level >= 40 
                                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        }`}>
                                            Nivel {selectedReport.danger_level}%
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">{selectedReport.formatted_date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contenido del modal */}
                        <div className="p-6 flex flex-col items-center">
                            <h3 className="text-white font-black uppercase text-lg mb-2 tracking-tight text-center">
                                ¿Confirmas el Nivel de Riesgo?
                            </h3>
                            <p className="text-slate-400 text-sm mb-6 text-center font-medium">
                                Evalúa según tu conocimiento de esta zona
                            </p>

                            {/* Opciones de voto */}
                            <div className="flex justify-center gap-8 mb-8">
                                <label className="flex flex-col items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="vote" 
                                        className="hidden" 
                                        onChange={() => setVoto(true)} 
                                    />
                                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all shadow-lg ${
                                        voto === true 
                                            ? 'bg-gradient-to-br from-emerald-600 to-emerald-500 border-white scale-110 shadow-emerald-500/50' 
                                            : 'border-slate-700 bg-slate-800/50 group-hover:border-emerald-500/50 group-hover:scale-105'
                                    }`}>
                                        <span className="text-2xl font-black">✓</span>
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                                        voto === true ? 'text-emerald-400' : 'text-slate-500'
                                    }`}>
                                        Es Real
                                    </span>
                                </label>

                                <label className="flex flex-col items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="radio" 
                                        name="vote" 
                                        className="hidden" 
                                        onChange={() => setVoto(false)} 
                                    />
                                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all shadow-lg ${
                                        voto === false 
                                            ? 'bg-gradient-to-br from-red-600 to-red-500 border-white scale-110 shadow-red-500/50' 
                                            : 'border-slate-700 bg-slate-800/50 group-hover:border-red-500/50 group-hover:scale-105'
                                    }`}>
                                        <span className="text-2xl font-black">✕</span>
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                                        voto === false ? 'text-red-400' : 'text-slate-500'
                                    }`}>
                                        Es Falso
                                    </span>
                                </label>
                            </div>

                            {/* Botones de acción */}
                            <div className="w-full space-y-3">
                                <button
                                    onClick={handleVotar}
                                    disabled={loading || voto === null}
                                    className={`w-full font-bold py-4 rounded-2xl uppercase tracking-wide transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3 ${
                                        loading || voto === null
                                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Procesando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-xl">🗳️</span>
                                            <span>Confirmar Voto</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => { 
                                        setSelectedReport(null); 
                                        setVoto(null); 
                                    }}
                                    className="w-full text-slate-500 hover:text-slate-300 text-sm font-bold uppercase py-3 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VotacionLista;
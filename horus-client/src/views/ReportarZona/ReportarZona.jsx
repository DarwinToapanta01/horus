import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import api from '../../api/axios';

const ReportarZona = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);

    if (!state) return navigate('/ubicar-zona');

    const handleFinalReport = async () => {
        if (!comentario.trim()) {
            alert('Por favor, describe lo que sucede en esta zona.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/reports', {
                latitude: state.position[0],
                longitude: state.position[1],
                description: comentario,
                danger_level: state.dangerLevel,
                radius: 500
            });
            alert('¡Reporte enviado exitosamente!');
            navigate('/mapa');
        } catch (error) {
            alert('Error al enviar el reporte. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const getSliderColor = () => {
        if (state.dangerLevel >= 70) return 'bg-red-500';
        if (state.dangerLevel >= 40) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getCircleColor = () => {
        if (state.dangerLevel >= 70) return '#ef4444';
        if (state.dangerLevel >= 40) return '#f59e0b';
        return '#10b981';
    };

    const getLevelText = () => {
        if (state.dangerLevel >= 70) return 'Alto Riesgo';
        if (state.dangerLevel >= 40) return 'Riesgo Moderado';
        return 'Bajo Riesgo';
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-8 relative overflow-hidden">
            {/* Luces de fondo con tonos rojo (alerta) */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-orange-600 rounded-full blur-[120px] opacity-15"></div>

            {/* Header */}
            <header className="relative z-10 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Volver
                </button>

                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20">
                        <span className="text-3xl">📝</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase">Detalles del Reporte</h1>
                        <p className="text-slate-400 text-sm font-medium mt-1">Paso 2 de 2 • Confirma la información</p>
                    </div>
                </div>
            </header>

            {/* Contenido */}
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                {/* Ubicación con Mapa */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-xl">
                    <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-3 ml-1">
                        📍 Ubicación Seleccionada
                    </label>
                    <div className="w-full h-64 rounded-2xl overflow-hidden border-2 border-slate-700">
                        <MapContainer
                            center={state.position}
                            zoom={15}
                            zoomControl={false}
                            className="h-full w-full"
                            style={{ filter: 'brightness(0.85) contrast(1.1)' }}
                        >
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                            <Marker position={state.position} />
                            <Circle
                                center={state.position}
                                radius={500}
                                pathOptions={{
                                    fillColor: getCircleColor(),
                                    color: getCircleColor(),
                                    weight: 2,
                                    opacity: 0.8,
                                    fillOpacity: 0.25
                                }}
                            />
                        </MapContainer>
                    </div>
                    {/* Coordenadas pequeñas debajo */}
                    <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                        <span>Lat: {state.position[0].toFixed(4)}</span>
                        <span>•</span>
                        <span>Lng: {state.position[1].toFixed(4)}</span>
                    </div>
                </div>

                {/* Nivel de Peligrosidad */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-xs uppercase tracking-widest font-bold text-slate-300">
                            ⚠️ Nivel de Riesgo
                        </label>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${state.dangerLevel >= 70
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : state.dangerLevel >= 40
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}>
                            {getLevelText()}
                        </div>
                    </div>

                    <div className="relative w-full h-4 bg-slate-800 rounded-full mt-12 mb-4">
                        <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all ${getSliderColor()}`}
                            style={{ width: `${state.dangerLevel}%` }}
                        ></div>

                        {/* Indicador */}
                        <div
                            className="absolute -top-12 flex flex-col items-center"
                            style={{ left: `calc(${state.dangerLevel}% - 24px)` }}
                        >
                            <div className={`${getSliderColor()} text-sm font-black px-3 py-1.5 rounded-xl shadow-lg`}>
                                {state.dangerLevel}%
                            </div>
                            <div className={`w-3 h-3 ${getSliderColor()} rotate-45 -mt-1.5`}></div>
                        </div>

                        {/* Círculo */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-slate-900 rounded-full shadow-xl"
                            style={{ left: `calc(${state.dangerLevel}% - 14px)` }}
                        ></div>
                    </div>
                </div>

                {/* Comentario */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-xl">
                    <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-3 ml-1">
                        💬 Descripción del Incidente
                    </label>
                    <textarea
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none h-40"
                        placeholder="Describe lo que sucede en esta zona... Por ejemplo: Asaltos frecuentes, iluminación deficiente, vandalismo, etc."
                        required
                    ></textarea>
                    <p className="text-xs text-slate-500 mt-2 ml-1 font-medium">
                        Sé específico para ayudar a la comunidad • {comentario.length} caracteres
                    </p>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl uppercase tracking-wide transition-all active:scale-95 border border-slate-700"
                    >
                        Modificar
                    </button>
                    <button
                        onClick={handleFinalReport}
                        disabled={loading || !comentario.trim()}
                        className={`flex-1 font-bold py-4 rounded-2xl uppercase tracking-wide transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3 ${loading || !comentario.trim()
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-900/30'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Enviando...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-xl">🚨</span>
                                <span>Enviar Reporte</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Info adicional */}
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <span className="text-xl">ℹ️</span>
                        <div>
                            <p className="text-blue-400 text-sm font-bold mb-1">Radio de Afectación</p>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed">
                                Tu reporte cubrirá un radio de <span className="text-white font-bold">500 metros</span> alrededor del punto marcado (visible en el mapa).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportarZona;
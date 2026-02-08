import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapaSeguridad = () => {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const center = [-0.2520, -79.1716];

    useEffect(() => {
        const fetchReportes = async () => {
            try {
                const response = await api.get('/reports');
                setReportes(response.data);
            } catch (error) {
                console.error("Error al cargar reportes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReportes();
    }, []);

    const getColor = (level) => {
        if (level >= 70) return '#ef4444';
        if (level >= 40) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div className="h-screen w-full flex flex-col bg-slate-900 relative overflow-hidden">
            {/* Luces de fondo sutiles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none z-[999]"></div>

            {/* Header Flotante */}
            <div className="absolute top-6 left-40 right-40 z-[1000] flex justify-between items-start gap-3">
                {/* Título */}
                <div className="bg-slate-900/90 backdrop-blur-lg border border-white/20 px-5 py-3 rounded-2xl shadow-2xl flex-1">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-xl">
                            <span className="text-xl">🗺️</span>
                        </div>
                        <div>
                            <h2 className="text-white font-black text-sm uppercase tracking-tight">Mapa de Vigilancia</h2>
                            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wider">Horus • Tiempo Real</p>
                        </div>
                    </div>
                </div>

                {/* Contador de reportes */}
                <div className="bg-slate-900/90 backdrop-blur-lg border border-blue-500/30 px-4 py-3 rounded-2xl shadow-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-black text-xs">{reportes.length}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Zonas</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Cargando mapa...</p>
                </div>
            ) : (
                <MapContainer
                    center={center}
                    zoom={14}
                    className="flex-1 w-full z-0"
                    style={{ filter: 'brightness(0.8) contrast(1.1)' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; CARTO'
                    />

                    {reportes
                        .filter((reporte) => {
                            const isVerified = (reporte.confirms || 0) >= 3;
                            const isExpired = reporte.is_expired;
                            return isVerified || !isExpired;
                        })
                        .map((reporte) => {
                            const isVerified = (reporte.confirms || 0) >= 3;

                            return (
                                <React.Fragment key={reporte.id}>
                                    <Marker position={[reporte.latitude, reporte.longitude]}>
                                        <Popup>
                                            <div className="p-4 min-w-[200px] max-w-[240px] font-sans antialiased bg-slate-900 rounded-2xl">
                                                {/* Cabecera con Fecha y Badge de Estado */}
                                                <div className="flex flex-col gap-2 mb-4">
                                                    <span className="text-[10px] text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                                                        <span className="text-xs">📅</span> {reporte.formatted_date}
                                                    </span>

                                                    <div className={`text-[9px] w-fit px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border ${isVerified
                                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                                        }`}>
                                                        {isVerified ? '● Verificado' : '○ En Validación'}
                                                    </div>
                                                </div>

                                                {/* Contenido Principal */}
                                                {isVerified ? (
                                                    <div className="space-y-3">
                                                        <p className="text-[13px] text-slate-300 leading-snug font-medium">
                                                            {reporte.description}
                                                        </p>
                                                        <button
                                                            onClick={() => navigate(`/reporte/${reporte.id}/comentarios`)}
                                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] py-2.5 rounded-xl uppercase font-bold shadow-lg shadow-blue-900/30 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                                                        >
                                                            Ver Muro 💬
                                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="bg-amber-500/10 border-l-4 border-amber-500 p-3 rounded-r-xl">
                                                            <p className="text-[11px] text-amber-300 leading-tight font-medium">
                                                                Contenido bloqueado. Faltan <span className="font-black text-amber-400">{3 - (reporte.confirms || 0)} votos</span> para liberar la información.
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => navigate('/votacion-lista')}
                                                            className="w-full bg-slate-800 hover:bg-slate-700 text-white text-[10px] py-2.5 rounded-xl uppercase font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
                                                        >
                                                            Validar Zona 🗳️
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Footer: Votaciones con barra de progreso visual */}
                                                <div className="mt-4 pt-3 border-t border-white/10">
                                                    <div className="flex justify-between text-[10px] font-black mb-2">
                                                        <span className="text-emerald-400">SÍ: {reporte.confirms || 0}</span>
                                                        <span className="text-red-400">NO: {reporte.rejects || 0}</span>
                                                    </div>
                                                    {/* Barra de progreso visual */}
                                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                                                        <div
                                                            className="h-full bg-emerald-500 transition-all"
                                                            style={{ width: `${(reporte.confirms / (reporte.confirms + reporte.rejects || 1)) * 100}%` }}
                                                        />
                                                        <div
                                                            className="h-full bg-red-500 transition-all"
                                                            style={{ width: `${(reporte.rejects / (reporte.confirms + reporte.rejects || 1)) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>

                                    <Circle
                                        center={[reporte.latitude, reporte.longitude]}
                                        radius={reporte.radius || 200}
                                        pathOptions={{
                                            fillColor: getColor(reporte.danger_level),
                                            color: getColor(reporte.danger_level),
                                            weight: 2,
                                            opacity: isVerified ? 0.8 : 0.3,
                                            fillOpacity: isVerified ? 0.25 : 0.1
                                        }}
                                    />
                                </React.Fragment>
                            );
                        })}
                </MapContainer>
            )}

            {/* BOTÓN FLOTANTE: Crear nuevo reporte */}
            <button
                onClick={() => navigate('/ubicar-zona')}
                className="absolute bottom-8 right-6 z-[1000] bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white w-16 h-16 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center text-3xl active:scale-90 transition-all border-4 border-white/20"
                title="Reportar nueva zona"
            >
                🚨
            </button>

            {/* Leyenda de colores */}
            <div className="absolute bottom-8 left-6 z-[1000] bg-slate-900/90 backdrop-blur-lg border border-white/20 px-4 py-3 rounded-2xl shadow-2xl">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Nivel de Peligro</p>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] text-slate-300 font-medium">Bajo (&lt;40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-[10px] text-slate-300 font-medium">Medio (40-70%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-[10px] text-slate-300 font-medium">Alto (&gt;70%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapaSeguridad;
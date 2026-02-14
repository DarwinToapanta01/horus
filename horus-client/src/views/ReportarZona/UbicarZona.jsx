import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { IconAlert, IconLocation } from './../../components/Icons';


const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    return position ? <Marker position={position} /> : null;
};

const ChangeView = ({ center }) => {
    const map = useMapEvents({});
    map.setView(center, map.getZoom());
    return null;
};

const UbicarZona = () => {
    const navigate = useNavigate();
    const [position, setPosition] = useState([-0.2520, -79.1716]);
    const [dangerLevel, setDangerLevel] = useState(10);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const getSliderColor = () => {
        if (dangerLevel >= 70) return 'bg-red-500';
        if (dangerLevel >= 40) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const getLevelText = () => {
        if (dangerLevel >= 70) return 'Alto Riesgo';
        if (dangerLevel >= 40) return 'Riesgo Moderado';
        return 'Bajo Riesgo';
    };

    const handleNext = () => {
        navigate('/reportar-detalles', { state: { position, dangerLevel } });
    };

    const handleMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización");
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
                setLoadingLocation(false);
            },
            (error) => {
                alert("Error al obtener ubicación: " + error.message);
                setLoadingLocation(false);
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-8 relative overflow-hidden">
            {/* Luces de fondo */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-600 rounded-full blur-[120px] opacity-20" />
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-orange-600 rounded-full blur-[120px] opacity-15" />

            {/* Header */}
            <header className="relative z-10 mb-8">
                <button
                    onClick={() => navigate('/menu')}
                    className="mb-4 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold uppercase tracking-wider"
                >
                    ← Volver
                </button>

                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400">
                        <IconAlert className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight uppercase">
                            Reportar Zona
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-1">
                            Alerta a la comunidad sobre incidentes
                        </p>
                    </div>
                </div>
            </header>

            <div className="relative z-10 space-y-6">
                {/* Botón Mi Ubicación */}
                <div className="flex justify-center">
                    <button
                        onClick={handleMyLocation}
                        disabled={loadingLocation}
                        className={`group relative overflow-hidden px-6 py-3 rounded-2xl border transition-all active:scale-95 flex items-center gap-3 shadow-xl ${loadingLocation
                            ? 'bg-slate-800 border-slate-700 cursor-not-allowed'
                            : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                            }`}
                    >
                        <div
                            className={`transition-transform ${loadingLocation ? 'animate-pulse' : 'group-hover:scale-110'
                                } text-blue-400`}
                        >
                            <IconLocation className="w-6 h-6" />
                        </div>

                        <span className="text-sm font-bold uppercase tracking-wider">
                            {loadingLocation ? 'Obteniendo ubicación...' : 'Usar Mi Ubicación'}
                        </span>
                    </button>
                </div>

                {/* Mapa */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-3xl shadow-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-3 text-center">
                        Toca el mapa para marcar la ubicación exacta
                    </p>
                    <div className="w-full h-80 rounded-2xl overflow-hidden border-2 border-slate-700">
                        <MapContainer center={position} zoom={15} className="h-full w-full">
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                            <ChangeView center={position} />
                            <LocationMarker position={position} setPosition={setPosition} />
                        </MapContainer>
                    </div>
                </div>

                {/* Slider */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-slate-300 uppercase font-bold text-sm">Nivel de Riesgo</p>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${dangerLevel >= 70
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : dangerLevel >= 40
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}>
                            {getLevelText()}
                        </div>
                    </div>

                    <div className="relative w-full h-4 bg-slate-800 rounded-full mb-16 mt-8">
                        {/* Barra de progreso coloreada */}
                        <div
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${getSliderColor()}`}
                            style={{ width: `${dangerLevel}%` }}
                        ></div>

                        {/* Input Slider */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={dangerLevel}
                            onChange={(e) => setDangerLevel(parseInt(e.target.value))}
                            className="absolute top-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />

                        {/* Indicador Flotante */}
                        <div
                            className="absolute -top-12 flex flex-col items-center transition-all duration-150"
                            style={{ left: `calc(${dangerLevel}% - 24px)` }}
                        >
                            <div className={`${getSliderColor()} text-sm font-black px-3 py-1.5 rounded-xl shadow-lg`}>
                                {dangerLevel}%
                            </div>
                            <div className={`w-3 h-3 ${getSliderColor()} rotate-45 -mt-1.5`}></div>
                        </div>

                        {/* Círculo del slider */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white border-4 border-slate-900 rounded-full pointer-events-none shadow-xl z-10"
                            style={{ left: `calc(${dangerLevel}% - 14px)` }}
                        ></div>
                    </div>

                    {/* Escala de referencia */}
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-4">
                        <span>0% Seguro</span>
                        <span>50% Moderado</span>
                        <span>100% Peligroso</span>
                    </div>
                </div>

                {/* Botón continuar */}
                <button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 font-bold py-5 rounded-2xl uppercase tracking-wide transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3"
                >
                    <IconAlert className="w-7 h-7" />
                    <span>Continuar con el Reporte</span>
                </button>
            </div>
        </div>
    );
};

export default UbicarZona;

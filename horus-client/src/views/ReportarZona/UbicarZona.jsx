import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) { setPosition([e.latlng.lat, e.latlng.lng]); },
    });
    return position ? <Marker position={position} /> : null;
};

const UbicarZona = () => {
    const navigate = useNavigate();
    const [position, setPosition] = useState([-0.2520, -79.1716]);
    const [dangerLevel, setDangerLevel] = useState(10);

    // Lógica de colores para el slider
    const getSliderColor = () => {
        if (dangerLevel >= 70) return 'bg-red-500';
        if (dangerLevel >= 40) return 'bg-orange-500';
        return 'bg-green-500';
    };

    const handleNext = () => {
        // Pasamos los datos al siguiente paso mediante el estado de navegación
        navigate('/reportar-detalles', { state: { position, dangerLevel } });
    };

    const handleMyLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
        });
    };

    return (
        <div className="min-h-screen bg-[#0f1216] text-white flex flex-col p-6 items-center">
            <h1 className="text-4xl font-black mb-2 tracking-tighter italic">HORUS</h1>
            <h2 className="text-slate-400 text-lg mb-6 uppercase tracking-widest font-bold">Reportar Zona Segura</h2>

            {/* Botón Mi Ubicación */}
            <button
                onClick={handleMyLocation}
                className="mb-4 bg-blue-600/20 p-3 rounded-full border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
                📍
            </button>

            {/* Mapa */}
            <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-700 mb-8 relative">
                <MapContainer center={position} zoom={15} className="h-full w-full">
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>

            {/* Slider Dinámico */}
            <div className="w-full max-w-sm flex flex-col items-center">
                <p className="text-slate-300 uppercase font-bold text-sm mb-8">Selecciona el nivel de riesgo</p>

                <div className="relative w-full h-4 bg-slate-800 rounded-full mb-12">
                    {/* Barra de progreso coloreada */}
                    <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-colors duration-300 ${getSliderColor()}`}
                        style={{ width: `${dangerLevel}%` }}
                    ></div>

                    {/* Input Slider Invisible sobre la barra */}
                    <input
                        type="range" min="0" max="100" step="10" value={dangerLevel}
                        onChange={(e) => setDangerLevel(parseInt(e.target.value))}
                        className="absolute top-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />

                    {/* Indicador (Tooltip) Flotante */}
                    <div
                        className={`absolute -top-10 flex flex-col items-center transition-all duration-150`}
                        style={{ left: `calc(${dangerLevel}% - 20px)` }}
                    >
                        <div className={`${getSliderColor()} text-[10px] font-bold px-2 py-1 rounded-md mb-[-2px]`}>
                            {dangerLevel}%
                        </div>
                        <div className={`w-3 h-3 ${getSliderColor()} rotate-45`}></div>
                    </div>

                    {/* El círculo blanco del slider */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-slate-900 rounded-full pointer-events-none shadow-lg z-10"
                        style={{ left: `calc(${dangerLevel}% - 12px)` }}
                    ></div>
                </div>

                <button
                    onClick={handleNext}
                    className="w-full bg-[#3b82f6]/80 hover:bg-[#3b82f6] text-white font-black py-4 rounded-md uppercase tracking-[0.2em] transition-all shadow-xl"
                >
                    Reportar
                </button>
            </div>

            <div className="mt-10 opacity-50">
                <img src="/logo-ojo.png" alt="Horus Eye" className="w-16 grayscale invert" />
            </div>
        </div>
    );
};

export default UbicarZona;
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

// Corregir los iconos por defecto de Leaflet
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
        if (level >= 70) return '#ef4444'; // Rojo (Alto)
        if (level >= 40) return '#f59e0b'; // Naranja (Medio)
        return '#10b981'; // Verde (Bajo)
    };

    return (
        <div className="h-screen w-full flex flex-col bg-slate-900">
            {/* Header Flotante */}
            <div className="absolute top-4 left-0 right-0 z-[1000] px-4">
                <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex justify-between items-center">
                    <button onClick={() => navigate('/menu')} className="text-white bg-white/10 p-2 rounded-lg">
                        ⬅️
                    </button>
                    <h2 className="text-white font-black text-xs uppercase tracking-[0.2em]">Mapa de Vigilancia</h2>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {reportes.length}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <MapContainer center={center} zoom={14} className="flex-1 w-full z-0">
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; CARTO'
                    />

                    {reportes.map((reporte) => {
                        // REGLA: Solo mostrar visualmente si tiene al menos 1 confirmación
                        // O si el usuario quiere ver "todo", podrías quitar este if.
                        const isVerified = (reporte.confirms || 0) >= 3;

                        return (
                            <React.Fragment key={reporte.id}>
                                <Marker position={[reporte.latitude, reporte.longitude]}>
                                    <Popup>
                                        <div className="p-2 min-w-[150px]">
                                            <h3 className="font-bold border-b border-gray-200 mb-1 uppercase text-[10px] text-slate-500">
                                                Estado: {isVerified ? '✅ Verificado' : '⏳ Pendiente'}
                                            </h3>

                                            {/* Si no está verificado, ocultamos el comentario detallado */}
                                            {isVerified ? (
                                                <p className="text-sm text-gray-700 mb-2 font-medium">{reporte.description}</p>
                                            ) : (
                                                <p className="text-[11px] text-orange-600 italic mb-2 bg-orange-50 p-1 rounded">
                                                    Detalles bloqueados. Requiere {3 - (reporte.confirms || 0)} votos más para ser público.
                                                </p>
                                            )}

                                            <div className="flex justify-between text-[10px] font-bold uppercase mt-2">
                                                <span className="text-green-600">Confirma: {reporte.confirms || 0}</span>
                                                <span className="text-red-600">Rechaza: {reporte.rejects || 0}</span>
                                            </div>

                                            <button
                                                onClick={() => navigate('/votacion-lista')}
                                                className="w-full mt-3 bg-slate-800 text-white text-[9px] py-1 rounded uppercase font-black"
                                            >
                                                Ir a votar
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>

                                <Circle
                                    center={[reporte.latitude, reporte.longitude]}
                                    radius={reporte.radius || 200}
                                    pathOptions={{
                                        fillColor: getColor(reporte.danger_level),
                                        color: getColor(reporte.danger_level),
                                        weight: 1,
                                        opacity: isVerified ? 0.8 : 0.3, // Menos opaco si no está verificado
                                        fillOpacity: isVerified ? 0.2 : 0.05
                                    }}
                                />
                            </React.Fragment>
                        );
                    })}
                </MapContainer>
            )}

            <button
                onClick={() => navigate('/ubicar-zona')}
                className="absolute bottom-8 right-8 z-[1000] bg-blue-600 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl active:scale-95 transition-transform"
            >
                🚨
            </button>
        </div>
    );
};

export default MapaSeguridad;
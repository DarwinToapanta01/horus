import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; // Añadimos Map para contexto
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const VotacionLista = () => {
    const [reportes, setReportes] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [voto, setVoto] = useState(null);
    const [loading, setLoading] = useState(false);
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
        }
    };

    const getColorClass = (level) => {
        if (level >= 70) return 'bg-red-500';
        if (level >= 40) return 'bg-orange-500';
        return 'bg-green-600';
    };

    const handleVotar = async () => {
        if (voto === null) return alert("Por favor, selecciona SI o NO");
        setLoading(true);

        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                await api.post('/votes', {
                    report_id: selectedReport.id,
                    type: voto,
                    user_lat: pos.coords.latitude,
                    user_lng: pos.coords.longitude
                });
                alert("¡Voto registrado!");
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

    return (
        <div className="min-h-screen bg-[#0f1216] text-white flex flex-col items-center p-6 relative">
            <h1 className="text-4xl font-black italic mb-1 tracking-tighter">HORUS</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mb-10">Votación de zona</p>

            <div className="w-full max-w-sm space-y-4 overflow-y-auto pb-20">
                {/* FILTRO: Solo mostramos reportes que NO han expirado */}
                {reportes.filter(r => !r.is_expired).map((r, index) => (
                    <div
                        key={r.id}
                        onClick={() => setSelectedReport(r)}
                        className={`bg-[#1a1f26] rounded-xl overflow-hidden shadow-lg border border-white/5 cursor-pointer active:scale-[0.98] transition-all ${r.user_has_voted ? 'opacity-60' : ''}`}
                    >
                        <div className={`p-3 font-black text-slate-900 uppercase text-[10px] flex justify-between items-center ${getColorClass(r.danger_level)}`}>
                            <span>Zona Reportada #{r.id}</span>
                            <span className="bg-black/20 px-2 py-0.5 rounded text-[8px]">
                                {r.user_has_voted ? 'VOTADO ✅' : 'PENDIENTE ⏳'}
                            </span>
                        </div>

                        <div className="p-4 bg-[#242933]/50">
                            <div className="flex justify-between items-center text-[10px] mb-2 text-slate-400 font-bold">
                                {/* MOSTRAMOS LA FECHA QUE VIENE DEL BACKEND */}
                                <span className="text-blue-400">📅 {r.formatted_date}</span>
                                <span>Nivel: {r.danger_level}%</span>
                            </div>

                            {/* MOSTRAR CONTADORES DE VOTOS */}
                            <div className="flex gap-4 border-t border-white/5 pt-2">
                                <div className="text-[9px] uppercase font-bold text-slate-500">
                                    SÍ: <span className="text-green-500">{r.confirms}</span>
                                </div>
                                <div className="text-[9px] uppercase font-bold text-slate-500">
                                    NO: <span className="text-red-500">{r.rejects}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL CON MAPA DE CONTEXTO */}
            {selectedReport && (
                <div className="fixed inset-0 z-[2000] bg-[#0f1216]/95 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#1a1f26] w-full max-w-sm rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">

                        {/* 1. Mapa de Referencia (Para que el usuario sepa dónde es) */}
                        <div className="h-48 w-full relative border-b border-slate-700">
                            <MapContainer
                                center={[selectedReport.latitude, selectedReport.longitude]}
                                zoom={16}
                                zoomControl={false}
                                dragging={false}
                                touchZoom={false}
                                scrollWheelZoom={false}
                                className="h-full w-full"
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                <Marker position={[selectedReport.latitude, selectedReport.longitude]} />
                            </MapContainer>
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[9px] uppercase font-bold text-white z-[1001]">
                                Ubicación del incidente
                            </div>
                        </div>

                        <div className="p-6 flex flex-col items-center text-center">
                            <h3 className="text-white font-black uppercase text-sm mb-2 tracking-tighter">¿Confirmas el nivel de riesgo?</h3>
                            <p className="text-slate-400 text-[11px] mb-6">
                                Evalúa según tu conocimiento de esta calle/sector.
                            </p>

                            {/* Opciones SI / NO */}
                            <div className="flex justify-center gap-10 mb-8">
                                <label className="flex flex-col items-center gap-2 cursor-pointer">
                                    <input type="radio" name="vote" className="hidden" onChange={() => setVoto(true)} />
                                    <div className={`w-14 h-14 rounded-full border-4 border-slate-600 flex items-center justify-center transition-all ${voto === true ? 'bg-blue-600 border-white scale-110' : ''}`}>
                                        <span className="text-[10px] font-black">SÍ</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Es real</span>
                                </label>
                                <label className="flex flex-col items-center gap-2 cursor-pointer">
                                    <input type="radio" name="vote" className="hidden" onChange={() => setVoto(false)} />
                                    <div className={`w-14 h-14 rounded-full border-4 border-slate-600 flex items-center justify-center transition-all ${voto === false ? 'bg-slate-500 border-white scale-110' : ''}`}>
                                        <span className="text-[10px] font-black text-slate-900">NO</span>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Es falso</span>
                                </label>
                            </div>

                            <div className="w-full space-y-3">
                                <button
                                    onClick={handleVotar}
                                    disabled={loading}
                                    className="w-full bg-[#3b82f6] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                                >
                                    {loading ? 'Procesando...' : 'Confirmar Voto'}
                                </button>
                                <button
                                    onClick={() => { setSelectedReport(null); setVoto(null); }}
                                    className="w-full text-slate-500 text-[10px] font-bold uppercase py-2"
                                >
                                    Cerrar
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
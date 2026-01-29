import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const VotacionLista = () => {
    const [reportes, setReportes] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null); // Controla el Modal
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
            console.error("Error al cargar reportes");
        }
    };

    const getColor = (level) => {
        if (level >= 70) return 'bg-red-500';
        if (level >= 40) return 'bg-orange-500';
        return 'bg-green-600';
    };

    const handleVotar = async () => {
        if (voto === null) return alert("Selecciona SI o NO");
        setLoading(true);

        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                await api.post('/votes', {
                    report_id: selectedReport.id,
                    type: voto,
                    user_lat: pos.coords.latitude,
                    user_lng: pos.coords.longitude
                });
                alert("Voto registrado con éxito");
                setSelectedReport(null); // Cerramos el modal
                setVoto(null);
                fetchReportes(); // Actualizamos la lista
            } catch (err) {
                alert(err.response?.data?.error || "Error al votar");
            } finally {
                setLoading(false);
            }
        }, () => {
            alert("Ubicación necesaria para votar.");
            setLoading(false);
        });
    };

    return (
        <div className="min-h-screen bg-[#0f1216] text-white p-6 flex flex-col items-center overflow-x-hidden">
            <h1 className="text-3xl font-black italic mb-2">HORUS</h1>
            <h2 className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-8 text-center">
                Votación de zona
            </h2>

            {/* LISTA DE ZONAS */}
            <div className="w-full max-w-sm space-y-4">
                {reportes.map((r, index) => (
                    <div
                        key={r.id}
                        onClick={() => setSelectedReport(r)}
                        className="bg-[#1a1f26] rounded-xl overflow-hidden cursor-pointer active:scale-95 transition-all shadow-lg border border-white/5"
                    >
                        <div className={`p-3 font-bold ${getColor(r.danger_level)} text-slate-900`}>
                            Zona {index + 1}
                        </div>
                        <div className="p-4 h-6 bg-[#242933]"></div>
                    </div>
                ))}
            </div>

            {/* MODAL DE VOTACIÓN (Condicional) */}
            {selectedReport && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1f26] w-full max-w-xs rounded-2xl shadow-2xl overflow-hidden border border-slate-700 animate-in fade-in zoom-in duration-200">
                        {/* Header del Modal con el color de la zona */}
                        <div className={`p-4 text-center font-bold text-slate-900 ${getColor(selectedReport.danger_level)} uppercase text-xs truncate px-2`}>
                            {selectedReport.description.substring(0, 30)}...
                        </div>

                        <div className="p-6 flex flex-col items-center">
                            <p className="text-slate-400 text-sm mb-8 text-center">
                                Reportada con un porcentaje de {selectedReport.danger_level}%
                            </p>

                            <div className="flex justify-around w-full mb-8">
                                <label className="flex flex-col items-center gap-2 cursor-pointer group">
                                    <input type="radio" name="voto" onChange={() => setVoto(true)} className="hidden" />
                                    <div className={`w-12 h-12 rounded-full border-4 border-slate-600 flex items-center justify-center transition-all ${voto === true ? 'bg-blue-500 border-white scale-110' : ''}`}>
                                        <span className="text-[10px] font-bold">SI</span>
                                    </div>
                                </label>
                                <label className="flex flex-col items-center gap-2 cursor-pointer group">
                                    <input type="radio" name="voto" onChange={() => setVoto(false)} className="hidden" />
                                    <div className={`w-12 h-12 rounded-full border-4 border-slate-600 flex items-center justify-center transition-all ${voto === false ? 'bg-slate-400 border-white scale-110' : ''}`}>
                                        <span className="text-[10px] font-bold text-slate-900">NO</span>
                                    </div>
                                </label>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <button
                                    onClick={handleVotar}
                                    disabled={loading}
                                    className="w-full bg-[#4a7ec2] hover:bg-blue-600 py-3 rounded-lg font-bold text-sm transition-all shadow-lg active:scale-95"
                                >
                                    {loading ? 'Procesando...' : 'Votar'}
                                </button>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="w-full py-2 text-slate-500 text-xs font-bold uppercase tracking-widest"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-auto py-8">
                <img src="/logo-ojo.png" alt="Horus" className="w-16 opacity-20 grayscale invert" />
            </div>
        </div>
    );
};

export default VotacionLista;
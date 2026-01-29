import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ReportarZona = () => {
    const { state } = useLocation(); // Recibimos datos del paso anterior
    const navigate = useNavigate();
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);

    if (!state) return navigate('/ubicar-zona'); // Seguridad

    const handleFinalReport = async () => {
        setLoading(true);
        try {
            await api.post('/reports', {
                latitude: state.position[0],
                longitude: state.position[1],
                description: comentario,
                danger_level: state.dangerLevel,
                radius: 100 // Valor base
            });
            alert('¡Reporte enviado exitosamente!');
            navigate('/mapa');
        } catch (error) {
            alert('Error al enviar el reporte final.');
        } finally {
            setLoading(false);
        }
    };

    const getSliderColor = () => {
        if (state.dangerLevel >= 70) return 'bg-red-500';
        if (state.dangerLevel >= 40) return 'bg-orange-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-[#0f1216] text-white flex flex-col p-8 items-center">
            <h1 className="text-4xl font-black mb-2 tracking-tighter italic">HORUS</h1>
            <h2 className="text-slate-400 text-lg mb-8 uppercase tracking-widest font-bold">Reportar Zona Segura</h2>

            <div className="w-full space-y-6 max-w-sm">
                {/* Ubicación (Texto) */}
                <div>
                    <label className="text-slate-400 text-xs font-bold uppercase block mb-2">Ubicación</label>
                    <div className="bg-[#1a1f26] border border-slate-700 p-4 rounded-md text-sm text-slate-300">
                        Lat: {state.position[0].toFixed(4)}, Lng: {state.position[1].toFixed(4)}
                    </div>
                </div>

                {/* Nivel de Peligrosidad (Visual estático) */}
                <div>
                    <label className="text-slate-400 text-xs font-bold uppercase block mb-2">Nivel de Peligrosidad</label>
                    <div className="relative w-full h-4 bg-slate-800 rounded-full mt-10">
                        <div className={`absolute top-0 left-0 h-full rounded-full ${getSliderColor()}`} style={{ width: `${state.dangerLevel}%` }}></div>
                        <div className={`absolute -top-10 flex flex-col items-center`} style={{ left: `calc(${state.dangerLevel}% - 20px)` }}>
                            <div className={`${getSliderColor()} text-[10px] font-bold px-2 py-1 rounded-md`}>{state.dangerLevel}%</div>
                            <div className={`w-3 h-3 ${getSliderColor()} rotate-45`}></div>
                        </div>
                    </div>
                </div>

                {/* Comentario */}
                <div>
                    <label className="text-slate-400 text-xs font-bold uppercase block mb-2">Comentario</label>
                    <textarea
                        className="w-full bg-[#1a1f26] border border-slate-700 p-4 rounded-md text-sm text-slate-300 h-32 outline-none focus:border-blue-500"
                        placeholder="Describe lo que sucede en esta zona..."
                        onChange={(e) => setComentario(e.target.value)}
                    ></textarea>
                </div>

                <button
                    onClick={handleFinalReport}
                    disabled={loading}
                    className="w-full bg-[#3b82f6]/80 hover:bg-[#3b82f6] text-white font-black py-4 rounded-md uppercase tracking-[0.2em] transition-all shadow-xl"
                >
                    {loading ? 'Procesando...' : 'Reportar'}
                </button>
            </div>

            <div className="mt-10 opacity-50">
                <img src="/logo-ojo.png" alt="Horus Eye" className="w-16 grayscale invert" />
            </div>
        </div>
    );
};

export default ReportarZona;
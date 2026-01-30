import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ListaComentarios = () => {
    const [reportes, setReportes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVerificados = async () => {
            const res = await api.get('/reports');
            // Solo mostramos los que tienen 3 o más votos SÍ
            const verificados = res.data.filter(r => r.confirms >= 3);
            setReportes(verificados);
        };
        fetchVerificados();
    }, []);

    return (
        <div className="min-h-screen bg-[#0f1216] text-white p-6">
            <h1 className="text-2xl font-black mb-6 uppercase italic">Debates Ciudadanos</h1>
            <div className="space-y-4">
                {reportes.length === 0 ? (
                    <p className="text-slate-500 text-sm">No hay zonas verificadas para debatir aún.</p>
                ) : (
                    reportes.map(r => (
                        <div
                            key={r.id}
                            onClick={() => navigate(`/reporte/${r.id}/comentarios`)}
                            className="bg-[#1a1f26] p-4 rounded-xl border border-blue-500/30 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold text-sm">Zona #{r.id}</p>
                                <p className="text-[10px] text-slate-400">{r.description.substring(0, 30)}...</p>
                            </div>
                            <span className="text-blue-500 text-xl">💬</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListaComentarios;
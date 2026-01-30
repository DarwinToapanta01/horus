import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import api from '../../api/axios';

const Comentarios = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reporte, setReporte] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');

    useEffect(() => {
        fetchDatos();
    }, [id]);

    const fetchDatos = async () => {
        try {
            const resReporte = await api.get(`/reports/${id}`);
            const resComentarios = await api.get(`/reports/${id}/comments`);
            setReporte(resReporte.data);
            setComentarios(resComentarios.data);
        } catch (err) {
            console.error("Error al cargar datos");
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;
        try {
            await api.post('/comments', {
                report_id: id,
                content: nuevoComentario
            });
            setNuevoComentario('');
            fetchDatos();
        } catch (err) {
            alert("Error al publicar comentario");
        }
    };

    if (!reporte) return <div className="p-10 text-white">Cargando contexto...</div>;

    return (
        <div className="min-h-screen bg-[#0f1216] text-white flex flex-col">
            {/* Cabecera con Mapa (Contexto de la Zona) */}
            <div className="h-64 w-full relative border-b border-white/10">
                <MapContainer
                    center={[reporte.latitude, reporte.longitude]}
                    zoom={16}
                    zoomControl={false}
                    className="h-full w-full opacity-60"
                >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    <Marker position={[reporte.latitude, reporte.longitude]} />
                </MapContainer>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-[1001] bg-black/50 p-2 rounded-full backdrop-blur-md"
                >
                    ⬅️
                </button>
                <div className="absolute bottom-4 left-4 z-[1001]">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Zona #{reporte.id}</h2>
                    <p className="text-[10px] text-slate-300 font-bold uppercase">{reporte.description}</p>
                </div>
            </div>

            {/* Listado de Comentarios */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {comentarios.length === 0 ? (
                    <p className="text-center text-slate-500 text-xs mt-10">No hay testimonios aún. Sé el primero.</p>
                ) : (
                    comentarios.map(c => (
                        <div key={c.id} className="bg-[#1a1f26] p-4 rounded-2xl border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-blue-400 font-black text-[10px] uppercase">{c.user.name}</span>
                                <span className="text-[9px] text-slate-500">{new Date(c.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">{c.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Input fijo abajo */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0f1216]/80 backdrop-blur-xl border-t border-white/10">
                <form onSubmit={handlePostComment} className="flex gap-2">
                    <input
                        type="text"
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        placeholder="Escribe una actualización o alerta..."
                        className="flex-1 bg-[#1a1f26] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button className="bg-blue-600 px-6 rounded-xl font-bold text-xs uppercase">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default Comentarios;
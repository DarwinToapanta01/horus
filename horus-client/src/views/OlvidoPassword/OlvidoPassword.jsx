import React, { useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const OlvidoPassword = () => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRecuperar = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');
        setLoading(true);

        try {
            await api.post('/forgot-password', { email });
            setMensaje('Se ha enviado una clave temporal a tu correo de Mailtrap.');
        } catch (err) {
            setError('El correo ingresado no está registrado en Horus.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Efectos de luces ambientales */}
            <div className="absolute top-[-20%] left-[-10%] w-80 h-80 bg-blue-900 rounded-full blur-[150px] opacity-30"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-900 rounded-full blur-[150px] opacity-30"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Recuperar Acceso</h2>
                    <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                        Ingresa tu correo para recibir una clave temporal y restablecer tu seguridad.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleRecuperar} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 ml-1">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="tu@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/40 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                                required
                            />
                        </div>

                        {mensaje && (
                            <div className="bg-emerald-500/20 border border-emerald-500/50 p-4 rounded-2xl">
                                <p className="text-emerald-400 text-sm text-center font-medium italic">{mensaje}</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-2xl">
                                <p className="text-red-400 text-sm text-center font-medium italic">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg 
                                ${loading ? 'bg-slate-700 text-slate-400' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'}`}
                        >
                            {loading ? 'Procesando...' : 'Enviar Instrucciones'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                            <span>←</span> Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OlvidoPassword;
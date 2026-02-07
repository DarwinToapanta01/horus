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
            setMensaje('Se ha enviado una clave temporal a tu correo.');
        } catch (err) {
            setError('El correo ingresado no está registrado en Horus.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Círculos decorativos de fondo */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>

            <div className="w-full max-w-md z-10">
                {/* Header con icono */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">Recuperar Acceso</h2>
                    <p className="text-slate-400 mt-2 text-sm font-medium">
                        Ingresa tu correo para recibir una clave temporal.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleRecuperar} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 ml-1">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="nombre@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {mensaje && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl">
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">✓</span>
                                    <p className="text-emerald-400 text-sm font-medium flex-1">{mensaje}</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="text-red-400 text-sm font-medium text-center animate-pulse">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wide transition-all active:scale-95 shadow-lg mt-4
                                ${loading
                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/20'
                                }`}
                        >
                            {loading ? 'PROCESANDO...' : 'ENVIAR INSTRUCCIONES'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link
                            to="/login"
                            className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-2 uppercase tracking-wider"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OlvidoPassword;
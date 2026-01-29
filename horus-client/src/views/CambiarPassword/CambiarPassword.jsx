import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const CambiarPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', color: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setMensaje({ texto: 'Las contraseñas no coinciden', color: 'text-red-400' });
            return;
        }

        setLoading(true);
        try {
            await api.post('/change-password', {
                password,
                password_confirmation: passwordConfirmation
            });
            alert('Contraseña actualizada con éxito. Por favor, inicia sesión nuevamente.');
            localStorage.clear();
            navigate('/login');
        } catch (err) {
            setMensaje({ texto: 'Error al actualizar. Inténtalo más tarde.', color: 'text-red-400' });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full bg-slate-800/40 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all shadow-inner";

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Luces de fondo específicas para seguridad (tonos naranja/ámbar) */}
            <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-orange-600/10 rounded-full blur-[100px]"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-orange-500/10 rounded-full mb-4">
                        <span className="text-3xl">🛡️</span>
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Seguridad de Cuenta</h2>
                    <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                        Establece una nueva contraseña para proteger tu perfil en Horus.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleChange} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 ml-1">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputStyle}
                                required
                                minLength="8"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2 ml-1">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                placeholder="Repite tu contraseña"
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className={inputStyle}
                                required
                            />
                        </div>

                        {mensaje.texto && (
                            <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-center ${mensaje.color}`}>
                                <p className="text-sm font-medium italic">{mensaje.texto}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg
                                ${loading ? 'bg-slate-700 text-slate-500' : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/20'}`}
                        >
                            {loading ? 'Guardando...' : 'Actualizar Ahora'}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/menu')}
                        className="w-full mt-6 text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-tighter"
                    >
                        Omitir y volver al menú
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CambiarPassword;
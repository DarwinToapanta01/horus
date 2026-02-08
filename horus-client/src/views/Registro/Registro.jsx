import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Registro = () => {
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegistro = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/register', formData);
            alert('¡Usuario creado con éxito en Horus!');
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const validaciones = err.response.data.errors;
                if (validaciones.email) setError('El correo ya está en uso.');
                else if (validaciones.username) setError('El nombre de usuario ya está tomado.');
                else setError('Datos inválidos. Revisa que la contraseña coincida.');
            } else {
                setError('Error de conexión con el servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-6 py-10 relative overflow-hidden">
            {/* Círculos decorativos de fondo */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>

            <div className="w-full max-w-2xl z-10">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                        HORUS
                    </h1>
                    <p className="text-slate-400 font-medium italic">El ojo que todo lo ve</p>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-3">Crear Cuenta Nueva</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={handleRegistro} className="space-y-5">

                        {/* Fila: Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2 ml-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Diana"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2 ml-1">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Toapanta"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Fila: Username y Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2 ml-1">
                                    Usuario
                                </label>
                                <input
                                    type="text"
                                    placeholder="diana123"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2 ml-1">
                                    Correo
                                </label>
                                <input
                                    type="email"
                                    placeholder="nombre@gmail.com"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Fila: Password y Confirmación */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2 ml-1">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    placeholder="*******"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength="8"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2 ml-1">
                                    Confirmar
                                </label>
                                <input
                                    type="password"
                                    placeholder="*******"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

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
                            {loading ? 'REGISTRANDO...' : 'COMPLETAR REGISTRO'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
                            ¿Ya tienes cuenta? Inicia sesión aquí
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;
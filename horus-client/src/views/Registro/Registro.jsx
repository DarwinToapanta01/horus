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
    const navigate = useNavigate();

    const handleRegistro = async (e) => {
        e.preventDefault();
        setError('');
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
        }
    };

    // Función auxiliar para no repetir tanto código en los inputs
    const inputStyle = "w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm";

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
            {/* Efectos de luces de fondo */}
            <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>

            <div className="w-full max-w-xl z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tighter">HORUS</h1>
                    <p className="text-slate-400 font-medium italic">El ojo que todo lo ve</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-10 rounded-3xl shadow-2xl">
                    <form onSubmit={handleRegistro} className="space-y-4">

                        {/* Fila: Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Diana"
                                    className={inputStyle}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Apellido</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Toapanta"
                                    className={inputStyle}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Fila: Username y Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Usuario</label>
                                <input
                                    type="text"
                                    placeholder="diana123"
                                    className={inputStyle}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    className={inputStyle}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Fila: Password y Confirmación */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={inputStyle}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-300 ml-1 uppercase tracking-wider">Confirmar</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className={inputStyle}
                                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-3 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 mt-4 uppercase tracking-widest"
                        >
                            Completar Registro
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-slate-400 text-sm hover:text-white transition-colors">
                            ¿Ya tienes cuenta? <span className="text-blue-400 font-bold">Inicia sesión</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registro;
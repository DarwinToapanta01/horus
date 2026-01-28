import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/menu');
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error de credenciales");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-6 relative overflow-hidden">
            {/* Círculos decorativos de fondo para el efecto moderno */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-indigo-600 rounded-full blur-[120px] opacity-20"></div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                        HORUS
                    </h1>
                    <p className="text-slate-400 font-medium italic">El ojo que todo lo ve</p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl">
                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2 ml-1">
                                Correo
                            </label>
                            <input
                                type="email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="nombre@gmail.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest font-bold text-slate-300 mb-2 ml-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="*******"
                            />
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm font-medium text-center animate-pulse">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transform transition-all active:scale-95 mt-4"
                        >
                            INICIAR SESIÓN
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col gap-3 text-center">
                        <Link to="/registro" className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors">
                            ¿No tienes cuenta? Regístrate aquí
                        </Link>
                        <Link to="/olvido-password" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
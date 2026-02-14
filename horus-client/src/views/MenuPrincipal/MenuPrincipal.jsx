import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconMap, IconAlert, IconComment, IconVote, IconLock } from './../../components/Icons';

const MenuPrincipal = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const menuOptions = [
        {
            title: 'Mapa de Seguridad',
            Icon: IconMap,
            path: '/mapa',
            desc: 'Zonas en tiempo real',
            color: 'from-blue-500/20',
            accent: 'text-blue-400'
        },
        {
            title: 'Reportar Zona',
            Icon: IconAlert,
            path: '/ubicar-zona',
            desc: 'Alertar a la comunidad',
            color: 'from-red-500/20',
            accent: 'text-red-400'
        },
        {
            title: 'Comentarios',
            Icon: IconComment,
            path: '/lista-comentarios',
            desc: 'Debates ciudadanos',
            color: 'from-emerald-500/20',
            accent: 'text-emerald-400'
        },
        {
            title: 'Votar Reportes',
            Icon: IconVote,
            path: '/votacion-lista',
            desc: 'Validar alertas',
            color: 'from-purple-500/20',
            accent: 'text-purple-400'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white px-6 py-8 relative overflow-hidden">
            {/* Luces de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px]" />

            <header className="relative z-10 flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-2xl font-black tracking-tight">
                        HOLA,{' '}
                        <span className="text-blue-500 uppercase">
                            {user?.name || 'CIUDADANO'}
                        </span>
                    </h1>

                    <button
                        onClick={() => navigate('/cambiar-password')}
                        className="mt-1 text-xs font-bold text-orange-500 hover:text-orange-400 uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        <IconLock className="w-4 h-4" />
                        Actualizar Contraseña
                    </button>

                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-xl transition-all"
                    title="Cerrar Sesión"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                </button>
            </header>

            <div className="relative z-10 grid grid-cols-2 gap-4">
                {menuOptions.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className="relative group overflow-hidden bg-white/5 border border-white/10 p-6 rounded-3xl transition-all active:scale-95 hover:border-white/20 flex flex-col items-center text-center shadow-xl"
                    >
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
                        />

                        <span className={`relative z-10 mb-4 ${item.accent}`}>
                            <item.Icon className="w-10 h-10" />
                        </span>

                        <h3 className="font-bold text-sm uppercase tracking-wide relative z-10">
                            {item.title}
                        </h3>

                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium relative z-10">
                            {item.desc}
                        </p>
                    </button>
                ))}
            </div>

            <footer className="mt-12 text-center relative z-10">
                <div className="inline-block px-4 py-2 bg-white/5 rounded-full border border-white/5">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                        Horus • v2.1
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MenuPrincipal;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuPrincipal = () => {
    const navigate = useNavigate();

    // Obtenemos los datos del usuario guardados en el login
    const user = JSON.parse(localStorage.getItem('user'));

    // Seguridad: Si no hay token, lo mandamos al login
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear(); // Borra token y datos del usuario
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
                paddingBottom: '10px'
            }}>
                <div>
                    <h1 style={{ margin: 0 }}>Hola, {user?.name || 'Usuario'}</h1>
                    <button
                        onClick={() => navigate('/cambiar-password')}
                        style={{ background: '#ff9800', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' }}
                    >
                        🔑 Actualizar Contraseña
                    </button>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ background: '#f44336', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Cerrar Sesión
                </button>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginTop: '30px'
            }}>
                {/* BOTÓN 1: MAPA */}
                <button onClick={() => navigate('/mapa')} style={cardStyle}>
                    <span style={{ fontSize: '40px' }}>🗺️</span>
                    <h3>Ver Mapa de Seguridad</h3>
                </button>

                {/* BOTÓN 2: REPORTAR */}
                <button onClick={() => navigate('/reportar')} style={cardStyle}>
                    <span style={{ fontSize: '40px' }}>🚨</span>
                    <h3>Reportar Zona Segura</h3>
                </button>

                {/* BOTÓN 3: OPINIONES */}
                <button onClick={() => navigate('/opiniones')} style={cardStyle}>
                    <span style={{ fontSize: '40px' }}>💬</span>
                    <h3>Opiniones Ciudadanas</h3>
                </button>

                {/* BOTÓN 4: VOTAR */}
                <button onClick={() => navigate('/votar')} style={cardStyle}>
                    <span style={{ fontSize: '40px' }}>🗳️</span>
                    <h3>Votar Reportes</h3>
                </button>
            </div>
        </div>
    );
};

// Estilo rápido para los botones del menú
const cardStyle = {
    padding: '20px',
    borderRadius: '15px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: '0.3s'
};

export default MenuPrincipal;
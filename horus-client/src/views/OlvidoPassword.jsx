import React, { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const OlvidoPassword = () => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const handleRecuperar = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        try {
            // Este endpoint lo crearemos ahora en el backend
            const response = await api.post('/forgot-password', { email });
            setMensaje('Se ha enviado una notificación a tu correo con las instrucciones.');
        } catch (err) {
            setError('El correo ingresado no está registrado en Horus.');
        }
    };

    return (
        <div className="login-container">
            <h2>Recuperar Contraseña</h2>
            <p style={{ textAlign: 'center', maxWidth: '300px' }}>
                Ingresa tu correo electrónico para recuperar el acceso a tu cuenta de Santo Domingo.
            </p>
            <form onSubmit={handleRecuperar} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar</button>
            </form>

            {mensaje && <p style={{ color: 'green', marginTop: '10px' }}>{mensaje}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            <div className="links" style={{ marginTop: '15px' }}>
                <Link to="/login">Volver al inicio de sesión</Link>
            </div>
        </div>
    );
};

export default OlvidoPassword;
import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const CambiarPassword = () => {
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [mensaje, setMensaje] = useState({ texto: '', color: '' });
    const navigate = useNavigate();

    const handleChange = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setMensaje({ texto: 'Las contraseñas no coinciden', color: 'red' });
            return;
        }

        try {
            // Enviamos el token en los headers (esto lo hace automático nuestro axios.js)
            await api.post('/change-password', {
                password,
                password_confirmation: passwordConfirmation
            });
            alert('Contraseña actualizada con éxito. Inicia sesión de nuevo.');
            localStorage.clear(); // Limpiamos para que entre con la nueva clave
            navigate('/login');
        } catch (err) {
            setMensaje({ texto: 'Error al actualizar. Inténtalo más tarde.', color: 'red' });
        }
    };

    return (
        <div className="login-container">
            <h2>Actualizar Contraseña</h2>
            <p>Por seguridad, ingresa una nueva contraseña para tu cuenta.</p>
            <form onSubmit={handleChange} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <input
                    type="password"
                    placeholder="Nueva Contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="8"
                />
                <input
                    type="password"
                    placeholder="Confirmar Nueva Contraseña"
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                />
                <button type="submit" style={{ marginTop: '15px' }}>Guardar Cambios</button>
            </form>
            {mensaje.texto && <p style={{ color: mensaje.color, marginTop: '10px' }}>{mensaje.texto}</p>}
            <button onClick={() => navigate('/menu')} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginTop: '10px' }}>
                Cancelar y volver al menú
            </button>
        </div>
    );
};

export default CambiarPassword;
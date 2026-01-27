import React, { useState } from 'react';
import api from '../api/axios';
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
            // Enviamos el objeto completo. Los nombres coinciden con el $fillable de Laravel
            await api.post('/register', formData);
            alert('¡Usuario creado con éxito en Horus! Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                // Laravel nos dirá qué campo falló (email duplicado, username duplicado, etc.)
                const validaciones = err.response.data.errors;
                if (validaciones.email) setError('El correo ya está en uso.');
                else if (validaciones.username) setError('El nombre de usuario ya está tomado.');
                else setError('Datos inválidos. Revisa la contraseña.');
            } else {
                setError('Error de conexión con el servidor.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Crear Cuenta Horus</h2>
            <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <input
                    type="text"
                    placeholder="Nombre"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Apellido"
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Nombre de Usuario"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo Electrónico"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña (mín. 8 caracteres)"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmar Contraseña"
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    required
                />

                {error && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

                <button type="submit" style={{ marginTop: '10px' }}>Registrarme</button>
            </form>
            <div className="links" style={{ marginTop: '15px' }}>
                <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
            </div>
        </div>
    );
};

export default Registro;
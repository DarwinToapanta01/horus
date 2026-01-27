import React, { useState } from 'react';
import api from '../api/axios'; // Tu archivo de axios
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
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Si el login es exitoso, vamos al Menú Principal (image_aee0d6.png)
            navigate('/menu');
        } catch (err) {
            // Validación: Si no existe o datos erróneos
            setError('Usuario no encontrado o credenciales incorrectas.');
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Iniciar Sesión</button>
            </form>
            <div className="links">
                <Link to="/registro">Crear un usuario</Link>
                <Link to="/olvido-password">¿Olvidaste tu contraseña?</Link>
            </div>
        </div>
    );
};

export default Login;
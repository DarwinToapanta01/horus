import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        console.log("Intentando iniciar sesión para:", email);

        try {
            const response = await api.post('/login', { email, password });

            console.log("Respuesta del servidor:", response.data);

            // CAMBIO AQUÍ: Usamos access_token en lugar de token
            if (response.data.access_token) {
                // Guardamos el token (puedes seguir llamando la llave 'token' en localStorage)
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                console.log("Token guardado con éxito.");

                // Redirigir al menú
                navigate('/menu');
            } else {
                setError("El servidor no devolvió un token válido.");
            }
        } catch (err) {
            console.error("Error capturado:", err);
            if (err.response) {
                // El servidor respondió con un código de error (401, 422, etc.)
                setError(err.response.data.message || "Credenciales incorrectas");
            } else {
                // Error de red o servidor apagado
                setError("No hay conexión con el servidor");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Horus - Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Entrar</button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            <div className="links">
                <Link to="/registro">Crear un usuario</Link><br />
                <Link to="/olvido-password">¿Olvidaste tu contraseña?</Link>
            </div>
        </div>
    );
};

export default Login;
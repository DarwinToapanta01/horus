import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login/Login';
import Registro from './views/Registro/Registro';
import OlvidoPassword from './views/OlvidoPassword/OlvidoPassword';
import MenuPrincipal from './views/MenuPrincipal/MenuPrincipal';
import CambiarPassword from './views/CambiarPassword/CambiarPassword'; // No olvides crear este archivo

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/olvido-password" element={<OlvidoPassword />} />

        {/* Rutas Privadas (Después del Login) */}
        <Route path="/menu" element={<MenuPrincipal />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />

        {/* Redirigir por defecto al login si la ruta no existe */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
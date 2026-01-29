import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login/Login';
import Registro from './views/Registro/Registro';
import OlvidoPassword from './views/OlvidoPassword/OlvidoPassword';
import MenuPrincipal from './views/MenuPrincipal/MenuPrincipal';
import CambiarPassword from './views/CambiarPassword/CambiarPassword';
import MapaSeguridad from './views/MapaSeguridad/MapaSeguridad';
import UbicarZona from './views/ReportarZona/UbicarZona';
import ReportarZona from './views/ReportarZona/ReportarZona';
import VotacionLista from './views/Votacion/VotacionLista'; // Nombre corregido

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/olvido-password" element={<OlvidoPassword />} />

        {/* Rutas Privadas */}
        <Route path="/menu" element={<MenuPrincipal />} />
        <Route path="/cambiar-password" element={<CambiarPassword />} />
        <Route path="/mapa" element={<MapaSeguridad />} />
        <Route path="/ubicar-zona" element={<UbicarZona />} />
        <Route path="/reportar-detalles" element={<ReportarZona />} />

        {/* Usamos una sola ruta para la votación, el modal se maneja internamente */}
        <Route path="/votacion-lista" element={<VotacionLista />} />

        {/* Redirigir por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../api/axios';

const MapaPrincipal = () => {
    const [reportes, setReportes] = useState([]);
    // Coordenadas centrales de Santo Domingo de los Tsáchilas
    const centroStoDomingo = [-0.2530, -79.1754];

    useEffect(() => {
        // Cargar los reportes desde Laravel
        api.get('/reports')
            .then(response => setReportes(response.data))
            .catch(error => console.error("Error cargando reportes", error));
    }, []);

    return (
        <MapContainer center={centroStoDomingo} zoom={13} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            {reportes.map(reporte => (
                <Circle
                    key={reporte.id}
                    center={[reporte.latitude, reporte.longitude]}
                    radius={reporte.radius}
                    pathOptions={{
                        color: reporte.danger_level === 100 ? 'red' : 'orange',
                        fillColor: reporte.danger_level === 100 ? 'red' : 'orange'
                    }}
                >
                    <Popup>
                        <strong>Peligro: {reporte.danger_level}%</strong><br />
                        {reporte.description}
                    </Popup>
                </Circle>
            ))}
        </MapContainer>
    );
};

export default MapaPrincipal;
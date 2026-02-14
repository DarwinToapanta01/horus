# 🗺️ HORUS - Plataforma de Vigilancia Ciudadana Colaborativa

![Estado](https://img.shields.io/badge/Estado-En%20Producci%C3%B3n-success)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)
![Laravel](https://img.shields.io/badge/Laravel-12.0-red)
![React](https://img.shields.io/badge/React-19.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)

**HORUS** es una aplicación web distribuida que permite a los ciudadanos reportar, validar y consultar zonas de peligro en su ciudad mediante un sistema de verificación comunitaria basado en proximidad geográfica.

El nombre hace referencia al dios egipcio Horus, conocido como "el ojo que todo lo ve", simbolizando la visión colectiva de la comunidad sobre su entorno urbano.

---

## 🌐 Demo en Vivo

- **Frontend:** [https://horus-client-five.vercel.app](https://horus-client-five.vercel.app)
- **API Backend:** [https://web-horus-api.up.railway.app](https://web-horus-api.up.railway.app)
- **Documentación API:** [https://web-horus-api.up.railway.app/api](https://web-horus-api.up.railway.app/api)

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación Local](#-instalación-local)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Variables de Entorno](#-variables-de-entorno)
- [Despliegue en Producción](#-despliegue-en-producción)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Autor](#-autor)

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- Registro e inicio de sesión con **Laravel Sanctum** (autenticación stateless con tokens Bearer)
- Recuperación de contraseña por correo electrónico con clave temporal
- Cambio de contraseña para usuarios autenticados
- Cifrado de contraseñas con **bcrypt**
- Configuración **CORS** para proteger el backend

### 🗺️ Reportes Geolocalizados
- Creación de reportes con coordenadas geográficas (latitud/longitud)
- Ajuste de nivel de peligro mediante slider dinámico (0-100%)
- Radio de influencia configurable (200m por defecto)
- Mapa interactivo con **Leaflet.js** y tiles en modo oscuro
- Círculos de colores dinámicos según nivel de riesgo:
  - 🟢 Verde: Bajo riesgo (<40%)
  - 🟠 Naranja: Riesgo moderado (40-70%)
  - 🔴 Rojo: Alto riesgo (≥70%)

### 🗳️ Validación Comunitaria
- Sistema de votación **SÍ/NO** para verificar reportes
- Validación de proximidad con **fórmula de Haversine** (radio de 20 km)
- Prevención de votos duplicados (restricción única por usuario y reporte)
- Reportes verificados automáticamente con **3 votos positivos**
- Bloqueo de contenido hasta alcanzar verificación comunitaria

### 💬 Muro de Comentarios
- Comentarios anidados con soporte para respuestas (parent_id)
- Acceso exclusivo a reportes verificados
- Identificación de autores con nombre de usuario
- Fecha de publicación en cada comentario

### 📱 Interfaz Responsive
- Diseño adaptable para móviles, tablets y escritorio
- Iconografía SVG moderna y profesional
- Tema oscuro optimizado para legibilidad
- Framework CSS: **Tailwind CSS** con utilidades responsive

---

## 🏗️ Arquitectura del Sistema

HORUS implementa una **arquitectura de microservicios distribuidos** con servicios independientes que se comunican mediante protocolos estándar de internet.

```
┌──────────────────────────────────────┐
│   USUARIO (Navegador / Móvil)        │
└─────────────────┬────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────┐
│   horus-client (Vercel)              │
│   React 19 + Vite + Leaflet          │
│   https://horus-client-five.vercel.app
└─────────────────┬────────────────────┘
                  │ HTTPS REST
                  │ Bearer Token
                  ▼
┌──────────────────────────────────────┐
│   horus-api (Railway)                │
│   Laravel 12 + Sanctum + PostgreSQL  │
│   https://web-horus-api.up.railway.app
└─────────────────┬────────────────────┘
                  │ SQL
                  ▼
┌──────────────────────────────────────┐
│   PostgreSQL (Railway)               │
│   users, reports, votes, comments    │
└──────────────────────────────────────┘
                  ▲
                  │ WebSocket (trabajo futuro)
                  │
┌──────────────────────────────────────┐
│   horus-realtime (Railway)           │
│   Node.js + Socket.io [PLANIFICADO]  │
└──────────────────────────────────────┘
```

### Servicios

| Servicio | Tecnología | Estado | URL |
|----------|-----------|--------|-----|
| **horus-client** | React 19 + Vite | ✅ Producción | [Ver Demo](https://horus-client-five.vercel.app) |
| **horus-api** | Laravel 12 + PostgreSQL | ✅ Producción | [Ver API](https://web-horus-api.up.railway.app) |
| **horus-realtime** | Node.js + Socket.io | ⚠️ Trabajo Futuro | - |

---

## 🛠️ Tecnologías Utilizadas

### Frontend (horus-client)
- **React 19.2.0** - Biblioteca UI con hooks modernos
- **Vite 7.2.4** - Build tool de nueva generación
- **React Router 7.13.0** - Enrutamiento SPA
- **Leaflet 1.9.4** - Mapas interactivos
- **React-Leaflet 5.0** - Componentes React para Leaflet
- **Axios 1.13.4** - Cliente HTTP con interceptores
- **Tailwind CSS 4.1.18** - Framework CSS utility-first

### Backend (horus-api)
- **Laravel 12.0** - Framework PHP moderno
- **PHP 8.2** - Lenguaje del servidor
- **Laravel Sanctum 4.0** - Autenticación con tokens
- **PostgreSQL** - Base de datos relacional
- **Eloquent ORM** - Abstracción de base de datos
- **Laravel Mail** - Envío de correos electrónicos

### Infraestructura
- **Vercel** - Hosting del frontend (CDN global)
- **Railway** - Hosting del backend y PostgreSQL
- **GitHub** - Control de versiones
- **Git** - Sistema de control de versiones distribuido

### Trabajo Futuro (horus-realtime)
- **Node.js** - Entorno de ejecución JavaScript
- **Express** - Framework web minimalista
- **Socket.io** - Comunicación WebSocket bidireccional
- **socket.io-client** - Cliente WebSocket para React

---

## 🚀 Instalación Local

### Prerrequisitos

- **PHP 8.2+** con extensiones: pdo, pdo_pgsql, mbstring, xml, tokenizer, ctype, fileinfo, bcmath
- **Composer 2.0+**
- **Node.js 18+** y **npm 9+**
- **PostgreSQL 14+**
- **Git**

### 1️⃣ Clonar el repositorio

```bash
# Opción A: Clonar todo el proyecto
git clone https://github.com/DarwinToapanta01/horus.git
cd horus

# Opción B: Clonar servicios individuales
git clone https://github.com/DarwinToapanta01/horus-api.git
git clone https://github.com/DarwinToapanta01/horus-client.git
```

### 2️⃣ Configurar el Backend (horus-api)

```bash
cd horus-api

# Instalar dependencias de PHP
composer install

# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate

# Configurar la base de datos en .env
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=horus
# DB_USERNAME=tu_usuario
# DB_PASSWORD=tu_password

# Ejecutar migraciones
php artisan migrate

# Iniciar servidor de desarrollo
php artisan serve
# Backend corriendo en http://localhost:8000
```

### 3️⃣ Configurar el Frontend (horus-client)

```bash
cd horus-client

# Instalar dependencias de Node
npm install

# Copiar archivo de configuración
cp .env.example .env

# Configurar la URL del backend en .env
# VITE_API_URL=http://localhost:8000/api

# Iniciar servidor de desarrollo
npm run dev
# Frontend corriendo en http://localhost:5173
```

### 4️⃣ Acceder a la aplicación

Abre tu navegador en `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
horus/
│
├── horus-api/                 # Backend Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/   # Controladores API
│   │   └── Models/            # Modelos Eloquent
│   ├── config/
│   │   ├── cors.php           # Configuración CORS
│   │   └── sanctum.php        # Configuración Sanctum
│   ├── database/
│   │   └── migrations/        # Migraciones de BD
│   ├── routes/
│   │   └── api.php            # Rutas de la API
│   ├── .env.example
│   ├── Procfile               # Configuración Railway
│   ├── nixpacks.toml          # Build config Railway
│   └── composer.json
│
├── horus-client/              # Frontend React
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # Configuración Axios
│   │   ├── views/             # Vistas React
│   │   │   ├── Auth/          # Login, Registro
│   │   │   ├── MapaSeguridad/ # Mapa interactivo
│   │   │   ├── ReportarZona/  # Crear reportes
│   │   │   ├── Votacion/      # Sistema de votos
│   │   │   └── Comentarios/   # Muro de comentarios
│   │   ├── App.jsx            # Rutas principales
│   │   └── main.jsx           # Entry point
│   ├── public/
│   ├── .env.example
│   ├── vercel.json            # Configuración Vercel
│   ├── vite.config.js         # Configuración Vite
│   └── package.json
│
└── horus-realtime/            # WebSockets [TRABAJO FUTURO]
    ├── src/
    │   └── server.js          # Servidor Socket.io
    ├── .env.example
    └── package.json
```

---

## 🔑 Variables de Entorno

### Backend (horus-api/.env)

```env
# Aplicación
APP_NAME=Horus
APP_ENV=local
APP_KEY=base64:GENERA_CON_php_artisan_key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de datos
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=horus
DB_USERNAME=postgres
DB_PASSWORD=tu_password

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Sesiones y caché
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

### Frontend (horus-client/.env)

```env
# URL del backend
VITE_API_URL=http://localhost:8000/api
```

### Producción (Railway/Vercel)

**Backend en Railway:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://web-horus-api.up.railway.app
CORS_ALLOWED_ORIGINS=https://horus-client-five.vercel.app
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_DATABASE=${{Postgres.PGDATABASE}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

**Frontend en Vercel:**
```env
VITE_API_URL=https://web-horus-api.up.railway.app/api
```

---

## 🌍 Despliegue en Producción

### Backend en Railway

1. Crear cuenta en [Railway.app](https://railway.app)
2. Conectar con GitHub
3. Crear proyecto desde repositorio `horus-api`
4. Agregar servicio PostgreSQL
5. Configurar variables de entorno (ver sección anterior)
6. Railway desplegará automáticamente

**Archivos necesarios:**
- `Procfile` - Define el comando de inicio
- `nixpacks.toml` - Configuración de build

### Frontend en Vercel

1. Crear cuenta en [Vercel.com](https://vercel.com)
2. Importar repositorio `horus-client`
3. Configurar variable `VITE_API_URL`
4. Vercel desplegará automáticamente

**Archivo necesario:**
- `vercel.json` - Rewrites para SPA

---

## 🗺️ Roadmap

### ✅ Completado (v1.0)
- [x] Sistema de autenticación con tokens Bearer
- [x] Creación de reportes geolocalizados
- [x] Mapa interactivo con Leaflet
- [x] Sistema de votación con validación de distancia (Haversine)
- [x] Muro de comentarios anidados
- [x] Diseño responsive para móviles
- [x] Deploy en producción (Vercel + Railway)
- [x] Documentación completa

### 🚧 En Desarrollo (v1.1)
- [ ] Servicio horus-realtime con WebSockets
- [ ] Actualización del mapa en tiempo real
- [ ] Notificaciones push para nuevos reportes cercanos
- [ ] Sistema de reputación de usuarios
- [ ] Paginación de reportes y comentarios

### 🔮 Futuro (v2.0)
- [ ] Panel de administración
- [ ] Estadísticas y gráficos de seguridad
- [ ] Integración con autoridades locales
- [ ] API pública para terceros
- [ ] Sistema de alertas automáticas

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Darwin Toapanta**

- Universidad: Universidad de las Fuerzas Armadas ESPE
- Carrera: Ingeniería en Tecnologías de la Información
- Materia: Aplicaciones Distribuidas
- Docente: Ing. Kevin Chuquitarco
- Año: 2026

---

## 📧 Contacto

Para preguntas, sugerencias o reportar problemas:

- **Email:** datoapanta11@espe.edu.ec

---

## 📚 Documentación Adicional

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Leaflet Documentation](https://leafletjs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)

---

<div align="center">

**Hecho por Darwin Toapanta**

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

</div>
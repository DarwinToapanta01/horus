# HORUS - Plataforma de Vigilancia Ciudadana Colaborativa

![Estado](https://img.shields.io/badge/Estado-Local%20%2F%20Docker-blue)
![Laravel](https://img.shields.io/badge/Laravel-12.0-red)
![React](https://img.shields.io/badge/React-19.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)
![PHP](https://img.shields.io/badge/PHP-8.3-777BB4)

**HORUS** es una aplicación web de reportes ciudadanos geolocalizados que permite a los ciudadanos reportar, validar y comentar zonas de peligro en su ciudad mediante un sistema de verificación comunitaria basado en proximidad geográfica.

El nombre hace referencia al dios egipcio Horus, conocido como "el ojo que todo lo ve", simbolizando la visión colectiva de la comunidad sobre su entorno urbano.

> **Materia:** Sistemas Distribuidos — Parcial 3
> **Universidad:** Universidad de las Fuerzas Armadas ESPE
> **Autor:** Darwin Toapanta

---

## Tabla de Contenidos

- [Arquitectura de Microservicios](#arquitectura-de-microservicios)
- [Microservicios](#microservicios)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Ejecución Local](#instalación-y-ejecución-local)
- [Puertos del Sistema](#puertos-del-sistema)
- [Variables de Entorno](#variables-de-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints de la API](#endpoints-de-la-api)
- [Características Principales](#características-principales)
- [Autor](#autor)

---

## Arquitectura de Microservicios

HORUS migró de un monolito Laravel a una **arquitectura de microservicios distribuidos**, donde cada dominio del negocio opera como un servicio independiente con su propia base de datos PostgreSQL.

```
Frontend React (localhost:5173)
         │
         ▼
 ┌──────────────────┐
 │   API Gateway    │  :8000  ← único punto de entrada
 │  (Laravel 12)    │         valida token, inyecta X-User-Id
 └──┬───┬───┬───┬───┘
    │   │   │   │
    ▼   ▼   ▼   ▼
 ┌──────────────────────────────────────────────┐
 │  auth      reports    votes     comments     │
 │  :8001     :8002      :8003     :8004        │
 │    │           │         │          │        │
 │ auth_db  reports_db  votes_db  comments_db  │
 │  :5433     :5434      :5435      :5436       │
 └──────────────────────────────────────────────┘
          (PostgreSQL 15 — una BD por servicio)
```

### Patrón de comunicación entre servicios

- **Gateway → auth-service:** valida el token Bearer antes de enrutar cualquier petición protegida.
- **reports-service → votes-service:** consulta el conteo de votos de cada reporte al listar.
- **votes-service → reports-service:** obtiene las coordenadas del reporte para calcular distancia (Haversine).
- **comments-service → reports-service:** verifica que el reporte exista antes de crear un comentario.

---

## Microservicios

| Servicio | Puerto | Base de Datos | Responsabilidad |
|---|---|---|---|
| **api-gateway** | 8000 | — | Enrutamiento, autenticación centralizada |
| **auth-service** | 8001 | horus_auth_db (5433) | Usuarios, tokens Sanctum, recuperación de contraseña |
| **reports-service** | 8002 | horus_reports_db (5434) | Reportes geolocalizados |
| **votes-service** | 8003 | horus_votes_db (5435) | Votos con validación de distancia (Haversine) |
| **comments-service** | 8004 | horus_comments_db (5436) | Comentarios anidados |

---

## Tecnologías

### Backend (microservicios)
- **Laravel 12** — Framework PHP para cada microservicio
- **PHP 8.3** — Lenguaje del servidor
- **Laravel Sanctum 4** — Autenticación stateless con tokens Bearer
- **PostgreSQL 15** — Una base de datos por microservicio
- **Laravel Http Client** — Comunicación REST entre servicios

### Frontend
- **React 19** — Biblioteca UI
- **Vite 7** — Build tool
- **React Router 7** — Enrutamiento SPA
- **Leaflet + React-Leaflet** — Mapas interactivos
- **Axios** — Cliente HTTP con interceptores
- **Tailwind CSS 4** — Framework CSS

### Infraestructura
- **Docker** — Contenedores para cada servicio
- **Docker Compose** — Orquestación de los 9 contenedores
- **GitHub** — Control de versiones

---

## Requisitos Previos

Solo necesitas tener instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose)
- [Node.js 18+](https://nodejs.org/) (solo para el frontend)
- [Git](https://git-scm.com/)

No necesitas PHP, Composer ni PostgreSQL instalados localmente — Docker los provee.

---

## Instalación y Ejecución Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/DarwinToapanta01/horus.git
cd horus
```

### 2. Levantar todos los microservicios con Docker

```bash
docker-compose up --build
```

Este comando:
- Descarga las imágenes base (PHP 8.3 + PostgreSQL 15)
- Instala dependencias de Composer en cada servicio
- Genera las APP_KEY de cada servicio
- Ejecuta las migraciones en cada base de datos
- Levanta los 9 contenedores (5 servicios + 4 BDs)

> La primera ejecución tarda varios minutos por la descarga de imágenes. Las siguientes son mucho más rápidas.

### 3. Levantar el frontend

En una terminal separada:

```bash
cd horus-client
npm install
npm run dev
```

### 4. Abrir la aplicación

```
http://localhost:5173
```

### Detener el sistema

```bash
docker-compose down
```

Para detener y eliminar también los volúmenes (borra los datos de las BDs):

```bash
docker-compose down -v
```

---

## Puertos del Sistema

| Servicio | URL local | Descripción |
|---|---|---|
| Frontend | http://localhost:5173 | Aplicación React |
| API Gateway | http://localhost:8000 | Entrada única de la API |
| auth-service | http://localhost:8001 | (directo, solo desarrollo) |
| reports-service | http://localhost:8002 | (directo, solo desarrollo) |
| votes-service | http://localhost:8003 | (directo, solo desarrollo) |
| comments-service | http://localhost:8004 | (directo, solo desarrollo) |
| horus_auth_db | localhost:5433 | PostgreSQL — usuarios |
| horus_reports_db | localhost:5434 | PostgreSQL — reportes |
| horus_votes_db | localhost:5435 | PostgreSQL — votos |
| horus_comments_db | localhost:5436 | PostgreSQL — comentarios |

### Conectar las BDs en pgAdmin

Crea una conexión por cada base de datos:

| Campo | Valor |
|---|---|
| Host | `localhost` |
| Usuario | `postgres` |
| Contraseña | `1234` |
| Puerto | Ver tabla de puertos arriba |

---

## Variables de Entorno

Cada microservicio tiene su propio `.env`. Los valores críticos son inyectados por Docker Compose y no necesitan modificarse para el entorno local.

### Frontend (horus-client/.env)

```env
VITE_API_URL=http://localhost:8000/api
```

### Ejemplo — auth-service/.env

```env
APP_NAME=Horus-Auth
APP_PORT=8001
DB_CONNECTION=pgsql
DB_HOST=auth_db        # nombre del contenedor Docker
DB_PORT=5432
DB_DATABASE=horus_auth_db
DB_USERNAME=postgres
DB_PASSWORD=1234
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

> Los demás servicios siguen la misma estructura cambiando el nombre de la BD y el host.

---

## Estructura del Proyecto

```
horus-project/
│
├── docker-compose.yml          ← orquesta los 9 contenedores
├── .gitignore
│
├── api-gateway/                ← Puerto 8000 — entrada única
│   ├── app/Http/Controllers/Api/GatewayController.php
│   ├── app/Http/Middleware/GatewayAuth.php
│   ├── config/services.php     ← URLs internas de cada servicio
│   ├── routes/api.php
│   └── Dockerfile
│
├── auth-service/               ← Puerto 8001 — autenticación
│   ├── app/Http/Controllers/Api/AuthController.php
│   ├── app/Models/User.php
│   ├── app/Mail/RecuperarPasswordMail.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── Dockerfile
│
├── reports-service/            ← Puerto 8002 — reportes
│   ├── app/Http/Controllers/Api/ReportController.php
│   ├── app/Models/Report.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── Dockerfile
│
├── votes-service/              ← Puerto 8003 — votos + Haversine
│   ├── app/Http/Controllers/Api/VoteController.php
│   ├── app/Models/Vote.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── Dockerfile
│
├── comments-service/           ← Puerto 8004 — comentarios
│   ├── app/Http/Controllers/Api/CommentController.php
│   ├── app/Models/Comment.php
│   ├── database/migrations/
│   ├── routes/api.php
│   └── Dockerfile
│
└── horus-client/               ← Frontend React + Vite
    ├── src/
    │   ├── api/axios.js
    │   ├── views/
    │   └── components/
    ├── .env
    └── package.json
```

---

## Endpoints de la API

Todos los endpoints se consumen a través del **API Gateway en `http://localhost:8000`**.

### Públicos (sin token)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/register` | Registrar nuevo usuario |
| `POST` | `/api/login` | Iniciar sesión — retorna token Bearer |
| `POST` | `/api/forgot-password` | Enviar contraseña temporal por email |

### Protegidos (`Authorization: Bearer <token>`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/user` | Datos del usuario autenticado |
| `GET` | `/api/reports` | Listar reportes activos con votos |
| `POST` | `/api/reports` | Crear nuevo reporte |
| `GET` | `/api/reports/{id}` | Detalle de un reporte |
| `POST` | `/api/votes` | Votar (valida distancia ≤ 20 km) |
| `POST` | `/api/change-password` | Cambiar contraseña |
| `GET` | `/api/reports/{id}/comments` | Comentarios de un reporte |
| `POST` | `/api/comments` | Crear comentario o respuesta |

---

## Características Principales

### Autenticación
- Registro e inicio de sesión con tokens Bearer (Laravel Sanctum)
- Recuperación de contraseña por correo electrónico con clave temporal
- Cifrado de contraseñas con bcrypt

### Reportes Geolocalizados
- Coordenadas geográficas (latitud/longitud), radio de impacto (100–5000 m) y nivel de peligro (0–100)
- Mapa interactivo con Leaflet.js en modo oscuro
- Círculos de colores según nivel de riesgo (verde / naranja / rojo)
- Los reportes expiran automáticamente a las 48 horas

### Validación Comunitaria
- Votos de confirmación o rechazo por reporte
- Validación de proximidad con **fórmula de Haversine** (máximo 20 km)
- Un usuario = un voto por reporte (restricción a nivel de base de datos)

### Comentarios
- Comentarios anidados con soporte para respuestas (campo `parent_id`)
- Ordenados del más reciente al más antiguo

---

## Autor

**Darwin Toapanta**

- **Universidad:** Universidad de las Fuerzas Armadas ESPE
- **Carrera:** Ingeniería en Tecnologías de la Información
- **Materia:** Sistemas Distribuidos
- **Docente:** Ing. Kevin Chuquitarco
- **Año:** 2026
- **Email:** datoapanta11@espe.edu.ec

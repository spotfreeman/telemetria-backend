# Sistema de Telemetría - Backend

Backend para el sistema de telemetría desarrollado con Node.js, Express y MongoDB.

## 🚀 Características

- **Autenticación JWT** con roles de usuario
- **Monitoreo de temperatura** en tiempo real
- **Dashboard** con estadísticas y gráficos
- **API RESTful** completa
- **Manejo de errores** robusto
- **Validación de datos** de entrada
- **Soporte para ESP32** y dispositivos IoT
- **Gestión de proyectos** y usuarios

## 📋 Requisitos

- Node.js 16+
- MongoDB 4.4+
- npm o yarn

## 🛠 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd telemetria-backend
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp config.example.js .env
# Edita el archivo .env con tus configuraciones
```

4. Inicia el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
MONGODB_URI=mongodb://localhost:27017/telemetria
PORT=3000
JWT_SECRET=tu_clave_secreta_muy_segura
CORS_ORIGIN=https://tu-frontend.com
```

## 📚 API Endpoints

### 🔐 Autenticación (Nuevas Rutas)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/verify` - Verificar token
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/change-password` - Cambiar contraseña
- `GET /api/auth/users` - Obtener todos los usuarios (admin)
- `PUT /api/auth/users/:id/status` - Actualizar estado de usuario (admin)

### 📊 Telemetría (Nuevas Rutas)
- `GET /api/telemetry/temperatures` - Obtener todas las temperaturas
- `GET /api/telemetry/temperatures/stats` - Estadísticas de temperatura
- `GET /api/telemetry/temperatures/chart` - Datos para gráficos
- `GET /api/telemetry/temperatures/:id` - Obtener temperatura por ID
- `POST /api/telemetry/temperatures` - Crear nueva temperatura
- `PUT /api/telemetry/temperatures/:id` - Actualizar temperatura
- `DELETE /api/telemetry/temperatures/:id` - Eliminar temperatura
- `POST /api/telemetry/esp32` - Enviar datos ESP32 (público)
- `GET /api/telemetry/esp32` - Obtener dispositivos ESP32
- `GET /api/telemetry/esp32/:deviceId` - Obtener datos de dispositivo
- `GET /api/telemetry/esp32/:deviceId/stats` - Estadísticas del dispositivo
- `DELETE /api/telemetry/esp32/:id` - Eliminar dispositivo
- `DELETE /api/telemetry/esp32/:deviceId/clean` - Limpiar datos antiguos

### 📈 Dashboard (Nuevas Rutas)
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/chart/temperature` - Datos para gráficos
- `GET /api/dashboard/alerts` - Alertas activas

### 🔄 Rutas Legacy (Compatibilidad)
- `GET /api/temperaturas` - Obtener todas las temperaturas
- `GET /api/temperaturas/stats` - Estadísticas de temperatura
- `GET /api/usuarios/profile` - Obtener perfil del usuario
- `PUT /api/usuarios/profile` - Actualizar perfil
- `POST /api/esp32` - Enviar datos ESP32
- `GET /api/esp32` - Obtener dispositivos ESP32

### 📋 Gestión
- `GET /api/proyectos` - Obtener todos los proyectos
- `GET /api/proyectos/:id` - Obtener proyecto por ID
- `POST /api/proyectos` - Crear nuevo proyecto
- `PUT /api/proyectos/:id` - Actualizar proyecto
- `DELETE /api/proyectos/:id` - Eliminar proyecto

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. Incluye el token en el header:

```
Authorization: Bearer <tu_token>
```

### Roles de Usuario
- `usuario` - Usuario básico
- `admin` - Administrador
- `supervisor` - Supervisor
- `monitor` - Monitor
- `visor` - Solo lectura

## 📊 Modelos de Datos

### Usuario
```javascript
{
  username: String,
  email: String,
  password: String (hasheada),
  nombre: String,
  apellido: String,
  rol: String,
  departamento: String,
  activo: Boolean,
  creadoEn: Date
}
```

### Temperatura
```javascript
{
  fecha_hora: Date,
  temperatura: Number,
  almacenamiento: Number,
  dispositivo_id: String,
  ubicacion: String,
  humedad: Number,
  presion: Number,
  calidad_aire: String,
  alerta: Boolean,
  observaciones: String
}
```

## 🚨 Manejo de Errores

El API devuelve errores en formato JSON:

```javascript
{
  "error": "Mensaje de error",
  "detalles": ["Detalle 1", "Detalle 2"] // Opcional
}
```

Códigos de estado HTTP:
- `200` - Éxito
- `201` - Creado
- `400` - Error de validación
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `500` - Error interno del servidor

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts Disponibles

- `npm start` - Iniciar en producción
- `npm run dev` - Iniciar en desarrollo con nodemon
- `npm run lint` - Verificar código con ESLint
- `npm run lint:fix` - Corregir errores de ESLint automáticamente

## 🗂️ Estructura del Proyecto

El proyecto ha sido reorganizado para mejorar la mantenibilidad y escalabilidad:

```
src/
├── config/          # Configuraciones
├── controllers/     # Controladores organizados por funcionalidad
│   ├── auth/        # Autenticación y usuarios
│   ├── telemetry/   # Telemetría y sensores
│   ├── management/  # Gestión de proyectos
│   └── dashboard/   # Dashboard y estadísticas
├── models/          # Modelos de datos
├── routes/          # Rutas de la API
├── middleware/      # Middleware personalizado
├── services/        # Lógica de negocio
└── utils/           # Constantes y funciones auxiliares
```

Ver [ESTRUCTURA.md](./ESTRUCTURA.md) para más detalles sobre la reorganización.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 📞 Soporte

Para soporte, contacta a [tu-email@ejemplo.com]
telemetria-backend


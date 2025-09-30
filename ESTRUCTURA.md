# 📁 Estructura del Proyecto Reorganizada

## 🎯 **Nueva Estructura de Carpetas**

```
src/
├── app.js                          # Configuración principal de Express
├── server.js                       # Punto de entrada del servidor
├── config/
│   └── database.js                 # Configuración de conexión a MongoDB
├── controllers/
│   ├── auth/
│   │   ├── auth.controller.js      # Controlador de autenticación (login/register)
│   │   └── user.controller.js      # Controlador de gestión de usuarios
│   ├── telemetry/
│   │   ├── temperature.controller.js # Controlador de temperaturas
│   │   └── esp32.controller.js     # Controlador de dispositivos ESP32
│   ├── management/
│   │   ├── project.controller.js   # Controlador de proyectos
│   │   ├── note.controller.js      # Controlador de notas
│   │   ├── file.controller.js      # Controlador de archivos
│   │   └── vacation.controller.js  # Controlador de vacaciones
│   └── dashboard/
│       └── dashboard.controller.js # Controlador del dashboard
├── models/
│   ├── User.js                     # Modelo de usuario
│   ├── Temperature.js              # Modelo de temperatura
│   ├── Project.js                  # Modelo de proyecto
│   ├── Note.js                     # Modelo de nota
│   ├── File.js                     # Modelo de archivo
│   ├── Vacation.js                 # Modelo de vacaciones
│   ├── RPI.js                      # Modelo de Raspberry Pi
│   ├── ServerIP.js                 # Modelo de IP de servidor
│   ├── Unity.js                    # Modelo de Unity
│   └── ESP32.js                    # Modelo de ESP32
├── routes/
│   ├── auth.routes.js              # Rutas de autenticación
│   ├── telemetry.routes.js         # Rutas de telemetría
│   ├── management.routes.js        # Rutas de gestión
│   └── dashboard.routes.js         # Rutas del dashboard
├── middleware/
│   ├── auth.middleware.js          # Middleware de autenticación
│   ├── validation.middleware.js    # Middleware de validación
│   └── error.middleware.js         # Middleware de manejo de errores
├── services/
│   ├── auth.service.js             # Servicio de autenticación
│   ├── telemetry.service.js        # Servicio de telemetría
│   └── notification.service.js     # Servicio de notificaciones
└── utils/
    ├── constants.js                # Constantes del sistema
    └── helpers.js                  # Funciones auxiliares
```

## 🔄 **Cambios Realizados**

### **1. Reorganización de Controladores**
- **Antes**: Controladores dispersos en carpetas mixtas
- **Ahora**: Organizados por funcionalidad:
  - `auth/` - Autenticación y usuarios
  - `telemetry/` - Telemetría y sensores
  - `management/` - Gestión de proyectos y recursos
  - `dashboard/` - Dashboard y estadísticas

### **2. Modelos Estandarizados**
- **Antes**: Nombres inconsistentes y duplicados
- **Ahora**: Nombres en PascalCase, sin duplicados
- Mejorados con validaciones, índices y constantes

### **3. Middleware Reorganizado**
- **Antes**: Archivos con nombres inconsistentes
- **Ahora**: Nombres descriptivos con `.middleware.js`
- Funciones mejoradas con manejo de errores consistente

### **4. Nuevas Carpetas**
- **`config/`** - Configuraciones centralizadas
- **`services/`** - Lógica de negocio
- **`utils/`** - Constantes y funciones auxiliares

## 🚀 **Nuevas Funcionalidades**

### **Constantes Centralizadas**
```javascript
// utils/constants.js
const USER_ROLES = {
    USER: 'usuario',
    ADMIN: 'admin',
    SUPERVISOR: 'supervisor',
    MONITOR: 'monitor',
    VIEWER: 'visor'
};
```

### **Funciones Auxiliares**
```javascript
// utils/helpers.js
const { normalizePagination, createDateFilters } = require('./helpers');
```

### **Servicios de Negocio**
```javascript
// services/telemetry.service.js
const TelemetryService = require('./services/telemetry.service');
```

## 📊 **Rutas Reorganizadas**

### **Nuevas Rutas Agrupadas**
- `/api/auth/*` - Autenticación y usuarios
- `/api/telemetry/*` - Telemetría y sensores
- `/api/dashboard/*` - Dashboard y estadísticas

### **Rutas Legacy Mantenidas**
- `/api/temperaturas/*` - Compatibilidad con frontend existente
- `/api/usuarios/*` - Compatibilidad con frontend existente
- `/api/esp32/*` - Compatibilidad con frontend existente

## 🔧 **Configuración Mejorada**

### **Base de Datos**
```javascript
// config/database.js
const connectDB = async () => {
    // Configuración centralizada de MongoDB
};
```

### **Variables de Entorno**
```javascript
// config.example.js
module.exports = {
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/telemetria',
    JWT_SECRET: process.env.JWT_SECRET || 'tu_clave_secreta',
    // ... más configuraciones
};
```

## ✅ **Beneficios de la Reorganización**

1. **📁 Estructura Clara**: Fácil navegación y mantenimiento
2. **🔧 Mantenibilidad**: Código organizado por funcionalidad
3. **🚀 Escalabilidad**: Fácil agregar nuevas funcionalidades
4. **🛡️ Consistencia**: Nombres y patrones uniformes
5. **📚 Documentación**: Código autodocumentado
6. **🔄 Compatibilidad**: Mantiene rutas existentes
7. **⚡ Rendimiento**: Índices optimizados y consultas eficientes

## 🚀 **Para Usar la Nueva Estructura**

### **1. Instalar Dependencias**
```bash
npm install
```

### **2. Configurar Variables de Entorno**
```bash
cp config.example.js .env
# Editar .env con tus configuraciones
```

### **3. Iniciar Servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### **4. Endpoints Disponibles**
- **Nuevos**: `/api/auth/*`, `/api/telemetry/*`, `/api/dashboard/*`
- **Legacy**: `/api/temperaturas/*`, `/api/usuarios/*`, `/api/esp32/*`

## 📝 **Notas Importantes**

- ✅ **Compatibilidad**: Todas las rutas existentes siguen funcionando
- ✅ **Mejoras**: Nuevas funcionalidades y mejor rendimiento
- ✅ **Documentación**: README actualizado con nueva estructura
- ✅ **Testing**: Estructura preparada para pruebas unitarias
- ✅ **Deployment**: Listo para producción

La reorganización mantiene la funcionalidad existente mientras proporciona una base sólida para futuras mejoras y expansiones del sistema.




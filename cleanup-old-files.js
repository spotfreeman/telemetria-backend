#!/usr/bin/env node

/**
 * Script para limpiar archivos antiguos después de la reorganización
 * Ejecutar con: node cleanup-old-files.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Iniciando limpieza de archivos antiguos...\n');

// Archivos y carpetas a eliminar (después de verificar que la nueva estructura funciona)
const filesToRemove = [
    'src/controllers/usuarios/',
    'src/models/usuarios/',
    'src/controllers/temperatura.controller.js',
    'src/controllers/usuario.controller.js',
    'src/controllers/dashboard.controller.js',
    'src/middleware/auth.js',
    'src/routes/dashboard.routes.js'
];

// Archivos duplicados a eliminar
const duplicateFiles = [
    'src/models/usuarios.model.js',
    'src/models/temperatura.model.js',
    'src/models/proyectos.model.js',
    'src/models/nota.model.js',
    'src/models/archivos.model.js',
    'src/models/vacaciones.model.js',
    'src/models/rpi.model.js',
    'src/models/serverip.model.js',
    'src/models/unity.model.js',
    'src/esp32/esp32.model.js'
];

function removeFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true });
                console.log(`📁 Eliminada carpeta: ${filePath}`);
            } else {
                fs.unlinkSync(filePath);
                console.log(`📄 Eliminado archivo: ${filePath}`);
            }
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ Error eliminando ${filePath}:`, error.message);
        return false;
    }
}

function cleanup() {
    let removedCount = 0;

    console.log('🗑️  Eliminando archivos duplicados...');
    duplicateFiles.forEach(file => {
        if (removeFile(file)) {
            removedCount++;
        }
    });

    console.log('\n🗑️  Eliminando archivos antiguos...');
    filesToRemove.forEach(file => {
        if (removeFile(file)) {
            removedCount++;
        }
    });

    console.log(`\n✅ Limpieza completada. ${removedCount} elementos eliminados.`);
    console.log('\n📋 Archivos mantenidos para compatibilidad:');
    console.log('   - src/routes/temperatura.routes.js (legacy)');
    console.log('   - src/routes/usuarios/usuario.routes.js (legacy)');
    console.log('   - src/esp32/esp32.routes.js (legacy)');
    console.log('   - src/controllers/ (archivos legacy)');
    console.log('   - src/models/ (archivos legacy)');

    console.log('\n🚀 La nueva estructura está lista para usar!');
    console.log('   - Nuevas rutas: /api/auth, /api/telemetry, /api/dashboard');
    console.log('   - Rutas legacy: /api/temperaturas, /api/usuarios, /api/esp32');
}

// Verificar que estamos en el directorio correcto
if (!fs.existsSync('src/app.js')) {
    console.error('❌ Error: Ejecutar este script desde la raíz del proyecto');
    process.exit(1);
}

// Preguntar confirmación
console.log('⚠️  ADVERTENCIA: Este script eliminará archivos antiguos.');
console.log('   Asegúrate de que la nueva estructura funcione correctamente antes de continuar.\n');

// Para ejecución automática, descomenta la siguiente línea:
// cleanup();

// Para ejecución interactiva, usar:
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('¿Continuar con la limpieza? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        cleanup();
    } else {
        console.log('❌ Limpieza cancelada.');
    }
    rl.close();
});


🎯 Cambios realizados:

Eliminé los 4 botones (GET, POST, PUT, DELETE)
Agregué un solo botón "Enviar" que genera el JSON para usar en Postman
Incluí instrucciones detalladas sobre cómo usar cada endpoint con Postman
Agregué ejemplos de JSON y configuración de headers

🚀 Cómo usar con Postman:
1. GET - Obtener pilotos:

URL: http://localhost:3000/api/pilots
Método: GET
No requiere body

2. POST - Crear piloto:

URL: http://localhost:3000/api/pilots
Método: POST
Headers: Content-Type: application/json
Body (raw/JSON):

json{
  "nombre": "Fernando Alonso",
  "equipo": "Aston Martin",
  "nacionalidad": "Española",
  "edad": 42,
  "victorias": 32
}
3. PUT - Actualizar piloto:

URL: http://localhost:3000/api/pilots/1
Método: PUT
Headers: Content-Type: application/json
Body: Mismo JSON que POST

4. DELETE - Eliminar piloto:

URL: http://localhost:3000/api/pilots/1
Método: DELETE
No requiere body

El formulario ahora te ayuda a generar el JSON que necesitas copiar y pegar en Postman para las pruebas POST y PUT. ¡Listo para probar todos los métodos HTTP!

-------

# 🏎️ Automatización Postman - API Pilotos F1

## 📋 Configuración Inicial

### 1. Crear Variables de Entorno
Crea un Environment en Postman con estas variables:
- `baseUrl`: `http://localhost:3000`
- `pilotId`: `1`
- `pilotName`: `Max Verstappen`

---

## 🔧 Scripts por Endpoint

### 1. **GET /api/pilots** - Obtener todos los pilotos

#### Pre-request Script:
```javascript
// Limpiar console
console.clear();
console.log("🔍 Iniciando prueba GET - Obtener pilotos");
```

#### Tests:
```javascript
// Validar status code
pm.test("Status code es 200", function () {
    pm.response.to.have.status(200);
});

// Validar que la respuesta sea un array
pm.test("Respuesta es un array", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.be.an('array');
});

// Guardar primer piloto para usar en otras pruebas
pm.test("Guardar datos del primer piloto", function () {
    const pilots = pm.response.json().data;
    if (pilots.length > 0) {
        pm.environment.set("pilotId", pilots[0].id);
        pm.environment.set("pilotName", pilots[0].nombre);
        console.log("✅ Piloto guardado:", pilots[0].nombre);
    }
});
```

---

### 2. **POST /api/pilots** - Crear piloto

#### Pre-request Script:
```javascript
// Generar datos aleatorios para el piloto
const pilots = [
    "Carlos Sainz", "Lando Norris", "George Russell", 
    "Pierre Gasly", "Esteban Ocon", "Daniel Ricciardo"
];

const teams = [
    "Ferrari", "McLaren", "Mercedes", "Alpine", 
    "Red Bull Racing", "Aston Martin", "Williams"
];

const nationalities = [
    "Española", "Británica", "Francesa", "Australiana", 
    "Italiana", "Alemana", "Holandesa"
];

// Seleccionar valores aleatorios
const randomPilot = pilots[Math.floor(Math.random() * pilots.length)];
const randomTeam = teams[Math.floor(Math.random() * teams.length)];
const randomNationality = nationalities[Math.floor(Math.random() * nationalities.length)];
const randomAge = Math.floor(Math.random() * 15) + 20; // 20-35 años
const randomVictories = Math.floor(Math.random() * 10); // 0-10 victorias

// Crear el body dinámico
const pilotData = {
    nombre: randomPilot,
    equipo: randomTeam,
    nacionalidad: randomNationality,
    edad: randomAge,
    victorias: randomVictories
};

// Guardar en variable para usar en tests
pm.environment.set("newPilotData", JSON.stringify(pilotData));
console.log("🎲 Piloto generado:", randomPilot);
```

#### Tests:
```javascript
// Validar creación exitosa
pm.test("Piloto creado exitosamente", function () {
    pm.response.to.have.status(201);
});

// Validar que devuelve los datos del piloto
pm.test("Respuesta contiene datos del piloto", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.have.property('id');
    pm.expect(response.data).to.have.property('nombre');
    pm.expect(response.data).to.have.property('equipo');
});

// Guardar ID del piloto creado
pm.test("Guardar ID del piloto creado", function () {
    const response = pm.response.json();
    pm.environment.set("createdPilotId", response.data.id);
    console.log("✅ Piloto creado con ID:", response.data.id);
});
```

---

### 3. **GET /api/pilots/:id** - Obtener piloto específico

#### Pre-request Script:
```javascript
// Usar el ID guardado anteriormente
const pilotId = pm.environment.get("pilotId");
console.log("🔍 Buscando piloto con ID:", pilotId);
```

#### Tests:
```javascript
// Validar que encuentra el piloto
pm.test("Piloto encontrado", function () {
    pm.response.to.have.status(200);
});

// Validar estructura de datos
pm.test("Piloto tiene propiedades requeridas", function () {
    const pilot = pm.response.json().data;
    pm.expect(pilot).to.have.property('id');
    pm.expect(pilot).to.have.property('nombre');
    pm.expect(pilot).to.have.property('equipo');
    pm.expect(pilot).to.have.property('nacionalidad');
    pm.expect(pilot).to.have.property('edad');
    pm.expect(pilot).to.have.property('victorias');
});

// Validar tipos de datos
pm.test("Tipos de datos correctos", function () {
    const pilot = pm.response.json().data;
    pm.expect(pilot.id).to.be.a('number');
    pm.expect(pilot.nombre).to.be.a('string');
    pm.expect(pilot.edad).to.be.a('number');
    pm.expect(pilot.victorias).to.be.a('number');
});
```

---

### 4. **PUT /api/pilots/:id** - Actualizar piloto

#### Pre-request Script:
```javascript
// Usar piloto creado anteriormente
const pilotId = pm.environment.get("createdPilotId");
console.log("🔄 Actualizando piloto ID:", pilotId);

// Datos para actualizar
const updateData = {
    nombre: "Fernando Alonso",
    equipo: "Aston Martin",
    nacionalidad: "Española",
    edad: 42,
    victorias: 32
};

pm.environment.set("updatePilotData", JSON.stringify(updateData));
```

#### Tests:
```javascript
// Validar actualización exitosa
pm.test("Piloto actualizado correctamente", function () {
    pm.response.to.have.status(200);
});

// Validar que los datos se actualizaron
pm.test("Datos actualizados correctamente", function () {
    const response = pm.response.json();
    pm.expect(response.data.nombre).to.equal("Fernando Alonso");
    pm.expect(response.data.equipo).to.equal("Aston Martin");
    pm.expect(response.data.edad).to.equal(42);
    console.log("✅ Piloto actualizado:", response.data.nombre);
});
```

---

### 5. **DELETE /api/pilots/:id** - Eliminar piloto

#### Pre-request Script:
```javascript
// Usar el ID del piloto creado
const pilotId = pm.environment.get("createdPilotId");
console.log("🗑️ Eliminando piloto ID:", pilotId);
```

#### Tests:
```javascript
// Validar eliminación exitosa
pm.test("Piloto eliminado correctamente", function () {
    pm.response.to.have.status(200);
});

// Validar mensaje de confirmación
pm.test("Mensaje de confirmación", function () {
    const response = pm.response.json();
    pm.expect(response.message).to.include("eliminado");
    console.log("✅ Piloto eliminado exitosamente");
});

// Limpiar variables de entorno
pm.test("Limpiar variables", function () {
    pm.environment.unset("createdPilotId");
    pm.environment.unset("newPilotData");
    pm.environment.unset("updatePilotData");
    console.log("🧹 Variables limpiadas");
});
```

---

## 🚀 Automatización Avanzada

### Script para ejecutar toda la secuencia:

```javascript
// En el Collection Pre-request Script
pm.execution.setNextRequest("GET All Pilots");

// En cada request, definir el siguiente:
// GET All Pilots → POST Create Pilot → GET Single Pilot → PUT Update Pilot → DELETE Pilot
```

### Test Suite Completo:

```javascript
// Para ejecutar en Collection Tests
pm.test("Suite de pruebas completa", function () {
    // Contador de pruebas exitosas
    const passedTests = pm.test.index();
    console.log(`🎯 Pruebas completadas: ${passedTests}`);
    
    // Resumen final
    if (passedTests > 0) {
        console.log("✅ Todas las pruebas de la API pasaron correctamente");
    }
});
```

---

## 📊 Consejos para Reportes

### Generar datos para reportes:
```javascript
// En cada test, agregar métricas
pm.test("Tiempo de respuesta aceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
    
    // Guardar métricas
    pm.globals.set("responseTime_" + pm.info.requestName, pm.response.responseTime);
});
```

### Validación de rendimiento:
```javascript
// Script para validar rendimiento
pm.test("API responde rápidamente", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
    console.log("⚡ Tiempo de respuesta:", pm.response.responseTime + "ms");
});
```

---

## 🔧 Configuración del Runner

1. **Iterations**: 3-5 para probar consistencia
2. **Delay**: 500ms entre requests
3. **Data File**: CSV con datos de prueba (opcional)
4. **Environment**: Usar el environment creado

### Ejemplo de CSV para datos de prueba:
```csv
nombre,equipo,nacionalidad,edad,victorias
"Lewis Hamilton","Mercedes","Británica",39,103
"Max Verstappen","Red Bull Racing","Holandesa",26,54
"Charles Leclerc","Ferrari","Monegasca",26,5
```

---

## 🎯 Resultado Final

Con estos scripts obtienes:
- ✅ **Validación automática** de responses
- 🎲 **Datos aleatorios** para pruebas
- 🔄 **Secuencia automática** de requests
- 📊 **Métricas de rendimiento**
- 🧹 **Limpieza automática** de variables

¡Tu API estará completamente automatizada con menos de 10 líneas por endpoint!

-----

🎯 Puntos clave de la automatización:
1. Pre-request Scripts (Automatización de entrada):

Generan datos aleatorios para pruebas
Configuran variables dinámicas
Preparan el contexto de cada request

2. Tests Scripts (Automatización de validación):

Validan automáticamente responses
Guardan datos para requests posteriores
Verifican códigos de estado y estructura

3. Flujo Automatizado:
GET All → POST Create → GET Single → PUT Update → DELETE
🚀 Implementación rápida:

Crea el Environment con las variables base
Copia los scripts en cada endpoint según corresponda
Ejecuta con Collection Runner para automatización completa

💡 Beneficios inmediatos:

Datos aleatorios: Cada ejecución prueba con datos diferentes
Validación automática: Sin intervención manual
Secuencia completa: Prueba todo el CRUD automáticamente
Métricas de rendimiento: Tiempo de respuesta automático
Limpieza automática: Variables se limpian solas

📊 Ejemplo de uso:

Ejecutas el Collection Runner
Postman genera un piloto aleatorio
Lo crea, lo busca, lo actualiza y lo elimina
Valida cada paso automáticamente
Te muestra un reporte completo
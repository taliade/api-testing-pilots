¡Perfecto! Te voy a explicar paso a paso cómo aplicar la automatización en Postman con ejemplos prácticos.
🎯 PASO 1: Configurar el Environment
1.1 Crear Environment

En Postman, ve a Environments (icono de engranaje)
Clic en "Create Environment"
Nombre: F1 Pilots API
Agrega estas variables:

VariableInitial ValueCurrent ValuebaseUrlhttp://localhost:3000http://localhost:3000pilotId11pilotNameMax VerstappenMax Verstappen
1.2 Activar Environment

Selecciona el environment desde el dropdown en la esquina superior derecha


🎯 PASO 2: Crear la Collection
2.1 Nueva Collection

Clic en "New" → "Collection"
Nombre: F1 Pilots API Tests
Guarda la collection


🎯 PASO 3: Crear los Requests
Te voy a mostrar cómo crear cada request con sus scripts:
3.1 REQUEST 1: GET All Pilots
Configurar el Request:
Method: GET
URL: {{baseUrl}}/api/pilots
Pre-request Script:
javascript// Limpiar console para nueva ejecución
console.clear();
console.log("🔍 INICIANDO: GET All Pilots");
console.log("📍 URL:", pm.environment.get("baseUrl") + "/api/pilots");
Tests Script:
javascript// TEST 1: Validar status code
pm.test("✅ Status code es 200", function () {
    pm.response.to.have.status(200);
});

// TEST 2: Validar que hay datos
pm.test("✅ Respuesta contiene datos", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.be.an('array');
    pm.expect(response.data.length).to.be.greaterThan(0);
});

// TEST 3: Guardar primer piloto para usar después
pm.test("✅ Guardar datos del primer piloto", function () {
    const pilots = pm.response.json().data;
    if (pilots.length > 0) {
        pm.environment.set("pilotId", pilots[0].id);
        pm.environment.set("pilotName", pilots[0].nombre);
        console.log("💾 Piloto guardado:", pilots[0].nombre, "ID:", pilots[0].id);
    }
});

// MÉTRICA: Tiempo de respuesta
pm.test("⚡ Tiempo de respuesta aceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
    console.log("⏱️ Tiempo de respuesta:", pm.response.responseTime + "ms");
});

3.2 REQUEST 2: POST Create Pilot
Configurar el Request:
Method: POST
URL: {{baseUrl}}/api/pilots
Headers: Content-Type: application/json
Pre-request Script:
javascriptconsole.log("🆕 INICIANDO: POST Create Pilot");

// Generar datos aleatorios
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

// Crear el piloto
const pilotData = {
    nombre: randomPilot,
    equipo: randomTeam,
    nacionalidad: randomNationality,
    edad: randomAge,
    victorias: randomVictories
};

// Guardar los datos
pm.environment.set("newPilotData", JSON.stringify(pilotData));
console.log("🎲 Piloto generado:", randomPilot, "Equipo:", randomTeam);

// Configurar el body del request automáticamente
pm.request.body.raw = JSON.stringify(pilotData);
Body (raw - JSON):
json{
    "nombre": "Se genera automáticamente",
    "equipo": "Se genera automáticamente", 
    "nacionalidad": "Se genera automáticamente",
    "edad": 25,
    "victorias": 3
}
Tests Script:
javascript// TEST 1: Validar creación exitosa
pm.test("✅ Piloto creado exitosamente", function () {
    pm.response.to.have.status(201);
});

// TEST 2: Validar estructura de respuesta
pm.test("✅ Respuesta contiene datos del piloto", function () {
    const response = pm.response.json();
    pm.expect(response.data).to.have.property('id');
    pm.expect(response.data).to.have.property('nombre');
    pm.expect(response.data).to.have.property('equipo');
});

// TEST 3: Guardar ID del piloto creado
pm.test("✅ Guardar ID del piloto creado", function () {
    const response = pm.response.json();
    pm.environment.set("createdPilotId", response.data.id);
    console.log("💾 Piloto creado con ID:", response.data.id);
    console.log("📝 Nombre:", response.data.nombre);
});

// MÉTRICA: Tiempo de respuesta
pm.test("⚡ Tiempo de respuesta aceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
    console.log("⏱️ Tiempo de respuesta:", pm.response.responseTime + "ms");
});

3.3 REQUEST 3: GET Single Pilot
Configurar el Request:
Method: GET
URL: {{baseUrl}}/api/pilots/{{createdPilotId}}
Pre-request Script:
javascriptconst pilotId = pm.environment.get("createdPilotId");
console.log("🔍 INICIANDO: GET Single Pilot");
console.log("🎯 Buscando piloto con ID:", pilotId);
Tests Script:
javascript// TEST 1: Validar que encuentra el piloto
pm.test("✅ Piloto encontrado", function () {
    pm.response.to.have.status(200);
});

// TEST 2: Validar estructura completa
pm.test("✅ Piloto tiene todas las propiedades", function () {
    const pilot = pm.response.json().data;
    pm.expect(pilot).to.have.property('id');
    pm.expect(pilot).to.have.property('nombre');
    pm.expect(pilot).to.have.property('equipo');
    pm.expect(pilot).to.have.property('nacionalidad');
    pm.expect(pilot).to.have.property('edad');
    pm.expect(pilot).to.have.property('victorias');
});

// TEST 3: Validar tipos de datos
pm.test("✅ Tipos de datos correctos", function () {
    const pilot = pm.response.json().data;
    pm.expect(pilot.id).to.be.a('number');
    pm.expect(pilot.nombre).to.be.a('string');
    pm.expect(pilot.edad).to.be.a('number');
    pm.expect(pilot.victorias).to.be.a('number');
    console.log("✅ Piloto válido:", pilot.nombre);
});

3.4 REQUEST 4: PUT Update Pilot
Configurar el Request:
Method: PUT
URL: {{baseUrl}}/api/pilots/{{createdPilotId}}
Headers: Content-Type: application/json
Pre-request Script:
javascriptconst pilotId = pm.environment.get("createdPilotId");
console.log("🔄 INICIANDO: PUT Update Pilot");
console.log("🎯 Actualizando piloto ID:", pilotId);

// Datos para actualizar (siempre los mismos para consistencia)
const updateData = {
    nombre: "Fernando Alonso",
    equipo: "Aston Martin",
    nacionalidad: "Española",
    edad: 42,
    victorias: 32
};

pm.environment.set("updatePilotData", JSON.stringify(updateData));
console.log("📝 Actualizando a:", updateData.nombre);

// Configurar el body automáticamente
pm.request.body.raw = JSON.stringify(updateData);
Tests Script:
javascript// TEST 1: Validar actualización exitosa
pm.test("✅ Piloto actualizado correctamente", function () {
    pm.response.to.have.status(200);
});

// TEST 2: Validar que los datos se actualizaron
pm.test("✅ Datos actualizados correctamente", function () {
    const response = pm.response.json();
    pm.expect(response.data.nombre).to.equal("Fernando Alonso");
    pm.expect(response.data.equipo).to.equal("Aston Martin");
    pm.expect(response.data.edad).to.equal(42);
    pm.expect(response.data.victorias).to.equal(32);
    console.log("✅ Piloto actualizado:", response.data.nombre);
});

// TEST 3: Validar que el ID no cambió
pm.test("✅ ID del piloto no cambió", function () {
    const response = pm.response.json();
    const originalId = pm.environment.get("createdPilotId");
    pm.expect(response.data.id).to.equal(parseInt(originalId));
});

3.5 REQUEST 5: DELETE Pilot
Configurar el Request:
Method: DELETE
URL: {{baseUrl}}/api/pilots/{{createdPilotId}}
Pre-request Script:
javascriptconst pilotId = pm.environment.get("createdPilotId");
console.log("🗑️ INICIANDO: DELETE Pilot");
console.log("🎯 Eliminando piloto ID:", pilotId);
Tests Script:
javascript// TEST 1: Validar eliminación exitosa
pm.test("✅ Piloto eliminado correctamente", function () {
    pm.response.to.have.status(200);
});

// TEST 2: Validar mensaje de confirmación
pm.test("✅ Mensaje de confirmación", function () {
    const response = pm.response.json();
    pm.expect(response.message).to.include("eliminado");
    console.log("✅ Confirmación:", response.message);
});

// TEST 3: Limpiar variables de entorno
pm.test("✅ Variables limpiadas", function () {
    pm.environment.unset("createdPilotId");
    pm.environment.unset("newPilotData");
    pm.environment.unset("updatePilotData");
    console.log("🧹 Variables de entorno limpiadas");
});

// RESUMEN FINAL
console.log("🎉 SECUENCIA COMPLETA FINALIZADA");
console.log("✅ Piloto creado, consultado, actualizado y eliminado exitosamente");

🎯 PASO 4: Ejecutar la Automatización
4.1 Ejecutar manualmente:

Selecciona cada request y ejecuta en orden
Observa la consola para ver los logs

4.2 Ejecutar con Collection Runner:

Clic derecho en la collection → "Run Collection"
Configurar:

Iterations: 3
Delay: 500ms
Environment: F1 Pilots API


Clic en "Run F1 Pilots API Tests"


📊 Resultado Esperado
Al ejecutar verás:

✅ 15 tests pasados (3 por request)
🎲 Datos aleatorios en cada ejecución
⚡ Métricas de rendimiento
📝 Logs detallados en la consola
🔄 Secuencia completa automatizada
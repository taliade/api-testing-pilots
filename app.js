  // Simulación de base de datos en memoria
        let pilots = [
            {
                id: 1,
                nombre: "Max Verstappen",
                equipo: "Red Bull Racing",
                nacionalidad: "Holandesa",
                edad: 26,
                victorias: 54
            },
            {
                id: 2,
                nombre: "Lewis Hamilton",
                equipo: "Mercedes",
                nacionalidad: "Británica",
                edad: 39,
                victorias: 103
            },
            {
                id: 3,
                nombre: "Charles Leclerc",
                equipo: "Ferrari",
                nacionalidad: "Monegasca",
                edad: 26,
                victorias: 5
            }
        ];

        let nextId = 4;

        // Función para manejar el envío del formulario
        function handleSubmit(event) {
            event.preventDefault();
            
            const formData = new FormData(document.getElementById('pilotForm'));
            const pilotData = {
                nombre: formData.get('nombre'),
                equipo: formData.get('equipo'),
                nacionalidad: formData.get('nacionalidad'),
                edad: parseInt(formData.get('edad')),
                victorias: parseInt(formData.get('victorias'))
            };

            // Mostrar los datos que se pueden usar en Postman
            const responseContainer = document.getElementById('responseContainer');
            responseContainer.innerHTML = `
                <div class="response-code">
                    <strong>📝 Datos del formulario para usar en Postman:</strong>
                    
${JSON.stringify(pilotData, null, 2)}

                    <strong>💡 Cómo usar en Postman:</strong>
                    1. Copia el JSON de arriba
                    2. Selecciona método POST o PUT
                    3. Pega el JSON en el Body > raw > JSON
                    4. Envía la petición
                </div>
            `;

            // Opcional: agregar el piloto a la lista local para visualización
            const newPilot = {
                id: nextId++,
                ...pilotData
            };
            
            if (pilotData.nombre && pilotData.equipo && pilotData.nacionalidad) {
                pilots.push(newPilot);
                displayPilots();
                document.getElementById('pilotForm').reset();
            }
        }

        // Función para mostrar pilotos
        function displayPilots() {
            const container = document.getElementById('pilotsContainer');
            
            if (pilots.length === 0) {
                container.innerHTML = '<p>No hay pilotos registrados</p>';
                return;
            }

            container.innerHTML = pilots.map(pilot => `
                <div class="pilot-card">
                    <h3>${pilot.nombre}</h3>
                    <p><strong>ID:</strong> ${pilot.id}</p>
                    <p><strong>Equipo:</strong> ${pilot.equipo}</p>
                    <p><strong>Nacionalidad:</strong> ${pilot.nacionalidad}</p>
                    <p><strong>Edad:</strong> ${pilot.edad} años</p>
                    <p><strong>Victorias:</strong> ${pilot.victorias}</p>
                </div>
            `).join('');
        }

        // Cargar pilotos al inicio
        displayPilots();
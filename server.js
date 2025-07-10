const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let pilots = [];
let nextId = 1;

// GET all pilots
app.get('/api/pilots', (req, res) => {
    res.json(pilots);
});

// GET one pilot
app.get('/api/pilots/:id', (req, res) => {
    const pilot = pilots.find(p => p.id === parseInt(req.params.id));
    if (!pilot) return res.status(404).json({ error: 'Pilot not found' });
    res.json(pilot);
});

// POST create pilot
app.post('/api/pilots', (req, res) => {
    const pilot = { id: nextId++, ...req.body };
    pilots.push(pilot);
    res.status(201).json(pilot);
});

// PUT update pilot
app.put('/api/pilots/:id', (req, res) => {
    const index = pilots.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Pilot not found' });
    pilots[index] = { ...pilots[index], ...req.body };
    res.json(pilots[index]);
});

// DELETE pilot
app.delete('/api/pilots/:id', (req, res) => {
    const index = pilots.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Pilot not found' });
    const deleted = pilots.splice(index, 1);
    res.json(deleted[0]);
});

// 🟢 Agregado para servir la interfaz web
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

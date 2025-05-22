const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/entries', (req, res) => {
  res.json(readData());
});

app.post('/api/entries', (req, res) => {
  const data = readData();
  const newEntry = { id: Date.now(), ...req.body };
  data.push(newEntry);
  writeData(data);
  res.json(newEntry);
});

app.put('/api/entries/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const idx = data.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).end();
  data[idx] = { ...data[idx], ...req.body, id };
  writeData(data);
  res.json(data[idx]);
});

app.delete('/api/entries/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const idx = data.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).end();
  const removed = data.splice(idx, 1)[0];
  writeData(data);
  res.json(removed);
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

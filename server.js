const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data', 'entries.json');
const PORT = process.env.PORT || 8743;

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

function readEntries() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}
function writeEntries(entries) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(entries, null, 2));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/entries', (req, res) => {
  res.json(readEntries());
});

app.post('/api/entries', (req, res) => {
  const { date, type, text } = req.body;
  if (!date || !type || !text) {
    return res.status(400).json({ error: 'date, type и text обязательны' });
  }
  const entries = readEntries();
  const entry = { id: Date.now().toString(36), date, type, text };
  entries.push(entry);
  writeEntries(entries);
  res.json(entry);
});

app.delete('/api/entries/:id', (req, res) => {
  let entries = readEntries();
  entries = entries.filter(e => e.id !== req.params.id);
  writeEntries(entries);
  res.json({ ok: true });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Notes app running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/guardar', async (req, res) => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwR4e1B3Zf3ARzDXinL4AsbGIRC-bjeeRqYvtHNMNeAIqW5EcAoBk3wnfSX2jjf2m8m/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    // Intentá parsear como JSON, pero chequeá si es texto primero
    const text = await response.text();

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch (jsonError) {
      console.error("Respuesta no es JSON:", text);
      res.status(500).json({ status: "error", message: "La respuesta no fue JSON", raw: text });
    }
  } catch (err) {
    console.error("Error en el proxy:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => console.log(`Servidor proxy escuchando en el puerto ${PORT}`));

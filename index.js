const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta proxy para reenviar al Apps Script
app.post('/guardar', async (req, res) => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbx_MTDEuwlu3llv1t4OSF0GxmbxTXs5G5-Z.../exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    console.error("Error en el proxy:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(PORT, () => console.log(`Servidor proxy escuchando en el puerto ${PORT}`));

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // node-fetch v2 for CommonJS

const app = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS para todas las solicitudes
app.use(cors());
// Habilita el parseo de JSON en el cuerpo de las solicitudes
app.use(express.json());

// Ruta para guardar datos de jugadores
app.post('/guardar', async (req, res) => {
  try {
    // URL de tu Google Apps Script desplegado como Web App
    // ¡IMPORTANTE! Asegúrate de que esta URL sea la correcta y esté desplegada
    // con acceso para "Cualquiera" y ejecutada como "Yo".
    const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxdrBZ_3gyiwlnfEUMY40t02Er0HLF-yCSFpQvsDMeAfbzwmsSZcSCnqPhjC-9JG2MV/exec';

    // Realiza la solicitud POST al Google Apps Script con los datos recibidos
    const response = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body) // Envía el cuerpo de la solicitud tal cual
    });

    // Lee la respuesta como texto primero para manejar posibles errores no-JSON
    const text = await response.text();

    try {
      // Intenta parsear la respuesta como JSON
      const json = JSON.parse(text);
      // Envía la respuesta JSON de vuelta al cliente
      res.json(json);
    } catch (jsonError) {
      // Si la respuesta no es JSON, loguea el error y envía un mensaje al cliente
      console.error("Respuesta de Google Apps Script no es JSON:", text);
      res.status(500).json({ status: "error", message: "La respuesta de Google Apps Script no fue JSON válida.", raw: text });
    }
  } catch (err) {
    // Manejo de errores de red o del servidor proxy
    console.error("Error en el proxy al comunicarse con Google Apps Script:", err);
    res.status(500).json({ status: "error", message: `Error en el servidor proxy: ${err.message}` });
  }
});

// Ruta para obtener datos de jugadores (usando doGet en Google Apps Script)
app.get('/jugadores', async (req, res) => {
  try {
    const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxdrBZ_3gyiwlnfEUMY40t02Er0HLF-yCSFpQvsDMeAfbzwmsSZcSCnqPhjC-9JG2MV/exec';

    // Realiza la solicitud GET al Google Apps Script
    const response = await fetch(googleAppsScriptUrl, {
      method: 'GET'
    });

    const text = await response.text();

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch (jsonError) {
      console.error("Respuesta de Google Apps Script para GET no es JSON:", text);
      res.status(500).json({ status: "error", message: "La respuesta de Google Apps Script para GET no fue JSON válida.", raw: text });
    }
  } catch (err) {
    console.error("Error en el proxy al obtener datos de Google Apps Script:", err);
    res.status(500).json({ status: "error", message: `Error en el servidor proxy: ${err.message}` });
  }
});


// Inicia el servidor proxy
app.listen(PORT, () => console.log(`Servidor proxy escuchando en el puerto ${PORT}`));

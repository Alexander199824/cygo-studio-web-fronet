const express = require('express');
const path = require('path');

const app = express();

// Servir archivos estáticos de la carpeta build
app.use(express.static(path.join(__dirname, 'build')));

// Manejar todas las rutas enviando el archivo index.html
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Obtener el puerto del entorno o usar 3000 como fallback
const port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Production server running on port ${port}`);
});
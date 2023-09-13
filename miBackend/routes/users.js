const express = require("express");
const path = require('path');
const formidable = require("formidable");
const router = express.Router();

const connectToDb = require("../database/dbmysql");

// Endpoint para agregar un nuevo usuario con nombre, apellido y foto
router.post("/", (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al analizar el formulario:", err);
      return res.status(500).json({ error: "Error al procesar la solicitud" });
    }

    const { nombre, apellido } = fields;
    const foto = files.foto;

    try {
      if (!foto) {
        return res.status(400).json({ error: "Debes cargar una foto" });
      }

      // Verifica el tamaño de la imagen (por ejemplo, si no debe superar los 5 MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
      if (foto.size > maxSizeInBytes) {
        return res.status(400).json({ error: "La imagen es demasiado grande" });
      }

      // Convierte la foto a una cadena base64
      const fotoBase64 = foto.toString("base64");

      const dbConnection = await connectToDb();
      const sql = "INSERT INTO users (name, lnam, imag) VALUES (?, ?, ?)";
      const [result] = await dbConnection.execute(sql, [nombre, apellido, fotoBase64]);

      res.json({ message: "Usuario agregado correctamente", userId: result.insertId });
    } catch (error) {
      console.error(`Error al agregar el usuario: ${error.message}`);
      res.status(500).json({ error: "Error al agregar el usuario" });
    }
  });
});

router.get('/', async (req, res) => {
  try {
    // Realiza una consulta a la base de datos para obtener la lista de usuarios
    const dbConnection = await connectToDb();
    const [rows, fields] = await dbConnection.execute('SELECT id, name, lnam, imag FROM users');

    // Mapea los resultados para incluir una propiedad 'foto' con la URL de la imagen
    const usersWithImages = rows.map(user => ({
      ...user,
      foto: `data:image/jpeg;base64,${user.imag}`,
    }));
    console.log(usersWithImages); // Agrega esta línea
    res.json(usersWithImages);
  } catch (error) {
    console.error(`Error al obtener la lista de usuarios: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
  }
});

module.exports = router;
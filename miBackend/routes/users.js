const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Importa el módulo fs
const router = express.Router();

const helperImg = (filePath, size = 300) => {

}
// Configuración de Multer para manejar la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()
    cb(null, `${Date.now()}.${ext}`)
  }
})

const upload = multer({ storage });

const connectToDb = require("../database/dbmysql");

// Endpoint para agregar un nuevo usuario con nombre, apellido y foto
router.post("/", upload.single("foto"), async (req, res) => {
  try {
    // Obtén los datos del formulario (nombre, apellido) desde req.body
    const { nombre, apellido } = req.body;

    const nombreArchivo = req.file.originalname;
    fs.renameSync(req.file.path, path.join('uploads', nombreArchivo));

    // Realiza una consulta a la base de datos para insertar el nuevo usuario
    const dbConnection = await connectToDb();

    // Inserta el usuario en la base de datos con la imagen en formato base64
    const sql = "INSERT INTO users (name, lnam, imag) VALUES (?, ?, ?)";
    const [result] = await dbConnection.execute(sql, [nombre, apellido, nombreArchivo]);

    res.json({ message: "Usuario agregado correctamente", userId: result.insertId });
    console.log(req.file.path);
  } catch (error) {
    console.error(`Error al agregar el usuario: ${error.message}`);
    res.status(500).json({ error: "Error al agregar el usuario" });
  }
});


router.get('/', async (req, res) => {
  try {
    // Realiza una consulta a la base de datos para obtener la lista de usuarios
    const dbConnection = await connectToDb();
    const [rows, fields] = await dbConnection.execute('SELECT id, name, lnam, imag FROM users');

    // Mapea los resultados para incluir una propiedad 'foto' con la URL de la imagen
    const usersWithImages = rows.map(user => ({
      id: user.id,
      name: user.name,
      lnam: user.lnam,
      imag: `${user.imag}` // Asigna la URL de la imagen
    }));
    console.log(usersWithImages); // Agrega esta línea
    res.json(usersWithImages);
  } catch (error) {
    console.error(`Error al obtener la lista de usuarios: ${error.message}`);
    res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
  }
});

module.exports = router;
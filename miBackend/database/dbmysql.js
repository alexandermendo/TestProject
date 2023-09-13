const mysql = require('mysql2/promise'); // Importa mysql2 para usar promesas

// Carga la configuración de MySQL desde el archivo configmysql.json
const config = require('./configmysql.json').mysql;

// Función para establecer la conexión a la base de datos MySQL y retornar una promesa
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(config);
    // La conexión se establece con éxito, retorna la conexión
    return connection;
  } catch (error) {
    // Ocurrió un error al conectar, lanza una excepción
    throw new Error(`Error al conectar a la base de datos: ${error.message}`);
  }
}

module.exports = connectToDatabase;


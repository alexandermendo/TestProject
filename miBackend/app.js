const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const usersRouter = require("../miBackend/routes/users");

app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Manajador de errores personalizado para recursos no encontrados (404)
app.use(function (req, res, next) {
  const error = new Error("Recurso no encontrado");
  error.status = 404;
  next(error);
});

// Manajador de errores personalizado para otros errores (500)
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.json({ error: err.message }); // Respondemos con un JSON de error
});

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT || 3000;

try {
    app.listen(port, () => {
        console.log(`Escuchando en el puerto ${port}...`);
    });
} catch (error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
}

module.exports = app;

const express = require("express");
const cors = require("cors");
const app = express();
const usersRouter = require("../miBackend/routes/users");

app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);

app.use(function (req, res, next) { next(createError(404)) });
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

const port = process.env.PORT || 3000;

try {
    app.listen(port, () => {
        console.log(`Escuchando en el puerto ${port}...`);
    });
} catch (error) {
    console.error(`Error al iniciar el servidor: ${error.message}`);
}

module.exports = app;
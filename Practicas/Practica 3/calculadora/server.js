const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/calcular", (req, res) => {
  const { a, b, operacion } = req.body;
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  let resultado;

  switch (operacion) {
    case "sumar":
      resultado = numA + numB;
      break;
    case "restar":
      resultado = numA - numB;
      break;
    case "multiplicar":
      resultado = numA * numB;
      break;
    case "dividir":
      resultado = numB !== 0 ? numA / numB : "Error: División entre 0";
      break;
    default:
      resultado = "Operación inválida";
  }

  res.send(`
    <h1>Resultado: ${resultado}</h1>
    <a href="/">Volver</a>
  `);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

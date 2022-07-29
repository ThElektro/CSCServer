const express = require("express");
const path = require("path");

const app = express();
const port = 3000;
const root = path.join(__dirname, "web");

app.use(express.static(root));

app.get("/", (req, res) => {
    res.sendFile(`${root}/index.html`);
});

app.listen(port, () => {
    console.log(`Servidor web iniciado en el puerto ${port}. Raíz en la carpeta ${root}`);
})

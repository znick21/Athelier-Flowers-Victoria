const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/',           require('./routes/auth.routes'));
app.use('/categorias', require('./routes/categorias.routes'));
app.use('/productos',  require('./routes/productos.routes'));
app.use('/clientes',   require('./routes/clientes.routes'));
app.use('/pedidos',    require('./routes/pedidos.routes'));
app.use('/pagos',      require('./routes/pagos.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));

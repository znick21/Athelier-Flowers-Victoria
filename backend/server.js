const express = require('express');
const cors    = require('cors');
const path    = require('path');
const multer  = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir imágenes estáticas desde public/img/
app.use('/img', express.static(path.join(__dirname, '../public/img')));

// Upload de imágenes
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../public/img/'),
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 7) + ext;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máx
  fileFilter: (req, file, cb) => {
    cb(null, /image\/(jpeg|png|webp|gif)/.test(file.mimetype));
  }
});

const auth = require('./middleware/auth');
app.post('/upload', auth, upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió ninguna imagen' });
  res.json({ url: `/img/${req.file.filename}` });
});

// Rutas
app.use('/',           require('./routes/auth.routes'));
app.use('/categorias', require('./routes/categorias.routes'));
app.use('/productos',  require('./routes/productos.routes'));
app.use('/clientes',   require('./routes/clientes.routes'));
app.use('/pedidos',    require('./routes/pedidos.routes'));
app.use('/pagos',      require('./routes/pagos.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));

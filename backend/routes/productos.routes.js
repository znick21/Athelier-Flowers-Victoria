const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { categoriaId } = req.query;
  const sql = categoriaId
    ? 'SELECT * FROM productos WHERE categoriaId = ?'
    : 'SELECT * FROM productos';
  const [rows] = await db.query(sql, categoriaId ? [categoriaId] : []);
  res.json(rows);
});

router.get('/:id', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' });
});

router.post('/', auth, async (req, res) => {
  const { nombre, descripcion, precio, stock, categoriaId, imagen, token } = req.body;
  const [result] = await db.query(
    'INSERT INTO productos (nombre, descripcion, precio, stock, categoriaId, imagen, token) VALUES (?,?,?,?,?,?,?)',
    [nombre, descripcion || null, precio, stock, categoriaId, imagen || null, token]
  );
  res.status(201).json({ id: result.insertId, nombre, descripcion, precio, stock, categoriaId, imagen, token });
});

router.put('/:id', auth, async (req, res) => {
  const { nombre, descripcion, precio, stock, categoriaId, imagen, token } = req.body;
  await db.query(
    'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoriaId=?, imagen=?, token=? WHERE id=?',
    [nombre, descripcion || null, precio, stock, categoriaId, imagen || null, token, req.params.id]
  );
  res.json({ id: Number(req.params.id), nombre, descripcion, precio, stock, categoriaId, imagen, token });
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;

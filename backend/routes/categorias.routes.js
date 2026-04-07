const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');

router.get('/',      auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categorias');
  res.json(rows);
});

router.get('/:id',   auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categorias WHERE id = ?', [req.params.id]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' });
});

router.post('/',     auth, async (req, res) => {
  const { nombre, descripcion, token } = req.body;
  const [result] = await db.query(
    'INSERT INTO categorias (nombre, descripcion, token) VALUES (?,?,?)',
    [nombre, descripcion, token]
  );
  res.status(201).json({ id: result.insertId, nombre, descripcion, token });
});

router.put('/:id',   auth, async (req, res) => {
  const { nombre, descripcion, token } = req.body;
  await db.query(
    'UPDATE categorias SET nombre=?, descripcion=?, token=? WHERE id=?',
    [nombre, descripcion, token, req.params.id]
  );
  res.json({ id: Number(req.params.id), nombre, descripcion, token });
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM categorias WHERE id = ?', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;

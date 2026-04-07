const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { userId } = req.query;
  const sql = userId
    ? 'SELECT * FROM clientes WHERE userId = ?'
    : 'SELECT * FROM clientes';
  const [rows] = await db.query(sql, userId ? [userId] : []);
  res.json(rows);
});

router.get('/:id', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' });
});

router.post('/', auth, async (req, res) => {
  const { nombre, email, telefono, userId, token } = req.body;
  const [result] = await db.query(
    'INSERT INTO clientes (nombre, email, telefono, userId, token) VALUES (?,?,?,?,?)',
    [nombre, email, telefono, userId, token]
  );
  res.status(201).json({ id: result.insertId, nombre, email, telefono, userId, token });
});

router.put('/:id', auth, async (req, res) => {
  const { nombre, email, telefono, userId, token } = req.body;
  await db.query(
    'UPDATE clientes SET nombre=?, email=?, telefono=?, userId=?, token=? WHERE id=?',
    [nombre, email, telefono, userId, token, req.params.id]
  );
  res.json({ id: Number(req.params.id), nombre, email, telefono, userId, token });
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM clientes WHERE id = ?', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;

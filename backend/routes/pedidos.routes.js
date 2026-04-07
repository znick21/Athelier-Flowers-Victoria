const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { clienteId } = req.query;
  const sql = clienteId
    ? 'SELECT * FROM pedidos WHERE clienteId = ?'
    : 'SELECT * FROM pedidos';
  const [rows] = await db.query(sql, clienteId ? [clienteId] : []);
  res.json(rows);
});

router.get('/:id', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pedidos WHERE id = ?', [req.params.id]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' });
});

router.post('/', auth, async (req, res) => {
  const { clienteId, productoId, cantidad, total, estado, fecha, token } = req.body;
  const [result] = await db.query(
    'INSERT INTO pedidos (clienteId, productoId, cantidad, total, estado, fecha, token) VALUES (?,?,?,?,?,?,?)',
    [clienteId, productoId, cantidad, total, estado || 'pendiente', fecha, token]
  );
  res.status(201).json({ id: result.insertId, clienteId, productoId, cantidad, total, estado, fecha, token });
});

router.put('/:id', auth, async (req, res) => {
  const { clienteId, productoId, cantidad, total, estado, fecha, token } = req.body;
  await db.query(
    'UPDATE pedidos SET clienteId=?, productoId=?, cantidad=?, total=?, estado=?, fecha=?, token=? WHERE id=?',
    [clienteId, productoId, cantidad, total, estado, fecha, token, req.params.id]
  );
  res.json({ id: Number(req.params.id), clienteId, productoId, cantidad, total, estado, fecha, token });
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM pedidos WHERE id = ?', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;

const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const { pedidoId } = req.query;
  const sql = pedidoId
    ? 'SELECT * FROM pagos WHERE pedidoId = ?'
    : 'SELECT * FROM pagos';
  const [rows] = await db.query(sql, pedidoId ? [pedidoId] : []);
  res.json(rows);
});

router.get('/:id', auth, async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pagos WHERE id = ?', [req.params.id]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' });
});

router.post('/', auth, async (req, res) => {
  const { pedidoId, monto, metodo, fecha, token } = req.body;
  const [result] = await db.query(
    'INSERT INTO pagos (pedidoId, monto, metodo, fecha, token) VALUES (?,?,?,?,?)',
    [pedidoId, monto, metodo, fecha, token]
  );
  res.status(201).json({ id: result.insertId, pedidoId, monto, metodo, fecha, token });
});

router.put('/:id', auth, async (req, res) => {
  const { pedidoId, monto, metodo, fecha, token } = req.body;
  await db.query(
    'UPDATE pagos SET pedidoId=?, monto=?, metodo=?, fecha=?, token=? WHERE id=?',
    [pedidoId, monto, metodo, fecha, token, req.params.id]
  );
  res.json({ id: Number(req.params.id), pedidoId, monto, metodo, fecha, token });
});

router.delete('/:id', auth, async (req, res) => {
  await db.query('DELETE FROM pagos WHERE id = ?', [req.params.id]);
  res.json({ deleted: true });
});

module.exports = router;

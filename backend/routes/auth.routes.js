const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db');
const auth    = require('../middleware/auth');

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND activo = 1', [email]);
    if (!rows.length) return res.status(400).json('Email no encontrado');
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json('Contraseña incorrecta');
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'floreria_secret_2026',
      { expiresIn: '8h' }
    );
    const { password: _, ...userSafe } = user;
    res.json({ accessToken, user: userSafe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /register — solo crea clientes
router.post('/register', async (req, res) => {
  const { nombre, email, password, telefono } = req.body;
  try {
    const [existe] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existe.length) return res.status(400).json({ error: 'El email ya está registrado' });

    const hash     = await bcrypt.hash(password, 10);
    const token    = 'tok-' + Math.random().toString(36).substring(2, 10);
    const [result] = await db.query(
      'INSERT INTO users (nombre, email, password, role, token, activo) VALUES (?,?,?,?,?,1)',
      [nombre, email, hash, 'cliente', token]
    );
    const userId  = result.insertId;
    const cliTok  = 'cli-' + Math.random().toString(36).substring(2, 10);
    await db.query(
      'INSERT INTO clientes (nombre, email, telefono, userId, token) VALUES (?,?,?,?,?)',
      [nombre, email, telefono || null, userId, cliTok]
    );
    res.status(201).json({ message: 'Registro exitoso. Ya puedes iniciar sesión.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /usuarios — solo admin
router.get('/usuarios', auth, async (req, res) => {
  const [rows] = await db.query(
    'SELECT id, nombre, email, role, activo, created_at FROM users ORDER BY id'
  );
  res.json(rows);
});

// PATCH /usuarios/:id/desactivar — borrado lógico
router.patch('/usuarios/:id/desactivar', auth, async (req, res) => {
  await db.query('UPDATE users SET activo = 0 WHERE id = ?', [req.params.id]);
  res.json({ message: 'Usuario desactivado' });
});

// PATCH /usuarios/:id/activar — reactivar
router.patch('/usuarios/:id/activar', auth, async (req, res) => {
  await db.query('UPDATE users SET activo = 1 WHERE id = ?', [req.params.id]);
  res.json({ message: 'Usuario activado' });
});

module.exports = router;

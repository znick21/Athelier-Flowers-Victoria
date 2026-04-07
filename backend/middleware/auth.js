const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer '))
    return res.status(401).json({ error: 'No autorizado' });
  try {
    req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'floreria_secret_2026');
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

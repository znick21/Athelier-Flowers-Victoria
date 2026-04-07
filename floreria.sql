-- ============================================================
--  ATELIER FLOWERS VICTORIA — Script SQL para HeidiSQL/MySQL
-- ============================================================

USE floreriabd;

-- ── Usuarios ──
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('admin','vendedor','cliente') NOT NULL DEFAULT 'cliente',
  token      VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Categorías ──
CREATE TABLE IF NOT EXISTS categorias (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  descripcion TEXT,
  token       VARCHAR(100)
);

-- ── Productos ──
CREATE TABLE IF NOT EXISTS productos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio      DECIMAL(10,2) NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  categoriaId INT,
  imagen      VARCHAR(500),
  token       VARCHAR(100),
  FOREIGN KEY (categoriaId) REFERENCES categorias(id) ON DELETE SET NULL
);

-- ── Clientes ──
CREATE TABLE IF NOT EXISTS clientes (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  nombre   VARCHAR(100) NOT NULL,
  email    VARCHAR(100),
  telefono VARCHAR(50),
  userId   INT,
  token    VARCHAR(100),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Pedidos ──
CREATE TABLE IF NOT EXISTS pedidos (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  clienteId  INT,
  productoId INT,
  cantidad   INT NOT NULL,
  total      DECIMAL(10,2) NOT NULL,
  estado     ENUM('pendiente','confirmado','entregado') DEFAULT 'pendiente',
  fecha      DATE,
  token      VARCHAR(100),
  FOREIGN KEY (clienteId)  REFERENCES clientes(id)  ON DELETE SET NULL,
  FOREIGN KEY (productoId) REFERENCES productos(id) ON DELETE SET NULL
);

-- ── Pagos ──
CREATE TABLE IF NOT EXISTS pagos (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  pedidoId  INT,
  monto     DECIMAL(10,2) NOT NULL,
  metodo    ENUM('efectivo','tarjeta','transferencia') NOT NULL,
  fecha     DATE,
  token     VARCHAR(100),
  FOREIGN KEY (pedidoId) REFERENCES pedidos(id) ON DELETE SET NULL
);

-- ============================================================
--  DATOS INICIALES
-- ============================================================

-- Contraseñas: admin123 / vend123 / cli123
INSERT INTO users (nombre, email, password, role, token) VALUES
('Victoria López',  'admin@flores.com',    '$2a$10$QMwNmx95NG7a8Sh6quaxGeV5QaeahcWUjrZu2bQ/uEHNoGg7QXSGC', 'admin',    'tok-admin-001'),
('Carlos Mendoza',  'vendedor@flores.com', '$2a$10$FPVLfXIuT8T2SYMQixtAdeDqyfa5WRd6kjYvDH6CicJrWf5bSTIxq', 'vendedor', 'tok-vend-001'),
('María Quispe',    'cliente@flores.com',  '$2a$10$QW2T60qH3jFE0j0.YbrM9.vMO923bqlhXGGxHqajQKJmp6jAP2iYS', 'cliente',  'tok-cli-001');

-- ── Categorías ──
INSERT INTO categorias (nombre, descripcion, token) VALUES
('Tejidos a Mano',      'Flores tejidas a crochet 100% artesanal, la flor que nunca se marchita', 'cat-tok-001'),
('Arreglos Florales',   'Arreglos con flores artificiales y naturales de alta calidad',           'cat-tok-002'),
('Arreglos Decoración', 'Ramos y centros de mesa elegantes para eventos especiales',              'cat-tok-003'),
('Packs con Peluche',   'Combos únicos: flores artesanales + peluche, el regalo perfecto',       'cat-tok-004');

-- ── Productos reales de Atelier Flowers Victoria ──
-- Imágenes locales en /img/ (5 fotos del catálogo sin texto)
INSERT INTO productos (nombre, descripcion, precio, stock, categoriaId, imagen, token) VALUES

-- Tejidos a Mano (cat 1) → /img/crochet-flores.jpeg
('Tulipán Imperial Tejido', 'La flor que nunca muere. Tejida punto a punto con amor. Técnica crochet 100% manual, altura 30 cm aprox.',
 35.00, 25, 1, '/img/crochet-flores.jpeg', 'prod-tok-001'),

('Tulipán Sweet Pink',      'Color rosa pastel, ideal para amigas, madres o novias. Suave hilo algodón con envoltura individual.',
 35.00, 20, 1, '/img/crochet-flores.jpeg', 'prod-tok-002'),

('Girasol Radiante',        'Ilumina el día de alguien especial con este girasol eterno. Diámetro 15 cm, centro texturizado 3D.',
 45.00, 18, 1, '/img/crochet-flores.jpeg', 'prod-tok-003'),

('Ramo Trío Alegría',       'Pack ahorro de 3 tulipanes tejidos a mano. Colores a elección. Incluye lazo y papel decorativo.',
 95.00, 10, 1, '/img/crochet-flores.jpeg', 'prod-tok-004'),

-- Arreglos Florales (cat 2) → /img/arreglo-variado.jpeg y /img/ramo-rosas-rosado.jpeg
('Gerberas y Lirios',       'Arreglo voluminoso y frondoso, perfecto para regalar presencia. Estilo frondoso ancho con follaje hecho a mano.',
 80.00, 12, 2, '/img/arreglo-variado.jpeg', 'prod-tok-005'),

('Claveles Pom-Pom',        'Claveles esféricos muy tupidos, un detalle clásico y duradero. Pétalos densos bicolor rojo y blanco.',
 65.00, 15, 2, '/img/arreglo-variado.jpeg', 'prod-tok-006'),

('Botones Tricolor',        'Arreglo de rosas cerradas (botones), elegancia minimalista. Color bicolor rosa bicolor en maceta cuadrada moderna.',
 50.00, 20, 2, '/img/ramo-rosas-rosado.jpeg', 'prod-tok-007'),

('Pequeño Bicolor',         'El detalle perfecto para espacios pequeños, colorido y alegre. Flores: rosas rojas y margaritas con papel seda verde.',
 45.00, 22, 2, '/img/ramo-rosas-rosado.jpeg', 'prod-tok-008'),

-- Arreglos Decoración (cat 3) → /img/ramo-rosas-lila.jpeg y /img/arreglo-variado.jpeg
('Bouquet Silver Love You', 'Elegante ramo de mano envuelto en papel espejo con detalles dorados. Mix: girasol, rosas y mariposa metálica.',
 80.00, 8,  3, '/img/ramo-rosas-lila.jpeg', 'prod-tok-009'),

('Rosas Altas Elegantes',   'Arreglo de varas largas ideal para centros de mesa o quinceañeros. Flor pétalo rizado realista en maceta terracota.',
 70.00, 10, 3, '/img/arreglo-variado.jpeg', 'prod-tok-010'),

('Primavera Lila y Roja',   'Combinación vibrante de colores para iluminar cualquier espacio. Central margarita gigante blanca con rosas lilas y moradas.',
 75.00, 9,  3, '/img/ramo-rosas-lila.jpeg', 'prod-tok-011'),

-- Packs con Peluche (cat 4) → /img/peluches-vitrina.jpeg y /img/ramo-rosas-rosado.jpeg
('Pack Amor Clásico',       'El regalo que nunca falla. Rosas rojas y oso tierno. Incluye peluche oso con corazón 25 cm y tarjeta de dedicatoria.',
 125.00, 7, 4, '/img/ramo-rosas-rosado.jpeg', 'prod-tok-012'),

('Pack Marinero Blue',      'Rosas azules únicas, un regalo diferente y especial. Peluche oso marinero, papel tornasol brillante para cumpleaños.',
 135.00, 5, 4, '/img/peluches-vitrina.jpeg',  'prod-tok-013'),

('Pack Pink World',         'La máxima expresión de ternura en color rosa. Todo en rosa: flores + peluche oso grande 30 cm de apariencia natural.',
 125.00, 6, 4, '/img/ramo-rosas-lila.jpeg',   'prod-tok-014');

-- ── Clientes ──
INSERT INTO clientes (nombre, email, telefono, userId, token) VALUES
('Juan Pérez',    'juan@mail.com',   '70012345', 3,    'cli-tok-001'),
('Ana García',    'ana@mail.com',    '70023456', NULL, 'cli-tok-002'),
('Luis Ramírez',  'luis@mail.com',   '70034567', NULL, 'cli-tok-003'),
('Sofía Torres',  'sofia@mail.com',  '70045678', NULL, 'cli-tok-004');

-- ── Pedidos ──
INSERT INTO pedidos (clienteId, productoId, cantidad, total, estado, fecha, token) VALUES
(1, 1,  2,  70.00,  'entregado',  '2026-04-01', 'ped-tok-001'),
(2, 5,  1,  80.00,  'confirmado', '2026-04-02', 'ped-tok-002'),
(3, 12, 1,  125.00, 'pendiente',  '2026-04-03', 'ped-tok-003'),
(4, 9,  1,  80.00,  'entregado',  '2026-04-04', 'ped-tok-004'),
(1, 6,  2,  130.00, 'confirmado', '2026-04-05', 'ped-tok-005'),
(2, 13, 1,  135.00, 'pendiente',  '2026-04-06', 'ped-tok-006');

-- ── Pagos (pedidos entregados y confirmados) ──
INSERT INTO pagos (pedidoId, monto, metodo, fecha, token) VALUES
(1, 70.00,  'efectivo',      '2026-04-01', 'pag-tok-001'),
(2, 80.00,  'transferencia', '2026-04-02', 'pag-tok-002'),
(4, 80.00,  'tarjeta',       '2026-04-04', 'pag-tok-003'),
(5, 130.00, 'efectivo',      '2026-04-05', 'pag-tok-004');

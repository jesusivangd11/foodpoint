const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 4173;

// Hook opcional para reiniciar la app (lo provee Electron via start()).
// En modo headless (node server.js) queda null y se usa process.exit.
let onRestartRequested = null;

// --- Carpeta de datos (separada del codigo) ---
// Los datos NUNCA viven junto al codigo, para que actualizar el programa
// no pueda borrar la base de datos ni los respaldos.
// Prioridad: variable de entorno MESANA_DATA_DIR > %LOCALAPPDATA%\Mesana > la propia carpeta (ultimo recurso).
const DATA_DIR = process.env.MESANA_DATA_DIR
  || (process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Mesana') : __dirname);
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const DB_PATH = path.join(DATA_DIR, 'database.db');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const BACKUP_KEEP = 30;
const BACKUP_INTERVAL_MS = 60 * 60 * 1000;

// --- Migracion automatica desde la version vieja ---
// Si existe una base de datos antigua DENTRO de la carpeta del programa y aun
// no hay una en la carpeta de datos, la movemos. Asi no se pierde nada al
// actualizar por primera vez en la PC de trabajo.
(function migrateLegacyData() {
  if (DATA_DIR === __dirname) return; // nada que migrar si los datos ya viven aqui
  try {
    const legacyDb = path.join(__dirname, 'database.db');
    if (fs.existsSync(legacyDb) && !fs.existsSync(DB_PATH)) {
      fs.copyFileSync(legacyDb, DB_PATH);
      fs.renameSync(legacyDb, legacyDb + '.migrado'); // se conserva como respaldo, no se borra
      console.log('[migracion] database.db movida a', DB_PATH);
    }
    const legacyBackups = path.join(__dirname, 'backups');
    if (fs.existsSync(legacyBackups) && !fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
      for (const f of fs.readdirSync(legacyBackups)) {
        try { fs.copyFileSync(path.join(legacyBackups, f), path.join(BACKUP_DIR, f)); } catch (_) {}
      }
      console.log('[migracion] respaldos copiados a', BACKUP_DIR);
    }
  } catch (e) {
    console.error('[migracion] aviso:', e.message);
  }
})();

function backupDatabase() {
  if (!fs.existsSync(DB_PATH)) return null;
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}-${String(now.getMinutes()).padStart(2,'0')}-${String(now.getSeconds()).padStart(2,'0')}`;
  const target = path.join(BACKUP_DIR, `database-${stamp}.db`);
  fs.copyFileSync(DB_PATH, target);
  rotateBackups();
  console.log(`[backup] ${path.basename(target)}`);
  return target;
}

function rotateBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return;
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('database-') && f.endsWith('.db'))
    .map(f => ({ name: f, full: path.join(BACKUP_DIR, f), mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  for (const f of files.slice(BACKUP_KEEP)) {
    try { fs.unlinkSync(f.full); } catch (_) {}
  }
}

function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) return [];
  return fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('database-') && f.endsWith('.db'))
    .map(f => {
      const full = path.join(BACKUP_DIR, f);
      const stat = fs.statSync(full);
      return { name: f, mtime: stat.mtimeMs, size: stat.size };
    })
    .sort((a, b) => b.mtime - a.mtime);
}

// Middleware
app.use(cors());
// Las fotos de productos/combos y el logo viajan como data URL dentro del JSON.
// Con el limite por defecto (100kb) las fotos pesadas se rechazaban con 413 y la
// app lo ignoraba en silencio: se veian bien hasta reiniciar y luego desaparecian.
app.use(bodyParser.json({ limit: '25mb' }));

// Responder en JSON (no en HTML) cuando el cuerpo excede el limite, para que la
// app pueda mostrar un mensaje entendible en vez de fallar sin aviso.
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'La imagen es demasiado grande. Elige una foto mas ligera.' });
  }
  next(err);
});
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Si una escritura coincide con el respaldo horario (o con otra operacion), esperar
    // hasta 5s y reintentar en vez de fallar de inmediato con "database is locked".
    db.run('PRAGMA busy_timeout = 5000');
    createTables();
    try { backupDatabase(); } catch (e) { console.error('[backup] startup failed:', e.message); }
    setInterval(() => {
      try { backupDatabase(); } catch (e) { console.error('[backup] interval failed:', e.message); }
    }, BACKUP_INTERVAL_MS);
  }
});

// Create tables
function createTables() {
  db.serialize(() => {
    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      cat TEXT NOT NULL,
      price REAL NOT NULL,
      cost REAL NOT NULL,
      stock INTEGER NOT NULL,
      variants TEXT,
      image TEXT,
      imagePos TEXT,
      qtyByVariant INTEGER
    )`, () => {
      // Migraciones de columnas nuevas en tablas existentes
      db.all(`PRAGMA table_info(products)`, (err, columns) => {
        if (err || !columns) return;
        if (!columns.some(c => c.name === 'variants')) {
          db.run(`ALTER TABLE products ADD COLUMN variants TEXT`);
        }
        if (!columns.some(c => c.name === 'image')) {
          db.run(`ALTER TABLE products ADD COLUMN image TEXT`);
        }
        // Encuadre de la foto: que parte se ve en la tarjeta ("50% 30%").
        if (!columns.some(c => c.name === 'imagePos')) {
          db.run(`ALTER TABLE products ADD COLUMN imagePos TEXT`);
        }
        // 1 = este producto permite pedir varias variantes con su cantidad de
        // una sola pasada. Lo decide el usuario al dar de alta o editar.
        if (!columns.some(c => c.name === 'qtyByVariant')) {
          db.run(`ALTER TABLE products ADD COLUMN qtyByVariant INTEGER`);
        }
      });
    });

    // Categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      icon TEXT
    )`, () => {
      db.all(`PRAGMA table_info(categories)`, (err, columns) => {
        if (err || !columns) return;
        const seedIcons = () => {
          db.run(`UPDATE categories SET icon = 'steak' WHERE name = 'Platos Fuertes' AND (icon IS NULL OR icon = '')`);
          db.run(`UPDATE categories SET icon = 'drink' WHERE name = 'Bebidas' AND (icon IS NULL OR icon = '')`);
          db.run(`UPDATE categories SET icon = 'cake'  WHERE name = 'Postres' AND (icon IS NULL OR icon = '')`);
          db.run(`UPDATE categories SET icon = 'bowl'  WHERE name = 'Entradas' AND (icon IS NULL OR icon = '')`);
        };
        // Orden manual: cada categoria conserva una posicion (sort_order).
        // Se inicializa con el id (orden de creacion) para las filas que aun no lo tengan.
        const seedSort = () => {
          db.run(`UPDATE categories SET sort_order = id WHERE sort_order IS NULL`);
        };
        if (!columns.some(c => c.name === 'icon')) {
          db.run(`ALTER TABLE categories ADD COLUMN icon TEXT`, seedIcons);
        } else {
          seedIcons();
        }
        if (!columns.some(c => c.name === 'sort_order')) {
          db.run(`ALTER TABLE categories ADD COLUMN sort_order INTEGER`, seedSort);
        } else {
          seedSort();
        }
      });
    });

    // Combos table
    db.run(`CREATE TABLE IF NOT EXISTS combos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      items TEXT NOT NULL,
      icon TEXT,
      image TEXT,
      imagePos TEXT
    )`, () => {
      db.all(`PRAGMA table_info(combos)`, (err, columns) => {
        if (err || !columns) return;
        if (!columns.some(c => c.name === 'icon')) {
          db.run(`ALTER TABLE combos ADD COLUMN icon TEXT`);
        }
        if (!columns.some(c => c.name === 'image')) {
          db.run(`ALTER TABLE combos ADD COLUMN image TEXT`);
        }
        if (!columns.some(c => c.name === 'imagePos')) {
          db.run(`ALTER TABLE combos ADD COLUMN imagePos TEXT`);
        }
      });
    });

    // Orders (Comandas) table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticketNumber INTEGER NOT NULL,
      ticketDate TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      type TEXT NOT NULL,
      mesa TEXT,
      comensales INTEGER,
      notes TEXT,
      waiter TEXT,
      items TEXT NOT NULL
    )`);

    // Parked orders (tickets pausados) table
    db.run(`CREATE TABLE IF NOT EXISTS parked_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT,
      type TEXT,
      mesa TEXT,
      comensales INTEGER,
      notes TEXT,
      waiter TEXT,
      items TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )`);

    // Migrate parked_orders: nombre personalizado de la pestana (editable por el usuario)
    db.all("PRAGMA table_info(parked_orders)", [], (err, cols) => {
      if (err || !cols) return;
      const names = cols.map(c => c.name);
      if (!names.includes('customName')) db.run("ALTER TABLE parked_orders ADD COLUMN customName TEXT");
    });

    // Sales records table
    db.run(`CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticketNumber INTEGER NOT NULL,
      ticketDate TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      completedAt TEXT NOT NULL,
      type TEXT NOT NULL,
      mesa TEXT,
      comensales INTEGER,
      waiter TEXT,
      notes TEXT,
      paymentMethod TEXT,
      status TEXT,
      items TEXT NOT NULL,
      subtotal REAL,
      tax REAL,
      total REAL,
      cost REAL,
      payments TEXT,
      amountReceived REAL,
      change REAL
    )`);

    // Migrate sales table: add missing columns if they don't exist
    db.all("PRAGMA table_info(sales)", [], (err, cols) => {
      if (err || !cols) return;
      const names = cols.map(c => c.name);
      if (!names.includes('ticketNumber'))   db.run("ALTER TABLE sales ADD COLUMN ticketNumber INTEGER DEFAULT 0");
      if (!names.includes('ticketDate'))     db.run("ALTER TABLE sales ADD COLUMN ticketDate TEXT DEFAULT ''");
      if (!names.includes('payments'))       db.run("ALTER TABLE sales ADD COLUMN payments TEXT");
      if (!names.includes('amountReceived')) db.run("ALTER TABLE sales ADD COLUMN amountReceived REAL");
      if (!names.includes('change'))         db.run("ALTER TABLE sales ADD COLUMN change REAL");
    });

    // Movements/Logs table
    db.run(`CREATE TABLE IF NOT EXISTS movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      user TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      data TEXT
    )`);

    // Users/Employees table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      since TEXT NOT NULL,
      pass TEXT NOT NULL,
      isDefault INTEGER DEFAULT 0
    )`);

    // Settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      restaurantName TEXT,
      rfc TEXT,
      address TEXT,
      phone TEXT,
      logoDataUrl TEXT,
      ticketFooter TEXT,
      currency TEXT,
      kitchenPrinter TEXT,
      cashPrinter TEXT,
      theme TEXT,
      dailyOrderCounter INTEGER DEFAULT 0,
      lastOrderDate TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating settings table:', err);
      } else {
        // Check if columns exist, if not add them
        db.all(`PRAGMA table_info(settings)`, (err, columns) => {
          if (err) {
            console.error('Error getting table info:', err);
            return;
          }
          const columnNames = columns.map(col => col.name);
          let alters = 0;
          const checkDone = () => {
            alters--;
            if (alters === 0) {
              // Insert default settings if not exist
              db.run(`INSERT OR IGNORE INTO settings (id, restaurantName, rfc, address, phone, logoDataUrl, ticketFooter, currency, kitchenPrinter, cashPrinter, theme, dailyOrderCounter, lastOrderDate)
                       VALUES (1, 'Mesana', 'XAXX010101000', 'Av. Principal #100, Chihuahua, Chih.', '', '', 'Gracias por su preferencia', 'MXN - Peso Mexicano', '192.168.1.101:9100', '192.168.1.102:9100', 'theme-sage', 0, '')`);
            }
          };
          if (!columnNames.includes('dailyOrderCounter')) {
            alters++;
            db.run(`ALTER TABLE settings ADD COLUMN dailyOrderCounter INTEGER DEFAULT 0`, checkDone);
          }
          if (!columnNames.includes('lastOrderDate')) {
            alters++;
            db.run(`ALTER TABLE settings ADD COLUMN lastOrderDate TEXT`, checkDone);
          }
          if (alters === 0) {
            // Insert default settings if not exist
            db.run(`INSERT OR IGNORE INTO settings (id, restaurantName, rfc, address, phone, logoDataUrl, ticketFooter, currency, kitchenPrinter, cashPrinter, theme, dailyOrderCounter, lastOrderDate)
                     VALUES (1, 'Mesana', 'XAXX010101000', 'Av. Principal #100, Chihuahua, Chih.', '', '', 'Gracias por su preferencia', 'MXN - Peso Mexicano', '192.168.1.101:9100', '192.168.1.102:9100', 'theme-sage', 0, '')`);
          }
        });
      }
    });

    // Insert default categories if not exist
    db.run(`INSERT OR IGNORE INTO categories (name) VALUES ('Platos Fuertes')`);
    db.run(`INSERT OR IGNORE INTO categories (name) VALUES ('Bebidas')`);
    db.run(`INSERT OR IGNORE INTO categories (name) VALUES ('Postres')`);
    db.run(`INSERT OR IGNORE INTO categories (name) VALUES ('Entradas')`);

    // Insert default owner if not exist
    db.run(`INSERT OR IGNORE INTO users (name, email, role, status, since, pass, isDefault)
             VALUES ('Jesus Garcia', 'admin@mesana.mx', 'Propietario', 'Activo', '2024-01-01', 'admin123', 1)`);
  });
}

// API Routes

// Products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows.forEach(row => {
      try { row.variants = row.variants ? JSON.parse(row.variants) : []; }
      catch { row.variants = []; }
    });
    res.json(rows);
  });
});

app.post('/api/products', (req, res) => {
  const { name, cat, price, cost, stock, variants, image, imagePos, qtyByVariant } = req.body;
  const variantsJson = JSON.stringify(Array.isArray(variants) ? variants : []);
  db.run('INSERT INTO products (name, cat, price, cost, stock, variants, image, imagePos, qtyByVariant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, cat, price, cost, stock, variantsJson, image || null, imagePos || null, qtyByVariant ? 1 : 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Actualizacion PARCIAL: solo se tocan las columnas que vienen en la peticion.
// Antes se reescribia la fila completa, asi que una llamada que solo mandaba
// { stock } (editar o cancelar comanda, ajustes de inventario) dejaba en NULL el
// nombre, la categoria, el precio, el costo y la imagen, y borraba las variantes.
app.put('/api/products/:id', (req, res) => {
  const body = req.body || {};
  const fields = [];
  const values = [];
  const setIf = (key, transform) => {
    if (body[key] === undefined) return;
    fields.push(`${key} = ?`);
    values.push(transform ? transform(body[key]) : body[key]);
  };
  setIf('name');
  setIf('cat');
  setIf('price');
  setIf('cost');
  setIf('stock');
  setIf('variants', v => JSON.stringify(Array.isArray(v) ? v : []));
  setIf('image', v => v || null);
  setIf('imagePos', v => v || null);
  setIf('qtyByVariant', v => (v ? 1 : 0));
  if (!fields.length) return res.json({ changes: 0 });
  values.push(req.params.id);
  db.run(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows.forEach(row => {
      try { row.items = row.items ? JSON.parse(row.items) : []; }
      catch { row.items = []; }
    });
    res.json(rows);
  });
});

app.post('/api/orders', (req, res) => {
  const { ticketNumber, ticketDate, type, mesa, comensales, notes, waiter, items } = req.body;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  db.run('INSERT INTO orders (ticketNumber, ticketDate, createdAt, updatedAt, type, mesa, comensales, notes, waiter, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [ticketNumber, ticketDate, createdAt, updatedAt, type, mesa, comensales, notes, waiter, JSON.stringify(items)], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ticketNumber, ticketDate });
  });
});

app.put('/api/orders/:id', (req, res) => {
  const { ticketNumber, ticketDate, type, mesa, comensales, notes, waiter, items } = req.body;
  const updatedAt = new Date().toISOString();
  db.run('UPDATE orders SET ticketNumber = ?, ticketDate = ?, updatedAt = ?, type = ?, mesa = ?, comensales = ?, notes = ?, waiter = ?, items = ? WHERE id = ?',
    [ticketNumber, ticketDate, updatedAt, type, mesa, comensales, notes, waiter, JSON.stringify(items), req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.delete('/api/orders/:id', (req, res) => {
  db.run('DELETE FROM orders WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Parked orders (tickets pausados)
app.get('/api/parked', (req, res) => {
  db.all('SELECT * FROM parked_orders', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows.forEach(row => {
      try { row.items = row.items ? JSON.parse(row.items) : []; }
      catch { row.items = []; }
    });
    res.json(rows);
  });
});

app.post('/api/parked', (req, res) => {
  const { label, customName, type, mesa, comensales, notes, waiter, items } = req.body;
  const createdAt = new Date().toISOString();
  db.run('INSERT INTO parked_orders (label, customName, type, mesa, comensales, notes, waiter, items, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [label, customName || null, type, mesa, comensales, notes, waiter, JSON.stringify(items), createdAt], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, createdAt });
  });
});

// Actualiza un ticket abierto: renombrar (customName) o guardar sus cambios (items, mesa, etc.)
app.put('/api/parked/:id', (req, res) => {
  const { label, customName, type, mesa, comensales, notes, waiter, items } = req.body;
  db.run(
    'UPDATE parked_orders SET label = ?, customName = ?, type = ?, mesa = ?, comensales = ?, notes = ?, waiter = ?, items = ? WHERE id = ?',
    [label, customName || null, type, mesa, comensales, notes, waiter, JSON.stringify(items || []), req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

app.delete('/api/parked/:id', (req, res) => {
  db.run('DELETE FROM parked_orders WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Sales
app.get('/api/sales', (req, res) => {
  db.all('SELECT * FROM sales', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows.forEach(row => {
      try { row.items = row.items ? JSON.parse(row.items) : []; }
      catch { row.items = []; }
      try { row.payments = row.payments ? JSON.parse(row.payments) : []; }
      catch { row.payments = []; }
    });
    res.json(rows);
  });
});

app.post('/api/sales', (req, res) => {
  const { ticketNumber, ticketDate, type, mesa, comensales, waiter, notes, paymentMethod, status, items, subtotal, tax, total, cost, payments, amountReceived, change } = req.body;
  const createdAt = new Date().toISOString();
  const completedAt = createdAt;
  const paymentsJson = JSON.stringify(Array.isArray(payments) ? payments : []);
  db.run('INSERT INTO sales (ticketNumber, ticketDate, createdAt, completedAt, type, mesa, comensales, waiter, notes, paymentMethod, status, items, subtotal, tax, total, cost, payments, amountReceived, change) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [ticketNumber, ticketDate, createdAt, completedAt, type, mesa, comensales, waiter, notes, paymentMethod, status, JSON.stringify(items), subtotal, tax, total, cost, paymentsJson, amountReceived ?? null, change ?? null], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ticketNumber, ticketDate });
  });
});

// Cancelar una venta: NO se borra, se marca como cancelada y queda el registro.
app.put('/api/sales/:id/cancelar', (req, res) => {
  db.get('SELECT * FROM sales WHERE id = ?', [req.params.id], (err, sale) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!sale) return res.status(404).json({ error: 'La venta no existe' });
    if (sale.status === 'Cancelado') return res.json({ changes: 0, yaCancelada: true });

    db.run('UPDATE sales SET status = ? WHERE id = ?', ['Cancelado', req.params.id], function(err2) {
      if (err2) return res.status(500).json({ error: err2.message });
      const log = {
        type: 'cancel_sale',
        description: `Cancelación de venta #${sale.ticketNumber} por $${Number(sale.total || 0).toFixed(2)}`
          + (req.body && req.body.reason ? ` (${req.body.reason})` : ''),
        user: (req.body && req.body.user) || 'Sistema',
        timestamp: new Date().toISOString(),
        data: JSON.stringify(sale),
      };
      db.run('INSERT INTO movements (type, description, user, timestamp, data) VALUES (?, ?, ?, ?, ?)',
        [log.type, log.description, log.user, log.timestamp, log.data], (e) => {
          if (e) console.error('Error logging movement:', e);
        });
      res.json({ changes: this.changes });
    });
  });
});

// Borrar ventas queda deshabilitado a proposito: el historial no se toca, para que
// no se pueda desaparecer una venta. Lo unico permitido es cancelarla (arriba).
app.delete('/api/sales/:id', (req, res) => {
  res.status(405).json({ error: 'Las ventas no se eliminan, solo se cancelan.' });
});

// Categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY COALESCE(sort_order, 999999), name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/categories', (req, res) => {
  const { name, icon } = req.body;
  // Nueva categoria se agrega al final del orden actual.
  db.get('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM categories', [], (e, row) => {
    const next = row ? row.next : 1;
    db.run('INSERT INTO categories (name, icon, sort_order) VALUES (?, ?, ?)', [name, icon || null, next], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
  });
});

// Guardar el orden manual de las categorias (debe ir antes de la ruta /:id).
app.put('/api/categories/reorder', (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order debe ser un arreglo de ids' });
  db.serialize(() => {
    const stmt = db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?');
    order.forEach((id, i) => stmt.run(i + 1, id));
    stmt.finalize(err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ok: true });
    });
  });
});

app.put('/api/categories/:id', (req, res) => {
  const { name, icon } = req.body;
  db.run('UPDATE categories SET name = ?, icon = ? WHERE id = ?', [name, icon || null, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.delete('/api/categories/:id', (req, res) => {
  db.run('DELETE FROM categories WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Combos
app.get('/api/combos', (req, res) => {
  db.all('SELECT * FROM combos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    rows.forEach(row => row.items = JSON.parse(row.items));
    res.json(rows);
  });
});

app.post('/api/combos', (req, res) => {
  const { name, price, description, items, icon, image, imagePos } = req.body;
  db.run('INSERT INTO combos (name, price, description, items, icon, image, imagePos) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, price, description, JSON.stringify(items), icon || null, image || null, imagePos || null], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Parcial, por el mismo motivo que en productos: nunca borrar lo que no se mando.
app.put('/api/combos/:id', (req, res) => {
  const body = req.body || {};
  const fields = [];
  const values = [];
  const setIf = (key, transform) => {
    if (body[key] === undefined) return;
    fields.push(`${key} = ?`);
    values.push(transform ? transform(body[key]) : body[key]);
  };
  setIf('name');
  setIf('price');
  setIf('description');
  setIf('items', v => JSON.stringify(v || []));
  setIf('icon', v => v || null);
  setIf('image', v => v || null);
  setIf('imagePos', v => v || null);
  if (!fields.length) return res.json({ changes: 0 });
  values.push(req.params.id);
  db.run(`UPDATE combos SET ${fields.join(', ')} WHERE id = ?`, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.delete('/api/combos/:id', (req, res) => {
  db.run('DELETE FROM combos WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Movements
app.get('/api/movements', (req, res) => {
  db.all('SELECT * FROM movements ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/movements', (req, res) => {
  const { type, description, user, timestamp, data } = req.body;
  db.run('INSERT INTO movements (type, description, user, timestamp, data) VALUES (?, ?, ?, ?, ?)',
    [type, description, user, timestamp, data], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

// Users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, role, status, since, pass, isDefault } = req.body;
  db.run('INSERT INTO users (name, email, role, status, since, pass, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, email, role, status, since, pass, isDefault || 0], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.put('/api/users/:id', (req, res) => {
  const { name, email, role, status, since, pass, isDefault } = req.body;
  db.run('UPDATE users SET name = ?, email = ?, role = ?, status = ?, since = ?, pass = ?, isDefault = ? WHERE id = ?',
    [name, email, role, status, since, pass, isDefault || 0, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.delete('/api/users/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Settings
app.get('/api/settings', (req, res) => {
  db.get('SELECT * FROM settings WHERE id = 1', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

app.put('/api/settings', (req, res) => {
  const { restaurantName, rfc, address, phone, logoDataUrl, ticketFooter, currency, kitchenPrinter, cashPrinter, theme } = req.body;
  db.run('UPDATE settings SET restaurantName = ?, rfc = ?, address = ?, phone = ?, logoDataUrl = ?, ticketFooter = ?, currency = ?, kitchenPrinter = ?, cashPrinter = ?, theme = ? WHERE id = 1',
    [restaurantName, rfc, address, phone, logoDataUrl, ticketFooter, currency, kitchenPrinter, cashPrinter, theme], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Auth endpoint (simple)
app.post('/api/login', (req, res) => {
  const { email, pass } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND pass = ?', [email, pass], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      res.json({ success: true, user: row });
    } else {
      res.json({ success: false });
    }
  });
});

// Backups
app.get('/api/backups', (req, res) => {
  res.json(listBackups());
});

app.post('/api/backups/now', (req, res) => {
  try {
    const file = backupDatabase();
    if (!file) return res.status(500).json({ error: 'No existe database.db' });
    res.json({ success: true, name: path.basename(file) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/backups/restore', (req, res) => {
  const { name } = req.body || {};
  if (!name || !/^database-[\w\-]+\.db$/.test(name)) {
    return res.status(400).json({ error: 'Nombre de respaldo invalido' });
  }
  const source = path.join(BACKUP_DIR, name);
  if (!fs.existsSync(source)) return res.status(404).json({ error: 'Respaldo no encontrado' });
  try {
    backupDatabase();
    db.close((err) => {
      if (err) console.error('[restore] close error:', err.message);
      try {
        fs.copyFileSync(source, DB_PATH);
      } catch (e) {
        return res.status(500).json({ error: 'Error al copiar: ' + e.message });
      }
      res.json({ success: true, restarting: true });
      setTimeout(() => {
        if (onRestartRequested) onRestartRequested();
        else process.exit(0);
      }, 300);
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function start(options = {}) {
  if (options.onRestartRequested) onRestartRequested = options.onRestartRequested;
  return new Promise((resolve, reject) => {
    const server = app.listen(port, '127.0.0.1', () => {
      console.log(`Server running on http://127.0.0.1:${port}`);
      resolve(server);
    });
    server.on('error', reject);
  });
}

// Si se ejecuta directamente (node server.js) arranca en modo headless.
if (require.main === module) {
  start().catch((e) => {
    console.error('No se pudo iniciar el servidor:', e.message);
    process.exit(1);
  });
}

module.exports = { start };
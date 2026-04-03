import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const dbPath = path.join(process.cwd(), 'khata.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');
const JWT_SECRET = process.env.JWT_SECRET || 'khata-secret-key';

// Initialize Database
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      shop_name TEXT,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'active',
      trial_ends_at DATETIME,
      subscription_status TEXT DEFAULT 'trial',
      subscription_ends_at DATETIME,
      photo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      transaction_id TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Add columns if they don't exist (for existing databases)
  try { db.exec("ALTER TABLE users ADD COLUMN trial_ends_at DATETIME;"); } catch(e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN subscription_status TEXT DEFAULT 'trial';"); } catch(e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN subscription_ends_at DATETIME;"); } catch(e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN photo_url TEXT;"); } catch(e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';"); } catch(e) {}
  try { db.exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';"); } catch(e) {}

  db.exec(`
    INSERT OR IGNORE INTO users (id, name, phone, password, shop_name, role, trial_ends_at, subscription_status) 
    VALUES (1, 'Admin', 'admin', 'admin123', 'System Admin', 'admin', datetime('now', '+99 years'), 'active');

    INSERT OR IGNORE INTO users (id, name, phone, password, shop_name, role, trial_ends_at, subscription_status) 
    VALUES (2, 'Shopkeeper', '0000000000', 'password', 'My Notebook Store', 'user', datetime('now', '+3 days'), 'trial');
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      total_due REAL DEFAULT 0,
      total_paid REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT CHECK(type IN ('credit', 'debit')) NOT NULL,
      note TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      reminder_date DATETIME NOT NULL,
      message TEXT,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (customer_id) REFERENCES customers (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
  const test = db.prepare('SELECT 1 as connected').get();
  console.log(`Database initialized at ${dbPath}. Connection test:`, test);
} catch (error: any) {
  console.error('Database Initialization Error:', error);
}

const app = express();
app.use(express.json());
app.use(cors());

// Simplified Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (token === 'dummy-token') {
    // Keep dummy token for demo purposes if needed, but map to a real user
    req.user = { id: 2, name: 'Shopkeeper', role: 'user' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Subscription Check Middleware
const checkSubscription = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'admin') return next();

  try {
    const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    const trialEnds = new Date(user.trial_ends_at);
    const subEnds = user.subscription_ends_at ? new Date(user.subscription_ends_at) : null;

    if (user.subscription_status === 'active' && subEnds && subEnds > now) {
      return next();
    }

    if (trialEnds > now) {
      return next();
    }

    return res.status(402).json({ 
      error: 'Subscription required', 
      status: 'expired',
      trial_ended: trialEnds < now
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// --- Auth Routes ---
app.post('/api/auth/register', (req, res) => {
  const { name, phone, password, shopName } = req.body;
  try {
    // New users get 3 days free trial
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 3);
    
    const result = db.prepare(`
      INSERT INTO users (name, phone, password, shop_name, trial_ends_at, subscription_status) 
      VALUES (?, ?, ?, ?, ?, 'trial')
    `).run(name, phone, password, shopName, trialEndsAt.toISOString());
    
    const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, shop_name: user.shop_name, role: user.role } });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body;
  
  try {
    const user: any = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ error: 'Account deactivated' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        shop_name: user.shop_name, 
        role: user.role,
        subscription_status: user.subscription_status,
        trial_ends_at: user.trial_ends_at
      } 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Profile Routes ---
app.get('/api/profile', authenticateToken, (req: any, res) => {
  try {
    const user: any = db.prepare('SELECT id, name, phone, shop_name, photo_url, role FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/profile/update', authenticateToken, (req: any, res) => {
  const { name, shop_name, photo_url } = req.body;
  try {
    db.prepare('UPDATE users SET name = ?, shop_name = ?, photo_url = ? WHERE id = ?')
      .run(name, shop_name, photo_url, req.user.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Subscription & Payment Routes ---
app.get('/api/subscription/status', authenticateToken, (req: any, res) => {
  try {
    const user: any = db.prepare('SELECT trial_ends_at, subscription_status, subscription_ends_at FROM users WHERE id = ?').get(req.user.id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/subscription/pay', authenticateToken, (req: any, res) => {
  const { amount, method, transactionId } = req.body;
  
  if (amount !== 300) {
    return res.status(400).json({ error: 'Invalid amount. Subscription cost is 300 Taka.' });
  }

  try {
    // In a real app, verify the transactionId with bKash/Nagad API here.
    
    db.transaction(() => {
      // Record payment
      db.prepare(`
        INSERT INTO payments (user_id, amount, method, transaction_id, status)
        VALUES (?, ?, ?, ?, 'completed')
      `).run(req.user.id, amount, method, transactionId);

      // Update user subscription
      const subEndsAt = new Date();
      subEndsAt.setDate(subEndsAt.getDate() + 30); // 30 days subscription

      db.prepare(`
        UPDATE users 
        SET subscription_status = 'active', subscription_ends_at = ?
        WHERE id = ?
      `).run(subEndsAt.toISOString(), req.user.id);
    })();

    res.json({ success: true, message: 'Subscription activated for 30 days' });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Transaction ID already used' });
    }
    res.status(500).json({ error: error.message });
  }
});

// --- Customer Routes ---
app.get('/api/customers', authenticateToken, checkSubscription, (req: any, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers WHERE user_id = ? ORDER BY name ASC').all(req.user.id);
    res.json(customers);
  } catch (error: any) {
    console.error('Fetch Customers Error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.post('/api/customers', authenticateToken, checkSubscription, (req: any, res) => {
  try {
    const { name, phone, address } = req.body;
    console.log('Adding customer for user:', req.user.id, { name, phone, address });
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const result = db.prepare('INSERT INTO customers (user_id, name, phone, address) VALUES (?, ?, ?, ?)').run(req.user.id, name, phone, address);
    console.log('Customer added with ID:', result.lastInsertRowid);
    res.json({ id: Number(result.lastInsertRowid) });
  } catch (error: any) {
    console.error('Add Customer Error:', error);
    res.status(400).json({ error: error.message || 'Failed to add customer' });
  }
});

app.get('/api/customers/:id', authenticateToken, checkSubscription, (req: any, res) => {
  try {
    const customer = db.prepare('SELECT * FROM customers WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error: any) {
    console.error('Fetch Customer Error:', error);
    res.status(500).json({ error: 'Failed to fetch customer details' });
  }
});

// --- Transaction Routes ---
app.get('/api/transactions/all', authenticateToken, checkSubscription, (req: any, res) => {
  try {
    const transactions = db.prepare(`
      SELECT t.*, c.name as customer_name 
      FROM transactions t 
      JOIN customers c ON t.customer_id = c.id 
      WHERE t.user_id = ? 
      ORDER BY t.date DESC 
      LIMIT 100
    `).all(req.user.id);
    res.json(transactions);
  } catch (error: any) {
    console.error('Fetch All Transactions Error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.get('/api/transactions/:customerId', authenticateToken, checkSubscription, (req: any, res) => {
  try {
    const transactions = db.prepare('SELECT * FROM transactions WHERE customer_id = ? AND user_id = ? ORDER BY date DESC').all(req.params.customerId, req.user.id);
    res.json(transactions);
  } catch (error: any) {
    console.error('Fetch Transactions Error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.post('/api/transactions', authenticateToken, checkSubscription, (req: any, res) => {
  const { customer_id, amount, type, note, date } = req.body;
  const userId = req.user.id;

  const transaction = db.transaction(() => {
    // Insert transaction
    db.prepare('INSERT INTO transactions (customer_id, user_id, amount, type, note, date) VALUES (?, ?, ?, ?, ?, ?)').run(customer_id, userId, amount, type, note, date || new Date().toISOString());

    // Update customer totals
    if (type === 'credit') {
      db.prepare('UPDATE customers SET total_due = total_due + ? WHERE id = ?').run(amount, customer_id);
    } else {
      db.prepare('UPDATE customers SET total_paid = total_paid + ?, total_due = total_due - ? WHERE id = ?').run(amount, amount, customer_id);
    }
  });

  try {
    transaction();
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// --- Dashboard Stats ---
app.get('/api/dashboard/stats', authenticateToken, (req: any, res) => {
  try {
    const userId = req.user.id;
    
    const customerStats: any = db.prepare('SELECT COUNT(*) as total_customers, IFNULL(SUM(total_due), 0) as total_due FROM customers WHERE user_id = ?').get(userId);
    const transactionStats: any = db.prepare("SELECT IFNULL(SUM(amount), 0) as today_transactions FROM transactions WHERE user_id = ? AND date(date) = date('now')").get(userId);
    
    res.json({
      total_customers: customerStats.total_customers,
      total_due: customerStats.total_due,
      today_transactions: transactionStats.today_transactions
    });
  } catch (error: any) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ error: `Dashboard error: ${error.message}` });
  }
});

// Global Error Handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// --- Admin Routes ---
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

app.get('/api/admin/stats', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const stats = {
      total_users: (db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "user"').get() as any).count,
      total_customers: (db.prepare('SELECT COUNT(*) as count FROM customers').get() as any).count,
      total_transactions: (db.prepare('SELECT COUNT(*) as count FROM transactions').get() as any).count,
      total_due: (db.prepare('SELECT SUM(total_due) as sum FROM customers').get() as any).sum || 0,
      new_users_today: (db.prepare("SELECT COUNT(*) as count FROM users WHERE date(created_at) = date('now')").get() as any).count
    };
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/users', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const users = db.prepare(`
      SELECT u.id, u.name, u.phone, u.shop_name, u.status, u.created_at,
             (SELECT COUNT(*) FROM customers WHERE user_id = u.id) as customer_count,
             (SELECT SUM(total_due) FROM customers WHERE user_id = u.id) as total_due
      FROM users u
      WHERE u.role = 'user'
      ORDER BY u.created_at DESC
    `).all();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/users/:id/status', authenticateToken, isAdmin, (req: any, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/behavior', authenticateToken, isAdmin, (req: any, res) => {
  try {
    // Simple behavior tracking: Most active users by transaction count
    const behavior = db.prepare(`
      SELECT u.name, u.shop_name, COUNT(t.id) as tx_count
      FROM users u
      JOIN transactions t ON u.id = t.user_id
      GROUP BY u.id
      ORDER BY tx_count DESC
      LIMIT 10
    `).all();
    res.json(behavior);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Vite Middleware ---
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Koneksi ke MySQL XAMPP
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'greensort_db'
});

app.use(cors());
app.use(express.json());

// === HANDLE REGISTER ===
app.post('/register', async (req, res) => {
  const { name, email, phone, username, password, rePassword } = req.body;

  if (password !== rePassword) {
    return res.json({ success: false, message: 'Password tidak cocok!' });
  }

  const hashed = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, email, phone, username, password) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, username, hashed], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.json({ success: false, message: 'Email atau username sudah digunakan!' });
      }
      return res.status(500).json({ success: false, message: 'Gagal mendaftar' });
    }
    res.json({ success: true, message: 'Registrasi berhasil!' });
  });
});

// === HANDLE LOGIN ===
app.post('/login', (req, res) => {
  const { emailOrUsername, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? OR username = ?';
  db.query(sql, [emailOrUsername, emailOrUsername], async (err, results) => {
    if (err) return res.status(500).json({ success: false });

    if (results.length === 0) {
      return res.json({ success: false, message: 'User tidak ditemukan!' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: 'Password salah!' });
    }

    delete user.password;
    res.json({ success: true, message: 'Login berhasil!', user });
  });
});

app.listen(port, () => {
  console.log(`Server backend berjalan di http://localhost:${port}`);
});

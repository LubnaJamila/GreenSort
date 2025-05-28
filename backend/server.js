const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const banks = require('./data/bankList');

const app = express();
const port = 3000;

// Koneksi ke MySQL XAMPP
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "greensort_db",
});

// Cek koneksi database
db.connect((err) => {
  if (err) {
    console.error("❌ Gagal terkoneksi ke database:", err.message);
  } else {
    console.log("✅ Berhasil terkoneksi ke database MySQL");
  }
});

app.use(cors());
app.use(express.json());

app.get('/api/banks', (req, res) => {
  res.json(banks);
});
app.post('/api/rekening', (req, res) => {
  const { no_rek, nama_bank, nama_pemilik, id_user } = req.body;

  if (!no_rek || !nama_bank || !nama_pemilik || !id_user) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  const sql = `
    INSERT INTO rekening (no_rek, nama_bank, nama_pemilik, id_user)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [no_rek, nama_bank, nama_pemilik, id_user], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ success: false, message: 'Gagal menyimpan' });
    }
    res.json({ success: true, message: 'Rekening disimpan' });
  });
});
app.get('/api/rekening/:id_user', (req, res) => {
  const { id_user } = req.params;

  const sql = "SELECT * FROM rekening WHERE id_user = ?";
  db.query(sql, [id_user], (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Gagal mengambil data rekening" });
    }

    res.json({ success: true, data: results });
  });
});
app.delete('/api/rekening/:id', (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM rekening WHERE id_rekening = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete Error:", err);
      return res.status(500).json({ success: false, message: "Gagal menghapus rekening" });
    }
    res.json({ success: true, message: "Rekening dihapus" });
  });
});
app.post("/register", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { name, email, phone, username, password, rePassword } = req.body;

    if (!name || !email || !phone || !username || !password || !rePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Semua field wajib diisi!" });
    }

    if (password !== rePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password tidak cocok!" });
    }

    // Bisa tambahkan validasi panjang karakter jika perlu
    if (email.length > 100) {
      return res
        .status(400)
        .json({ success: false, message: "Email terlalu panjang!" });
    }
    if (username.length > 50) {
      return res
        .status(400)
        .json({ success: false, message: "Username terlalu panjang!" });
    }
    if (phone.length > 20) {
      return res
        .status(400)
        .json({ success: false, message: "Nomor telepon terlalu panjang!" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const sql = 
    "INSERT INTO users (nama_lengkap, email, no_hp, username, password, role) VALUES (?, ?, ?, ?, ?, ?)";


    db.query(
      sql,
      [name, email, phone, username, hashed, 'pengguna'],
      (err) => {
        if (err) {
          console.error("Database error:", err);

          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              success: false,
              message: "Email atau username sudah digunakan!",
            });
          }

          return res
            .status(500)
            .json({ success: false, message: "Gagal mendaftar" });
        }

        res.json({ success: true, message: "Registrasi berhasil!" });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
});

app.post("/login", (req, res) => {
  const { emailOrUsername, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(sql, [emailOrUsername, emailOrUsername], async (err, results) => {
    if (err) return res.status(500).json({ success: false });

    if (results.length === 0) {
      return res.json({ success: false, message: "User tidak ditemukan!" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Password salah!" });
    }

    delete user.password;
    res.json({ success: true, message: "Login berhasil!", user });
  });
});
app.get("/api/user/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT id_user, nama_lengkap, email, no_hp, username, role FROM users WHERE id_user = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Gagal mengambil data user" });

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    res.json({ success: true, user: results[0] });
  });
});
app.put("/api/user/:id_user", (req, res) => {
  const { id_user } = req.params;
  const { nama_lengkap, username, email, no_hp } = req.body;

  const sql = `
    UPDATE users
    SET nama_lengkap = ?, username = ?, email = ?, no_hp = ?
    WHERE id_user = ?
  `;

  db.query(sql, [nama_lengkap, username, email, no_hp, id_user], (err) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ success: false, message: "Gagal update profil" });
    }

    res.json({ success: true, message: "Profil berhasil diperbarui" });
  });
});
app.put("/api/user/password/:id_user", async (req, res) => {
  const { id_user } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Ambil password lama dari DB
  db.query("SELECT password FROM users WHERE id_user = ?", [id_user], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Kesalahan server" });
    if (results.length === 0) return res.status(404).json({ success: false, message: "User tidak ditemukan" });

    const match = await bcrypt.compare(currentPassword, results[0].password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Password lama salah" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    db.query("UPDATE users SET password = ? WHERE id_user = ?", [hashed, id_user], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: "Gagal update password" });
      return res.json({ success: true, message: "Password berhasil diubah" });
    });
  });
});

app.listen(port, () => {
  console.log(`Server backend berjalan di http://localhost:${port}`);
});

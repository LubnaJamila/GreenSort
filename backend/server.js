const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const banks = require('./data/bankList');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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
app.put('/api/rekening/:id_rekening', (req, res) => {
  const { id_rekening } = req.params;
  const { no_rek, nama_bank, nama_pemilik } = req.body;

  if (!no_rek || !nama_bank || !nama_pemilik) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  const sql = `
    UPDATE rekening
    SET no_rek = ?, nama_bank = ?, nama_pemilik = ?
    WHERE id_rekening = ?
  `;

  db.query(sql, [no_rek, nama_bank, nama_pemilik, id_rekening], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Gagal mengupdate rekening" });
    }

    res.json({ success: true, message: "Rekening berhasil diperbarui" });
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

// Tambahkan endpoints ini ke server.js Anda

// POST - Insert alamat baru
app.post('/api/alamat', (req, res) => {
  const { 
    provinsi, 
    kabupaten, 
    kecamatan, 
    desa, 
    alamat_lengkap, 
    latitude, 
    longitude, 
    id_user,
  } = req.body;

  // Validasi data wajib
  if (!provinsi || !kabupaten || !kecamatan || !desa || !alamat_lengkap || !latitude || !longitude || !id_user) {
    return res.status(400).json({ 
      success: false, 
      message: 'Semua field alamat wajib diisi' 
    });
  }

  // Validasi koordinat
  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    return res.status(400).json({ 
      success: false, 
      message: 'Latitude tidak valid' 
    });
  }

  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    return res.status(400).json({ 
      success: false, 
      message: 'Longitude tidak valid' 
    });
  }

  // Cek apakah user ada
  const checkUserSql = "SELECT id_user FROM users WHERE id_user = ?";
  db.query(checkUserSql, [id_user], (err, userResults) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Gagal memverifikasi user' 
      });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan' 
      });
    }

    // Insert alamat
    const insertSql = `
      INSERT INTO alamat (
        provinsi, kabupaten, kecamatan, desa, alamat_lengkap, 
        latitude, longitude, id_user, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      provinsi, 
      kabupaten, 
      kecamatan, 
      desa, 
      alamat_lengkap,
      parseFloat(latitude), 
      parseFloat(longitude), 
      id_user
    ];

    db.query(insertSql, values, (err, result) => {
      if (err) {
        console.error('Error inserting alamat:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Gagal menyimpan alamat' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Alamat berhasil disimpan',
        id_alamat: result.insertId
      });
    });
  });
});

// GET - Ambil semua alamat user
app.get('/api/alamat/:id_user', (req, res) => {
  const { id_user } = req.params;

  const sql = `
    SELECT 
      id_alamat, 
      provinsi, 
      kabupaten, 
      kecamatan, 
      desa, 
      alamat_lengkap, 
      latitude, 
      longitude,
      created_at
    FROM alamat 
    WHERE id_user = ? 
    ORDER BY created_at DESC
  `;

  db.query(sql, [id_user], (err, results) => {
    if (err) {
      console.error("Error fetching alamat:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data alamat" 
      });
    }

    res.json({ 
      success: true, 
      data: results 
    });
  });
});

// DELETE - Hapus alamat berdasarkan id
app.delete('/api/alamat/:id_alamat', (req, res) => {
  const { id_alamat } = req.params;

  // Validasi ID alamat
  if (!id_alamat || isNaN(id_alamat)) {
    return res.status(400).json({ 
      success: false, 
      message: 'ID alamat tidak valid' 
    });
  }

  // Cek apakah alamat ada
  const checkSql = "SELECT id_alamat, id_user FROM alamat WHERE id_alamat = ?";
  db.query(checkSql, [id_alamat], (err, results) => {
    if (err) {
      console.error("Error checking alamat:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Gagal memverifikasi alamat" 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Alamat tidak ditemukan" 
      });
    }

    // Hapus alamat
    const deleteSql = "DELETE FROM alamat WHERE id_alamat = ?";
    db.query(deleteSql, [id_alamat], (err, result) => {
      if (err) {
        console.error("Error deleting alamat:", err);
        return res.status(500).json({ 
          success: false, 
          message: "Gagal menghapus alamat" 
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: "Alamat tidak ditemukan atau sudah dihapus" 
        });
      }

      res.json({ 
        success: true, 
        message: "Alamat berhasil dihapus" 
      });
    });
  });
});

// DELETE - Hapus alamat berdasarkan user (opsional - untuk menghapus semua alamat user)
app.delete('/api/alamat/user/:id_user', (req, res) => {
  const { id_user } = req.params;

  const sql = "DELETE FROM alamat WHERE id_user = ?";
  db.query(sql, [id_user], (err, result) => {
    if (err) {
      console.error("Error deleting user alamat:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Gagal menghapus alamat user" 
      });
    }

    res.json({ 
      success: true, 
      message: `${result.affectedRows} alamat berhasil dihapus`,
      deleted_count: result.affectedRows
    });
  });
});

const uploadDir = path.resolve(__dirname, "../src/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Folder uploads dibuat di ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${crypto
      .randomBytes(6)
      .toString("hex")}`;
    const uniqueName = `sampah-${uniqueSuffix}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Serve file statis dari folder uploads supaya bisa diakses via URL
app.use("/uploads", express.static(uploadDir));
// Pengajuan endpoint
app.post("/api/pengajuan", upload.single("gambar"), (req, res) => {
  const { user_id, kategori_sampah, berat } = req.body;
  const gambar_sampah = req.file ? `/uploads/${req.file.filename}` : null;

  if (!user_id || !kategori_sampah || !berat || !gambar_sampah) {
    return res.status(400).json({ success: false, message: "Data tidak lengkap" });
  }

  const sql = `INSERT INTO penjualan_sampah (user_id, gambar_sampah, jenis_sampah, berat, status)
               VALUES (?, ?, ?, ?, 'pengajuan')`;

  db.query(sql, [user_id, gambar_sampah, kategori_sampah, berat], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error" });
    res.json({ success: true, message: "Pengajuan berhasil", id_pengajuan: result.insertId });
  });
});

// Update endpoint di server.js untuk mengambil semua pengajuan berdasarkan user_id
// Ganti endpoint yang ada dengan yang ini:

app.get("/api/pengajuan/:user_id", (req, res) => {
  const { user_id } = req.params;
  
  // Validasi user_id
  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({ 
      success: false, 
      message: "User ID tidak valid" 
    });
  }

  // Query untuk mengambil semua pengajuan user dengan semua status
  const sql = `
    SELECT 
      id,
      user_id,
      gambar_sampah, 
      jenis_sampah, 
      berat, 
      status
    FROM penjualan_sampah 
    WHERE user_id = ? 
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching pengajuan:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Gagal mengambil data pengajuan" 
      });
    }

    // Format data untuk frontend
    const formattedResults = results.map(item => ({
      id: item.id_penjualan,
      user_id: item.user_id,
      gambar_sampah: item.gambar_sampah ? item.gambar_sampah.replace('/uploads/', '') : null,
      jenis_sampah: item.jenis_sampah,
      berat: parseFloat(item.berat),
      status: item.status,
    }));

    res.json({ 
      success: true, 
      data: formattedResults,
      count: formattedResults.length
    });
  });
});

// Tambahan: Endpoint untuk mengambil pengajuan berdasarkan status tertentu
app.get("/api/pengajuan/:user_id/status/:status", (req, res) => {
  const { user_id, status } = req.params;

  if (!user_id || isNaN(user_id)) {
    return res.status(400).json({
      success: false,
      message: "User ID tidak valid",
    });
  }

  const sql = `
    SELECT 
      id,
      user_id,
      gambar_sampah, 
      jenis_sampah, 
      berat, 
      harga_tawaran,
      status
    FROM penjualan_sampah 
    WHERE user_id = ? AND status = ?
  `;

  db.query(sql, [user_id, status], (err, results) => {
    if (err) {
      console.error("Error fetching pengajuan by status:", err);
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data pengajuan",
      });
    }

    const formattedResults = results.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      gambar_sampah: item.gambar_sampah
        ? item.gambar_sampah.replace("/uploads/", "")
        : null,
      jenis_sampah: item.jenis_sampah,
      berat: parseFloat(item.berat),
      harga_tawaran:
        item.harga_tawaran !== null ? parseFloat(item.harga_tawaran) : null,
      status: item.status,
    }));

    res.json({
      success: true,
      data: formattedResults,
      count: formattedResults.length,
      status: status,
    });
  });
});
app.get('/api/penjualan-sampah', (req, res) => {
  const sql = `
    SELECT 
      id,
      jenis_sampah,
      berat,
      status,
      harga_tawaran,
      created_at
    FROM penjualan_sampah
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: "Gagal ambil data penjualan" });
    }

    res.json({ success: true, data: results });
  });
});
app.get("/api/pengajuan/status/:status", (req, res) => {
  const { status } = req.params;

  const sql = `
    SELECT 
      ps.id AS id,
      ps.user_id,
      ps.jenis_sampah,
      ps.berat,
      ps.status,
      ps.gambar_sampah,
      u.nama_lengkap AS name,
      u.no_hp AS phone
    FROM penjualan_sampah ps
    JOIN users u ON ps.user_id = u.id_user
    WHERE ps.status = ?
    ORDER BY ps.created_at DESC
  `;

  db.query(sql, [status], (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ success: false, message: "Gagal ambil data" });
    }

    const formatted = results.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      category: row.jenis_sampah,
      weight: parseFloat(row.berat),
      image: row.gambar_sampah || null,
      status: row.status
    }));

    res.json({ success: true, data: formatted });
  });
});
app.get("/api/pengajuan/id/:id", (req, res) => {
  const { id } = req.params;

    const sql = `
    SELECT 
      ps.id AS id,
      ps.user_id,
      ps.jenis_sampah,
      ps.berat,
      ps.harga_tawaran,
      ps.total,
      ps.opsi_pengiriman,
      ps.status,
      ps.gambar_sampah,
      u.nama_lengkap AS name,
      u.no_hp AS phone
    FROM penjualan_sampah ps
    JOIN users u ON ps.user_id = u.id_user
    WHERE ps.id = ?
    LIMIT 1
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ success: false, message: "Gagal mengambil data pengajuan" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
    }

    const row = results[0];

    res.json({
      success: true,
      data: {
        id: row.id,
        user_id: row.user_id,
        name: row.name,
        phone: row.phone,
        category: row.jenis_sampah,
        weight: parseFloat(row.berat),
        price: row.harga_tawaran ? parseFloat(row.harga_tawaran) : 0,
        image: row.gambar_sampah || null,
        metode: row.opsi_pengiriman || "dijemput",
        totalBayar: row.total ? parseFloat(row.total) : 0
      }
    });
  });
});
app.put('/api/pengajuan/terima/:id', (req, res) => {
  const id = req.params.id;
  const { alamat_id, harga_per_kg} = req.body;

  if (!alamat_id || !harga_per_kg ) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  const sql = `
    UPDATE penjualan_sampah 
    SET status = 'pengajuan diterima',
        alamat_admin_id = ?,        
        harga_tawaran = ?,                       
        updated_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [alamat_id, harga_per_kg, id], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ success: false, message: 'Gagal update pengajuan' });
    }

    res.json({ success: true, message: 'Pengajuan berhasil diterima' });
  });
});
app.put('/api/pengajuan/tolak/:id', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason || reason.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'Alasan penolakan wajib diisi (min 10 karakter)' });
  }

  const sql = `
    UPDATE penjualan_sampah 
    SET status = 'pengajuan ditolak', alasan_penolakan = ?, updated_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [reason.trim(), id], (err, result) => {
    if (err) {
      console.error('DB Error (penolakan):', err);
      return res.status(500).json({ success: false, message: 'Gagal menolak pengajuan' });
    }

    res.json({ success: true, message: 'Pengajuan berhasil ditolak' });
  });
});
app.get("/api/penawaran/status/semua", (req, res) => {
  const sql = `
    SELECT 
      ps.id,
      ps.jenis_sampah,
      ps.berat,
      ps.harga_tawaran,
      ps.total,
      ps.status,
      u.nama_lengkap AS name
    FROM penjualan_sampah ps
    JOIN users u ON ps.user_id = u.id_user
    WHERE ps.status IN ('penawaran ditolak')
    ORDER BY ps.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ DB Error (penawaran):", err);
      return res.status(500).json({ success: false, message: "Gagal mengambil data penawaran" });
    }

    const data = results.map(row => ({
      id: row.id,
      nama: row.name,
      jenisSampah: row.jenis_sampah,
      berat: parseFloat(row.berat),
      harga: parseFloat(row.harga_tawaran),
      total: parseFloat(row.total),
      status: row.status 
    }));

    res.json({ success: true, data });
  });
});
// GET detail pengajuan berdasarkan ID
app.get("/api/pengajuan/detail/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      ps.id,
      ps.user_id,
      u.nama_lengkap,
      u.no_hp,
      ps.gambar_sampah,
      ps.jenis_sampah,
      ps.berat,
      ps.harga_tawaran,
      ps.status
    FROM penjualan_sampah ps
    JOIN users u ON ps.user_id = u.id_user
    WHERE ps.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error:", err);
      return res.status(500).json({ success: false, message: "Gagal mengambil data" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    res.json({ success: true, data: results[0] });
  });
});
app.get("/api/admin/alamat", (req, res) => {
  const sql = `
    SELECT a.id_alamat AS id, a.alamat_lengkap AS alamat, a.latitude, a.longitude, u.nama_lengkap AS nama
    FROM alamat a
    JOIN users u ON a.id_user = u.id_user
    WHERE u.role = 'admin'
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal ambil alamat admin:", err);
      return res.status(500).json({ success: false, message: "Gagal mengambil data alamat admin" });
    }

    res.json({ success: true, data: results });
  });
});

app.put("/api/pengajuan/mengantar/:id", (req, res) => {
  const { id } = req.params;
  const { rekening_id, total, tanggal_awal, tanggal_akhir } =
    req.body;

  // Validasi input
  if (!rekening_id || !total || !tanggal_awal || !tanggal_akhir) {
    return res.status(400).json({
      success: false,
      message:
        "Semua data (rekening, total harga, estimasi tanggal) wajib diisi",
    });
  }

  const sql = `
    UPDATE penjualan_sampah
    SET 
      rekening_id = ?, 
      total = ?, 
      tanggal_awal = ?, 
      tanggal_akhir = ?, 
      opsi_pengiriman = 'antar sendiri',
      status = 'penawaran diterima',
      updated_at = NOW()
    WHERE id= ?
  `;

  db.query(
    sql,
    [rekening_id, total, tanggal_awal, tanggal_akhir, id],
    (err, result) => {
      if (err) {
        console.error("DB Error (mengantar):", err);
        return res
          .status(500)
          .json({
            success: false,
            message: "Gagal menyimpan data pengantaran",
          });
      }

      res.json({
        success: true,
        message: "Data pengantaran berhasil disimpan",
      });
    }
  );
});

app.put("/api/pengajuan/dijemput/:id", (req, res) => {
  const { id } = req.params;
  const {
    rekening_id,
    alamat_user_id,
    total,
    ongkir,
    jarak_estimasi_km,
    tanggal_awal,
    tanggal_akhir,
  } = req.body;

  // Validasi input
  if (
    !rekening_id ||
    !alamat_user_id ||
    !total ||
    !ongkir ||
    !jarak_estimasi_km ||
    !tanggal_awal ||
    !tanggal_akhir
  ) {
    return res.status(400).json({
      success: false,
      message: "Semua data wajib diisi untuk pengiriman dijemput",
    });
  }

  const sql = `
    UPDATE penjualan_sampah
    SET
      rekening_id = ?,
      alamat_user_id = ?,
      total = ?,
      ongkir = ?,
      jarak_estimasi_km = ?,
      tanggal_awal = ?,
      tanggal_akhir = ?,
      opsi_pengiriman = 'dijemput',
      status = 'penawaran diterima',
      updated_at = NOW()
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      rekening_id,
      alamat_user_id,
      total,
      ongkir,
      jarak_estimasi_km,
      tanggal_awal,
      tanggal_akhir,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("DB Error (dijemput):", err);
        return res.status(500).json({
          success: false,
          message: "Gagal menyimpan data penjemputan",
        });
      }

      res.json({
        success: true,
        message: "Data penjemputan berhasil disimpan",
      });
    }
  );
});

app.put("/api/penawaran/tolak/:id", (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE penjualan_sampah
    SET status = 'penawaran ditolak', updated_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("DB Error (tolak penawaran):", err);
      return res
        .status(500)
        .json({ success: false, message: "Gagal menolak penawaran" });
    }

    res.json({ success: true, message: "Penawaran berhasil ditolak" });
  });
});

app.get("/api/pengiriman/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT 
      ps.id,
      ps.gambar_sampah,
      ps.jenis_sampah,
      ps.berat,
      ps.harga_tawaran,
      ps.jarak_estimasi_km AS jarak,
      ps.ongkir,
      ps.total,
      ps.tanggal_awal,
      ps.tanggal_akhir,
      ps.opsi_pengiriman,
      ps.status,
      aa.alamat_lengkap AS alamat_admin
    FROM penjualan_sampah ps
    LEFT JOIN alamat aa ON ps.alamat_admin_id = aa.id_alamat
    WHERE ps.user_id = ? AND ps.status = 'penawaran diterima'
    ORDER BY ps.updated_at DESC
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching pengiriman:", err);
      return res
        .status(500)
        .json({ success: false, message: "Gagal mengambil data pengiriman" });
    }

    res.json({ success: true, data: results });
  });
});
app.get("/api/penjualan/selesai/tabel", (req, res) => {
  const sql = `
    SELECT 
      ps.id,
      u.nama_lengkap AS nama,
      ps.jenis_sampah,
      ps.berat,
      ps.harga_tawaran AS harga,
      ps.total,
      ps.gambar_sampah
    FROM penjualan_sampah ps
    JOIN users u ON ps.user_id = u.id_user
    WHERE ps.status = 'selesai'
    ORDER BY ps.updated_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ DB Error (tabel selesai):", err);
      return res.status(500).json({ success: false, message: "Gagal ambil data selesai" });
    }

    const data = results.map((item) => ({
      id: item.id,
      nama: item.nama,
      jenisSampah: item.jenis_sampah,
      berat: `${item.berat} kg`,
      harga: `Rp ${parseFloat(item.harga).toLocaleString()}`,
      totalHarga: `Rp ${parseFloat(item.total).toLocaleString()}`,
      gambarSampah: item.gambar_sampah 
        ? (item.gambar_sampah.startsWith('/uploads/') 
            ? item.gambar_sampah 
            : '/uploads/' + item.gambar_sampah)
        : null,
    }));

    res.json({ success: true, data });
  });
});
app.get("/api/pengiriman", (req, res) => {
  const sql = `
  SELECT 
    ps.id,
    u.nama_lengkap AS nama,
    ps.jenis_sampah AS kategori_sampah,
    ps.tanggal_akhir,
    ps.opsi_pengiriman,
    CONCAT_WS(', ',
      au.kabupaten,
      CONCAT('Kecamatan ', au.kecamatan),
      CONCAT('Desa ', au.desa),
      au.alamat_lengkap
    ) AS alamat_user,

    CONCAT_WS(', ',
      aa.kabupaten,
      CONCAT('Kecamatan ', aa.kecamatan),
      CONCAT('Desa ', aa.desa),
      aa.alamat_lengkap
    ) AS alamat_admin
  FROM penjualan_sampah ps
  JOIN users u ON ps.user_id = u.id_user
  LEFT JOIN alamat au ON ps.alamat_user_id = au.id_alamat
  LEFT JOIN alamat aa ON ps.alamat_admin_id = aa.id_alamat
  WHERE ps.status = 'penawaran diterima'
`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ success: false, message: "Gagal ambil data pengiriman" });
    }
    res.json({ success: true, data: results });
  });
});
app.put('/api/penjualan/selesai/:id', (req, res, next) => {
    upload.single("bukti_transaksi")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.error('❌ Multer Error:', err);
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            console.error('❌ Unknown Upload Error:', err);
            return res.status(500).json({ success: false, message: 'Unknown error uploading file' });
        }

        // lanjut proses seperti biasa:
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'File tidak ditemukan' });
        }

        const buktiTFPath = `/uploads/${file.filename}`;
        const sql = `
            UPDATE penjualan_sampah
            SET status = 'selesai',
                bukti_tf = ?
            WHERE id = ?
        `;

        db.query(sql, [buktiTFPath, id], (err, result) => {
            if (err) {
                console.error("❌ DB Error (update selesai):", err);
                return res.status(500).json({ success: false, message: "Gagal update status selesai" });
            }

            res.json({ success: true, message: "Berhasil selesai" });
        });
    });
});

app.listen(port, () => {
  console.log(`Server backend berjalan di http://localhost:${port}`);
});

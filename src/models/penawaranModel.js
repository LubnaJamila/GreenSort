export async function fetchSemuaPenawaran() {
  try {
    const res = await fetch("http://localhost:3000/api/penawaran/status/semua");
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error("❌ Gagal ambil semua penawaran:", err);
    return [];
  }
}

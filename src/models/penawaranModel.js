export async function fetchSemuaPenawaran() {
  try {
    const res = await fetch(
      "https://greenshort-production.up.railway.app/api/penawaran/status/semua"
    );
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error("❌ Gagal ambil semua penawaran:", err);
    return [];
  }
}
export async function fetchStatistikPenawaran() {
  try {
    const res = await fetch(
      "https://greenshort-production.up.railway.app/api/penjualan-sampah"
    ); // endpoint yang ambil SEMUA data
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error("❌ Gagal ambil statistik penawaran:", err);
    return [];
  }
}

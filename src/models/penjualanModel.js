const BASE_URL = "http://localhost:3000";

export async function getDataPenjualanSampah() {
  try {
    const res = await fetch(`${BASE_URL}/api/penjualan-sampah`);
    const result = await res.json();
    return result.success ? result.data : [];
  } catch (err) {
    console.error("Gagal ambil data penjualan:", err);
    return [];
  }
}

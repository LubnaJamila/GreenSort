const BASE_URL = "https://greenshort-production.up.railway.app";

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
export async function getDashboardStats() {
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard-admin/stats`);
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (err) {
    console.error("Gagal ambil data dashboard-admin stats:", err);
    return null;
  }
}

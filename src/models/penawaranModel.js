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
      "https://greenshort-production.up.railway.app/api/dashboard-admin/stats"
    ); 
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error("❌ Gagal ambil statistik penawaran:", err);
    return null;
  }
}

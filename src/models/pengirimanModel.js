export async function loadPengirimanData(userId) {
  const res = await fetch(
    `https://greenshort-production.up.railway.app/api/pengiriman/${userId}`
  );
  const json = await res.json();

  if (!json.success) throw new Error(json.message || "Gagal fetch data");

  return json.data.map((item) => ({
    ...item,
    category: item.jenis_sampah,
    weight: item.berat,
    price: item.harga_tawaran,
    totalPrice: item.total,
    date: new Date(item.tanggal_awal),
    address: item.alamat_admin,
    status: item.opsi_pengiriman,
  }));
}
export async function getUserDashboardStats(userId) {
  const res = await fetch(`https://greenshort-production.up.railway.app/api/dashboard-user/stats/${userId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Gagal fetch stats user");
  return json.data;
}



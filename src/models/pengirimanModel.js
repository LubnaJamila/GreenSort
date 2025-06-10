export async function loadPengirimanData(userId) {
  const res = await fetch(`http://localhost:3000/api/pengiriman/${userId}`);
  const json = await res.json();

  if (!json.success) throw new Error(json.message || "Gagal fetch data");

  // Beri bentuk konsisten untuk presenter
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

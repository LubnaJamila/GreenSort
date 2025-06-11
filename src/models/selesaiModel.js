// src/models/selesaiModel.js
export async function fetchSelesaiData() {
  try {
    const res = await fetch(
      "https://greenshort-production.up.railway.app/api/penjualan/selesai/tabel"
    );
    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error("❌ Error fetchSelesaiData:", error);
    return [];
  }
}
export async function fetchSelesaiById(id) {
  try {
    const res = await fetch(
      `https://greenshort-production.up.railway.app/api/pengajuan/id/${id}`
    );
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (err) {
    console.error("❌ Error fetchSelesaiById:", err);
    return null;
  }
}
export async function updateSelesai(applicationId, formData) {
    try {
        const response = await fetch(
          `https://greenshort-production.up.railway.app/api/penjualan/selesai/${applicationId}`,
          {
            method: "PUT",
            body: formData,
          }
        );
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("❌ Error updateSelesai:", error);
        return { success: false, message: 'Error updating selesai data.' };
    }
}



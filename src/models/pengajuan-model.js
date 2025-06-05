export default class PengajuanModel {
  constructor() {
    this.baseUrl = 'http://localhost:3000/api';
  }

  async getApplicationsByStatus(status) {
    try {
      const response = await fetch(`${this.baseUrl}/pengajuan/status/${status}`);
      const result = await response.json();

      if (!result.success || !Array.isArray(result.data)) {
        throw new Error("Respon dari server tidak valid");
      }

      return result.data.map(item => ({
        id: item.id,
        name: item.name || 'N/A',
        phone: item.phone || '-',
        category: item.category || item.jenis_sampah || 'N/A',
        weight: item.weight || item.berat || 0,
        image: item.image 
          ? `${this.baseUrl.replace('/api', '')}${item.image}` 
          : "https://via.placeholder.com/100",
      }));
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  }

  async getApplicationById(id) {
    const response = await fetch(`${this.baseUrl}/pengajuan/id/${id}`);
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Gagal mengambil data pengajuan");
    }

    const item = result.data;
    return {
      id: item.id,
      name: item.name || 'N/A',
      phone: item.phone || '-',
      category: item.category || item.jenis_sampah || 'N/A',
      weight: item.weight || item.berat || 0,
      image: item.image 
        ? `${this.baseUrl.replace('/api', '')}${item.image}` 
        : "https://via.placeholder.com/100",
    };
  }

  async submitOffer({ applicationId, alamatId, hargaPerKg, totalHarga }) {
    try {
      const response = await fetch(`${this.baseUrl}/pengajuan/terima/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alamat_id: alamatId,
          harga_per_kg: hargaPerKg,
          total_harga: totalHarga
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result;
    } catch (error) {
      console.error('Error submitting offer:', error);
      return { success: false, message: error.message };
    }
  }
  async rejectApplication({ applicationId, reason }) {
  try {
    const response = await fetch(`${this.baseUrl}/pengajuan/tolak/${applicationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.message);
    return result;
  } catch (error) {
    console.error('Error rejecting application:', error);
    return { success: false, message: error.message };
  }
}

}

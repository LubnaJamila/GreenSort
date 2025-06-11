export default class PengirimanModel {
  async getApplications() {
    try {
      const response = await fetch(
        "https://greenshort-production.up.railway.app/api/pengiriman"
      );
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("Gagal mengambil data pengiriman:", error);
      return [];
    }
  }
}

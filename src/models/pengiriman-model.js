export default class PengirimanModel {
  async getApplications() {
    try {
      const response = await fetch("http://localhost:3000/api/pengiriman");
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error("Gagal mengambil data pengiriman:", error);
      return [];
    }
  }
}

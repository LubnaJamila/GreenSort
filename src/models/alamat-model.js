// src/models/alamat-model.js - Updated version
export default class AlamatModel {
  constructor() {
    this.apiBaseUrl = "https://www.emsifa.com/api-wilayah-indonesia/api";
    this.backendUrl = "http://localhost:3000/api"; // Backend server URL

    // Cache untuk menyimpan data yang sudah dimuat
    this.cache = {
      provinces: null,
      regencies: {},
      districts: {},
      villages: {},
    };
  }

  async fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  // Methods untuk wilayah Indonesia (tetap sama)
  async getProvinces() {
    try {
      if (this.cache.provinces) {
        return this.cache.provinces;
      }

      const provinces = await this.fetchData(
        `${this.apiBaseUrl}/provinces.json`
      );
      this.cache.provinces = provinces;
      return provinces;
    } catch (error) {
      throw new Error(`Failed to load provinces: ${error.message}`);
    }
  }

  async getRegencies(provinsiId) {
    try {
      if (this.cache.regencies[provinsiId]) {
        return this.cache.regencies[provinsiId];
      }

      const regencies = await this.fetchData(
        `${this.apiBaseUrl}/regencies/${provinsiId}.json`
      );
      this.cache.regencies[provinsiId] = regencies;
      return regencies;
    } catch (error) {
      throw new Error(`Failed to load regencies: ${error.message}`);
    }
  }

  async getDistricts(kabupatenId) {
    try {
      if (this.cache.districts[kabupatenId]) {
        return this.cache.districts[kabupatenId];
      }

      const districts = await this.fetchData(
        `${this.apiBaseUrl}/districts/${kabupatenId}.json`
      );
      this.cache.districts[kabupatenId] = districts;
      return districts;
    } catch (error) {
      throw new Error(`Failed to load districts: ${error.message}`);
    }
  }

  async getVillages(kecamatanId) {
    try {
      if (this.cache.villages[kecamatanId]) {
        return this.cache.villages[kecamatanId];
      }

      const villages = await this.fetchData(
        `${this.apiBaseUrl}/villages/${kecamatanId}.json`
      );
      this.cache.villages[kecamatanId] = villages;
      return villages;
    } catch (error) {
      throw new Error(`Failed to load villages: ${error.message}`);
    }
  }

  // Validate alamat data
  validateAlamatData(data) {
    const requiredFields = [
      "provinsi",
      "kabupaten",
      "kecamatan",
      "desa",
      "alamatLengkap",
      "latitude",
      "longitude",
    ];
    const errors = [];

    requiredFields.forEach((field) => {
      if (
        !data[field] ||
        (typeof data[field] === "string" && !data[field].trim())
      ) {
        errors.push(`${field} is required`);
      }
    });

    // Validate coordinates
    if (
      data.latitude &&
      (isNaN(data.latitude) || data.latitude < -90 || data.latitude > 90)
    ) {
      errors.push("Invalid latitude value");
    }

    if (
      data.longitude &&
      (isNaN(data.longitude) || data.longitude < -180 || data.longitude > 180)
    ) {
      errors.push("Invalid longitude value");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  // Save alamat ke backend database
  async saveAlamat(alamatData) {
    const validation = this.validateAlamatData(alamatData);

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    try {
      // Get current user from localStorage atau auth system
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser || !currentUser.id_user) {
        throw new Error("User not authenticated");
      }

      // Prepare data untuk backend
      const dataToSend = {
        provinsi: alamatData.provinsi,
        kabupaten: alamatData.kabupaten,
        kecamatan: alamatData.kecamatan,
        desa: alamatData.desa,
        alamat_lengkap: alamatData.alamatLengkap,
        latitude: parseFloat(alamatData.latitude),
        longitude: parseFloat(alamatData.longitude),
        id_user: currentUser.id_user,
      };

      console.log("Sending alamat data to backend:", dataToSend);

      const response = await fetch(`${this.backendUrl}/alamat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save alamat");
      }

      return {
        success: true,
        message: result.message || "Alamat berhasil disimpan",
        data: result,
      };
    } catch (error) {
      console.error("Error saving alamat:", error);
      throw new Error(`Failed to save alamat: ${error.message}`);
    }
  }

  // Get alamat user dari backend
  async getUserAlamat(userId) {
    try {
      const response = await fetch(`${this.backendUrl}/alamat/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch alamat");
      }

      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error("Error fetching alamat:", error);
      throw new Error(`Failed to fetch alamat: ${error.message}`);
    }
  }

  // Delete alamat dari backend
  async deleteAlamat(alamatId) {
    try {
      const response = await fetch(`${this.backendUrl}/alamat/${alamatId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete alamat");
      }

      return {
        success: true,
        message: result.message || "Alamat berhasil dihapus",
      };
    } catch (error) {
      console.error("Error deleting alamat:", error);
      throw new Error(`Failed to delete alamat: ${error.message}`);
    }
  }
  async getAddresses(userId) {
  const result = await this.getUserAlamat(userId);

  return result.data.map(item => ({
    id: item.id_alamat,
    name: `${item.desa}, ${item.kecamatan}, ${item.kabupaten}`,
    address: item.alamat_lengkap,
  }));
}
  async getAlamatAdmin() {
    try {
      const response = await fetch(`${this.backendUrl}/admin/alamat`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal mengambil data alamat admin");
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching alamat admin:", error);
      throw new Error(`Failed to fetch alamat admin: ${error.message}`);
    }
  }


}

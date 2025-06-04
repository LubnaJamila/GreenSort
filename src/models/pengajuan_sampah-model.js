// src/models/pengajuan_sampah-model.js

const BASE_URL = "http://localhost:3000";

export async function kirimPengajuan(formData) {
  try {
    const response = await fetch(`${BASE_URL}/api/pengajuan`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error saat mengirim pengajuan:", error);
    return { success: false, message: "Gagal terhubung ke server." };
  }
}

export async function getPengajuanByUserId(userId) {
  try {
    // Validasi userId
    if (!userId) {
      return { success: false, message: "User ID diperlukan" };
    }

    const response = await fetch(`${BASE_URL}/api/pengajuan/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Gagal mengambil data pengajuan:", error);
    return {
      success: false,
      message: "Tidak bisa terhubung ke server",
      data: [],
    };
  }
}

// Tambahan: Fungsi untuk mengambil pengajuan berdasarkan status tertentu
export async function getPengajuanByUserIdAndStatus(userId, status) {
  try {
    if (!userId || !status) {
      return { success: false, message: "User ID dan status diperlukan" };
    }

    const response = await fetch(
      `${BASE_URL}/api/pengajuan/${userId}/status/${status}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Gagal mengambil data pengajuan berdasarkan status:", error);
    return {
      success: false,
      message: "Tidak bisa terhubung ke server",
      data: [],
    };
  }
}

// Tambahan: Fungsi untuk mengupdate status pengajuan
export async function updateStatusPengajuan(pengajuanId, newStatus) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/pengajuan/${pengajuanId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating status pengajuan:", error);
    return { success: false, message: "Gagal mengupdate status pengajuan" };
  }
}

// Tambahan: Fungsi untuk menghapus pengajuan
export async function deletePengajuan(pengajuanId) {
  try {
    const response = await fetch(`${BASE_URL}/api/pengajuan/${pengajuanId}`, {
      method: "DELETE",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error deleting pengajuan:", error);
    return { success: false, message: "Gagal menghapus pengajuan" };
  }
}

// src/models/pengajuan_sampah-model.js

const BASE_URL = "https://greenshort-production.up.railway.app";

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
export async function rejectPenawaranTanpaAlasan(idPengajuan) {
  const response = await fetch(
    `https://greenshort-production.up.railway.app/api/penawaran/tolak/${idPengajuan}`,
    {
      method: "PUT",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal menolak penawaran");
  }

  return result;
}


const BASE_URL = "http://localhost:3000";

export async function getPengajuanById(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/pengajuan/detail/${id}`);
    const result = await res.json();
    if (!result.success) throw new Error(result.message);
    return result.data;
  } catch (err) {
    console.error("getPengajuanById Error:", err);
    throw err;
  }
}

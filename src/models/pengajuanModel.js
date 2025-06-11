const BASE_URL = "https://greenshort-production.up.railway.app";

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
export async function updatePengantaran(idPengajuan, payload) {
  const response = await fetch(
    `${BASE_URL}/api/pengajuan/mengantar/${idPengajuan}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Gagal update pengantaran");
  }

  return result;
}
export async function updatePenjemputan(idPengajuan, payload) {
  const response = await fetch(
    `${BASE_URL}/api/pengajuan/dijemput/${idPengajuan}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const contentType = response.headers.get("content-type");
  if (!response.ok) {
    const message = contentType?.includes("application/json")
      ? (await response.json()).message
      : `HTTP ${response.status} - ${response.statusText}`;
    throw new Error(message || "Gagal update penjemputan");
  }

  return response.json();
}



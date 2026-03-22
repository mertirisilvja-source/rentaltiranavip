const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

function buildUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function check401(res) {
  if (res.status === 401) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
}

// ── Auth ──────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(buildUrl("/api/Auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "Login failed");
    throw new Error(msg);
  }

  return res.json(); // { token, fullName, email, role }
}

// ── Cars ──────────────────────────────────────────────────

export async function fetchAllCars(token) {
  const res = await fetch(buildUrl("/api/Cars"), {
    headers: authHeaders(token),
  });
  check401(res);
  if (!res.ok) throw new Error("Failed to fetch cars");
  return res.json();
}

export async function createCar(car, token) {
  const res = await fetch(buildUrl("/api/Cars"), {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(car),
  });
  check401(res);
  if (!res.ok) {
    const msg = await res.text().catch(() => "Create failed");
    throw new Error(msg);
  }
  return res.json();
}

export async function updateCar(id, car, token) {
  const res = await fetch(buildUrl(`/api/Cars/${id}`), {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(car),
  });
  check401(res);
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

export async function deleteCar(id, token) {
  const res = await fetch(buildUrl(`/api/Cars/${id}`), {
    method: "DELETE",
    headers: authHeaders(token),
  });
  check401(res);
  if (!res.ok) throw new Error("Delete failed");
}

export async function uploadCarImages(carId, files, token) {
  const form = new FormData();
  for (const file of files) form.append("files", file);

  const res = await fetch(buildUrl(`/api/Cars/${carId}/images`), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  check401(res);
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function deleteCarImage(carId, imageId, token) {
  const res = await fetch(buildUrl(`/api/Cars/${carId}/images/${imageId}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  check401(res);
  if (!res.ok) throw new Error("Delete image failed");
}

// ── Reservations ──────────────────────────────────────────

export async function fetchReservations(token) {
  const res = await fetch(buildUrl("/api/Reservations"), {
    headers: authHeaders(token),
  });
  check401(res);
  if (!res.ok) throw new Error("Failed to fetch reservations");
  return res.json();
}

export async function updateReservationStatus(id, status, token) {
  const res = await fetch(buildUrl(`/api/Reservations/${id}/status`), {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  check401(res);
  if (!res.ok) throw new Error("Status update failed");
  return res.json();
}

export async function createReservation(reservation) {
  const res = await fetch(buildUrl("/api/Reservations"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reservation),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Create reservation failed");
    throw new Error(msg);
  }
  return res.json();
}

// ── Documents ─────────────────────────────────────────────

export async function uploadReservationDocument(reservationId, documentType, files) {
  const form = new FormData();
  form.append("documentType", documentType);
  for (const file of files) form.append("files", file);

  const res = await fetch(buildUrl(`/api/Reservations/${reservationId}/documents`), {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "Document upload failed");
    throw new Error(msg);
  }
  return res.json();
}

export async function fetchReservationDocuments(reservationId, token) {
  const res = await fetch(buildUrl(`/api/Reservations/${reservationId}/documents`), {
    headers: { Authorization: `Bearer ${token}` },
  });
  check401(res);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export function getDocumentDownloadUrl(docId) {
  return buildUrl(`/api/Reservations/documents/${docId}`);
}
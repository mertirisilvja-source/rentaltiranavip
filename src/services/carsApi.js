// services/carsApi.js

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

function buildUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function mapFuelKey(fuelType) {
  const value = String(fuelType || "").toLowerCase();
  if (value === "petrol" || value === "gasoline") return "carSpecs.fuel.petrol";
  if (value === "diesel") return "carSpecs.fuel.diesel";
  if (value === "hybrid") return "carSpecs.fuel.hybrid";
  if (value === "electric") return "carSpecs.fuel.electric";
  return null;
}

function mapGearboxKey(gearbox) {
  const value = String(gearbox || "").toLowerCase();
  if (value === "automatic") return "carSpecs.gearbox.automatic";
  if (value === "manual") return "carSpecs.gearbox.manual";
  return null;
}

// Converts raw API response → shape the UI expects
export function normalizeCar(raw) {
  // Images come from the API as [{ id, url, sortOrder }, ...]
  // We map them to full URLs (handles both absolute and relative paths)
  const images =
    Array.isArray(raw?.images) && raw.images.length > 0
      ? raw.images
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((img) => {
            const url = img.url || img.Url || "";
            // If the URL is already absolute, use it directly
            return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
          })
      : ["https://via.placeholder.com/1200x800?text=No+Image"];

  return {
    ...raw,
    images,
    available: raw?.isActive !== false,
    fuelKey: mapFuelKey(raw?.fuelType),
    gearboxKey: mapGearboxKey(raw?.gearbox),
  };
}

export async function fetchCars({ startDateUtc, endDateUtc } = {}) {
  let url = "/api/Cars";
  if (startDateUtc && endDateUtc) {
    const params = new URLSearchParams({ startDateUtc, endDateUtc });
    url += `?${params.toString()}`;
  }
  const res = await fetch(buildUrl(url));
  if (!res.ok) throw new Error(`Failed to fetch cars: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeCar) : [];
}

export async function checkCarAvailability(carId, startDateUtc, endDateUtc) {
  const params = new URLSearchParams({ startDateUtc, endDateUtc });
  const res = await fetch(
    buildUrl(`/api/Reservations/${carId}/availability?${params.toString()}`),
  );
  if (!res.ok) throw new Error(`Availability check failed: ${res.status}`);
  const data = await res.json();
  return data.available;
}

export async function fetchCarById(id) {
  const res = await fetch(buildUrl(`/api/Cars/${id}`));
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch car: ${res.status}`);
  }
  const data = await res.json();
  return normalizeCar(data);
}

// Admin: upload images for a car
export async function uploadCarImages(carId, files, token) {
  const form = new FormData();
  for (const file of files) form.append("files", file);

  const res = await fetch(buildUrl(`/api/Cars/${carId}/images`), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

// Admin: delete a single image
export async function deleteCarImage(carId, imageId, token) {
  const res = await fetch(buildUrl(`/api/Cars/${carId}/images/${imageId}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}

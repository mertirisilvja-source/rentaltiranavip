import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllCars,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImages,
  deleteCarImage,
  fetchReservations,
  updateReservationStatus,
  updateReservationDates,
  updateReservationNotes,
  deleteReservation,
  createReservation,
  fetchReservationDocuments,
  getDocumentDownloadUrl,
} from "../services/adminApi";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

function imgUrl(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
}

// ── Main Dashboard ────────────────────────────────────────

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function clearAuthAndRedirect(navigate) {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_name");
  navigate("/admin/login", { replace: true });
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("cars");
  const token = localStorage.getItem("admin_token");
  const adminName = localStorage.getItem("admin_name") || "Admin";

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      clearAuthAndRedirect(navigate);
    }
  }, [token, navigate]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    navigate("/admin/login");
  };

  if (!token) return null;

  return (
    <main className="min-h-screen bg-black pt-24 pb-16 text-white">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-white/50">Welcome, {adminName}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {["cars", "reservations"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                tab === t
                  ? "bg-[#caa24a] text-black"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {t === "cars" ? "Cars" : "Reservations"}
            </button>
          ))}
        </div>

        {tab === "cars" ? (
          <CarsTab token={token} />
        ) : (
          <ReservationsTab token={token} />
        )}
      </div>
    </main>
  );
}

// ── Cars Tab ──────────────────────────────────────────────

const emptyCar = {
  id: "",
  name: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  fuelType: "Petrol",
  gearbox: "Automatic",
  seats: 5,
  pricePerDay: 0,
  price2Days: 0,
  price3to7PerDay: 0,
  isActive: true,
};

function CarsTab({ token }) {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | car object
  const [form, setForm] = useState(emptyCar);
  const [saving, setSaving] = useState(false);

  const handle401 = useCallback((e) => {
    if (e.status === 401) {
      clearAuthAndRedirect(navigate);
      return true;
    }
    return false;
  }, [navigate]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllCars(token);
      setCars(data);
    } catch (e) {
      if (!handle401(e)) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, handle401]);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    setEditing("new");
    setForm({ ...emptyCar });
  };

  const startEdit = (car) => {
    setEditing(car);
    setForm({
      id: car.id,
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: car.year,
      fuelType: car.fuelType,
      gearbox: car.gearbox,
      seats: car.seats,
      pricePerDay: car.pricePerDay,
      price2Days: car.price2Days || 0,
      price3to7PerDay: car.price3to7PerDay || 0,
      isActive: car.isActive,
    });
  };

  const cancel = () => {
    setEditing(null);
    setForm(emptyCar);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await createCar(form, token);
      } else {
        await updateCar(editing.id, form, token);
      }
      cancel();
      await load();
    } catch (err) {
      if (!handle401(err)) alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (car) => {
    if (!confirm(`Delete ${car.brand} ${car.model}?`)) return;
    try {
      await deleteCar(car.id, token);
      await load();
    } catch (err) {
      if (!handle401(err)) alert(err.message);
    }
  };

  const handleImageUpload = async (car, files) => {
    try {
      await uploadCarImages(car.id, files, token);
      await load();
    } catch (err) {
      if (!handle401(err)) alert(err.message);
    }
  };

  const handleImageDelete = async (car, imageId) => {
    try {
      await deleteCarImage(car.id, imageId, token);
      await load();
    } catch (err) {
      if (!handle401(err)) alert(err.message);
    }
  };

  const input =
    "h-10 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-[#caa24a]/60";

  const renderForm = (showId) => (
    <form
      onSubmit={save}
      className="rounded-2xl border border-[#caa24a]/30 bg-[#caa24a]/5 p-6"
    >
      <h2 className="mb-4 text-lg font-semibold">
        {editing === "new" ? "Add New Car" : `Edit: ${editing.brand} ${editing.model}`}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {showId && (
          <div>
            <label className="mb-1 block text-xs text-white/50">ID (slug)</label>
            <input
              className={input}
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              placeholder="e.g. bmw-m3-2024"
              required
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs text-white/50">Name</label>
          <input
            className={input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Brand</label>
          <input
            className={input}
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Model</label>
          <input
            className={input}
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Year</label>
          <input
            className={input}
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Price / Day (1 day)</label>
          <input
            className={input}
            type="number"
            value={form.pricePerDay}
            onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Price 2 Days (total)</label>
          <input
            className={input}
            type="number"
            value={form.price2Days}
            onChange={(e) => setForm({ ...form, price2Days: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Price 3-7 Days (per day)</label>
          <input
            className={input}
            type="number"
            value={form.price3to7PerDay}
            onChange={(e) => setForm({ ...form, price3to7PerDay: Number(e.target.value) })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Fuel Type</label>
          <select
            className={input}
            value={form.fuelType}
            onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Gearbox</label>
          <select
            className={input}
            value={form.gearbox}
            onChange={(e) => setForm({ ...form, gearbox: e.target.value })}
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Seats</label>
          <input
            className={input}
            type="number"
            value={form.seats}
            onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
            required
          />
        </div>
        <div className="flex items-end gap-2">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#caa24a] px-6 py-2 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-50"
        >
          {saving ? "Saving..." : editing === "new" ? "Create Car" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={cancel}
          className="rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-sm text-white/60 hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  if (loading) return <p className="text-white/50">Loading cars...</p>;
  if (error) return <p className="text-red-300">{error}</p>;

  return (
    <div>
      {/* Add button + new car form */}
      {editing === null ? (
        <button
          onClick={startNew}
          className="mb-6 rounded-lg bg-[#caa24a] px-5 py-2 text-sm font-semibold text-black hover:brightness-110"
        >
          + Add Car
        </button>
      ) : editing === "new" ? (
        <div className="mb-6">{renderForm(true)}</div>
      ) : null}

      {/* Car list */}
      <div className="space-y-4">
        {cars.map((car) => (
          <div
            key={car.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold">
                  {car.brand} {car.model}
                </h3>
                <p className="text-sm text-white/50">
                  {car.year} &middot; {car.fuelType} &middot; {car.gearbox} &middot;{" "}
                  {car.seats} seats &middot; €{car.pricePerDay}/day &middot; 2d: €{car.price2Days || 0} &middot; 3-7d: €{car.price3to7PerDay || 0}/day
                  {!car.isActive && (
                    <span className="ml-2 text-red-400">(inactive)</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-white/30">ID: {car.id}</p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(car)}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 hover:bg-white/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(car)}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm text-red-300 hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Inline edit form */}
            {editing && editing !== "new" && editing.id === car.id && (
              <div className="mt-4">{renderForm(false)}</div>
            )}

            {/* Images */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {(car.images || []).map((img) => (
                  <div key={img.id} className="group relative">
                    <img
                      src={imgUrl(img.url)}
                      alt=""
                      className="h-20 w-28 rounded-lg border border-white/10 object-cover"
                    />
                    <button
                      onClick={() => handleImageDelete(car, img.id)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 transition group-hover:opacity-100"
                      title="Delete image"
                    >
                      x
                    </button>
                  </div>
                ))}

                <label className="flex h-20 w-28 cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/20 text-sm text-white/40 hover:border-white/40 hover:text-white/60">
                  + Add
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        handleImageUpload(car, Array.from(e.target.files));
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Reservations Tab ──────────────────────────────────────

const statusColors = {
  Pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  Confirmed: "border-green-500/30 bg-green-500/10 text-green-300",
  Cancelled: "border-red-500/30 bg-red-500/10 text-red-300",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function toDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function datesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

function getStatusName(status) {
  if (status === 1 || status === "Pending") return "Pending";
  if (status === 2 || status === "Confirmed") return "Confirmed";
  if (status === 3 || status === "Cancelled") return "Cancelled";
  return "Pending";
}

function ReservationCard({ reservation: r, statusName, statusColors, hasDocuments, onConfirm, onCancel, onDelete, token, onNotesUpdated, cars }) {
  const [docs, setDocs] = useState(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [notes, setNotes] = useState(r.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesDirty, setNotesDirty] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [savingDates, setSavingDates] = useState(false);

  const toInputDate = (dateStr) => {
    const s = typeof dateStr === "string" && !dateStr.endsWith("Z") ? dateStr + "Z" : dateStr;
    const d = new Date(s);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
  };

  const openEdit = () => {
    setEditStart(toInputDate(r.startDateUtc));
    setEditEnd(toInputDate(r.endDateUtc));
    setEditing(true);
  };

  const saveEdit = async () => {
    setSavingDates(true);
    try {
      await updateReservationDates(
        r.id,
        `${editStart}T00:00:00Z`,
        `${editEnd}T00:00:00Z`,
        token,
      );
      setEditing(false);
      if (onNotesUpdated) onNotesUpdated();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingDates(false);
    }
  };

  // Auto-load docs on mount
  useEffect(() => {
    if (!hasDocuments) return;
    setLoadingDocs(true);
    fetchReservationDocuments(r.id, token)
      .then((data) => setDocs(data))
      .catch(() => setDocs([]))
      .finally(() => setLoadingDocs(false));
  }, [r.id, token, hasDocuments]);

  const openDoc = (docId) => {
    fetch(getDocumentDownloadUrl(docId), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => window.open(URL.createObjectURL(blob), "_blank"));
  };

  const startDate = new Date(r.startDateUtc.endsWith("Z") ? r.startDateUtc : r.startDateUtc + "Z");
  const endDate = new Date(r.endDateUtc.endsWith("Z") ? r.endDateUtc : r.endDateUtc + "Z");
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const carObj = (cars || []).find((c) => c.id === r.carId);
  const carName = carObj ? `${carObj.brand} ${carObj.model}` : r.carId;

  const idDoc = docs?.find((d) => d.documentType === "id_document");
  const licenseDoc = docs?.find((d) => d.documentType === "driver_license");

  const sectionLabel = "mb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-white/35";

  const statusBadgeColors = {
    Pending: "border-[#caa24a]/40 bg-[#caa24a]/10 text-[#caa24a]",
    Confirmed: "border-green-500/40 bg-green-500/10 text-green-400",
    Cancelled: "border-red-500/40 bg-red-500/10 text-red-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Car */}
        <div>
          <p className={sectionLabel}>MAKINA</p>
          <p className="text-sm font-semibold text-white">{carName}</p>
        </div>

        {/* Client */}
        <div>
          <p className={sectionLabel}>KLIENTI</p>
          <p className="text-sm font-semibold text-white">{r.fullName}</p>
          <p className="mt-0.5 text-xs text-white/50">{r.phone || r.email}</p>
        </div>

        {/* Dates */}
        <div>
          <p className={sectionLabel}>DATAT</p>
          {editing ? (
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-white/40">Fillimi</label>
                <input
                  type="date"
                  value={editStart}
                  onChange={(e) => setEditStart(e.target.value)}
                  className="h-9 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-xs text-white outline-none focus:border-[#caa24a]/60"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/40">Dorezimi</label>
                <input
                  type="date"
                  value={editEnd}
                  onChange={(e) => setEditEnd(e.target.value)}
                  className="h-9 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-xs text-white outline-none focus:border-[#caa24a]/60"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveEdit}
                  disabled={savingDates}
                  className="rounded-lg bg-[#caa24a] px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110 disabled:opacity-50"
                >
                  {savingDates ? "..." : "Ruaj"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10"
                >
                  Anulo
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-white">
                {startDate.toLocaleDateString("sq-AL", { day: "2-digit", month: "short", year: "numeric" })}
                {" "}<span className="text-white/30">&rarr;</span>{" "}
                {endDate.toLocaleDateString("sq-AL", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
              <p className="mt-0.5 text-xs text-white/40">
                {days} {days === 1 ? "dite" : "dite"}
              </p>
              <button
                onClick={openEdit}
                className="mt-1.5 text-[10px] font-medium text-[#caa24a] hover:text-[#dbb55a]"
              >
                Ndrysho datat &#9998;
              </button>
            </>
          )}
        </div>
      </div>

      <div className="my-4 h-px bg-white/5" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Price */}
        <div>
          <p className={sectionLabel}>CMIMI</p>
          <p className="text-2xl font-bold text-white">
            €{r.totalPrice || 0}
          </p>
          <p className="mt-1 text-xs text-white/40">
            {days} {days === 1 ? "dite" : "dite"}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className={sectionLabel}>STATUSI</p>
          <span className={`inline-block rounded-lg border px-3 py-1.5 text-xs font-semibold ${statusBadgeColors[statusName] || ""}`}>
            {statusName === "Pending" ? "Ne Pritje" : statusName === "Confirmed" ? "Konfirmuar" : "Anuluar"}
          </span>
        </div>

        {/* Documents */}
        <div>
          <p className={sectionLabel}>DOKUMENTET E KERKUARA</p>
          {loadingDocs ? (
            <p className="text-xs text-white/40">Duke ngarkuar...</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30">&#128196;</span>
                  <span className="text-xs text-white/70">ID / Pasaporte</span>
                </div>
                {idDoc ? (
                  <button
                    onClick={() => openDoc(idDoc.id)}
                    className="flex items-center gap-1 text-[10px] font-medium text-[#caa24a] hover:text-[#dbb55a]"
                  >
                    Shiko &#8599;
                  </button>
                ) : (
                  <span className="text-[10px] text-white/25">Mungon</span>
                )}
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30">&#128197;</span>
                  <span className="text-xs text-white/70">Patenta e Shoferit</span>
                </div>
                {licenseDoc ? (
                  <button
                    onClick={() => openDoc(licenseDoc.id)}
                    className="flex items-center gap-1 text-[10px] font-medium text-[#caa24a] hover:text-[#dbb55a]"
                  >
                    Shiko &#8599;
                  </button>
                ) : (
                  <span className="text-[10px] text-white/25">Mungon</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="my-4 h-px bg-white/5" />

      {/* Notes */}
      <div className="mb-4">
        <p className={sectionLabel}>SHENIMET E ADMINIT</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={notes}
            onChange={(e) => { setNotes(e.target.value); setNotesDirty(true); }}
            placeholder="Shto shenim..."
            className="h-9 flex-1 rounded-lg border border-white/10 bg-black/30 px-3 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#caa24a]/60"
          />
          {notesDirty && (
            <button
              onClick={async () => {
                setSavingNotes(true);
                try {
                  await updateReservationNotes(r.id, notes, token);
                  setNotesDirty(false);
                  if (onNotesUpdated) onNotesUpdated();
                } catch (err) {
                  alert(err.message);
                } finally {
                  setSavingNotes(false);
                }
              }}
              disabled={savingNotes}
              className="rounded-lg bg-[#caa24a] px-4 py-1.5 text-xs font-semibold text-black hover:brightness-110 disabled:opacity-50"
            >
              {savingNotes ? "..." : "Ruaj"}
            </button>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {statusName !== "Confirmed" && (
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-medium text-green-300 transition hover:bg-green-500/20"
          >
            &#10003; Konfirmo
          </button>
        )}
        {statusName !== "Cancelled" && (
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
          >
            &#10005; Anulo
          </button>
        )}
        <button
          onClick={() => {
            if (window.confirm("Je i sigurt qe do ta fshish kete rezervim?"))
              onDelete();
          }}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/50 transition hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
        >
          &#128465; Fshi
        </button>
      </div>
    </div>
  );
}

function ReservationsTab({ token }) {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected car
  const [selectedCarId, setSelectedCarId] = useState("");

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  // Booking form
  const [showBooking, setShowBooking] = useState(false);
  const emptyBooking = {
    fullName: "",
    email: "",
    phone: "",
    pickupLocation: "zyra",
    dropoffLocation: "zyra",
    startDate: "",
    endDate: "",
    notes: "",
  };
  const [bookingForm, setBookingForm] = useState(emptyBooking);
  const [bookingSaving, setBookingSaving] = useState(false);

  const handle401 = useCallback((e) => {
    if (e.status === 401) {
      clearAuthAndRedirect(navigate);
      return true;
    }
    return false;
  }, [navigate]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [resData, carsData] = await Promise.all([
        fetchReservations(token),
        fetchAllCars(token),
      ]);
      setReservations(resData);
      setCars(carsData);
    } catch (e) {
      if (!handle401(e)) setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, handle401]);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = async (id, status) => {
    try {
      await updateReservationStatus(id, status, token);
      await load();
    } catch (err) {
      if (!handle401(err)) alert(err.message);
    }
  };

  // Filter reservations for the selected car (non-cancelled)
  const carReservations = reservations.filter(
    (r) => r.carId === selectedCarId && getStatusName(r.status) !== "Cancelled",
  );

  const selectedCar = cars.find((c) => c.id === selectedCarId);

  // ── Calendar logic ──

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const monthName = new Date(calYear, calMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const calendarCells = [];
  for (let i = 0; i < startDow; i++) calendarCells.push(null);
  for (let d = 1; d <= totalDays; d++) calendarCells.push(d);

  // Normalize a date string to midnight UTC (strip time portion)
  // Backend returns dates without Z suffix, so we append it to force UTC parsing
  const toMidnight = (d) => {
    const str = typeof d === "string" && !d.endsWith("Z") ? d + "Z" : d;
    const dt = new Date(str);
    return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()));
  };

  // Returns "confirmed", "pending", or "free"
  // Drop-off day is free — only pickup through day before drop-off are booked
  const getDayStatus = (day) => {
    if (!day) return "free";
    const dayDate = new Date(Date.UTC(calYear, calMonth, day));
    let hasPending = false;
    for (const r of carReservations) {
      const rStart = toMidnight(r.startDateUtc);
      const rEnd = toMidnight(r.endDateUtc); // drop-off day = free
      if (dayDate >= rStart && dayDate < rEnd) {
        const st = getStatusName(r.status);
        if (st === "Confirmed") return "confirmed";
        if (st === "Pending") hasPending = true;
      }
    }
    return hasPending ? "pending" : "free";
  };

  const getReservationsForDate = (day) => {
    if (!day) return [];
    const dayDate = new Date(Date.UTC(calYear, calMonth, day));
    return carReservations.filter((r) => {
      const rStart = toMidnight(r.startDateUtc);
      const rEnd = toMidnight(r.endDateUtc);
      return dayDate >= rStart && dayDate < rEnd;
    });
  };

  const selectedDateReservations = selectedDate
    ? getReservationsForDate(selectedDate)
    : [];

  // ── Booking form handlers ──

  const openBookingForm = (date) => {
    const start = new Date(calYear, calMonth, date || 1);
    const startStr = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;
    setBookingForm({ ...emptyBooking, startDate: startStr, endDate: startStr });
    setShowBooking(true);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookingSaving(true);
    try {
      await createReservation({
        carId: selectedCarId,
        fullName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        pickupLocation: bookingForm.pickupLocation,
        dropoffLocation: bookingForm.dropoffLocation,
        startDateUtc: `${bookingForm.startDate}T00:00:00Z`,
        endDateUtc: `${bookingForm.endDate}T00:00:00Z`,
        notes: bookingForm.notes || null,
      });
      setShowBooking(false);
      setBookingForm(emptyBooking);
      await load();
    } catch (err) {
      if (!handle401(err)) alert(err.message);
    } finally {
      setBookingSaving(false);
    }
  };

  const input =
    "h-10 w-full rounded-lg border border-white/10 bg-black/30 px-3 text-sm text-white outline-none focus:border-[#caa24a]/60";

  if (loading) return <p className="text-white/50">Loading...</p>;
  if (error) return <p className="text-red-300">{error}</p>;

  return (
    <div className="space-y-6">
      {/* ── Car selector ── */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="mb-3 text-lg font-semibold">Select a Car</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => {
            const isActive = car.id === selectedCarId;
            const carBookings = reservations.filter(
              (r) => r.carId === car.id && getStatusName(r.status) !== "Cancelled",
            ).length;

            return (
              <button
                key={car.id}
                type="button"
                onClick={() => {
                  setSelectedCarId(car.id === selectedCarId ? "" : car.id);
                  setSelectedDate(null);
                  setShowBooking(false);
                }}
                className={`rounded-xl border p-3 text-left transition ${
                  isActive
                    ? "border-[#caa24a] bg-[#caa24a]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <p className="font-medium text-white">
                  {car.brand} {car.model}
                </p>
                <p className="text-xs text-white/50">
                  {car.year} &middot; €{car.pricePerDay}/day
                </p>
                {carBookings > 0 && (
                  <p className="mt-1 text-xs text-[#caa24a]">
                    {carBookings} active booking{carBookings > 1 ? "s" : ""}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Calendar (only when car selected) ── */}
      {selectedCarId && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={prevMonth}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10"
            >
              &larr;
            </button>
            <div className="text-center">
              <h2 className="text-lg font-semibold">{monthName}</h2>
              <p className="text-xs text-white/40">
                {selectedCar?.brand} {selectedCar?.model}
              </p>
            </div>
            <button
              onClick={nextMonth}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10"
            >
              &rarr;
            </button>
          </div>

          {/* Legend */}
          <div className="mb-3 flex gap-4 text-xs text-white/50">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-green-500/40" />
              Free
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-[#caa24a]/40" />
              Pending
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-red-500/40" />
              Confirmed
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/40">
            {DAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-16" />;
              }

              const dayStatus = getDayStatus(day);
              const isToday =
                day === today.getDate() &&
                calMonth === today.getMonth() &&
                calYear === today.getFullYear();
              const isSelected = day === selectedDate;

              const cellColors =
                isSelected
                  ? "border-[#caa24a] bg-[#caa24a]/15"
                  : dayStatus === "confirmed"
                    ? "border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
                    : dayStatus === "pending"
                      ? "border-[#caa24a]/30 bg-[#caa24a]/10 hover:bg-[#caa24a]/20"
                      : "border-green-500/20 bg-green-500/5 hover:bg-green-500/15";

              const textColor =
                isToday
                  ? "text-[#caa24a]"
                  : dayStatus === "confirmed"
                    ? "text-red-300"
                    : dayStatus === "pending"
                      ? "text-[#caa24a]"
                      : "text-green-300";

              const label =
                dayStatus === "confirmed"
                  ? "Confirmed"
                  : dayStatus === "pending"
                    ? "Pending"
                    : null;

              const labelColor =
                dayStatus === "confirmed"
                  ? "text-red-400"
                  : "text-[#caa24a]/80";

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDate(day === selectedDate ? null : day)}
                  className={`h-16 rounded-lg border text-center transition ${cellColors}`}
                >
                  <span className={`text-sm font-medium ${textColor}`}>
                    {day}
                  </span>
                  {label && (
                    <div className={`text-[10px] ${labelColor}`}>{label}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Selected date details ── */}
      {selectedCarId && selectedDate && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {calYear}-{pad(calMonth + 1)}-{pad(selectedDate)}{" "}
              <span className="text-sm font-normal text-white/40">
                — {selectedCar?.brand} {selectedCar?.model}
              </span>
            </h3>
            {getDayStatus(selectedDate) !== "confirmed" && (
              <button
                onClick={() => openBookingForm(selectedDate)}
                className="rounded-lg bg-[#caa24a] px-4 py-1.5 text-sm font-semibold text-black hover:brightness-110"
              >
                + Book This Car
              </button>
            )}
          </div>

          {selectedDateReservations.length === 0 ? (
            <p className="text-sm text-green-400">
              This car is free on this date. Click &quot;+ Book This Car&quot; to create a reservation.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDateReservations.map((r) => {
                const statusName = getStatusName(r.status);
                const hasDocuments = Array.isArray(r.documents) && r.documents.length > 0;
                return (
                  <ReservationCard
                    key={r.id}
                    reservation={r}
                    statusName={statusName}
                    statusColors={statusColors}
                    hasDocuments={hasDocuments}
                    onConfirm={() => changeStatus(r.id, "Confirmed")}
                    onCancel={() => changeStatus(r.id, "Cancelled")}
                    onDelete={async () => {
                      try {
                        await deleteReservation(r.id, token);
                        await load();
                      } catch (err) {
                        if (!handle401(err)) alert(err.message);
                      }
                    }}
                    onNotesUpdated={load}
                    cars={cars}
                    token={token}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Booking form ── */}
      {showBooking && selectedCarId && (
        <div className="rounded-2xl border border-[#caa24a]/30 bg-[#caa24a]/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Book: {selectedCar?.brand} {selectedCar?.model}
            </h3>
            <button
              onClick={() => setShowBooking(false)}
              className="text-sm text-white/50 hover:text-white/80"
            >
              Close
            </button>
          </div>

          <form onSubmit={submitBooking}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-white/50">Full Name</label>
                <input
                  className={input}
                  value={bookingForm.fullName}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Email</label>
                <input
                  className={input}
                  type="email"
                  value={bookingForm.email}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Phone</label>
                <input
                  className={input}
                  value={bookingForm.phone}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Pickup Location</label>
                <select
                  className={input}
                  value={bookingForm.pickupLocation}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, pickupLocation: e.target.value })
                  }
                >
                  <option value="zyra">Office</option>
                  <option value="aeroport">Airport</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Dropoff Location</label>
                <select
                  className={input}
                  value={bookingForm.dropoffLocation}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, dropoffLocation: e.target.value })
                  }
                >
                  <option value="zyra">Office</option>
                  <option value="aeroport">Airport</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Start Date</label>
                <input
                  className={input}
                  type="date"
                  value={bookingForm.startDate}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">End Date</label>
                <input
                  className={input}
                  type="date"
                  value={bookingForm.endDate}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, endDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Notes (optional)</label>
                <input
                  className={input}
                  value={bookingForm.notes}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={bookingSaving}
                className="rounded-lg bg-[#caa24a] px-6 py-2 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-50"
              >
                {bookingSaving ? "Creating..." : "Create Booking"}
              </button>
              <button
                type="button"
                onClick={() => setShowBooking(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-6 py-2 text-sm text-white/60 hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── All reservations for this car ── */}
      {selectedCarId && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            All Reservations — {selectedCar?.brand} {selectedCar?.model}
          </h3>
          {reservations.filter((r) => r.carId === selectedCarId).length === 0 ? (
            <p className="text-sm text-white/40">No reservations for this car.</p>
          ) : (
            <div className="space-y-3">
              {reservations
                .filter((r) => r.carId === selectedCarId)
                .map((r) => {
                  const statusName = getStatusName(r.status);
                  const hasDocuments = Array.isArray(r.documents) && r.documents.length > 0;
                  return (
                    <ReservationCard
                      key={r.id}
                      reservation={r}
                      statusName={statusName}
                      statusColors={statusColors}
                      hasDocuments={hasDocuments}
                      onConfirm={() => changeStatus(r.id, "Confirmed")}
                      onCancel={() => changeStatus(r.id, "Cancelled")}
                      onDelete={async () => {
                        try {
                          await deleteReservation(r.id, token);
                          await load();
                        } catch (err) {
                          if (!handle401(err)) alert(err.message);
                        }
                      }}
                      onNotesUpdated={load}
                      cars={cars}
                      token={token}
                    />
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
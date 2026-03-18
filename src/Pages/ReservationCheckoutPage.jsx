import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cars } from "../data/cars";
import { useTranslation } from "react-i18next";

function buildWhatsAppLink(phoneE164, message) {
  const digits = String(phoneE164 || "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${digits}?text=${text}`;
}

function formatLocation(t, code) {
  if (!code) return "-";
  const map = {
    zyra: t("reservation.locations.office"),
    aeroport: t("reservation.locations.airport"),
  };
  return map[code] ?? code;
}

function safeStr(v) {
  return (v ?? "").toString().trim();
}

function pad(n) {
  return String(n).padStart(2, "0");
}
function toDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toTime(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ReservationCheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();

  const carId = sp.get("carId") || sp.get("cardId");

  const pickupLocationQ = sp.get("pickupLocation");
  const dropoffLocationQ = sp.get("dropoffLocation");
  const pickupDateQ = sp.get("pickupDate");
  const pickupTimeQ = sp.get("pickupTime");
  const dropoffDateQ = sp.get("dropoffDate");
  const dropoffTimeQ = sp.get("dropoffTime");

  const car = useMemo(
    () => cars.find((c) => String(c.id) === String(carId)),
    [carId],
  );

  const hasReservation =
    !!pickupLocationQ &&
    !!dropoffLocationQ &&
    !!pickupDateQ &&
    !!pickupTimeQ &&
    !!dropoffDateQ &&
    !!dropoffTimeQ;

  // --- reservation inputs (used only when missing)
  const now = useMemo(() => new Date(), []);
  const [hasDropoffLocation, setHasDropoffLocation] = useState(false);

  const [pickupLocation, setPickupLocation] = useState(
    pickupLocationQ || "zyra",
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    dropoffLocationQ || "zyra",
  );

  const [pickupDate, setPickupDate] = useState(pickupDateQ || toDate(now));
  const [pickupTime, setPickupTime] = useState(pickupTimeQ || toTime(now));

  const [dropoffDate, setDropoffDate] = useState(dropoffDateQ || toDate(now));
  const [dropoffTime, setDropoffTime] = useState(dropoffTimeQ || toTime(now));

  // --- customer inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const BUSINESS_WHATSAPP = "+355685845850";

  const finalPickupLocation = pickupLocationQ || pickupLocation;
  const finalDropoffLocation =
    dropoffLocationQ || (hasDropoffLocation ? dropoffLocation : pickupLocation);

  const finalPickupDate = pickupDateQ || pickupDate;
  const finalPickupTime = pickupTimeQ || pickupTime;
  const finalDropoffDate = dropoffDateQ || dropoffDate;
  const finalDropoffTime = dropoffTimeQ || dropoffTime;

  const reservationReady =
    !!finalPickupLocation &&
    !!finalDropoffLocation &&
    !!finalPickupDate &&
    !!finalPickupTime &&
    !!finalDropoffDate &&
    !!finalDropoffTime;

  const canSubmit =
    !!safeStr(fullName) &&
    !!safeStr(email) &&
    !!safeStr(phone) &&
    !!carId &&
    reservationReady;

  const saveReservationToUrl = () => {
    const next = new URLSearchParams(sp);

    next.set("carId", carId || "");
    next.delete("cardId");

    next.set("pickupLocation", finalPickupLocation);
    next.set("dropoffLocation", finalDropoffLocation);
    next.set("pickupDate", finalPickupDate);
    next.set("pickupTime", finalPickupTime);
    next.set("dropoffDate", finalDropoffDate);
    next.set("dropoffTime", finalDropoffTime);

    setSp(next, { replace: true });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const carLine = car
      ? `${car.brand} ${car.model} (${car.year})`
      : t("reservation.checkout.carNotFound");

    const finalSummary = [
      "Rental Tirana VIP — Rezervim",
      "",
      `Makina: ${carLine}`,
      `Pranim: ${formatLocation(t, finalPickupLocation)}`,
      `Dorëzim: ${formatLocation(t, finalDropoffLocation)}`,
      `Nga: ${finalPickupDate || "-"} ${finalPickupTime || ""}`,
      `Deri: ${finalDropoffDate || "-"} ${finalDropoffTime || ""}`,
      "",
      "Te dhenat e klientit:",
      `Emer: ${safeStr(fullName) || "-"}`,
      `Email: ${safeStr(email) || "-"}`,
      `Telefon: ${safeStr(phone) || "-"}`,
      safeStr(message) ? `Mesazh: ${safeStr(message)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (!hasReservation) saveReservationToUrl();
    window.location.href = buildWhatsAppLink(BUSINESS_WHATSAPP, finalSummary);
  };

  const input =
    "h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none " +
    "placeholder:text-white/30 focus:border-[#caa24a]/60";

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20">
      <div className="mx-auto w-full max-w-3xl px-4">
        {/* Top summary card */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">
                {t("reservation.checkout.title")}
              </h1>
              <p className="mt-2 text-white/60 text-sm">
                {t("reservation.checkout.subtitle")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
            >
              {t("reservation.checkout.back")}
            </button>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-widest text-white/40">
                {t("reservation.checkout.car")}
              </p>
              <p className="mt-2 font-semibold">
                {car
                  ? `${car.brand} ${car.model}`
                  : t("reservation.checkout.carNotFound")}
              </p>
              <p className="text-white/50">{car?.year ?? "-"}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-widest text-white/40">
                {t("reservation.checkout.reservation")}
              </p>

              <p className="mt-2">
                <span className="text-white/50">
                  {t("reservation.pickupLocation")}:
                </span>{" "}
                {formatLocation(t, finalPickupLocation)}
              </p>
              <p>
                <span className="text-white/50">
                  {t("reservation.dropoffLocation")}:
                </span>{" "}
                {formatLocation(t, finalDropoffLocation)}
              </p>
              <p className="mt-2 text-white/70">
                {finalPickupDate || "-"} {finalPickupTime || ""}{" "}
                <span className="text-white/50">→</span>{" "}
                {finalDropoffDate || "-"} {finalDropoffTime || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Reservation picker shown ONLY if missing in URL */}
        {!hasReservation && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">
              {t("reservation.checkout.pickReservationTitle")}
            </h2>
            <p className="mt-2 text-sm text-white/60">
              {t("reservation.checkout.pickReservationSubtitle")}
            </p>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/90">
                  {t("reservation.pickupLocation")}
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className={input}
                >
                  <option value="zyra">
                    {t("reservation.locations.office")}
                  </option>
                  <option value="aeroport">
                    {t("reservation.locations.airport")}
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white/90">
                  {t("reservation.dropoffLocation")}
                </label>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={hasDropoffLocation}
                    onChange={(e) => setHasDropoffLocation(e.target.checked)}
                    className="accent-vipGold-400"
                  />
                  {t("reservation.checkout.differentDropoff")}
                </label>
              </div>

              {hasDropoffLocation && (
                <div>
                  <select
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className={input}
                  >
                    <option value="zyra">
                      {t("reservation.locations.office")}
                    </option>
                    <option value="aeroport">
                      {t("reservation.locations.airport")}
                    </option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">
                    {t("reservation.pickupDate")}
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className={input}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">
                    {t("reservation.pickupTime")}
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className={input}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">
                    {t("reservation.dropoffDate")}
                  </label>
                  <input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className={input}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/90">
                    {t("reservation.dropoffTime")}
                  </label>
                  <input
                    type="time"
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    className={input}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={saveReservationToUrl}
                className="mt-2 h-11 w-full rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15"
              >
                {t("reservation.checkout.saveReservation")}
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/90">
                {t("reservation.checkout.fullName")}
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={input}
                placeholder={t("reservation.checkout.fullNamePh")}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/90">
                {t("reservation.checkout.email")}
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className={input}
                placeholder={t("reservation.checkout.emailPh")}
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/90">
                {t("reservation.checkout.phone")}
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                className={input}
                placeholder={t("reservation.checkout.phonePh")}
                required
              />
            </div>

            {/* Documents block (UI only for now) */}
            <div className="rounded-2xl border border-[#caa24a]/25 bg-[#caa24a]/5 p-5">
              <div className="flex items-center gap-2">
                <span className="text-[#caa24a] text-lg">⬆️</span>
                <p className="text-lg font-semibold">
                  {t("reservation.checkout.documentsTitle")}{" "}
                  <span className="text-[#caa24a]">*</span>
                </p>
              </div>
              <p className="mt-2 text-sm text-white/60">
                {t("reservation.checkout.documentsHint")}
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-white/80">
                    {t("reservation.checkout.idDocument")}
                  </p>
                  <label className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-black/20 text-sm text-white/80 hover:bg-black/30">
                    ⬆️ {t("reservation.checkout.uploadId")}
                    <input type="file" className="hidden" />
                  </label>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-white/80">
                    {t("reservation.checkout.driverLicense")}
                  </p>
                  <label className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-black/20 text-sm text-white/80 hover:bg-black/30">
                    ⬆️ {t("reservation.checkout.uploadLicense")}
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white/90">
                {t("reservation.checkout.optionalMessage")}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-[#caa24a]/60"
                placeholder={t("reservation.checkout.optionalMessagePh")}
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={`h-12 w-full rounded-xl font-semibold transition ${
                canSubmit
                  ? "bg-[#caa24a] text-black hover:brightness-110"
                  : "bg-white/15 text-white/40 cursor-not-allowed"
              }`}
            >
              {t("reservation.checkout.ctaWhatsApp")}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-white/50">
              <span>🔒</span>
              <span>{t("reservation.checkout.secureNote")}</span>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

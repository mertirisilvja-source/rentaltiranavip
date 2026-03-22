import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCarById, checkCarAvailability } from "../services/carsApi";
import { createReservation, uploadReservationDocument } from "../services/adminApi";

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

  const [car, setCar] = useState(null);
  const [carLoading, setCarLoading] = useState(true);
  const [carError, setCarError] = useState("");

  const hasReservation =
    !!pickupLocationQ &&
    !!dropoffLocationQ &&
    !!pickupDateQ &&
    !!pickupTimeQ &&
    !!dropoffDateQ &&
    !!dropoffTimeQ;

  const now = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return d;
  }, [now]);
  const [hasDropoffLocation, setHasDropoffLocation] = useState(false);

  const [pickupLocation, setPickupLocation] = useState(
    pickupLocationQ || "zyra",
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    dropoffLocationQ || "zyra",
  );

  const [pickupDate, setPickupDate] = useState(pickupDateQ || toDate(now));
  const [pickupTime, setPickupTime] = useState(pickupTimeQ || toTime(now));

  const [dropoffDate, setDropoffDate] = useState(dropoffDateQ || toDate(tomorrow));
  const [dropoffTime, setDropoffTime] = useState(dropoffTimeQ || toTime(now));

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [idDocFiles, setIdDocFiles] = useState([]);
  const [licenseFiles, setLicenseFiles] = useState([]);
  const BUSINESS_WHATSAPP = "+355685845850";

  // When pickup date changes, ensure dropoff is at least the next day
  const handlePickupDateChange = (val) => {
    setPickupDate(val);
    const pickup = new Date(val);
    const dropoff = new Date(dropoffDate);
    if (dropoff <= pickup) {
      const next = new Date(pickup);
      next.setDate(next.getDate() + 1);
      setDropoffDate(toDate(next));
    }
  };

  // When dropoff date changes, ensure it's after pickup
  const handleDropoffDateChange = (val) => {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(val);
    if (dropoff <= pickup) {
      const next = new Date(pickup);
      next.setDate(next.getDate() + 1);
      setDropoffDate(toDate(next));
    } else {
      setDropoffDate(val);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function loadCar() {
      if (!carId) {
        setCar(null);
        setCarLoading(false);
        return;
      }

      try {
        setCarLoading(true);
        setCarError("");

        const data = await fetchCarById(carId);

        if (!ignore) {
          setCar(data);
        }
      } catch (err) {
        if (!ignore) {
          setCarError(err.message || "Failed to load car.");
        }
      } finally {
        if (!ignore) setCarLoading(false);
      }
    }

    loadCar();

    return () => {
      ignore = true;
    };
  }, [carId]);

  // Real-time availability check when dates change
  const [isAvailable, setIsAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const currentPickupDate = pickupDateQ || pickupDate;
  const currentPickupTime = pickupTimeQ || pickupTime;
  const currentDropoffDate = dropoffDateQ || dropoffDate;
  const currentDropoffTime = dropoffTimeQ || dropoffTime;

  useEffect(() => {
    if (!carId || !currentPickupDate || !currentDropoffDate) {
      setIsAvailable(true);
      return;
    }

    let ignore = false;
    setCheckingAvailability(true);
    setSubmitError("");

    const startDateUtc = `${currentPickupDate}T${currentPickupTime || "00:00"}:00`;
    const endDateUtc = `${currentDropoffDate}T${currentDropoffTime || "23:59"}:00`;

    checkCarAvailability(carId, startDateUtc, endDateUtc)
      .then((available) => {
        if (!ignore) setIsAvailable(available);
      })
      .catch(() => {
        if (!ignore) setIsAvailable(true); // fail open
      })
      .finally(() => {
        if (!ignore) setCheckingAvailability(false);
      });

    return () => { ignore = true; };
  }, [carId, currentPickupDate, currentPickupTime, currentDropoffDate, currentDropoffTime]);

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

  const selectedDays = currentPickupDate && currentDropoffDate
    ? Math.ceil((new Date(currentDropoffDate) - new Date(currentPickupDate)) / (1000 * 60 * 60 * 24))
    : 0;
  const isTooLong = selectedDays > 7;

  const canSubmit =
    !!safeStr(fullName) &&
    !!safeStr(email) &&
    !!safeStr(phone) &&
    !!carId &&
    !!car &&
    reservationReady &&
    !carLoading &&
    isAvailable &&
    !checkingAvailability &&
    !isTooLong;

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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitError("");
    setSubmitting(true);

    try {
      // Build start/end datetimes
      const startDateUtc = new Date(`${finalPickupDate}T${finalPickupTime || "00:00"}`).toISOString();
      const endDateUtc = new Date(`${finalDropoffDate}T${finalDropoffTime || "23:59"}`).toISOString();

      // Create reservation in the backend (checks availability)
      const reservation = await createReservation({
        carId,
        fullName: safeStr(fullName),
        email: safeStr(email),
        phone: safeStr(phone),
        pickupLocation: finalPickupLocation,
        dropoffLocation: finalDropoffLocation,
        startDateUtc,
        endDateUtc,
        notes: safeStr(message) || null,
      });

      // Upload documents if provided (don't block on failure)
      const reservationId = reservation.id;
      if (reservationId) {
        const uploads = [];
        if (idDocFiles.length > 0)
          uploads.push(uploadReservationDocument(reservationId, "id_document", idDocFiles));
        if (licenseFiles.length > 0)
          uploads.push(uploadReservationDocument(reservationId, "driver_license", licenseFiles));
        if (uploads.length > 0) {
          try { await Promise.all(uploads); } catch (e) { console.warn("Document upload failed:", e); }
        }
      }

      // Reservation created — now redirect to WhatsApp
      const carLine = car
        ? `${car.brand} ${car.model} (${car.year})`
        : t("reservation.checkout.carNotFound");

      const finalSummary = [
        "Rental Tirana VIP - Rezervim",
        "",
        `Makina: ${carLine}`,
        `Pranim: ${formatLocation(t, finalPickupLocation)}`,
        `Dorezim: ${formatLocation(t, finalDropoffLocation)}`,
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
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("409") || msg.toLowerCase().includes("not available")) {
        setSubmitError(t("reservation.checkout.carUnavailable", "This car is already booked for the selected dates. Please choose different dates."));
      } else {
        setSubmitError(msg || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    "h-11 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white outline-none " +
    "placeholder:text-white/30 focus:border-[#caa24a]/60";

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20">
      <div className="mx-auto w-full max-w-3xl px-4">
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
                {carLoading
                  ? "Loading..."
                  : car
                    ? `${car.brand} ${car.model}`
                    : t("reservation.checkout.carNotFound")}
              </p>
              <p className="text-white/50">{car?.year ?? "-"}</p>
              {car && (
                <div className="mt-2 border-t border-white/10 pt-2">
                  <p className="text-white/50">
                    €{car.pricePerDay} / {t("collections.day")}
                  </p>
                  {(() => {
                    const pd = currentPickupDate;
                    const dd = currentDropoffDate;
                    if (!pd || !dd) return null;
                    const days = Math.ceil(
                      (new Date(dd) - new Date(pd)) / (1000 * 60 * 60 * 24)
                    );
                    if (days <= 0) return null;

                    if (days > 7) {
                      return (
                        <div className="mt-2 rounded-lg border border-[#caa24a]/30 bg-[#caa24a]/10 px-3 py-2">
                          <p className="text-xs font-medium text-white">
                            {days} {t("pricing.days")} — {t("pricing.contactForPrice")}
                          </p>
                          <a
                            href="https://wa.me/355685845850"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            {t("pricing.contactWhatsApp")}
                          </a>
                        </div>
                      );
                    }

                    let effectivePerDay, total;
                    if (days === 2 && car.price2Days > 0) {
                      total = car.price2Days;
                      effectivePerDay = total / 2;
                    } else if (days >= 3 && car.price3to7PerDay > 0) {
                      effectivePerDay = car.price3to7PerDay;
                      total = days * effectivePerDay;
                    } else {
                      effectivePerDay = car.pricePerDay;
                      total = days * effectivePerDay;
                    }

                    const hasDiscount = effectivePerDay < car.pricePerDay;

                    return (
                      <>
                        {hasDiscount && (
                          <p className="mt-1 text-xs font-medium text-green-400">
                            {t("pricing.discounted")} — €{effectivePerDay}/{t("collections.day")}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-white/60">
                          {days} {days === 1 ? t("collections.day") : t("pricing.days")} × €{effectivePerDay}
                        </p>
                        <p className="text-sm font-semibold text-[#caa24a]">
                          {t("pricing.total")}: €{total}
                        </p>
                      </>
                    );
                  })()}
                </div>
              )}
              {!!carError && (
                <p className="mt-2 text-xs text-red-300">{carError}</p>
              )}
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
                    onChange={(e) => handlePickupDateChange(e.target.value)}
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
                    min={(() => {
                      const d = new Date(pickupDate);
                      d.setDate(d.getDate() + 1);
                      return toDate(d);
                    })()}
                    onChange={(e) => handleDropoffDateChange(e.target.value)}
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

              {!isAvailable && !checkingAvailability && (
                <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-200">
                  {t("reservation.checkout.carUnavailable", "This car is already booked for the selected dates. Please choose different dates.")}
                </div>
              )}

              {checkingAvailability && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/60">
                  {t("reservation.checking", "Checking availability...")}
                </div>
              )}

              <button
                type="button"
                onClick={saveReservationToUrl}
                disabled={!isAvailable || checkingAvailability}
                className={`mt-2 h-11 w-full rounded-xl font-semibold ${
                  !isAvailable
                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                {t("reservation.checkout.saveReservation")}
              </button>
            </div>
          </div>
        )}

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
                  <label className={`flex min-h-[3rem] w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed px-3 py-2 text-sm transition ${
                    idDocFiles.length > 0
                      ? "border-green-500/40 bg-green-500/5 text-green-300"
                      : "border-white/20 bg-black/20 text-white/80 hover:bg-black/30"
                  }`}>
                    {idDocFiles.length > 0
                      ? `✓ ${idDocFiles.map(f => f.name).join(", ")}`
                      : `⬆️ ${t("reservation.checkout.uploadId")}`}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(e) => setIdDocFiles(Array.from(e.target.files || []))}
                    />
                  </label>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-white/80">
                    {t("reservation.checkout.driverLicense")}
                  </p>
                  <label className={`flex min-h-[3rem] w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed px-3 py-2 text-sm transition ${
                    licenseFiles.length > 0
                      ? "border-green-500/40 bg-green-500/5 text-green-300"
                      : "border-white/20 bg-black/20 text-white/80 hover:bg-black/30"
                  }`}>
                    {licenseFiles.length > 0
                      ? `✓ ${licenseFiles.map(f => f.name).join(", ")}`
                      : `⬆️ ${t("reservation.checkout.uploadLicense")}`}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      multiple
                      onChange={(e) => setLicenseFiles(Array.from(e.target.files || []))}
                    />
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

            {!isAvailable && !checkingAvailability && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {t("reservation.checkout.carUnavailable", "This car is already booked for the selected dates. Please choose different dates.")}
              </div>
            )}

            {checkingAvailability && (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60">
                {t("reservation.checking", "Checking availability...")}
              </div>
            )}

            {submitError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {submitError}
              </div>
            )}

            {isTooLong ? (
              <div className="rounded-xl border border-[#caa24a]/30 bg-[#caa24a]/10 p-4 text-center">
                <p className="text-sm font-medium text-white">{t("pricing.contactForPrice")}</p>
                <a
                  href="https://wa.me/355685845850"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block h-12 rounded-xl bg-green-600 px-8 leading-[3rem] text-sm font-semibold text-white hover:bg-green-700"
                >
                  {t("pricing.contactWhatsApp")}
                </a>
                <p className="mt-2 text-xs text-white/50">{t("pricing.longRentalNote")}</p>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className={`h-12 w-full rounded-xl font-semibold transition ${
                  canSubmit && !submitting
                    ? "bg-[#caa24a] text-black hover:brightness-110"
                    : "bg-white/15 text-white/40 cursor-not-allowed"
                }`}
              >
                {submitting
                  ? t("reservation.checkout.submitting")
                  : !isAvailable
                    ? t("reservation.unavailable")
                    : t("reservation.checkout.ctaWhatsApp")}
              </button>
            )}

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

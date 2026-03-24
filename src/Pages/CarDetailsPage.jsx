import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCarById, checkCarAvailability } from "../services/carsApi";

function formatLocation(t, code) {
  if (!code) return "-";

  const map = {
    zyra: t("reservation.locations.office"),
    aeroport: t("reservation.locations.airport"),
  };

  return map[code] ?? code;
}

export default function CarDetailsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [sp] = useSearchParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadCar() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCarById(id);

        if (!ignore) {
          setCar(data);
          setActiveImg(0);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load car.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (id) loadCar();

    return () => {
      ignore = true;
    };
  }, [id]);

  // Check availability when we have dates
  const pickupDate = sp.get("pickupDate");
  const pickupTime = sp.get("pickupTime");
  const dropoffDate = sp.get("dropoffDate");
  const dropoffTime = sp.get("dropoffTime");

  useEffect(() => {
    if (!id || !pickupDate || !pickupTime || !dropoffDate || !dropoffTime) {
      setIsAvailable(true);
      return;
    }

    let ignore = false;
    setCheckingAvailability(true);

    const startDateUtc = `${pickupDate}T${pickupTime}:00`;
    const endDateUtc = `${dropoffDate}T${dropoffTime}:00`;

    checkCarAvailability(id, startDateUtc, endDateUtc)
      .then((available) => {
        if (!ignore) setIsAvailable(available);
      })
      .catch(() => {
        if (!ignore) setIsAvailable(true); // fail open
      })
      .finally(() => {
        if (!ignore) setCheckingAvailability(false);
      });

    return () => {
      ignore = true;
    };
  }, [id, pickupDate, pickupTime, dropoffDate, dropoffTime]);

  const gallery = useMemo(() => {
    if (!car) return [];
    if (Array.isArray(car.images) && car.images.length > 0) return car.images;
    return [];
  }, [car]);

  const pickupLocation = sp.get("pickupLocation");
  const dropoffLocation = sp.get("dropoffLocation");

  const handleContinue = () => {
    if (!car) return;
    const qs = sp.toString();
    navigate(`/reservation?carId=${car.id}${qs ? `&${qs}` : ""}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-black px-4 pt-24 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-white/70">Loading car...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-black px-4 pt-24 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-red-300">{error}</p>
        </div>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-black px-4 pt-24 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-white/70">Makina nuk u gjet.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pt-20 pb-10 text-white sm:pt-24 sm:pb-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition"
        >
          <span>&larr;</span> {t("reservation.checkout.back")}
        </button>

        <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/80 sm:mb-8 sm:p-4 sm:text-sm">
          <div className="flex min-w-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 break-words leading-relaxed">
              <span className="text-white/50">
                {t("reservation.pickupLocation")}:
              </span>{" "}
              {formatLocation(t, pickupLocation)}
              <span className="mx-2 text-white/50">•</span>
              <span className="text-white/50">
                {t("reservation.dropoffLocation")}:
              </span>{" "}
              {formatLocation(t, dropoffLocation)}
            </div>

            <div className="min-w-0 break-words leading-relaxed text-white/70">
              {pickupDate || "-"} {pickupTime || ""}
              <span className="mx-2 text-white/50">→</span>
              {dropoffDate || "-"} {dropoffTime || ""}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="order-2 min-w-0 lg:order-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
              <h1 className="break-words text-2xl font-semibold leading-tight sm:text-4xl">
                {car.brand} {car.model}
              </h1>

              <p className="mt-2 text-sm text-white/60 sm:text-base">
                {car.year}
              </p>

              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-widest text-white/40 sm:text-xs">
                  {t("collections.pricePerDay")}
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#caa24a] sm:text-4xl">
                  €{car.pricePerDay}
                </p>
                {pickupDate && dropoffDate && (() => {
                  const days = Math.ceil(
                    (new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
                  );
                  if (days <= 0) return null;

                  if (days > 7) {
                    return (
                      <div className="mt-2 rounded-lg border border-[#caa24a]/30 bg-[#caa24a]/10 px-3 py-3">
                        <p className="text-sm font-medium text-white">
                          {days} {t("pricing.days")} — {t("pricing.contactForPrice")}
                        </p>
                        <a
                          href="https://wa.me/355685845850"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
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
                    <div className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                      {hasDiscount && (
                        <p className="mb-1 text-xs font-medium text-green-400">
                          {t("pricing.discounted")} — €{effectivePerDay}/{t("collections.day")}
                        </p>
                      )}
                      <p className="text-sm text-white/60">
                        {days} {days === 1 ? t("collections.day") : t("pricing.days")} × €{effectivePerDay}
                      </p>
                      <p className="text-lg font-semibold text-white">
                        {t("pricing.total")}: €{total}
                      </p>
                    </div>
                  );
                })()}
              </div>

              <div className="mt-5 space-y-3 text-sm text-white/80 sm:mt-6">
                <div className="leading-relaxed">
                  ⛽ {t("specs.fuel")}:{" "}
                  {car.fuelKey ? t(car.fuelKey) : car.fuelType || "-"}
                </div>
                <div className="leading-relaxed">
                  ⚙️ {t("specs.gearbox")}:{" "}
                  {car.gearboxKey ? t(car.gearboxKey) : car.gearbox || "-"}
                </div>
                <div className="leading-relaxed">
                  👤 {t("specs.seats")}: {car.seats ?? "-"}
                </div>
              </div>

              {!isAvailable && (
                <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-200 sm:mt-7">
                  {t("reservation.carBooked")}
                </div>
              )}

              {pickupDate && dropoffDate && Math.ceil((new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)) > 7 ? (
                <p className="mt-4 text-center text-sm text-white/50">
                  {t("pricing.longRentalNote")}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={!isAvailable || checkingAvailability}
                  className={`mt-4 h-12 w-full rounded-xl px-4 text-sm font-semibold transition active:scale-[0.98] sm:text-base ${
                    !isAvailable
                      ? "cursor-not-allowed bg-white/10 text-white/40"
                      : "bg-[#caa24a] text-black hover:brightness-110"
                  }`}
                >
                  {checkingAvailability
                    ? t("reservation.checking")
                    : !isAvailable
                      ? t("reservation.unavailable")
                      : t("reservation.continue")}
                </button>
              )}

              <p className="mt-3 break-words text-xs leading-relaxed text-white/40">
                {t("reservation.noteDifferentTime")}
              </p>
            </div>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              <img
                src={gallery[activeImg] || "https://via.placeholder.com/1200x800?text=No+Image"}
                alt={`${car.brand} ${car.model}`}
                className="h-[220px] w-full object-contain sm:h-[360px] lg:h-[520px]"
              />
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:mt-4 sm:gap-3">
                {gallery.map((img, idx) => (
                  <button
                    key={`${car.id}-${idx}`}
                    type="button"
                    onClick={() => setActiveImg(idx)}
                    className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition sm:h-20 sm:w-28 ${
                      idx === activeImg
                        ? "border-[#caa24a]"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    title={t("collections.photoTitle", { n: idx + 1 })}
                  >
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

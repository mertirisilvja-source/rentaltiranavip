import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CarCollections from "../Components/CarCollections";
import { fetchCars } from "../services/carsApi";

export default function AvailableCarsPage() {
  const { t } = useTranslation();
  const [sp] = useSearchParams();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pickupLocation = sp.get("pickupLocation");
  const dropoffLocation = sp.get("dropoffLocation");
  const pickupDate = sp.get("pickupDate");
  const pickupTime = sp.get("pickupTime");
  const dropoffDate = sp.get("dropoffDate");
  const dropoffTime = sp.get("dropoffTime");

  const hasReservation =
    pickupLocation &&
    dropoffLocation &&
    pickupDate &&
    pickupTime &&
    dropoffDate &&
    dropoffTime;

  useEffect(() => {
    let ignore = false;

    async function loadCars() {
      try {
        setLoading(true);
        setError("");

        // Build ISO date strings so the backend can filter out booked cars
        const opts = {};
        if (pickupDate && pickupTime && dropoffDate && dropoffTime) {
          opts.startDateUtc = `${pickupDate}T${pickupTime}:00`;
          opts.endDateUtc = `${dropoffDate}T${dropoffTime}:00`;
        }

        const data = await fetchCars(opts);

        if (!ignore) {
          setCars(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Failed to load cars.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCars();

    return () => {
      ignore = true;
    };
  }, [pickupDate, pickupTime, dropoffDate, dropoffTime]);

  const list = useMemo(() => {
    return [...cars]
      .filter((c) => c.available !== false)
      .sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0));
  }, [cars]);

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        {hasReservation && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-white/80">
                <span className="text-white/50">
                  {t("reservation.pickupLocation")}:
                </span>{" "}
                {pickupLocation} <span className="text-white/50">•</span>{" "}
                <span className="text-white/50">
                  {t("reservation.dropoffLocation")}:
                </span>{" "}
                {dropoffLocation}
              </div>

              <div className="text-white/70">
                {pickupDate} {pickupTime}{" "}
                <span className="text-white/50">→</span> {dropoffDate}{" "}
                {dropoffTime}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            Loading cars...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        ) : (
          <CarCollections carsOverride={list} />
        )}
      </div>
    </main>
  );
}

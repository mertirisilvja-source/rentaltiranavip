import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CarCollections from "../Components/CarCollections";
import { cars } from "../data/cars";

export default function AvailableCarsPage() {
  const { t } = useTranslation();
  const [sp] = useSearchParams();

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

  const list = useMemo(() => {
    return cars.filter((c) => c.available !== false);
  }, []);

  return (
    <main className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* res. summary bar */}
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

        {/* car list */}
        <CarCollections carsOverride={list} />
      </div>
    </main>
  );
}

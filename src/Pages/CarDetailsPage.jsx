import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cars } from "../data/cars";

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

  const car = useMemo(
    () => cars.find((c) => String(c.id) === String(id)),
    [id],
  );

  const [activeImg, setActiveImg] = useState(0);

  if (!car) {
    return (
      <main className="min-h-screen bg-black text-white pt-28 px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-white/70">Makina nuk u gjet.</p>
        </div>
      </main>
    );
  }

  const pickupLocation = sp.get("pickupLocation");
  const dropoffLocation = sp.get("dropoffLocation");
  const pickupDate = sp.get("pickupDate");
  const pickupTime = sp.get("pickupTime");
  const dropoffDate = sp.get("dropoffDate");
  const dropoffTime = sp.get("dropoffTime");

  const handleContinue = () => {
    const qs = sp.toString();
    navigate(`/reservation?carId=${car.id}${qs ? `&${qs}` : ""}`);
  };

  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Reservation summary */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-white/50">
                {t("reservation.pickupLocation")}:
              </span>{" "}
              {formatLocation(t, pickupLocation)}
              {"  "}
              <span className="text-white/50">•</span>
              {"  "}
              <span className="text-white/50">
                {t("reservation.dropoffLocation")}:
              </span>{" "}
              {formatLocation(t, dropoffLocation)}
            </div>
            <div className="text-white/70">
              {pickupDate || "-"} {pickupTime || ""}{" "}
              <span className="text-white/50">→</span> {dropoffDate || "-"}{" "}
              {dropoffTime || ""}
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              <img
                src={car.images?.[activeImg]}
                alt={`${car.brand} ${car.model}`}
                className="h-[440px] w-full object-cover"
              />
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto">
              {(car.images || []).map((img, idx) => (
                <button
                  key={`${car.id}-${idx}`}
                  onClick={() => setActiveImg(idx)}
                  className={`h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border transition ${
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
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-semibold">
              {car.brand} {car.model}
            </h1>
            <p className="mt-2 text-white/60">{car.year}</p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-widest text-white/40">
                {t("collections.pricePerDay")}
              </p>
              <p className="mt-2 text-4xl font-semibold text-[#caa24a]">
                €{car.pricePerDay}
              </p>

              <div className="mt-6 space-y-3 text-sm text-white/80">
                <div>
                  ⛽ {t("specs.fuel")}: {car.fuelKey ? t(car.fuelKey) : "-"}
                </div>
                <div>
                  ⚙️ {t("specs.gearbox")}:{" "}
                  {car.gearboxKey ? t(car.gearboxKey) : "-"}
                </div>
                <div>
                  👤 {t("specs.seats")}: {car.seats ?? "-"}
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="mt-7 h-11 w-full rounded-lg bg-[#caa24a] text-black font-semibold hover:brightness-110 active:scale-[0.98]"
              >
                {t("reservation.continue")}
              </button>

              <p className="mt-3 text-xs text-white/40">
                {t("reservation.noteDifferentTime")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

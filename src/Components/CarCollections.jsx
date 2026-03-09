import { useMemo, useState } from "react";
import { cars as carsData } from "../data/cars";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CarCollections({ carsOverride }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");

  // if passed from /cars page (filtered), use that list — otherwise use all cars
  const list = carsOverride ?? carsData;

  const getMainImage = (car) => car.images?.[0];

  const filteredCars = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((car) => {
      const hay = `${car.brand} ${car.model} ${car.year}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, list]);

  const goToCarDetails = (car) => {
    const qs = searchParams.toString();
    navigate(qs ? `/cars/${car.id}?${qs}` : `/cars/${car.id}`);
  };

  return (
    <section id="cars" className="w-full pt-32 pb-14">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-white">
              {t("collections.title")}
            </h2>
            <p className="mt-2 text-white/60">{t("collections.subtitle")}</p>
          </div>

          {/* search */}
          <div className="w-full md:w-[360px]">
            <label className="mb-2 block text-xs uppercase tracking-widest text-white/40">
              {t("collections.searchLabel")}
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("collections.searchPlaceholder")}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none backdrop-blur focus:border-[#caa24a]/60"
            />
          </div>
        </div>

        {/* grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <article
              key={car.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur"
            >
              {/* main img */}
              <div className="relative h-64 w-full overflow-hidden bg-black/40">
                <img
                  src={getMainImage(car)}
                  alt={`${car.brand} ${car.model}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />

                {/* badge (optional: keep if your data has car.available) */}
                {typeof car.available === "boolean" && (
                  <div
                    className={`absolute right-4 top-4 rounded-md border px-3 py-1 text-xs tracking-widest ${
                      car.available
                        ? "border-[#caa24a]/40 bg-black/40 text-[#caa24a]"
                        : "border-white/20 bg-black/40 text-white/70"
                    }`}
                  >
                    {car.available
                      ? t("collections.available")
                      : t("collections.notAvailable")}
                  </div>
                )}
              </div>

              {/* content */}
              <div className="p-6">
                {/* brand/model/year are DATA */}
                <h3 className="text-2xl font-semibold text-white">
                  {car.brand}
                </h3>
                <p className="mt-2 text-sm text-white/70">{car.model}</p>
                <p className="text-sm text-white/40">{car.year}</p>

                {/* specs */}
                <div className="mt-5 space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="text-[#caa24a]">⛽</span>
                    <span>
                      <span className="text-white/45">{t("specs.fuel")}:</span>{" "}
                      {car.fuelKey ? t(car.fuelKey) : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#caa24a]">⚙️</span>
                    <span>
                      <span className="text-white/45">
                        {t("specs.gearbox")}:
                      </span>{" "}
                      {car.gearboxKey ? t(car.gearboxKey) : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#caa24a]">👤</span>
                    <span>
                      <span className="text-white/45">{t("specs.seats")}:</span>{" "}
                      {car.seats ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px w-full bg-white/10" />

                {/* price */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/40">
                      {t("collections.pricePerDay")}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-[#caa24a]">
                      €{car.pricePerDay}
                    </p>
                  </div>

                  <button
                    onClick={() => goToCarDetails(car)}
                    className="rounded-lg bg-[#caa24a] px-6 py-2 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.98]"
                  >
                    {t("collections.view")}
                  </button>
                </div>

                <p className="mt-4 text-xs text-white/35">
                  {t("collections.hint")}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* empty state */}
        {filteredCars.length === 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
            {t("collections.emptyState", { query })}
          </div>
        )}
      </div>
    </section>
  );
}

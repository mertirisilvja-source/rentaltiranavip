import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CarCollections({ carsOverride = [] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  const getMainImage = (car) => {
    if (Array.isArray(car.images) && car.images.length > 0) {
      return car.images[0];
    }

    return "https://via.placeholder.com/1200x800?text=Rental+Tirana+VIP";
  };

  const filteredCars = useMemo(() => {
    const list = Array.isArray(carsOverride) ? carsOverride : [];
    const q = query.trim().toLowerCase();

    if (!q) return list;

    return list.filter((car) => {
      const hay =
        `${car.brand || ""} ${car.model || ""} ${car.year || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, carsOverride]);

  const pickupDate = searchParams.get("pickupDate");
  const dropoffDate = searchParams.get("dropoffDate");
  const selectedDays = pickupDate && dropoffDate
    ? Math.ceil((new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const getEffectivePrice = (car) => {
    if (selectedDays === 2 && car.price2Days > 0) {
      return { perDay: car.price2Days / 2, total: car.price2Days, hasDiscount: true };
    }
    if (selectedDays >= 3 && selectedDays <= 7 && car.price3to7PerDay > 0) {
      return { perDay: car.price3to7PerDay, total: selectedDays * car.price3to7PerDay, hasDiscount: true };
    }
    if (selectedDays === 1) {
      return { perDay: car.pricePerDay, total: car.pricePerDay, hasDiscount: false };
    }
    return null;
  };

  const goToCarDetails = (car) => {
    const qs = searchParams.toString();
    navigate(qs ? `/cars/${car.id}?${qs}` : `/cars/${car.id}`);
  };

  return (
    <section id="cars" className="w-full pb-14">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {t("collections.title")}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-white/60">{t("collections.subtitle")}</p>
          </div>

          <div className="w-full md:w-[360px]">
            <label className="mb-2 block text-xs uppercase tracking-widest text-gray-400 dark:text-white/40">
              {t("collections.searchLabel")}
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("collections.searchPlaceholder")}
              className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/35 outline-none backdrop-blur focus:border-[#caa24a]/60"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <article
              key={car.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-lg dark:shadow-[0_0_40px_rgba(0,0,0,0.35)] backdrop-blur"
            >
              <div className="relative h-64 w-full overflow-hidden bg-gray-100 dark:bg-black/40">
                <img
                  src={getMainImage(car)}
                  alt={`${car.brand} ${car.model}`}
                  className="h-full w-full object-cover transition duration-500"
                  loading="lazy"
                />

              </div>

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {car.brand}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-white/70">{car.model}</p>
                <p className="text-sm text-gray-400 dark:text-white/40">{car.year}</p>

                <div className="mt-5 space-y-3 text-sm text-gray-500 dark:text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="text-[#caa24a]">⛽</span>
                    <span>
                      <span className="text-gray-400 dark:text-white/45">{t("specs.fuel")}:</span>{" "}
                      {car.fuelKey ? t(car.fuelKey) : car.fuelType || "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#caa24a]">⚙️</span>
                    <span>
                      <span className="text-gray-400 dark:text-white/45">
                        {t("specs.gearbox")}:
                      </span>{" "}
                      {car.gearboxKey ? t(car.gearboxKey) : car.gearbox || "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#caa24a]">👤</span>
                    <span>
                      <span className="text-gray-400 dark:text-white/45">{t("specs.seats")}:</span>{" "}
                      {car.seats ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px w-full bg-gray-200 dark:bg-white/10" />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    {(() => {
                      const pricing = selectedDays > 0 ? getEffectivePrice(car) : null;

                      if (selectedDays > 7) {
                        return (
                          <>
                            <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/40">
                              {t("collections.pricePerDay")}
                            </p>
                            <p className="mt-1 text-lg font-semibold text-gray-400 dark:text-white/50 line-through">
                              €{car.pricePerDay}
                            </p>
                            <p className="mt-1 text-xs text-[#caa24a]">
                              {t("pricing.contactForPrice")}
                            </p>
                          </>
                        );
                      }

                      if (pricing && pricing.hasDiscount) {
                        return (
                          <>
                            <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/40">
                              {selectedDays} {selectedDays === 1 ? t("collections.day") : t("pricing.days")} — {t("collections.pricePerDay")}
                            </p>
                            <div className="mt-1 flex items-baseline gap-2">
                              <p className="text-3xl font-semibold text-[#caa24a]">
                                €{pricing.perDay}
                              </p>
                              <p className="text-sm text-gray-400 dark:text-white/40 line-through">
                                €{car.pricePerDay}
                              </p>
                            </div>
                            <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                              {t("pricing.total")}: €{pricing.total}
                            </p>
                          </>
                        );
                      }

                      if (pricing) {
                        return (
                          <>
                            <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/40">
                              {t("collections.pricePerDay")}
                            </p>
                            <p className="mt-2 text-3xl font-semibold text-[#caa24a]">
                              €{car.pricePerDay}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-white/50">
                              {t("pricing.total")}: €{pricing.total}
                            </p>
                          </>
                        );
                      }

                      return (
                        <>
                          <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/40">
                            {t("collections.pricePerDay")}
                          </p>
                          <p className="mt-2 text-3xl font-semibold text-[#caa24a]">
                            €{car.pricePerDay}
                          </p>
                        </>
                      );
                    })()}
                  </div>

                  <button
                    onClick={() => goToCarDetails(car)}
                    className="rounded-lg bg-[#caa24a] px-6 py-2 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.98]"
                  >
                    {t("collections.view")}
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-400 dark:text-white/35">
                  {t("collections.hint")}
                </p>
              </div>
            </article>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-8 text-center text-gray-500 dark:text-white/70">
            {t("collections.emptyState", { query })}
          </div>
        )}
      </div>
    </section>
  );
}

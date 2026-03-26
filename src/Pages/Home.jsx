import { useEffect, useState } from "react";
import homeBg from "../assets/home-cars.jpeg";
import ReservationBar from "../Components/ReservationBar";
import About from "./About";
import CarCollections from "../Components/CarCollections";
import { useTranslation } from "react-i18next";
import { fetchCars } from "../services/carsApi";

export default function Home() {
  const { t } = useTranslation();
  const [cars, setCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [carsError, setCarsError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCars() {
      try {
        setLoadingCars(true);
        setCarsError("");

        const data = await fetchCars();

        if (!ignore) {
          setCars(
            data
              .filter((c) => c.available !== false)
              .sort((a, b) => (a.pricePerDay ?? 0) - (b.pricePerDay ?? 0)),
          );
        }
      } catch (err) {
        if (!ignore) {
          setCarsError(err.message || "Failed to load cars.");
        }
      } finally {
        if (!ignore) {
          setLoadingCars(false);
        }
      }
    }

    loadCars();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main>
      <section
        id="rezerve"
        className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${homeBg})` }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 pt-24">
          <h1 className="text-5xl font-semibold text-white md:text-6xl">
            {t("home.title")}
          </h1>

          <p className="mt-3 text-2xl font-semibold text-[#ce910f]">
            {t("home.subtitle")}
          </p>

          <div className="mt-10">
            <ReservationBar />
          </div>
        </div>
      </section>

      <section id="about" className="scroll-mt-28 w-full bg-gray-50 dark:bg-black py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          <About />
        </div>
      </section>

      <section id="cars" className="scroll-mt-28 w-full bg-gray-50 dark:bg-black py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          {loadingCars ? (
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 p-6 text-gray-600 dark:text-white/70">
              Loading cars...
            </div>
          ) : carsError ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-600 dark:text-red-200">
              {carsError}
            </div>
          ) : (
            <CarCollections carsOverride={cars} />
          )}
        </div>
      </section>
    </main>
  );
}

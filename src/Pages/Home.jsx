import homeBg from "../assets/home-cars.jpeg";
import ReservationBar from "../Components/ReservationBar";
import About from "./About";
import CarCollections from "../Components/CarCollections";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main>
      {/* rezervo */}
      <section
        id="rezerve"
        className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${homeBg})` }}
      >
        {/* overlay */}
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

      {/* rreth nesh */}
      <section id="about" className="scroll-mt-28 w-full bg-black py-20">
        <div className="mx-auto w-full max-w-7xl px-4">
          <About />
        </div>
      </section>

      <section id="cars" className="scroll-mt-28 w-full bg-black py-20">
        <CarCollections />
      </section>
    </main>
  );
}

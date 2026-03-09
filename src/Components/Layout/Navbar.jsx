import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/logo.jpeg";

function Navbar() {
  const { t, i18n } = useTranslation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // language code displayed in UI (AL/EN/DE/IT)
  const uiLang = useMemo(() => {
    const lng = (i18n.language || "al").toLowerCase();
    const short = lng.split("-")[0];
    const map = { al: "AL", en: "EN", de: "DE", it: "IT" };
    return map[short] || "AL";
  }, [i18n.language]);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsLangOpen(false);
  };

  const handleLangPick = (code) => {
    const map = { AL: "al", EN: "en", DE: "de", IT: "it" };
    const next = map[code] || "al";

    i18n.changeLanguage(next);
    localStorage.setItem("lang", next);
    setIsLangOpen(false);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setIsLangOpen(false);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Rental Tirana VIP Logo"
            className="h-12 w-12 rounded-full object-cover ring-1 ring-white/15"
          />
          <div className="text-white leading-tight">
            <div className="text-sm tracking-[0.25em] uppercase text-white/90">
              Rental Tirana
            </div>
            <div className="text-[11px] tracking-[0.35em] uppercase">
              <span className="text-vipGold-400 font-semibold">VIP</span>
            </div>
          </div>
        </Link>

        {/* desktop nav */}
        <div className="hidden md:flex items-center gap-10 text-white font-semibold">
          <Link to="/" className="hover:text-vipGold-400 transition">
            {t("nav.rezervo")}
          </Link>

          <Link to="/cars" className="hover:text-vipGold-400 transition">
            {t("nav.koleksioni")}
          </Link>

          <Link to="/contact" className="hover:text-vipGold-400 transition">
            {t("nav.kontakt")}
          </Link>

          <Link to="/about" className="hover:text-vipGold-400 transition">
            {t("nav.rrethNesh")}
          </Link>

          {/* language dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen((prev) => !prev)}
              className="flex items-center gap-2 hover:text-vipGold-400 transition"
              aria-haspopup="menu"
              aria-expanded={isLangOpen}
            >
              {uiLang}
              <ChevronDownIcon className="w-4 h-4 text-white/80" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-28 rounded-xl bg-black/90 border border-white/10 shadow-xl overflow-hidden">
                {["AL", "EN", "DE", "IT"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleLangPick(code)}
                    className={`w-full text-left px-4 py-2 text-white hover:bg-white/10 ${
                      uiLang === code ? "text-vipGold-400" : ""
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => {
            setIsMenuOpen((prev) => !prev);
            setIsLangOpen(false);
          }}
          className="md:hidden text-white"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <Bars3Icon className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 border-t border-white/10 px-6 pb-6">
          <div className="flex flex-col gap-4 pt-4 text-white font-semibold">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="hover:text-vipGold-400"
            >
              {t("nav.rezervo")}
            </Link>

            <Link
              to="/cars"
              onClick={closeMobileMenu}
              className="hover:text-vipGold-400"
            >
              {t("nav.koleksioni")}
            </Link>

            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="hover:text-vipGold-400"
            >
              {t("nav.kontakt")}
            </Link>

            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="hover:text-vipGold-400"
            >
              {t("nav.rrethNesh")}
            </Link>

            <div className="pt-3 border-t border-white/10 flex items-center gap-3 text-sm font-medium">
              <span className="text-white/70">{t("nav.languageLabel")}</span>

              {["AL", "EN", "DE", "IT"].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLangPick(code)}
                  className={
                    uiLang === code ? "text-vipGold-400" : "text-white"
                  }
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

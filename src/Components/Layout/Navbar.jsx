import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../ThemeContext";
import logo from "../../assets/logo.jpeg";

function Navbar() {
  const { t, i18n } = useTranslation();
  const { dark, toggle } = useTheme();

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
            className="h-12 w-12 rounded-full object-cover ring-1 ring-black/10 dark:ring-white/15"
          />
          <div className="text-gray-900 dark:text-white leading-tight">
            <div className="text-sm tracking-[0.25em] uppercase text-gray-800 dark:text-white/90">
              Rental Tirana
            </div>
            <div className="text-[11px] tracking-[0.35em] uppercase">
              <span className="text-vipGold-400 font-semibold">VIP</span>
            </div>
          </div>
        </Link>

        {/* desktop nav */}
        <div className="hidden md:flex items-center gap-10 text-gray-900 dark:text-white font-semibold">
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

          {/* theme toggle */}
          <button
            type="button"
            onClick={toggle}
            className="hover:text-vipGold-400 transition"
            aria-label="Toggle theme"
          >
            {dark ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

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
              <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-white/80" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-28 rounded-xl bg-white dark:bg-black/90 border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden">
                {["AL", "EN", "DE", "IT"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleLangPick(code)}
                    className={`w-full text-left px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 ${
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

        {/* mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="text-gray-900 dark:text-white"
            aria-label="Toggle theme"
          >
            {dark ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              setIsLangOpen(false);
            }}
            className="text-gray-900 dark:text-white"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-8 h-8" />
            ) : (
              <Bars3Icon className="w-8 h-8" />
            )}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-black/90 border-t border-gray-200 dark:border-white/10 px-6 pb-6">
          <div className="flex flex-col gap-4 pt-4 text-gray-900 dark:text-white font-semibold">
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

            <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex items-center gap-3 text-sm font-medium">
              <span className="text-gray-500 dark:text-white/70">{t("nav.languageLabel")}</span>

              {["AL", "EN", "DE", "IT"].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLangPick(code)}
                  className={
                    uiLang === code ? "text-vipGold-400" : "text-gray-900 dark:text-white"
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

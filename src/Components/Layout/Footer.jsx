import { Link } from "react-router-dom";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/* Instagram icon */
function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7.25A4.75 4.75 0 1 1 7.25 12 4.75 4.75 0 0 1 12 7.25Z" />
    </svg>
  );
}

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-24 border-t border-white/10">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-black/80" />

      <div className="max-w-7xl mx-auto px-6 py-16 text-white">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="text-lg tracking-[0.25em] uppercase text-white/90">
              Rental Tirana
            </div>
            <div className="text-sm tracking-[0.35em] uppercase text-vipGold-400 font-semibold">
              VIP
            </div>

            <p className="mt-4 text-white/70 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-vipGold-400 font-semibold mb-4">
              {t("footer.navigation")}
            </div>

            <div className="flex flex-col gap-3 text-white/80">
              {/* Rezervo jumps to reservation section on Home */}
              <Link to="/#reserve" className="hover:text-white transition">
                {t("footer.links.reserve")}
              </Link>

              <Link to="/cars" className="hover:text-white transition">
                {t("footer.links.collection")}
              </Link>

              <Link to="/about" className="hover:text-white transition">
                {t("footer.links.about")}
              </Link>

              <Link to="/contact" className="hover:text-white transition">
                {t("footer.links.contact")}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="text-vipGold-400 font-semibold mb-4">
              {t("footer.contact")}
            </div>

            <div className="space-y-3">
              <a
                href="tel:+355685845850"
                className="flex items-center gap-3 text-white/80 hover:text-white transition"
              >
                <PhoneIcon className="w-5 h-5" />
                +355 68 584 5850
              </a>

              <a
                href="https://instagram.com/rentaltiranavip"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-white/80 hover:text-white transition"
              >
                <InstagramIcon />
                @rentaltiranavip
              </a>

              <div className="text-white/70 text-sm">
                {t("footer.location")}
              </div>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="mt-14 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Rental Tirana VIP. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

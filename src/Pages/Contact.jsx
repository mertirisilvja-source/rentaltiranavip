import { PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

function InstagramIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7.25A4.75 4.75 0 1 1 7.25 12 4.75 4.75 0 0 1 12 7.25Zm0 1.5A3.25 3.25 0 1 0 15.25 12 3.25 3.25 0 0 0 12 8.75Zm5.1-1.9a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
    </svg>
  );
}

function Contact() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen text-gray-900 dark:text-white pt-32 pb-20 px-6 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 -z-10">
        {/* base */}
        <div className="absolute inset-0 bg-gray-100 dark:bg-vipGold-900" />

        <div className="absolute -top-28 -left-28 h-[560px] w-[560px] rounded-full bg-vipGold-500/10 dark:bg-vipGold-500/14 blur-3xl" />
        <div className="absolute top-24 -right-28 h-[560px] w-[560px] rounded-full bg-vipGold-400/8 dark:bg-vipGold-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-gray-200/50 dark:bg-white/5 blur-3xl" />

        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-gray-50/70 to-gray-100/90 dark:from-black/35 dark:via-black/75 dark:to-black/90" />

        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.2) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold">
            {t("contact.titleStart")}{" "}
            <span className="text-vipGold-400">
              {t("contact.titleHighlight")}
            </span>
          </h1>

          <p className="mt-4 text-gray-500 dark:text-white/75">{t("contact.subtitle")}</p>

          <div className="mt-6 mx-auto h-px w-24 bg-vipGold-500/60" />
        </div>

        {/* info card */}
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-xl">
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-7 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <div className="space-y-5">
                {/* Phone */}
                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/25 p-5">
                  <div className="text-vipGold-400 font-semibold flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5 text-vipGold-400" />
                    {t("contact.phoneLabel")}
                  </div>

                  <a
                    href="tel:+355685845850"
                    className="mt-2 inline-block text-gray-800 dark:text-white/90 text-lg hover:text-gray-900 dark:hover:text-white underline underline-offset-4 decoration-gray-300 dark:decoration-white/20 hover:decoration-vipGold-400 transition"
                  >
                    +355 68 584 5850
                  </a>

                  <div className="mt-2 text-xs text-gray-400 dark:text-white/55">
                    {t("contact.phoneHint")}
                  </div>
                </div>

                {/* Instagram */}
                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/25 p-5">
                  <div className="text-vipGold-400 font-semibold flex items-center gap-2">
                    <InstagramIcon className="w-5 h-5 text-vipGold-400" />
                    Instagram
                  </div>

                  <a
                    href="https://instagram.com/rentaltiranavip"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-gray-800 dark:text-white/90 text-lg hover:text-gray-900 dark:hover:text-white underline underline-offset-4 decoration-gray-300 dark:decoration-white/20 hover:decoration-vipGold-400 transition"
                  >
                    @rentaltiranavip
                  </a>

                  <div className="mt-2 text-xs text-gray-400 dark:text-white/55">
                    {t("contact.igHint")}
                  </div>
                </div>

                {/* Address (clickable) */}
                <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/25 p-5">
                  <div className="text-vipGold-400 font-semibold flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-vipGold-400" />
                    {t("contact.addressLabel")}
                  </div>

                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Rental%20Tirana%20VIP%20Tirane"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white underline underline-offset-4 decoration-gray-300 dark:decoration-white/20 hover:decoration-vipGold-400 transition"
                  >
                    {t("contact.addressValue")}
                  </a>

                  <div className="mt-2 text-xs text-gray-400 dark:text-white/55">
                    {t("contact.mapsHint")}
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="pt-5 border-t border-gray-200 dark:border-white/10">
                  <div className="text-sm text-gray-500 dark:text-white/70">
                    {t("contact.whatsappQuestion")}
                  </div>

                  <button
                    type="button"
                    className="mt-3 h-11 w-full rounded-sm bg-vipGold-500 hover:bg-vipGold-400 transition text-black font-semibold"
                    onClick={() =>
                      window.open("https://wa.me/355685845850", "_blank")
                    }
                  >
                    {t("contact.whatsappButton")}
                  </button>

                  <div className="mt-2 text-xs text-gray-400 dark:text-white/55">
                    {t("contact.whatsappHint")}
                  </div>
                </div>
              </div>
            </div>

            {/* optional small note under card */}
            <p className="mt-6 text-center text-xs text-gray-400 dark:text-white/45">
              {t("contact.responseHours")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

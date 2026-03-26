import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 pb-16 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold">{t("privacy.title", "Privacy Policy")}</h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600 dark:text-white/80">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("privacy.collect.title", "1. Information We Collect")}</h2>
            <p className="mt-2">{t("privacy.collect.body")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("privacy.use.title", "2. How We Use Your Information")}</h2>
            <p className="mt-2">{t("privacy.use.body")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("privacy.storage.title", "3. Data Storage")}</h2>
            <p className="mt-2">{t("privacy.storage.body")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("privacy.rights.title", "4. Your Rights")}</h2>
            <p className="mt-2">{t("privacy.rights.body")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("privacy.cookies.title", "5. Cookies")}</h2>
            <p className="mt-2">{t("privacy.cookies.body")}</p>
          </section>
        </div>
      </div>
    </main>
  );
}

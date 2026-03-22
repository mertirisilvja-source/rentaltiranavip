import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-black pt-24 pb-16 text-white">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold">{t("privacy.title", "Privacy Policy")}</h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-white/80">
          <section>
            <h2 className="text-lg font-semibold text-white">{t("privacy.collect.title", "1. Information We Collect")}</h2>
            <p className="mt-2">{t("privacy.collect.body", "When you make a reservation, we collect your name, email address, phone number, and rental dates. We also collect identity documents and driver's license information at pick-up.")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t("privacy.use.title", "2. How We Use Your Information")}</h2>
            <p className="mt-2">{t("privacy.use.body", "Your information is used to process reservations, communicate with you about your booking, and provide our rental services. We do not sell or share your personal data with third parties for marketing purposes.")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t("privacy.storage.title", "3. Data Storage")}</h2>
            <p className="mt-2">{t("privacy.storage.body", "Your data is stored securely on our servers. We retain reservation data for the duration required by Albanian law and for our business records.")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t("privacy.rights.title", "4. Your Rights")}</h2>
            <p className="mt-2">{t("privacy.rights.body", "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at +355 68 584 5850 or email admin@rentaltiranavip.com.")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t("privacy.cookies.title", "5. Cookies")}</h2>
            <p className="mt-2">{t("privacy.cookies.body", "We use minimal cookies for language preference storage only. No tracking cookies or third-party analytics cookies are used.")}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
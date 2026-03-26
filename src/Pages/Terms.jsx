import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black pt-24 pb-16 text-gray-900 dark:text-white">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold">{t("terms.title", "Terms & Conditions")}</h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600 dark:text-white/80">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("terms.rental.title")}</h2>
            <p className="mt-2">{t("terms.rental.body")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("terms.requirements.title")}</h2>
            <p className="mt-2">{t("terms.requirements.body")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("terms.payment.title")}</h2>
            <p className="mt-2">{t("terms.payment.body")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("terms.deposit.title")}</h2>
            <p className="mt-2">{t("terms.deposit.body")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("terms.cancellation.title")}</h2>
            <p className="mt-2">{t("terms.cancellation.body")}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>{t("terms.cancellation.rule1")}</li>
              <li>{t("terms.cancellation.rule2")}</li>
              <li>{t("terms.cancellation.rule3")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("terms.liability.title")}</h2>
            <p className="mt-2">{t("terms.liability.body")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t("terms.contact.title")}</h2>
            <p className="mt-2">{t("terms.contact.body")}</p>
          </section>
        </div>
      </div>
    </main>
  );
}

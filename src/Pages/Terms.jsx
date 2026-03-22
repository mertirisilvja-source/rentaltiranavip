import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-black pt-24 pb-16 text-white">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold">{t("terms.title", "Terms & Conditions")}</h1>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-white/80">
          <section>
            <h2 className="text-lg font-semibold text-white">{t("terms.rental.title", "1. Rental Agreement")}</h2>
            <p className="mt-2">{t("terms.rental.body", "By making a reservation through Rental Tirana VIP, you agree to these terms. The rental agreement is finalized upon confirmation by our staff via WhatsApp or phone.")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t("terms.requirements.title", "2. Requirements")}</h2>
            <p className="mt-2">{t("terms.requirements.body", "Renters must be at least 21 years old and hold a valid driver's license. A valid identity document (ID or passport) is required at the time of pick-up.")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t("terms.payment.title", "3. Payment")}</h2>
            <p className="mt-2">{t("terms.payment.body", "Payment is made at the time of pick-up or as agreed with our staff. Prices displayed on the website are per day. If the drop-off time differs from the pick-up time, an additional fee may apply.")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t("terms.cancellation.title", "4. Cancellation")}</h2>
            <p className="mt-2">{t("terms.cancellation.body", "Reservations can be cancelled free of charge up to 24 hours before the pick-up time. Late cancellations or no-shows may be subject to a fee.")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t("terms.liability.title", "5. Liability")}</h2>
            <p className="mt-2">{t("terms.liability.body", "The renter is responsible for the vehicle during the rental period. Any damage, fines, or violations incurred during the rental are the renter's responsibility.")}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">{t("terms.contact.title", "6. Contact")}</h2>
            <p className="mt-2">{t("terms.contact.body", "For questions about these terms, contact us at +355 68 584 5850 or visit our office in Tirana.")}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
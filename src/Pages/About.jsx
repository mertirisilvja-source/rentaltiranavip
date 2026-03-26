import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();

  const stats = [
    { k: "24/7", v: t("about.stats.support") },
    { k: "VIP", v: t("about.stats.premiumService") },
    { k: "100%", v: t("about.stats.transparency") },
    { k: "Top", v: t("about.stats.luxuryFleet") },
  ];

  return (
    <section className="min-h-screen text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            {t("about.titleStart")}{" "}
            <span className="text-vipGold-400">
              {t("about.titleHighlight")}
            </span>
          </h1>
          <p className="mt-5 text-white/80 leading-relaxed text-lg">
            {t("about.p1")}
          </p>
          <p className="mt-3 text-vipGold-400 leading-relaxed">
            {t("about.p2")}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {stats.map((s) => (
            <div
              key={s.v}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <div className="text-2xl font-semibold text-vipGold-400">
                {s.k}
              </div>
              <div className="text-sm text-white/75 mt-1">{s.v}</div>
            </div>
          ))}
        </div>

        {/* Why us */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-vipGold-400 font-semibold text-lg">
              {t("about.why.title1")}
            </h3>
            <p className="text-white/70 mt-2 leading-relaxed">
              {t("about.why.desc1")}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-vipGold-400 font-semibold text-lg">
              {t("about.why.title2")}
            </h3>
            <p className="text-white/70 mt-2 leading-relaxed">
              {t("about.why.desc2")}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-vipGold-400 font-semibold text-lg">
              {t("about.why.title3")}
            </h3>
            <p className="text-white/70 mt-2 leading-relaxed">
              {t("about.why.desc3")}
            </p>
            <p className="text-white/60 mt-2 text-sm leading-relaxed">
              {t("about.why.dropoffNote")}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-8">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {t("about.cta.title")}
          </h2>
          <p className="text-white/75 mt-2">{t("about.cta.subtitle")}</p>

          <button
            onClick={() => window.location.assign("/cars")}
            className="mt-6 h-11 px-6 rounded-sm bg-vipGold-500 hover:bg-vipGold-400 transition text-black font-semibold"
          >
            {t("about.cta.button")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default About;

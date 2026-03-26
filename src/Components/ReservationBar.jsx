import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function pad(n) {
  return String(n).padStart(2, "0");
}
function toDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function toTime(d) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function ReservationBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const now = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    return d;
  }, [now]);

  const [hasDropoffLocation, setHasDropoffLocation] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("zyra");
  const [dropoffLocation, setDropoffLocation] = useState("zyra");

  const [pickupDate, setPickupDate] = useState(toDate(now));
  const [pickupTime, setPickupTime] = useState("10:00");

  const [dropoffDate, setDropoffDate] = useState(toDate(tomorrow));
  const [dropoffTime, setDropoffTime] = useState("10:00");

  function nextDay(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + 1);
    return toDate(d);
  }

  const handlePickupDateChange = (val) => {
    setPickupDate(val);
    const minDropoff = nextDay(val);
    if (dropoffDate <= val) {
      setDropoffDate(minDropoff);
    }
  };

  const handleDropoffDateChange = (val) => {
    const minDropoff = nextDay(pickupDate);
    if (val < minDropoff) {
      setDropoffDate(minDropoff);
    } else {
      setDropoffDate(val);
    }
  };

  const input =
    "h-10 w-full rounded-sm bg-[#bfbfbf] text-black px-3 text-sm outline-none " +
    "focus:ring-2 focus:ring-vipGold-400/40";

  const label = "text-xs font-semibold text-white/90 mb-1";

  const goToCars = () => {
    const finalDropoff = hasDropoffLocation ? dropoffLocation : pickupLocation;

    const params = new URLSearchParams({
      pickupLocation,
      dropoffLocation: finalDropoff,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
    });

    navigate(`/cars?${params.toString()}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    goToCars();
  };

  return (
    <form onSubmit={onSubmit} className="mt-10">
      <div className="max-w-6xl">
        {/* desktop */}
        <div className="hidden md:block">
          {/* top label row */}
          <div className="hidden md:grid grid-cols-12 gap-3 items-end">
            {!hasDropoffLocation ? (
              <>
                <div className="col-span-6 flex items-end justify-between">
                  <div className={label}>{t("reservation.pickupLocation")}</div>

                  <label className="flex items-center gap-2 text-xs font-semibold text-white/90">
                    <input
                      id="dropoffToggle"
                      type="checkbox"
                      checked={hasDropoffLocation}
                      onChange={(e) => setHasDropoffLocation(e.target.checked)}
                      className="accent-vipGold-400"
                    />
                    {t("reservation.dropoffLocation")}
                  </label>
                </div>

                <div className="col-span-3">
                  <div className={label}>{t("reservation.pickupDateTime")}</div>
                </div>

                <div className="col-span-3">
                  <div className={label}>
                    {t("reservation.dropoffDateTime")}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-3">
                  <div className={label}>{t("reservation.pickupLocation")}</div>
                </div>

                <div className="col-span-3 flex items-end justify-between">
                  <div className={label}>
                    {t("reservation.dropoffLocation")}
                  </div>

                  <button
                    type="button"
                    onClick={() => setHasDropoffLocation(false)}
                    className="text-white/70 hover:text-white text-xs font-semibold"
                    aria-label={t("reservation.removeDropoff")}
                    title={t("reservation.remove")}
                  >
                    ✕
                  </button>
                </div>

                <div className="col-span-3">
                  <div className={label}>{t("reservation.pickupDateTime")}</div>
                </div>

                <div className="col-span-3">
                  <div className={label}>
                    {t("reservation.dropoffDateTime")}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* inline row */}
          <div className="grid grid-cols-12 gap-3 items-center mt-2">
            {/* pickup location */}
            <div className={hasDropoffLocation ? "col-span-3" : "col-span-6"}>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className={input}
              >
                <option value="zyra">
                  {t("reservation.locations.office")}
                </option>
                <option value="aeroport">
                  {t("reservation.locations.airport")}
                </option>
              </select>
            </div>

            {/* dropoff location */}
            {hasDropoffLocation && (
              <div className="col-span-3">
                <select
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  className={input}
                >
                  <option value="zyra">
                    {t("reservation.locations.office")}
                  </option>
                  <option value="aeroport">
                    {t("reservation.locations.airport")}
                  </option>
                </select>
              </div>
            )}

            {/* pickup date + time */}
            <div className="col-span-3 grid grid-cols-2 gap-3">
              <input
                type="date"
                value={pickupDate}
                min={toDate(now)}
                onChange={(e) => handlePickupDateChange(e.target.value)}
                className={input}
              />
              <input
                type="time"
                value={pickupTime}
                min="10:00"
                onChange={(e) => {
                  const val = e.target.value;
                  setPickupTime(val < "10:00" ? "10:00" : val);
                }}
                className={input}
              />
            </div>

            {/* dropoff date + time */}
            <div className="col-span-3 grid grid-cols-2 gap-3">
              <input
                type="date"
                value={dropoffDate}
                min={nextDay(pickupDate)}
                onChange={(e) => handleDropoffDateChange(e.target.value)}
                className={input}
              />
              <input
                type="time"
                value={dropoffTime}
                max="10:00"
                onChange={(e) => {
                  const val = e.target.value;
                  setDropoffTime(val > "10:00" ? "10:00" : val);
                }}
                className={input}
              />
            </div>

            {/* notes */}
            <div className="col-span-12 mt-3 space-y-1">
              <p className="text-xs text-white/70">
                {t("reservation.noteDropoffLimit")}
              </p>
              <p className="text-xs text-white/70">
                {t("reservation.noteDifferentTime")}
              </p>
            </div>

            {/* CTA */}
            <div className="col-span-12 mt-2">
              <button
                type="submit"
                className="h-11 w-full rounded-sm bg-vipGold-500 hover:bg-vipGold-400 transition
                   text-black font-semibold"
              >
                {t("reservation.continue")}
              </button>
            </div>

            {/* collection */}
            <div className="col-span-12 mt-3">
              <button
                type="button"
                className="h-11 w-full rounded-sm border border-white/30 text-white font-semibold
                   hover:bg-white/10 transition"
                onClick={goToCars}
              >
                {t("reservation.viewCollection")}
              </button>
            </div>
          </div>
        </div>

        {/* mobile */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-white/90 text-sm font-semibold">
              {t("reservation.mobileTitle")}
            </div>
            <label className="flex items-center gap-2 text-white/85 text-sm">
              <input
                type="checkbox"
                checked={hasDropoffLocation}
                onChange={(e) => setHasDropoffLocation(e.target.checked)}
                className="accent-vipGold-400"
              />
              {t("reservation.mobileDropoff")}
            </label>
          </div>

          <div>
            <div className={label}>{t("reservation.pickupLocation")}</div>
            <select
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className={input}
            >
              <option value="zyra">{t("reservation.locations.office")}</option>
              <option value="aeroport">
                {t("reservation.locations.airport")}
              </option>
            </select>
          </div>

          {hasDropoffLocation && (
            <div>
              <div className={label}>{t("reservation.dropoffLocation")}</div>
              <select
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
                className={input}
              >
                <option value="zyra">
                  {t("reservation.locations.office")}
                </option>
                <option value="aeroport">
                  {t("reservation.locations.airport")}
                </option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className={label}>{t("reservation.pickupDate")}</div>
              <input
                type="date"
                value={pickupDate}
                min={toDate(now)}
                onChange={(e) => handlePickupDateChange(e.target.value)}
                className={input}
              />
            </div>
            <div>
              <div className={label}>{t("reservation.pickupTime")}</div>
              <input
                type="time"
                value={pickupTime}
                min="10:00"
                onChange={(e) => {
                  const val = e.target.value;
                  setPickupTime(val < "10:00" ? "10:00" : val);
                }}
                className={input}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className={label}>{t("reservation.dropoffDate")}</div>
              <input
                type="date"
                value={dropoffDate}
                min={nextDay(pickupDate)}
                onChange={(e) => handleDropoffDateChange(e.target.value)}
                className={input}
              />
            </div>
            <div>
              <div className={label}>{t("reservation.dropoffTime")}</div>
              <input
                type="time"
                value={dropoffTime}
                max="10:00"
                onChange={(e) => {
                  const val = e.target.value;
                  setDropoffTime(val > "10:00" ? "10:00" : val);
                }}
                className={input}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-white/70">
              {t("reservation.noteDropoffLimit")}
            </p>
            <p className="text-xs text-white/70">
              {t("reservation.noteDifferentTime")}
            </p>
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-sm bg-vipGold-500 hover:bg-vipGold-400 transition
                       text-black font-semibold"
          >
            {t("reservation.continue")}
          </button>

          <button
            type="button"
            className="h-11 w-full rounded-sm border border-white/30 text-white font-semibold
                       hover:bg-white/10 transition"
            onClick={goToCars}
          >
            {t("reservation.viewCollection")}
          </button>
        </div>
      </div>
    </form>
  );
}

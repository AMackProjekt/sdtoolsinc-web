export type LightingPhase = "clear_day" | "overcast_day" | "golden_hour" | "night";
export interface SanDiegoLighting {
  phase: LightingPhase;
  isDay: boolean;
  cloudCover: number;
  weatherCode: number;
  sunElevationFactor: number;
  source: "open-meteo" | "clock-fallback";
}
const LAT = 32.7157;
const LON = -117.1611;
const MINUTE = 60_000;

/** This function also runs on the server; the IANA timezone is explicit. */
export function sanDiegoClockLighting(at = new Date()): SanDiegoLighting {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(at);
  const hour = (Number(parts.find(p => p.type === "hour")?.value ?? 0) % 24)
    + Number(parts.find(p => p.type === "minute")?.value ?? 0) / 60;
  const isDay = hour >= 7 && hour < 18;
  const golden = (hour >= 6 && hour < 8) || (hour >= 17 && hour < 19);
  return {
    phase: golden ? "golden_hour" : isDay ? "clear_day" : "night",
    isDay, cloudCover: 0, weatherCode: -1,
    sunElevationFactor: isDay ? Math.max(0, Math.sin(((hour - 7) / 11) * Math.PI)) : 0,
    source: "clock-fallback",
  };
}

/** Open-Meteo returns local-time strings without offsets by default.
 * unixtime makes sunrise/sunset timestamps unambiguous across DST changes.
 */
export async function getLiveSanDiegoLighting(signal?: AbortSignal): Promise<SanDiegoLighting> {
  const params = new URLSearchParams({
    latitude: String(LAT), longitude: String(LON),
    current: "is_day,cloud_cover,weather_code",
    daily: "sunrise,sunset",
    timezone: "America/Los_Angeles",
    timeformat: "unixtime",
    forecast_days: "1",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    cache: "no-store", signal,
  });
  if (!response.ok) throw new Error("Weather service unavailable");
  const data: {
    current?: { is_day?: number; cloud_cover?: number; weather_code?: number };
    daily?: { sunrise?: number[]; sunset?: number[] };
  } = await response.json();
  const sunrise = data.daily?.sunrise?.[0];
  const sunset = data.daily?.sunset?.[0];
  const cloudCover = data.current?.cloud_cover;
  const isDayRaw = data.current?.is_day;
  if (
    typeof sunrise !== "number" || typeof sunset !== "number" || sunset <= sunrise ||
    typeof cloudCover !== "number" || !Number.isFinite(cloudCover) ||
    (isDayRaw !== 0 && isDayRaw !== 1)
  ) throw new Error("Invalid solar weather data");

  const now = Date.now();
  const start = sunrise * 1000;
  const end = sunset * 1000;
  const isDay = isDayRaw === 1;
  const isGoldenHour = Math.abs(now - start) <= 45 * MINUTE || Math.abs(now - end) <= 45 * MINUTE;
  const fraction = Math.max(0, Math.min(1, (now - start) / (end - start)));
  const sunElevationFactor = isDay ? Math.max(0, Math.sin(fraction * Math.PI)) : 0;
  return {
    phase: isGoldenHour ? "golden_hour" : isDay ? cloudCover > 65 ? "overcast_day" : "clear_day" : "night",
    isDay, cloudCover: Math.max(0, Math.min(100, cloudCover)),
    weatherCode: data.current?.weather_code ?? -1,
    sunElevationFactor, source: "open-meteo",
  };
}

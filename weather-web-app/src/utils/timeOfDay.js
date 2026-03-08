export const getTimeOfDay = (weather) => {
  if (!weather) return "night";

  const now = Date.now() / 1000;
  const { sunrise, sunset } = weather.sys;
  const dawnEnd = sunrise + 3600; // 1h dopo l'alba
  const duskStart = sunset - 3600; // 1h prima del tramonto

  if (now < sunrise || now > sunset + 3600) return "night";
  if (now < dawnEnd) return "dawn";
  if (now > duskStart) return "dusk";
  return "day";
};

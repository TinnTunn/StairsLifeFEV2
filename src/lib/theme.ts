// Tema terang dan gelap beserta skrip pemasang awalnya.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "stairslife-theme";

export const TEMA_BAWAAN: Theme = "dark";

export const themeInitScript = `
(function(){
  document.documentElement.classList.add("js");
  var t = ${JSON.stringify(TEMA_BAWAAN)};
  try {
    var s = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (s === "light" || s === "dark") t = s;
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", t);
})();
`.trim();

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Pilihan tetap berlaku untuk sesi ini walau tidak bisa disimpan. */
  }
}

export function readStoredTheme(): Theme {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY);
    if (t === "light" || t === "dark") return t;
  } catch {
    /* abaikan */
  }
  return TEMA_BAWAAN;
}

// Tema terang dan gelap beserta skrip pemasang awalnya.

export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "stairslife-theme";

export const themeInitScript = `
(function(){
  document.documentElement.classList.add("js");
  try {
    var t = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {}
})();
`.trim();

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  try {
    if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
    else localStorage.setItem(THEME_STORAGE_KEY, theme);
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
  return "system";
}

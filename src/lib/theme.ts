export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "stairslife-theme";

/* Dijalankan sebelum paint pertama lewat <script dangerouslySetInnerHTML>.
   Tanpa ini halaman sempat memakai tema sistem lalu berkedip ke pilihan pengguna.
   Ditulis sebagai string karena harus inline di <head>, bukan bundel terpisah. */
export const themeInitScript = `
(function(){
  /* Kelas js menyalakan keadaan tersembunyi untuk scroll-reveal. Tanpa JS,
     kelas ini tidak ada dan seluruh konten tampil apa adanya. */
  document.documentElement.classList.add("js");
  try {
    var t = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (t === "light" || t === "dark") {
      document.documentElement.setAttribute("data-theme", t);
    }
  } catch (e) {
    /* Mode privat memblokir localStorage. Tema sistem tetap benar tanpa ini. */
  }
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

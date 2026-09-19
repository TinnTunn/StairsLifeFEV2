import { readFileSync } from "node:fs";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/* Kepatuhan design system: 77 selector dari .oxlintrc.json yang dikirim bersama
   design system. Dijalankan di ESLint, bukan oxlint, karena no-restricted-syntax
   adalah aturan inti ESLint dan belum diimplementasikan oxlint.
   .oxlintrc.json tetap satu-satunya sumber, jadi pembaruan design system cukup
   menimpa berkas itu. */
const adherence = JSON.parse(
  readFileSync(new URL("./.oxlintrc.json", import.meta.url), "utf8"),
).rules["no-restricted-syntax"].slice(1);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/**", "src/styles/**"],
    rules: {
      "no-restricted-syntax": ["error", ...adherence],
    },
  },
  /* docs/design-system adalah salinan sumber design system, bukan kode aplikasi.
     Isinya JSX tanpa impor lengkap dan sengaja tidak diubah supaya tetap bisa
     dibandingkan dengan rilis berikutnya. */
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "docs/**"]),
]);

export default eslintConfig;

// Aturan ESLint proyek, termasuk kepatuhan design system.

import { readFileSync } from "node:fs";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "docs/**"]),
]);

export default eslintConfig;

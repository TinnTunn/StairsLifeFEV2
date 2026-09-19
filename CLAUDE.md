## Project
Design direction lives in `DESIGN.md`: the visual style of FE V2 (`../StairsLifeFEV2`) recoloured with the current terracotta and wood logo palette, Schibsted Grotesk for headings and Manrope for text. The reason behind major decisions lives in `DECISIONS.md`; add to it rather than re-deriving.
The app is bilingual (Indonesian default, English). Every user-facing string goes through the dictionaries in `src/i18n/`; never hard-code copy in a component. Check both languages at 375px and 1440px after UI changes, because English strings are often longer.
Run `npm run check` before declaring work done: ESLint carries the design system adherence rules, and `lint:css` blocks raw colors in CSS Modules (define colours as tokens in `src/styles/`).
Dev server runs on port 3001 because the NestJS backend at `../StairsLifeBEV2` owns 3000.
Run `npm test` (Vitest, `tests/unit`) and `npm run test:e2e` (Playwright, `tests/e2e`, API calls mocked) after changing logic or flows. Authenticated pages live under the `src/app/(aplikasi)` route group, which mounts the app shell once; pages render `<Halaman title=...>` (or the role-named aliases) instead of mounting a shell.
Money numbers shown to users (commission, withdrawal minimum and fee) come from `GET /settings/public` through `src/lib/pengaturan.ts`; never hard-code them.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

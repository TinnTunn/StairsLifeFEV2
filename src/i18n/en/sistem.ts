import type { sistem as Id } from "../id/sistem";

export const sistem: typeof Id = {
  pembayaran: {
    meta: "Payment result",
    modeContoh: "Sample mode is on, so the payment status can't be checked with the server.",
    tanpaIdJudul: "This page was opened without a payment number",
    tanpaIdIsi: "Open it from the link shown after you pay, or check the contract status directly.",
    masuk: "Log in",
    memeriksaJudul: "Confirming your payment",
    memeriksaIsi: "StairsLife checks directly with the payment provider instead of trusting this redirect page alone.",
    ditahanJudul: "The funds are in escrow",
    ditahanIsi:
      "StairsLife is holding the money; it hasn't gone to the student yet. It is only released after you approve the work.",
    bukaKontrak: "Open the contract",
    keBeranda: "Back to home",
    nominalDitahan: "Amount held",
    menungguJudul: "Payment not recorded as paid yet",
    menungguIsi: "If you've just paid, the status can take a minute or two. Reload this page shortly.",
    periksaLagi: "Check again",
    gagalJudul: "Payment wasn't completed",
    belumPastiJudul: "The payment status couldn't be confirmed",
    gagalIsi:
      "The funds are not in escrow. You can create a new invoice from the contract page without losing the agreement you already made.",
  },
  galat: {
    judul: "Something failed to load",
    isi: "This page stopped partway. Try reloading; if it's still the same, try again in a few minutes.",
    muatUlang: "Try reloading",
    keBeranda: "Back to home",
  },
  tidakDitemukan: {
    meta: "Page not found",
    kode: "404",
    judul: "This page doesn't exist",
    isi: "The address may have a typo, or the page has moved.",
    keBeranda: "Back to home",
    lihatProyek: "See open projects",
  },
};

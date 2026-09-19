import { afterEach, describe, expect, it } from "vitest";
import { bahasaAktif } from "@/i18n/aktif";
import { pesanDariKode } from "@/lib/api/client";

function pakaiCookie(cookie: string) {
  (globalThis as { document?: unknown }).document = { cookie };
}

afterEach(() => {
  delete (globalThis as { document?: unknown }).document;
});

describe("bahasaAktif", () => {
  it("membaca cookie bahasa walau bukan cookie pertama", () => {
    pakaiCookie("sesi=abc; sl-bahasa=en; lain=1");
    expect(bahasaAktif()).toBe("en");
    pakaiCookie("sl-bahasa=en");
    expect(bahasaAktif()).toBe("en");
    pakaiCookie("lain=1");
    expect(bahasaAktif()).toBe("id");
  });
});

describe("pesanDariKode", () => {
  it("menerjemahkan kode yang dikenal ke bahasa aktif", () => {
    pakaiCookie("sl-bahasa=en");
    expect(pesanDariKode(400, "PASSWORD_WRONG", undefined, ["Password yang kamu masukkan salah"])).toEqual([
      "The password you entered is incorrect.",
    ]);
    pakaiCookie("sl-bahasa=id");
    expect(pesanDariKode(400, "PASSWORD_WRONG", undefined, ["x"])).toEqual(["Kata sandi yang kamu masukkan salah."]);
  });

  it("mengisi angka rupiah dari params", () => {
    pakaiCookie("sl-bahasa=en");
    expect(pesanDariKode(400, "WITHDRAWAL_BELOW_MIN", { amount: 75000 }, ["Minimal penarikan Rp 75.000"])).toEqual([
      "The minimum withdrawal is Rp 75.000.",
    ]);
  });

  it("kode tidak dikenal: pesan server di mode Indonesia, pesan umum di mode Inggris", () => {
    pakaiCookie("sl-bahasa=id");
    expect(pesanDariKode(400, "KODE_BARU", undefined, ["Pesan khusus dari server"])).toEqual(["Pesan khusus dari server"]);
    pakaiCookie("sl-bahasa=en");
    expect(pesanDariKode(404, "KODE_BARU", undefined, ["Pesan khusus dari server"])).toEqual(["Not found."]);
  });
});

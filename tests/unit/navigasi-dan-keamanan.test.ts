import { describe, expect, it } from "vitest";
import { izinUntukRute } from "@/components/layout/nav-items";
import { KAMUS } from "@/i18n/kamus";
import { gabungBukti, sengketaAktif } from "@/lib/api/disputes";
import { jalurAman } from "@/lib/jalur";
import { bersihkanJudul, ruteNotifikasi, teksNotifikasi } from "@/lib/notifikasi";
import { dalamBatas, dariIso, keIso, selKalender, tambahBulan } from "@/lib/tanggal";
import { parseDeliverableUrls, type Notification } from "@/lib/types";

describe("jalurAman (?lanjut= setelah masuk)", () => {
  it("hanya menerima jalur relatif di dalam situs", () => {
    expect(jalurAman("/kontrak/abc")).toBe("/kontrak/abc");
    expect(jalurAman("https://situs-lain.id")).toBeNull();
    expect(jalurAman("//situs-lain.id")).toBeNull();
    expect(jalurAman("/\\situs-lain.id")).toBeNull();
    expect(jalurAman(null)).toBeNull();
  });
});

describe("ruteNotifikasi", () => {
  it("memetakan tautan backend ke rute frontend", () => {
    expect(ruteNotifikasi("/contracts/123")).toBe("/kontrak/123");
    expect(ruteNotifikasi("/admin/disputes/9")).toBe("/admin/sengketa/9");
    expect(ruteNotifikasi("/projects/p1/applications")).toBe("/bisnis/proyek/p1/pelamar");
    expect(ruteNotifikasi("/chat/inquiry/u1")).toBe("/pesan/tanya/u1");
    expect(ruteNotifikasi("/wallet")).toBe("/mahasiswa/dompet");
  });

  it("tidak mengikuti tautan eksternal", () => {
    expect(ruteNotifikasi("https://phishing.example")).toBeNull();
    expect(ruteNotifikasi("//phishing.example")).toBeNull();
    expect(ruteNotifikasi(null)).toBeNull();
  });
});

describe("teks notifikasi", () => {
  const dasar: Notification = {
    id: "n1",
    user_id: "u1",
    type: "payment",
    title: "💰 Dana Cair!",
    body: "Dana Rp 1.000.000 sudah masuk ke saldo kamu.",
    ref_id: null,
    action_url: "/wallet",
    is_read: false,
    read_at: null,
    created_at: "2026-09-15T00:00:00Z",
  };

  it("membuang emoji di depan judul", () => {
    expect(bersihkanJudul("✅ Sengketa Diselesaikan")).toBe("Sengketa Diselesaikan");
    expect(bersihkanJudul("⭐ Kamu Masuk Shortlist")).toBe("Kamu Masuk Shortlist");
  });

  it("bahasa Indonesia memakai isi asli, bahasa Inggris tidak mencampur bahasa", () => {
    expect(teksNotifikasi(dasar, KAMUS.id.fitur.notifikasi, "id")).toEqual({ judul: "Dana Cair!", isi: dasar.body });
    const en = teksNotifikasi(dasar, KAMUS.en.fitur.notifikasi, "en");
    expect(en.judul).toBe("Funds released");
    expect(en.isi).toBe(KAMUS.en.fitur.notifikasi.isiUmum.payment);
  });
});

describe("izin rute admin", () => {
  it("rute turunan mewarisi izin induknya", () => {
    expect(izinUntukRute("/admin/sengketa/abc")).toBe("Disputes");
    expect(izinUntukRute("/admin/penarikan")).toBe("Finance");
    expect(izinUntukRute("/admin")).toBe("Overview");
    expect(izinUntukRute("/kontrak")).toBeNull();
  });
});

describe("bukti sengketa", () => {
  it("satu berkas disimpan apa adanya, beberapa sebagai JSON", () => {
    expect(gabungBukti([])).toBeUndefined();
    expect(gabungBukti(["evidence/u/a.png"])).toBe("evidence/u/a.png");
    const banyak = gabungBukti(["evidence/u/a.png", "evidence/u/b.pdf"]);
    expect(parseDeliverableUrls(banyak ?? null)).toEqual(["evidence/u/a.png", "evidence/u/b.pdf"]);
  });

  it("status aktif mengunci aksi dana", () => {
    expect(sengketaAktif("open")).toBe(true);
    expect(sengketaAktif("under_review")).toBe(true);
    expect(sengketaAktif("resolved")).toBe(false);
    expect(sengketaAktif(null)).toBe(true);
  });
});

describe("kalender", () => {
  it("round-trip tanggal lokal tanpa bergeser hari", () => {
    expect(keIso(dariIso("2026-12-31") as Date)).toBe("2026-12-31");
    expect(dariIso("2026-02-30")).toBeNull();
  });

  it("enam minggu dimulai hari Senin", () => {
    const sel = selKalender(new Date(2026, 8, 1));
    expect(sel).toHaveLength(42);
    expect(sel[0].getDay()).toBe(1);
  });

  it("tambah bulan menjaga akhir bulan", () => {
    expect(keIso(tambahBulan(new Date(2026, 0, 31), 1))).toBe("2026-02-28");
  });

  it("batas minimum dan maksimum inklusif", () => {
    const d = new Date(2026, 8, 15);
    expect(dalamBatas(d, "2026-09-15")).toBe(true);
    expect(dalamBatas(d, "2026-09-16")).toBe(false);
    expect(dalamBatas(d, undefined, "2026-09-14")).toBe(false);
  });
});

describe("kamus", () => {
  it("setiap kode galat Indonesia punya terjemahan Inggris", () => {
    expect(Object.keys(KAMUS.en.galatApi.kode).sort()).toEqual(Object.keys(KAMUS.id.galatApi.kode).sort());
  });
});

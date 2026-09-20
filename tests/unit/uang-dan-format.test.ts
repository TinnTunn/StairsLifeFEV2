// Uji unit pemformat rupiah, tanggal, dan anggaran.

import { describe, expect, it } from "vitest";
import { labelAnggaran } from "@/lib/anggaran";
import { formatRupiah, formatTanggal, formatWaktuRelatif, pisahRibuan } from "@/lib/format";
import { hitungKomisi } from "@/lib/pengaturan";
import { BATAS_UNGGAH, berkasTerlaluBesar } from "@/lib/api/client";

describe("formatRupiah", () => {
  it("memakai titik ribuan dan spasi setelah Rp", () => {
    expect(formatRupiah(2500000)).toBe("Rp 2.500.000");
    expect(formatRupiah("71000")).toBe("Rp 71.000");
  });

  it("memberi tanda plus dan minus tipografis bila diminta", () => {
    expect(formatRupiah(-5000, { sign: true })).toBe("− Rp 5.000");
    expect(formatRupiah(5000, { sign: true, withPrefix: false })).toBe("+ 5.000");
  });

  it("nilai tidak valid menjadi nol, bukan NaN", () => {
    expect(formatRupiah("bukan angka")).toBe("Rp 0");
  });
});

describe("hitungKomisi", () => {
  it("membulatkan seperti backend", () => {
    expect(hitungKomisi(2500000, 5)).toBe(125000);
    expect(hitungKomisi(99999, 5)).toBe(5000);
    expect(hitungKomisi(1000000, 7.5)).toBe(75000);
    expect(hitungKomisi(0, 5)).toBe(0);
  });
});

describe("labelAnggaran", () => {
  const k = { anggaranSampai: "sampai", anggaranMulai: "mulai", anggaranKosong: "belum ditentukan" };

  it("menampilkan rentang, angka tunggal, atau teks kosong", () => {
    expect(labelAnggaran({ budget_min: 500000, budget_max: 1500000 }, k)).toBe("Rp 500.000 sampai Rp 1.500.000");
    expect(labelAnggaran({ budget_min: 1500000, budget_max: 1500000 }, k)).toBe("Rp 1.500.000");
    expect(labelAnggaran({ budget_min: 0, budget_max: 0 }, k)).toBe("belum ditentukan");
  });
});

describe("tanggal", () => {
  it("nama bulan mengikuti bahasa", () => {
    const d = new Date(2026, 8, 12);
    expect(formatTanggal(d, "id")).toBe("12 Sep 2026");
    expect(formatTanggal(new Date(2026, 4, 3), "id")).toBe("3 Mei 2026");
    expect(formatTanggal(new Date(2026, 4, 3), "en")).toBe("3 May 2026");
  });

  it("waktu relatif jatuh ke tanggal setelah seminggu", () => {
    const sekarang = new Date(2026, 8, 15, 12, 0, 0);
    expect(formatWaktuRelatif(new Date(2026, 8, 15, 11, 55), "en", sekarang)).toBe("5 minutes ago");
    expect(formatWaktuRelatif(new Date(2026, 8, 14, 12, 0), "en", sekarang)).toBe("yesterday");
    expect(formatWaktuRelatif(new Date(2026, 8, 1), "id", sekarang)).toBe("1 Sep 2026");
  });
});

describe("batas unggah", () => {
  const palsu = (nama: string, mb: number) => {
    const f = new File([new Uint8Array(1)], nama, { type: "application/octet-stream" });
    Object.defineProperty(f, "size", { value: Math.round(mb * 1024 * 1024) });
    return f;
  };

  it("melepas berkas di bawah batas jenisnya", () => {
    expect(berkasTerlaluBesar([palsu("hasil.zip", 49)], "deliverable")).toBeNull();
    expect(berkasTerlaluBesar([palsu("ktm.jpg", 9.5)], "ktm")).toBeNull();
  });

  it("menyebut berkas pertama yang melewati batas beserta batasnya", () => {
    expect(berkasTerlaluBesar([palsu("hasil.zip", 51)], "deliverable")).toEqual({
      nama: "hasil.zip",
      batasMb: 50,
    });
    expect(berkasTerlaluBesar([palsu("kecil.png", 1), palsu("bukti.png", 11)], "evidence")).toEqual({
      nama: "bukti.png",
      batasMb: 10,
    });
  });

  it("memakai batas 50 MB hanya untuk hasil kerja", () => {
    expect(BATAS_UNGGAH.deliverable).toBe(50 * 1024 * 1024);
    for (const jenis of ["avatar", "ktm", "selfie", "evidence", "chat-image"] as const) {
      expect(BATAS_UNGGAH[jenis]).toBe(10 * 1024 * 1024);
    }
  });
});

describe("pisahRibuan", () => {
  it("mengelompokkan ribuan, ratusan ribu, dan jutaan", () => {
    expect(pisahRibuan("50000")).toBe("50.000");
    expect(pisahRibuan("250000")).toBe("250.000");
    expect(pisahRibuan("1250000")).toBe("1.250.000");
    expect(pisahRibuan("12500000")).toBe("12.500.000");
  });

  it("tidak memberi pemisah pada angka di bawah seribu", () => {
    expect(pisahRibuan("999")).toBe("999");
    expect(pisahRibuan("0")).toBe("0");
  });

  it("membuang apa pun yang bukan digit, termasuk pemisah lama", () => {
    expect(pisahRibuan("1.250.000")).toBe("1.250.000");
    expect(pisahRibuan("Rp 50.000")).toBe("50.000");
    expect(pisahRibuan("abc")).toBe("");
    expect(pisahRibuan("")).toBe("");
  });

  it("menerima angka, bukan hanya teks", () => {
    expect(pisahRibuan(1250000)).toBe("1.250.000");
  });
});

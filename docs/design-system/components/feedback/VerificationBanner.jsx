import React from "react";

const TONES = {
  belum_diajukan: { bg: "var(--warning-soft)", bd: "var(--warning-border)", fg: "var(--warning-text)", icon: "!" },
  menunggu_review: { bg: "var(--bg-subtle)", bd: "var(--border-default)", fg: "var(--text-body)", icon: "…" },
  ditolak: { bg: "var(--danger-soft)", bd: "var(--danger-border)", fg: "var(--danger-text)", icon: "!" },
  disuspend: { bg: "var(--danger-soft)", bd: "var(--danger-border)", fg: "var(--danger-text)", icon: "!" },
};

/**
 * Banner status verifikasi — muncul di seluruh area terautentikasi selama
 * akun belum terverifikasi. Menjelaskan apa yang terkunci, bukan hanya
 * bahwa akun belum terverifikasi.
 */
export function VerificationBanner({
  status = "belum_diajukan", role = "mahasiswa", reason, onAction, actionLabel, style, ...rest
}) {
  if (status === "terverifikasi") return null;
  const t = TONES[status] || TONES.belum_diajukan;
  const mhs = role === "mahasiswa";

  const teks = {
    belum_diajukan: mhs
      ? { judul: "Verifikasi identitasmu dulu", isi: "Kamu bisa menelusuri semua lowongan sekarang, tapi belum bisa melamar sampai kartu mahasiswamu disetujui. Reviewnya biasanya 1×24 jam." }
      : { judul: "Verifikasi bisnismu dulu", isi: "Kamu bisa menyusun lowongan dan menyimpannya sebagai draft, tapi belum bisa menayangkannya sampai dokumen bisnismu disetujui." },
    menunggu_review: mhs
      ? { judul: "Verifikasi sedang direview", isi: "Kartu mahasiswamu sudah masuk antrean. Kami kabari lewat email begitu selesai — biasanya dalam 1×24 jam." }
      : { judul: "Dokumen bisnis sedang direview", isi: "Dokumenmu sudah masuk antrean. Draft lowongan yang kamu simpan bisa langsung ditayangkan begitu disetujui." },
    ditolak: mhs
      ? { judul: "Verifikasi belum bisa disetujui", isi: reason || "Ada yang perlu diperbaiki dari kartu mahasiswa yang kamu unggah." }
      : { judul: "Dokumen bisnis belum bisa disetujui", isi: reason || "Ada yang perlu diperbaiki dari dokumen yang kamu unggah." },
    disuspend: { judul: "Akun ini sedang disuspend", isi: reason || "Hubungi tim kami untuk memulihkan akses." },
  }[status] || {};

  const label = actionLabel || {
    belum_diajukan: mhs ? "Unggah kartu mahasiswa" : "Unggah dokumen bisnis",
    menunggu_review: "Lihat status",
    ditolak: "Unggah ulang",
    disuspend: "Hubungi kami",
  }[status];

  return (
    <div {...rest} role="status" style={{
      display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 15px",
      background: t.bg, border: "1px solid " + t.bd, borderRadius: "var(--radius-md)", ...style,
    }}>
      <span aria-hidden="true" style={{
        width: 20, height: 20, flex: "none", marginTop: 1, display: "grid", placeItems: "center",
        borderRadius: "var(--radius-full)", border: "1.5px solid " + t.fg, color: t.fg,
        fontSize: 12, fontWeight: 700, lineHeight: 1,
      }}>{t.icon}</span>
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <b style={{ fontSize: "var(--text-body-sm)", fontWeight: "var(--weight-semibold)", color: t.fg }}>{teks.judul}</b>
        <span style={{ fontSize: "var(--text-caption)", color: t.fg, lineHeight: 1.55, opacity: 0.92 }}>{teks.isi}</span>
      </span>
      {onAction && (
        <button type="button" onClick={onAction} style={{
          flex: "none", minHeight: 32, padding: "0 12px", background: "var(--bg-surface)",
          border: "1px solid " + t.bd, borderRadius: "var(--radius-md)", color: t.fg,
          fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)",
          fontWeight: "var(--weight-semibold)", cursor: "pointer", whiteSpace: "nowrap",
        }}>{label}</button>
      )}
    </div>
  );
}

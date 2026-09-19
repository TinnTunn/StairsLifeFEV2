import React from "react";

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

/**
 * Pembayaran QRIS untuk menyetor dana kontrak ke escrow. Bukan paket dan bukan
 * langganan — satu-satunya titik uang masuk di produk.
 * Kode QR di dalamnya placeholder; ganti dengan gambar asli dari penyedia.
 */
export function QRPayment({
  amount = 0, status = "menunggu_pembayaran", secondsLeft = 900, orderId,
  onRegenerate, onConfirm, onUploadProof, steps, style, ...rest
}) {
  const [sisa, setSisa] = React.useState(secondsLeft);
  React.useEffect(() => { setSisa(secondsLeft); }, [secondsLeft]);
  React.useEffect(() => {
    if (status !== "menunggu_pembayaran") return;
    const t = setInterval(() => setSisa((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [status]);

  const jam = String(Math.floor(sisa / 60)).padStart(2, "0");
  const dtk = String(sisa % 60).padStart(2, "0");
  const habis = sisa <= 0 || status === "gagal";
  const lunas = status === "lunas";
  const konfirmasi = status === "menunggu_konfirmasi";

  const langkah = steps || [
    "Buka aplikasi bank atau e-wallet apa pun yang mendukung QRIS.",
    "Pilih menu bayar dengan memindai QR, lalu arahkan ke kode di samping.",
    "Periksa nominalnya sama persis, lalu selesaikan pembayaran.",
    "Status di halaman ini berubah sendiri dalam beberapa detik.",
  ];

  return (
    <div {...rest} style={{
      display: "grid", gridTemplateColumns: "minmax(0,260px) minmax(0,1fr)", gap: 22,
      padding: "var(--pad-card)", background: "var(--bg-surface)",
      border: "var(--border-width) solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)", alignItems: "start", ...style,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 11, minWidth: 0 }}>
        <div style={{
          aspectRatio: "1 / 1", background: lunas ? "var(--success-soft)" : "var(--bg-subtle)",
          border: "1px solid " + (lunas ? "var(--success-border)" : "var(--border-default)"),
          borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", position: "relative", overflow: "hidden",
        }}>
          {lunas ? (
            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--success-text)" }}>
              <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              <b style={{ fontSize: "var(--text-body-sm)" }}>Pembayaran diterima</b>
            </span>
          ) : (
            <>
              <span aria-label="Kode QRIS" role="img" style={{
                width: "78%", height: "78%",
                background: "repeating-conic-gradient(var(--text-strong) 0% 25%, transparent 0% 50%) 0 0 / 11px 11px",
                opacity: habis ? 0.14 : 1, filter: habis ? "grayscale(1)" : "none",
              }} />
              {habis && (
                <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "color-mix(in srgb, var(--bg-surface) 88%, transparent)" }}>
                  <b style={{ fontSize: "var(--text-body-sm)", color: "var(--danger-text)" }}>QR kedaluwarsa</b>
                </span>
              )}
            </>
          )}
        </div>
        {!lunas && (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: "var(--text-caption)", color: habis ? "var(--danger-text)" : "var(--text-muted)" }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></svg>
            {habis ? "Waktu habis" : <>Berlaku <b className="sl-tabular" style={{ fontWeight: 600 }}>{jam}:{dtk}</b> lagi</>}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 15, minWidth: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="sl-overline">Nominal yang harus dibayar</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <b className="sl-tabular" style={{ fontSize: "var(--text-money-lg)", fontWeight: "var(--weight-bold)", color: "var(--text-strong)", letterSpacing: "-0.01em", lineHeight: 1.1 }}>{rupiah(amount)}</b>
            <button type="button" onClick={() => { try { navigator.clipboard.writeText(String(amount)); } catch (e) {} }}
              style={{ minHeight: 30, padding: "0 10px", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "var(--text-caption)", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
              Salin nominal
            </button>
          </div>
          {orderId && <span className="sl-tabular" style={{ fontSize: "var(--text-caption)", color: "var(--text-subtle)" }}>ID pesanan {orderId}</span>}
        </div>

        {konfirmasi ? (
          <div style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "12px 14px", background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "var(--radius-full)", background: "var(--primary)", flex: "none", marginTop: 5 }} />
            <span style={{ fontSize: "var(--text-body-sm)", color: "var(--text-body)", lineHeight: 1.55 }}>
              Kami sedang mencocokkan pembayaranmu. Biasanya selesai dalam beberapa menit — kamu tidak perlu membayar lagi.
            </span>
          </div>
        ) : !lunas && (
          <ol style={{ display: "flex", flexDirection: "column", gap: 9, margin: 0, paddingLeft: 0, listStyle: "none", counterReset: "s" }}>
            {langkah.map((t, i) => (
              <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span className="sl-tabular" style={{ flex: "none", width: 19, height: 19, marginTop: 1, display: "grid", placeItems: "center", background: "var(--bg-sunken)", borderRadius: "var(--radius-xs)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>{i + 1}</span>
                <span style={{ fontSize: "var(--text-body-sm)", color: "var(--text-muted)", lineHeight: 1.55 }}>{t}</span>
              </li>
            ))}
          </ol>
        )}

        <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: "auto" }}>
          {habis && onRegenerate && (
            <button type="button" onClick={onRegenerate} style={{ minHeight: 40, padding: "0 16px", background: "var(--primary)", color: "var(--text-on-primary)", border: 0, borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: 600, cursor: "pointer" }}>Buat QR baru</button>
          )}
          {!habis && !lunas && !konfirmasi && onConfirm && (
            <button type="button" onClick={onConfirm} style={{ minHeight: 40, padding: "0 16px", background: "var(--bg-surface)", color: "var(--text-body)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: 600, cursor: "pointer" }}>Saya sudah bayar</button>
          )}
          {!lunas && onUploadProof && (
            <button type="button" onClick={onUploadProof} style={{ minHeight: 40, padding: "0 14px", background: "transparent", color: "var(--primary-text)", border: 0, borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)", fontSize: "var(--text-body-sm)", fontWeight: 600, cursor: "pointer" }}>Unggah bukti transfer</button>
          )}
        </div>
      </div>
    </div>
  );
}

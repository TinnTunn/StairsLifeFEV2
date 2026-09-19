import React from "react";

export function ChatBubble({
  children, side = "left", author, time, status, attachment, system = false, showAvatar = true, avatar, style, ...rest
}) {
  if (system) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "6px 0", ...style }}>
        <span style={{ maxWidth: "85%", textAlign: "center", padding: "6px 12px", background: "var(--bg-sunken)", color: "var(--text-muted)", borderRadius: "var(--radius-pill)", fontSize: "var(--text-caption)", lineHeight: "var(--leading-normal)" }}>
          {children}
        </span>
      </div>
    );
  }

  const mine = side === "right";
  return (
    <div {...rest} style={{ display: "flex", gap: "8px", justifyContent: mine ? "flex-end" : "flex-start", alignItems: "flex-end", ...style }}>
      {!mine && showAvatar && <span style={{ flex: "none", marginBottom: 2 }}>{avatar}</span>}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", maxWidth: "min(78%, 460px)", alignItems: mine ? "flex-end" : "flex-start" }}>
        {author && !mine && <span style={{ fontSize: "var(--text-caption)", color: "var(--text-muted)", fontWeight: "var(--weight-medium)", paddingInline: "2px" }}>{author}</span>}
        <div
          style={{
            padding: "9px 12px",
            background: mine ? "var(--primary)" : "var(--bg-surface)",
            color: mine ? "var(--text-on-primary)" : "var(--text-body)",
            border: mine ? "none" : "var(--border-width) solid var(--border-subtle)",
            borderRadius: mine ? "var(--radius-lg) var(--radius-lg) var(--radius-xs) var(--radius-lg)" : "var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-xs)",
            fontSize: "var(--text-body-sm)", lineHeight: "var(--leading-normal)",
            boxShadow: mine ? "none" : "var(--shadow-xs)", wordBreak: "break-word",
          }}
        >
          {attachment && (
            <span style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: children ? "8px" : 0, padding: "8px 10px", background: mine ? "color-mix(in srgb, currentColor 12%, transparent)" : "var(--bg-subtle)", borderRadius: "var(--radius-sm)" }}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", opacity: 0.9 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
              <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--text-caption)", fontWeight: "var(--weight-medium)" }}>{attachment.name}</span>
              {attachment.size && <span className="sl-tabular" style={{ flex: "none", fontSize: "var(--text-overline)" }}>{attachment.size}</span>}
            </span>
          )}
          {children}
        </div>
        {(time || status) && (
          <span className="sl-tabular" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "var(--text-overline)", color: "var(--text-subtle)", paddingInline: "2px" }}>
            {time}
            {status === "read" && <svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="var(--info)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 7 17l-4-4" /><path d="m22 8-8.5 8.5" /></svg>}
            {status === "sent" && <svg aria-hidden="true" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
            {status === "sending" && <span>Mengirim…</span>}
          </span>
        )}
      </div>
    </div>
  );
}

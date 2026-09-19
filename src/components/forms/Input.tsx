"use client";

import { useEffect, useRef, type ChangeEvent, type ComponentPropsWithoutRef, type ReactNode, type Ref } from "react";
import { pisahRibuan } from "@/lib/format";
import { FieldShell, fieldIds, fieldStyles as s, type FieldMeta } from "./FieldShell";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size">, FieldMeta {
  size?: "sm" | "md" | "lg";
  /** Teks tetap di kiri kolom, misalnya "Rp". */
  prefix?: string;
  /** Teks tetap di kanan kolom, misalnya "orang". */
  suffix?: string;
  iconLeft?: ReactNode;
  /** Kontrol di ujung kanan kolom, misalnya tombol tampilkan kata sandi. */
  trailing?: ReactNode;
  /** Angka dirata-kanan dengan digit tabular agar kolom nominal sejajar. */
  numeric?: boolean;
  /** Nominal rupiah: yang terbaca berkelompok ribuan, yang disimpan tetap
      angka mentah. Penangan onChange tetap menerima event aslinya, dan
      pemisahnya hilang sendiri karena penangan nominal sudah menyaring
      non-digit. */
  uang?: boolean;
  wrapperClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  hint,
  error,
  required,
  size = "md",
  prefix,
  suffix,
  iconLeft,
  trailing,
  numeric = false,
  uang = false,
  disabled,
  id,
  name,
  className,
  wrapperClassName,
  ref,
  ...rest
}: InputProps) {
  const ids = fieldIds("in", id, name, label);
  const invalid = Boolean(error);
  const dalam = useRef<HTMLInputElement>(null);

  /* Pengisian otomatis peramban menulis nilai langsung ke DOM, dan pada halaman
     yang baru dibuka itu terjadi sebelum React terpasang. Akibatnya kolom
     terlihat terisi tapi state pemiliknya masih kosong, lalu tombol kirim
     menolak dengan "belum diisi" sambil menampilkan isi yang jelas ada. Sekali
     setelah terpasang, selisih itu disamakan dengan memanggil onChange
     pemiliknya, seolah pengguna yang mengetiknya.

     Hanya berjalan untuk kolom terkendali (punya onChange) dan hanya kalau DOM
     benar-benar berisi sesuatu yang berbeda, jadi kolom biasa tidak tersentuh. */
  const onChange = rest.onChange;
  const nilai = rest.value;
  const samakanDenganDom = () => {
    const el = dalam.current;
    if (!el || !onChange) return;
    const diState = nilai === undefined || nilai === null ? "" : String(nilai);
    if (el.value === "" || el.value === diState) return;
    onChange({ target: el, currentTarget: el } as unknown as ChangeEvent<HTMLInputElement>);
  };
  const tampil = uang ? pisahRibuan(nilai as string | number) : nilai;
  useEffect(() => {
    const samakan = () => {
      const el = dalam.current;
      if (!el || !onChange) return;
      const diState = nilai === undefined || nilai === null ? "" : String(nilai);
      if (el.value === "" || el.value === diState) return;
      onChange({ target: el, currentTarget: el } as unknown as ChangeEvent<HTMLInputElement>);
    };
    samakan();
    /* Pengisian otomatis sering mendarat beberapa ratus milidetik setelah
       halaman siap, kadang lebih lambat di mesin yang sibuk. Beberapa
       pemeriksaan susulan menutup jendela itu tanpa memasang pengamat yang
       hidup terus. Sinyal yang tepat datang dari animationstart di bawah;
       ini jaring pengamannya untuk peramban yang tidak mendukungnya. */
    const susulan = [120, 400, 900, 1800].map((ms) => window.setTimeout(samakan, ms));
    return () => susulan.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={ids.id}
      errorId={ids.errorId}
      hintId={ids.hintId}
      className={wrapperClassName}
    >
      <div
        className={[s.control, s[size], invalid ? s.invalid : "", disabled ? s.disabled : ""]
          .filter(Boolean)
          .join(" ")}
      >
        {iconLeft}
        {prefix ? <span className={s.affix}>{prefix}</span> : null}
        <input
          {...rest}
          value={uang ? tampil : rest.value}
          onAnimationStart={(e) => {
            /* Sinyal pengisian otomatis dari app.css. */
            if (e.animationName === "sl-autofill") samakanDenganDom();
            rest.onAnimationStart?.(e);
          }}
          onChange={
            uang
              ? (e) => {
                  /* Menambah titik menggeser isi kolom, dan tanpa ini karet
                     melompat ke ujung setiap kali satu digit disisipkan di
                     tengah. Posisinya dihitung dari jumlah digit di kiri karet,
                     bukan dari indeks huruf, karena titiknya berpindah. */
                  const el = e.currentTarget;
                  const digitKiri = el.value.slice(0, el.selectionStart ?? el.value.length).replace(/\D/g, "").length;
                  requestAnimationFrame(() => {
                    const t = dalam.current;
                    if (!t) return;
                    let n = 0;
                    let i = 0;
                    while (i < t.value.length && n < digitKiri) {
                      if (/\d/.test(t.value[i])) n += 1;
                      i += 1;
                    }
                    t.setSelectionRange(i, i);
                  });
                  onChange?.(e);
                }
              : rest.onChange
          }
          ref={(el) => {
            dalam.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          id={ids.id}
          name={name}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? ids.errorId : hint ? ids.hintId : undefined}
          inputMode={numeric ? "numeric" : rest.inputMode}
          className={[s.input, numeric ? s.numeric : "", className].filter(Boolean).join(" ")}
        />
        {suffix ? <span className={s.affix}>{suffix}</span> : null}
        {trailing ? <span className={s.trailing}>{trailing}</span> : null}
      </div>
    </FieldShell>
  );
}

"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";
import s from "./choice.module.css";

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label: string;
  description?: string;
  indeterminate?: boolean;
}

export function Checkbox({
  label,
  description,
  indeterminate = false,
  disabled,
  className,
  ...rest
}: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  /* indeterminate hanya bisa disetel lewat properti DOM, tidak ada atributnya
     di HTML, jadi CSS baru bisa membacanya setelah ini berjalan. */
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={[
        s.row,
        description ? s.rowWithDescription : "",
        disabled ? s.rowDisabled : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input {...rest} ref={ref} type="checkbox" disabled={disabled} className={`sl-visually-hidden ${s.input}`} />
      <span className={[s.box, description ? s.boxOffset : ""].filter(Boolean).join(" ")} aria-hidden="true">
        <svg className={s.mark} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <span className={s.dash} />
      </span>
      <span className={s.text}>
        <span className={s.title}>{label}</span>
        {description ? <span className={s.description}>{description}</span> : null}
      </span>
    </label>
  );
}

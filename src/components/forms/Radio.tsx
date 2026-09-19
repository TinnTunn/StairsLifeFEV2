import type { ComponentPropsWithoutRef } from "react";
import s from "./choice.module.css";

export interface RadioProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label: string;
  description?: string;
}

export function Radio({ label, description, disabled, className, ...rest }: RadioProps) {
  return (
    <label
      className={[s.row, description ? s.rowWithDescription : "", disabled ? s.rowDisabled : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <input {...rest} type="radio" disabled={disabled} className={`sl-visually-hidden ${s.input}`} />
      <span
        className={[s.box, s.boxRadio, description ? s.boxOffset : ""].filter(Boolean).join(" ")}
        aria-hidden="true"
      >
        <span className={s.dot} />
      </span>
      <span className={s.text}>
        <span className={s.title}>{label}</span>
        {description ? <span className={s.description}>{description}</span> : null}
      </span>
    </label>
  );
}

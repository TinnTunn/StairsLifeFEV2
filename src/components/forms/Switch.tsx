import type { ComponentPropsWithoutRef } from "react";
import s from "./choice.module.css";

export interface SwitchProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label: string;
  description?: string;
}

/** Untuk pengaturan yang berlaku seketika. Pilihan yang baru berlaku setelah tombol Simpan tetap memakai Checkbox. */
export function Switch({ label, description, disabled, className, ...rest }: SwitchProps) {
  return (
    <label
      className={[s.row, description ? s.rowWithDescription : "", disabled ? s.rowDisabled : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        {...rest}
        type="checkbox"
        role="switch"
        disabled={disabled}
        className={`sl-visually-hidden ${s.input}`}
      />
      <span className={[s.track, description ? s.boxOffset : ""].filter(Boolean).join(" ")} aria-hidden="true">
        <span className={s.knob} />
      </span>
      <span className={s.text}>
        <span className={s.title}>{label}</span>
        {description ? <span className={s.description}>{description}</span> : null}
      </span>
    </label>
  );
}

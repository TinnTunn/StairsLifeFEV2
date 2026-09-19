"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useBahasa } from "@/i18n/BahasaProvider";
import { Icon } from "../actions/Icon";
import { FieldShell, fieldIds, fieldStyles as s, type FieldMeta } from "./FieldShell";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentPropsWithoutRef<"select">, "size">, FieldMeta {
  options: Array<SelectOption | string>;
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  wrapperClassName?: string;
}

export function Select({
  label,
  hint,
  error,
  required,
  options,
  size = "md",
  placeholder,
  disabled,
  id,
  name,
  className,
  wrapperClassName,
  ...rest
}: SelectProps) {
  const { t } = useBahasa();
  const ids = fieldIds("sel", id, name, label);
  const invalid = Boolean(error);
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));

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
      <div className={s.selectWrap}>
        <select
          {...rest}
          id={ids.id}
          name={name}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? ids.errorId : hint ? ids.hintId : undefined}
          className={[s.select, s[size], className].filter(Boolean).join(" ")}
        >
          {/* placeholder "" berarti selalu ada nilai terpilih, tanpa opsi kosong. */}
          {placeholder === "" ? null : <option value="">{placeholder ?? t.komponen.select.pilih}</option>}
          {items.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <span className={s.selectChevron}>
          <Icon name="ChevronDown" size={18} />
        </span>
      </div>
    </FieldShell>
  );
}

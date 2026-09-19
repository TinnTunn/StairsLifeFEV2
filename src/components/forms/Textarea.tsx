"use client";

import { useState, type ChangeEvent, type ComponentPropsWithoutRef } from "react";
import { fieldIds, fieldStyles as s, type FieldMeta } from "./FieldShell";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea">, FieldMeta {
  showCount?: boolean;
  wrapperClassName?: string;
}

export function Textarea({
  label,
  hint,
  error,
  required,
  showCount = false,
  maxLength,
  rows = 4,
  disabled,
  id,
  name,
  value,
  defaultValue,
  onChange,
  className,
  wrapperClassName,
  ...rest
}: TextareaProps) {
  const ids = fieldIds("ta", id, name, label);
  const invalid = Boolean(error);
  const [len, setLen] = useState(String(defaultValue ?? value ?? "").length);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setLen(event.target.value.length);
    onChange?.(event);
  }

  const near = maxLength ? len > maxLength * 0.9 : false;

  return (
    <div className={[s.field, wrapperClassName].filter(Boolean).join(" ")}>
      {label ? (
        <label htmlFor={ids.id} className={s.label}>
          {label}
          {required ? (
            <span className={s.required} aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      <textarea
        {...rest}
        id={ids.id}
        name={name}
        rows={rows}
        value={value}
        defaultValue={defaultValue}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={error ? ids.errorId : hint ? ids.hintId : undefined}
        onChange={handleChange}
        className={[s.textarea, className].filter(Boolean).join(" ")}
      />
      <div className={s.counterRow}>
        <span
          id={error ? ids.errorId : ids.hintId}
          role={invalid ? "alert" : undefined}
          className={invalid ? s.error : s.hint}
        >
          {error ?? hint}
        </span>
        {showCount && maxLength ? (
          <span className={[s.counter, near ? s.counterNear : ""].filter(Boolean).join(" ")}>
            {len}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
}

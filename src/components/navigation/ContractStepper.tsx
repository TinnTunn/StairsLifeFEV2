"use client";

import { useBahasa } from "@/i18n/BahasaProvider";
import styles from "./ContractStepper.module.css";

export interface ContractStep {
  label: string;
  meta?: string;
  description?: string;
  tone?: "done" | "active" | "todo" | "alert";
}

export interface ContractStepperProps {
  /** Keenam tahap ditampilkan sekaligus, bukan hanya tahap aktif: pengguna perlu tahu apa yang datang setelah dananya berpindah. */
  steps: ContractStep[];
  current: number;
  orientation?: "horizontal" | "vertical" | "responsive";
  /** "ink" untuk stepper di atas panel tinta tetap. */
  surface?: "default" | "ink";
  className?: string;
}

export function ContractStepper({
  steps,
  current,
  orientation = "responsive",
  surface = "default",
  className,
}: ContractStepperProps) {
  const { t } = useBahasa();
  return (
    <ol
      className={[
        styles.list,
        orientation === "vertical" ? styles.vertical : "",
        orientation === "responsive" ? styles.responsive : "",
        surface === "ink" ? styles.ink : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {steps.map((step, i) => {
        const tone = step.tone ?? (i < current ? "done" : i === current ? "active" : "todo");
        const last = i === steps.length - 1;
        return (
          <li key={`${step.label}-${i}`} className={[styles.step, styles[tone]].filter(Boolean).join(" ")}>
            <div className={styles.rail}>
              <span className={styles.dot} aria-hidden="true">
                {tone === "done" ? (
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : tone === "alert" ? (
                  "!"
                ) : tone === "active" ? (
                  <span className={styles.pip} />
                ) : (
                  i + 1
                )}
              </span>
              {last ? null : <span className={styles.bar} aria-hidden="true" />}
            </div>
            <div className={styles.body}>
              <span className={styles.label}>
                {step.label}
                {tone === "active" ? <span className="sl-visually-hidden">{t.komponen.stepper.saatIni}</span> : null}
                {tone === "done" ? <span className="sl-visually-hidden">{t.komponen.stepper.selesai}</span> : null}
              </span>
              {step.meta ? <span className={styles.meta}>{step.meta}</span> : null}
              {step.description ? <span className={styles.description}>{step.description}</span> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Tabs.module.css";

export interface TabItem {
  value: string;
  label: string;
  count?: number;
}

interface BaseProps {
  items: TabItem[];
  variant?: "underline" | "pill";
  fullWidth?: boolean;
  className?: string;
  "aria-label": string;
}

interface StateTabsProps extends BaseProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  queryParam?: undefined;
}

interface UrlTabsProps extends BaseProps {
  /** Tab jadi tautan yang menulis ke query string, sehingga bisa dibagikan dan bertahan setelah muat ulang. */
  queryParam: string;
  value?: undefined;
  defaultValue?: string;
  onChange?: undefined;
}

export type TabsProps = StateTabsProps | UrlTabsProps;

export function Tabs(props: TabsProps) {
  const { variant = "underline", fullWidth = false, className } = props;
  const listClass = [
    styles.tablist,
    variant === "pill" ? styles.pill : "",
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  /* Dibandingkan dengan undefined, bukan truthiness: queryParam bertipe string
     sehingga string kosong tidak akan mempersempit union. */
  if (props.queryParam !== undefined) return <UrlTabs {...props} listClass={listClass} />;
  return <StateTabs {...props} listClass={listClass} />;
}

/* Status terpilih dibacakan lewat aria-selected, jadi tidak perlu teks tersembunyi tambahan. */
function Body({ item }: { item: TabItem }) {
  return (
    <>
      {item.label}
      {item.count !== undefined ? <span className={styles.count}>{item.count}</span> : null}
    </>
  );
}

/**
 * Wadah tab beserta penanda yang meluncur ke tab aktif.
 *
 * Penandanya satu elemen yang dipindahkan, bukan latar yang muncul dan hilang
 * di masing-masing tab: perpindahannya jadi terbaca sebagai satu benda yang
 * berpindah, dan mata bisa mengikutinya dari tab lama ke tab baru.
 *
 * Posisinya ditulis langsung ke gaya elemen lewat ref, bukan lewat state.
 * Mengukur lalu menyimpan hasil ukuran ke state berarti satu render tambahan
 * tiap kali tab berpindah, dan itu juga yang dilarang aturan
 * react-hooks/set-state-in-effect.
 */
function Daftar({ label, listClass, children }: { label: string; listClass: string; children: ReactNode }) {
  const wadah = useRef<HTMLDivElement>(null);
  const tanda = useRef<HTMLSpanElement>(null);
  /* Penempatan pertama saja yang tanpa transisi; tanpa ini penandanya meluncur
     dari tepi kiri setiap kali halaman dibuka. Sesudahnya semua perpindahan
     beranimasi, termasuk yang dipicu ResizeObserver: tab yang baru terpilih
     berubah jadi tebal sehingga lebarnya ikut berubah, dan kalau perubahan itu
     ditempatkan tanpa transisi penandanya melompat alih-alih meluncur. */
  const siap = useRef(false);

  const pindahkan = useCallback(() => {
    const w = wadah.current;
    const t = tanda.current;
    if (!w || !t) return;

    const aktif = w.querySelector<HTMLElement>('[aria-selected="true"]');
    /* Lebar nol berarti tablistnya belum tergambar (masih tersembunyi atau
       belum dilayout). Menempatkan penanda di keadaan itu menyimpan posisi
       palsu yang nanti dianimasikan dari nol. */
    if (!aktif || aktif.offsetWidth === 0) {
      t.style.opacity = "0";
      return;
    }

    if (!siap.current) t.style.transition = "none";
    t.style.opacity = "1";
    t.style.width = `${aktif.offsetWidth}px`;
    t.style.height = `${aktif.offsetHeight}px`;
    t.style.transform = `translate(${aktif.offsetLeft}px, ${aktif.offsetTop}px)`;
    if (!siap.current) {
      void t.offsetWidth;
      t.style.transition = "";
      siap.current = true;
    }
  }, []);

  useEffect(() => {
    pindahkan();
    const w = wadah.current;
    if (!w) return;

    /* Lebar tab ikut berubah tanpa render React: saat font selesai dimuat, saat
       jendela menyempit, atau saat angka di lencana bertambah digit. */
    const ro = new ResizeObserver(() => pindahkan());
    ro.observe(w);
    w.querySelectorAll('[role="tab"]').forEach((x) => ro.observe(x));
    document.fonts?.ready.then(() => pindahkan()).catch(() => {});
    return () => ro.disconnect();
  }, [pindahkan]);

  /* Tanpa daftar kebergantungan: tab aktif, label, dan jumlahnya semuanya
     berubah lewat render, jadi satu panggilan di tiap render sudah cukup dan
     tidak ada kondisi yang bisa terlewat. */
  useEffect(() => {
    pindahkan();
  });

  return (
    <div ref={wadah} role="tablist" aria-label={label} className={listClass}>
      <span ref={tanda} className={styles.penanda} aria-hidden="true" />
      {children}
    </div>
  );
}

function StateTabs({ items, defaultValue, value, onChange, listClass, ...rest }: StateTabsProps & { listClass: string }) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const active = value ?? internal;

  return (
    <Daftar label={rest["aria-label"]} listClass={listClass}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          aria-selected={item.value === active}
          className={styles.tab}
          onClick={() => {
            if (value === undefined) setInternal(item.value);
            onChange?.(item.value);
          }}
        >
          <Body item={item} />
        </button>
      ))}
    </Daftar>
  );
}

function UrlTabs({ items, queryParam, defaultValue, listClass, ...rest }: UrlTabsProps & { listClass: string }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get(queryParam) ?? defaultValue ?? items[0]?.value;

  return (
    <Daftar label={rest["aria-label"]} listClass={listClass}>
      {items.map((item) => {
        const next = new URLSearchParams(params.toString());
        next.set(queryParam, item.value);
        return (
          <Link
            key={item.value}
            href={`${pathname}?${next.toString()}`}
            role="tab"
            aria-selected={item.value === active}
            className={styles.tab}
            scroll={false}
          >
            <Body item={item} />
          </Link>
        );
      })}
    </Daftar>
  );
}

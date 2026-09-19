"use client";

import { useEffect } from "react";
import { auth } from "@/lib/api/auth";
import { clearSession, readSession, sedangKeluar } from "@/lib/api/session";
import { bersihkanCacheData } from "@/lib/useAsync";

/**
 * Beranda publik adalah keadaan "belum masuk".
 *
 * Aturannya disengaja: sesi masuk berlaku di dalam aplikasi, dan begitu
 * seseorang sampai ke halaman pemasaran ini, sesinya ditutup. Tanpa aturan itu,
 * satu akun bisa berada di dua dunia sekaligus dan pengguna tidak pernah tahu
 * apakah mereka masih masuk atau tidak.
 *
 * Halaman publik lain (daftar proyek, bantuan) tidak menutup sesi: tautan
 * proyek sering dibagikan, dan membuka tautan itu bukan tanda seseorang ingin
 * keluar dari akunnya.
 *
 * Token refresh dicabut di backend supaya sesi benar-benar berakhir, bukan
 * hanya hilang dari perangkat ini. Kegagalan jaringan tidak menghalangi:
 * tokennya tetap dihapus di sini.
 *
 * Tidak menggambar apa pun. Dulu ada bilah kecil yang mengabarkan sesinya
 * ditutup, tapi pemilik produk memintanya ditiadakan: halaman ini memang
 * halaman "belum masuk", dan headernya sudah menunjukkan keadaan itu lewat
 * tombol Masuk dan Daftar.
 */
export function AkhiriSesi() {
  useEffect(() => {
    /* Dibaca setelah halaman terpasang, dan lewat microtask supaya render
       hidrasi selesai lebih dulu. Proses keluar yang sedang berjalan dari
       tombol keluar dibiarkan, karena ia mengurus layarnya sendiri. */
    let batal = false;
    void Promise.resolve().then(async () => {
      const sesi = readSession();
      if (batal || !sesi || sedangKeluar()) return;
      await Promise.allSettled([auth.logout(sesi.refresh_token)]);
      clearSession();
      bersihkanCacheData();
    });
    return () => {
      batal = true;
    };
  }, []);

  return null;
}

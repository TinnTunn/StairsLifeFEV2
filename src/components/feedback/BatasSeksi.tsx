"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { KAMUS } from "@/i18n/kamus";
import { bahasaAktif } from "@/i18n/aktif";
import { EmptyState } from "./EmptyState";

interface Props {
  children: ReactNode;
  /** Nama bagian untuk log, mis. "tren admin". */
  nama: string;
}

interface State {
  gagal: boolean;
}

/**
 * Batas galat untuk satu bagian halaman.
 *
 * Tanpa ini, satu bidang yang hilang dari respons API membawa seluruh rute ke
 * layar "Ada yang gagal dimuat", termasuk bagian lain yang datanya baik-baik
 * saja. Backend masih berubah, jadi kegagalan seperti itu harus berhenti di
 * kartunya sendiri.
 *
 * Kelas, bukan fungsi: React hanya menyediakan penangkap galat render lewat
 * componentDidCatch dan getDerivedStateFromError.
 *
 * Kamus dibaca langsung, bukan lewat useBahasa, karena komponen kelas tidak
 * memakai hook dan penangkap galat tidak boleh ikut gagal saat konteks bahasa
 * tidak tersedia.
 */
export class BatasSeksi extends Component<Props, State> {
  state: State = { gagal: false };

  static getDerivedStateFromError(): State {
    return { gagal: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Bagian gagal dirender: ${this.props.nama}`, error.message, info.componentStack);
  }

  render() {
    if (!this.state.gagal) return this.props.children;
    const b = KAMUS[bahasaAktif()].komponen.batasSeksi;
    return <EmptyState icon="AlertTriangle" title={b.judul} description={b.isi} />;
  }
}

// Penangkap galat agar satu seksi yang gagal tidak menjatuhkan halaman.

"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { KAMUS } from "@/i18n/kamus";
import { bahasaAktif } from "@/i18n/aktif";
import { EmptyState } from "./EmptyState";

interface Props {
  children: ReactNode;
  nama: string;
}

interface State {
  gagal: boolean;
}

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

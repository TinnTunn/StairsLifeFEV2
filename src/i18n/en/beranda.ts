import type { beranda as Id } from "../id/beranda";

export const beranda: typeof Id = {
  meta: {
    judul: "StairsLife: Work on real projects, build your portfolio",
  },
  hero: {
    badge: "🎓 The Freelance Platform Built for Indonesian Students",
    judul1: "Work on Real Projects.",
    judul2: "Build Your Portfolio.",
    deskripsi:
      "Connect active university students with small businesses that need a hand. Students are verified with their student ID, and payment is held in escrow until the work is approved.",
    ctaUtama: "Find Projects",
    ctaKedua: "Post a Project",
  },
  kartu: {
    labelNyata: "Latest project",
    labelContoh: "Sample preview",
    pelamar: (n: number) => `${n} ${n === 1 ? "applicant" : "applicants"}`,
    judulContoh: "Instagram Feed Design for a Bakery",
    bisnisContoh: "Business name",
    keahlianContoh: ["Canva", "Photoshop", "Instagram"],
    anggaranContoh: "Budget range",
    anggaranSampai: "to",
    anggaranMulai: "From",
    anggaranKosong: "Budget not listed",
    lihat: "View project",
  },
  statistik: {
    label: "StairsLife in numbers",
    proyekDibuka: "Projects open now",
    komisi: "Fee when funds are released",
    biayaPasang: "Cost to post a project",
    tingkat: "Student levels",
  },
  sisi: {
    eyebrow: "Who It's For",
    judul: "One platform, two sides that both win.",
    label: "Choose a role",
    tabMahasiswa: "🎓 For Students",
    tabBisnis: "🏢 For Businesses",
    mahasiswa: [
      {
        judul: "Verify once, trusted for good",
        isi: "An admin checks your student ID once. After approval, you can apply to every open project.",
      },
      {
        judul: "Projects that fit your schedule",
        isi: "Filter projects by keyword, category, and level, then pick the ones that fit around your classes.",
      },
      {
        judul: "Payouts to your wallet",
        isi: "Once your work is approved, the funds land in your wallet and can be withdrawn to your own bank account.",
      },
    ],
    bisnis: [
      {
        judul: "Verified talent",
        isi: "See each applicant's level, rating, cover letter, and price offer before you choose.",
      },
      {
        judul: "Pay safely through escrow",
        isi: "StairsLife holds the funds until you have reviewed and approved the work.",
      },
      {
        judul: "Scope locked in a contract",
        isi: "Price and deadline are agreed in the contract. If the result falls short, request changes with notes.",
      },
    ],
    ctaMahasiswa: "🎓 Start as a Student",
    ctaBisnis: "🏢 Post a Business Project",
  },
  caraKerja: {
    eyebrow: "How It Works",
    judul: "Easy to start. Safe to run.",
    isi: "Four steps from sign-up to getting paid. Every step has its own safeguard.",
    langkah: [
      {
        judul: "Sign Up & Complete Your Profile",
        isi: "Create an account, fill in your details, and verify your student ID for a safer collaboration.",
      },
      {
        judul: "Choose & Agree on a Contract",
        isi: "The business picks an applicant, then price and deadline are locked in a digital contract.",
      },
      {
        judul: "Do the Work & Submit",
        isi: "Upload your work on the contract page. The business reviews it and can ask for revisions with notes.",
      },
      {
        judul: "Secure Payment (Escrow)",
        isi: "Funds are held until the work is approved, then move to your wallet for withdrawal.",
      },
    ],
  },
  fitur: {
    eyebrow: "Why StairsLife",
    judul: "Trust by design, not by luck.",
    isi: "Built-in safeguards so students and businesses can focus on the work itself.",
    daftar: [
      {
        judul: "Student ID Verification",
        isi: "Every student uploads a student ID and a selfie, which an admin checks before they can apply.",
      },
      {
        judul: "Escrow Payment",
        isi: "Payment is held until the work is accepted, so nobody is left short halfway through.",
      },
      {
        judul: "Digital Contract",
        isi: "Price and deadline are locked in a contract, not just agreed in a chat.",
      },
      {
        judul: "Revisions with Notes",
        isi: "Businesses can send work back with notes on what to fix, while the funds stay held.",
      },
      {
        judul: "Level System",
        isi: "Level up with experience and ratings: Beginner, Intermediate, then Advanced.",
      },
      {
        judul: "Wallet & Withdrawals",
        isi: "Released funds land in your wallet and can be withdrawn to a bank account in your own name.",
      },
    ],
  },
  tentang: {
    eyebrow: "About Us",
    judul: "A platform built for both sides.",
    isi: "StairsLife grew out of a real need: connecting talented students with small businesses that need help.",
    sejarahJudul: "Our Story",
    sejarahIsi:
      "StairsLife started from a problem we kept running into: students have skills and flexible time, but struggle to find projects that are safe and relevant. Meanwhile, small businesses need help with small tasks, but worry about quality, process, and payment risk. So StairsLife combines student verification, digital contracts, and escrow, letting both sides focus on the work.",
    linimasa: [
      {
        badge: "2026",
        judul: "Started as a campus idea",
        isi: "Designed as a student-only freelance marketplace that helps small businesses get operational and creative work done.",
      },
      {
        badge: "Focus",
        judul: "Safe & structured",
        isi: "Student ID verification, scope locked by contract, and payments protected by escrow.",
      },
      {
        badge: "Goal",
        judul: "Level up together",
        isi: "Students build a real portfolio; businesses get flexible talent that fits their budget and needs.",
      },
    ],
    nilaiJudul: "What We Stand For",
    nilai: [
      { judul: "Trust from the start", isi: "Trust is built through verification and a clear process." },
      { judul: "Visible progress", isi: "Clear scope and deliverables keep misunderstandings to a minimum." },
      { judul: "Beginner friendly", isi: "Start with small projects and build your reputation step by step." },
    ],
    ctaMulai: "Get Started Now",
    ctaCaraKerja: "See How It Works",
  },
  cta: {
    judul: "Ready to Start? Join Free Today.",
    isi: "No sign-up fee and no fee to post a project. A commission is only taken when funds are released.",
    mahasiswa: "🎓 Sign Up as a Student",
    bisnis: "🏢 Post a Business Project",
  },
};

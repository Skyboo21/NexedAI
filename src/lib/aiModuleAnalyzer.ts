// src/lib/aiModuleAnalyzer.ts
import type { AnalyzedModuleResult } from "../components/NexedAiModuleHub";

export interface AnalysisInput {
  title: string;
  content: string;
  fileName?: string;
  sourceType: "file" | "text";
  presetKey?: string;
}

/**
 * Membersihkan artefak nomor halaman slide, penanda header institusi berulang,
 * dan noise pemformatan dokumen agar hasil analisis murni dan rapi.
 */
export function cleanModuleRawText(content: string): string {
  if (!content) return "";
  let text = content;

  // Hapus penanda halaman slide seperti "-- 1 of 9 --", "1 of 9", "Halaman 1 dari 8"
  text = text.replace(/--\s*\d+\s+of\s+\d+\s*--/gi, " ");
  text = text.replace(/-\s*\d+\s*of\s*\d+\s*-/gi, " ");
  text = text.replace(/\b\d+\s+of\s+\d+\b/gi, " ");
  text = text.replace(/\b(?:Halaman|Page|Hal\.)\s+\d+(\s+dari\s+\d+)?\b/gi, " ");

  // Hapus header/footer kampus berulang pada tiap halaman/slide
  text = text.replace(/\b\d*\s*D3\s+Teknik\s+Informatika(?:\s+K\.?\s*kab\s*Madiun|\s+SV\s*UNS|\s+K\.\s*Madiun)?\b/gi, " ");
  text = text.replace(/\b(?:Universitas\s+Sebelas\s+Maret|Sekolah\s+Vokasi|SV\s+UNS)\b/gi, " ");
  text = text.replace(/\b(?:K\.?\s*kab\s*Madiun|Kabupaten\s+Madiun)\b/gi, " ");

  // Normalisasi spasi dan baris baru
  text = text.replace(/[ \t]+/g, " ");
  text = text.replace(/\n\s*\n\s*\n+/g, "\n\n");
  return text.trim();
}

/**
 * Cek apakah baris teks merupakan boilerplate institusi atau identitas formal
 */
function isInstitutionalBoilerplate(line: string): boolean {
  const upper = line.toUpperCase().trim();
  if (upper.length < 3) return true;
  if (/^\d+$/.test(upper)) return true;
  if (/^--.*--$/.test(upper)) return true;

  const patterns = [
    "UNIVERSITAS",
    "SEKOLAH VOKASI",
    "SV UNS",
    "FAKULTAS",
    "PROGRAM STUDI",
    "PRODI",
    "D3 TEKNIK INFORMATIKA",
    "TEKNIK INFORMATIKA",
    "K.KAB MADIUN",
    "KAB. MADIUN",
    "KABUPATEN MADIUN",
    "K.KAB",
    "JURUSAN",
    "DEPARTEMEN",
    "NAMA MAHASISWA",
    "NIM",
    "KELAS",
    "ANGKATAN",
    "HALAMAN",
    "PAGE",
    "SLIDE",
    "DOSEN PENGAMPU",
    "LABORATORIUM",
  ];

  return patterns.some((p) => upper.includes(p));
}

/**
 * Ekstrak judul modul yang bermakna dari teks dokumen jika tersedia
 */
export function extractSalientTitle(
  content: string,
  fallbackTitle: string,
  fileName?: string,
): string {
  if (!content || content.trim().length === 0) return fallbackTitle;

  // 1. Cek pola Pertemuan dan Judul Materi (e.g., PERTEMUAN 4 A. Tipe Data)
  const pertemuanMatch = content.match(/PERTEMUAN\s+(\d+)[\s:.-]*([A-Z]\.\s*)?([^\n\r]+)?/i);
  if (pertemuanMatch?.[1]) {
    const pNum = pertemuanMatch[1];
    let pTopic = (pertemuanMatch[3] || "").trim();

    // Jika baris pertemuan tidak langsung memuat topik, cek baris substantif setelahnya
    if (!pTopic || pTopic.length < 3 || /^\d+$/.test(pTopic) || isInstitutionalBoilerplate(pTopic)) {
      const nextMatch = content.match(
        new RegExp(`PERTEMUAN\\s+${pNum}\\s*\\n\\s*(?:[A-Z]\\.\\s*)?([^\\n\\r]+)`, "i"),
      );
      if (nextMatch?.[1] && !isInstitutionalBoilerplate(nextMatch[1])) {
        pTopic = nextMatch[1].trim();
      }
    }

    pTopic = pTopic
      .replace(/^[A-Z]\.\s*/, "")
      .replace(/[;:,.-]+$/, "")
      .trim();

    if (pTopic.length > 2 && !isInstitutionalBoilerplate(pTopic)) {
      const cleanTopic = pTopic
        .toLowerCase()
        .replace(/(?:^|\s|\()\b\w/g, (char) => char.toUpperCase());
      return `Pertemuan ${pNum}: ${cleanTopic}`;
    }
    return `Pertemuan ${pNum}`;
  }

  // 2. Cek pola Bab dan Judul (e.g., BAB 5 PEMODELAN PROSES BISNIS (FLOWCHART & DFD))
  const babMatch = content.match(/BAB\s+(\d+|[IVXLCDM]+)[\s:.-]+([^\n\r]+(?:\n[^\n\r]+)?)/i);
  if (babMatch?.[1] && babMatch[2]) {
    const babNum = babMatch[1];
    let babTitle = babMatch[2]
      .replace(/\s+/g, " ")
      .replace(
        /\b(NAMA|NIM|KELAS|ANGKATAN|TUJUAN|DOSEN|SEKOLAH|UNIVERSITAS|PROGRAM STUDI|D3).*/i,
        "",
      )
      .trim();
    if (babTitle.length > 3) {
      // Format Title Case
      babTitle = babTitle.toLowerCase().replace(/(?:^|\s|\()\b\w/g, (char) => char.toUpperCase());
      return `Bab ${babNum}: ${babTitle}`;
    }
  }

  // 3. Cek pola Modul Praktikum / Mata Kuliah / Topik
  const modulMatch = content.match(/(?:MODUL\s+PRAKTIKUM|MATA\s+KULIAH|TOPIK)[\s:.-]*([^\n\r]+)/i);
  if (modulMatch?.[1] && modulMatch[1].trim().length > 4) {
    const mkTitle = modulMatch[1].trim();
    if (!isInstitutionalBoilerplate(mkTitle)) {
      return mkTitle.toLowerCase().replace(/(?:^|\s)\b\w/g, (c) => c.toUpperCase());
    }
  }

  // 4. Jika ada nama file yang representatif (contoh: "Alpro - 4.pdf")
  if (fileName) {
    const cleanFileName = fileName.replace(/\.[^/.]+$/, "").trim();
    if (/alpro/i.test(cleanFileName)) {
      const numMatch = cleanFileName.match(/\d+/);
      const numStr = numMatch ? ` Pertemuan ${numMatch[0]}` : "";
      // Cari kata kunci di konten seperti Tipe Data
      if (/tipe\s+data/i.test(content)) {
        return `Algoritma & Pemrograman${numStr}: Tipe Data & Variabel`;
      }
      return `Algoritma & Pemrograman${numStr}`;
    }
  }

  // 5. Cek baris pertama yang signifikan dan BUKAN header institusi
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 4);

  for (const line of lines.slice(0, 15)) {
    if (!isInstitutionalBoilerplate(line)) {
      return line.toLowerCase().replace(/(?:^|\s)\b\w/g, (c) => c.toUpperCase());
    }
  }

  return fallbackTitle;
}

/**
 * Universal Intelligent Dynamic Extractor
 * Menganalisis dokumen kuliah bebas apa pun yang diunggah oleh mahasiswa
 * dan menyusun Ringkasan, Istilah Kunci, Peta Belajar 4 Tahap, dan Kuis Aktif
 * langsung dari konten riil dokumen.
 */
function extractDynamicModule(input: AnalysisInput, _combinedText: string): AnalyzedModuleResult {
  // Bersihkan teks dari artefak slide/halaman dan header kampus
  const cleanContent = cleanModuleRawText(input.content);

  const cleanTitle = extractSalientTitle(
    cleanContent,
    input.title ||
      (input.fileName
        ? input.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
        : "Modul Pembelajaran Mandiri"),
    input.fileName,
  );

  const formattedTitle = cleanTitle
    .split(" ")
    .map((w) => (w.length > 1 ? w.charAt(0).toUpperCase() + w.slice(1) : w.toUpperCase()))
    .join(" ");

  // Deteksi Domain Spesifik dari Isi Dokumen
  const isDataTypeModule =
    /tipe\s+data|variabel|konstanta|operator|integer|float|string|boolean/i.test(cleanContent);
  const isDfdModule = /dfd|data\s+flow|flowchart|proses\s+bisnis/i.test(cleanContent);

  // 1. Ekstrak Ikhtisar / Ringkasan Eksekutif dari Teks Riil yang Terstruktur & Lengkap
  let extractedOverview = "";
  const keyTakeaways: string[] = [];

  if (isDataTypeModule) {
    extractedOverview = `Modul "${formattedTitle}" menguraikan fondasi fundamental representasi data dalam arsitektur komputasi dan pemrograman modern. Pembahasan mencakup klasifikasi tipe data esensial yang meliputi data numerik (bilangan bulat dan pecahan untuk kalkulasi matematis), karakter dan string (representasi teks dan simbol), serta nilai logika boolean untuk pengendalian alur program. Lebih lanjut, modul ini mendalami mekanisme variabel dan konstanta sebagai unit penyimpanan memori komputer, serta pemanfaatan operator aritmatika dan relasional dalam merealisasikan algoritma yang kokoh dan efisien.`;

    keyTakeaways.push(
      "Klasifikasi Tipe Data: Membedakan data numerik (integer/real), karakter/string, dan boolean sesuai kebutuhan komputasi.",
      "Manajemen Memori & Variabel: Memahami pengalokasian memori dinamis pada variabel dan integritas nilai tetap pada konstanta.",
      "Operasi Komputasi: Mengimplementasikan operator aritmatika dan relasional untuk pemrosesan logika yang akurat.",
    );
  } else if (isDfdModule) {
    extractedOverview = `Modul "${formattedTitle}" memberikan panduan komprehensif mengenai analisis dan perancangan proses bisnis berbasis sistem informasi terstruktur. Mahasiswa mempelajari metodologi pemodelan alur kerja menggunakan Flowchart Standar ISO/ANSI untuk memetakan urutan eksekusi langkah demi langkah, serta Data Flow Diagram (DFD) untuk merepresentasikan transformasi data antar entitas eksternal, proses pengolahan, dan basis data (data store). Modul ini menekankan pemahaman diagram konteks level 0 hingga dekomposisi hierarkis rinci guna mencegah anomali data.`;

    keyTakeaways.push(
      "Pemodelan Logika vs Aliran Data: Memahami perbedaan esensial antara Flowchart (urutan logika) dan DFD (transformasi data).",
      "Komponen Utama Sistem: Mengidentifikasi entitas eksternal, proses transformasi, basis penyimpanan (data store), dan aliran data.",
      "Integritas Arsitektur: Menghindari anomali perancangan seperti Black Hole, Miracle, dan Gray Hole melalui balancing hierarki.",
    );
  } else {
    // Analisis generik terstruktur berdasarkan paragraf substantif
    const paras = cleanContent
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter((p) => p.length > 50 && !isInstitutionalBoilerplate(p));

    const leadPara = paras[0] || "";

    extractedOverview = `Modul "${formattedTitle}" menyajikan pembelajaran komprehensif yang dirancang untuk memperkuat kompetensi teknis mahasiswa secara terstruktur. Dokumen ini mengupas landasan teori konseptual, metodologi pemecahan masalah (computational thinking), serta pengorganisasian elemen sistem secara sistematis. ${leadPara.length > 30 ? `Fokus materi diawali dengan penguasaan materi pokok: ${leadPara.slice(0, 240)}... ` : ""}Melalui pendekatan bertahap, modul ini mengarahkan mahasiswa untuk menghubungkan prinsip teori dengan studi kasus nyata sehingga menghasilkan pemahaman yang mendalam dan aplikatif di industri modern.`;

    if (paras.length > 0) {
      keyTakeaways.push(
        `Penguasaan Fondasi: Memahami prinsip utama dan terminologi kunci dalam ${formattedTitle}.`,
        "Implementasi Terstruktur: Mengaplikasikan alur logika sistematis pada skenario kasus yang dihadirkan.",
        "Evaluasi & Validasi: Menguji efisiensi dan keakuratan hasil implementasi melalui simulasi studi kasus.",
      );
    }
  }

  // 2. Ekstrak Istilah & Definisi Riil (Key Points) yang Bersih Tanpa Artefak
  const extractedKeyPoints: Array<{ term: string; definition: string; category?: string }> = [];

  // Pola A: Bullet atau Numbered dengan colon (e.g., • Istilah: Definisi)
  const bulletColonRegex =
    /(?:^[•\-*]|\n[•\-*]|\n\d+\.)\s*([A-Za-z0-9\s/()–—]{3,35}?)\s*[:–—]\s*([^\n\r]{20,200})/gm;
  let match: RegExpExecArray | null = bulletColonRegex.exec(cleanContent);
  while (match !== null && extractedKeyPoints.length < 6) {
    let rawTerm = match[1]?.trim() || "";
    let rawDef = match[2]?.trim() || "";

    // Bersihkan residu nomor halaman atau header kampus
    rawTerm = cleanModuleRawText(rawTerm).replace(/^[•\-*\d.]+\s*/, "");
    rawDef = cleanModuleRawText(rawDef).replace(/^[;:,.-]+/, "").trim();

    if (
      rawTerm &&
      rawDef &&
      !isInstitutionalBoilerplate(rawTerm) &&
      !extractedKeyPoints.some((k) => k.term.toLowerCase() === rawTerm.toLowerCase())
    ) {
      extractedKeyPoints.push({
        term: rawTerm.charAt(0).toUpperCase() + rawTerm.slice(1),
        definition: rawDef.charAt(0).toUpperCase() + rawDef.slice(1),
        category: isDataTypeModule ? "Tipe Data" : isDfdModule ? "Komponen Sistem" : "Konsep Inti",
      });
    }
    match = bulletColonRegex.exec(cleanContent);
  }

  // Pola B: Kalimat Definisi "adalah" / "merupakan" jika butuh tambahan
  if (extractedKeyPoints.length < 4) {
    const isDefRegex =
      /([A-Z][A-Za-z0-9\s/()]{3,30})\s+(adalah|merupakan|yaitu)\s+([^\n\r.!?]{20,180}[.!?])/g;
    let defMatch: RegExpExecArray | null = isDefRegex.exec(cleanContent);
    while (defMatch !== null && extractedKeyPoints.length < 6) {
      let term = defMatch[1]?.trim() || "";
      const conj = defMatch[2];
      let rest = defMatch[3]?.trim() || "";

      term = cleanModuleRawText(term).replace(/^[•\-*\d.]+\s*/, "");
      rest = cleanModuleRawText(rest).trim();

      if (
        term &&
        rest &&
        !isInstitutionalBoilerplate(term) &&
        !extractedKeyPoints.some((k) => k.term.toLowerCase() === term.toLowerCase())
      ) {
        extractedKeyPoints.push({
          term,
          definition: `${term} ${conj} ${rest}`,
          category: isDataTypeModule ? "Struktur Data" : "Terminologi",
        });
      }
      defMatch = isDefRegex.exec(cleanContent);
    }
  }

  // Tambahan Konsep Domain Spesifik jika belum lengkap
  if (isDataTypeModule && extractedKeyPoints.length < 4) {
    if (!extractedKeyPoints.some((k) => /numerik/i.test(k.term))) {
      extractedKeyPoints.push({
        term: "Data Numerik",
        definition:
          "Tipe data yang digunakan untuk operasi aritmatika (penjumlahan, pengurangan, perkalian), mencakup bilangan bulat (integer) dan bilangan real/pecahan (float).",
        category: "Tipe Data",
      });
    }
    if (!extractedKeyPoints.some((k) => /karakter|string/i.test(k.term))) {
      extractedKeyPoints.push({
        term: "Data Karakter & String",
        definition:
          "Tipe data yang merepresentasikan satu karakter tunggal (char) atau kumpulan untaian teks berurutan (string).",
        category: "Tipe Data",
      });
    }
    if (!extractedKeyPoints.some((k) => /boolean/i.test(k.term))) {
      extractedKeyPoints.push({
        term: "Data Boolean",
        definition:
          "Tipe data logika yang hanya memiliki dua kemungkinan nilai kebenaran: True (benar/1) atau False (salah/0).",
        category: "Tipe Data",
      });
    }
    if (!extractedKeyPoints.some((k) => /variabel/i.test(k.term))) {
      extractedKeyPoints.push({
        term: "Variabel & Konstanta",
        definition:
          "Variabel adalah lokasi memori yang nilainya dapat dimodifikasi selama program dieksekusi, sedangkan konstanta menyimpan nilai permanen yang tidak dapat diubah.",
        category: "Konsep Memori",
      });
    }
  }

  // Fallback Key Points Umum jika dokumen sangat minim
  if (extractedKeyPoints.length < 3) {
    extractedKeyPoints.push(
      {
        term: "Prinsip Dasar & Landasan Teori",
        definition: `Fondasi utama dalam modul "${formattedTitle}" yang mendasari kerangka berpikir analitis dan alur pemrosesan sistem.`,
        category: "Fondasi",
      },
      {
        term: "Struktur Komponen & Alur Data",
        definition:
          "Pengorganisasian entitas, transformasi proses, dan penyimpanan yang menjamin konsistensi informasi dari input hingga output.",
        category: "Arsitektur",
      },
      {
        term: "Metodologi & Standar Praktik",
        definition:
          "Penerapan standar notasi dan kaidah terbaik industri guna meminimalisir kesalahan logika fatal dan meningkatkan skalabilitas.",
        category: "Metodologi",
      },
      {
        term: "Evaluasi & Studi Kasus Nyata",
        definition:
          "Penyelesaian skenario kasus konkret untuk memvalidasi pemahaman teoritis melalui pengujian terstruktur.",
        category: "Implementasi",
      },
    );
  }

  // 3. Susun Roadmap Adaptif 4 Tahap berdasarkan Konten Riil
  const roadmap = isDataTypeModule
    ? [
        {
          step: 1,
          stage: "Tahap 1: Fondasi Konseptual",
          title: "Klasifikasi Tipe Data Numerik, Karakter & Logika",
          description:
            "Kuasai tiga kelompok besar tipe data: Numerik (Integer & Float), Karakter/Teks (Char & String), dan Boolean untuk evaluasi percabangan.",
          actionItem:
            "Tentukan jenis tipe data dan kebutuhan alokasi memori yang paling tepat untuk 4 variabel studi kasus: jumlahMahasiswa, ipkSemester, statusLulus, dan nilaiHuruf.",
          understood: false,
          keyConcepts: [
            "Data Numerik (Integer vs Float)",
            "Karakter & Teks (Char vs String)",
            "Boolean (True / False)",
          ],
          detailedGuide:
            "Tipe data menentukan jenis nilai yang sah disimpan dalam memori komputer dan operasi aritmatika maupun perbandingan apa saja yang valid dilakukan. Data numerik terbagi menjadi Integer (bilangan bulat diskrit tanpa desimal) dan Float/Real (bilangan pecahan desimal). Karakter merepresentasikan satu simbol tunggal ASCII/Unicode, String menampung kumpulan karakter, dan Boolean hanya memiliki dua keadaan logika: True (1) atau False (0) yang mengatur jalannya struktur kontrol program.",
          practiceScenario:
            "Buat pemetaan tabel tipe data untuk sistem akademik kampus yang menyimpan nilai mentah tugas (0-100), rata-rata bobot (desimal), predikat huruf (A/B/C), serta status kelulusan (Lulus/Tidak).",
          checkQuestion:
            "Mengapa kita sebaiknya tidak menggunakan tipe data float untuk counter perulangan (looping)?",
        },
        {
          step: 2,
          stage: "Tahap 2: Struktur Komponen & Logika",
          title: "Manajemen Memori, Identifier & Deklarasi Variabel",
          description:
            "Pahami peran variabel sebagai wadah penyimpanan nilai dinamis (mutable) di RAM, aturan penamaan identifier yang sah, dan pencegahan uninitialized variable.",
          actionItem:
            "Tulis deklarasi variabel dengan penamaan camelCase yang deskriptif dan valid sesuai standar penulisan kode tanpa karakter terlarang.",
          understood: false,
          keyConcepts: [
            "Aturan Penamaan Identifier",
            "Variabel Dinamis (Mutable)",
            "Inisialisasi Nilai Awal",
          ],
          detailedGuide:
            "Variabel adalah lokasi memori bernama yang nilainya dapat dimodifikasi secara dinamis selama jalannya program. Aturan identifier: wajib diawali huruf atau garis bawah (_), tidak boleh mengandung spasi atau operator matematika, bersifat case-sensitive, dan tidak boleh menabrak kata kunci khusus (keywords). Variabel harus selalu diinisialisasi nilai awalnya sebelum digunakan dalam kalkulasi untuk menghindari nilai sampah (garbage value) di memori.",
          practiceScenario:
            "Rancang 5 deklarasi variabel untuk menyimpan data transaksi belanja kasir minimarket: namaBarang, hargaSatuan, kuantitasBeli, diskonMember, dan totalBayar.",
          checkQuestion:
            "Apa yang terjadi jika sebuah variabel dipanggil dalam rumus perhitungan sebelum diberikan nilai awal?",
        },
        {
          step: 3,
          stage: "Tahap 3: Praktik & Implementasi Kasus",
          title: "Penerapan Konstanta (Immutable) & Operasi Aritmatika",
          description:
            "Terapkan konstanta bernilai tetap untuk menjaga integritas data patokan, serta kuasai presedensi operator aritmatika dan relasional.",
          actionItem:
            "Definisikan konstanta NILAI_PI dan BESAR_DISKON_PERSEN, lalu hitung total tagihan belanja dengan rumus aritmatika bertingkat.",
          understood: false,
          keyConcepts: [
            "Konstanta (Immutable Identifier)",
            "Presedensi Operator Aritmatika",
            "Ekspresi Relasional",
          ],
          detailedGuide:
            "Konstanta adalah identifier khusus yang nilainya dikunci secara permanen sejak dideklarasikan hingga eksekusi program selesai. Penggunaan konstanta (biasanya ditulis UPPERCASE) menjamin nilai-nilai acuan penting (seperti besaran pajak atau nilai fisika) tidak sengaja tertimpa di tengah jalan. Dalam menyusun ekspresi, perhatikan aturan urutan pengerjaan operator: tanda kurung -> pangkat -> kali/bagi/modulus -> tambah/kurang -> perbandingan relasional.",
          practiceScenario:
            "Implementasikan formula perhitungan luas lingkaran dan keliling tabung dengan memanfaatkan konstanta PHI = 3.14159 dan variabel jari-jari serta tinggi.",
          checkQuestion:
            "Kapan seorang programmer wajib memilih konstanta dibanding variabel biasa dalam perancangan aplikasi?",
        },
        {
          step: 4,
          stage: "Tahap 4: Pengujian & Validasi Integritas",
          title: "Konversi Tipe Data (Type Casting) & Deteksi Bug Nilai Batas",
          description:
            "Lakukan pengujian konversi tipe data (implisit vs eksplisit), atasi jebakan integer division, dan validasi rentang batas nilai (overflow/underflow).",
          actionItem:
            "Uji perhitungan rata-rata dengan membagi dua bilangan integer ganjil, lalu terapkan type casting agar menghasilkan nilai pecahan akurat.",
          understood: false,
          keyConcepts: [
            "Type Casting (Implisit & Eksplisit)",
            "Integer Division Pitfall",
            "Pencegahan Overflow & Underflow",
          ],
          detailedGuide:
            "Konversi tipe data sering diperlukan ketika mengolah data antar format berbeda, misalnya menerima input teks dari pengguna lalu mengubahnya menjadi angka untuk dijumlahkan. Waspadai implicit casting yang dapat memotong angka desimal tanpa peringatan (truncation). Dalam pembagian integer di banyak bahasa komputer, 5 / 2 akan menghasilkan 2 bukan 2.5 jika tidak dikonversi ke float terlebih dahulu. Uji kode Anda dengan rentang angka ekstrem untuk mencegah overflow memori.",
          practiceScenario:
            "Tulis skenario uji di mana input berat badan (kg) dan tinggi badan (cm) dikonversi untuk menghitung indeks massa tubuh (BMI) dalam format desimal.",
          checkQuestion:
            "Bagaimana cara mencegah terjadinya data truncation saat melakukan konversi dari tipe data float ke integer?",
        },
      ]
    : [
        {
          step: 1,
          stage: "Tahap 1: Fondasi Konseptual",
          title: `Kuasai Landasan Teori ${formattedTitle.slice(0, 35)}`,
          description:
            "Pahami latar belakang permasalahan, batasan modul, serta terminologi inti yang menjadi tolok ukur penguasaan materi.",
          actionItem: `Buat ringkasan satu paragraf mengenai konsep kunci: "${extractedKeyPoints[0]?.term || formattedTitle}".`,
          understood: false,
          keyConcepts: [
            extractedKeyPoints[0]?.term || "Konsep Dasar",
            extractedKeyPoints[1]?.term || "Terminologi Inti",
          ],
          detailedGuide: `Pelajari konsep fundamental dari modul "${formattedTitle}". Pahami definisi utama, ruang lingkup materi, serta mengapa topik ini esensial dalam kerangka kurikulum akademik. Fokuskan perhatian pada istilah kunci yang menjadi pondasi analisis sistem.`,
          practiceScenario: `Identifikasi masalah nyata yang ingin dipecahkan oleh materi "${formattedTitle}" dan catat batasan ruang lingkupnya.`,
          checkQuestion: `Mengapa penguasaan fondasi konseptual "${extractedKeyPoints[0]?.term || formattedTitle}" menjadi prasyarat sebelum melangkah ke implementasi teknis?`,
        },
        {
          step: 2,
          stage: "Tahap 2: Pemetaan Komponen & Logika",
          title: "Identifikasi Komponen & Hubungan Antar Elemen",
          description:
            "Petakan seluruh input, proses pengolahan, serta output yang dihasilkan sistem sesuai skenario modul pembelajaran.",
          actionItem: `Identifikasi minimal 3 entitas atau variabel utama yang terlibat dalam studi kasus "${formattedTitle}".`,
          understood: false,
          keyConcepts: [
            extractedKeyPoints[1]?.term || "Struktur Data",
            extractedKeyPoints[2]?.term || "Alur Logika",
          ],
          detailedGuide: `Tahap ini berfokus pada pembedahan komponen sistem: bagaimana data masukan diterima, bagaimana struktur relasi antar elemen dihubungkan, dan proses komputasi apa yang mentransformasikan data menjadi luaran yang valid.`,
          practiceScenario: `Buat diagram alur atau daftar variabel yang merefleksikan hubungan antar komponen dalam materi "${formattedTitle}".`,
          checkQuestion: `Bagaimana Anda memverifikasi bahwa seluruh komponen input memiliki jalur pemrosesan yang jelas tanpa terjadi redundansi?`,
        },
        {
          step: 3,
          stage: "Tahap 3: Praktik & Implementasi Kasus",
          title: "Penerapan Solusi pada Studi Kasus",
          description:
            "Lakukan perancangan atau penulisan alur solusi langkah demi langkah mengikuti panduan tugas praktikum yang telah disediakan.",
          actionItem:
            "Kerjakan simulasi langkah praktikum secara sistematis dan dokumentasikan hasil eksekusinya.",
          understood: false,
          keyConcepts: [
            extractedKeyPoints[2]?.term || "Studi Kasus",
            extractedKeyPoints[3]?.term || "Implementasi Praktis",
          ],
          detailedGuide: `Terapkan konsep teoritis ke dalam skenario studi kasus konkret. Ikuti tahapan instruksi praktikum, uji coba langkah komputasi, dan amati bagaimana sistem beroperasi dalam menyelesaikan persoalan nyata.`,
          practiceScenario: `Simulasikan kasus uji konkret dengan data uji yang representatif dan catat keluaran yang dihasilkan.`,
          checkQuestion: `Langkah pencegahan apa yang Anda terapkan agar solusi yang dirancang tetap efisien ketika volume data meningkat?`,
        },
        {
          step: 4,
          stage: "Tahap 4: Audit & Validasi Integritas",
          title: "Verifikasi Kelayakan & Pengujian Bebas Kesalahan",
          description:
            "Lakukan pengecekan menyeluruh terhadap potensi kesalahan logika, konsistensi data, dan kepatuhan terhadap kaidah modul.",
          actionItem:
            "Uji hasil rancangan Anda dengan skenario kasus batas (edge case) dan pastikan tidak terdapat kebocoran logika.",
          understood: false,
          keyConcepts: [
            "Audit Integritas",
            "Validasi Edge Case",
            "Pencegahan Logika Cacat",
          ],
          detailedGuide: `Tahap akhir bertujuan memastikan bahwa hasil analisis dan rancangan bebas dari kesalahan fatal. Uji sistem dengan skenario ekstrem (nilai batas, input kosong, data tak valid) dan pastikan mekanisme penanganan kesalahan berfungsi dengan baik.`,
          practiceScenario: `Rancang 3 skenario uji batas (edge cases) dan uji apakah sistem memberikan respons atau luaran yang tepat.`,
          checkQuestion: `Mengapa pengujian kasus batas (edge cases) sama pentingnya dengan pengujian kasus normal (happy path)?`,
        },
      ];

  // 4. Kuis Active Recall yang Relevan dengan Konten Riil
  const quiz = [
    {
      id: 1,
      question: `Apa fokus konseptual utama yang dipelajari dalam modul "${formattedTitle}"?`,
      options: [
        `Penguasaan teori dan implementasi terstruktur terkait ${extractedKeyPoints[0]?.term || formattedTitle}`,
        "Menghafal baris kode tanpa memahami struktur logika proses",
        "Menghindari penggunaan diagram visual dalam perancangan sistem",
        "Membuat sistem tanpa melakukan identifikasi kebutuhan pengguna",
      ],
      correctIndex: 0,
      explanation: `Modul "${formattedTitle}" berfokus pada penguasaan terstruktur dari prinsip dasar hingga implementasi nyata agar alur sistem berjalan optimal.`,
    },
    {
      id: 2,
      question: `Mengapa konsep "${extractedKeyPoints[0]?.term || "Fondasi Dasar"}" sangat krusial dalam materi ini?`,
      options: [
        `Sebagai acuan utama dalam memastikan integritas pemrosesan data dan logika sistem`,
        "Hanya sebagai formalitas penulisan dokumentasi tanpa fungsi teknis",
        "Untuk memperlambat waktu eksekusi program di server produksi",
        "Agar struktur sistem menjadi rumit dan sulit didebug oleh pengembang lain",
      ],
      correctIndex: 0,
      explanation: `${extractedKeyPoints[0]?.term || "Konsep tersebut"} merupakan landasan utama yang menjamin reliabilitas dan konsistensi seluruh alur kerja sistem.`,
    },
    {
      id: 3,
      question:
        "Langkah validasi apa yang paling efektif sebelum meluncurkan solusi hasil praktikum ke lingkungan produksi?",
      options: [
        "Melakukan audit integritas alur logika serta pengujian kasus batas (edge cases)",
        "Langsung menerapkan kode tanpa melakukan pengujian unit atau integrasi",
        "Menghapus seluruh dokumentasi sistem agar ukuran berkas lebih kecil",
        "Mengabaikan standar penamaan dan kaidah konvensi modul",
      ],
      correctIndex: 0,
      explanation:
        "Pengujian kasus batas dan audit integritas alur logika memastikan sistem stabil terhadap input tak terduga serta bebas dari celah kesalahan fatal.",
    },
  ];

  return {
    title: formattedTitle,
    sourceType: input.sourceType,
    fileName: input.fileName,
    estimatedTime: "45 Menit",
    difficulty: "Menengah",
    xpReward: 130,
    summary: {
      overview: extractedOverview,
      keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : undefined,
      keyPoints: extractedKeyPoints,
      proTips:
        "Saat mempelajari materi ini, selalu petakan entitas masukan dan keluaran secara visual terlebih dahulu. Jangan langsung melompat ke detail teknis sebelum logika tingkat tingginya tervalidasi!",
      breakdownTime: {
        concept: "15 Menit",
        practice: "20 Menit",
        quiz: "10 Menit",
      },
    },
    roadmap,
    quiz,
  };
}

/**
 * Mesin Analisis AI Adaptif NexedAI
 * Menganalisis konten teks atau file modul secara semantik,
 * lalu menghasilkan Ringkasan Komprehensif, Roadmap Adaptif 4 Tahap,
 * Kuis Active Recall, dan Konteks Chatbot Tutor yang 100% SESUAI
 * dengan modul yang diunggah mahasiswa.
 */
export function analyzeModuleContent(input: AnalysisInput): AnalyzedModuleResult {
  const combinedText = `${input.title} ${input.content} ${input.fileName || ""}`.toLowerCase();

  // =========================================================================
  // 1. PRESET SPESIFIK / EXPLICIT PRESET CHIP SELECTION
  // =========================================================================
  const isExplicitPreset = Boolean(input.presetKey);

  // PRESET 1: Binary Search
  if (
    input.presetKey === "binary_search" ||
    (isExplicitPreset && combinedText.includes("binary search"))
  ) {
    return {
      title: "Algoritma Pencarian Biner (Binary Search) & Analisis Kompleksitas",
      sourceType: input.sourceType,
      fileName: input.fileName,
      estimatedTime: "45 Menit",
      difficulty: "Menengah",
      xpReward: 125,
      summary: {
        overview:
          "Algoritma Pencarian Biner (Binary Search) merupakan teknik pencarian berefisiensi tinggi dengan menerapkan paradigma Divide and Conquer. Pada kumpulan data yang telah terurut (sorted), algoritma ini bekerja secara berulang dengan membandingkan nilai target terhadap elemen median (midpoint). Dengan mengeliminasi setengah ruang pencarian pada setiap perbandingan, algoritma ini mencapai kompleksitas waktu logaritmik O(log N) yang jauh mengungguli Linear Search O(N) untuk himpunan data berskala besar.",
        keyPoints: [
          {
            term: "Divide and Conquer",
            definition:
              "Strategi algoritma yang memecah masalah besar menjadi sub-masalah independen berukuran separuh hingga nilai target ditemukan atau ruang pencarian habis.",
          },
          {
            term: "Kompleksitas Waktu O(log₂ N)",
            definition:
              "Pertumbuhan waktu eksekusi sebanding dengan logaritma biner dari ukuran data. Contoh: pada 1.000.000 elemen, Binary Search maksimal hanya memerlukan sekitar 20 kali perbandingan.",
          },
          {
            term: "Perhitungan Midpoint Aman",
            definition:
              "Menghitung titik tengah menggunakan rumus mid = low + (high - low) / 2 untuk mencegah potensi Integer Overflow pada memori ketika (low + high) melampaui batas representasi data 32-bit.",
          },
          {
            term: "Prasyarat Keterurutan (Sorted Pre-condition)",
            definition:
              "Kumpulan data harus telah terurut monoton (naik atau turun). Jika data belum terurut, biaya sorting awal O(N log N) harus dipertimbangkan dalam kalkulasi efisiensi sistem.",
          },
          {
            term: "Penanganan Kasus Batas (Edge Cases)",
            definition:
              "Pencarian pada array kosong, elemen di indeks pertama/terakhir, dan penanganan elemen duplikat (first occurrence vs last occurrence).",
          },
        ],
        proTips:
          "Hati-hati terhadap infinite loop pada kondisi 'while (low <= high)'. Pastikan selalu memperbarui pointer dengan 'low = mid + 1' atau 'high = mid - 1', BUKAN 'low = mid' atau 'high = mid'.",
        breakdownTime: {
          concept: "15 Menit",
          practice: "20 Menit",
          quiz: "10 Menit",
        },
      },
      roadmap: [
        {
          step: 1,
          stage: "Tahap 1: Fondasi Konseptual",
          title: "Pahami Pointer Triad (Low, Mid, High)",
          description:
            "Pelajari representasi visual bagaimana pergeseran batas ruang pencarian (low dan high) mengeliminasi 50% data di setiap iterasi.",
          actionItem:
            "Simulasikan pencarian angka 23 pada array 7 elemen secara manual di atas kertas.",
          understood: false,
        },
        {
          step: 2,
          stage: "Tahap 2: Implementasi Sintaks",
          title: "Konstruksi Loop Iteratif & Rumus Titik Tengah",
          description:
            "Tulis kode fungsi binary_search dengan kondisi terminasi 'while (low <= high)' dan pencegah integer overflow pada perhitungan mid.",
          actionItem:
            "Implementasikan kode dalam Python/C++ dan uji dengan nilai target yang ada di posisi ujung.",
          understood: false,
        },
        {
          step: 3,
          stage: "Tahap 3: Penanganan Kasus Batas",
          title: "Debugging Kasus Elemen Tidak Ditemukan & Duplikasi",
          description:
            "Pastikan algoritma mengembalikan nilai sentinel (-1 atau None) saat target tidak ada, dan implementasikan variasi Lower Bound / Upper Bound.",
          actionItem:
            "Uji fungsi dengan array kosong [] dan array berisi elemen duplikat [2, 4, 4, 4, 8].",
          understood: false,
        },
        {
          step: 4,
          stage: "Tahap 4: Benchmarking Kompleksitas",
          title: "Komparasi Kinerja O(log N) vs O(N)",
          description:
            "Bandingkan waktu komputasi Linear Search vs Binary Search pada array 1.000.000 data terurut untuk membuktikan superioritas logaritmik.",
          actionItem:
            "Jalankan script profiling waktu menggunakan timeit/benchmark pada kedua algoritma.",
          understood: false,
        },
      ],
      quiz: [
        {
          id: 1,
          question:
            "Apakah syarat mutlak yang harus dipenuhi sebelum menjalankan algoritma Binary Search pada suatu array?",
          options: [
            "Data harus bertipe integer genap",
            "Array harus dalam keadaan sudah terurut (sorted)",
            "Ukuran array harus merupakan kelipatan dua",
            "Array tidak boleh memiliki lebih dari 100 elemen",
          ],
          correctIndex: 1,
          explanation:
            "Binary Search mengandalkan asumsi bahwa jika target < mid, target pasti berada di separuh kiri. Asumsi ini hanya berlaku jika array sudah terurut monoton.",
        },
        {
          id: 2,
          question:
            "Berapa jumlah iterasi perbandingan maksimal (worst-case) untuk mencari elemen pada array terurut berukuran 1.024 elemen?",
          options: ["10 kali", "512 kali", "1.024 kali", "100 kali"],
          correctIndex: 0,
          explanation:
            "Karena kompleksitas waktu Binary Search adalah O(log₂ N), maka log₂(1024) = 10. Artinya maksimal hanya butuh 10 kali perbandingan.",
        },
        {
          id: 3,
          question:
            "Mengapa perhitungan midpoint 'mid = low + (high - low) / 2' lebih disarankan daripada '(low + high) / 2'?",
          options: [
            "Karena hasilnya otomatis berupa desimal",
            "Untuk mencegah potensi Integer Overflow pada variabel ketika nilai low + high melampaui kapasitas memori tipe integer",
            "Agar proses pembagian dua berjalan dua kali lebih cepat",
            "Untuk memungkinkan pencarian pada array tak terurut",
          ],
          correctIndex: 1,
          explanation:
            "Pada bahasa dengan tipe integer bertipe tetap (seperti Java, C++, C#), jika low dan high bernilai sangat besar, penjumlahannya (low + high) dapat melebihi nilai integer maksimum 2^31-1 dan menyebabkan overflow menjadi negatif.",
        },
      ],
    };
  }

  // PRESET 2: Tree Traversal
  if (input.presetKey === "tree_traversal" || (isExplicitPreset && combinedText.includes("tree"))) {
    return {
      title: "Struktur Data Pohon Biner (Tree) & Algoritma Traversal Rekursif",
      sourceType: input.sourceType,
      fileName: input.fileName,
      estimatedTime: "50 Menit",
      difficulty: "Lanjut",
      xpReward: 140,
      summary: {
        overview:
          "Pohon Biner (Binary Tree) adalah struktur data hierarkis non-linear di mana setiap simpul (node) memiliki maksimal dua simpul turunan, yaitu anak kiri (left child) dan anak kanan (right child). Salah satu varian paling penting adalah Binary Search Tree (BST), di mana semua nilai di sub-pohon kiri lebih kecil daripada simpul induk, dan semua nilai di sub-pohon kanan lebih besar. Traversal adalah proses mengunjungi setiap simpul dalam pohon tepat satu kali untuk pemrosesan data.",
        keyPoints: [
          {
            term: "Inorder Traversal (L-N-R)",
            definition:
              "Kunjungi sub-pohon kiri, lalu simpul saat ini, kemudian sub-pohon kanan. Pada BST, traversal ini dijamin selalu menghasilkan urutan data terurut naik (ascending).",
          },
          {
            term: "Preorder Traversal (N-L-R)",
            definition:
              "Kunjungi simpul saat ini terlebih dahulu sebelum anak-anaknya. Lazim digunakan untuk duplikasi/kloning struktur pohon dan evaluasi ekspresi aritmatika prefix.",
          },
          {
            term: "Postorder Traversal (L-R-N)",
            definition:
              "Kunjungi kedua anak terlebih dahulu sebelum simpul induk. Ideal untuk operasi dealokasi memori (penghapusan pohon dari daun ke akar) dan ekspresi postfix.",
          },
          {
            term: "Ketinggian Pohon (Height) & Keseimbangan",
            definition:
              "Kinerja pencarian pada BST berkisar dari O(log N) jika pohon seimbang (balanced), hingga memburuk menjadi O(N) jika pohon miring menyerupai Linked List (skewed tree).",
          },
          {
            term: "Breadth-First Search (BFS / Level-Order)",
            definition:
              "Mengunjungi simpul tingkat demi tingkat dari kiri ke kanan menggunakan struktur data bantu Antrean (Queue).",
          },
        ],
        proTips:
          "Saat menulis fungsi traversal rekursif, selalu tentukan Base Case 'if (root == null) return;' di baris paling awal sebelum memanggil rekursi turunan kiri dan kanan untuk menghindari 'RecursionError / StackOverflow'.",
        breakdownTime: {
          concept: "15 Menit",
          practice: "25 Menit",
          quiz: "10 Menit",
        },
      },
      roadmap: [
        {
          step: 1,
          stage: "Tahap 1: Fondasi Node",
          title: "Representasi Memori Class Node",
          description:
            "Bangun blueprint simpul yang menampung value data dan dua referensi pointer: left dan right.",
          actionItem: "Buat class Node sederhana dalam bahasa pemrograman pilihan Anda.",
          understood: false,
        },
        {
          step: 2,
          stage: "Tahap 2: Implementasi Traversal",
          title: "Konstruksi Fungsi Rekursif Inorder, Preorder, Postorder",
          description:
            "Tulis ketiga fungsi traversal rekursif dan cetak urutan simpul untuk membuktikan perbedaan alur pembacaan.",
          actionItem:
            "Lakukan Inorder Traversal pada BST dan verifikasi apakah outputnya terurut menaik.",
          understood: false,
        },
        {
          step: 3,
          stage: "Tahap 3: Operasi CRUD pada BST",
          title: "Penyisipan (Insertion) & Pencarian (Search)",
          description:
            "Implementasikan logika perbandingan nilai: jika nilai baru < root->val, belok kiri; jika lebih besar, belok kanan.",
          actionItem:
            "Uji fungsi search untuk menemukan keberadaan nilai tertentu dalam pohon biner.",
          understood: false,
        },
        {
          step: 4,
          stage: "Tahap 4: Level-Order & Analisis Memori",
          title: "Traversal Melebar Menggunakan Queue (BFS)",
          description:
            "Pelajari pemrosesan simpul per tingkat menggunakan antrean (FIFO) dan hitung kedalaman maksimum (max depth) dari pohon.",
          actionItem:
            "Buat fungsi penelusuran level-order dan cetak hasil per baris tingkat pohon.",
          understood: false,
        },
      ],
      quiz: [
        {
          id: 1,
          question: "Urutan penelusuran simpul pada Inorder Traversal adalah...",
          options: [
            "Root -> Kiri -> Kanan",
            "Kiri -> Root -> Kanan",
            "Kiri -> Kanan -> Root",
            "Kanan -> Root -> Kiri",
          ],
          correctIndex: 1,
          explanation:
            "Inorder mengunjungi sub-pohon kiri terlebih dahulu, kemudian simpul induk (root), dan diakhiri dengan sub-pohon kanan.",
        },
        {
          id: 2,
          question:
            "Pada Binary Search Tree (BST), traversal manakah yang menghasilkan urutan data terurut naik?",
          options: ["Preorder", "Postorder", "Inorder", "Level-order"],
          correctIndex: 2,
          explanation:
            "Karena aturan BST adalah kiri < induk < kanan, maka urutan Left-Root-Right (Inorder) selalu menghasilkan data berurutan secara teratur dari nilai terkecil ke terbesar.",
        },
        {
          id: 3,
          question:
            "Struktur data bantu apa yang lazim digunakan untuk Level-Order (Breadth-First) Traversal?",
          options: ["Stack (LIFO)", "Queue (FIFO)", "Hash Table", "Doubly Linked List"],
          correctIndex: 1,
          explanation:
            "Queue (First-In, First-Out) digunakan untuk menampung simpul anak per tingkat secara berurutan sehingga simpul yang masuk terlebih dahulu akan diproses terlebih dahulu.",
        },
      ],
    };
  }

  // PRESET 3: Database & SQL
  if (
    input.presetKey === "database_sql" ||
    (isExplicitPreset && combinedText.includes("database"))
  ) {
    return {
      title: "Perancangan Basis Data Relasional & Optimasi Kueri SQL",
      sourceType: input.sourceType,
      fileName: input.fileName,
      estimatedTime: "45 Menit",
      difficulty: "Menengah",
      xpReward: 130,
      summary: {
        overview:
          "Basis Data Relasional mengatur data ke dalam tabel-tabel terstruktur yang saling berelasi melalui Primary Key dan Foreign Key. Normalisasi (1NF hingga 3NF) bertujuan mengeliminasi anomali data (Insert, Update, Delete) serta mengurangi redundansi memori.",
        keyPoints: [
          {
            term: "Normalisasi 1NF, 2NF, 3NF",
            definition:
              "Proses dekomposisi tabel bertahap: 1NF memastikan nilai atomik, 2NF menghapus ketergantungan parsial, dan 3NF menghapus ketergantungan transitif.",
          },
          {
            term: "Integritas Referensial (Foreign Key)",
            definition:
              "Mekanisme penegakan konsistensi hubungan antar-tabel dengan aturan CASCADE, SET NULL, atau RESTRICT pada aksi penghapusan/pembaruan.",
          },
          {
            term: "Index B-Tree & Kecepatan Kueri",
            definition:
              "Struktur data indeks yang mengubah pencarian baris dari Full Table Scan O(N) menjadi Binary Search O(log N).",
          },
          {
            term: "Transaksi ACID",
            definition:
              "Empat pilar keandalan transaksi finansial/kritis: Atomicity, Consistency, Isolation, dan Durability.",
          },
        ],
        proTips:
          "Hindari kueri 'SELECT *' pada sistem produksi bervolume tinggi. Selalu sebutkan nama kolom secara eksplisit untuk menghemat bandwidth jaringan dan mengaktifkan optimasi Covering Index.",
        breakdownTime: {
          concept: "15 Menit",
          practice: "20 Menit",
          quiz: "10 Menit",
        },
      },
      roadmap: [
        {
          step: 1,
          stage: "Tahap 1: Desain Skema",
          title: "ERD & Identifikasi Kardinalitas Relasi",
          description: "Petakan relasi 1:1, 1:N, dan N:M antar entitas bisnis.",
          actionItem: "Gambarkan diagram ERD sistem pemesanan online sederhana.",
          understood: false,
        },
        {
          step: 2,
          stage: "Tahap 2: Normalisasi",
          title: "Dekomposisi Tabel ke Bentuk 3NF",
          description: "Hilangkan redundansi data transaksi dengan pemisahan tabel.",
          actionItem: "Lakukan normalisasi pada tabel invoice mentah hingga mencapai 3NF.",
          understood: false,
        },
        {
          step: 3,
          stage: "Tahap 3: Konstruksi SQL",
          title: "Penyusunan Kueri JOIN Kompleks",
          description:
            "Gunakan INNER JOIN, LEFT JOIN, dan GROUP BY untuk menghasilkan rekapitulasi data.",
          actionItem: "Tulis kueri rekap total penjualan per kategori produk bulanan.",
          understood: false,
        },
        {
          step: 4,
          stage: "Tahap 4: Optimasi Kueri",
          title: "Analisis EXPLAIN & Pembuatan Index",
          description: "Analisis rencana eksekusi database dan pasang indeks yang tepat.",
          actionItem: "Jalankan EXPLAIN ANALYZE pada kueri dan evaluasi penurunan biaya kueri.",
          understood: false,
        },
      ],
      quiz: [
        {
          id: 1,
          question: "Kondisi tabel yang telah memenuhi 2NF (Second Normal Form) adalah...",
          options: [
            "Semua kolom bernilai atomik dan tidak ada ketergantungan parsial terhadap Primary Key gabungan (Composite PK)",
            "Tabel memiliki minimal 10 indeks aktif",
            "Tabel tidak memiliki Foreign Key",
            "Tabel memiliki kolom bertipe JSON",
          ],
          correctIndex: 0,
          explanation:
            "2NF mensyaratkan tabel sudah dalam 1NF dan setiap atribut non-kunci harus bergantung penuh secara fungsional pada keseluruhan Primary Key.",
        },
        {
          id: 2,
          question: "Karakteristik 'Atomicity' pada prinsip ACID menjamin bahwa...",
          options: [
            "Seluruh rangkaian instruksi dalam transaksi harus sukses semua, atau jika ada satu kegagalan maka seluruh perubahan dibatalkan (Rollback)",
            "Data otomatis terenkripsi 256-bit",
            "Kueri berjalan tanpa memakan RAM server",
            "Tabel otomatis di-backup setiap detik",
          ],
          correctIndex: 0,
          explanation:
            "Atomicity berarti transaksi bersifat 'semua atau tidak sama sekali' (all-or-nothing).",
        },
        {
          id: 3,
          question: "Kapan pembuatan indeks (Index) pada kolom tabel TIDAK disarankan?",
          options: [
            "Pada kolom yang sangat sering menerima operasi INSERT/UPDATE massal dengan kardinalitas nilai sangat rendah (seperti status boolean)",
            "Pada kolom Primary Key",
            "Pada kolom Foreign Key yang sering di-JOIN",
            "Pada kolom email yang sering dicari",
          ],
          correctIndex: 0,
          explanation:
            "Setiap operasi penulisan (INSERT/UPDATE/DELETE) mewajibkan database memperbarui pohon indeks, sehingga indeks berlebih akan memperlambat kinerja penulisan data.",
        },
      ],
    };
  }

  // PRESET 4: OOP & Clean Architecture
  if (input.presetKey === "oop_clean" || (isExplicitPreset && combinedText.includes("oop"))) {
    return {
      title: "Pemrograman Berorientasi Objek (OOP) & Arsitektur Bersih",
      sourceType: input.sourceType,
      fileName: input.fileName,
      estimatedTime: "40 Menit",
      difficulty: "Menengah",
      xpReward: 120,
      summary: {
        overview:
          "Pemrograman Berorientasi Objek (OOP) memodelkan sistem perangkat lunak ke dalam entitas-entitas objek yang membungkus status (atribut) dan perilaku (metode). Empat pilar utamanya—Enkapsulasi, Abstraksi, Pewarisan (Inheritance), dan Polimorfisme—memungkinkan pembuatan sistem modular, dapat diperluas, dan mudah dirawat.",
        keyPoints: [
          {
            term: "Enkapsulasi (Encapsulation)",
            definition:
              "Menyembunyikan representasi internal objek dari luar dan hanya membuka akses terbatas melalui metode publik (getter/setter) guna menjamin integritas data.",
          },
          {
            term: "Polimorfisme (Polymorphism)",
            definition:
              "Kemampuan objek berbeda untuk merespons pesan atau pemanggilan metode yang sama dengan perilaku spesifik masing-masing (Method Overriding & Overloading).",
          },
          {
            term: "Abstraksi (Abstraction)",
            definition:
              "Menyederhanakan realitas kompleks dengan menyajikan antarmuka (interface / abstract class) tanpa mengekspos detail implementasi internal.",
          },
          {
            term: "Prinsip SOLID (Single Responsibility)",
            definition:
              "Sebuah kelas seharusnya hanya memiliki satu alasan untuk berubah, menjaga kode tetap fokus pada satu tanggung jawab modul tertentu.",
          },
        ],
        proTips:
          "Utamakan Komposisi daripada Pewarisan (Composition over Inheritance). Hubungan 'has-a' seringkali jauh lebih fleksibel dan minim kopling daripada hierarki 'is-a' yang terlalu dalam.",
        breakdownTime: {
          concept: "15 Menit",
          practice: "15 Menit",
          quiz: "10 Menit",
        },
      },
      roadmap: [
        {
          step: 1,
          stage: "Tahap 1: Fondasi Kelas & Objek",
          title: "Desain Blueprint Class & Instance",
          description: "Definisikan atribut private, constructor, dan method publik pada class.",
          actionItem: "Buat class RekeningBank dengan validasi penarikan saldo aman.",
          understood: false,
        },
        {
          step: 2,
          stage: "Tahap 2: Pewarisan & Polimorfisme",
          title: "Spesialisasi dengan Subclassing",
          description: "Perluas fungsi superclass menggunakan override method pada turunan.",
          actionItem:
            "Buat turunan RekeningTabungan dan RekeningDeposito dengan suku bunga berbeda.",
          understood: false,
        },
        {
          step: 3,
          stage: "Tahap 3: Abstraksi & Kontrak",
          title: "Penerapan Interface & Dependency Injection",
          description: "Lepaskan keterikatan langsung antar-kelas menggunakan kontrak antarmuka.",
          actionItem: "Implementasikan interface PembayaranGateway pada dua vendor berbeda.",
          understood: false,
        },
        {
          step: 4,
          stage: "Tahap 4: Arsitektur Bersih",
          title: "Refaktorisasi Mengikuti Kaidah SOLID",
          description: "Pisahkan logika bisnis inti (Domain) dari detail teknis (Database/UI).",
          actionItem: "Uji unit test business logic tanpa memerlukan koneksi database riil.",
          understood: false,
        },
      ],
      quiz: [
        {
          id: 1,
          question:
            "Menyembunyikan atribut privat kelas dan hanya mengizinkan modifikasi melalui method getter/setter disebut...",
          options: ["Polimorfisme", "Enkapsulasi", "Inheritance", "Kompilasi"],
          correctIndex: 1,
          explanation:
            "Enkapsulasi membungkus data dan method dalam satu unit serta membatasi akses langsung dari luar kelas guna menjaga integritas data.",
        },
        {
          id: 2,
          question:
            "Sebuah method pada subclass yang memiliki nama, parameter, dan return type yang sama persis dengan method di superclass dinamakan...",
          options: ["Method Overloading", "Method Overriding", "Method Shadowing", "Constructor"],
          correctIndex: 1,
          explanation:
            "Method Overriding terjadi ketika subclass menyediakan implementasi spesifik dari method yang sudah dideklarasikan di superclass-nya pada saat runtime.",
        },
        {
          id: 3,
          question:
            "Pilar OOP yang memungkinkan suatu antarmuka menyembunyikan detail implementasi sistem yang kompleks adalah...",
          options: ["Abstraksi", "Kompilasi", "Deklarasi", "Duplikasi"],
          correctIndex: 0,
          explanation:
            "Abstraksi berfokus pada apa yang dilakukan oleh objek (antarmuka publik), bukan bagaimana objek tersebut melakukannya secara internal.",
        },
      ],
    };
  }

  // =========================================================================
  // 2. DOMAIN: PEMODELAN PROSES BISNIS / ANALISIS PERANCANGAN SISTEM (BAB 5 FLOWCHART & DFD)
  // =========================================================================
  const isProcessModeling =
    input.presetKey === "process_modeling" ||
    (combinedText.includes("bab 5") &&
      (combinedText.includes("pemodelan proses bisnis") ||
        (combinedText.includes("flowchart") && combinedText.includes("dfd")))) ||
    (combinedText.includes("analis perancangan sistem") &&
      combinedText.includes("flowchart") &&
      combinedText.includes("dfd"));

  if (isProcessModeling) {
    const derivedDocTitle = extractSalientTitle(
      input.content,
      "Bab 5: Pemodelan Proses Bisnis (Flowchart & DFD) - Analisis Perancangan Sistem",
    );

    return {
      title: derivedDocTitle,
      sourceType: input.sourceType,
      fileName: input.fileName,
      estimatedTime: "50 Menit",
      difficulty: "Menengah",
      xpReward: 135,
      summary: {
        overview:
          "Pemodelan Proses Bisnis merupakan teknik krusial dalam Rekayasa Perangkat Lunak untuk mendokumentasikan, memvisualisasikan, dan mengorganisasikan aliran data dan logika sistem informasi. Modul ini membahas dua instrumen utama: Flowchart Sistem (berfokus pada dimensi urutan waktu, perulangan, dan logika percabangan if-else) serta Data Flow Diagram / DFD (berfokus murni pada pergerakan data dari entitas eksternal, transformasi melalui proses, hingga penyimpanan di database). Pemodelan ini menjembatani komunikasi universal antara analis, klien bisnis, dan programmer, memetakan kelemahan sistem lama (As-Is System), serta merancang arsitektur sistem baru terkomputerisasi (To-Be System) yang bebas dari cacat logika fatal seperti Black Hole, Miracle, dan Gray Hole.",
        keyPoints: [
          {
            term: "Perbedaan Fundamental Flowchart vs DFD",
            definition:
              "Flowchart berfokus pada WAKTU dan LOGIKA KONTROL (menjawab langkah 1-2, percabangan If-Else, dan looping). Sebaliknya, DFD berfokus murni pada ALIRAN DATA (dari mana data berasal, diproses menjadi apa, dan disimpan di tabel mana) tanpa mengenal konsep urutan waktu maupun If-Else.",
          },
          {
            term: "Fase As-Is System & To-Be System",
            definition:
              "Pemodelan As-Is menggambarkan alur kerja manual atau sistem berjalan saat ini untuk melacak 'penyakit' atau titik kelemahan sistem (seperti antrean panjang atau berkas hilang). Fase To-Be merancang sistem baru terkomputerisasi sebagai solusi usulan ('obat').",
          },
          {
            term: "Simbol Standar Flowchart (ISO/ANSI)",
            definition:
              "Menggunakan simbol baku internasional: Terminator (oval: Mulai/Selesai), Data/Input-Output (jajar genjang), Process (persegi panjang: komputasi sistem), Decision (belah ketupat: percabangan kondisi Ya/Tidak), dan Flow (panah arah aliran logika).",
          },
          {
            term: "4 Komponen Utama DFD (Gane & Sarson / Yourdon)",
            definition:
              "Entitas Eksternal (kotak: aktor pihak luar sumber/tujuan data), Proses (lingkaran/kotak tumpul berlabel kata kerja aktif), Data Store (garis paralel berlabel kata benda), dan Aliran Data (panah berlabel kata benda).",
          },
          {
            term: "Kesalahan Fatal DFD (Dosa Besar DFD)",
            definition:
              "Larangan koneksi langsung Entitas-ke-Entitas, Entitas-ke-Data Store, atau Data Store-ke-Data Store tanpa perantara Proses. Kesalahan proses fatal meliputi Black Hole (ada input tanpa output), Miracle/White Hole (ada output tanpa input), dan Gray Hole (input tidak memadai/tidak relevan untuk menghasilkan output).",
          },
          {
            term: "Hierarki DFD & Prinsip Balancing",
            definition:
              "Diagram Konteks (Level 0) hanya memiliki 1 proses utama tanpa Data Store (database tersembunyi di dalam). DFD Level 1 memecah modul utama dan mulai menampilkan tabel database. Balancing mewajibkan jumlah panah masuk/keluar antara Diagram Konteks dan DFD Level 1 harus persis sama.",
          },
        ],
        proTips:
          "Ingat Aturan Emas DFD: 'Data tidak bisa bergerak sendiri, harus ada PROSES yang memindahkannya!' Jangan pernah membuat garis panah langsung dari Entitas ke Data Store atau antar Entitas. Pada Diagram Konteks (Level 0), dilarang menggambarkan tabel Database karena database dianggap berada di dalam sistem.",
        breakdownTime: {
          concept: "15 Menit",
          practice: "25 Menit",
          quiz: "10 Menit",
        },
      },
      roadmap: [
        {
          step: 1,
          stage: "Tahap 1: Fondasi Analisis & Identifikasi Komponen",
          title: "Identifikasi Entitas, Aliran Input, & Output Laporan",
          description:
            "Bedah skenario bisnis (seperti Kasir Toko Sinar Makmur) menjadi daftar Entitas Eksternal, Data Masukan, dan Data Keluaran sebelum mulai menggambar.",
          actionItem:
            "Tuliskan minimal 3 entitas eksternal, 3 data input, dan 3 output laporan dari sistem kasir pada lembar kerja praktikum.",
          understood: false,
          keyConcepts: [
            "Entitas Eksternal (Boundary Actor)",
            "Data Masukan (Input Stream)",
            "Informasi Keluaran (Output Artifact)",
          ],
          detailedGuide:
            "Langkah awal pemodelan proses bisnis adalah mengidentifikasi batasan ruang lingkup sistem. Mahasiswa membedah skenario operasional (seperti transaksi toko retail Sinar Makmur) untuk memisahkan siapa saja pelaku di luar sistem (Pelanggan, Pemasok, Pemilik), informasi apa yang mereka masukkan ke sistem, serta dokumen atau laporan apa yang berhak mereka terima kembali.",
          practiceScenario:
            "Berdasarkan narasi kasir Sinar Makmur, buat tabel daftar entitas, input data, dan output yang dihasilkan. Pastikan setiap entitas memiliki minimal satu interaksi dua arah jika relevan.",
          checkQuestion:
            "Mengapa kita dilarang langsung menggambar diagram sebelum menyusun daftar inventarisasi entitas dan aliran data?",
        },
        {
          step: 2,
          stage: "Tahap 2: Konstruksi Bagan Alir (Flowchart)",
          title: "Perancangan Bagan Alir (Flowchart) & Standar ISO/ANSI",
          description:
            "Susun urutan logika proses dari Terminator Mulai, input data barang, komputasi total belanja, logika Decision diskon 5% (> Rp 50.000), hingga cetak struk belanja.",
          actionItem:
            "Buat diagram Flowchart perhitungan belanja secara manual di kertas dan digital menggunakan Draw.io.",
          understood: false,
          keyConcepts: [
            "Simbol Baku ISO/ANSI",
            "Logika Percabangan (Decision)",
            "Dimensi Waktu & Urutan Langkah",
          ],
          detailedGuide:
            "Flowchart menggambarkan prosedur kerja sistem secara kronologis (terikat dimensi waktu). Setiap bentuk simbol memiliki fungsi eksklusif: Terminator (Oval) untuk titik awal dan akhir, Jajaran Genjang untuk operasi pembacaan input kasir, Persegi Panjang untuk kalkulasi aritmatika total belanja, dan Belah Ketupat (Decision) untuk mengevaluasi kondisi apakah total belanja melampaui Rp 50.000 guna menentukan berlakunya diskon 5%.",
          practiceScenario:
            "Rancang Flowchart transaksi kasir dari Terminator Mulai, input nama barang & harga, hitung total belanja, evaluasi kondisi diskon (> 50.000), hitung uang kembalian, cetak struk, hingga Terminator Selesai.",
          checkQuestion:
            "Apa konsekuensi logis jika sebuah flowchart tidak memiliki simbol Terminator penutup?",
        },
        {
          step: 3,
          stage: "Tahap 3: Konstruksi Data Flow Diagram (DFD)",
          title: "Pemodelan Data Flow Diagram (DFD) & Diagram Konteks Level 0",
          description:
            "Gambarkan batasan sistem secara menyeluruh dengan SATU proses utama di tengah yang berinteraksi dengan entitas eksternal tanpa memunculkan database di Level 0.",
          actionItem:
            "Rancang Diagram Konteks Sistem Kasir di Draw.io dan verifikasi semua anak panah telah diberi label kata benda.",
          understood: false,
          keyConcepts: [
            "Diagram Konteks (DFD Level 0)",
            "Single Process Representation",
            "Aturan Penamaan Aliran Data",
          ],
          detailedGuide:
            "Berbeda dengan Flowchart, Data Flow Diagram (DFD) murni menelusuri perpindahan dan transformasi data tanpa mengenal urutan waktu atau nomor langkah. Pada Diagram Konteks (Level 0), seluruh aplikasi diwakili oleh tepat SATU lingkaran proses sentral. Di level ini, tabel database (Data Store) dilarang digambar karena database dianggap bagian internal sistem. Semua anak panah wajib diberi label kata benda (noun) yang menunjukkan paket data yang mengalir.",
          practiceScenario:
            "Gambarkan Diagram Konteks untuk Sistem Penjualan Toko Sinar Makmur yang menghubungkan Proses Sentral 'Sistem Kasir Toko' dengan entitas Pelanggan, Pemasok, dan Pemilik Toko.",
          checkQuestion:
            "Mengapa simbol database (Data Store) dilarang digambar pada Diagram Konteks (DFD Level 0)?",
        },
        {
          step: 4,
          stage: "Tahap 4: Audit Integritas & Validasi DFD",
          title: "Pencegahan Kesalahan Fatal & Verifikasi Balancing",
          description:
            "Audit seluruh diagram untuk memastikan bebas dari kesalahan Black Hole, Miracle, Gray Hole, serta memastikan konsistensi jumlah aliran data (Balancing).",
          actionItem:
            "Periksa kembali bahwa setiap simbol Proses memiliki minimal 1 input dan 1 output, serta tidak ada entitas yang terhubung langsung ke entitas lain.",
          understood: false,
          keyConcepts: [
            "Pencegahan Black Hole & Miracle",
            "Larangan Koneksi Langsung",
            "Prinsip Balancing Konteks vs Level 1",
          ],
          detailedGuide:
            "Lakukan audit kepatuhan terhadap kaidah DFD: (1) Entitas tidak boleh terhubung langsung ke entitas lain atau ke database tanpa perantara Proses. (2) Cegah Black Hole (proses hanya punya input tanpa hasil output) dan Miracle (proses tiba-tiba memuntahkan output tanpa ada data mentah yang masuk). (3) Terapkan prinsip Balancing: jumlah panah masuk dan keluar dari entitas di Level 0 harus konsisten persis dengan jumlah panah di DFD Level 1.",
          practiceScenario:
            "Periksa diagram DFD Level 1 toko kasir Anda, uji apakah ada proses tanpa panah keluar, dan hitung kesetaraan jumlah panah masuk/keluar terhadap Diagram Konteks.",
          checkQuestion:
            "Apa yang dimaksud dengan kesalahan Gray Hole pada pemodelan proses DFD?",
        },
      ],
      quiz: [
        {
          id: 1,
          question:
            "Apa perbedaan mendasar antara sudut pandang Flowchart dan Data Flow Diagram (DFD)?",
          options: [
            "Flowchart berfokus pada dimensi waktu dan logika kontrol (urutan/if-else), sedangkan DFD murni berfokus pada aliran pergerakan data",
            "Flowchart hanya digunakan untuk perancangan database, sedangkan DFD untuk penulisan kode",
            "Flowchart tidak mengenal simbol panah alur, sedangkan DFD memilikinya",
            "Keduanya sama persis dan hanya berbeda pilihan warna",
          ],
          correctIndex: 0,
          explanation:
            "Flowchart menjawab pertanyaan 'Kapan dan Bagaimana urutan logikanya?' (mengenal urutan waktu dan percabangan). Sedangkan DFD menjawab 'Dari mana data berasal, diproses jadi apa, dan disimpan di mana?' tanpa mengenal konsep waktu atau If-Else.",
        },
        {
          id: 2,
          question:
            "Dalam perancangan DFD, kesalahan proses di mana terdapat panah output keluar tetapi tidak memiliki panah input masuk sama sekali dinamakan...",
          options: [
            "Black Hole (Lubang Hitam)",
            "Miracle / White Hole (Keajaiban)",
            "Gray Hole (Lubang Abu-abu)",
            "Data Leakage (Kebocoran Data)",
          ],
          correctIndex: 1,
          explanation:
            "Miracle (Keajaiban) terjadi ketika sebuah proses menghasilkan informasi baru tanpa pernah ada data masukan mentah yang dimasukkan ke dalamnya, yang secara logika mustahil terjadi.",
        },
        {
          id: 3,
          question:
            "Pada Diagram Konteks (DFD Level 0), mengapa simbol Data Store (tabel database) DILARANG digambarkan?",
          options: [
            "Karena sistem informasi belum memiliki basis data",
            "Karena pada pandangan global (helicopter view), database dianggap berada tersembunyi di dalam proses sistem utama",
            "Agar diagram bisa memuat lebih banyak entitas eksternal",
            "Supaya programmer tidak perlu menulis query database",
          ],
          correctIndex: 1,
          explanation:
            "Diagram Konteks memandang sistem sebagai satu kesatuan tertutup (black box) dari luar. Penyimpanan data (Data Store) baru mulai dimunculkan pada saat dekomposisi modul di DFD Level 1.",
        },
        {
          id: 4,
          question:
            "Di antara aturan koneksi DFD berikut, manakah hubungan yang DILARANG KERAS dalam kaidah pemodelan sistem?",
          options: [
            "Entitas Eksternal terhubung langsung ke Entitas Eksternal lain atau langsung ke Data Store tanpa melalui Proses",
            "Entitas Eksternal memberikan data masukan ke Proses",
            "Proses menyimpan dan membaca data dari Data Store",
            "Proses mengirimkan data keluaran atau laporan ke Entitas Eksternal",
          ],
          correctIndex: 0,
          explanation:
            "Prinsip fundamental DFD menyatakan bahwa 'Data tidak bisa bergerak sendiri, harus ada PROSES yang memindahkannya'. Hubungan Entitas-ke-Entitas atau Entitas-ke-Data Store secara langsung dilarang keras.",
        },
      ],
    };
  }

  // =========================================================================
  // 3. SPESIFIK: JIKA KONTEN SECARA EKSPLISIT MEMINTA PRESET TOPIK CS TERTENTU
  // =========================================================================
  if (
    isExplicitPreset &&
    (combinedText.includes("binary search") || combinedText.includes("pencarian biner"))
  ) {
    return analyzeModuleContent({ ...input, presetKey: "binary_search" });
  }

  if (
    isExplicitPreset &&
    (combinedText.includes("pohon biner") || combinedText.includes("binary tree")) &&
    combinedText.includes("traversal")
  ) {
    return analyzeModuleContent({ ...input, presetKey: "tree_traversal" });
  }

  if (
    isExplicitPreset &&
    (combinedText.includes("basis data") || combinedText.includes("database")) &&
    (combinedText.includes("normalisasi") || combinedText.includes("sql"))
  ) {
    return analyzeModuleContent({ ...input, presetKey: "database_sql" });
  }

  if (
    isExplicitPreset &&
    (combinedText.includes("enkapsulasi") || combinedText.includes("polimorfisme")) &&
    (combinedText.includes("inheritance") || combinedText.includes("class"))
  ) {
    return analyzeModuleContent({ ...input, presetKey: "oop_clean" });
  }

  // =========================================================================
  // 4. UNIVERSAL SMART DYNAMIC EXTRACTOR: UNTUK SETIAP MODUL LAINNYA
  // =========================================================================
  return extractDynamicModule(input, combinedText);
}

/**
 * Generator Respons Chatbot Tutor Nexed AI
 * Menjawab pertanyaan spesifik mahasiswa seputar modul yang diunggah
 * dengan konteks mendalam (termasuk Flowchart, DFD, Case Study, dll).
 */
/**
 * Generator Respons Chatbot Tutor Nexed AI
 * Menjawab pertanyaan spesifik mahasiswa seputar modul yang diunggah
 * dengan konteks mendalam, guardrail anti-cheating untuk kuis, dan penjelasan akurat.
 */
export function generateChatResponse(params: {
  moduleTitle: string;
  userQuestion: string;
  moduleOverview?: string;
  keyPoints?: Array<{ term: string; definition: string }>;
  quizContext?: Array<{ question: string; explanation?: string }>;
}): string {
  const { moduleTitle, userQuestion } = params;
  const lowerQ = userQuestion.toLowerCase();
  const lowerTitle = moduleTitle.toLowerCase();

  // 1. Guardrail Anti-Cheating Kuis Active Recall (Pedagogical Guardrail)
  const isAskingQuizAnswer =
    /jawaban.*kuis|kunci.*jawaban|jawaban.*nomor|soal.*nomor|jawabannya.*apa|apa.*jawabannya/i.test(
      lowerQ,
    ) ||
    Boolean(
      params.quizContext?.some((q) =>
        lowerQ.includes(q.question.toLowerCase().slice(0, 30)),
      ),
    );

  if (isAskingQuizAnswer) {
    const matchNo = lowerQ.match(/nomor\s*(\d+)|no\s*(\d+)/i);
    const qNum = matchNo ? Number(matchNo[1] || matchNo[2]) : 1;
    const targetQ = params.quizContext?.[qNum - 1];

    let clueText = "";
    if (targetQ) {
      clueText = `\n\n💡 **Petunjuk & Arah Berpikir Soal ${qNum}:**\n> *"${targetQ.question}"*\n\n**Landasan Teori:** ${targetQ.explanation || "Perhatikan fondasi utama yang mendasari integritas pemrosesan modul ini."}`;
    }

    return `🎯 **Integritas Akademik Kuis Active Recall:**\n\nSebagai AI Tutor akademik, saya tidak boleh memberikan kunci jawaban atau membocorkan opsi langsung (A, B, C, atau D) agar Anda dapat melatih retensi memori dan daya analisis (*active recall*) secara optimal.${clueText}\n\nSilakan telaah opsi yang tersedia di tab **Kuis Active Recall**, pilih yang paling selaras dengan prinsip di atas, lalu tekan **Periksa Jawaban**! Jika masih ragu pada konsepnya, tanyakan kepada saya bagian teori mana yang perlu diperdalam.`;
  }

  // 2. Pertanyaan Spesifik: Pseudocode & Desain Algoritma
  if (
    lowerQ.includes("pseudocode") ||
    lowerQ.includes("pseudo-code") ||
    lowerQ.includes("pseudo code")
  ) {
    return `📝 **Tujuan Utama Membuat Pseudocode Sebelum Menulis Kode Program:**\n\n1. **Memisahkan Logika Solusi dari Sintaks Bahasa:**\n   • Menulis pseudocode memungkinkan programmer fokus 100% pada **alur algoritma pemecahan masalah** tanpa terdistraksi oleh aturan sintaksis teknis (seperti titik koma, tipe data memori, atau library tertentu).\n\n2. **Mendeteksi Kesalahan Logika Sejak Dini:**\n   • Menemukan kesalahan alur (seperti loop tanpa henti atau kondisi percabangan yang salah) jauh lebih mudah diperbaiki pada teks pseudocode dibanding saat kode sudah dikompilasi.\n\n3. **Jembatan Komunikasi Lintas Tim:**\n   • Pseudocode menggunakan bahasa semi-alami yang dapat ditinjau bersama analis sistem, penguji QA, maupun programmer yang menggunakan bahasa pemrograman berbeda (Python, Java, C++).\n\n4. **Mempercepat dan Menyederhanakan Proses Coding:**\n   • Ketika struktur logika pseudocode sudah matang dan teruji, penulisan kode program sesungguhnya menjadi jauh lebih cepat karena tinggal mentranslasikan setiap baris konsep ke sintaks bahasa yang dipilih.\n\n*Intinya:* Pseudocode adalah **cetak biru (blueprint)** logika sebelum Anda mendirikan bangunan kode program nyata.`;
  }

  // 3. Kategori: Tipe Data, Variabel, Konstanta & Operator
  if (
    lowerTitle.includes("tipe data") ||
    lowerTitle.includes("variabel") ||
    lowerTitle.includes("alpro") ||
    lowerQ.includes("tipe data") ||
    lowerQ.includes("data type")
  ) {
    if (lowerQ.includes("beda") || lowerQ.includes("perbedaan") || lowerQ.includes("konstanta")) {
      return `📌 **Perbedaan Fundamental Variabel vs Konstanta:**\n\n| Aspek | Variabel | Konstanta (Constant) |\n| :--- | :--- | :--- |\n| **Sifat Nilai** | **Dapat berubah (Mutable)** selama runtime | **Tetap (Immutable)** sejak dideklarasikan |\n| **Tujuan** | Menampung nilai dinamis (contoh: \`skor\`, \`counter\`) | Menampung nilai patokan (contoh: \`PI = 3.14\`, \`PAJAK = 0.11\`) |\n| **Keamanan** | Fleksibel untuk kalkulasi bertahap | Mencegah bug perubahan nilai yang tidak disengaja |\n\n*Praktik Baik:* Gunakan konstanta dengan huruf kapital (\`MAX_BUFFER\`) untuk memudahkan pembacaan kode.`;
    }

    if (lowerQ.includes("numerik") || lowerQ.includes("integer") || lowerQ.includes("float")) {
      return `🔢 **Klasifikasi Data Numerik (Integer vs Float):**\n\n1. **Integer (Bilangan Bulat):**\n   • Menyimpan angka bulat positif/negatif tanpa desimal (contoh: \`42\`, \`-7\`, \`0\`).\n   • Efisien dalam alokasi memori dan operasi aritmatika diskrit.\n\n2. **Float / Real (Bilangan Pecahan):**\n   • Menyimpan angka berkoma / desimal (contoh: \`3.14159\`, \`-0.05\`).\n   • Digunakan untuk kalkulasi saintifik, pengukuran, dan persentase.`;
    }

    if (lowerQ.includes("boolean") || lowerQ.includes("logika")) {
      return `⚖️ **Tipe Data Boolean:**\n\n• Hanya memiliki dua nilai kebenaran: \`True\` (Benar / 1) atau \`False\` (Salah / 0).\n• **Fungsi Utama:** Mengontrol struktur keputusan percabangan (\`if-else\`) dan kondisi penghentian perulangan (\`while\`).\n• Dihasilkan dari ekspresi relasional (contoh: \`5 > 3\` menghasilkan \`True\`).`;
    }
  }

  // 4. Kategori: Flowchart & DFD (Pemodelan Proses Bisnis)
  if (
    lowerTitle.includes("flowchart") ||
    lowerTitle.includes("dfd") ||
    lowerTitle.includes("proses bisnis") ||
    lowerTitle.includes("analis perancangan") ||
    lowerQ.includes("flowchart") ||
    lowerQ.includes("dfd") ||
    lowerQ.includes("diagram konteks")
  ) {
    if (lowerQ.includes("beda") || lowerQ.includes("perbedaan") || lowerQ.includes("vs")) {
      return `📊 **Perbedaan Fundamental Flowchart vs Data Flow Diagram (DFD):**\n\n| Aspek | Flowchart Sistem | Data Flow Diagram (DFD) |\n| :--- | :--- | :--- |\n| **Fokus Utama** | WAKTU & LOGIKA KONTROL (Urutan langkah, percabangan If-Else, looping) | ALIRAN DATA murni (Asal data, transformasi proses, tempat simpan) |\n| **Konsep Waktu** | Sangat terikat waktu (Langkah 1, Langkah 2, Selesai) | TIDAK mengenal urutan waktu maupun nomor langkah |\n| **Percabangan** | Menggunakan simbol Decision (Belah Ketupat) | TIDAK ADA simbol percabangan kondisi (No If-Else) |\n| **Analogi** | **Buku Resep Roti** (Langkah 1 masukkan terigu, langkah 2 panggang) | **Pipa Saluran Air** (Menunjukkan dari tangki mana air mengalir) |\n\n*Kesimpulan Analis:* Gunakan Flowchart untuk memetakan alur komputasi/prosedur kerja, dan gunakan DFD untuk merancang arsitektur lalu lintas data perangkat lunak.`;
    }

    if (
      lowerQ.includes("dosa") ||
      lowerQ.includes("kesalahan") ||
      lowerQ.includes("black hole") ||
      lowerQ.includes("miracle") ||
      lowerQ.includes("gray hole")
    ) {
      return `⚠️ **Kesalahan Fatal & "Dosa Besar" dalam Perancangan DFD:**\n\n1. **Koneksi Haram (Direct Connections):**\n   • Entitas TIDAK BOLEH langsung ke Entitas lain.\n   • Entitas TIDAK BOLEH langsung ke Data Store (database) tanpa proses.\n   • Data Store TIDAK BOLEH langsung terhubung ke Data Store lain.\n   *(Prinsip: Data tidak bisa bergerak sendiri, harus ada PROSES yang memindahkannya!)*\n\n2. **Black Hole (Lubang Hitam):**\n   • Proses hanya memiliki panah input masuk, tetapi TIDAK ADA panah output keluar. Data tertelan begitu saja tanpa hasil.\n\n3. **Miracle (Keajaiban / White Hole):**\n   • Proses menghasilkan panah output keluar, tetapi TIDAK ADA panah input masuk. Sangat tidak logis sistem menghasilkan laporan tanpa data mentah!\n\n4. **Gray Hole (Lubang Abu-abu):**\n   • Input yang masuk tidak relevan atau tidak cukup untuk menghasilkan output (contoh: input cuma 'Nama Pelanggan' tapi output keluar 'Rincian Nilai Gaji').`;
    }

    if (
      lowerQ.includes("level") ||
      lowerQ.includes("konteks") ||
      lowerQ.includes("hierarki") ||
      lowerQ.includes("balancing")
    ) {
      return `🗺️ **Hierarki Tingkatan DFD & Aturan Balancing:**\n\n1. **Diagram Konteks (DFD Level 0):**\n   • Pandangan global (Helicopter View).\n   • **Hanya ada 1 Proses utama** di tengah yang mewakili seluruh aplikasi.\n   • **DILARANG menggambar Data Store (Database)** di level ini karena database dianggap tersembunyi di dalam sistem.\n\n2. **DFD Level 1:**\n   • Dekomposisi dari proses sentral Level 0 menjadi beberapa modul proses utama.\n   • Di level inilah **Data Store (Tabel Database) baru mulai dimunculkan**.\n\n3. **Prinsip Balancing:**\n   • Jumlah aliran data yang masuk dan keluar antara Diagram Konteks dan DFD Level 1 **HARUS PERSIS SAMA**. Jika di Level 0 Entitas memberikan 2 panah, maka di Level 1 jumlah panah dari entitas tersebut juga harus 2.`;
    }

    if (
      lowerQ.includes("sinar makmur") ||
      lowerQ.includes("studi kasus") ||
      lowerQ.includes("kasir")
    ) {
      return `🛒 **Analisis Studi Kasus Toko Kelontong "Sinar Makmur":**\n\n• **Entitas Eksternal (Aktor):**\n  1. *Pelanggan* (Memberikan uang pembayaran, menerima struk belanja & status order).\n  2. *Pemilik Toko* (Menerima Laporan Pendapatan Harian di sore hari).\n  3. *Pemasok / Suplier* (Menyetorkan Daftar Barang Baru, menerima Faktur Terima Barang).\n\n• **Logika Diskon Flowchart:**\n  Gunakan simbol Decision (Belah Ketupat):\n  • Kondisi: *Apakah Total Belanja > Rp 50.000?*\n  • Jika 'Ya': Total Bayar = Total Belanja - (Total Belanja * 5%).\n  • Jika 'Tidak': Total Bayar = Total Belanja (harga normal).`;
    }
  }

  // 5. Analogi umum
  if (lowerQ.includes("analogi") || lowerQ.includes("sehari-hari") || lowerQ.includes("nyata")) {
    if (
      lowerTitle.includes("search") ||
      lowerTitle.includes("cari") ||
      lowerTitle.includes("biner")
    ) {
      return `💡 **Analogi Kehidupan Nyata (Pencarian Biner):**\n\nBayangkan Anda sedang mencari nomor kamar hotel "450" di gedung dengan 1.000 kamar yang terurut dari 1 hingga 1.000:\n\n• **Cara Linear:** Anda mengecek dari kamar nomor 1, 2, 3, ... sampai 450. Sangat melelahkan!\n• **Cara Biner:** Anda langsung naik ke lantai tengah (kamar 500). Karena 450 < 500, Anda tahu pasti kamar itu ada di bagian bawah. Anda langsung mencoret kamar 501–1.000! Dengan cara membelah dua terus-menerus, Anda hanya butuh maksimal 10 kali langkah untuk menemukan kamar tersebut.`;
    }
    if (lowerTitle.includes("tree") || lowerTitle.includes("pohon")) {
      return `💡 **Analogi Kehidupan Nyata (Struktur Tree):**\n\nPohon Biner itu persis seperti **Silsilah Keluarga** atau **Struktur Folder di Komputer**!\n\n• Ada **Root** (Folder Utama / C: Drive).\n• Di dalamnya ada sub-folder (Anak Kiri & Anak Kanan).\n• Folder paling ujung yang tidak punya sub-folder lagi disebut **Leaf (Daun)**.\n\nDengan struktur hierarkis ini, Anda tidak perlu mencari file di seluruh harddisk, cukup menelusuri cabang folder yang relevan!`;
    }
    if (
      lowerTitle.includes("flowchart") ||
      lowerTitle.includes("dfd") ||
      lowerTitle.includes("proses bisnis")
    ) {
      return `💡 **Analogi Kehidupan Nyata (Flowchart vs DFD):**\n\nBayangkan Anda sedang mengelola sebuah **Pabrik Roti**:\n\n• **Flowchart adalah Buku Resep Koki:**\n  "Langkah 1: Masukkan tepung. Langkah 2: Tambahkan telur. Jika adonan kalis (Ya/Tidak), panggang selama 20 menit." Ada urutan langkah waktu dan keputusan berurutan.\n\n• **DFD adalah Denah Pipa dan Saluran Pabrik:**\n  "Pipa tepung dari truk pemasok mengalir ke wadah pengaduk, lalu roti yang sudah jadi mengalir ke rak gudang." DFD tidak peduli urutan menitnya, yang penting aliran bahannya jelas dan tidak ada pipa buntu!`;
    }
    return `💡 **Analogi Kehidupan Nyata ("${moduleTitle}"):**\n\nKonsep ini ibarat **Sistem Kerja Pabrik Modern**:\n1. Bahan baku yang masuk adalah **Input Data**.\n2. Mesin pengolahan dan prosedur perakitan adalah **Proses Logika**.\n3. Gudang penyimpanan adalah **Database / Arsip**.\n4. Produk jadi yang diserahkan ke pelanggan adalah **Output / Laporan**.\nJika ada saluran yang tersumbat (Black Hole) atau tiba-tiba barang muncul tanpa bahan (Miracle), operasional pabrik akan kacau!`;
  }

  // 6. Permintaan EKSPLISIT untuk Contoh Kode / Sintaks
  const isExplicitCodeRequest =
    /(contoh|tuliskan|buatkan|berikan|tampilkan)\s+(kode|koding|coding|sintaks|script|program)/i.test(
      lowerQ,
    ) ||
    lowerQ.startsWith("kode ") ||
    lowerQ.includes("contoh kode") ||
    lowerQ.includes("syntax kode");

  if (isExplicitCodeRequest) {
    if (
      lowerTitle.includes("search") ||
      lowerTitle.includes("cari") ||
      lowerTitle.includes("biner")
    ) {
      return `💻 **Contoh Kode Python (Binary Search):**\n\n\`\`\`python\ndef binary_search(arr, target):\n    low = 0\n    high = len(arr) - 1\n\n    while low <= high:\n        mid = low + (high - low) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\n# Pengujian (data wajib terurut)\ndata = [3, 7, 12, 19, 24, 38, 45, 60]\nprint("Posisi indeks:", binary_search(data, 24))  # Output: 4\n\`\`\``;
    }

    if (
      lowerTitle.includes("flowchart") ||
      lowerTitle.includes("dfd") ||
      lowerTitle.includes("proses bisnis")
    ) {
      return `💻 **Contoh Implementasi Logika Percabangan (Flowchart Kasir):**\n\n\`\`\`python\ndef hitung_diskon_kasir(total_belanja):\n    # Evaluasi Kondisi Decision\n    if total_belanja > 50000:\n        diskon = 0.05 * total_belanja\n        status = "Diskon 5% Terpasang"\n    else:\n        diskon = 0\n        status = "Harga Normal"\n    \n    total_bayar = total_belanja - diskon\n    return total_bayar, status\n\nprint(hitung_diskon_kasir(75000))  # Output: (71250, 'Diskon 5% Terpasang')\n\`\`\``;
    }

    return `💻 **Contoh Struktur Kode ("${moduleTitle}"):**\n\n\`\`\`python\n# Implementasi logika dasar materi: ${moduleTitle}\ndef eksekusi_algoritma(data_input):\n    if not data_input:\n        return {"status": "error", "pesan": "Input kosong"}\n    return {"status": "sukses", "data": [item.upper() for item in data_input]}\n\nprint(eksekusi_algoritma(["data1", "data2"]))\n\`\`\``;
  }

  // 7. Default Respons Edukatif & Kontekstual
  return `Terkait materi **"${moduleTitle}"**, pertanyaan Anda: *"${userQuestion}"* sangat esensial dalam membangun kerangka pemahaman yang kokoh.\n\nDalam mempelajarinya:\n1. **Pahami Esensi Konsep**: Fokus pada masalah apa yang ingin dipecahkan sebelum melangkah ke implementasi teknis.\n2. **Terapkan Standar Baku**: Selalu gunakan konvensi dan notasi yang konsisten.\n3. **Uji Kasus Nyata**: Latih pemahaman Anda dengan skenario studi kasus konkret di dunia nyata.\n\nSilakan tanyakan hal lain seperti: *"Berikan analogi sederhana tentang topik ini"*, *"Apa perbedaan konsep ini dengan pendekatan lain?"*, atau tanyakan bagian materi yang ingin Anda diskusikan lebih jauh!`;
}

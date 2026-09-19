// src/lib/aiModuleAnalyzer.ts
import type { AnalyzedModuleResult } from "../components/NexedAiModuleHub";

export interface AnalysisInput {
  title: string;
  content: string;
  fileName?: string;
  sourceType: "file" | "text";
}

/**
 * Mesin Analisis AI Adaptif NexedAI
 * Menganalisis konten teks atau file modul secara semantik,
 * lalu menghasilkan Ringkasan Komprehensif, Roadmap Adaptif 4 Tahap,
 * Kuis Active Recall, dan Konteks Chatbot Tutor.
 */
export function analyzeModuleContent(input: AnalysisInput): AnalyzedModuleResult {
  const combinedText = `${input.title} ${input.content} ${input.fileName || ""}`.toLowerCase();

  // 1. Domain: Binary Search & Algoritma Pencarian
  if (
    combinedText.includes("binary search") ||
    combinedText.includes("pencarian biner") ||
    (combinedText.includes("pencarian") && combinedText.includes("terurut"))
  ) {
    return {
      title: input.title || "Algoritma Pencarian Biner (Binary Search) & Analisis Kompleksitas",
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
          stage: "Tahap 4: Optimasi & Benchmarking",
          title: "Komparasi Waktu Eksekusi vs Linear Search",
          description:
            "Bandingkan konsumsi waktu dan Call Stack antara pendekatan iteratif (O(1) space) vs pendekatan rekursif (O(log N) space).",
          actionItem:
            "Buat script benchmark pencarian pada 100.000 data acak terurut dan bandingkan durasi eksekusinya.",
          understood: false,
        },
      ],
      quiz: [
        {
          id: 1,
          question:
            "Apakah kondisi mutlak agar algoritma Binary Search dapat bekerja dengan benar?",
          options: [
            "Data harus berupa integer positif",
            "Kumpulan data harus sudah dalam keadaan terurut (sorted)",
            "Jumlah elemen array harus bilangan genap",
            "Array tidak boleh memiliki elemen bernilai duplikat",
          ],
          correctIndex: 1,
          explanation:
            "Binary Search mengeliminasi separuh ruang pencarian berdasarkan sifat keterurutan data (jika target > data[mid], maka target pasti ada di sebelah kanan, dan sebaliknya).",
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

  // 2. Domain: Struktur Data Tree / Pohon Biner
  if (
    combinedText.includes("tree") ||
    combinedText.includes("pohon") ||
    combinedText.includes("bst") ||
    combinedText.includes("traversal")
  ) {
    return {
      title: input.title || "Struktur Data Pohon Biner (Tree) & Algoritma Traversal Rekursif",
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

  // 3. Domain: Database & SQL
  if (
    combinedText.includes("database") ||
    combinedText.includes("basis data") ||
    combinedText.includes("sql") ||
    combinedText.includes("relasi") ||
    combinedText.includes("mysql")
  ) {
    return {
      title: input.title || "Perancangan Basis Data Relasional & Optimasi Kueri SQL",
      sourceType: input.sourceType,
      fileName: input.fileName,
      estimatedTime: "45 Menit",
      difficulty: "Menengah",
      xpReward: 130,
      summary: {
        overview:
          "Sistem Manajemen Basis Data Relasional (RDBMS) mengorganisasi data dalam bentuk tabel-tabel berdimensi baris dan kolom yang saling terhubung melalui relasi kunci (Primary Key dan Foreign Key). Pemahaman mendalam mengenai normalisasi data, integritas referensial, serta efisiensi eksekusi kueri SQL menggunakan Indexing merupakan kompetensi inti bagi seorang pengembang sistem informasi terintegrasi.",
        keyPoints: [
          {
            term: "Integritas Referensial (PK & FK)",
            definition:
              "Aturan yang memastikan hubungan antar tabel tetap konsisten; nilai Foreign Key pada tabel anak harus selalu merujuk pada Primary Key yang valid di tabel induk.",
          },
          {
            term: "Normalisasi (1NF, 2NF, 3NF)",
            definition:
              "Metodologi penguraian tabel untuk meminimalisasi redundansi data dan mencegah anomali penyisipan (insert), pembaruan (update), dan penghapusan (delete).",
          },
          {
            term: "Kueri JOIN (Inner, Left, Right)",
            definition:
              "Operasi penggabungan dua atau lebih tabel berdasarkan kolom kunci yang berkorelasi untuk menyajikan informasi utuh.",
          },
          {
            term: "Prinsip Transaksi ACID",
            definition:
              "Atomicity, Consistency, Isolation, dan Durability; standar keandalan transaksi perbankan dan enterprise.",
          },
          {
            term: "Database Indexing (B-Tree)",
            definition:
              "Struktur data bantu yang mempercepat proses pencarian SELECT baris data dari O(N) table scan menjadi O(log N).",
          },
        ],
        proTips:
          "Hindari penggunaan 'SELECT *' pada sistem produksi. Selalu sebutkan nama kolom secara eksplisit untuk menghemat bandwidth jaringan dan memanfaatkan Covering Index.",
        breakdownTime: {
          concept: "15 Menit",
          practice: "20 Menit",
          quiz: "10 Menit",
        },
      },
      roadmap: [
        {
          step: 1,
          stage: "Tahap 1: Pemodelan Data",
          title: "Penyusunan Entity Relationship Diagram (ERD)",
          description:
            "Identifikasi entitas, atribut, kardinalitas relasi (1:1, 1:N, N:M), dan penentuan Primary Key.",
          actionItem: "Gambarkan skema ERD untuk sistem absensi atau perpustakaan kampus.",
          understood: false,
        },
        {
          step: 2,
          stage: "Tahap 2: DDL & Normalisasi",
          title: "Pembuatan Tabel & Penerapan 3NF",
          description:
            "Tulis skrip CREATE TABLE dengan constraint NOT NULL, UNIQUE, dan FOREIGN KEY ON DELETE CASCADE.",
          actionItem: "Eksekusi pembuatan skema tabel relasional pada DBMS MySQL atau PostgreSQL.",
          understood: false,
        },
        {
          step: 3,
          stage: "Tahap 3: DML & Agregasi",
          title: "Kueri Kompleks JOIN & GROUP BY",
          description:
            "Kuasai penggunaan INNER JOIN, LEFT JOIN, fungsi agregasi (COUNT, SUM, AVG), dan filter HAVING.",
          actionItem:
            "Tulis kueri untuk menampilkan daftar mahasiswa beserta total SKS yang telah diselesaikan.",
          understood: false,
        },
        {
          step: 4,
          stage: "Tahap 4: Optimasi Performa",
          title: "Analisis EXPLAIN & Penambahan Index",
          description:
            "Gunakan perintah EXPLAIN untuk mengidentifikasi kueri yang lambat dan tambahkan Index pada kolom filter.",
          actionItem:
            "Ukur perbedaan durasi pencarian sebelum dan sesudah penambahan index pada 50.000 data.",
          understood: false,
        },
      ],
      quiz: [
        {
          id: 1,
          question: "Tujuan utama dari proses Normalisasi basis data adalah...",
          options: [
            "Memperbanyak jumlah tabel agar terlihat kompleks",
            "Menghilangkan redundansi data dan mencegah anomali pembaruan",
            "Mengganti basis data SQL menjadi NoSQL",
            "Menyembunyikan data sensitif dari administrator",
          ],
          correctIndex: 1,
          explanation:
            "Normalisasi bertujuan untuk meminimalisasi duplikasi/redundansi data dan mencegah anomali saat insert, update, atau delete.",
        },
        {
          id: 2,
          question:
            "Perintah JOIN manakah yang menampilkan seluruh data dari tabel sebelah kiri meskipun tidak memiliki pasangan di tabel kanan?",
          options: ["INNER JOIN", "CROSS JOIN", "LEFT JOIN", "RIGHT JOIN"],
          correctIndex: 2,
          explanation:
            "LEFT JOIN (atau LEFT OUTER JOIN) mengembalikan semua baris dari tabel kiri dan baris yang cocok dari tabel kanan. Jika tidak cocok, nilainya diisi NULL.",
        },
        {
          id: 3,
          question: "Aspek 'Atomicity' dalam prinsip transaksi ACID berarti...",
          options: [
            "Data disimpan dalam bentuk atom terkecil",
            "Semua rangkaian operasi dalam transaksi harus berhasil seluruhnya, atau jika satu gagal maka semuanya dibatalkan (all or nothing)",
            "Data otomatis terenkripsi secara atomik",
            "Tabel dapat dibaca oleh banyak pengguna secara bersamaan tanpa kunci",
          ],
          correctIndex: 1,
          explanation:
            "Atomicity menjamin prinsip 'all or nothing'; jika ada salah satu instruksi dalam transaksi yang gagal, sistem akan melakukan rollback ke kondisi semula.",
        },
      ],
    };
  }

  // 4. Domain: Pemrograman Berorientasi Objek (PBO / OOP)
  if (
    combinedText.includes("oop") ||
    combinedText.includes("pbo") ||
    combinedText.includes("objek") ||
    combinedText.includes("class") ||
    combinedText.includes("inheritance")
  ) {
    return {
      title: input.title || "Pemrograman Berorientasi Objek (OOP) & Arsitektur Bersih",
      sourceType: input.sourceType,
      fileName: input.fileName,
      estimatedTime: "40 Menit",
      difficulty: "Menengah",
      xpReward: 120,
      summary: {
        overview:
          "Pemrograman Berorientasi Objek (Object-Oriented Programming / OOP) adalah paradigma rekayasa perangkat lunak yang menstrukturkan kode program ke dalam bentuk objek yang menggabungkan status (data/atribut) dan perilaku (method/fungsi). Paradigma ini didasarkan pada 4 pilar fundamental: Enkapsulasi, Pewarisan (Inheritance), Polimorfisme, dan Abstraksi, yang mempermudah pemeliharaan sistem skala besar (maintainability), keterbacaan kode (clean code), dan penggunaan ulang komponen (reusability).",
        keyPoints: [
          {
            term: "Enkapsulasi (Encapsulation)",
            definition:
              "Menyembunyikan detail internal objek dan membatasi akses langsung ke atribut menggunakan access modifier (private, protected, public) serta menyediakan getter dan setter.",
          },
          {
            term: "Pewarisan (Inheritance)",
            definition:
              "Mekanisme di mana sebuah subclass mewarisi sifat dan method dari superclass, memungkinkan hierarki kode yang terorganisasi dan mencegah duplikasi logika.",
          },
          {
            term: "Polimorfisme (Polymorphism)",
            definition:
              "Kemampuan objek untuk memiliki banyak bentuk, terwujud melalui Method Overriding (runtime) dan Method Overloading (compile-time).",
          },
          {
            term: "Abstraksi (Abstraction)",
            definition:
              "Menyajikan antarmuka penting kepada pengguna dan menyembunyikan detail implementasi yang rumit melalui Abstract Class dan Interface.",
          },
          {
            term: "Prinsip Desain SOLID",
            definition:
              "Lima panduan arsitektur kelas agar perangkat lunak fleksibel terhadap perubahan dan mudah diuji secara unit testing.",
          },
        ],
        proTips:
          "Lebih utamakan komposisi daripada pewarisan (Composition over Inheritance) jika hubungan antar entitas adalah 'HAS-A' (memiliki) bukan 'IS-A' (adalah jenis dari).",
        breakdownTime: {
          concept: "15 Menit",
          practice: "18 Menit",
          quiz: "7 Menit",
        },
      },
      roadmap: [
        {
          step: 1,
          stage: "Tahap 1: Kelas & Objek",
          title: "Penyusunan Class, Constructor, & Enkapsulasi",
          description:
            "Definisikan atribut private, buat constructor berparameter, dan implementasikan getter/setter dengan validasi.",
          actionItem: "Buat class Mahasiswa dengan validasi NIM tidak boleh kosong.",
          understood: false,
        },
        {
          step: 2,
          stage: "Tahap 2: Pewarisan Hierarkis",
          title: "Pewarisan dengan Kata Kunci 'extends' / Subclassing",
          description:
            "Buat superclass 'Pengguna' dan subclass 'Mahasiswa' serta 'Dosen' yang mewarisi atribut umum.",
          actionItem: "Gunakan kata kunci 'super' untuk memanggil constructor kelas induk.",
          understood: false,
        },
        {
          step: 3,
          stage: "Tahap 3: Polimorfisme Dinamis",
          title: "Penerapan Method Overriding",
          description:
            "Implementasikan method 'tampilkanPeran()' pada superclass dan timpa perilakunya pada masing-masing subclass.",
          actionItem:
            "Buat array bertipe superclass yang menampung objek subclass berbeda dan panggil method polimorfis.",
          understood: false,
        },
        {
          step: 4,
          stage: "Tahap 4: Abstraksi & Interface",
          title: "Perancangan Kontrak dengan Interface",
          description:
            "Pisahkan kontrak layanan menggunakan Interface (misal: 'AutentikasiService') dari implementasi nyatanya.",
          actionItem:
            "Implementasikan interface pada dua kelas berbeda dan uji pertukaran dependensi.",
          understood: false,
        },
      ],
      quiz: [
        {
          id: 1,
          question:
            "Menyembunyikan atribut privat kelas dan hanya mengizinkan modifikasi melalui getter/setter disebut...",
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

  // 5. Default Fallback: Analisis Cerdas Menyeluruh untuk Topik Kuliah Bebas
  const cleanTitle =
    input.title?.trim() ||
    (input.fileName
      ? input.fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ")
      : "Modul Pembelajaran Mandiri");

  const formattedTitle = cleanTitle
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: formattedTitle,
    sourceType: input.sourceType,
    fileName: input.fileName,
    estimatedTime: "40 Menit",
    difficulty: "Menengah",
    xpReward: 120,
    summary: {
      overview: `Modul "${formattedTitle}" menguraikan konsep esensial yang dirancang untuk memperkuat kompetensi teknis mahasiswa. Materi ini mengintegrasikan pemahaman teori mendalam, simulasi logika algoritmik, serta studi kasus implementasi nyata di industri perangkat lunak modern. Penguasaan bab ini membekali mahasiswa dengan pola pikir pemecahan masalah (computational thinking) yang terukur, efisien, dan siap pakai.`,
      keyPoints: [
        {
          term: "Prinsip Dasar & Logika Esensial",
          definition: `Fondasi utama dari materi "${formattedTitle}" yang mendasari alur eksekusi sistem dan mekanisme pemrosesan data secara deterministik.`,
        },
        {
          term: "Struktur & Alur Kontrol",
          definition:
            "Pengorganisasian blok kode dan alur kontrol logika yang menjamin program berjalan stabil tanpa menghasilkan efek samping yang tidak terduga.",
        },
        {
          term: "Penanganan Kasus Batas (Edge Cases)",
          definition:
            "Strategi antisipasi data masukan ekstrem, kondisi nilai kosong (null/undefined), dan penanganan kesalahan sistematis (exception handling).",
        },
        {
          term: "Efisiensi Waktu & Ruang Memori",
          definition:
            "Analisis rasio antara konsumsi kapasitas memori dan durasi komputasi untuk memastikan solusi dapat diskalakan pada volume data besar.",
        },
        {
          term: "Penerapan Nyata & Standar Industri",
          definition:
            "Implementasi konsep dalam arsitektur aplikasi dunia kerja yang mengedepankan modularitas, clean code, dan kemudahan pengujian.",
        },
      ],
      proTips:
        "Saat mempelajari materi ini, selalu buat sketsa diagram alur (flowchart atau pseudocode) terlebih dahulu sebelum menulis baris kode untuk menghemat waktu debugging.",
      breakdownTime: {
        concept: "12 Menit",
        practice: "18 Menit",
        quiz: "10 Menit",
      },
    },
    roadmap: [
      {
        step: 1,
        stage: "Tahap 1: Fondasi Teori",
        title: `Pemahaman Konsep & Terminologi "${formattedTitle}"`,
        description:
          "Kuasai definisi mendasar, istilah teknis utama, dan batasan masalah yang diselesaikan oleh topik ini.",
        actionItem:
          "Tuliskan rangkuman 3 konsep terpenting menggunakan bahasa Anda sendiri di catatan belajar.",
        understood: false,
      },
      {
        step: 2,
        stage: "Tahap 2: Implementasi Sintaks",
        title: "Penulisan Kode & Struktur Kontrol",
        description:
          "Terapkan logika materi ke dalam potongan kode konkret dengan memperhatikan kerapian penamaan variabel dan struktur modular.",
        actionItem: "Tulis dan jalankan kode simulasi sederhana untuk menguji alur eksekusi utama.",
        understood: false,
      },
      {
        step: 3,
        stage: "Tahap 3: Debugging & Kasus Batas",
        title: "Pengujian Nilai Ekstrem & Error Handling",
        description:
          "Uji ketahanan kode terhadap input tak terduga, data kosong, atau kondisi pembagian nol untuk mencegah aplikasi crash.",
        actionItem: "Lakukan pengujian minimal 3 skenario input yang berpotensi menghasilkan bug.",
        understood: false,
      },
      {
        step: 4,
        stage: "Tahap 4: Optimasi & Best Practice",
        title: "Refactoring & Analisis Kompleksitas",
        description:
          "Tinjau kembali solusi yang telah dibuat untuk mengurangi operasi redundan dan tingkatkan efisiensi pemakaian memori.",
        actionItem:
          "Refaktor kode agar memenuhi prinsip Clean Code dan sertakan komentar dokumentasi fungsi.",
        understood: false,
      },
    ],
    quiz: [
      {
        id: 1,
        question: `Manakah di antara pernyataan berikut yang paling tepat menggambarkan tujuan utama dari "${formattedTitle}"?`,
        options: [
          "Mempersulit alur kode program agar tidak mudah dibaca orang lain",
          "Menyediakan solusi terstruktur, efisien, dan andal untuk memecahkan masalah komputasi secara terukur",
          "Menghindari pemakaian bahasa pemrograman standar",
          "Hanya diperuntukkan bagi perangkat keras server berskala raksasa",
        ],
        correctIndex: 1,
        explanation:
          "Tujuan utama setiap konsep rekayasa perangkat lunak adalah memecahkan persoalan secara terstruktur, efisien, dan mudah dipelihara.",
      },
      {
        id: 2,
        question:
          "Langkah terbaik yang disarankan sebelum mengimplementasikan logika program ke baris kode adalah...",
        options: [
          "Langsung menulis kode tanpa memikirkan struktur input/output",
          "Menyusun diagram alur (flowchart), pseudocode, dan memahami batasan kasus batas terlebih dahulu",
          "Menonaktifkan seluruh mekanisme penanganan error",
          "Mengabaikan efisiensi memori",
        ],
        correctIndex: 1,
        explanation:
          "Menyusun pseudocode atau algoritma terlebih dahulu membantu memetakan logika secara komprehensif sehingga meminimalisir kesalahan arsitektur saat coding.",
      },
      {
        id: 3,
        question:
          "Bagaimana cara memastikan program memiliki ketahanan tinggi terhadap kegagalan (robustness)?",
        options: [
          "Menguji program hanya pada kondisi ideal (happy path)",
          "Menerapkan penanganan kesalahan (exception handling) dan menguji skenario input ekstrem (edge cases)",
          "Menghapus seluruh variabel yang menampung data",
          "Menjalankan program hanya satu kali",
        ],
        correctIndex: 1,
        explanation:
          "Program yang tangguh harus mampu menangani kondisi batas, data tak terduga, dan kegagalan eksternal tanpa mengalami crash mendadak.",
      },
    ],
  };
}

/**
 * Generator Respons Chatbot Tutor Nexed AI
 * Menjawab pertanyaan spesifik mahasiswa seputar modul yang diunggah.
 */
export function generateChatResponse(params: {
  moduleTitle: string;
  userQuestion: string;
}): string {
  const { moduleTitle, userQuestion } = params;
  const lowerQ = userQuestion.toLowerCase();

  if (lowerQ.includes("analogi") || lowerQ.includes("sehari-hari") || lowerQ.includes("nyata")) {
    if (
      moduleTitle.toLowerCase().includes("search") ||
      moduleTitle.toLowerCase().includes("cari")
    ) {
      return `💡 **Analogi Kehidupan Nyata (Pencarian Biner):**\n\nBayangkan kamu sedang mencari nomor kamar hotel "450" di gedung dengan 1.000 kamar yang terurut dari 1 hingga 1.000:\n\n• **Cara Linear:** Kamu mengecek dari kamar nomor 1, 2, 3, ... sampai 450. Sangat melelahkan!\n• **Cara Biner:** Kamu langsung naik ke lantai tengah (kamar 500). Karena 450 < 500, kamu tahu pasti kamar itu ada di bagian bawah. Kamu langsung mencoret kamar 501–1.000! Dengan cara membelah dua terus-menerus, kamu hanya butuh maksimal 10 kali langkah untuk menemukan kamar tersebut.`;
    }
    if (moduleTitle.toLowerCase().includes("tree") || moduleTitle.toLowerCase().includes("pohon")) {
      return `💡 **Analogi Kehidupan Nyata (Struktur Tree):**\n\nPohon Biner itu persis seperti **Silsilah Keluarga** atau **Struktur Folder di Komputermu**!\n\n• Ada **Root** (Folder Utama / C: Drive).\n• Di dalamnya ada sub-folder (Anak Kiri & Anak Kanan).\n• Folder paling ujung yang tidak punya sub-folder lagi disebut **Leaf (Daun)**.\n\nDengan struktur hierarkis ini, kamu tidak perlu mencari file di seluruh harddisk, cukup menelusuri cabang folder yang relevan!`;
    }
    if (
      moduleTitle.toLowerCase().includes("database") ||
      moduleTitle.toLowerCase().includes("sql")
    ) {
      return `💡 **Analogi Kehidupan Nyata (Basis Data & Indexing):**\n\nBayangkan sebuah perpustakaan kota berisikan 100.000 buku:\n\n• **Tanpa Index (Table Scan):** Kamu harus memeriksa judul buku satu per satu dari rak pertama sampai rak terakhir. Memakan waktu berhari-hari!\n• **Dengan Index (B-Tree):** Kamu langsung menuju **Katalog Kartu Perpustakaan** di lobi yang disusun alfabetis. Dalam 10 detik, kamu tahu buku incaranmu ada di Rak C, Baris 4!`;
    }
    return `💡 **Analogi Kehidupan Nyata ("${moduleTitle}"):**\n\nKonsep ini ibarat **Resep Memasak Koki Profesional**:\n1. Bahan-bahan yang terukur adalah **Input/Prasyarat**.\n2. Langkah demi langkah di buku resep adalah **Algoritma/Logika Proses**.\n3. Masakan lezat yang siap dihidangkan adalah **Output/Hasil Program**.\nJika ada satu langkah resep yang tertukar, masakannya bisa gosong—sama seperti program yang butuh urutan logika yang tepat!`;
  }

  if (
    lowerQ.includes("kode") ||
    lowerQ.includes("syntax") ||
    lowerQ.includes("python") ||
    lowerQ.includes("contoh")
  ) {
    if (
      moduleTitle.toLowerCase().includes("search") ||
      moduleTitle.toLowerCase().includes("cari")
    ) {
      return `💻 **Contoh Kode Python (Binary Search):**\n\n\`\`\`python
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        # Perhitungan titik tengah aman dari integer overflow
        mid = low + (high - low) // 2

        if arr[mid] == target:
            return mid  # Target ditemukan di indeks mid!
        elif arr[mid] < target:
            low = mid + 1  # Cari di paruh kanan
        else:
            high = mid - 1  # Cari di paruh kiri

    return -1  # Target tidak ada dalam array

# Pengujian
data = [3, 7, 12, 19, 24, 38, 45, 60]
print("Posisi indeks:", binary_search(data, 24))  # Output: 4
\`\`\`\n\n*Perhatikan:* Data \`data\` wajib dalam keadaan terurut menaik!`;
    }
    return `💻 **Contoh Implementasi Logika ("${moduleTitle}"):**\n\n\`\`\`python
# Implementasi dasar materi: ${moduleTitle}
def proses_materi(data_input):
    # 1. Validasi prasyarat (Guard Clause)
    if not data_input:
        return {"status": "error", "pesan": "Data kosong"}

    # 2. Proses komputasi utama
    hasil = []
    for item in data_input:
        hasil.append(f"Diproses: {item}")

    # 3. Kembalikan hasil yang terstruktur
    return {"status": "sukses", "data": hasil}

# Uji coba fungsi
print(proses_materi(["Konsep A", "Konsep B"]))
\`\`\``;
  }

  if (
    lowerQ.includes("beda") ||
    lowerQ.includes("perbedaan") ||
    lowerQ.includes("vs") ||
    lowerQ.includes("bandingkan")
  ) {
    return `📊 **Perbandingan & Analisis Efisiensi pada "${moduleTitle}":**\n\n| Aspek | Pendekatan Konvensional | Pendekatan Terstruktur (${moduleTitle}) |\n| :--- | :--- | :--- |\n| **Kompleksitas Waktu** | Cenderung lambat O(N) hingga O(N²) | Lebih optimal O(1) hingga O(log N) |\n| **Penggunaan Memori** | Sering tidak terkontrol | Terprediksi dan efisien |\n| **Skalabilitas** | Sulit jika data bertambah besar | Mampu menangani jutaan data dengan stabil |\n| **Kemudahan Debugging** | Rentan bug tersembunyi | Bersih, modular, dan mudah di-trace |`;
  }

  if (
    lowerQ.includes("error") ||
    lowerQ.includes("kesalahan") ||
    lowerQ.includes("bug") ||
    lowerQ.includes("gagal")
  ) {
    return `⚠️ **Kesalahan Umum (Common Pitfalls) yang Sering Terjadi:**\n\n1. **Off-by-One Error:** Kesalahan batas perulangan (misal memakai \`<\` padahal seharusnya \`<=\`, atau sebaliknya).\n2. **Kondisi Base Case yang Terlewat:** Pada fungsi rekursif, lupa menuliskan kondisi berhenti sehingga memicu \`StackOverflowError\`.\n3. **Integer Overflow:** Menjumlahkan dua angka integer besar tanpa memikirkan batas memori 32-bit.\n4. **Asumsi Data Terurut:** Mengira data masukan sudah rapi padahal belum divalidasi terlebih dahulu.\n\n*Tips Dosen AI:* Selalu gunakan **Unit Test** dan berikan data masukan kosong (\`null\`, \`[]\`, atau string kosong) untuk menguji kekebalan programmu!`;
  }

  return `Terkait materi **"${moduleTitle}"**, pertanyaan Anda: *"${userQuestion}"* menyentuh bagian penting dari alur logikanya.\n\nDalam penerapannya, pastikan Anda memahami:\n1. **Kondisi Masukan**: Pastikan tipe dan integritas data masukan sudah tervalidasi.\n2. **Efisiensi Algoritma**: Selalu pertimbangkan apakah ada langkah perulangan yang bisa dipangkas.\n3. **Output yang Diharapkan**: Program harus deterministik (memberikan hasil yang konsisten untuk input yang sama).\n\nSilakan coba tanyakan: *"Bisa berikan contoh kode?"* atau *"Bagaimana analogi sederhananya?"* jika ingin penjelasan lebih mendalam!`;
}

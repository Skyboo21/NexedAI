// src/data/learningTopics.ts

export interface KeyConcept {
  subtitle: string;
  explanation: string;
  codeSnippet?: string;
  codeOutput?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningTopic {
  id: number;
  title: string;
  slug: string;
  meeting: string;
  sks: number;
  duration: string;
  lecturer: string;
  courseName: string;
  classGroup: string;
  status: 'completed' | 'recommended' | 'locked';
  xp: number;
  description: string;
  learningOutcomes: string[];
  keyConcepts: KeyConcept[];
  lecturerTips: string[];
  quiz: QuizQuestion[];
  suggestedQuestions: string[];
}

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 1,
    title: 'Pengantar Algoritma & Logika',
    slug: 'pengantar-algoritma',
    meeting: 'Pertemuan 1',
    sks: 3,
    duration: '90 Menit',
    lecturer: 'Dr. Ir. Hendra Wijaya, M.T.',
    courseName: 'Algoritma & Pemrograman',
    classGroup: 'Kelas IF-A (Teknik Informatika)',
    status: 'completed',
    xp: 50,
    description: 'Pemahaman dasar struktur logika komputasional, penyusunan flowchart, dan pseudocode algoritma sekuensial.',
    learningOutcomes: [
      'Memahami definisi algoritma dan karakteristik algoritma yang efisien.',
      'Mampu menyusun diagram alir (flowchart) dengan simbol-simbol standar internasional (ANSI/ISO).',
      'Mampu merepresentasikan solusi masalah matematis dalam bentuk pseudocode independen bahasa.'
    ],
    keyConcepts: [
      {
        subtitle: '1. Apa itu Algoritma?',
        explanation: 'Algoritma adalah urutan langkah logis dan terstruktur yang disusun secara sistematis untuk menyelesaikan suatu permasalahan komputasi dalam jumlah langkah berhingga (finiteness).'
      },
      {
        subtitle: '2. Representasi Pseudocode & Contoh Eksekusi',
        explanation: 'Pseudocode merupakan jembatan antara bahasa manusia dan kode komputer nyata. Berikut contoh algoritma menghitung luas dan keliling segitiga.',
        codeSnippet: `# Algoritma Menghitung Luas Segitiga
alas = float(input("Masukkan alas: "))
tinggi = float(input("Masukkan tinggi: "))

luas = 0.5 * alas * tinggi
print(f"Hasil Luas Segitiga: {luas} cm²")`,
        codeOutput: `Masukkan alas: 10
Masukkan tinggi: 8
Hasil Luas Segitiga: 40.0 cm²`
      },
      {
        subtitle: '3. Aturan Simbol Flowchart',
        explanation: 'Simbol Oval/Terminator (Start/End), Persegi Panjang (Proses komputasi), Jajar Genjang (Input/Output data), dan Belah Ketupat/Diamond (Keputusan kondisional boolean).'
      }
    ],
    lecturerTips: [
      'Gunakan notasi variabel yang deskriptif dan konsisten dalam penulisan pseudocode.',
      'Pastikan setiap flowchart memiliki satu titik awal (Start) dan titik akhir (End) yang jelas.'
    ],
    quiz: [
      {
        question: 'Simbol flowchart manakah yang digunakan untuk menyatakan proses pengambilan keputusan logika?',
        options: ['Persegi Panjang', 'Belah Ketupat (Diamond)', 'Jajar Genjang', 'Oval'],
        correctIndex: 1,
        explanation: 'Tepat! Belah ketupat (Decision/Diamond) digunakan untuk evaluasi kondisi yang menghasilkan cabang True atau False.'
      },
      {
        question: 'Karakteristik algoritma yang menyatakan bahwa algoritma harus berhenti setelah sejumlah langkah tertentu disebut:',
        options: ['Definiteness', 'Finiteness', 'Effectiveness', 'Generality'],
        correctIndex: 1,
        explanation: 'Benar! Finiteness (keterbatasan) menjamin algoritma tidak akan berjalan selamanya tanpa akhir.'
      }
    ],
    suggestedQuestions: [
      'Apa bedanya pseudocode dan algoritma deskriptif?',
      'Bagaimana cara membuat flowchart yang baik?',
      'Kenapa algoritma harus efisien dalam komputasi?'
    ]
  },
  {
    id: 2,
    title: 'Struktur Kondisional (IF-ELSE)',
    slug: 'struktur-kondisional',
    meeting: 'Pertemuan 2',
    sks: 3,
    duration: '90 Menit',
    lecturer: 'Dr. Ir. Hendra Wijaya, M.T.',
    courseName: 'Algoritma & Pemrograman',
    classGroup: 'Kelas IF-A (Teknik Informatika)',
    status: 'completed',
    xp: 75,
    description: 'Mempelajari struktur percabangan logika IF, IF-ELSE berganda, dan Switch-Case untuk pengambilan keputusan program.',
    learningOutcomes: [
      'Menguasai operasi perbandingan logika (>, <, >=, <=, ==, !=) dan operator Boolean (AND, OR, NOT).',
      'Mampu mengimplementasikan seleksi kondisi bertingkat (nested if) dan penanganan kasus default.',
      'Memahami kapan menggunakan Switch-Case vs IF-ELSE pada skenario kode nyata.'
    ],
    keyConcepts: [
      {
        subtitle: '1. Logika Percabangan IF-ELSE',
        explanation: 'Struktur kontrol keputusan memungkinkan program memilih blok instruksi mana yang akan dieksekusi berdasarkan evaluasi ekspresi kondisi boolean (True atau False).'
      },
      {
        subtitle: '2. Implementasi Sistem Grade Mahasiswa',
        explanation: 'Berikut implementasi kondisional untuk menentukan predikat kelulusan berdasarkan nilai angka akhir mata kuliah.',
        codeSnippet: `nilai_akhir = 82

if nilai_akhir >= 85:
    predikat = "A (Sangat Memuaskan)"
elif nilai_akhir >= 75:
    predikat = "B (Memuaskan)"
elif nilai_akhir >= 60:
    predikat = "C (Cukup)"
else:
    predikat = "D (Perlu Remedial)"

print(f"Predikat Mahasiswa: {predikat}")`,
        codeOutput: `Predikat Mahasiswa: B (Memuaskan)`
      },
      {
        subtitle: '3. Operator Logika AND vs OR',
        explanation: 'AND membutuhkan SEMUA kondisi bernilai True agar blok berjalan. OR hanya membutuhkan MINIMAL SATU kondisi bernilai True.'
      }
    ],
    lecturerTips: [
      'Hindari nested IF yang terlalu dalam (> 3 tingkat) untuk menjaga clean code dan readability.',
      'Urutkan rentang evaluasi dari nilai paling spesifik/tertinggi ke nilai terendah.'
    ],
    quiz: [
      {
        question: 'Pada ekspresi boolean (True and False) or True, apakah hasil evaluasi akhirnya?',
        options: ['False', 'True', 'Null', 'Syntax Error'],
        correctIndex: 1,
        explanation: 'Tepat! (True and False) menghasilkan False, kemudian False or True menghasilkan True.'
      },
      {
        question: 'Kapan struktur Switch-Case lebih direkomendasikan dibanding IF-ELSE bertingkat?',
        options: [
          'Ketika mengevaluasi rentang nilai desimal kontinu',
          'Ketika membandingkan variabel diskrit tunggal dengan banyak nilai konstan',
          'Ketika hanya ada satu kondisi sederhana',
          'Switch-case tidak pernah lebih baik dari if-else'
        ],
        correctIndex: 1,
        explanation: 'Benar! Switch-case sangat optimal dan rapi saat memetakan satu variabel ke opsi-opsi nilai diskrit konstan.'
      }
    ],
    suggestedQuestions: [
      'Bagaimana cara kerja nested IF?',
      'Kapan sebaiknya pakai Switch-Case daripada IF-ELSE?',
      'Apa perbedaan mendasar operator == dengan operator penugasan = ?'
    ]
  },
  {
    id: 3,
    title: 'Looping & Iterasi (FOR/WHILE)',
    slug: 'looping-iterasi',
    meeting: 'Pertemuan 3',
    sks: 3,
    duration: '100 Menit',
    lecturer: 'Dr. Ir. Hendra Wijaya, M.T.',
    courseName: 'Algoritma & Pemrograman',
    classGroup: 'Kelas IF-A (Teknik Informatika)',
    status: 'recommended',
    xp: 100,
    description: 'Materi penguatan yang direkomendasikan AI. Menguasai perulangan terhitung (FOR) dan bersyarat (WHILE), serta pencegahan Infinite Loop.',
    learningOutcomes: [
      'Mampu membedakan perulangan definite (FOR) dan indefinite (WHILE).',
      'Menguasai penggunaan keyword kontrol break, continue, dan pass.',
      'Mampu menganalisis dan mencegah terjadinya kondisi Infinite Loop dalam sistem perangkat lunak.'
    ],
    keyConcepts: [
      {
        subtitle: '1. Perbedaan Mendasar FOR vs WHILE Loop',
        explanation: 'FOR Loop dianalogikan seperti berlari 5 putaran mengelilingi lintasan (jumlah langkah sudah pasti diketahui di awal). WHILE Loop seperti berlari hingga merasa lelah (berulang selama kondisi True, berhenti saat False).'
      },
      {
        subtitle: '2. Contoh Kode & Mekanisme Guard Counter',
        explanation: 'Simak contoh perulangan for dan while yang aman dengan pembaruan counter di setiap iterasi.',
        codeSnippet: `# 1. FOR Loop untuk deret angka
total_genap = 0
for angka in range(2, 11, 2):
    total_genap += angka
print(f"Total bilangan genap 2-10: {total_genap}")

# 2. WHILE Loop dengan terminasi yang tepat
counter = 1
while counter <= 3:
    print(f"Pengulangan ke-{counter}")
    counter += 1  # Wajib ada agar tidak infinite loop!`,
        codeOutput: `Total bilangan genap 2-10: 30
Pengulangan ke-1
Pengulangan ke-2
Pengulangan ke-3`
      },
      {
        subtitle: '3. Bahaya Fatal Infinite Loop',
        explanation: 'Infinite Loop terjadi jika kondisi terminasi WHILE tidak pernah menjadi False (misalnya lupa menambah counter `i++`). Hal ini dapat membekukan aplikasi dan menghabiskan resource CPU/memori.'
      }
    ],
    lecturerTips: [
      'Perhatikan dengan cermat: Jangan pernah lupa meng-update variabel counter di dalam blok body WHILE!',
      'Gunakan perintah BREAK hanya untuk terminasi darurat, jangan jadikan kebiasaan alur utama logika.'
    ],
    quiz: [
      {
        question: 'Apa penyebab utama terjadinya Infinite Loop pada perulangan WHILE?',
        options: [
          'Kondisi perulangan bernilai False sejak awal',
          'Variabel kondisi terminasi tidak pernah diperbarui sehingga selalu bernilai True',
          'Menggunakan tipe data integer untuk counter',
          'Menuliskan lebih dari 3 baris instruksi di dalam loop'
        ],
        correctIndex: 1,
        explanation: 'Tepat sekali! Jika kondisi bernilai True terus menerus tanpa perubahan, sistem akan terjebak dalam perulangan tanpa akhir.'
      },
      {
        question: 'Perintah mana yang digunakan untuk melompati sisa iterasi saat ini dan langsung menuju ke iterasi berikutnya?',
        options: ['break', 'continue', 'return', 'exit'],
        correctIndex: 1,
        explanation: 'Benar! `continue` akan melewati baris di bawahnya dan langsung memulai putaran iterasi selanjutnya.'
      }
    ],
    suggestedQuestions: [
      'Jelaskan perbedaan for loop dan while loop dengan analogi mudah!',
      'Apa yang dimaksud dengan infinite loop dan bagaimana cara mencegahnya?',
      'Kapan kita harus menggunakan perintah break dan continue?'
    ]
  },
  {
    id: 4,
    title: 'Struktur Data Array & Matrix',
    slug: 'struktur-data-array',
    meeting: 'Pertemuan 4',
    sks: 3,
    duration: '100 Menit',
    lecturer: 'Dr. Ir. Hendra Wijaya, M.T.',
    courseName: 'Algoritma & Pemrograman',
    classGroup: 'Kelas IF-A (Teknik Informatika)',
    status: 'locked',
    xp: 120,
    description: 'Menyimpan sekumpulan data dalam memori kontinu, manipulasi indeks array satu dimensi dan matriks dua dimensi.',
    learningOutcomes: [
      'Memahami representasi memori array dan konsep Zero-based indexing.',
      'Mampu melakukan operasi dasar array: Traversal, Insertion, Deletion, dan Searching.',
      'Mampu mengimplementasikan array 2D (matrix) untuk pengolahan baris dan kolom.'
    ],
    keyConcepts: [
      {
        subtitle: '1. Konsep Dasar Array',
        explanation: 'Array adalah struktur data linear yang menyimpan sekumpulan elemen bertipe data serupa pada lokasi memori yang berurutan (kontigu).'
      },
      {
        subtitle: '2. Akses Indeks & Operasi Matriks',
        explanation: 'Elemen pertama selalu beralamat pada indeks 0. Berikut contoh manipulasi array 1D dan matriks 2D.',
        codeSnippet: `# Array Nilai Ujian
nilai = [78, 85, 90, 95]
print("Nilai pertama:", nilai[0])
print("Nilai tertinggi:", max(nilai))

# Matriks 2x3 (2 Baris, 3 Kolom)
matriks = [
    [1, 2, 3],
    [4, 5, 6]
]
print("Elemen baris 2 kolom 3:", matriks[1][2])`,
        codeOutput: `Nilai pertama: 78
Nilai tertinggi: 95
Elemen baris 2 kolom 3: 6`
      },
      {
        subtitle: '3. Kompleksitas Akses Elemen',
        explanation: 'Akses data pada array melalui indeks memiliki kompleksitas waktu O(1) karena lokasi memorinya dapat langsung dihitung berdasarkan alamat dasar dan ukuran tipe data.'
      }
    ],
    lecturerTips: [
      'Ingat selalu aturan index out of bounds: array berukuran N memiliki rentang indeks valid dari 0 hingga N - 1.',
      'Gunakan perulangan bersarang (nested loop) untuk memproses baris dan kolom pada matriks 2D.'
    ],
    quiz: [
      {
        question: 'Jika sebuah array memiliki 10 elemen, berapa indeks dari elemen terakhir?',
        options: ['10', '9', '8', '11'],
        correctIndex: 1,
        explanation: 'Tepat! Karena dimulai dari index 0, maka elemen ke-10 berada pada index 9 (N - 1).'
      }
    ],
    suggestedQuestions: [
      'Kenapa indeks array dimulai dari angka nol?',
      'Bagaimana cara melakukan perulangan pada matriks 2 dimensi?',
      'Apa yang terjadi jika kita mengakses indeks di luar batas array?'
    ]
  },
  {
    id: 5,
    title: 'Fungsi & Rekursi Kompleks',
    slug: 'fungsi-rekursi',
    meeting: 'Pertemuan 5',
    sks: 3,
    duration: '120 Menit',
    lecturer: 'Dr. Ir. Hendra Wijaya, M.T.',
    courseName: 'Algoritma & Pemrograman',
    classGroup: 'Kelas IF-A (Teknik Informatika)',
    status: 'locked',
    xp: 150,
    description: 'Membagi kode menjadi modul-modul fungsi independen, pemahaman call stack, dan implementasi fungsi rekursif dengan base case.',
    learningOutcomes: [
      'Mampu merancang fungsi dengan parameter input dan return value.',
      'Memahami mekanisme Call Stack dan alokasi memori lokal fungsi.',
      'Mampu menyelesaikan masalah faktorial, deret fibonacci, dan menara hanoi secara rekursif.'
    ],
    keyConcepts: [
      {
        subtitle: '1. Modularisasi Kode dengan Fungsi',
        explanation: 'Fungsi memecah program besar menjadi sub-program yang dapat dipakai ulang (reusable) dan mudah diuji, menerapkan prinsip DRY (Don’t Repeat Yourself).'
      },
      {
        subtitle: '2. Rekursi & Base Case',
        explanation: 'Fungsi rekursif adalah fungsi yang memanggil dirinya sendiri. Syarat mutlak fungsi rekursif adalah adanya Base Case (kondisi berhenti) agar tidak terjadi Stack Overflow.',
        codeSnippet: `def hitung_faktorial(n):
    # 1. Base Case (Kondisi Berhenti)
    if n <= 1:
        return 1
    # 2. Recursive Case (Panggilan Diri Sendiri)
    return n * hitung_faktorial(n - 1)

hasil = hitung_faktorial(5)
print(f"Hasil 5! = {hasil}")`,
        codeOutput: `Hasil 5! = 120`
      }
    ],
    lecturerTips: [
      'Selalu tuliskan Base Case terlebih dahulu sebelum menuliskan logika rekursif!',
      'Pastikan setiap panggilan rekursif menggerakkan parameter mendekati kondisi Base Case.'
    ],
    quiz: [
      {
        question: 'Apa fungsi utama dari Base Case pada fungsi rekursif?',
        options: [
          'Mempercepat waktu kompilasi',
          'Menghentikan proses rekursi dan mencegah Stack Overflow',
          'Menggantikan kebutuhan parameter',
          'Mengubah fungsi menjadi perulangan FOR'
        ],
        correctIndex: 1,
        explanation: 'Tepat sekali! Base Case merupakan titik berhenti rekursi untuk mencegah pemanggilan tanpa batas yang dapat merusak memori stack.'
      }
    ],
    suggestedQuestions: [
      'Apa perbedaan mendasar antara fungsi iteratif dan rekursif?',
      'Bagaimana cara kerja Call Stack saat fungsi dipanggil?',
      'Mengapa bisa terjadi Stack Overflow pada fungsi rekursif?'
    ]
  }
];

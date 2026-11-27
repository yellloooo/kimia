import { ElementAvatar, QuizQuestion } from '../types/quiz';

export const ELEMENT_AVATARS: ElementAvatar[] = [
  { symbol: 'Na', name: 'Natrium', atomicNumber: 11, accentHex: '#0284C7' },
  { symbol: 'Fe', name: 'Besi (Katalis)', atomicNumber: 26, accentHex: '#D97706' },
  { symbol: 'Pt', name: 'Platina', atomicNumber: 78, accentHex: '#059669' },
  { symbol: 'Cu', name: 'Tembaga', atomicNumber: 29, accentHex: '#E11D48' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, accentHex: '#0EA5E9' },
  { symbol: 'Cl', name: 'Klorin', atomicNumber: 17, accentHex: '#10B981' },
];

export const AI_RIVALS = [
  { id: 'bot-1', name: 'Nadia (XII-IPA)', symbol: 'Pt', accentHex: '#059669', skillAccuracy: 0.85 },
  { id: 'bot-2', name: 'Raka (Tim Olimpiade)', symbol: 'Fe', accentHex: '#D97706', skillAccuracy: 0.78 },
  { id: 'bot-3', name: 'Sinta (Lab Kimia)', symbol: 'Na', accentHex: '#0284C7', skillAccuracy: 0.72 },
  { id: 'bot-4', name: 'Bima (Eksperimen)', symbol: 'Cu', accentHex: '#E11D48', skillAccuracy: 0.64 },
  { id: 'bot-5', name: 'Dina (Katalis)', symbol: 'Cl', accentHex: '#10B981', skillAccuracy: 0.56 },
];

export const LAJU_REAKSI_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Konsep Laju',
    difficulty: 'Dasar',
    prompt: 'Manakah pernyataan yang paling tepat mendefinisikan laju reaksi kimia?',
    formula: 'v = -Δ[R] / Δt = +Δ[P] / Δt',
    options: [
      'Berkurangnya konsentrasi reaktan atau bertambahnya konsentrasi produk tiap satuan waktu',
      'Jumlah total mol zat hasil reaksi yang terbentuk hingga reaksi berhenti',
      'Perubahan energi potensial total antara reaktan dan produk pada suhu kamar',
      'Perbandingan koefisien stoikiometri antara zat pereaksi dan zat hasil reaksi',
    ],
    correctIndex: 0,
    explanation:
      'Laju reaksi menyatakan laju berkurangnya konsentrasi molar pereaksi (-Δ[R]/Δt) atau bertambahnya konsentrasi molar produk (+Δ[P]/Δt) dalam setiap satuan waktu (umumnya M/s).',
  },
  {
    id: 2,
    topic: 'Konsep Laju',
    difficulty: 'Menengah',
    prompt: 'Diketahui reaksi pembentukan amonia: N₂(g) + 3H₂(g) → 2NH₃(g). Jika laju pengurangan gas H₂ adalah 0,06 M/s, berapakah laju pembentukan gas NH₃?',
    formula: 'N₂(g) + 3H₂(g) → 2NH₃(g)',
    options: [
      '0,02 M/s',
      '0,04 M/s',
      '0,06 M/s',
      '0,09 M/s',
    ],
    correctIndex: 1,
    explanation:
      'Perbandingan laju reaksi sebanding dengan perbandingan koefisien: v(NH₃) = (koefisien NH₃ / koefisien H₂) × v(H₂) = (2/3) × 0,06 M/s = 0,04 M/s.',
  },
  {
    id: 3,
    topic: 'Konsep Laju',
    difficulty: 'Menengah',
    prompt: 'Dalam wadah bervolume 2 liter dipanaskan 0,4 mol gas SO₃. Setelah 20 detik, ternyata tersisa 0,1 mol gas SO₃. Berapakah laju pengurangan gas SO₃?',
    formula: '2SO₃(g) → 2SO₂(g) + O₂(g)',
    options: [
      '0,0050 M/s',
      '0,0075 M/s',
      '0,0150 M/s',
      '0,0200 M/s',
    ],
    correctIndex: 1,
    explanation:
      'Mol SO₃ yang bereaksi = 0,4 − 0,1 = 0,3 mol. Perubahan konsentrasi Δ[SO₃] = 0,3 mol / 2 L = 0,15 M. Maka laju reaksi v = 0,15 M / 20 s = 0,0075 M/s.',
  },
  {
    id: 4,
    topic: 'Konsep Laju',
    difficulty: 'Dasar',
    prompt: 'Pada reaksi A(g) + 2B(g) → C(g), tanda negatif (−) pada rumus v_A = −Δ[A]/Δt memiliki makna bahwa...',
    options: [
      'Reaksi berjalan ke arah kiri secara endoterm',
      'Nilai laju reaksi selalu bernilai kurang dari nol',
      'Konsentrasi zat A berkurang seiring bertambahnya waktu',
      'Zat A berperan sebagai katalisator negatif',
    ],
    correctIndex: 2,
    explanation:
      'Tanda negatif pada laju pereaksi digunakan karena konsentrasi reaktan menurun sehingga Δ[A] bernilai negatif; tanda minus membuat nilai laju reaksi v tetap positif.',
  },
  {
    id: 5,
    topic: 'Teori Tumbukan',
    difficulty: 'Dasar',
    prompt: 'Menurut teori tumbukan, dua faktor utama yang harus dipenuhi agar tumbukan antarpartikel pereaksi menghasilkan reaksi (tumbukan efektif) adalah...',
    options: [
      'Massa molekul sama dan tekanan ruang tinggi',
      'Energi kinetik cukup (≥ Ea) dan orientasi tumbukan tepat',
      'Wujud zat sama-sama gas dan terdapat cahaya ultraviolet',
      'Volume wadah kecil dan reaksi bersifat eksoterm',
    ],
    correctIndex: 1,
    explanation:
      'Tumbukan efektif hanya terjadi apabila partikel yang bertumbukan memiliki energi kinetik minimal sebesar energi aktivasi (Ea) dan berada pada arah/orientasi ruang yang tepat.',
  },
  {
    id: 6,
    topic: 'Teori Tumbukan',
    difficulty: 'Dasar',
    prompt: 'Apakah yang dimaksud dengan Energi Aktivasi (Ea) dalam kinetika kimia?',
    options: [
      'Energi panas yang dilepaskan ketika produk reaksi mendingin',
      'Selisih entalpi antara produk dan reaktan pada keadaan standar',
      'Energi minimum yang harus dimiliki partikel agar tumbukan menghasilkan reaksi',
      'Energi ikatan rata-rata dari molekul katalis setelah reaksi selesai',
    ],
    correctIndex: 2,
    explanation:
      'Energi aktivasi (Ea) adalah ambang energi minimum yang dibutuhkan reaktan untuk mencapai keadaan transisi (kompleks teraktivasi) sebelum membentuk produk.',
  },
  {
    id: 7,
    topic: 'Teori Tumbukan',
    difficulty: 'Menengah',
    prompt: 'Suatu reaksi memiliki energi potensial reaktan = 40 kJ, keadaan transisi (puncak) = 100 kJ, dan produk = 15 kJ. Berapakah nilai Ea dan ΔH reaksi tersebut?',
    formula: 'Ea = E_puncak − E_reaktan  |  ΔH = E_produk − E_reaktan',
    options: [
      'Ea = 60 kJ dan ΔH = −25 kJ (Eksoterm)',
      'Ea = 85 kJ dan ΔH = +25 kJ (Endoterm)',
      'Ea = 60 kJ dan ΔH = +25 kJ (Endoterm)',
      'Ea = 100 kJ dan ΔH = −40 kJ (Eksoterm)',
    ],
    correctIndex: 0,
    explanation:
      'Ea = E_puncak − E_reaktan = 100 − 40 = 60 kJ. Perubahan entalpi ΔH = E_produk − E_reaktan = 15 − 40 = −25 kJ (bernilai negatif sehingga reaksi bersifat eksoterm).',
  },
  {
    id: 8,
    topic: 'Teori Tumbukan',
    difficulty: 'Menengah',
    prompt: 'Pada diagram koordinat reaksi, spesies kimia berumur sangat singkat yang berada tepat di puncak kurva energi potensial disebut...',
    options: [
      'Zat antara stabil',
      'Kompleks teraktivasi (keadaan transisi)',
      'Inhibitor reaksi',
      'Endapan koloid',
    ],
    correctIndex: 1,
    explanation:
      'Puncak kurva energi merepresentasikan kompleks teraktivasi atau keadaan transisi, yaitu susunan atom berenergi tinggi di mana ikatan lama mulai putus dan ikatan baru mulai terbentuk.',
  },
  {
    id: 9,
    topic: 'Faktor Laju',
    difficulty: 'Dasar',
    prompt: 'Serbuk CaCO₃ bereaksi jauh lebih cepat dengan larutan HCl 1 M dibandingkan kepingan CaCO₃ bermassa sama. Faktor utama penyebabnya adalah...',
    formula: 'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)',
    options: [
      'Serbuk memiliki energi aktivasi yang lebih rendah daripada kepingan',
      'Serbuk memiliki luas permukaan bidang sentuh yang lebih besar',
      'Kepingan CaCO₃ mengalami penurunan suhu selama ditimbang',
      'Serbuk mengubah orde reaksi HCl dari orde 1 menjadi orde 2',
    ],
    correctIndex: 1,
    explanation:
      'Memperkecil ukuran partikel padat menjadi serbuk memperbesar luas permukaan bidang sentuh sehingga jumlah tumbukan antara ion H⁺ dan CaCO₃ per detik meningkat tajam.',
  },
  {
    id: 10,
    topic: 'Faktor Laju',
    difficulty: 'Dasar',
    prompt: 'Mengapa peningkatan konsentrasi larutan pereaksi mempercepat laju reaksi?',
    options: [
      'Menurunkan suhu minimum reaksi agar berlangsung spontan',
      'Memperbesar jumlah partikel per satuan volume sehingga frekuensi tumbukan naik',
      'Mengubah reaksi endoterm menjadi reaksi eksoterm',
      'Menghilangkan kebutuhan energi aktivasi pada pereaksi',
    ],
    correctIndex: 1,
    explanation:
      'Konsentrasi lebih tinggi berarti kerapatan partikel per liter larutan bertambah. Akibatnya jarak antarpartikel lebih rapat dan frekuensi tumbukan meningkat.',
  },
  {
    id: 11,
    topic: 'Faktor Laju',
    difficulty: 'Menengah',
    prompt: 'Alasan fisik paling dominan mengapa kenaikan suhu mempercepat laju reaksi secara drastis adalah...',
    options: [
      'Energi kinetik rata-rata partikel meningkat sehingga fraksi partikel dengan E ≥ Ea bertambah',
      'Massa molar pereaksi menyusut saat dipanaskan di ruang tertutup',
      'Suhu tinggi berfungsi sebagai katalis yang menurunkan harga ΔH reaksi',
      'Volume larutan menyusut sehingga tekanan uap turun mendekati nol',
    ],
    correctIndex: 0,
    explanation:
      'Menurut kurva distribusi Maxwell-Boltzmann, menaikkan suhu menggeser sebaran energi kinetik ke kanan sehingga jauh lebih banyak partikel memiliki energi ≥ Ea.',
  },
  {
    id: 12,
    topic: 'Faktor Laju',
    difficulty: 'Menengah',
    prompt: 'Setiap kenaikan suhu 10°C, laju suatu reaksi menjadi 2 kali lebih cepat. Jika pada suhu 20°C reaksi selesai dalam 40 detik, berapa lama waktu reaksi pada suhu 50°C?',
    formula: 't₂ = t₁ × (1/n)^((T₂ − T₁)/ΔT)',
    options: [
      '2,5 detik',
      '5 detik',
      '10 detik',
      '15 detik',
    ],
    correctIndex: 1,
    explanation:
      'Kenaikan suhu ΔT_total = 50 − 20 = 30°C (3 kali kelipatan 10°C). Laju menjadi 2³ = 8 kali lebih cepat, sehingga waktu reaksi menjadi 40 / 8 = 5 detik.',
  },
  {
    id: 13,
    topic: 'Faktor Laju',
    difficulty: 'Tantangan',
    prompt: 'Suatu reaksi memiliki laju 0,02 M/s pada suhu 25°C. Jika setiap kenaikan suhu 15°C laju reaksi meningkat 3 kali lipat, berapakah laju reaksi pada suhu 55°C?',
    formula: 'v₂ = v₁ × n^((T₂ − T₁)/ΔT)',
    options: [
      '0,06 M/s',
      '0,12 M/s',
      '0,18 M/s',
      '0,54 M/s',
    ],
    correctIndex: 2,
    explanation:
      'Selisih suhu = 55 − 25 = 30°C. Banyaknya kelipatan = 30 / 15 = 2. Maka v₂ = 0,02 × 3² = 0,02 × 9 = 0,18 M/s.',
  },
  {
    id: 14,
    topic: 'Faktor Laju',
    difficulty: 'Menengah',
    prompt: 'Bagaimana mekanisme katalis positif dalam mempercepat laju suatu reaksi kimia?',
    options: [
      'Menambah jumlah mol pereaksi agar tumbukan lebih sering terjadi',
      'Memberi tambahan energi panas langsung kepada molekul produk',
      'Menyediakan jalur mekanisme alternatif dengan energi aktivasi (Ea) lebih rendah',
      'Menggeser perubahan entalpi (ΔH) agar reaksi menjadi lebih eksoterm',
    ],
    correctIndex: 2,
    explanation:
      'Katalis membuka lintasan reaksi alternatif yang membutuhkan energi aktivasi (Ea) lebih rendah, tanpa ikut terkonsumsi permanen dan tanpa mengubah ΔH reaksi.',
  },
  {
    id: 15,
    topic: 'Faktor Laju',
    difficulty: 'Menengah',
    prompt: 'Pada proses Haber-Bosch untuk membuat amonia dari gas N₂ dan H₂ digunakan serbuk logam besi (Fe) padat. Jenis katalis ini tergolong...',
    formula: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)   [katalis Fe(s)]',
    options: [
      'Katalis homogen, karena berwujud gas di akhir reaksi',
      'Katalis heterogen, karena fasenya (padat) berbeda dengan fase reaktan (gas)',
      'Biokatalis, karena mempercepat sintesis protein tanah',
      'Autokatalis, karena besi dihasilkan langsung oleh gas hidrogen',
    ],
    correctIndex: 1,
    explanation:
      'Katalis heterogen memiliki fase yang berbeda dari pereaksinya—pada Haber-Bosch, pereaksi berfase gas sedangkan katalis Fe berfase padat.',
  },
  {
    id: 16,
    topic: 'Hukum Laju & Orde',
    difficulty: 'Tantangan',
    prompt: 'Perhatikan data percobaan reaksi P + Q → R di bawah ini. Tentukanlah persamaan hukum laju reaksi tersebut!',
    table: {
      headers: ['Percobaan', '[P] (M)', '[Q] (M)', 'Laju Awal (M/s)'],
      rows: [
        ['1', '0,1', '0,1', '0,02'],
        ['2', '0,2', '0,1', '0,08'],
        ['3', '0,1', '0,2', '0,04'],
      ],
    },
    options: [
      'v = k [P][Q]',
      'v = k [P]²[Q]',
      'v = k [P][Q]²',
      'v = k [P]²[Q]²',
    ],
    correctIndex: 1,
    explanation:
      'Bandingkan percobaan 1 & 2 ([Q] tetap): (0,2/0,1)^x = 0,08/0,02 = 4 → x = 2. Bandingkan percobaan 1 & 3 ([P] tetap): (0,2/0,1)^y = 0,04/0,02 = 2 → y = 1. Jadi v = k[P]²[Q].',
  },
  {
    id: 17,
    topic: 'Hukum Laju & Orde',
    difficulty: 'Tantangan',
    prompt: 'Dari data reaksi A + B → C pada tabel, tentukan orde total reaksi dan nilai tetapan laju (k)!',
    table: {
      headers: ['Percobaan', '[A] (M)', '[B] (M)', 'Laju Awal (M/s)'],
      rows: [
        ['1', '0,1', '0,2', '0,004'],
        ['2', '0,2', '0,2', '0,008'],
        ['3', '0,2', '0,4', '0,032'],
      ],
    },
    options: [
      'Orde total = 2 dan k = 0,5 M⁻¹s⁻¹',
      'Orde total = 3 dan k = 1,0 M⁻²s⁻¹',
      'Orde total = 3 dan k = 2,0 M⁻²s⁻¹',
      'Orde total = 4 dan k = 4,0 M⁻³s⁻¹',
    ],
    correctIndex: 1,
    explanation:
      'Dari data 1 & 2: orde A = 1. Dari data 2 & 3: (0,4/0,2)^y = 0,032/0,008 = 4 → orde B = 2. Orde total = 1 + 2 = 3. Substitusi data 1: 0,004 = k(0,1)(0,2)² = k(0,004) → k = 1,0 M⁻²s⁻¹.',
  },
  {
    id: 18,
    topic: 'Hukum Laju & Orde',
    difficulty: 'Menengah',
    prompt: 'Suatu reaksi gas memiliki persamaan laju v = k[X][Y]. Jika laju dinyatakan dalam M/s dan konsentrasi dalam M, apakah satuan tetapan laju (k)?',
    formula: 'v = k [X]¹ [Y]¹',
    options: [
      's⁻¹',
      'M · s⁻¹',
      'M⁻¹ · s⁻¹',
      'M⁻² · s⁻¹',
    ],
    correctIndex: 2,
    explanation:
      'Orde total = 1 + 1 = 2. Dari v = k[X][Y], maka k = v / ([X][Y]) = (M/s) / M² = M⁻¹ · s⁻¹.',
  },
  {
    id: 19,
    topic: 'Hukum Laju & Orde',
    difficulty: 'Tantangan',
    prompt: 'Reaksi gas 2A(g) + B(g) → C(g) memiliki hukum laju v = k[A]²[B]. Jika volume wadah diperkecil menjadi 1/2 kali volume semula pada suhu tetap, laju reaksinya menjadi...',
    formula: 'v = k [A]² [B]',
    options: [
      '2 kali semula',
      '4 kali semula',
      '6 kali semula',
      '8 kali semula',
    ],
    correctIndex: 3,
    explanation:
      'Saat volume diperkecil menjadi 1/2 kali, molaritas tiap gas ([A] dan [B]) naik menjadi 2 kali semula. Maka v_baru = k(2[A])²(2[B]) = 4 × 2 × k[A]²[B] = 8 kali semula.',
  },
  {
    id: 20,
    topic: 'Hukum Laju & Orde',
    difficulty: 'Menengah',
    prompt: 'Jika grafik hubungan laju reaksi (v) terhadap konsentrasi pereaksi ([A]) berbentuk garis lurus mendatar (horizontal), maka orde reaksi terhadap zat A adalah...',
    options: [
      'Orde nol (0), karena perubahan [A] tidak memengaruhi laju reaksi',
      'Orde satu (1), karena laju berbanding lurus dengan konsentrasi',
      'Orde dua (2), karena laju meningkat secara kuadratik',
      'Orde negatif (−1), karena pereaksi menghambat laju reaksi',
    ],
    correctIndex: 0,
    explanation:
      'Pada reaksi orde nol (v = k[A]⁰ = k), nilai laju reaksi tetap konstan berapapun perubahan konsentrasi A sehingga grafiknya berupa garis horizontal.',
  },
  {
    id: 21,
    topic: 'Konsep Laju',
    difficulty: 'Menengah',
    prompt: 'Pada reaksi penguraian dinitrogen pentoksida: 2N₂O₅(g) → 4NO₂(g) + O₂(g), jika laju pembentukan gas O₂ adalah 0,015 M/s, maka laju pembentukan gas NO₂ dan laju pengurangan N₂O₅ berturut-turut adalah...',
    formula: '2N₂O₅(g) → 4NO₂(g) + O₂(g)',
    options: [
      '0,060 M/s dan 0,030 M/s',
      '0,030 M/s dan 0,060 M/s',
      '0,015 M/s dan 0,030 M/s',
      '0,060 M/s dan 0,015 M/s',
    ],
    correctIndex: 0,
    explanation:
      'Perbandingan koefisien N₂O₅ : NO₂ : O₂ = 2 : 4 : 1. Jadi v(NO₂) = 4 × 0,015 = 0,060 M/s dan v(N₂O₅) = 2 × 0,015 = 0,030 M/s.',
  },
  {
    id: 22,
    topic: 'Konsep Laju',
    difficulty: 'Dasar',
    prompt: 'Dalam percobaan reaksi logam seng dengan HCl dihasilkan gas H₂. Pada detik ke-10 volume gas H₂ tercatat 25 mL, dan pada detik ke-30 menjadi 75 mL. Berapakah laju pembentukan gas H₂ pada selang waktu tersebut?',
    formula: 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)',
    options: [
      '1,5 mL/detik',
      '2,0 mL/detik',
      '2,5 mL/detik',
      '5,0 mL/detik',
    ],
    correctIndex: 2,
    explanation:
      'Perubahan volume ΔV = 75 − 25 = 50 mL. Selang waktu Δt = 30 − 10 = 20 detik. Laju pembentukan gas H₂ = 50 mL / 20 detik = 2,5 mL/detik.',
  },
  {
    id: 23,
    topic: 'Teori Tumbukan',
    difficulty: 'Menengah',
    prompt: 'Mengapa sebagian tumbukan antarpartikel tetap gagal menghasilkan reaksi meskipun energi kinetik partikel tersebut sudah melebihi energi aktivasi (Ea)?',
    options: [
      'Karena katalis belum ditambahkan ke dalam wadah reaksi',
      'Karena orientasi atau arah tumbukan gugus reaktif tidak tepat',
      'Karena reaksi berlangsung secara eksoterm pada tekanan rendah',
      'Karena jumlah mol produk sudah melebihi tetapan kesetimbangan',
    ],
    correctIndex: 1,
    explanation:
      'Energi ≥ Ea hanyalah syarat pertama; tanpa orientasi atau posisi tumbukan yang tepat agar ikatan lama putus dan ikatan baru terbentuk, tumbukan tetap bersifat tidak efektif.',
  },
  {
    id: 24,
    topic: 'Teori Tumbukan',
    difficulty: 'Tantangan',
    prompt: 'Suatu reaksi endoterm memiliki energi reaktan = 30 kJ, produk = 75 kJ, dan kompleks teraktivasi = 120 kJ. Berapakah energi aktivasi reaksi maju dan reaksi balik?',
    formula: 'Ea(maju) = E_puncak − E_reaktan  |  Ea(balik) = E_puncak − E_produk',
    options: [
      'Ea(maju) = 90 kJ dan Ea(balik) = 45 kJ',
      'Ea(maju) = 45 kJ dan Ea(balik) = 90 kJ',
      'Ea(maju) = 120 kJ dan Ea(balik) = 75 kJ',
      'Ea(maju) = 75 kJ dan Ea(balik) = 30 kJ',
    ],
    correctIndex: 0,
    explanation:
      'Ea(maju) = 120 − 30 = 90 kJ, sedangkan untuk reaksi kebalikannya Ea(balik) = 120 − 75 = 45 kJ. Selisihnya ΔH = 75 − 30 = +45 kJ (endoterm).',
  },
  {
    id: 25,
    topic: 'Faktor Laju',
    difficulty: 'Dasar',
    prompt: 'Zat pengawet seperti BHT ditambahkan ke dalam makanan kemasan untuk memperlambat proses oksidasi lemak (ketengikan). Dalam kinetika kimia, zat semacam ini disebut...',
    options: [
      'Autokatalis',
      'Promotor katalis',
      'Inhibitor (katalis negatif)',
      'Pereaksi pembatas',
    ],
    correctIndex: 2,
    explanation:
      'Inhibitor adalah zat yang memperlambat laju reaksi dengan menghambat jalannya mekanisme reaksi atau meningkatkan hambatan energi aktivasi efektif.',
  },
  {
    id: 26,
    topic: 'Faktor Laju',
    difficulty: 'Menengah',
    prompt: 'Empat percobaan mereaksikan 1 gram logam Zn dengan 50 mL larutan HCl: (1) keping Zn + HCl 1 M pada 25°C; (2) serbuk Zn + HCl 2 M pada 25°C; (3) serbuk Zn + HCl 2 M pada 45°C; (4) keping Zn + HCl 0,5 M pada 25°C. Percobaan manakah yang paling cepat bereaksi?',
    options: [
      'Percobaan (1)',
      'Percobaan (2)',
      'Percobaan (3)',
      'Percobaan (4)',
    ],
    correctIndex: 2,
    explanation:
      'Percobaan (3) menggabungkan tiga faktor pemercepat sekaligus: luas permukaan terbesar (serbuk), konsentrasi HCl tertinggi (2 M), dan suhu tertinggi (45°C).',
  },
  {
    id: 27,
    topic: 'Faktor Laju',
    difficulty: 'Dasar',
    prompt: 'Mengapa pengadukan campuran larutan dan padatan pereaksi dapat mempercepat laju reaksi?',
    options: [
      'Menurunkan energi aktivasi padatan secara permanen',
      'Mempercepat pergerakan dan kontak partikel pereaksi segar ke permukaan padatan',
      'Mengubah wujud padatan menjadi gas bertekanan tinggi',
      'Meningkatkan kalor jenis larutan pelarut',
    ],
    correctIndex: 1,
    explanation:
      'Pengadukan mencegah penumpukan produk di sekitar permukaan padatan dan terus membawa molekul reaktan segar agar frekuensi tumbukan efektif meningkat.',
  },
  {
    id: 28,
    topic: 'Hukum Laju & Orde',
    difficulty: 'Menengah',
    prompt: 'Jika grafik hubungan laju reaksi (v) terhadap kuadrat konsentrasi pereaksi ([A]²) membentuk garis lurus miring melewati titik asal (0,0), maka orde reaksi terhadap A adalah...',
    options: [
      'Orde 0',
      'Orde 1',
      'Orde 2',
      'Orde 3',
    ],
    correctIndex: 2,
    explanation:
      'Karena v berbanding lurus secara linear terhadap [A]², maka persamaannya adalah v = k[A]², yang berarti reaksi berorde 2 terhadap zat A.',
  },
  {
    id: 29,
    topic: 'Hukum Laju & Orde',
    difficulty: 'Tantangan',
    prompt: 'Reaksi 2NO₂(g) + F₂(g) → 2NO₂F(g) berlangsung melalui dua tahap: Tahap 1 (lambat): NO₂ + F₂ → NO₂F + F; Tahap 2 (cepat): NO₂ + F → NO₂F. Hukum laju reaksi keseluruhannya adalah...',
    formula: 'Tahap penentu laju = tahap paling lambat',
    options: [
      'v = k [NO₂]² [F₂]',
      'v = k [NO₂] [F₂]',
      'v = k [NO₂] [F]',
      'v = k [NO₂F]²',
    ],
    correctIndex: 1,
    explanation:
      'Laju reaksi bertahap ditentukan oleh tahap paling lambat (rate-determining step), yaitu Tahap 1 yang melibatkan 1 molekul NO₂ dan 1 molekul F₂ sehingga v = k[NO₂][F₂].',
  },
  {
    id: 30,
    topic: 'Hukum Laju & Orde',
    difficulty: 'Tantangan',
    prompt: 'Reaksi gas 2NO(g) + Br₂(g) → 2NOBr(g) memiliki hukum laju v = k[NO]²[Br₂] dengan nilai k = 12 M⁻²s⁻¹. Berapakah laju reaksi saat [NO] = 0,1 M dan [Br₂] = 0,2 M?',
    formula: 'v = k [NO]² [Br₂]',
    options: [
      '0,012 M/s',
      '0,024 M/s',
      '0,120 M/s',
      '0,240 M/s',
    ],
    correctIndex: 1,
    explanation:
      'Substitusikan ke hukum laju: v = 12 × (0,1)² × (0,2) = 12 × 0,01 × 0,2 = 0,024 M/s.',
  },
];

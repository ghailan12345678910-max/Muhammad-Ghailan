import { LearningModule, MCQQuestion, EssayQuestion } from '../types';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod_1',
    title: '1. Dasar-Dasar Larutan & Terminologi',
    description: 'Konsep zat terlarut (solute), pelarut (solvent), larutan homogen, dan larutan jenuh dalam laboratorium medik.',
    duration: '15 Menit',
    level: 'Dasar',
    content: [
      {
        sectionTitle: 'Komponen Larutan',
        text: 'Larutan adalah campuran homogen antara dua atau lebih zat. Zat terlarut (solute) adalah komponen yang jumlahnya lebih sedikit (contoh: garam NaCl, glukosa, kristal pewarna). Pelarut (solvent) adalah komponen yang mendispersikan zat terlarut (paling umum di lab medik: Aquades, buffer, atau etanol).'
      },
      {
        sectionTitle: 'Tingkat Kejenuhan',
        text: '1. Larutan Tak Jenuh: masih mampu melarutkan zat terlarut tambahan pada suhu tertentu.\n2. Larutan Tepat Jenuh: jumlah zat terlarut telah mencapai batas kelarutan maksimum (kesetimbangan dinamis).\n3. Larutan Lewat Jenuh: mengandung zat terlarut lebih banyak daripada daya larut normal, biasanya tidak stabil dan mudah mengkristal kembali.'
      },
      {
        sectionTitle: 'Larutan Standar Primer & Sekunder',
        text: 'Larutan Standar Primer dibuat dari zat yang memiliki kemurnian tinggi (>99.9%), stabil, tidak higroskopis, dan diketahui rumus kimia serta Mr-nya dengan pasti (cth: Asam Oksalat, Kalium Iodat, NaCl anhidrat).\nLarutan Standar Sekunder konsentrasinya tidak dapat diketahui pasti dari penimbangan langsung karena higroskopis atau bereaksi dengan udara (cth: NaOH yang mengikat CO2, HCl pekat yang mudah menguap, KMnO4), sehingga wajib distandarisasi terlebih dahulu.'
      }
    ]
  },
  {
    id: 'mod_2',
    title: '2. Molaritas (M) & Perhitungan Massa',
    description: 'Memahami satuan konsentrasi Molaritas, hubungan mol, Mr, dan volume dalam penyiapan reagen kimia.',
    duration: '20 Menit',
    level: 'Dasar',
    content: [
      {
        sectionTitle: 'Definisi Molaritas',
        text: 'Molaritas (M) menyatakan banyaknya mol zat terlarut dalam 1 Liter larutan.',
        formula: 'M = n / V(L) = (massa / Mr) / V(L)'
      },
      {
        sectionTitle: 'Penimbangan Zat Terlarut',
        text: 'Untuk membuat larutan molar dari padatan murni, massa zat yang harus ditimbang dihitung dengan rumus:',
        formula: 'Massa (g) = M × Mr × V(L) = (M × Mr × V(mL)) / 1000',
        example: 'Contoh: Membuat 250 mL larutan NaCl 0,1 M (Mr = 58,44 g/mol):\nm = 0,1 mol/L × 58,44 g/mol × 0,25 L = 1,461 gram NaCl.'
      },
      {
        sectionTitle: 'Koreksi Kemurnian Bahan',
        text: 'Jika kemurnian reagen teknis atau pro-analisis (p.a) tercantum misalnya 98%, maka zat yang ditimbang harus disesuaikan agar kadar aktifnya tepat:',
        formula: 'Massa aktual = Massa teoritis ÷ (Kemurnian% / 100)'
      }
    ]
  },
  {
    id: 'mod_3',
    title: '3. Normalitas (N) & Berat Ekuivalen (BE)',
    description: 'Konsep grek, valensi, faktor ekuivalen pada reaksi asam basa, presipitasi, dan oksidasi reduksi (redoks).',
    duration: '25 Menit',
    level: 'Menengah',
    content: [
      {
        sectionTitle: 'Definisi Normalitas & Grek',
        text: 'Normalitas (N) menyatakan jumlah gram ekuivalen (grek) zat terlarut dalam 1 Liter larutan.',
        formula: 'N = grek / V(L) = (Massa / BE) / V(L)'
      },
      {
        sectionTitle: 'Berat Ekuivalen (BE) & Valensi (n)',
        text: 'Berat Ekuivalen adalah massa molekul relatif dibagi dengan valensi (faktor ekuivalen reaksi):',
        formula: 'BE = Mr / n',
        example: '1. Reaksi Asam-Basa: n = jumlah ion H+ atau OH- yang bereaksi.\n   - HCl (n=1) -> BE = Mr / 1\n   - H2SO4 (n=2) -> BE = Mr / 2\n   - NaOH (n=1) -> BE = Mr / 1\n2. Reaksi Redoks: n = jumlah elektron yang diterima/dilepas.\n   - KMnO4 dalam suasana asam (Mn7+ -> Mn2+): transfer 5 elektron, n = 5 -> BE = Mr / 5.'
      },
      {
        sectionTitle: 'Hubungan Normalitas dan Molaritas',
        text: 'Hubungan langsung antara M dan N adalah:',
        formula: 'N = M × n   atau   M = N / n'
      }
    ]
  },
  {
    id: 'mod_4',
    title: '4. Konsentrasi Persen (% b/v, % v/v, % b/b)',
    description: 'Cara pembuatan larutan persentase yang lazim digunakan dalam pewarnaan hematologi, fiksasi urin, dan desinfektan.',
    duration: '15 Menit',
    level: 'Dasar',
    content: [
      {
        sectionTitle: 'Persen Berat per Volume (% b/v)',
        text: 'Menyatakan massa zat terlarut (gram) dalam 100 mL larutan akhir.',
        formula: 'Massa (g) = [% (b/v) × Volume Larutan (mL)] / 100',
        example: 'NaCl fisiologis 0,9% b/v sebanyak 100 mL memerlukan: (0,9 × 100) / 100 = 0,9 gram NaCl dilarutkan hingga 100 mL aquades.'
      },
      {
        sectionTitle: 'Persen Volume per Volume (% v/v)',
        text: 'Menyatakan volume cairan terlarut (mL) dalam 100 mL larutan akhir.',
        formula: 'Volume Zat (mL) = [% (v/v) × Volume Total (mL)] / 100',
        example: 'Etanol 70% v/v sebanyak 500 mL memerlukan: (70 × 500) / 100 = 350 mL etanol absolut, ditambah aquades hingga volume 500 mL.'
      },
      {
        sectionTitle: 'Persen Berat per Berat (% b/b)',
        text: 'Menyatakan massa zat terlarut (gram) dalam 100 gram massa total campuran.',
        formula: 'Massa Zat (g) = [% (b/b) × Massa Total (g)] / 100'
      }
    ]
  },
  {
    id: 'mod_5',
    title: '5. Pengenceran Larutan (C1V1 = C2V2)',
    description: 'Prinsip kekekalan zat terlarut dalam pembuatan larutan kerja dari larutan stok pekat.',
    duration: '20 Menit',
    level: 'Dasar',
    content: [
      {
        sectionTitle: 'Prinsip Dasar Pengenceran',
        text: 'Pada pengenceran, penambahan pelarut murni tidak mengubah jumlah zat terlarut, hanya memperbesar volume larutan sehingga konsentrasi menurun.',
        formula: 'C1 × V1 = C2 × V2',
        example: 'Membuat 100 mL larutan 0,1 M dari stok 1 M:\nV1 = (C2 × V2) / C1 = (0,1 M × 100 mL) / 1 M = 10 mL larutan stok.\nVolume pelarut = 100 mL - 10 mL = 90 mL aquades.'
      },
      {
        sectionTitle: 'Aturan Keselamatan Pengenceran Asam Pekat',
        text: 'PENTING (K3): Jangan pernah menuangkan air ke dalam asam pekat! Reaksi hidrasi asam pekat bersifat sangat eksotermik dan dapat menyebabkan percikan uap mendidih (flash boiling). Selalu tuangkan asam perlahan ke dalam air melalui dinding wadah sambil diaduk.',
        safetyTip: 'AAA: Air Asam Alirkan (Tuangkan Asam ke dalam Air).'
      }
    ]
  },
  {
    id: 'mod_6',
    title: '6. Serial Dilution (Pengenceran Bertingkat)',
    description: 'Metode pengenceran bertahap geometrik untuk uji serologi, virologi, batas sensitivitas antimikroba (MIC), dan titer antibodi.',
    duration: '25 Menit',
    level: 'Menengah',
    content: [
      {
        sectionTitle: 'Konsep Pengenceran Bertingkat',
        text: 'Serial dilution adalah proses pengenceran berurutan di mana sampel dari tabung sebelumnya ditransfer ke tabung berikutnya yang berisi pelarut dalam perbandingan volume konstan (misalnya 1:2, 1:5, atau 1:10).'
      },
      {
        sectionTitle: 'Perhitungan Pengenceran 1:2 (Double Dilution)',
        text: 'Jika menggunakan 1 mL diluent di setiap tabung dan 1 mL sampel ditransfer:\n- Tabung 1: 1 mL stok + 1 mL diluent = total 2 mL (faktor 1:2)\n- Campur homogen, ambil 1 mL pindahkan ke Tabung 2 -> faktor 1:4\n- Begitu seterusnya: 1:8, 1:16, 1:32, 1:64, dst.',
        formula: 'Faktor Total Tabung-n = (Faktor Pengenceran)^n'
      }
    ]
  },
  {
    id: 'mod_7',
    title: '7. Teknik Pembuatan Larutan & Penggunaan Labu Ukur',
    description: 'SOP preparasi larutan volumetrik, cara menera meniskus, dan penimbangan dengan neraca analitik.',
    duration: '20 Menit',
    level: 'Menengah',
    content: [
      {
        sectionTitle: 'Langkah Standar Preparasi',
        text: '1. Timbang zat di neraca analitik menggunakan cawan arloji / perahu timbang.\n2. Larutkan zat dalam beaker glass dengan 1/3 hingga 1/2 volume total pelarut menggunakan batang pengaduk.\n3. Biarkan suhu larutan kembali ke suhu ruang (20-25°C) jika terjadi reaksi eksotermik/endotermik.\n4. Alirkan larutan ke labu ukur menggunakan corong kaca.\n5. Bilas beaker glass dan batang pengaduk dengan aquades 2-3 kali, masukkan air bilasan ke labu ukur.\n6. Tambahkan aquades hingga mendekati garis batas kalibrasi.\n7. Gunakan pipet tetes untuk meneteskan tetes terakhir hingga dasar meniskus (cekung cairan bening) tepat menyentuh garis batas.\n8. Tutup labu ukur dan homogenkan dengan membalik labu ukur 10-15 kali.'
      }
    ]
  },
  {
    id: 'mod_8',
    title: '8. Keselamatan Kerja Laboratorium (K3) & APD',
    description: 'Alat pelindung diri standar TLM, dekontaminasi tumpahan cairan tubuh dan bahan kimia berbahaya.',
    duration: '15 Menit',
    level: 'Dasar',
    content: [
      {
        sectionTitle: 'Alat Pelindung Diri (APD) Wajib',
        text: '- Jas Laboratorium lengan panjang berkancing rapat.\n- Sarung tangan (nitril/lateks disposable; hindari lateks jika menangani pelarut organik).\n- Kacamata pelindung (safety goggles) saat menangani asam/basa pekat.\n- Masker medis atau respirator uap asam bila diperlukan.\n- Sepatu tertutup tahan cairan dan tidak licin.'
      },
      {
        sectionTitle: 'Fasilitas Kedaruratan',
        text: 'Ketahui selalu lokasi: Eyewash station (pencuci mata darurat, bilas minimal 15 menit), Safety shower, Kotak P3K, dan APAR (Alat Pemadam Api Ringan tipe ABC).'
      }
    ]
  },
  {
    id: 'mod_9',
    title: '9. Penanganan Bahan Kimia & Simbol GHS',
    description: 'Mengenal simbol bahaya Globally Harmonized System (GHS), penataan lemari reagen, dan MSDS.',
    duration: '20 Menit',
    level: 'Dasar',
    content: [
      {
        sectionTitle: '9 Piktogram GHS',
        text: '1. Korosif: merusak kulit dan logam (HCl, H2SO4, NaOH).\n2. Toksik Akut (Tengkorak): fatal atau sangat beracun (KCN, HgCl2, NaN3).\n3. Mudah Terbakar: uap menyala (Etanol, Metanol, Aseton, Eter).\n4. Oksidator: memicu atau memperhebat kebakaran (KMnO4, H2O2, AgNO3).\n5. Bahaya Kesehatan (Karsinogen, Mutagen): Formalin/formaldehid, Benzena, Giemsa metanol.\n6. Iritan (Tanda Seru): iritasi pernapasan dan kulit.\n7. Bahaya Lingkungan (Ikan & Pohon): polutan air berbahaya (senyawa perak, merkuri).'
      },
      {
        sectionTitle: 'Penyimpanan Reagen Kompatibel',
        text: 'Jangan pernah menyimpan asam pekat bersama basa kuat atau senyawa mudah terbakar di rak yang sama. Simpan asam organik terpisah dari asam mineral oksidator kuat (seperti asam nitrat).'
      }
    ]
  }
];

export const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 1,
    topic: 'Molaritas',
    question: 'Berapa massa NaCl (Mr = 58,44 g/mol) yang diperlukan untuk membuat 250 mL larutan NaCl 0,1 M?',
    options: ['0,584 gram', '1,461 gram', '2,922 gram', '5,844 gram'],
    correctIndex: 1,
    explanation: 'Rumus: m = M × Mr × V(L) = 0,1 mol/L × 58,44 g/mol × 0,25 L = 1,461 gram NaCl.'
  },
  {
    id: 2,
    topic: 'Konsentrasi Persen',
    question: 'Seorang mahasiswa TLM diminta membuat 100 mL larutan NaCl fisiologis 0,9% (b/v). Berapa gram NaCl yang harus ditimbang?',
    options: ['0,09 gram', '0,90 gram', '9,00 gram', '90,0 gram'],
    correctIndex: 1,
    explanation: 'Definisi % (b/v) adalah gram zat per 100 mL larutan. Jadi untuk 100 mL larutan 0,9% diperlukan tepat 0,9 gram NaCl.'
  },
  {
    id: 3,
    topic: 'Pengenceran',
    question: 'Larutan stok HCl tersedia dengan konsentrasi 1 M. Untuk membuat 100 mL larutan HCl 0,1 M, berapa volume larutan stok yang harus dipipet?',
    options: ['1 mL', '5 mL', '10 mL', '20 mL'],
    correctIndex: 2,
    explanation: 'C1 × V1 = C2 × V2  =>  1 M × V1 = 0,1 M × 100 mL  =>  V1 = 10 mL.'
  },
  {
    id: 4,
    topic: 'Kebutuhan Reagen',
    question: 'Jika suatu pemeriksaan kimia darah memerlukan 2 mL reagen per sampel, dan terdapat 20 sampel pasien dengan cadangan 10%, berapakah total volume reagen yang harus disiapkan?',
    options: ['40 mL', '42 mL', '44 mL', '48 mL'],
    correctIndex: 2,
    explanation: 'Kebutuhan dasar = 20 sampel × 2 mL = 40 mL. Cadangan 10% = 40 × 0,10 = 4 mL. Total volume yang disiapkan = 40 + 4 = 44 mL.'
  },
  {
    id: 5,
    topic: 'Normalitas',
    question: 'Asam sulfat (H2SO4, Mr = 98 g/mol) bertindak sebagai asam berbasa dua (valensi n = 2). Berapakah Berat Ekuivalen (BE) dari H2SO4?',
    options: ['98 g/grek', '49 g/grek', '196 g/grek', '24,5 g/grek'],
    correctIndex: 1,
    explanation: 'BE = Mr ÷ n = 98 ÷ 2 = 49 g/grek.'
  },
  {
    id: 6,
    topic: 'Serial Dilution',
    question: 'Pada pengenceran bertingkat 1:2 (double dilution), berapakah faktor pengenceran pada tabung ke-4?',
    options: ['1:4', '1:8', '1:16', '1:32'],
    correctIndex: 2,
    explanation: 'Faktor pengenceran = 2^n. Untuk tabung ke-4 = 2^4 = 16, sehingga faktor pengencerannya adalah 1:16.'
  },
  {
    id: 7,
    topic: 'Keselamatan Laboratorium',
    question: 'Ketika mengencerkan asam sulfat pekat dengan aquades, prosedur keselamatan K3 yang benar adalah...',
    options: [
      'Menuangkan aquades secara cepat ke dalam asam pekat',
      'Menuangkan asam pekat perlahan ke dalam aquades melalui dinding wadah sambil diaduk',
      'Mencampur keduanya sekaligus dalam labu ukur tertutup rapat',
      'Menghangatkan asam terlebih dahulu di atas hotplate sebelum dicampur air'
    ],
    correctIndex: 1,
    explanation: 'Reaksi hidrasi asam pekat sangat eksotermik. Menuangkan air ke dalam asam akan memicu letupan uap panas yang memercikkan asam. Prosedur benar: Asam dituangkan ke Air (Air Asam Alirkan).'
  },
  {
    id: 8,
    topic: 'Pewarnaan Hematologi',
    question: 'Zat apa yang digunakan untuk melisiskan eritrosit pada larutan Turk untuk hitung jumlah leukosit?',
    options: ['Formalin', 'Asam Asetat Glasial', 'Natrium Klorida', 'Gliserol'],
    correctIndex: 1,
    explanation: 'Kandungan asam asetat glasial 1% dalam larutan Turk melisiskan membran sel eritrosit sehingga hanya inti leukosit yang terwarnai dan terlihat di bilik hitung.'
  },
  {
    id: 9,
    topic: 'Normalitas',
    question: 'Jika suatu larutan NaOH memiliki konsentrasi 0,5 M, maka normalitasnya adalah... (valensi n = 1)',
    options: ['0,25 N', '0,5 N', '1,0 N', '2,0 N'],
    correctIndex: 1,
    explanation: 'N = M × n = 0,5 M × 1 = 0,5 N. Karena NaOH melepaskan 1 ion OH-, maka molaritas sama dengan normalitasnya.'
  },
  {
    id: 10,
    topic: 'Konversi Satuan',
    question: '1 Liter larutan setara dengan berapa mililiter (mL)?',
    options: ['10 mL', '100 mL', '1.000 mL', '10.000 mL'],
    correctIndex: 2,
    explanation: '1 Liter = 1.000 mL.'
  }
];

export const ESSAY_QUESTIONS: EssayQuestion[] = [
  {
    id: 1,
    topic: 'Pembuatan Larutan Asam dari Stok Pekat',
    title: 'Studi Kasus: Pembuatan 500 mL Larutan HCl 0,1 M',
    problem: 'Di laboratorium tersedia botol reagen HCl pekat dengan spesifikasi pada label: Kemurnian 37% (b/b), Massa jenis (ρ) = 1,19 g/mL, dan Mr = 36,46 g/mol. Anda ditugaskan membuat 500 mL larutan HCl 0,1 M. Hitung volume HCl pekat yang harus dipipet dan tuliskan prosedur pembuatannya secara berurutan!',
    givenData: {
      'Kadar HCl': '37% (b/b)',
      'Massa Jenis (ρ)': '1,19 g/mL',
      'Mr HCl': '36,46 g/mol',
      'Volume Target (V2)': '500 mL',
      'Konsentrasi Target (C2)': '0,1 M'
    },
    solutionSteps: [
      'Langkah 1: Menghitung Molaritas stok HCl pekat (M1):',
      'M1 = (10 × % × ρ) / Mr = (10 × 37 × 1,19) / 36,46 = 440,3 / 36,46 = 12,076 M',
      'Langkah 2: Menghitung volume HCl pekat yang dipipet (V1) dengan rumus pengenceran:',
      'V1 = (C2 × V2) / M1 = (0,1 M × 500 mL) / 12,076 M = 4,14 mL HCl pekat',
      'Langkah 3: Prosedur Pembuatan di Laboratorium:',
      '1. Siapkan labu ukur 500 mL dan isi dengan sekitar 200–250 mL aquades terlebih dahulu.',
      '2. Bekerja di dalam lemari asam, gunakan sarung tangan nitril dan safety goggles.',
      '3. Pipet 4,14 mL HCl pekat menggunakan pipet ukur dan rubber bulb.',
      '4. Alirkan HCl pekat perlahan melalui dinding labu ukur yang sudah berisi aquades.',
      '5. Goyangkan perlahan labu ukur, diamkan sejenak hingga suhu larutan kembali ke suhu ruang.',
      '6. Tambahkan aquades hingga mendekati tanda tera, lalu gunakan pipet tetes sampai meniskus bawah berimpit tepat pada garis batas 500 mL.',
      '7. Pasang tutup labu ukur dan homogenkan dengan membalik labu ukur 10–12 kali. Beri label botol: "HCl 0,1 M", tanggal pembuatan, dan nama analis.'
    ],
    finalAnswer: 'Volume HCl pekat yang dipipet = 4,14 mL'
  },
  {
    id: 2,
    topic: 'Koreksi Kemurnian & Molaritas',
    title: 'Studi Kasus: Pembuatan 1000 mL Larutan NaOH 0,05 M',
    problem: 'Tersedia pelet NaOH teknis dengan kemurnian tercantum 96,0% (Mr NaOH = 40,00 g/mol). Berapa massa pelet NaOH yang harus ditimbang untuk membuat 1000 mL larutan NaOH 0,05 M?',
    givenData: {
      'Mr NaOH': '40,00 g/mol',
      'Target Konsentrasi': '0,05 M',
      'Volume Akhir': '1000 mL (1 Liter)',
      'Kemurnian': '96,0%'
    },
    solutionSteps: [
      'Langkah 1: Menghitung massa teoritis (jika 100% murni):',
      'm_teoritis = M × Mr × V(L) = 0,05 mol/L × 40,00 g/mol × 1,0 L = 2,000 gram',
      'Langkah 2: Menghitung massa aktual dengan koreksi kemurnian 96%:',
      'm_aktual = m_teoritis / (P / 100) = 2,000 g / 0,96 = 2,0833 gram',
      'Langkah 3: Prosedur Pelarutan:',
      'Karena NaOH bersifat sangat higroskopis dan eksotermik, timbang pelet NaOH 2,083 gram dengan cepat pada kaca arloji/beaker kering, larutkan dalam beaker glass dengan 300 mL aquades, dinginkan ke suhu ruang, lalu pindahkan ke labu ukur 1000 mL dan tera hingga batas.'
    ],
    finalAnswer: 'Massa NaOH ditimbang = 2,083 gram'
  }
];

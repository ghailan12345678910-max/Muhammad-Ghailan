import { CalculationResult } from '../types';

export interface MolaritasParams {
  soluteName?: string;
  mr: number;
  molarity: number; // M
  volume: number; // in volumeUnit
  volumeUnit: 'mL' | 'L';
  purityPercent?: number; // 0 - 100 (default 100)
}

export function calculateMolaritas(params: MolaritasParams): CalculationResult {
  const { soluteName = 'Zat', mr, molarity, volume, volumeUnit, purityPercent = 100 } = params;

  if (isNaN(mr) || mr <= 0) {
    throw new Error('Massa Molekul Relatif (Mr) harus berupa bilangan positif lebih dari 0.');
  }
  if (isNaN(molarity) || molarity <= 0) {
    throw new Error('Konsentrasi Molaritas (M) harus lebih dari 0.');
  }
  if (isNaN(volume) || volume <= 0) {
    throw new Error('Volume larutan harus lebih dari 0.');
  }
  if (isNaN(purityPercent) || purityPercent <= 0 || purityPercent > 100) {
    throw new Error('Kemurnian bahan harus antara 0.1% hingga 100%.');
  }

  // Convert volume to Liters
  const volumeInLiters = volumeUnit === 'mL' ? volume / 1000 : volume;

  // Theoretical mass in grams
  // m = M * Mr * V(L)
  const theoreticalMassGrams = molarity * mr * volumeInLiters;

  // Correct for purity
  const actualMassGrams = (theoreticalMassGrams / (purityPercent / 100));

  const theoreticalMassMg = theoreticalMassGrams * 1000;
  const actualMassMg = actualMassGrams * 1000;

  const steps: string[] = [
    `1. Mengonversi volume larutan: ${volume} ${volumeUnit} = ${volumeInLiters.toFixed(4)} Liter`,
    `2. Menghitung jumlah mol zat terlarut (n): n = M × V = ${molarity} mol/L × ${volumeInLiters.toFixed(4)} L = ${(molarity * volumeInLiters).toFixed(6)} mol`,
    `3. Menghitung massa murni (teoritis): m = n × Mr = ${(molarity * volumeInLiters).toFixed(6)} mol × ${mr} g/mol = ${theoreticalMassGrams.toFixed(4)} gram`
  ];

  if (purityPercent < 100) {
    steps.push(
      `4. Mengoreksi kemurnian bahan (${purityPercent}%): m_aktual = m_teoritis ÷ (${purityPercent}/100) = ${theoreticalMassGrams.toFixed(4)} ÷ ${(purityPercent/100).toFixed(4)} = ${actualMassGrams.toFixed(4)} gram`
    );
  }

  const notes: string[] = [
    `Larutkan ${actualMassGrams.toFixed(4)} gram ${soluteName} dengan sejumlah aquades di beaker glass hingga larut sempurna.`,
    `Pindahkan secara kuantitatif ke dalam labu ukur ${volumeUnit === 'mL' ? volume : volume * 1000} mL.`,
    `Bilas beaker glass 2-3 kali dan masukkan air bilasan ke labu ukur.`,
    `Tambahkan aquades hingga meniskus berimpit tepat pada garis tanda batas, tutup lalu homogenkan dengan membolak-balik labu ukur 10-12 kali.`
  ];

  const secondaryResults = [
    { label: 'Massa Murni (100%)', value: `${theoreticalMassGrams.toFixed(4)}`, unit: 'g' },
    { label: 'Setara Miligram', value: `${actualMassMg.toFixed(2)}`, unit: 'mg' },
    { label: 'Jumlah Mol (n)', value: `${(molarity * volumeInLiters).toFixed(6)}`, unit: 'mol' }
  ];

  if (purityPercent < 100) {
    secondaryResults.unshift({
      label: 'Massa Ditimbang (Koreksi Kemurnian)',
      value: `${actualMassGrams.toFixed(4)}`,
      unit: 'g'
    });
  }

  return {
    title: `Perhitungan Molaritas – ${soluteName}`,
    type: 'molaritas',
    primaryResult: actualMassGrams.toFixed(4),
    primaryUnit: 'gram',
    secondaryResults,
    formula: purityPercent < 100 ? 'm = (M × Mr × V) ÷ (Purity / 100)' : 'm = M × Mr × V',
    steps,
    notes,
    safetyNotice: 'Gunakan neraca analitik dengan ketelitian minimal 4 desimal (0,1 mg) untuk pembuatan larutan standar primer.'
  };
}

export interface PengenceranParams {
  c1: number; // Konsentrasi stok
  c1Unit: string;
  c2: number; // Konsentrasi target
  c2Unit: string;
  v2: number; // Volume akhir yang diinginkan
  v2Unit: 'mL' | 'L' | 'µL';
}

export function calculatePengenceran(params: PengenceranParams): CalculationResult {
  const { c1, c1Unit, c2, c2Unit, v2, v2Unit } = params;

  if (isNaN(c1) || c1 <= 0) {
    throw new Error('Konsentrasi awal stok (C1) harus lebih dari 0.');
  }
  if (isNaN(c2) || c2 <= 0) {
    throw new Error('Konsentrasi target (C2) harus lebih dari 0.');
  }
  if (c2 >= c1) {
    throw new Error('Konsentrasi target (C2) harus lebih kecil dari konsentrasi stok (C1) untuk proses pengenceran.');
  }
  if (isNaN(v2) || v2 <= 0) {
    throw new Error('Volume akhir (V2) harus lebih dari 0.');
  }

  // C1 * V1 = C2 * V2  =>  V1 = (C2 * V2) / C1
  const v1 = (c2 * v2) / c1;
  const solventVolume = v2 - v1;
  const dilutionFactor = c1 / c2;

  const steps: string[] = [
    `1. Menggunakan asas kekekalan mol / massa: C1 × V1 = C2 × V2`,
    `2. Menghitung volume larutan stok yang dibutuhkan (V1):`,
    `   V1 = (C2 × V2) ÷ C1 = (${c2} ${c2Unit} × ${v2} ${v2Unit}) ÷ ${c1} ${c1Unit} = ${v1.toFixed(3)} ${v2Unit}`,
    `3. Menghitung volume pelarut (aquades) yang ditambahkan:`,
    `   V_pelarut = V2 - V1 = ${v2} ${v2Unit} - ${v1.toFixed(3)} ${v2Unit} = ${solventVolume.toFixed(3)} ${v2Unit}`,
    `4. Faktor pengenceran (Dilution Factor): FP = C1 / C2 = ${dilutionFactor.toFixed(2)}×`
  ];

  return {
    title: 'Perhitungan Pengenceran (C1V1 = C2V2)',
    type: 'pengenceran',
    primaryResult: v1.toFixed(3),
    primaryUnit: v2Unit,
    secondaryResults: [
      { label: 'Volume Pelarut Ditambahkan', value: solventVolume.toFixed(3), unit: v2Unit },
      { label: 'Volume Akhir Larutan (V2)', value: v2.toString(), unit: v2Unit },
      { label: 'Faktor Pengenceran (FP)', value: `${dilutionFactor.toFixed(2)}×` }
    ],
    formula: 'C1 × V1 = C2 × V2 ➔ V1 = (C2 × V2) / C1',
    steps,
    notes: [
      `Pipet ${v1.toFixed(3)} ${v2Unit} larutan stok menggunakan pipet volume / mikropipet yang terkalibrasi.`,
      `Masukkan ke dalam labu ukur ${v2} ${v2Unit}.`,
      `Tambahkan pelarut (aquades/buffer) hingga tepat mencapai garis tanda batas volume akhir ${v2} ${v2Unit}.`
    ],
    safetyNotice: 'Perhatian: Jangan pernah menuangkan air ke dalam asam pekat! Jika larutan stok berupa asam/basa pekat, selalu tambahkan air sebagian terlebih dahulu lalu alirkan larutan stok perlahan.'
  };
}

export interface PersenParams {
  type: 'bv' | 'vv' | 'bb'; // % b/v, % v/v, % b/b
  percentage: number; // %
  targetVolumeOrMass: number; // mL for bv and vv, gram for bb
}

export function calculatePersen(params: PersenParams): CalculationResult {
  const { type, percentage, targetVolumeOrMass } = params;

  if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
    throw new Error('Persentase harus berupa angka di antara 0.01% dan 100%.');
  }
  if (isNaN(targetVolumeOrMass) || targetVolumeOrMass <= 0) {
    throw new Error('Volume / Massa target harus lebih dari 0.');
  }

  let primaryResult = '';
  let primaryUnit = '';
  let formula = '';
  let steps: string[] = [];
  let notes: string[] = [];
  let secondaryResults: { label: string; value: string; unit?: string }[] = [];

  if (type === 'bv') {
    // % b/v = gram / 100 mL  =>  massa = (% * volume) / 100
    const mass = (percentage * targetVolumeOrMass) / 100;
    primaryResult = mass.toFixed(4);
    primaryUnit = 'gram';
    formula = 'Massa (g) = [% (b/v) × Volume (mL)] ÷ 100';
    steps = [
      `Definisi % (b/v): ${percentage} gram zat terlarut dalam setiap 100 mL larutan.`,
      `Massa = (${percentage} × ${targetVolumeOrMass} mL) ÷ 100 = ${mass.toFixed(4)} gram`
    ];
    notes = [
      `Timbang ${mass.toFixed(4)} gram zat terlarut secara teliti.`,
      `Larutkan dengan sebagian aquades di beaker glass, pindahkan ke labu ukur ${targetVolumeOrMass} mL.`,
      `Tambahkan aquades hingga tepat batas ${targetVolumeOrMass} mL.`
    ];
    secondaryResults = [
      { label: 'Setara Miligram', value: (mass * 1000).toFixed(1), unit: 'mg' },
      { label: 'Volume Larutan', value: targetVolumeOrMass.toString(), unit: 'mL' }
    ];
  } else if (type === 'vv') {
    // % v/v = mL zat / 100 mL larutan  =>  volumeZat = (% * volumeTotal) / 100
    const soluteVolume = (percentage * targetVolumeOrMass) / 100;
    const solventApprox = targetVolumeOrMass - soluteVolume;
    primaryResult = soluteVolume.toFixed(3);
    primaryUnit = 'mL';
    formula = 'Volume Zat (mL) = [% (v/v) × Volume Total (mL)] ÷ 100';
    steps = [
      `Definisi % (v/v): ${percentage} mL zat cair terlarut dalam setiap 100 mL larutan akhir.`,
      `Volume Zat = (${percentage} × ${targetVolumeOrMass} mL) ÷ 100 = ${soluteVolume.toFixed(3)} mL`,
      `Volume Pelarut: kira-kira ${solventApprox.toFixed(3)} mL (ditambahkan hingga batas akhir ${targetVolumeOrMass} mL)`
    ];
    notes = [
      `Ukur ${soluteVolume.toFixed(3)} mL cairan zat menggunakan pipet ukur atau labu takar.`,
      `Tuangkan ke dalam labu ukur berukuran ${targetVolumeOrMass} mL.`,
      `Tambahkan pelarut hingga tanda batas tepat pada ${targetVolumeOrMass} mL.`
    ];
    secondaryResults = [
      { label: 'Volume Pelarut (Pendekatan)', value: solventApprox.toFixed(3), unit: 'mL' },
      { label: 'Volume Total Akhir', value: targetVolumeOrMass.toString(), unit: 'mL' }
    ];
  } else {
    // % b/b = gram zat / 100 gram campuran => massaZat = (% * massaTotal) / 100
    const soluteMass = (percentage * targetVolumeOrMass) / 100;
    const solventMass = targetVolumeOrMass - soluteMass;
    primaryResult = soluteMass.toFixed(4);
    primaryUnit = 'gram';
    formula = 'Massa Zat (g) = [% (b/b) × Massa Total Campuran (g)] ÷ 100';
    steps = [
      `Definisi % (b/b): ${percentage} gram zat terlarut dalam setiap 100 gram campuran akhir.`,
      `Massa Zat Terlarut = (${percentage} × ${targetVolumeOrMass} g) ÷ 100 = ${soluteMass.toFixed(4)} gram`,
      `Massa Pelarut = ${targetVolumeOrMass} g - ${soluteMass.toFixed(4)} g = ${solventMass.toFixed(4)} gram`
    ];
    notes = [
      `Timbang ${soluteMass.toFixed(4)} gram zat terlarut.`,
      `Timbang ${solventMass.toFixed(4)} gram pelarut, campurkan hingga homogen sehingga massa total menjadi ${targetVolumeOrMass} gram.`
    ];
    secondaryResults = [
      { label: 'Massa Pelarut Ditimbang', value: solventMass.toFixed(4), unit: 'gram' },
      { label: 'Massa Total Campuran', value: targetVolumeOrMass.toString(), unit: 'gram' }
    ];
  }

  const typeNames = {
    bv: 'Persen Berat per Volume (% b/v)',
    vv: 'Persen Volume per Volume (% v/v)',
    bb: 'Persen Berat per Berat (% b/b)'
  };

  return {
    title: `Perhitungan ${typeNames[type]}`,
    type: 'persen',
    primaryResult,
    primaryUnit,
    secondaryResults,
    formula,
    steps,
    notes,
    safetyNotice: 'Pastikan meniskus bawah tepat sejajar dengan garis kalibrasi labu ukur pada suhu 20-25°C.'
  };
}

export interface NormalitasParams {
  soluteName?: string;
  mr: number;
  valency: number; // e.g. 1 for HCl, 2 for H2SO4, 5 for KMnO4
  normality: number; // N
  volume: number; // mL
  purityPercent?: number; // %
}

export function calculateNormalitas(params: NormalitasParams): CalculationResult {
  const { soluteName = 'Zat', mr, valency, normality, volume, purityPercent = 100 } = params;

  if (isNaN(mr) || mr <= 0) {
    throw new Error('Massa molekul relatif (Mr) harus lebih dari 0.');
  }
  if (isNaN(valency) || valency <= 0) {
    throw new Error('Valensi / Faktor ekuivalen (n) harus bernilai positif (contoh: 1 untuk HCl/NaOH, 2 untuk H2SO4/H2C2O4).');
  }
  if (isNaN(normality) || normality <= 0) {
    throw new Error('Normalitas (N) yang diinginkan harus lebih dari 0.');
  }
  if (isNaN(volume) || volume <= 0) {
    throw new Error('Volume larutan harus lebih dari 0.');
  }
  if (isNaN(purityPercent) || purityPercent <= 0 || purityPercent > 100) {
    throw new Error('Kemurnian harus di antara 0.1% dan 100%.');
  }

  const volumeInLiters = volume / 1000;
  // Berat Ekuivalen (BE) = Mr / valency
  const be = mr / valency;

  // Grek = N * V(L)
  const grek = normality * volumeInLiters;

  // Massa teoritis = N * BE * V(L)
  const theoreticalMassGrams = normality * be * volumeInLiters;
  const actualMassGrams = theoreticalMassGrams / (purityPercent / 100);

  // Molaritas ekuivalen: M = N / valency
  const equivalentMolarity = normality / valency;

  const steps: string[] = [
    `1. Menghitung Berat Ekuivalen (BE):`,
    `   BE = Mr ÷ Valensi (n) = ${mr} ÷ ${valency} = ${be.toFixed(4)} g/grek`,
    `2. Mengonversi volume ke Liter: ${volume} mL = ${volumeInLiters.toFixed(4)} Liter`,
    `3. Menghitung jumlah grek zat: Grek = N × V(L) = ${normality} N × ${volumeInLiters.toFixed(4)} L = ${grek.toFixed(6)} grek`,
    `4. Menghitung massa murni (teoritis):`,
    `   Massa = N × BE × V(L) = ${normality} × ${be.toFixed(4)} × ${volumeInLiters.toFixed(4)} = ${theoreticalMassGrams.toFixed(4)} gram`
  ];

  if (purityPercent < 100) {
    steps.push(
      `5. Koreksi Kemurnian (${purityPercent}%): m_aktual = ${theoreticalMassGrams.toFixed(4)} ÷ ${(purityPercent/100).toFixed(4)} = ${actualMassGrams.toFixed(4)} gram`
    );
  }

  const secondaryResults = [
    { label: 'Berat Ekuivalen (BE)', value: be.toFixed(4), unit: 'g/grek' },
    { label: 'Setara Molaritas (M)', value: equivalentMolarity.toFixed(4), unit: 'M' },
    { label: 'Jumlah Grek', value: grek.toFixed(6), unit: 'grek' }
  ];

  if (purityPercent < 100) {
    secondaryResults.unshift({
      label: 'Massa Ditimbang (Koreksi Kemurnian)',
      value: actualMassGrams.toFixed(4),
      unit: 'g'
    });
  }

  return {
    title: `Perhitungan Normalitas – ${soluteName}`,
    type: 'normalitas',
    primaryResult: actualMassGrams.toFixed(4),
    primaryUnit: 'gram',
    secondaryResults,
    formula: 'Massa = N × BE × V(L) = N × (Mr / n) × V(L)',
    steps,
    notes: [
      `Timbang ${actualMassGrams.toFixed(4)} gram ${soluteName} dengan cermat.`,
      `Larutkan dengan aquades di beaker glass, lalu pindahkan ke labu ukur ${volume} mL dan tera hingga batas.`,
      `Untuk reagen sekunder (seperti NaOH atau KMnO4), lakukan standarisasi menggunakan larutan standar primer (asam oksalat atau Na2C2O4).`
    ],
    safetyNotice: 'Pastikan valensi disesuaikan dengan jenis reaksi: Asam/Basa (jumlah H+/OH-), Redoks (jumlah elektron ditransfer).'
  };
}

export interface SerialDilutionParams {
  initialConcentration: number;
  initialUnit: string;
  dilutionFactor: number; // e.g. 2 for 1:2 or 10 for 1:10
  numberOfTubes: number; // e.g. 5
  transferVolume: number; // e.g. 1 mL
  volumeUnit: 'mL' | 'µL';
}

export interface TubeStep {
  tubeIndex: number;
  label: string;
  dilutionRatio: string;
  concentration: number;
  transferVolumeIn: number;
  diluentVolume: number;
  transferVolumeOut: number;
  finalRemainingVolume: number;
}

export function calculateSerialDilution(params: SerialDilutionParams) {
  const { initialConcentration, initialUnit, dilutionFactor, numberOfTubes, transferVolume, volumeUnit } = params;

  if (isNaN(initialConcentration) || initialConcentration <= 0) {
    throw new Error('Konsentrasi awal harus lebih dari 0.');
  }
  if (isNaN(dilutionFactor) || dilutionFactor <= 1) {
    throw new Error('Faktor pengenceran harus lebih dari 1 (contoh: 2 untuk pengenceran 1:2 atau 10 untuk 1:10).');
  }
  if (isNaN(numberOfTubes) || numberOfTubes < 2 || numberOfTubes > 20) {
    throw new Error('Jumlah tabung harus di antara 2 hingga 20 tabung.');
  }
  if (isNaN(transferVolume) || transferVolume <= 0) {
    throw new Error('Volume transfer harus lebih dari 0.');
  }

  // If dilution factor is DF, total volume per tube during mixing = transferVolume * DF
  // diluentVolume = transferVolume * (DF - 1)
  const diluentVolume = transferVolume * (dilutionFactor - 1);

  const tubes: TubeStep[] = [];

  for (let i = 1; i <= numberOfTubes; i++) {
    const totalDilution = Math.pow(dilutionFactor, i);
    const conc = initialConcentration / totalDilution;
    const isLast = i === numberOfTubes;

    tubes.push({
      tubeIndex: i,
      label: `Tabung ${i}`,
      dilutionRatio: `1:${totalDilution.toLocaleString('id-ID')}`,
      concentration: conc,
      transferVolumeIn: transferVolume,
      diluentVolume: diluentVolume,
      transferVolumeOut: isLast ? 0 : transferVolume,
      finalRemainingVolume: isLast ? (diluentVolume + transferVolume) : diluentVolume
    });
  }

  return {
    tubes,
    diluentVolumePerTube: diluentVolume,
    transferVolume,
    totalDiluentNeeded: diluentVolume * numberOfTubes,
    unit: volumeUnit,
    initialConcentration,
    initialUnit,
    dilutionFactor
  };
}

export interface ReagentRequirementParams {
  testName?: string;
  sampleCount: number; // e.g. 20
  reagentVolumePerTest: number; // e.g. 2 mL
  volumeUnit: 'mL' | 'µL' | 'L';
  repetitions?: number; // 1 = singplo, 2 = duplo, 3 = triplo
  controlCount?: number; // e.g. 2 (normal & patologis)
  blankCount?: number; // e.g. 1
  bufferPercentage?: number; // e.g. 10 (%)
}

export function calculateReagentRequirement(params: ReagentRequirementParams): CalculationResult {
  const {
    testName = 'Pemeriksaan Laboratorium',
    sampleCount,
    reagentVolumePerTest,
    volumeUnit,
    repetitions = 1,
    controlCount = 0,
    blankCount = 0,
    bufferPercentage = 10
  } = params;

  if (isNaN(sampleCount) || sampleCount < 1) {
    throw new Error('Jumlah sampel harus minimal 1.');
  }
  if (isNaN(reagentVolumePerTest) || reagentVolumePerTest <= 0) {
    throw new Error('Volume reagen per sampel harus lebih dari 0.');
  }
  if (isNaN(bufferPercentage) || bufferPercentage < 0 || bufferPercentage > 100) {
    throw new Error('Persentase cadangan harus antara 0% dan 100%.');
  }

  // Total test count: (Sample * repetitions) + controls + blanks
  // Non-duplication guarantee: controls and blanks are calculated once per run
  const patientTests = sampleCount * Math.max(1, repetitions);
  const totalTests = patientTests + Math.max(0, controlCount) + Math.max(0, blankCount);

  // Base Volume = totalTests * reagentVolumePerTest
  const baseVolume = totalTests * reagentVolumePerTest;

  // Buffer Volume = baseVolume * (bufferPercentage / 100)
  const bufferVolume = (baseVolume * bufferPercentage) / 100;

  // Total Requirement = baseVolume + bufferVolume
  const totalVolume = baseVolume + bufferVolume;

  const steps: string[] = [
    `1. Menghitung jumlah pemeriksaan pasien: ${sampleCount} sampel × ${repetitions} replikasi = ${patientTests} tes`,
    `2. Menghitung total pengerjaan:`,
    `   ${patientTests} tes pasien + ${controlCount} kontrol + ${blankCount} blanko = ${totalTests} total uji`,
    `3. Menghitung kebutuhan volume dasar:`,
    `   ${totalTests} uji × ${reagentVolumePerTest} ${volumeUnit} = ${baseVolume.toFixed(2)} ${volumeUnit}`,
    `4. Menghitung cadangan / safety margin (${bufferPercentage}%):`,
    `   ${baseVolume.toFixed(2)} ${volumeUnit} × (${bufferPercentage} / 100) = ${bufferVolume.toFixed(2)} ${volumeUnit}`,
    `5. Total reagen yang harus disiapkan:`,
    `   ${baseVolume.toFixed(2)} + ${bufferVolume.toFixed(2)} = ${totalVolume.toFixed(2)} ${volumeUnit}`
  ];

  return {
    title: `Kebutuhan Reagen – ${testName}`,
    type: 'kebutuhan_reagen',
    primaryResult: totalVolume.toFixed(2),
    primaryUnit: volumeUnit,
    secondaryResults: [
      { label: 'Volume Dasar (Netto)', value: baseVolume.toFixed(2), unit: volumeUnit },
      { label: `Cadangan Safety (${bufferPercentage}%)`, value: bufferVolume.toFixed(2), unit: volumeUnit },
      { label: 'Total Tabung/Kuvet Uji', value: totalTests.toString(), unit: 'tabung' },
      { label: 'Tes Pasien', value: patientTests.toString(), unit: 'tabung' },
      { label: 'Kontrol & Blanko', value: (controlCount + blankCount).toString(), unit: 'tabung' }
    ],
    formula: 'Total Kebutuhan = Kebutuhan Dasar × (1 + % Cadangan / 100)',
    steps,
    notes: [
      `Siapkan ${totalVolume.toFixed(2)} ${volumeUnit} reagen kerja dalam wadah reagen yang bersih dan bebas kontaminan.`,
      `Pastikan reagen telah mencapai suhu kerja (biasanya suhu kamar atau 37°C) sebelum dilakukan pemipetan pada sampel pasien.`
    ]
  };
}

export function convertUnits(
  value: number,
  category: 'massa' | 'volume' | 'konsentrasi',
  fromUnit: string,
  toUnit: string,
  context?: { mr?: number; valency?: number }
): number {
  if (isNaN(value)) return 0;
  if (fromUnit === toUnit) return value;

  // Mass: standard in grams
  if (category === 'massa') {
    const toGram: Record<string, number> = {
      'µg': 1e-6,
      'mg': 1e-3,
      'g': 1,
      'kg': 1000
    };
    const valInGrams = value * (toGram[fromUnit] || 1);
    return valInGrams / (toGram[toUnit] || 1);
  }

  // Volume: standard in mL
  if (category === 'volume') {
    const toMl: Record<string, number> = {
      'µL': 0.001,
      'mL': 1,
      'L': 1000
    };
    const valInMl = value * (toMl[fromUnit] || 1);
    return valInMl / (toMl[toUnit] || 1);
  }

  // Concentration conversions
  if (category === 'konsentrasi') {
    // M, mM, µM
    const molarFactor: Record<string, number> = {
      'M': 1,
      'mM': 1e-3,
      'µM': 1e-6
    };

    if (molarFactor[fromUnit] && molarFactor[toUnit]) {
      const inMolar = value * molarFactor[fromUnit];
      return inMolar / molarFactor[toUnit];
    }

    // Normalitas to Molaritas (requires valency)
    const valency = context?.valency || 1;
    if (fromUnit === 'N' && toUnit === 'M') {
      return value / valency;
    }
    if (fromUnit === 'M' && toUnit === 'N') {
      return value * valency;
    }

    // mg/L to µg/mL (1 mg/L = 1 µg/mL)
    if ((fromUnit === 'mg/L' && toUnit === 'µg/mL') || (fromUnit === 'µg/mL' && toUnit === 'mg/L')) {
      return value;
    }

    // % b/v to mg/L: 1% b/v = 1 g/100 mL = 10 g/L = 10,000 mg/L
    if (fromUnit === '% b/v' && toUnit === 'mg/L') {
      return value * 10000;
    }
    if (fromUnit === 'mg/L' && toUnit === '% b/v') {
      return value / 10000;
    }
  }

  return value;
}

import React, { useState, useEffect } from 'react';
import {
  Calculator,
  FlaskConical,
  Layers,
  TrendingUp,
  Boxes,
  Shield,
  Save,
  FileDown,
  Printer,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Beaker,
  TestTube
} from 'lucide-react';
import { CalculatorType, CalculationResult, UserProfile, CalculationHistoryItem } from '../types';
import { CHEMICAL_DATABASE } from '../data/chemicals';
import {
  calculateMolaritas,
  calculatePengenceran,
  calculatePersen,
  calculateNormalitas,
  calculateSerialDilution,
  calculateReagentRequirement
} from '../utils/calculations';
import { exportCalculationToPDF } from '../utils/pdfExport';

interface CalculatorPageProps {
  user: UserProfile;
  onSaveHistory: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  presetItem?: CalculationHistoryItem | null;
  selectedChemicalId?: string | null;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  user,
  onSaveHistory,
  presetItem,
  selectedChemicalId
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorType>('molaritas');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Molaritas Form State
  const [molZat, setMolZat] = useState('NaCl (Natrium Klorida)');
  const [molMr, setMolMr] = useState('58.44');
  const [molKonsentrasi, setMolKonsentrasi] = useState('0.1');
  const [molVolume, setMolVolume] = useState('250');
  const [molVolumeUnit, setMolVolumeUnit] = useState<'mL' | 'L'>('mL');
  const [molPurity, setMolPurity] = useState('100');

  // Pengenceran Form State
  const [dilC1, setDilC1] = useState('1');
  const [dilC1Unit, setDilC1Unit] = useState('M');
  const [dilC2, setDilC2] = useState('0.1');
  const [dilC2Unit, setDilC2Unit] = useState('M');
  const [dilV2, setDilV2] = useState('100');
  const [dilV2Unit, setDilV2Unit] = useState<'mL' | 'L' | 'µL'>('mL');

  // Persen Form State
  const [pctType, setPctType] = useState<'bv' | 'vv' | 'bb'>('bv');
  const [pctValue, setPctValue] = useState('0.9');
  const [pctTarget, setPctTarget] = useState('100');

  // Normalitas Form State
  const [normZat, setNormZat] = useState('NaOH');
  const [normMr, setNormMr] = useState('40.00');
  const [normValency, setNormValency] = useState('1');
  const [normTarget, setNormTarget] = useState('0.1');
  const [normVolume, setNormVolume] = useState('500');
  const [normPurity, setNormPurity] = useState('100');

  // Serial Dilution Form State
  const [serConc, setSerConc] = useState('1000');
  const [serUnit, setSerUnit] = useState('µg/mL');
  const [serFactor, setSerFactor] = useState('2'); // 1:2
  const [serTubes, setSerTubes] = useState('5');
  const [serTransferVol, setSerTransferVol] = useState('1');
  const [serVolUnit, setSerVolUnit] = useState<'mL' | 'µL'>('mL');

  // Reagent Requirement Form State
  const [reqTestName, setReqTestName] = useState('Pemeriksaan Glukosa Darah GOD-PAP');
  const [reqSampleCount, setReqSampleCount] = useState('20');
  const [reqVolPerTest, setReqVolPerTest] = useState('2');
  const [reqVolUnit, setReqVolUnit] = useState<'mL' | 'µL' | 'L'>('mL');
  const [reqReplications, setReqReplications] = useState('1');
  const [reqControls, setReqControls] = useState('0');
  const [reqBlanks, setReqBlanks] = useState('0');
  const [reqBufferPct, setReqBufferPct] = useState('10');

  // Calculation Result
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [serialDilutionData, setSerialDilutionData] = useState<any>(null);

  // Quick preset chemical handler
  const handleChemicalSelect = (chemId: string) => {
    const chem = CHEMICAL_DATABASE.find(c => c.id === chemId);
    if (!chem) return;

    if (activeTab === 'molaritas') {
      setMolZat(chem.name);
      setMolMr(chem.mr.toString());
      setMolPurity(chem.standardPurity.toString());
    } else if (activeTab === 'normalitas') {
      setNormZat(chem.name);
      setNormMr(chem.mr.toString());
      setNormValency((chem.valency || 1).toString());
      setNormPurity(chem.standardPurity.toString());
    }
  };

  // Preset trigger if passed from outside
  useEffect(() => {
    if (presetItem) {
      setActiveTab(presetItem.type);
      if (presetItem.type === 'molaritas') {
        setMolZat(presetItem.inputs.soluteName || 'Zat');
        setMolMr(String(presetItem.inputs.mr || '58.44'));
        setMolKonsentrasi(String(presetItem.inputs.molarity || '0.1'));
        setMolVolume(String(presetItem.inputs.volume || '250'));
        setMolVolumeUnit(presetItem.inputs.volumeUnit || 'mL');
        setMolPurity(String(presetItem.inputs.purityPercent || '100'));
      } else if (presetItem.type === 'pengenceran') {
        setDilC1(String(presetItem.inputs.c1 || '1'));
        setDilC1Unit(presetItem.inputs.c1Unit || 'M');
        setDilC2(String(presetItem.inputs.c2 || '0.1'));
        setDilC2Unit(presetItem.inputs.c2Unit || 'M');
        setDilV2(String(presetItem.inputs.v2 || '100'));
        setDilV2Unit(presetItem.inputs.v2Unit || 'mL');
      } else if (presetItem.type === 'persen') {
        setPctType(presetItem.inputs.type || 'bv');
        setPctValue(String(presetItem.inputs.percentage || '0.9'));
        setPctTarget(String(presetItem.inputs.targetVolumeOrMass || '100'));
      } else if (presetItem.type === 'normalitas') {
        setNormZat(presetItem.inputs.soluteName || 'Zat');
        setNormMr(String(presetItem.inputs.mr || '40.00'));
        setNormValency(String(presetItem.inputs.valency || '1'));
        setNormTarget(String(presetItem.inputs.normality || '0.1'));
        setNormVolume(String(presetItem.inputs.volume || '500'));
        setNormPurity(String(presetItem.inputs.purityPercent || '100'));
      } else if (presetItem.type === 'kebutuhan_reagen') {
        setReqTestName(presetItem.inputs.testName || 'Pemeriksaan');
        setReqSampleCount(String(presetItem.inputs.sampleCount || '20'));
        setReqVolPerTest(String(presetItem.inputs.reagentVolumePerTest || '2'));
        setReqVolUnit(presetItem.inputs.volumeUnit || 'mL');
        setReqReplications(String(presetItem.inputs.repetitions || '1'));
        setReqControls(String(presetItem.inputs.controlCount || '0'));
        setReqBlanks(String(presetItem.inputs.blankCount || '0'));
        setReqBufferPct(String(presetItem.inputs.bufferPercentage || '10'));
      }
    }
  }, [presetItem]);

  useEffect(() => {
    if (selectedChemicalId) {
      handleChemicalSelect(selectedChemicalId);
    }
  }, [selectedChemicalId]);

  // Perform Calculation on State Change
  const performCalculation = () => {
    setErrorMessage(null);
    try {
      if (activeTab === 'molaritas') {
        const mr = parseFloat(molMr);
        const molarity = parseFloat(molKonsentrasi);
        const volume = parseFloat(molVolume);
        const purityPercent = parseFloat(molPurity) || 100;

        const res = calculateMolaritas({
          soluteName: molZat,
          mr,
          molarity,
          volume,
          volumeUnit: molVolumeUnit,
          purityPercent
        });
        setCurrentResult(res);
        setSerialDilutionData(null);
      } else if (activeTab === 'pengenceran') {
        const c1 = parseFloat(dilC1);
        const c2 = parseFloat(dilC2);
        const v2 = parseFloat(dilV2);

        const res = calculatePengenceran({
          c1,
          c1Unit: dilC1Unit,
          c2,
          c2Unit: dilC2Unit,
          v2,
          v2Unit: dilV2Unit
        });
        setCurrentResult(res);
        setSerialDilutionData(null);
      } else if (activeTab === 'persen') {
        const percentage = parseFloat(pctValue);
        const targetVolumeOrMass = parseFloat(pctTarget);

        const res = calculatePersen({
          type: pctType,
          percentage,
          targetVolumeOrMass
        });
        setCurrentResult(res);
        setSerialDilutionData(null);
      } else if (activeTab === 'normalitas') {
        const mr = parseFloat(normMr);
        const valency = parseFloat(normValency);
        const normality = parseFloat(normTarget);
        const volume = parseFloat(normVolume);
        const purityPercent = parseFloat(normPurity) || 100;

        const res = calculateNormalitas({
          soluteName: normZat,
          mr,
          valency,
          normality,
          volume,
          purityPercent
        });
        setCurrentResult(res);
        setSerialDilutionData(null);
      } else if (activeTab === 'serial_dilution') {
        const initialConcentration = parseFloat(serConc);
        const dilutionFactor = parseFloat(serFactor);
        const numberOfTubes = parseInt(serTubes, 10);
        const transferVolume = parseFloat(serTransferVol);

        const data = calculateSerialDilution({
          initialConcentration,
          initialUnit: serUnit,
          dilutionFactor,
          numberOfTubes,
          transferVolume,
          volumeUnit: serVolUnit
        });

        setSerialDilutionData(data);
        setCurrentResult({
          title: `Serial Dilution (1:${dilutionFactor} × ${numberOfTubes} Tabung)`,
          type: 'serial_dilution',
          primaryResult: `1:${Math.pow(dilutionFactor, numberOfTubes).toLocaleString('id-ID')}`,
          primaryUnit: 'faktor akhir',
          secondaryResults: [
            { label: 'Volume Pelarut per Tabung', value: data.diluentVolumePerTube.toString(), unit: serVolUnit },
            { label: 'Total Pelarut Dibutuhkan', value: data.totalDiluentNeeded.toString(), unit: serVolUnit },
            { label: 'Konsentrasi Tabung Terakhir', value: data.tubes[data.tubes.length - 1].concentration.toExponential(3), unit: serUnit }
          ],
          formula: 'Faktor Pengenceran Kumulatif = (Faktor)^n',
          steps: [
            `1. Siapkan ${numberOfTubes} tabung reaksi berjejer di rak tabung.`,
            `2. Isi masing-masing tabung dengan ${data.diluentVolumePerTube} ${serVolUnit} pelarut/diluent.`,
            `3. Pipet ${transferVolume} ${serVolUnit} larutan stok (${initialConcentration} ${serUnit}) ke Tabung 1, homogenkan (Faktor 1:${dilutionFactor}).`,
            `4. Ambil ${transferVolume} ${serVolUnit} dari Tabung 1 dan transfer ke Tabung 2, campur homogen. Lakukan berurutan hingga Tabung ${numberOfTubes}.`,
            `5. Pada tabung terakhir (Tabung ${numberOfTubes}), buang ${transferVolume} ${serVolUnit} agar volume seluruh tabung tetap seragam ${data.diluentVolumePerTube} ${serVolUnit}.`
          ]
        });
      } else if (activeTab === 'kebutuhan_reagen') {
        const sampleCount = parseInt(reqSampleCount, 10);
        const reagentVolumePerTest = parseFloat(reqVolPerTest);
        const repetitions = parseInt(reqReplications, 10);
        const controlCount = parseInt(reqControls, 10);
        const blankCount = parseInt(reqBlanks, 10);
        const bufferPercentage = parseFloat(reqBufferPct);

        const res = calculateReagentRequirement({
          testName: reqTestName,
          sampleCount,
          reagentVolumePerTest,
          volumeUnit: reqVolUnit,
          repetitions,
          controlCount,
          blankCount,
          bufferPercentage
        });
        setCurrentResult(res);
        setSerialDilutionData(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan perhitungan.');
      setCurrentResult(null);
      setSerialDilutionData(null);
    }
  };

  // Trigger calculation when inputs or active tab change
  useEffect(() => {
    performCalculation();
  }, [
    activeTab,
    molZat, molMr, molKonsentrasi, molVolume, molVolumeUnit, molPurity,
    dilC1, dilC1Unit, dilC2, dilC2Unit, dilV2, dilV2Unit,
    pctType, pctValue, pctTarget,
    normZat, normMr, normValency, normTarget, normVolume, normPurity,
    serConc, serUnit, serFactor, serTubes, serTransferVol, serVolUnit,
    reqTestName, reqSampleCount, reqVolPerTest, reqVolUnit, reqReplications, reqControls, reqBlanks, reqBufferPct
  ]);

  // Save to History handler
  const handleSaveToHistory = () => {
    if (!currentResult) return;

    let inputs: Record<string, any> = {};
    if (activeTab === 'molaritas') {
      inputs = { soluteName: molZat, mr: molMr, molarity: molKonsentrasi, volume: molVolume, volumeUnit: molVolumeUnit, purityPercent: molPurity };
    } else if (activeTab === 'pengenceran') {
      inputs = { c1: dilC1, c1Unit: dilC1Unit, c2: dilC2, c2Unit: dilC2Unit, v2: dilV2, v2Unit: dilV2Unit };
    } else if (activeTab === 'persen') {
      inputs = { type: pctType, percentage: pctValue, targetVolumeOrMass: pctTarget };
    } else if (activeTab === 'normalitas') {
      inputs = { soluteName: normZat, mr: normMr, valency: normValency, normality: normTarget, volume: normVolume, purityPercent: normPurity };
    } else if (activeTab === 'serial_dilution') {
      inputs = { initialConcentration: serConc, initialUnit: serUnit, dilutionFactor: serFactor, numberOfTubes: serTubes, transferVolume: serTransferVol, volumeUnit: serVolUnit };
    } else if (activeTab === 'kebutuhan_reagen') {
      inputs = { testName: reqTestName, sampleCount: reqSampleCount, reagentVolumePerTest: reqVolPerTest, volumeUnit: reqVolUnit, repetitions: reqReplications, controlCount: reqControls, blankCount: reqBlanks, bufferPercentage: reqBufferPct };
    }

    onSaveHistory({
      userId: user.id,
      title: currentResult.title,
      type: activeTab,
      inputs,
      result: currentResult
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyResult = () => {
    if (!currentResult) return;
    const text = `ReagenLab - ${currentResult.title}\nHasil: ${currentResult.primaryResult} ${currentResult.primaryUnit}\nRumus: ${currentResult.formula}\nLangkah:\n${currentResult.steps.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportPDF = () => {
    if (!currentResult) return;
    const dummyItem: CalculationHistoryItem = {
      id: `calc_${Date.now()}`,
      timestamp: Date.now(),
      userId: user.id,
      title: currentResult.title,
      type: activeTab,
      inputs: {
        'Waktu Perhitungan': new Date().toLocaleString('id-ID'),
        'Analis / Mahasiswa': user.name
      },
      result: currentResult
    };
    exportCalculationToPDF(dummyItem, user);
  };

  const tabs = [
    { id: 'molaritas', label: 'Molaritas (M)', icon: Beaker },
    { id: 'pengenceran', label: 'Pengenceran (C1V1)', icon: FlaskConical },
    { id: 'persen', label: 'Persen (%)', icon: Layers },
    { id: 'normalitas', label: 'Normalitas (N)', icon: TrendingUp },
    { id: 'serial_dilution', label: 'Serial Dilution', icon: TestTube },
    { id: 'kebutuhan_reagen', label: 'Kebutuhan Reagen', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Subheading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Reagent Calculator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kalkulator kimia presisi tinggi untuk larutan volumetrik, pengenceran, dan reagensia klinis TLM.
          </p>
        </div>

        {/* Chemical Quick Select for Molaritas & Normalitas */}
        {(activeTab === 'molaritas' || activeTab === 'normalitas') && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Pilih Zat Preset:</span>
            <select
              onChange={(e) => handleChemicalSelect(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-cyan-500"
              defaultValue=""
            >
              <option value="" disabled>-- Pilih Bahan Kimia --</option>
              {CHEMICAL_DATABASE.map(c => (
                <option key={c.id} value={c.id}>{c.name} (Mr {c.mr})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs Pill Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CalculatorType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm shadow-cyan-600/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Calculator Body: Form (Left) & Solution Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols on lg) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-500" />
              <span>Parameter Input</span>
            </h2>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
              Live Calculation
            </span>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: Molaritas */}
          {activeTab === 'molaritas' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Zat Terlarut
                </label>
                <input
                  type="text"
                  value={molZat}
                  onChange={e => setMolZat(e.target.value)}
                  placeholder="Contoh: NaCl, Glukosa, NaOH"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Massa Molar (Mr) <span className="text-slate-400 font-normal">g/mol</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={molMr}
                    onChange={e => setMolMr(e.target.value)}
                    placeholder="58.44"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kemurnian Bahan <span className="text-slate-400 font-normal">%</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={molPurity}
                    onChange={e => setMolPurity(e.target.value)}
                    placeholder="100"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Konsentrasi Molaritas Diinginkan (M)
                </label>
                <input
                  type="number"
                  step="any"
                  value={molKonsentrasi}
                  onChange={e => setMolKonsentrasi(e.target.value)}
                  placeholder="0.1"
                  className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Volume Akhir Larutan
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={molVolume}
                    onChange={e => setMolVolume(e.target.value)}
                    placeholder="250"
                    className="flex-1 font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                  <select
                    value={molVolumeUnit}
                    onChange={e => setMolVolumeUnit(e.target.value as 'mL' | 'L')}
                    className="text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                  >
                    <option value="mL">mL</option>
                    <option value="L">Liter (L)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Pengenceran (C1V1 = C2V2) */}
          {activeTab === 'pengenceran' && (
            <div className="space-y-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300">
                Rumus: <strong>C1 × V1 = C2 × V2</strong>. Menghitung volume larutan stok (V1) yang harus dipipet dan aquades yang ditambahkan.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Konsentrasi Stok (C1)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={dilC1}
                    onChange={e => setDilC1(e.target.value)}
                    placeholder="1"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Satuan C1
                  </label>
                  <select
                    value={dilC1Unit}
                    onChange={e => setDilC1Unit(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  >
                    <option value="M">M (Molar)</option>
                    <option value="mM">mM (Milimolar)</option>
                    <option value="N">N (Normalitas)</option>
                    <option value="%">% (Persen)</option>
                    <option value="mg/mL">mg/mL</option>
                    <option value="µg/mL">µg/mL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Konsentrasi Target (C2)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={dilC2}
                    onChange={e => setDilC2(e.target.value)}
                    placeholder="0.1"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Satuan C2
                  </label>
                  <input
                    type="text"
                    disabled
                    value={dilC1Unit}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Volume Akhir Larutan (V2)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={dilV2}
                    onChange={e => setDilV2(e.target.value)}
                    placeholder="100"
                    className="flex-1 font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                  <select
                    value={dilV2Unit}
                    onChange={e => setDilV2Unit(e.target.value as any)}
                    className="text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-hidden"
                  >
                    <option value="mL">mL</option>
                    <option value="L">L</option>
                    <option value="µL">µL</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Konsentrasi Persen */}
          {activeTab === 'persen' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tipe Konsentrasi Persen
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'bv', label: '% b/v (Berat/Volume)' },
                    { id: 'vv', label: '% v/v (Volume/Volume)' },
                    { id: 'bb', label: '% b/b (Berat/Berat)' }
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPctType(item.id as any)}
                      className={`py-2 px-2 rounded-xl text-center text-xs font-semibold transition ${
                        pctType === item.id
                          ? 'bg-cyan-500 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Persentase (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={pctValue}
                  onChange={e => setPctValue(e.target.value)}
                  placeholder="0.9"
                  className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {pctType === 'bb' ? 'Massa Total Campuran (gram)' : 'Volume Akhir Larutan (mL)'}
                </label>
                <input
                  type="number"
                  step="any"
                  value={pctTarget}
                  onChange={e => setPctTarget(e.target.value)}
                  placeholder="100"
                  className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Normalitas */}
          {activeTab === 'normalitas' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Zat Terlarut
                </label>
                <input
                  type="text"
                  value={normZat}
                  onChange={e => setNormZat(e.target.value)}
                  placeholder="Contoh: NaOH, H2SO4, KMnO4"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mr <span className="text-slate-400 font-normal">g/mol</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={normMr}
                    onChange={e => setNormMr(e.target.value)}
                    placeholder="40.00"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Valensi (n)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={normValency}
                    onChange={e => setNormValency(e.target.value)}
                    placeholder="1"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Normalitas (N)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={normTarget}
                    onChange={e => setNormTarget(e.target.value)}
                    placeholder="0.1"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Volume Larutan (mL)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={normVolume}
                    onChange={e => setNormVolume(e.target.value)}
                    placeholder="500"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kemurnian Bahan (%)
                </label>
                <input
                  type="number"
                  step="any"
                  value={normPurity}
                  onChange={e => setNormPurity(e.target.value)}
                  placeholder="100"
                  className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* TAB 5: Serial Dilution */}
          {activeTab === 'serial_dilution' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Konsentrasi Awal Stok
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={serConc}
                    onChange={e => setSerConc(e.target.value)}
                    placeholder="1000"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Satuan Konsentrasi
                  </label>
                  <input
                    type="text"
                    value={serUnit}
                    onChange={e => setSerUnit(e.target.value)}
                    placeholder="µg/mL atau M"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faktor Tiap Tahap (1:X)
                  </label>
                  <select
                    value={serFactor}
                    onChange={e => setSerFactor(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  >
                    <option value="2">1:2 (Double Dilution)</option>
                    <option value="3">1:3</option>
                    <option value="4">1:4</option>
                    <option value="5">1:5</option>
                    <option value="10">1:10 (Serial Log10)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Tabung
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="15"
                    value={serTubes}
                    onChange={e => setSerTubes(e.target.value)}
                    placeholder="5"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Volume Transfer per Tabung
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={serTransferVol}
                    onChange={e => setSerTransferVol(e.target.value)}
                    placeholder="1"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Satuan Volume
                  </label>
                  <select
                    value={serVolUnit}
                    onChange={e => setSerVolUnit(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  >
                    <option value="mL">mL</option>
                    <option value="µL">µL</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Kebutuhan Reagen Sampel */}
          {activeTab === 'kebutuhan_reagen' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Tes / Pemeriksaan
                </label>
                <input
                  type="text"
                  value={reqTestName}
                  onChange={e => setReqTestName(e.target.value)}
                  placeholder="Contoh: Glukosa Darah, Asam Urat, Kolesterol"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Sampel Pasien (N)
                  </label>
                  <input
                    type="number"
                    value={reqSampleCount}
                    onChange={e => setReqSampleCount(e.target.value)}
                    placeholder="20"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reagen per Tes
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      step="any"
                      value={reqVolPerTest}
                      onChange={e => setReqVolPerTest(e.target.value)}
                      placeholder="2"
                      className="flex-1 font-mono text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                    />
                    <select
                      value={reqVolUnit}
                      onChange={e => setReqVolUnit(e.target.value as any)}
                      className="text-xs px-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="mL">mL</option>
                      <option value="µL">µL</option>
                      <option value="L">L</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Replikasi
                  </label>
                  <select
                    value={reqReplications}
                    onChange={e => setReqReplications(e.target.value)}
                    className="w-full text-xs py-2 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  >
                    <option value="1">1 (Singplo)</option>
                    <option value="2">2 (Duplo)</option>
                    <option value="3">3 (Triplo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kontrol (Tabung)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reqControls}
                    onChange={e => setReqControls(e.target.value)}
                    placeholder="0"
                    className="w-full font-mono text-xs px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Blanko (Tabung)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reqBlanks}
                    onChange={e => setReqBlanks(e.target.value)}
                    placeholder="0"
                    className="w-full font-mono text-xs px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Persentase Cadangan / Safety Margin (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={reqBufferPct}
                    onChange={e => setReqBufferPct(e.target.value)}
                    className="flex-1 accent-cyan-500"
                  />
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                    {reqBufferPct}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Cadangan reagen untuk kompensasi dead-volume tip pipet, pembilasan kuvet, dan pengulangan tes.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Calculation Output & Step-by-Step Solution (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {currentResult ? (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5">
              {/* Header result banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    Hasil Perhitungan Terverifikasi
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {currentResult.title}
                  </h2>
                </div>

                {/* Actions: Save, PDF, Copy */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleCopyResult}
                    title="Salin Hasil ke Clipboard"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleExportPDF}
                    title="Unduh Lembar Hasil PDF"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                  >
                    <FileDown className="w-4 h-4 text-cyan-500" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>

                  <button
                    onClick={handleSaveToHistory}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                      savedSuccess
                        ? 'bg-emerald-500 text-white'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                    }`}
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Tersimpan!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Simpan Riwayat</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Output Highlight Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50 dark:from-slate-800/80 dark:via-cyan-950/30 dark:to-slate-800/80 border border-cyan-200 dark:border-cyan-500/30 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300">
                    Nilai yang Diperlukan:
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-950 dark:text-white tracking-tight">
                      {currentResult.primaryResult}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-cyan-700 dark:text-cyan-400">
                      {currentResult.primaryUnit}
                    </span>
                  </div>
                </div>

                {/* Secondary values */}
                {currentResult.secondaryResults && currentResult.secondaryResults.length > 0 && (
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {currentResult.secondaryResults.map((sec, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-cyan-100 dark:border-cyan-900/40 text-left"
                      >
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{sec.label}</p>
                        <p className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                          {sec.value} {sec.unit || ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Serial Dilution Tube Visualizer */}
              {serialDilutionData && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <TestTube className="w-4 h-4 text-cyan-500" />
                      <span>Diagram Pengenceran Bertingkat ({serialDilutionData.tubes.length} Tabung)</span>
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Transfer: {serialDilutionData.transferVolume} {serialDilutionData.unit}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {serialDilutionData.tubes.map((tube: any) => (
                      <div
                        key={tube.tubeIndex}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden"
                      >
                        <div className="w-6 h-10 mx-auto rounded-b-xl border-2 border-cyan-500/60 bg-cyan-100/40 dark:bg-cyan-950/40 relative flex items-end justify-center mb-2">
                          <div
                            className="w-full bg-cyan-500/70 rounded-b-lg"
                            style={{ height: `${Math.max(20, 100 - (tube.tubeIndex - 1) * 15)}%` }}
                          />
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{tube.label}</p>
                        <p className="text-[11px] font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                          {tube.dilutionRatio}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {tube.concentration < 0.001 ? tube.concentration.toExponential(2) : tube.concentration.toFixed(3)}
                        </p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          Pelarut: {tube.diluentVolume} {serialDilutionData.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formula & Method */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Rumus Perhitungan
                </span>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-xs text-slate-800 dark:text-slate-200 font-bold">
                  {currentResult.formula}
                </div>
              </div>

              {/* Step-by-Step Explanation */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Langkah-Langkah Perhitungan Rinci
                </span>
                <div className="space-y-1.5">
                  {currentResult.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 font-mono leading-relaxed"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Laboratory Notes */}
              {currentResult.notes && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    Petunjuk Praktikum & Preparasi:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                    {currentResult.notes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Safety notice */}
              {currentResult.safetyNotice && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Peringatan K3:</strong> {currentResult.safetyNotice}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 space-y-3">
              <Calculator className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Silakan lengkapi parameter input di sebelah kiri untuk melihat hasil perhitungan interaktif.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

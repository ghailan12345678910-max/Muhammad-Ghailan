export type UserRole = 'mahasiswa' | 'analis';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string; // Universitas / Rumah Sakit / Laboratorium Klinik
  nimOrNip?: string;
  avatarUrl?: string;
}

export type CalculatorType = 
  | 'molaritas' 
  | 'pengenceran' 
  | 'persen' 
  | 'normalitas' 
  | 'serial_dilution' 
  | 'kebutuhan_reagen';

export interface CalculationResult {
  title: string;
  type: CalculatorType;
  primaryResult: string;
  primaryUnit: string;
  secondaryResults?: { label: string; value: string; unit?: string }[];
  formula: string;
  steps: string[];
  notes?: string[];
  safetyNotice?: string;
}

export interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  userId: string;
  title: string;
  type: CalculatorType;
  inputs: Record<string, any>;
  result: CalculationResult;
}

export interface ChemicalItem {
  id: string;
  name: string;
  formula: string;
  mr: number;
  casNumber: string;
  category: 'Asam/Basa' | 'Garam' | 'Pewarna/Staining' | 'Reagen Klinis' | 'Buffer' | 'Indikator' | 'Lainnya';
  physicalState: 'Padat' | 'Cair' | 'Kristal' | 'Serbuk' | 'Pelet';
  standardPurity: number; // e.g. 99.5 or 37 for HCl
  density?: number; // g/mL for liquids
  valency?: number; // for normality
  ghsSymbols: ('korosif' | 'toksik' | 'mudah_terbakar' | 'iritan' | 'bahaya_kesehatan' | 'oksidator' | 'bahaya_lingkungan')[];
  hazardStatements: string[];
  storageCondition: 'Suhu Kamar (15-25°C)' | 'Kulkas (2-8°C)' | 'Freezer (-20°C)' | 'Lemari Asam' | 'Tempat Gelap/Kedap Udara';
  compatibilityNotes: string;
  referenceSource: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  chemicalId?: string;
  category: string;
  lotNumber: string;
  brand: string;
  currentStock: number;
  minStock: number;
  unit: 'mL' | 'L' | 'g' | 'kg' | 'mg' | 'botol' | 'kit';
  storageLocation: string;
  purchaseDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  notes?: string;
}

export interface UsageLog {
  id: string;
  inventoryItemId: string;
  reagentName: string;
  amountUsed: number;
  unit: string;
  date: string;
  analystName: string;
  purpose: string; // e.g. "Pemeriksaan Glukosa Darah 30 Pasien"
  remainingStockAfter: number;
}

export interface MCQQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface EssayQuestion {
  id: number;
  topic: string;
  title: string;
  problem: string;
  givenData: Record<string, string>;
  solutionSteps: string[];
  finalAnswer: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Dasar' | 'Menengah' | 'Lanjutan';
  content: {
    sectionTitle: string;
    text: string;
    formula?: string;
    example?: string;
    safetyTip?: string;
  }[];
}

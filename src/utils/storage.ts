import { UserProfile, CalculationHistoryItem, InventoryItem, UsageLog } from '../types';

const STORAGE_KEYS = {
  USER: 'reagenlab_user',
  HISTORY: 'reagenlab_history',
  INVENTORY: 'reagenlab_inventory',
  USAGE_LOGS: 'reagenlab_usage_logs',
  EDU_PROGRESS: 'reagenlab_edu_progress',
  THEME: 'reagenlab_theme'
};

export const DEFAULT_USER: UserProfile = {
  id: 'usr_default_tlm',
  name: 'muhammad Ghailan Apriliadi',
  email: 'ghailan0348@gmail.com',
  role: 'mahasiswa',
  institution: 'Institut Kesehatan Rajawali (TLM)',
  nimOrNip: 'P1337434120042'
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_1',
    name: 'Natrium Klorida (NaCl p.a)',
    category: 'Garam & Larutan Fisiologis',
    lotNumber: 'NC-2024-08A',
    brand: 'Merck Millipore',
    currentStock: 450,
    minStock: 100,
    unit: 'g',
    storageLocation: 'Rak Bahan Kimia Kering A-02',
    purchaseDate: '2024-03-10',
    expiryDate: '2027-08-30',
    notes: 'Kemurnian 99.8%. Standar pembuatan saline 0.9%.'
  },
  {
    id: 'inv_2',
    name: 'Natrium Hidroksida (NaOH Pelet)',
    category: 'Asam/Basa',
    lotNumber: 'NH-2024-02B',
    brand: 'Smart-Lab',
    currentStock: 180,
    minStock: 200,
    unit: 'g',
    storageLocation: 'Lemari Basa B-01',
    purchaseDate: '2024-01-15',
    expiryDate: '2026-11-20', // Close to expiry (< 30 days)
    notes: 'Stok menipis dan mendekati batas edar.'
  },
  {
    id: 'inv_3',
    name: 'Asam Klorida Pekat (HCl 37%)',
    category: 'Asam/Basa',
    lotNumber: 'HC-2024-11C',
    brand: 'Merck EMSURE',
    currentStock: 1500,
    minStock: 500,
    unit: 'mL',
    storageLocation: 'Lemari Asam Fume Hood 01',
    purchaseDate: '2024-06-01',
    expiryDate: '2028-06-30',
    notes: 'Kerapatan 1.19 g/mL. Wajib gunakan APD respirator.'
  },
  {
    id: 'inv_4',
    name: 'Larutan Turk (Hitung Leukosit)',
    category: 'Hematologi',
    lotNumber: 'TRK-2401',
    brand: 'ReagenLab Diagnostics',
    currentStock: 35,
    minStock: 50,
    unit: 'mL',
    storageLocation: 'Kulkas Reagen 2-8°C (Rak 2)',
    purchaseDate: '2024-02-18',
    expiryDate: '2026-11-18', // Expiring soon (< 15 days)
    notes: 'Stok kritis untuk praktikum minggu depan.'
  },
  {
    id: 'inv_5',
    name: 'Pewarna Giemsa Stock Solution',
    category: 'Pewarnaan / Staining',
    lotNumber: 'GMS-2309',
    brand: 'Sigma-Aldrich',
    currentStock: 40,
    minStock: 100,
    unit: 'mL',
    storageLocation: 'Lemari Bahan Gelap C-03',
    purchaseDate: '2023-09-01',
    expiryDate: '2025-09-15', // Expired
    notes: 'PERINGATAN: Sudah kadaluwarsa! Lakukan karantina bahan.'
  },
  {
    id: 'inv_6',
    name: 'Reagen Glukosa Darah GOD-PAP Kit',
    category: 'Kimia Klinik',
    lotNumber: 'GLU-2410',
    brand: 'DiaSys Diagnostic',
    currentStock: 4,
    minStock: 2,
    unit: 'kit',
    storageLocation: 'Kulkas Reagen 2-8°C (Rak 1)',
    purchaseDate: '2024-05-12',
    expiryDate: '2027-05-31',
    notes: '1 kit berisi 4x100 mL reagen kerja enzimatis.'
  }
];

export const INITIAL_USAGE_LOGS: UsageLog[] = [
  {
    id: 'log_1',
    inventoryItemId: 'inv_1',
    reagentName: 'Natrium Klorida (NaCl p.a)',
    amountUsed: 4.5,
    unit: 'g',
    date: '2026-11-04 09:30',
    analystName: 'muhammad Ghailan Apriliadi',
    purpose: 'Pembuatan 500 mL Saline Fisiologis 0.9% untuk Praktikum Imunoserologi',
    remainingStockAfter: 450
  },
  {
    id: 'log_2',
    inventoryItemId: 'inv_4',
    reagentName: 'Larutan Turk (Hitung Leukosit)',
    amountUsed: 15,
    unit: 'mL',
    date: '2026-11-03 14:15',
    analystName: 'Dimas Prasetyo, S.Tr.Kes',
    purpose: 'Pemeriksaan Hitung Leukosit Rutin 25 Sampel Pasien',
    remainingStockAfter: 35
  }
];

// User Storage
export function getStoredUser(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.name && (parsed.name.includes('Sarah') || parsed.institution?.includes('Politeknik'))) {
        parsed.name = 'muhammad Ghailan Apriliadi';
        parsed.institution = 'Institut Kesehatan Rajawali (TLM)';
        parsed.email = 'ghailan0348@gmail.com';
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading stored user', e);
  }
  return DEFAULT_USER;
}

export function saveStoredUser(user: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user', e);
  }
}

// Calculation History Storage
export function getStoredHistory(): CalculationHistoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading history', e);
  }
  return [];
}

export function saveCalculationHistory(item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>): CalculationHistoryItem {
  const history = getStoredHistory();
  const newItem: CalculationHistoryItem = {
    ...item,
    id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now()
  };
  const updated = [newItem, ...history].slice(0, 100); // keep up to 100 entries
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving calculation history', e);
  }
  return newItem;
}

export function deleteHistoryItem(id: string): CalculationHistoryItem[] {
  const history = getStoredHistory().filter(h => h.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error deleting history item', e);
  }
  return history;
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (e) {
    console.error('Error clearing history', e);
  }
}

// Inventory Storage
export function getStoredInventory(): InventoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading inventory', e);
  }
  // Initialize with rich sample data if empty
  saveStoredInventory(INITIAL_INVENTORY);
  return INITIAL_INVENTORY;
}

export function saveStoredInventory(items: InventoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving inventory', e);
  }
}

export function addInventoryItem(item: Omit<InventoryItem, 'id'>): InventoryItem {
  const items = getStoredInventory();
  const newItem: InventoryItem = {
    ...item,
    id: `inv_${Date.now()}`
  };
  const updated = [newItem, ...items];
  saveStoredInventory(updated);
  return newItem;
}

export function updateInventoryItem(item: InventoryItem): void {
  const items = getStoredInventory();
  const updated = items.map(it => it.id === item.id ? item : it);
  saveStoredInventory(updated);
}

export function deleteInventoryItem(id: string): void {
  const items = getStoredInventory().filter(it => it.id !== id);
  saveStoredInventory(items);
}

// Usage Logs Storage
export function getStoredUsageLogs(): UsageLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USAGE_LOGS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading usage logs', e);
  }
  saveStoredUsageLogs(INITIAL_USAGE_LOGS);
  return INITIAL_USAGE_LOGS;
}

export function saveStoredUsageLogs(logs: UsageLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USAGE_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving usage logs', e);
  }
}

export function recordUsage(itemId: string, amount: number, analyst: string, purpose: string): void {
  const items = getStoredInventory();
  const targetItem = items.find(it => it.id === itemId);
  if (!targetItem) throw new Error('Reagen tidak ditemukan di inventaris.');

  const remaining = Math.max(0, targetItem.currentStock - amount);
  targetItem.currentStock = remaining;
  saveStoredInventory(items);

  const logs = getStoredUsageLogs();
  const newLog: UsageLog = {
    id: `log_${Date.now()}`,
    inventoryItemId: itemId,
    reagentName: targetItem.name,
    amountUsed: amount,
    unit: targetItem.unit,
    date: new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
    analystName: analyst,
    purpose,
    remainingStockAfter: remaining
  };
  saveStoredUsageLogs([newLog, ...logs]);
}

// Education Progress Storage
export function getQuizScore(): { completed: number; score: number; total: number } {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EDU_PROGRESS);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error reading quiz score', e);
  }
  return { completed: 0, score: 0, total: 10 };
}

export function saveQuizScore(score: number, total: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.EDU_PROGRESS, JSON.stringify({ completed: Date.now(), score, total }));
  } catch (e) {
    console.error('Error saving quiz score', e);
  }
}

import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Trash2,
  Edit2,
  MinusCircle,
  PlusCircle,
  FileSpreadsheet,
  FileText,
  Calendar,
  MapPin,
  Tag,
  CheckCircle2,
  X,
  History,
  AlertOctagon
} from 'lucide-react';
import { InventoryItem, UsageLog, UserProfile } from '../types';
import { jsPDF } from 'jspdf';

interface InventoryPageProps {
  user: UserProfile;
  inventory: InventoryItem[];
  usageLogs: UsageLog[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
  onRecordUsage: (itemId: string, amount: number, analyst: string, purpose: string) => void;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  user,
  inventory,
  usageLogs,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onRecordUsage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'low' | 'expiring' | 'expired' | 'safe'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'stok' | 'logs'>('stok');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [selectedItemForUsage, setSelectedItemForUsage] = useState<InventoryItem | null>(null);

  // Form states for Add / Edit
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Hematologi');
  const [formBrand, setFormBrand] = useState('Merck');
  const [formLot, setFormLot] = useState('');
  const [formStock, setFormStock] = useState('100');
  const [formMinStock, setFormMinStock] = useState('20');
  const [formUnit, setFormUnit] = useState<'mL' | 'L' | 'g' | 'kg' | 'mg' | 'botol' | 'kit'>('mL');
  const [formLocation, setFormLocation] = useState('Kulkas Reagen 2-8°C');
  const [formPurchaseDate, setFormPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [formExpiryDate, setFormExpiryDate] = useState('2027-12-31');
  const [formNotes, setFormNotes] = useState('');

  // Usage modal state
  const [useAmount, setUseAmount] = useState('10');
  const [useAnalyst, setUseAnalyst] = useState(user.name);
  const [usePurpose, setUsePurpose] = useState('');

  const now = new Date();
  const thirtyDaysAhead = new Date();
  thirtyDaysAhead.setDate(now.getDate() + 30);

  // Filter calculations
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storageLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    const expDate = new Date(item.expiryDate);
    const isExpired = expDate <= now;
    const isExpiringSoon = !isExpired && expDate <= thirtyDaysAhead;
    const isLowStock = item.currentStock <= item.minStock;

    if (!matchesSearch || !matchesCategory) return false;

    if (selectedFilter === 'low') return isLowStock;
    if (selectedFilter === 'expiring') return isExpiringSoon;
    if (selectedFilter === 'expired') return isExpired;
    if (selectedFilter === 'safe') return !isLowStock && !isExpiringSoon && !isExpired;

    return true;
  });

  const categories = Array.from(new Set(inventory.map(i => i.category)));

  // Handlers
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Hematologi');
    setFormBrand('Merck');
    setFormLot(`LOT-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`);
    setFormStock('100');
    setFormMinStock('20');
    setFormUnit('mL');
    setFormLocation('Kulkas Reagen 2-8°C');
    setFormPurchaseDate(new Date().toISOString().split('T')[0]);
    setFormExpiryDate('2027-12-31');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormBrand(item.brand);
    setFormLot(item.lotNumber);
    setFormStock(item.currentStock.toString());
    setFormMinStock(item.minStock.toString());
    setFormUnit(item.unit);
    setFormLocation(item.storageLocation);
    setFormPurchaseDate(item.purchaseDate);
    setFormExpiryDate(item.expiryDate);
    setFormNotes(item.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingItem) {
      onUpdateItem({
        ...editingItem,
        name: formName,
        category: formCategory,
        brand: formBrand,
        lotNumber: formLot,
        currentStock: parseFloat(formStock) || 0,
        minStock: parseFloat(formMinStock) || 0,
        unit: formUnit,
        storageLocation: formLocation,
        purchaseDate: formPurchaseDate,
        expiryDate: formExpiryDate,
        notes: formNotes
      });
    } else {
      onAddItem({
        name: formName,
        category: formCategory,
        brand: formBrand,
        lotNumber: formLot,
        currentStock: parseFloat(formStock) || 0,
        minStock: parseFloat(formMinStock) || 0,
        unit: formUnit,
        storageLocation: formLocation,
        purchaseDate: formPurchaseDate,
        expiryDate: formExpiryDate,
        notes: formNotes
      });
    }

    setIsAddModalOpen(false);
  };

  const handleOpenUsage = (item: InventoryItem) => {
    setSelectedItemForUsage(item);
    setUseAmount('10');
    setUseAnalyst(user.name);
    setUsePurpose('Pemeriksaan Rutin Laboratorium');
    setIsUsageModalOpen(true);
  };

  const handleConfirmUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForUsage) return;
    const amount = parseFloat(useAmount);
    if (isNaN(amount) || amount <= 0) return;

    onRecordUsage(selectedItemForUsage.id, amount, useAnalyst, usePurpose);
    setIsUsageModalOpen(false);
  };

  const handleQuickRestock = (item: InventoryItem) => {
    const amountStr = prompt(`Tambah stok untuk ${item.name} (${item.unit}):`, '100');
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (!isNaN(amount) && amount > 0) {
      onUpdateItem({
        ...item,
        currentStock: item.currentStock + amount
      });
    }
  };

  // Export Inventory to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Banner
    doc.setFillColor(11, 19, 41);
    doc.rect(0, 0, pageWidth, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('REAGENLAB – LAPORAN INVENTARIS STOK & KEDALUWARSA REAGEN', 14, 12);
    doc.setFontSize(8);
    doc.setTextColor(186, 230, 253);
    doc.text(`Dicetak oleh: ${user.name} | ${user.institution} | Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 14, 18);

    let y = 32;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Nama Reagen', 14, y);
    doc.text('Kategori', 80, y);
    doc.text('Lot / Batch', 125, y);
    doc.text('Stok', 165, y);
    doc.text('Min', 185, y);
    doc.text('Kedaluwarsa', 205, y);
    doc.text('Lokasi', 240, y);

    doc.setDrawColor(203, 213, 225);
    doc.line(14, y + 2, pageWidth - 14, y + 2);
    y += 7;

    doc.setFont('helvetica', 'normal');
    inventory.forEach((item) => {
      if (y > 185) {
        doc.addPage();
        y = 20;
      }
      doc.text(item.name.slice(0, 32), 14, y);
      doc.text(item.category.slice(0, 20), 80, y);
      doc.text(item.lotNumber, 125, y);
      doc.text(`${item.currentStock} ${item.unit}`, 165, y);
      doc.text(`${item.minStock} ${item.unit}`, 185, y);
      doc.text(item.expiryDate, 205, y);
      doc.text(item.storageLocation.slice(0, 24), 240, y);
      y += 6;
    });

    doc.save(`ReagenLab_Inventaris_${Date.now()}.pdf`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Nama Reagen', 'Kategori', 'Merk', 'Lot Number', 'Stok Saat Ini', 'Batas Min', 'Satuan', 'Lokasi', 'Tgl Beli', 'Tgl Kadaluwarsa', 'Status'];
    const rows = inventory.map(item => {
      const exp = new Date(item.expiryDate);
      let status = 'Aman';
      if (exp <= now) status = 'KEDALUWARSA';
      else if (exp <= thirtyDaysAhead) status = 'Mendekati Kedaluwarsa';
      else if (item.currentStock <= item.minStock) status = 'Stok Menipis';

      return [
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        `"${item.brand}"`,
        `"${item.lotNumber}"`,
        item.currentStock,
        item.minStock,
        item.unit,
        `"${item.storageLocation}"`,
        item.purchaseDate,
        item.expiryDate,
        status
      ];
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ReagenLab_Inventaris_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manajemen Inventaris Reagen
            </h1>
            {user.role === 'analis' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Akses Penuh Analis
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitoring stok, lot batch, tanggal kedaluwarsa, dan pencatatan pemakaian reagen laboratorium.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
          >
            <FileText className="w-4 h-4 text-cyan-600" />
            <span>PDF Laporan</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-sm shadow-cyan-500/20 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Reagen</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Stok Reagen vs Log Pemakaian */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('stok')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'stok'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Daftar Stok Reagen ({inventory.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'logs'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Log Pemakaian ({usageLogs.length})</span>
        </button>
      </div>

      {activeTab === 'stok' && (
        <>
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama reagen, lot batch, lokasi..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Semua Stok' },
                { id: 'low', label: 'Stok Menipis' },
                { id: 'expiring', label: 'Mendekati Kedaluwarsa' },
                { id: 'expired', label: 'Kedaluwarsa' },
                { id: 'safe', label: 'Kondisi Aman' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedFilter === f.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Table / Cards */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Nama Reagen & Kategori</th>
                    <th className="py-3 px-4">Lot / Merk</th>
                    <th className="py-3 px-4">Jumlah Stok</th>
                    <th className="py-3 px-4">Status & Kadaluwarsa</th>
                    <th className="py-3 px-4">Lokasi Penyimpanan</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Tidak ada reagen yang cocok dengan pencarian atau filter yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => {
                      const exp = new Date(item.expiryDate);
                      const isExpired = exp <= now;
                      const isExpiringSoon = !isExpired && exp <= thirtyDaysAhead;
                      const isLowStock = item.currentStock <= item.minStock;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                          {/* Name & Category */}
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                            <span className="inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {item.category}
                            </span>
                          </td>

                          {/* Lot / Brand */}
                          <td className="py-3.5 px-4">
                            <p className="font-mono text-xs text-slate-700 dark:text-slate-300">{item.lotNumber}</p>
                            <p className="text-[11px] text-slate-500">{item.brand}</p>
                          </td>

                          {/* Current Stock */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-baseline gap-1">
                              <span className={`font-mono text-sm font-bold ${
                                isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'
                              }`}>
                                {item.currentStock}
                              </span>
                              <span className="text-[11px] text-slate-500">{item.unit}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Min: {item.minStock} {item.unit}
                            </span>
                          </td>

                          {/* Status & Expiry */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              {isExpired ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                                  <AlertOctagon className="w-3 h-3" />
                                  KEDALUWARSA
                                </span>
                              ) : isExpiringSoon ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                  <Clock className="w-3 h-3" />
                                  &lt; 30 Hari
                                </span>
                              ) : isLowStock ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                  <AlertTriangle className="w-3 h-3" />
                                  Stok Menipis
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Aman
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                              Exp: {item.expiryDate}
                            </p>
                          </td>

                          {/* Location */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{item.storageLocation}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenUsage(item)}
                              title="Catat Pemakaian"
                              className="px-2.5 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 text-cyan-700 dark:text-cyan-300 font-semibold text-xs transition"
                            >
                              Catat Pakai
                            </button>
                            <button
                              onClick={() => handleQuickRestock(item)}
                              title="Tambah Stok / Restok"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                            >
                              <PlusCircle className="w-4 h-4 text-emerald-600" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              title="Edit Reagen"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
                            >
                              <Edit2 className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus reagen "${item.name}" dari inventaris?`)) {
                                  onDeleteItem(item.id);
                                }
                              }}
                              title="Hapus Reagen"
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tab: Usage Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Waktu Pemakaian</th>
                  <th className="py-3 px-4">Reagen</th>
                  <th className="py-3 px-4">Jumlah Terpakai</th>
                  <th className="py-3 px-4">Sisa Stok</th>
                  <th className="py-3 px-4">Analis / Praktikan</th>
                  <th className="py-3 px-4">Keperluan / Pemeriksaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usageLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Belum ada log riwayat pemakaian reagen.
                    </td>
                  </tr>
                ) : (
                  usageLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono text-slate-500">{log.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{log.reagentName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400">
                        -{log.amountUsed} {log.unit}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {log.remainingStockAfter} {log.unit}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{log.analystName}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{log.purpose}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Tambah / Edit Reagen */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {editingItem ? 'Edit Data Reagen' : 'Tambah Reagen Baru ke Inventaris'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Reagen / Bahan Kimia
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Contoh: Natrium Klorida (NaCl p.a)"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Reagen
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Hematologi">Hematologi</option>
                    <option value="Kimia Klinik">Kimia Klinik</option>
                    <option value="Mikrobiologi">Mikrobiologi</option>
                    <option value="Urinalisis">Urinalisis</option>
                    <option value="Asam/Basa">Asam/Basa</option>
                    <option value="Garam & Larutan Fisiologis">Garam & Larutan Fisiologis</option>
                    <option value="Pewarnaan / Staining">Pewarnaan / Staining</option>
                    <option value="Buffer">Buffer</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Produsen / Merk
                  </label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={e => setFormBrand(e.target.value)}
                    placeholder="Merck, Smart-Lab, Sigma"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lot / Batch No.
                  </label>
                  <input
                    type="text"
                    value={formLot}
                    onChange={e => setFormLot(e.target.value)}
                    placeholder="LOT-2024"
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stok Awal
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formStock}
                    onChange={e => setFormStock(e.target.value)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Batas Min. Stok
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formMinStock}
                    onChange={e => setFormMinStock(e.target.value)}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Satuan Ukur
                  </label>
                  <select
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  >
                    <option value="mL">mL</option>
                    <option value="L">Liter (L)</option>
                    <option value="g">gram (g)</option>
                    <option value="kg">kilogram (kg)</option>
                    <option value="botol">botol</option>
                    <option value="kit">kit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lokasi Penyimpanan
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={e => setFormLocation(e.target.value)}
                    placeholder="Kulkas 2-8°C, Lemari Asam"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Pembelian
                  </label>
                  <input
                    type="date"
                    value={formPurchaseDate}
                    onChange={e => setFormPurchaseDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Kedaluwarsa
                  </label>
                  <input
                    type="date"
                    required
                    value={formExpiryDate}
                    onChange={e => setFormExpiryDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Khusus / Keterangan Mutu
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Catatan kemurnian, instruksi penanganan..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-sm"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan ke Inventaris'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Catat Pemakaian Reagen */}
      {isUsageModalOpen && selectedItemForUsage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Catat Pemakaian Reagen
              </h2>
              <button
                onClick={() => setIsUsageModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmUsage} className="mt-4 space-y-3.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedItemForUsage.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Sisa Stok Saat Ini: <strong className="font-mono text-cyan-600 dark:text-cyan-400">{selectedItemForUsage.currentStock} {selectedItemForUsage.unit}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jumlah Pemakaian ({selectedItemForUsage.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={useAmount}
                  onChange={e => setUseAmount(e.target.value)}
                  max={selectedItemForUsage.currentStock}
                  className="w-full font-mono text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Analis / Praktikan
                </label>
                <input
                  type="text"
                  required
                  value={useAnalyst}
                  onChange={e => setUseAnalyst(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tujuan Penggunaan / Pemeriksaan
                </label>
                <input
                  type="text"
                  required
                  value={usePurpose}
                  onChange={e => setUsePurpose(e.target.value)}
                  placeholder="Contoh: Pemeriksaan Glukosa Darah 20 Sampel"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUsageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold shadow-sm"
                >
                  Kurangi Stok & Catat Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

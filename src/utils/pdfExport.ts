import { jsPDF } from 'jspdf';
import { CalculationHistoryItem, UserProfile } from '../types';

export function exportCalculationToPDF(item: CalculationHistoryItem, user: UserProfile): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(11, 19, 41); // Navy brand
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(6, 182, 212); // Cyan accent
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('REAGENLAB', 14, 13);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(186, 230, 253);
  doc.text('SMART CALCULATION, ACCURATE LABORATORY', 14, 19);
  doc.text('TEKNOLOGI LABORATORIUM MEDIK (TLM) & SISTEM MANAJEMEN REAGEN', 14, 24);

  // Document Code & Date
  const docDate = new Date(item.timestamp).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`TANGGAL: ${docDate}`, pageWidth - 14, 15, { align: 'right' });
  doc.text(`NO. DOKUMEN: RL-TLM-${item.id.toUpperCase().slice(0, 10)}`, pageWidth - 14, 21, { align: 'right' });

  y = 38;

  // Document Subject
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('LEMBAR HASIL PERHITUNGAN REAGEN LABORATORIUM', 14, y);

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Modul: ${item.title}  |  Jenis Akun: ${user.role === 'analis' ? 'Analis Laboratorium' : 'Mahasiswa TLM'}`, 14, y);

  y += 8;

  // User Profile Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Informasi Praktikan / Analis:', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Nama: ${user.name}`, 18, y + 12);
  doc.text(`NIM/NIP: ${user.nimOrNip || '-'}`, 18, y + 16);
  doc.text(`Institusi: ${user.institution}`, 110, y + 12);
  doc.text(`Email: ${user.email}`, 110, y + 16);

  y += 26;

  // Result Highlight Card
  doc.setFillColor(236, 254, 255); // Cyan-50
  doc.setDrawColor(6, 182, 212);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setTextColor(14, 116, 144);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('HASIL AKHIR PERHITUNGAN:', 18, y + 6);

  doc.setFontSize(16);
  doc.setTextColor(11, 19, 41);
  doc.text(`${item.result.primaryResult} ${item.result.primaryUnit}`, 18, y + 15);

  if (item.result.secondaryResults && item.result.secondaryResults.length > 0) {
    const secTexts = item.result.secondaryResults.map(s => `${s.label}: ${s.value} ${s.unit || ''}`).join('  |  ');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(secTexts, 18, y + 19);
  }

  y += 28;

  // Formula Section
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Rumus yang Digunakan:', 14, y);

  y += 5;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 10, 1.5, 1.5, 'FD');
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(item.result.formula, 18, y + 6.5);

  y += 16;

  // Input Parameters
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Data Parameter Input:', 14, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const inputEntries = Object.entries(item.inputs);
  for (const [key, val] of inputEntries) {
    doc.text(`• ${key}: ${String(val)}`, 18, y);
    y += 5;
  }

  y += 3;

  // Step-by-Step Calculation Steps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Tahapan & Proses Perhitungan:', 14, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  for (const step of item.result.steps) {
    const splitText = doc.splitTextToSize(step, pageWidth - 32);
    doc.text(splitText, 18, y);
    y += splitText.length * 4.5;
  }

  y += 3;

  // Procedure / Notes
  if (item.result.notes && item.result.notes.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Instruksi Preparasi Laboratorium:', 14, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);

    for (const note of item.result.notes) {
      const splitNote = doc.splitTextToSize(`- ${note}`, pageWidth - 32);
      doc.text(splitNote, 18, y);
      y += splitNote.length * 4.2;
    }
  }

  // Safety Notice
  if (item.result.safetyNotice) {
    y += 3;
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(248, 113, 113);
    doc.roundedRect(14, y, pageWidth - 28, 10, 1.5, 1.5, 'FD');
    doc.setTextColor(153, 27, 27);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`Peringatan K3: ${item.result.safetyNotice}`, 18, y + 6);
    y += 14;
  }

  // Signatures at Bottom
  const bottomY = Math.max(y + 10, 245);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  doc.text('Praktikan / Analis Pelaksana,', 30, bottomY);
  doc.line(25, bottomY + 20, 75, bottomY + 20);
  doc.text(`( ${user.name} )`, 30, bottomY + 24);

  doc.text('Dosen / Penanggung Jawab Lab,', pageWidth - 80, bottomY);
  doc.line(pageWidth - 85, bottomY + 20, pageWidth - 25, bottomY + 20);
  doc.text('( .................................................. )', pageWidth - 80, bottomY + 24);

  // Footer Disclaimer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Dokumen ini dicetak secara otomatis dari ReagenLab – Smart Reagent Calculator & Laboratory Management System.', 14, 288);
  doc.text('Halaman 1 / 1', pageWidth - 14, 288, { align: 'right' });

  // Save PDF
  const filename = `ReagenLab_${item.type}_${Date.now()}.pdf`;
  doc.save(filename);
}

export function exportHistoryToCSV(history: CalculationHistoryItem[]): void {
  if (!history || history.length === 0) return;

  const headers = ['ID', 'Tanggal', 'Judul', 'Tipe', 'Hasil Utama', 'Satuan', 'Rumus'];
  const rows = history.map(h => [
    h.id,
    new Date(h.timestamp).toISOString(),
    `"${h.title.replace(/"/g, '""')}"`,
    h.type,
    `"${h.result.primaryResult}"`,
    h.result.primaryUnit,
    `"${h.result.formula.replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ReagenLab_Riwayat_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

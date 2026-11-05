import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ReagenLab API',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// ReagenLab AI Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory, context } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const systemInstruction = `Anda adalah "ReagenLab AI", asisten kecerdasan buatan laboratorium kimia & Teknologi Laboratorium Medik (TLM) yang handal, santun, ilmiah, dan teliti.
Misi Anda:
1. Membantu mahasiswa TLM dan analis laboratorium memahami dan memeriksa perhitungan larutan (molaritas, normalitas, pengenceran C1V1=C2V2, serial dilution, konsentrasi persen %b/v, %v/v, %b/b, dan kebutuhan reagen).
2. Memberikan penjelasan bertahap (langkah demi langkah) yang mudah dipahami, menampilkan rumus kimia dan matematis secara terstruktur.
3. Selalu memperhatikan keselamatan kerja laboratorium (K3 / APD) serta penanganan bahan berbahaya (simbol GHS, asam pekat, karsinogen, higroskopis, eksotermik).
4. Tidak mengarang referensi ilmiah. Jika informasi atau data tidak lengkap (misalnya massa jenis atau kemurnian asam pekat komersial belum disebutkan), nyatakan dengan jelas sebagai asumsi atau minta pengguna melengkapi data.
5. Gunakan Bahasa Indonesia profesional, komunikatif, dan ramah laboratorium.
${context ? `Konteks kerja aktif saat ini: ${JSON.stringify(context)}` : ''}`;

    if (!apiKey) {
      // Offline / Key-less fallback with rich guidance
      const query = message.toLowerCase();
      let answer = '';

      if (query.includes('molaritas') || query.includes('molar') || query.includes('mol/l')) {
        answer = `### 🧪 Penjelasan Molaritas (M)
Molaritas adalah jumlah mol zat terlarut dalam 1 Liter larutan.
**Rumus Utama:**
$$M = \\frac{n}{V} = \\frac{m}{\\text{Mr} \\times V_{(L)}}$$
Atau jika volume dalam mililiter (mL):
$$m (\\text{gram}) = \\frac{M \\times \\text{Mr} \\times V_{(mL)}}{1000}$$

Jika bahan memiliki kemurnian ($P\\% < 100\\%$):
$$m_{\\text{aktual}} = \\frac{m_{\\text{teoritis}}}{P / 100}$$

⚠️ *Tips Analis:* Selalu larutkan zat terlarut dalam sebagian kecil aquades terlebih dahulu di beaker glass, aduk hingga larut sempurna dan suhu kembali ke suhu ruang, baru pindahkan ke labu ukur lalu tera hingga tanda batas.`;
      } else if (query.includes('pengenceran') || query.includes('c1v1') || query.includes('v1')) {
        answer = `### 💧 Penjelasan Pengenceran Larutan
Pengenceran larutan mengikuti prinsip kekekalan jumlah mol/ekuivalen zat terlarut.
**Rumus Rumus Umum:**
$$C_1 \\times V_1 = C_2 \\times V_2$$
- $C_1$: Konsentrasi larutan stok (awal)
- $V_1$: Volume larutan stok yang dipipet
- $C_2$: Konsentrasi target (akhir)
- $V_2$: Volume akhir larutan yang ingin dibuat

**Volume Pelarut (Aquades):**
$$V_{\\text{pelarut}} = V_2 - V_1$$
**Faktor Pengenceran (FP):**
$$\\text{FP} = \\frac{V_2}{V_1} = \\frac{C_1}{C_2}$$

⚠️ *Peringatan K3:* Jika mengencerkan asam pekat (seperti $H_2SO_4$ atau $HCl$), **SELALU tuangkan asam ke dalam air (Air Asam / AAA)** secara perlahan melalui dinding kaca sambil diaduk, **JANGAN PERNAH** menuangkan air ke dalam asam pekat karena reaksi sangat eksotermik dan dapat memercik!`;
      } else if (query.includes('normalitas') || query.includes('ekuivalen') || query.includes('valensi')) {
        answer = `### ⚖️ Penjelasan Normalitas (N)
Normalitas adalah jumlah grek (gram ekuivalen) zat terlarut dalam 1 Liter larutan.
**Rumus:**
$$N = M \\times n$$
$$m (\\text{gram}) = N \\times \\text{BE} \\times V_{(L)}$$
Di mana:
- $\\text{BE} = \\frac{\\text{Mr}}{n}$ (Berat Ekuivalen)
- $n$ adalah valensi (faktor ekuivalen):
  - Asam: jumlah ion $H^+$ yang dilepaskan (cth: $HCl \\rightarrow n=1$, $H_2SO_4 \\rightarrow n=2$)
  - Basa: jumlah ion $OH^-$ yang dilepaskan (cth: $NaOH \\rightarrow n=1$, $Ca(OH)_2 \\rightarrow n=2$)
  - Redoks: jumlah elektron yang ditransfer (cth: $KMnO_4$ dalam asam $\\rightarrow n=5$)`;
      } else if (query.includes('persen') || query.includes('%')) {
        answer = `### 📊 Konsentrasi Persen Laboratorium
Ada 3 jenis konsentrasi persen yang lazim digunakan dalam TLM:
1. **% Berat per Volume (% b/v):** gram zat per 100 mL larutan.
   $$m (\\text{gram}) = \\frac{\\% \\text{ b/v} \\times V_{(mL)}}{100}$$
   *Contoh:* NaCl 0.9% dalam 100 mL = 0.9 gram NaCl diencerkan hingga 100 mL.
2. **% Volume per Volume (% v/v):** mL zat per 100 mL larutan.
   $$V_{\\text{zat}} (mL) = \\frac{\\% \\text{ v/v} \\times V_{(mL)}}{100}$$
   *Contoh:* Alkohol 70% dalam 500 mL = 350 mL etanol absolut + aquades hingga 500 mL.
3. **% Berat per Berat (% b/b):** gram zat per 100 gram campuran.
   $$m_{\\text{zat}} = \\frac{\\% \\text{ b/b} \\times m_{\\text{total}}}{100}$$`;
      } else {
        answer = `Halo! Saya **ReagenLab AI**, asisten laboratorium kimia & TLM Anda. 

Saya siap membantu Anda dengan:
- Perhitungan penimbangan larutan & koreksi kemurnian
- Perhitungan pengenceran stok ($C_1 V_1 = C_2 V_2$) dan pengenceran bertingkat (*serial dilution*)
- Konversi Normalitas, Molaritas, & Persen Konsentrasi
- Penentuan volume reagen pemeriksaan untuk $N$ sampel dengan safety margin
- Prosedur preparasi larutan standar dan reagen kerja
- Keselamatan kerja (MSDS & GHS)

Silakan ajukan pertanyaan atau berikan data perhitungan larutan yang sedang Anda kerjakan!`;
      }

      res.json({
        reply: answer,
        provider: 'built-in-lab-engine',
        notice: 'API key Gemini belum terpasang di Secrets, menggunakan modul komputasi kimia ReagenLab AI offline. Untuk kemampuan percakapan Gemini tingkat lanjut, pasang GEMINI_API_KEY di Secrets.'
      });
      return;
    }

    // Call Gemini API using @google/genai SDK
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build chat or single generation with history
    let contents: any[] = [];

    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const item of conversationHistory.slice(-8)) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.content || item.text || '' }]
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const replyText = response.text || 'Maaf, saya tidak dapat menghasilkan respon.';
    res.json({
      reply: replyText,
      provider: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.warn('Gemini API call failed, falling back to ReagenLab chemical knowledge engine:', error?.message);
    const query = (req.body?.message || '').toLowerCase();
    let fallback = '';

    if (query.includes('nacl') || query.includes('0,9%') || query.includes('0.9%') || query.includes('persen')) {
      fallback = `### 🧪 Prosedur Pembuatan Larutan NaCl 0,9% (b/v) Fisiologis (100 mL)

**1. Dasar Teori & Perhitungan:**
Konsentrasi % (b/v) menyatakan gram zat terlarut dalam 100 mL larutan akhir.
$$m (\\text{gram}) = \\frac{\\% (b/v) \\times V_{(mL)}}{100} = \\frac{0,9 \\times 100}{100} = 0,9000\\text{ gram}$$
Massa padatan NaCl murni yang harus ditimbang adalah **0,9000 gram**.

**2. Alat & Bahan:**
- Neraca analitik (ketelitian 0,1 mg) & perahu timbang / kaca arloji
- Beaker glass 50 mL & batang pengaduk kaca
- Labu ukur 100 mL berkalibrasi
- Corong kaca & botol semprot berisi Aquades
- Padatan NaCl pro-analisis (p.a)

**3. Langkah Kerja Bertahap:**
1. Timbang tepat 0,9000 gram NaCl pada neraca analitik.
2. Masukkan ke dalam beaker glass, tambahkan sekitar 40–50 mL aquades, aduk hingga seluruh kristal larut homogen.
3. Tuangkan larutan melalui corong kaca ke dalam labu ukur 100 mL.
4. Bilas beaker glass dan batang pengaduk dengan sedikit aquades 2–3 kali, lalu masukkan air bilasan ke dalam labu ukur.
5. Tambahkan aquades hingga mendekati tanda batas kalibrasi.
6. Gunakan pipet tetes untuk menambahkan tetes demi tetes sampai cekungan meniskus bawah tepat menyentuh garis tanda tera 100 mL.
7. Pasang tutup labu ukur, pegang tutupnya erat, lalu homogenkan dengan membalikkan labu ukur 10–12 kali.
8. Pindahkan ke botol reagen bersih dan tempelkan etiket/label bertuliskan: **NaCl 0,9% Fisiologis**, tanggal pembuatan, dan nama pembuat.`;
    } else if (query.includes('molaritas') || query.includes('molar') || query.includes('mr')) {
      fallback = `### 🧪 Penjelasan & Rumus Molaritas (M)
Molaritas adalah jumlah mol zat terlarut dalam 1 Liter larutan.
$$M = \\frac{n}{V_{(L)}} = \\frac{\\text{massa}}{\\text{Mr} \\times V_{(L)}}$$
Massa yang harus ditimbang:
$$m (\\text{gram}) = M \\times \\text{Mr} \\times V_{(L)}$$
Jika bahan memiliki kadar kemurnian ($P\\% < 100\\%$):
$$m_{\\text{aktual}} = \\frac{m_{\\text{teoritis}}}{P / 100}$$

Contoh untuk 250 mL NaCl 0,1 M (Mr 58,44 g/mol):
$$m = 0,1 \\times 58,44 \\times 0,25 = 1,4610\\text{ gram NaCl}$$`;
    } else if (query.includes('h2so4') || query.includes('asam sulfat') || query.includes('pengenceran')) {
      fallback = `### 💧 Penjelasan Pengenceran & Aturan K3 Asam Pekat
Rumus Pengenceran:
$$C_1 \\times V_1 = C_2 \\times V_2$$
- $V_1$ (volume stok) = $(C_2 \\times V_2) / C_1$
- Volume pelarut = $V_2 - V_1$

⚠️ **Aturan Keselamatan K3 (Sangat Penting):**
Saat mengencerkan asam sulfat pekat ($H_2SO_4$ 98%), **SELALU tuangkan asam ke dalam air (Air Asam Alirkan / AAA)** secara perlahan melalui dinding wadah sambil diaduk. Jangan pernah menuangkan air ke dalam asam pekat karena hidrasi asam sulfat sangat eksotermik dan akan menimbulkan letupan uap asam berbahaya!`;
    } else {
      fallback = `### 🔬 Asisten Laboratorium ReagenLab
Permintaan Anda telah diproses melalui modul referensi stoikiometri laboratorium ReagenLab.
- Untuk perhitungan penimbangan larutan padat, gunakan menu **Kalkulator Molaritas** ($m = M \\times \\text{Mr} \\times V$).
- Untuk pengenceran larutan pekat, gunakan menu **Kalkulator Pengenceran** ($C_1 V_1 = C_2 V_2$).
- Untuk larutan persentase, gunakan menu **Persen (% b/v, % v/v, % b/b)**.
- Untuk titrasi dan berat ekuivalen, gunakan menu **Normalitas** ($N = M \\times n$).

Silakan ajukan pertanyaan spesifik mengenai prosedur larutan atau praktikum TLM!`;
    }

    res.json({
      reply: fallback,
      provider: 'reagenlab-local-engine',
      notice: 'Respon disajikan via mesin pengetahuan kimia ReagenLab lokal karena koneksi model eksternal sedang mengalami beban tinggi sementara.'
    });
  }
});

// Vite or Static file serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const server = http.createServer(app);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`ReagenLab Server listening on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

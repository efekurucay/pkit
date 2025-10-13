# PromptKit - Proje Özeti

## 📋 Proje Açıklaması
WhatsApp/Telegram benzeri arayüze sahip, tamamen local çalışan bir prompt yönetimi ve clipboard geçmişi uygulaması.

## 🏗️ Mimari

### Frontend (React)
- **Lokasyon:** `src/` klasörü
- **Ana Bileşenler:**
  - `App.js` - Ana uygulama bileşeni
  - `components/Header.js` - Üst bar (arama, view toggle)
  - `components/Sidebar.js` - Sol panel (klasör ağacı)
  - `components/PromptList.js` - Orta panel (prompt listesi)
  - `components/PromptEditor.js` - Sağ panel (prompt düzenleme)
  - `components/ClipboardPanel.js` - Clipboard geçmişi görünümü

### Backend (Electron Main Process)
- **Lokasyon:** `src/main/` klasörü
- **Modüller:**
  - `main.js` - Electron ana process, pencere yönetimi, IPC handlers
  - `database.js` - SQLite database yönetimi (sql.js kullanarak)
  - `clipboard.js` - Clipboard izleme servisi
  - `preload.js` - Güvenli IPC köprüsü (contextBridge)

### Database (SQLite)
- **Kütüphane:** sql.js (WebAssembly SQLite)
- **Lokasyon:** `%APPDATA%\prompt-kit\promptkit.db`
- **Tablolar:**
  - `folders` - Klasör hiyerarşisi
  - `prompts` - Prompt verileri
  - `clipboard_history` - Clipboard geçmişi
  - `settings` - Uygulama ayarları

## 🎨 Özellikler

### Prompt Yönetimi
- ✅ Prompt oluşturma, düzenleme, silme
- ✅ Klasör/alt klasör organizasyonu
- ✅ Favorilere ekleme
- ✅ Arama ve filtreleme
- ✅ Klasörlere renk atama
- ✅ Otomatik kaydetme

### Clipboard Geçmişi
- ✅ Otomatik clipboard izleme (500ms interval)
- ✅ Tarih bazlı gruplandırma
- ✅ Tekrar kopyalama
- ✅ Arama
- ✅ Duplicate kontrolü (opsiyonel)
- ✅ Maksimum öğe limiti (varsayılan: 1000)

### UI/UX
- ✅ WhatsApp/Telegram benzeri 3-panel layout
- ✅ Modern, temiz tasarım
- ✅ Responsive bileşenler
- ✅ Context menu (sağ tık menüsü)
- ✅ Keyboard shortcuts hazır altyapı
- ✅ Dark mode hazır altyapı (CSS değişkenleri ile kolayca eklenebilir)

## 📦 Teknoloji Stack

### Dependencies
```json
{
  "sql.js": "^1.10.3",           // SQLite database
  "react": "^18.2.0",             // UI framework
  "react-dom": "^18.2.0",         // React DOM renderer
  "lucide-react": "^0.263.1"      // Icon library
}
```

### Dev Dependencies
```json
{
  "electron": "^28.1.0",          // Desktop framework
  "electron-builder": "^24.9.1",  // Build & packaging
  "concurrently": "^8.2.2",       // Paralel script çalıştırma
  "wait-on": "^7.2.0",            // Port hazır olana kadar bekleme
  "cross-env": "^7.0.3",          // Cross-platform env variables
  "react-scripts": "5.0.1"        // React build tools
}
```

## 🚀 Çalıştırma

### Geliştirme Modu
```bash
npm start
```

### Manuel Başlatma
```bash
# Terminal 1
npm run start:react

# Terminal 2 (React server başladıktan sonra)
set ELECTRON_START_URL=http://localhost:3000
npx electron .
```

### Production Build
```bash
npm run build
npm run build:electron
```

## 📁 Proje Yapısı
```
pkit/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.js          # Ana Electron dosyası
│   │   ├── database.js      # Database yönetimi
│   │   ├── clipboard.js     # Clipboard izleme
│   │   └── preload.js       # IPC köprüsü
│   ├── components/          # React bileşenleri
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   ├── PromptList.js
│   │   ├── PromptEditor.js
│   │   └── ClipboardPanel.js
│   ├── App.js              # Ana React bileşeni
│   ├── App.css
│   ├── index.js            # React entry point
│   └── index.css
├── public/
│   └── index.html          # HTML template
├── package.json
├── .gitignore
├── README.md
├── NASIL_CALISTIRILIR.md
└── PROJE_OZETI.md
```

## 🔧 Yapılandırma

### Electron Main Process
- **Window boyutu:** 1400x900 (min: 1000x600)
- **Context isolation:** Aktif (güvenlik için)
- **Node integration:** Devre dışı (güvenlik için)
- **Preload script:** Güvenli IPC için

### Database
- **Format:** SQLite (sql.js)
- **Persistence:** File-based
- **Auto-save:** Her işlemden sonra
- **Indexes:** Performans için optimize edilmiş

### Clipboard Monitor
- **Check interval:** 500ms
- **Max content size:** 100KB
- **Duplicate check:** Aktif
- **Max items:** 1000 (ayarlanabilir)

## 🐛 Bilinen Sorunlar ve Çözümler

### Beyaz Ekran
**Neden:** React dev server henüz hazır değil
**Çözüm:** 10-15 saniye bekleyin veya manuel başlatma yapın

### Port 3000 Kullanımda
**Çözüm:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Hatası
**Çözüm:** `%APPDATA%\prompt-kit` klasörünü silin ve yeniden başlatın

## 🔮 Gelecek Geliştirmeler

### Planlanan Özellikler
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Export/Import (JSON, Markdown)
- [ ] Tag sistemi
- [ ] Prompt versiyonlama
- [ ] Clipboard image desteği
- [ ] Global hotkey (overlay açma)
- [ ] Prompt templates
- [ ] AI entegrasyonu (opsiyonel)
- [ ] Cloud sync (opsiyonel)

### Teknik İyileştirmeler
- [ ] TypeScript migration
- [ ] Unit tests
- [ ] E2E tests (Playwright)
- [ ] Performance optimization
- [ ] Memory leak kontrolü
- [ ] Auto-update mekanizması

## 📝 Notlar

- Uygulama tamamen offline çalışır
- Hiçbir veri dışarı gönderilmez
- Database dosyası kullanıcının bilgisayarında saklanır
- Clipboard izleme arka planda çalışır
- Tüm işlemler local'de gerçekleşir

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License - İstediğiniz gibi kullanabilirsiniz!

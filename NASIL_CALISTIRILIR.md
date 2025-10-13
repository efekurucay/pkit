# PromptKit - Nasıl Çalıştırılır?

## Hızlı Başlangıç

### Yöntem 1: Otomatik Başlatma (Önerilen)
```bash
npm start
```

Bu komut hem React dev server'ını hem de Electron uygulamasını otomatik olarak başlatır.

### Yöntem 2: Manuel Başlatma (Sorun Yaşarsanız)

**Adım 1:** İlk terminalde React dev server'ı başlatın:
```bash
npm run start:react
```

**Adım 2:** React server başladıktan sonra (yaklaşık 10-15 saniye), ikinci bir terminalde Electron'u başlatın:
```bash
set ELECTRON_START_URL=http://localhost:3000
electron .
```

### Yöntem 3: Batch Dosyası ile (Windows)
```bash
start.bat
```

## Sorun Giderme

### Beyaz Ekran Sorunu
Eğer uygulama açıldığında beyaz ekran görüyorsanız:

1. **DevTools'u açın** (Electron penceresi açıkken `Ctrl+Shift+I` veya `F12`)
2. **Console** sekmesine bakın
3. Hataları kontrol edin

**Olası Nedenler:**
- React dev server henüz başlamamış olabilir (10-15 saniye bekleyin)
- Port 3000 başka bir uygulama tarafından kullanılıyor olabilir
- Electron API yüklenememiş olabilir

### Port 3000 Kullanımda Hatası
Eğer "Port 3000 is already in use" hatası alıyorsanız:

```bash
# Windows'ta port 3000'i kullanan process'i bulun
netstat -ano | findstr :3000

# Process'i sonlandırın (PID numarasını yukarıdaki komuttan alın)
taskkill /PID <PID_NUMARASI> /F
```

### Database Hatası
Eğer database ile ilgili hata alıyorsanız:

1. Uygulamayı kapatın
2. `%APPDATA%\prompt-kit` klasörünü silin
3. Uygulamayı yeniden başlatın

## Geliştirme Notları

- **Hot Reload:** React kodunda yaptığınız değişiklikler otomatik olarak yansır
- **Electron Restart:** Electron main process'te (src/main/) değişiklik yaptıysanız uygulamayı yeniden başlatmanız gerekir
- **Database Konumu:** `%APPDATA%\prompt-kit\promptkit.db`
- **DevTools:** Electron penceresi açıkken `Ctrl+Shift+I` ile açılır

## Özellikler

✅ Prompt yönetimi (oluşturma, düzenleme, silme)
✅ Klasör/alt klasör hiyerarşisi
✅ Otomatik clipboard izleme
✅ Arama ve filtreleme
✅ Favorilere ekleme
✅ Tamamen local çalışma (internet gerektirmez)

## Teknik Detaylar

- **Frontend:** React 18
- **Desktop:** Electron 28
- **Database:** SQLite (sql.js)
- **Icons:** Lucide React
- **Styling:** Custom CSS

## Yardım

Sorun yaşıyorsanız:
1. DevTools console'u kontrol edin
2. Terminal çıktılarını okuyun
3. `npm install` komutunu tekrar çalıştırın
4. node_modules klasörünü silip tekrar `npm install` yapın

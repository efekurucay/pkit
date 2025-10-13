# PromptKit v1.0.0 - Kullanım Kılavuzu

## 🎉 Kurulum Tamamlandı!

PromptKit başarıyla paketlendi. `dist/` klasöründe 2 farklı .exe dosyası bulunuyor:

### 📦 Paket Türleri

#### 1. PromptKit-1.0.0-x64.exe (Kurulum Paketi)
- **Boyut:** ~79 MB
- **Özellikler:**
  - Tam kurulum sihirbazı
  - Masaüstü kısayolu
  - Başlat menüsü kısayolu
  - Kaldırma programı
  - Otomatik güncellemeler (gelecekte)

**Kurulum:**
1. `PromptKit-1.0.0-x64.exe` dosyasını çalıştır
2. Kurulum dizinini seç (varsayılan: C:\Program Files\PromptKit)
3. "Masaüstü kısayolu oluştur" seçeneğini işaretle
4. "Kur" butonuna tıkla
5. Kurulum tamamlandığında "Bitir" ve "Çalıştır"

#### 2. PromptKit-1.0.0-Portable.exe (Taşınabilir)
- **Boyut:** ~79 MB
- **Özellikler:**
  - Kurulum gerektirmez
  - USB'den çalıştırılabilir
  - Kayıt defterine yazmaz
  - Sistem temiz kalır

**Kullanım:**
1. Dosyayı istediğin klasöre kopyala
2. Direkt çift tıkla ve çalıştır
3. Veritabanı aynı klasörde oluşturulur

## 🚀 İlk Çalıştırma

1. Uygulama açıldığında boş bir ekran göreceksin
2. Sol panelde "+" butonuna tıklayarak klasör oluştur
3. Orta panelde "Yeni Prompt" ile prompt ekle
4. Clipboard otomatik olarak izlenmeye başlar

## 📋 Özellikler

### Prompt Yönetimi
- **Klasör Oluşturma:** Sol panelde "+" butonu
- **Prompt Ekleme:** Orta panelde "Yeni Prompt"
- **Düzenleme:** Prompt'a tıkla, sağ panelde düzenle
- **Silme:** Sağ tık → Sil
- **Favorilere Ekleme:** ⭐ butonuna tıkla
- **Arama:** Üst bardaki arama kutusunu kullan

### Clipboard Geçmişi
- **Görüntüleme:** Üst bardaki "Clipboard" sekmesine tıkla
- **Kopyalama:** Herhangi bir öğeye tıkla
- **Otomatik İzleme:** Arka planda sürekli çalışır
- **Tarih Gruplandırma:** Bugün, Dün, Bu Hafta, vb.

### System Tray (Arka Plan)
- **Minimize:** Pencereyi kapat → Tray'e gider
- **Tekrar Aç:** Tray icon'a tıkla
- **Tamamen Kapat:** Tray → Sağ tık → Çıkış

## ⌨️ Klavye Kısayolları (Gelecekte)

- `Ctrl + N` - Yeni Prompt
- `Ctrl + F` - Arama
- `Ctrl + S` - Kaydet
- `Ctrl + W` - Pencereyi Gizle
- `Ctrl + Q` - Çıkış

## 🔧 Ayarlar

### Clipboard Ayarları
- **Maksimum Öğe:** 1000 (varsayılan)
- **Duplicate Kontrolü:** Aktif
- **Otomatik İzleme:** Aktif

### Veritabanı
- **Konum:** `%APPDATA%\prompt-kit\promptkit.db`
- **Yedekleme:** Manuel (dosyayı kopyala)
- **Sıfırlama:** Dosyayı sil, yeniden başlat

## 🐛 Sorun Giderme

### Uygulama Açılmıyor
1. Windows Defender'ı kontrol et
2. Antivirüs yazılımını kontrol et
3. Yönetici olarak çalıştırmayı dene

### Clipboard İzlenmiyor
1. Ayarlardan clipboard izlemeyi kontrol et
2. Uygulamayı yeniden başlat
3. Windows clipboard iznini kontrol et

### Veritabanı Hatası
1. Uygulamayı kapat
2. `%APPDATA%\prompt-kit` klasörünü sil
3. Uygulamayı yeniden başlat

## 📊 Performans

- **RAM Kullanımı:** ~80 MB
- **CPU (idle):** ~0.5%
- **Disk Kullanımı:** ~100 MB
- **Başlangıç Süresi:** ~2 saniye

## 🔐 Güvenlik

- ✅ Tamamen local çalışır
- ✅ İnternet bağlantısı gerektirmez
- ✅ Hiçbir veri dışarı gönderilmez
- ✅ Tüm veriler bilgisayarında saklanır
- ✅ Şifreleme yok (local olduğu için)

## 📝 Lisans

MIT License - Özgürce kullanabilirsin!

## 🆘 Destek

Sorun yaşarsan:
1. DevTools'u aç (F12)
2. Console sekmesindeki hataları kontrol et
3. GitHub'da issue aç (eğer varsa)

## 🎯 Gelecek Özellikler

- [ ] Dark mode
- [ ] Global hotkey (Ctrl+Shift+P)
- [ ] Export/Import
- [ ] Cloud sync (opsiyonel)
- [ ] AI entegrasyonu
- [ ] Clipboard image desteği
- [ ] Otomatik güncelleme

## 🚀 Hızlı Başlangıç

```
1. .exe dosyasını çalıştır
2. İlk klasörünü oluştur
3. İlk prompt'unu ekle
4. Clipboard otomatik izlenmeye başlar
5. Tray icon'dan kontrol et
```

**Keyifli kullanımlar!** 🎉

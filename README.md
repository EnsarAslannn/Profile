# Profile

Ensar Aslan'ın kişisel portfolyo sitesi. Hakkımda, Projeler, Özgeçmiş, Stacks ve İletişim bölümlerini tek sayfada sunar; her projenin ayrıca kendi detay sayfası vardır.

**Canlı:** https://ensaraslan.vercel.app

---

## İçindekiler

- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Kurulum](#kurulum)
- [Komutlar](#komutlar)
- [Proje Yapısı](#proje-yapısı)
- [Sayfalar ve Bölümler](#sayfalar-ve-bölümler)
- [Öne Çıkan Teknik Kararlar](#öne-çıkan-teknik-kararlar)
- [Testler](#testler)
- [Görsel İşleme](#görsel-i̇şleme)
- [Dağıtım](#dağıtım)

---

## Kullanılan Teknolojiler

| Alan | Teknoloji |
| --- | --- |
| Derleyici / paketleyici | Vite 8 |
| Arayüz | React 19, TypeScript 6 |
| Stil | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Yönlendirme | React Router 7 |
| Test | Vitest 4, React Testing Library, jsdom |
| Lint | oxlint |
| Görsel işleme | sharp |
| Dağıtım | Vercel |

Bilinçli olarak **kurulmayan** paketler de kararın bir parçası. Sitede animasyon kütüphanesi (`framer-motion` / `motion`) ve ikon paketi (`lucide-react`) yok. Kayan şeritler, hero galerisi ve her bölümün açılış animasyonu düz CSS ile yazıldı; ikonların tamamı `src/components/icons/` altındaki inline SVG'ler.

---

## Kurulum

```bash
git clone https://github.com/EnsarAslannn/Profile.git
cd Profile
npm install
npm run dev          # http://localhost:5173
```

Node ^20.19.0 veya >=22.12.0 gerekir (Vite 8'in kendi gereksinimi).

---

## Komutlar

```bash
npm run dev          # geliştirme sunucusu
npm run build        # tsc -b (tip kontrolü) && vite build
npm run preview      # üretim derlemesini yerelde sun
npm run lint         # oxlint
npm test             # vitest run (tek geçiş)
npm run test:watch   # vitest izleme modu
npx tsc -b           # paketlemeden yalnızca tip kontrolü
```

Tek bir test dosyası veya tek bir test çalıştırmak için:

```bash
npx vitest run src/components/Hero.test.tsx
npx vitest run -t "renders the heading"
```

---

## Proje Yapısı

```
src/
  components/        arayüz bileşenleri, her biri kendi testiyle
    icons/           inline SVG ikonlar
    ui/              yeniden kullanılabilir arayüz parçaları (GlowButton)
  data/              sahibine ait tüm içerik (metinler, projeler, özgeçmiş)
    projects/        her proje kendi dosyasında, index.ts ile toplanır
  lib/               düzen sabitleri, meta yardımcıları, useReveal
  pages/             HomePage, AboutPage, ProjectDetailPage
  assets/            görseller (WebP) ve marka logoları
  test/              ortak test kurulumu ve router yardımcısı
scripts/
  optimize-images.mjs  proje ekran görüntülerini WebP'ye çevirir
public/
  EnsarAslanCV.pdf   hero'daki "CV indir" butonunun sunduğu dosya
  favicon.svg
```

İçerik ile sunum ayrı tutulur. Metinler, proje açıklamaları, özgeçmiş kayıtları ve iletişim satırları `src/data/` altında yaşar; bileşenler bu veriyi `.map()` ile basar. Aynı veriyi birden fazla yer kullandığı için bu ayrım gerçek bir işe yarar — örneğin sayfa meta açıklaması `ABOUT_PARAGRAPHS`'tan, kayan şeritteki teknoloji isimleri `SKILL_GROUPS`'tan türetilir, elle ikinci kez yazılmaz.

---

## Sayfalar ve Bölümler

| Rota | İçerik |
| --- | --- |
| `/` | Hero, Hakkımda, Projeler, Özgeçmiş, Stacks, İletişim |
| `/hakkimda` | Hakkımda metninin tamamı ve profil kartı |
| `/projects/:slug` | Proje detayı — kapak, canlı demo, teknoloji listesi, açıklama ve altyazılı ekran görüntüleri |
| diğer | `/` adresine yönlendirilir |

Ana sayfadaki bölüm sırasının tek kaynağı `src/data/navigation.ts` içindeki `NAV_LINKS`. Bir bölüm eklemek iki düzenleme ister: `HomePage.tsx` içinde basmak ve `NAV_LINKS`'e çapasını eklemek. `src/App.test.tsx` sayfada basılan bölüm kimliklerinin `NAV_LINKS` çapalarıyla **sırasıyla** aynı olduğunu doğrular, böylece ikisi sessizce ayrışamaz.

Proje eklemek ise navigasyona dokunmaz: `src/data/projects/` altına bir dosya eklenip `PROJECT_INPUTS`'a kaydedilir, `/projects/:slug` rotası dinamik olduğu için gerisi kendiliğinden çalışır.

---

## Öne Çıkan Teknik Kararlar

### Rol adlı renk belirteçleri

Palet `src/index.css` içinde `@theme` belirteçleri olarak tanımlı ve isimler role göre verildi — `surface-*`, `line-*`, `ink-*`, `accent-*`, `focus`, `backdrop-*` — literal renge göre değil. Hiçbir bileşende `bg-blue-600` gibi bir sınıf yok. Pratik faydası şu: paletin tamamını değiştirmek tek dosyalık bir düzenleme, tüm bileşenlere yayılan bir göç değil.

### Ölçülen kontrast

Metin kontrastı tahmin edilmiyor, ölçülüyor. Sayfanın ilk ekranında zemin düz bir renk değil (üstte yumuşak bir gradyan var), bu yüzden metinler gradyanın **iki ucuna karşı** da ölçülür. Fotoğraf üzerine yazı gelen özgeçmiş kartlarında ise gerçek piksel taraması yapılır — bir CSS aracı arka plandaki görseli göremez, yalnızca `background-color`'a bakar.

### Kaydırmada beliriş — gözlemci değil, tarama

Bölümler görünür alana girdikçe belirir. Bunu bir `IntersectionObserver` yapmıyor, ve bu bilinçli: gözlemci yalnızca kesişim **durumu değiştiğinde** tetiklenir. Sayfanın tepesinden dibine tek karede atlandığında (navigasyon bağlantısı, End tuşu, hızlı kaydırma) aradaki her şey ekranla hiç kesişmeden geçer ve geri çağrı hiç çalışmaz. Bunun yerine `src/lib/useReveal.ts` "bu öğeye ulaşıldı mı?" sorusunu soran, tek bir animasyon karesinde toplanan pasif bir tarama kullanır.

### Türkçe belgede İngilizce metin

Belge `lang="tr"`. CSS `text-transform: uppercase` yerel ayara duyarlıdır ve Türkçede `i` → `İ` olur. Dolayısıyla büyük harfe çevrilen her İngilizce metnin `lang="en"` taşıması gerekir, aksi halde ekranda `ARCHİTECTURE` ve `GİTHUB` yazar. Bu hata jsdom'da görünmez (düzen ve `text-transform` yok), bu yüzden `src/components/englishLabels.test.tsx` kuralı yapısal olarak korur: arayüzün bastığı her İngilizce etiket bir `lang="en"` kapsamında olmalı, her Türkçe `h2` ise olmamalıdır.

### Erişilebilirlik

Anlamsal HTML önce gelir — gezinen `<a>`, iş yapan `<button>`. Sayfada tek bir `<h1>` vardır, başlık seviyeleri font boyutu için atlanmaz. Her etkileşimli öğe klavyeyle erişilebilir ve görünür bir odak halkası taşır. Her `<img>` `width`/`height` ile yer ayırır (düzen kaymasını önlemek için) ve anlamlı bir `alt` ya da bilinçli olarak boş bir `alt=""` taşır. Hareket duyarlılığı olan kullanıcılar için `prefers-reduced-motion` altında kayan şeritler, beliriş animasyonu ve buton parıltısı durur.

### Rota başına meta etiketleri

`src/components/RouteMeta.tsx` her rota için `document.title`, açıklama ve Open Graph / Twitter etiketlerini yazar. Değerler elle yazılmaz, içerikten türetilir.

Bilinen sınır: bu etiketler yüklendikten sonra JavaScript ile uygulanır. JavaScript çalıştıran tarayıcılar (Google) görür; sosyal önizleme botları (LinkedIn, X, Slack, WhatsApp) ham HTML okur ve script çalıştırmaz, bu yüzden paylaşılan bir bağlantı `index.html`'deki varsayılanları gösterir. Gerçek rota başına önizleme, ön-render veya SSG gerektirir.

---

## Testler

Vitest + React Testing Library, `jsdom` ortamında. `vitest.config.ts`, `vite.config.ts`'i birleştirir; böylece bileşenler testte de geliştirme ve derlemedekiyle birebir aynı şekilde derlenir.

```bash
npm test
# Test Files  36 passed (36)
#      Tests  245 passed (245)
```

Vitest global'leri **kapalı** — `describe` / `it` / `expect` açıkça `vitest`'ten içe aktarılır. `passWithNoTests` `false`, yani bozuk bir `include` deseni sessizce "0 test, yeşil" demek yerine gürültülü şekilde başarısız olur.

Testler yalnızca render kontrolü yapmaz, kuralları korur: paletin literal renge dönmediğini, İngilizce etiketlerin `lang="en"` taşıdığını, proje ekran görüntülerinin diskteki dosyalarla birebir eşleştiğini, Stacks bölümündeki her teknolojinin depoda başka bir yerde de geçtiğini ve proje metinlerinde noktalı virgül/iki nokta kullanılmadığını doğrular.

---

## Görsel İşleme

Proje ekran görüntüleri `src/assets/<slug>/` altına ham PNG olarak bırakılır, sonra:

```bash
node scripts/optimize-images.mjs --delete
```

Bu 1600px genişliğe küçültür, WebP'ye çevirir, dosya başına PSNR değeri basar ve orijinalleri siler. Sitede yalnızca `.webp` dosyaları toplanır (`import.meta.glob`), yani geride kalan bir PNG siteye hiç ulaşmaz. Klasör adı slug ile birebir aynı ve küçük harf olmalıdır — derleme sunucuları büyük/küçük harfe duyarlıdır.

---

## Dağıtım

Vercel üzerinde statik olarak yayınlanır. `vercel.json` her yolu `/index.html`'e yönlendirir:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Bu dosya olmadan `/projects/dolfin` adresine doğrudan girmek ya da sayfayı yenilemek 404 verir. Yerel `vite dev` ve `vite preview` kendi SPA geri dönüşlerine sahip olduğu için sorun yalnızca gerçek dağıtımda görünür.

---

## Lisans

Kişisel bir portfolyo sitesidir. İçerik (metinler, fotoğraflar, özgeçmiş, proje açıklamaları) Ensar Aslan'a aittir.

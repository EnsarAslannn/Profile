// Content here is owner-supplied and verbatim (Turkish project copy). Do not
// edit, embellish, or add fields (tech-stack chips, dates, repo links) without
// the owner - see CLAUDE.md's no-fabrication rule.
import type { ProjectInput } from './index'

export const takeauction: ProjectInput = {
  slug: 'takeauction',
  title: 'TakeAuction',
  subtitle: 'Gerçek Zamanlı Açık Artırma Sistemi',
  liveUrl: 'https://take-auction.vercel.app',
  description: [
    'Satıcıların lot listelediği, alıcıların gizli tavan değerleriyle yarıştığı, yüksek trafikli ve eşzamanlı çalışan gerçek zamanlı bir açık artırma sistemi. Amaç yalnızca teklif butonu olan bir CRUD uygulaması değil; gerçek rekabet altında eşzamanlılığı, teslimat garantilerini ve kapanış mantığını doğru ele alan uçtan uca bir sistem kurmaktı. Kod yatay katmanlar yerine Vertical Slice Architecture ile örgütlendi: her özellik kendi isteğini, işleyicisini ve doğrulamasını uçtan uca kendisi taşıyor.',
    'Teklif sistemi proxy mantığıyla çalışıyor. Kullanıcı bir fiyat değil, kimseye görünmeyen bir üst limit giriyor; sistem onun adına yalnızca liderliği almaya yetecek kadar artırıyor. Kazanan, harcamaya razı olduğu tutarı değil, bir sonraki en yüksek tavanın bir artış payı üstünü ödüyor. Tavan değerleri hiçbir uçta ifşa edilmiyor: ne detay yanıtında, ne teklif geçmişinde, ne de canlı bağlantı üzerinden.',
    'Olay yayını Transactional Outbox deseniyle kurgulandı: bir teklif ile onu duyuran olay aynı veritabanı işleminde yazılıyor, böylece sistemin "teklif kaydedildi ama kimseye haber verilmedi" durumuna düşmesi mümkün olmuyor. Arka plandaki dağıtıcı bu olayları RabbitMQ\'ya taşıyor, işlem tamamlandığı anda uyanıyor ve ayrıca periyodik olarak tarıyor; kilitleri atlamalı olarak aldığı için birden fazla API kopyası aynı mesajı iki kez göndermiyor. Anlık teklif bildirimleri istemciye SignalR üzerinden ulaşıyor.',
    'Her lot, kapanması gereken saniye için kendi kapanışını önceden planlıyor; periyodik tarama yalnızca kaybolan planlamalar için güvenlik ağı olarak duruyor. Kapanış idempotent olduğu için hangi tetikleyici ikinci gelirse gelsin lotu zaten kapanmış buluyor. Kapanış penceresine denk gelen bir teklif bitiş saatini eski bitişe göre değil kendi üzerine ileri itiyor, böylece son saniye teklifleri üst üste birikmiyor ve her biri aynı yanıt süresini alıyor.',
    'Sistem yalnızca çalışmakla kalmıyor, ölçülüyor: eşzamanlılık çakışmaları, bir teklifin kaç denemede sonuçlandığı, uçtan uca teklif süresi ve olay kuyruğunun yetişip yetişmediği OpenTelemetry ile toplanıp Prometheus\'a veriliyor. Her şeyin önünde duran nginx ağ geçidi hem yönlendirmeyi hem de ilk hız sınırlama katmanını üstleniyor. Yük altındaki davranış, sürekli entegrasyonda k6 ile yazılmış bir teklif çakışması senaryosuyla doğrulanıyor.',
  ],
  // Source: github.com/EnsarAslannn/TakeAuction - README "Kullanılan
  // Teknolojiler" + src/TakeAuction.Api/TakeAuction.Api.csproj +
  // src/TakeAuction.Web/package.json + tests/* + .github/workflows/
  // {ci,codeql,load}.yml + infra/nginx.
  technologies: [
    {
      label: 'Backend',
      items: [
        '.NET 10',
        'ASP.NET Core Web API',
        'PostgreSQL',
        'Entity Framework Core',
        'Redis',
        'RabbitMQ',
        'MassTransit',
        'SignalR',
        'Hangfire',
        'MediatR',
        'FluentValidation',
        'Serilog',
        'JWT',
      ],
    },
    {
      label: 'Frontend',
      items: [
        'React 18',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
        'Zustand',
        'Axios',
        'React Router',
        'React Three Fiber',
        'Three.js',
      ],
    },
    {
      label: 'Test',
      items: ['xUnit', 'Testcontainers', 'Playwright'],
    },
    {
      label: 'Deployment',
      items: ['Docker', 'nginx', 'GitHub Actions', 'Railway', 'Vercel'],
    },
  ],
  screens: [
    {
      name: 'homePage',
      caption:
        'Açılış ekranı canlı müzayede salonunu tanıtıyor; o an açık artırmada olan parça sayısı, öne çıkan parçanın güncel teklifi ve salona giriş yönlendirmesi bir arada duruyor.',
    },
    {
      name: 'homePage2',
      caption:
        'Parça vitrininde ürün görseli sürüklenerek döndürülebiliyor; sağ tarafta güncel teklif ve doğrudan teklif verme aksiyonu yer alıyor.',
    },
    {
      name: 'auctions',
      caption:
        'Açık artırma listesi; parçalar tümü, canlı, planlandı ve sona erdi durumlarına göre filtrelenebiliyor, isimle aranabiliyor. Her satırda güncel teklif ve kalan süre canlı olarak görünüyor.',
    },
    {
      name: 'auction',
      caption:
        'Parça detayında açıklama, güncel teklif ve kalan süre bulunuyor. Kullanıcı görünmeyen bir üst limit belirleyerek teklif veriyor; sistem yalnızca önde kalmaya yetecek kadar artırıyor.',
    },
  ],
}

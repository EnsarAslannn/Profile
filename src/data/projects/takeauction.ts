import type { ProjectInput } from './index'

export const takeauction: ProjectInput = {
  slug: 'takeauction',
  title: 'TakeAuction',
  subtitle: {
    tr: 'Gerçek Zamanlı Açık Artırma Sistemi',
    en: 'Real-Time Auction System',
  },
  liveUrl: 'https://take-auction.vercel.app',
  description: {
    tr: [
      'Satıcıların lot listelediği, alıcıların gizli tavan değerleriyle yarıştığı, yüksek trafikli ve eşzamanlı çalışan gerçek zamanlı bir açık artırma sistemi. Amaç yalnızca teklif butonu olan bir CRUD uygulaması değil, gerçek rekabet altında eşzamanlılığı, teslimat garantilerini ve kapanış mantığını doğru ele alan uçtan uca bir sistem kurmaktı. Kod yatay katmanlar yerine Vertical Slice Architecture ile örgütlendi. Her özellik kendi isteğini, işleyicisini ve doğrulamasını uçtan uca kendisi taşıyor.',
      'Teklif sistemi proxy mantığıyla çalışıyor. Kullanıcı bir fiyat değil, kimseye görünmeyen bir üst limit giriyor. Sistem onun adına yalnızca liderliği almaya yetecek kadar artırıyor. Kazanan, harcamaya razı olduğu tutarı değil, bir sonraki en yüksek tavanın bir artış payı üstünü ödüyor. Tavan değerleri hiçbir uçta ifşa edilmiyor. Ne detay yanıtında, ne teklif geçmişinde, ne de canlı bağlantı üzerinden görünüyor.',
      'Olay yayını Transactional Outbox deseniyle kurgulandı. Bir teklif ile onu duyuran olay aynı veritabanı işleminde yazılıyor, böylece sistemin "teklif kaydedildi ama kimseye haber verilmedi" durumuna düşmesi mümkün olmuyor. Arka plandaki dağıtıcı bu olayları RabbitMQ\'ya taşıyor, işlem tamamlandığı anda uyanıyor ve ayrıca periyodik olarak tarıyor. Kilitleri atlamalı olarak aldığı için birden fazla API kopyası aynı mesajı iki kez göndermiyor. Anlık teklif bildirimleri istemciye SignalR üzerinden ulaşıyor.',
      'Her lot, kapanması gereken saniye için kendi kapanışını önceden planlıyor. Periyodik tarama yalnızca kaybolan planlamalar için güvenlik ağı olarak duruyor. Kapanış idempotent olduğu için hangi tetikleyici ikinci gelirse gelsin lotu zaten kapanmış buluyor. Kapanış penceresine denk gelen bir teklif bitiş saatini eski bitişe göre değil kendi üzerine ileri itiyor, böylece son saniye teklifleri üst üste birikmiyor ve her biri aynı yanıt süresini alıyor.',
      'Sistem yalnızca çalışmakla kalmıyor, ölçülüyor. Eşzamanlılık çakışmaları, bir teklifin kaç denemede sonuçlandığı, uçtan uca teklif süresi ve olay kuyruğunun yetişip yetişmediği ölçüm altyapısına aktarılıyor. Her şeyin önünde duran nginx ağ geçidi hem yönlendirmeyi hem de ilk hız sınırlama katmanını üstleniyor. Yük altındaki davranış ise sürekli entegrasyonda çalışan bir teklif çakışması senaryosuyla doğrulanıyor.',
    ],
    en: [
      'A real-time auction system running under high traffic and heavy concurrency, where sellers list lots and buyers compete with hidden ceiling values. The aim was not a CRUD application with a bid button on it, but an end-to-end system that handles concurrency, delivery guarantees and closing logic correctly under real competition. The code is organised with Vertical Slice Architecture rather than horizontal layers. Each feature carries its own request, handler and validation from end to end.',
      'The bidding system works on proxy logic. A user enters not a price but an upper limit nobody can see. The system raises on their behalf only as far as it takes to hold the lead. The winner pays one increment above the next highest ceiling rather than the amount they were willing to spend. Ceiling values are exposed at no endpoint. They appear neither in the detail response, nor in the bid history, nor over the live connection.',
      'Event publishing is built on the Transactional Outbox pattern. A bid and the event announcing it are written inside the same database transaction, so the system cannot fall into a state where the bid was saved but nobody was told. The background dispatcher carries those events to RabbitMQ, waking the moment the transaction completes and also sweeping periodically. Because it takes its locks with skip-locked, several API copies never send the same message twice. Instant bid notifications reach the client over SignalR.',
      'Every lot schedules its own closing in advance, for the second it is due to close. The periodic sweep stands only as a safety net for schedules that went missing. Closing is idempotent, so whichever trigger arrives second finds the lot already closed. A bid landing inside the closing window pushes the end time forward from itself rather than from the old end, so last-second bids do not pile up on one another and each of them gets the same response window.',
      'The system does not merely work, it is measured. Concurrency conflicts, how many attempts a bid takes to settle, end-to-end bid latency and whether the event queue is keeping up are all fed into the measurement infrastructure. The nginx gateway standing in front of everything takes on both the routing and the first rate-limiting layer. Behaviour under load is verified by a bid contention scenario that runs in continuous integration.',
    ],
  },
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
      caption: {
        tr: 'Açılış ekranı canlı müzayede salonunu tanıtıyor. O an açık artırmada olan parça sayısı, öne çıkan parçanın güncel teklifi ve salona giriş yönlendirmesi bir arada duruyor.',
        en: 'The landing screen introduces the live auction room. The number of lots currently under auction, the current bid on the featured lot and the way into the room all sit together.',
      },
    },
    {
      name: 'homePage2',
      caption: {
        tr: 'Parça vitrininde ürün görseli sürüklenerek döndürülebiliyor. Sağ tarafta güncel teklif ve doğrudan teklif verme aksiyonu yer alıyor.',
        en: 'In the lot showcase the product image can be dragged and rotated. The current bid and a direct bidding action sit on the right.',
      },
    },
    {
      name: 'auctions',
      caption: {
        tr: 'Açık artırma listesinde parçalar tümü, canlı, planlandı ve sona erdi durumlarına göre filtrelenebiliyor, isimle aranabiliyor. Her satırda güncel teklif ve kalan süre canlı olarak görünüyor.',
        en: 'In the auction list lots can be filtered by all, live, scheduled and ended, and searched by name. Each row shows the current bid and the remaining time live.',
      },
    },
    {
      name: 'auction',
      caption: {
        tr: 'Parça detayında açıklama, güncel teklif ve kalan süre bulunuyor. Kullanıcı görünmeyen bir üst limit belirleyerek teklif veriyor. Sistem yalnızca önde kalmaya yetecek kadar artırıyor.',
        en: 'The lot detail carries the description, the current bid and the remaining time. The user bids by setting an upper limit nobody sees. The system raises only as far as it takes to stay ahead.',
      },
    },
  ],
}

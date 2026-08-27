// Content here is owner-supplied and verbatim (Turkish project copy). Do not
// edit, embellish, or add fields (tech-stack chips, dates, repo links) without
// the owner - see CLAUDE.md's no-fabrication rule.
import type { ProjectInput } from './index'

export const takeauction: ProjectInput = {
  slug: 'takeauction',
  title: 'TakeAuction',
  subtitle: 'Gerçek Zamanlı Açık Artırma Sistemi',
  description:
    'Gerçek zamanlı, yüksek trafikli bir online açık artırma sistemi. .NET ve Vertical Slice Architecture ile geliştirildi, PostgreSQL üzerinde çalışıyor. RabbitMQ ile olay tabanlı mesajlaşma, Hangfire ile otomatik lot kapanışı, SignalR ile anlık teklif bildirimleri sağlandı. JWT ile kimlik doğrulama yapıldı; xUnit, Testcontainers ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.',
  technologies: ['.NET', 'PostgreSQL', 'RabbitMQ', 'SignalR', 'Hangfire', 'JWT', 'Docker'],
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

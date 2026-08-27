// Content here is owner-supplied and verbatim (Turkish project copy). Do not
// edit, embellish, or add fields (tech-stack chips, dates, repo links) without
// the owner - see CLAUDE.md's no-fabrication rule.
import type { ProjectInput } from './index'

export const altitudelog: ProjectInput = {
  slug: 'altitudelog',
  title: 'AltitudELog',
  subtitle: 'Uçuş & Mürettebat Yönetim Sistemi',
  description:
    'Pilotların uçuş kaydı tutup mürettebat atayabildiği bir uçuş ve mürettebat yönetim sistemi. Clean Architecture ve CQRS (MediatR) prensipleriyle, .NET ve PostgreSQL üzerinde geliştirildi. Hangfire ile arka planda çalışan işler sayesinde dış hava durumu servisinden otomatik veri entegrasyonu yapıldı, Redis ile önbellekleme uygulandı. JWT ile rol bazlı yetkilendirme sağlandı; xUnit ve Testcontainers ile test edildi, Docker üzerinden CI/CD sürecine entegre edilip canlıya alındı.',
  technologies: ['.NET', 'PostgreSQL', 'Redis', 'Hangfire', 'MediatR', 'JWT', 'Docker'],
  screens: [
    {
      name: 'homePage',
      caption:
        'Açılış ekranı uçuşların, mürettebat atamalarının ve CRM raporlarının tek bir operasyon kaydında toplandığını, her uçuşun METAR verisinin arka planda otomatik alındığını anlatıyor.',
    },
    {
      name: 'homePage2',
      caption:
        'CRM raporlarının tanıtıldığı bölüm: uçuş bazlı raporlama, isteğe bağlı anonim gönderim, rütbe dağılımı ve son altı ayın trendi.',
    },
    {
      name: 'newFlight',
      caption:
        'Yeni uçuş oluşturma formu; kalkış ve varış ICAO kodu, tarih, uçuş süresi ve uçak tipi giriliyor. METAR bilgisi uçuş kaydedildikten sonra sistem tarafından otomatik olarak alınıyor.',
    },
    {
      name: 'dashboard',
      caption:
        'Uçuş kaydı detayı; rota, tarih, süre ve uçak tipinin yanında o uçuşun METAR satırı görünüyor. Sağdaki panelden pilot seçilip PIC veya SIC görevi ile mürettebata atanıyor.',
    },
    {
      name: 'profile',
      caption:
        'Pilot profili; toplam uçuş, toplam saat ve uçak tipi çeşidi özetleniyor, uçak tipine göre saatler ve sertifikalar listeleniyor. Kayıtlar CSV veya PDF olarak indirilebiliyor.',
    },
    {
      name: 'statistics',
      caption:
        'Yönetim panelindeki operasyon istatistikleri; toplam uçuş, toplam pilot ve CRM rapor sayıları, rütbeye göre pilot dağılımı ve son altı ayın CRM trendi.',
    },
  ],
}

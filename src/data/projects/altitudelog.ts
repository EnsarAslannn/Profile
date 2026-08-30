// Content here is owner-supplied and verbatim (Turkish project copy). Do not
// edit, embellish, or add fields (tech-stack chips, dates, repo links) without
// the owner - see CLAUDE.md's no-fabrication rule.
import type { ProjectInput } from './index'

export const altitudelog: ProjectInput = {
  slug: 'altitudelog',
  title: 'AltitudELog',
  subtitle: 'Uçuş & Mürettebat Yönetim Sistemi',
  liveUrl: 'https://altitudelog.vercel.app',
  description: [
    'Pilotların rütbeleriyle sisteme kayıt olduğu, uçuş kaydı oluşturduğu, her uçuşa mürettebat üyelerini görev rolleriyle atadığı ve isteğe bağlı olarak anonim CRM (Crew Resource Management) güvenlik raporu doldurabildiği bir uçuş ve mürettebat yönetim platformu. Hedef basit bir kayıt ekranı değil, rol tabanlı yetkilendirmeyi, arka plan işlerini, önbellek katmanını ve gerçek bir dağıtım sürecini bir araya getiren uçtan uca bir uygulamaydı.',
    'Proje Clean Architecture prensipleriyle katmanlara ayrıldı. Domain katmanı Pilot, Flight, Crew ve CRMReport gibi çekirdek varlıkları hiçbir dış bağımlılık olmadan taşıyor. Application katmanı CQRS komut ve sorgularını MediatR üzerinden yürütüyor, doğrulama kurallarını ve önbellek soyutlamalarını barındırıyor. Infrastructure katmanı veritabanı erişimini, JWT üretimini, Redis bağlantısını ve METAR servisini üstleniyor.',
    'Bir uçuş oluşturulduğunda kalkış havalimanının METAR hava durumu raporu arka planda tetiklenen bir Hangfire işiyle dış servisten çekilip uçuşa işleniyor. Dış API çağrısı yazma işleminden ayrıştırıldığı için kullanıcı raporun gelmesini beklemeden devam ediyor.',
    'Pilotun rütbesi aynı zamanda sistemdeki yetki seviyesini belirliyor. Uçuş ve mürettebat oluşturma gibi yazma işlemleri komuta rütbeleriyle sınırlı ve bu bilgi JWT üzerinde rol olarak taşınıyor. Aynı kurallar arayüzde de rota koruması olarak uygulanıyor. Kayda özel kurallar controller katmanında değil işleyicinin içinde duruyor, böylece arayüzden dolaşılamıyor. Bir pilotun uçuş kaydı dökümünü yalnızca kendisi ya da bir komuta rütbesi indirebiliyor.',
    'Sık sorgulanan veriler Redis üzerinde önbelleğe alınıyor, güncelliğini yitirdiğinde ilgili kayıtlar otomatik geçersiz kılınıyor. Önbellek servisi çökse dahi sistem doğrudan veritabanına düşerek çalışmaya devam ediyor. Pilot uçuş kayıtları CSV olarak ya da QuestPDF ile üretilen bir PDF olarak dışa aktarılabiliyor. API dokümantasyonu Scalar üzerinden gezilebiliyor, arka plan iş kuyruğu paneli parola korumalı bir uçta duruyor.',
  ],
  // Source: github.com/EnsarAslannn/AltitudELog - README "Kullanılan
  // Teknolojiler" + src/AltitudELog.*/*.csproj + frontend/package.json +
  // tests/* + .github/workflows/ci.yml. MediatR and QuestPDF are not in the
  // README's list but are real PackageReferences (Application/Infrastructure
  // and API respectively); QuestPDF is what backs the PDF export shown in the
  // pilot-profile screenshot below.
  technologies: [
    {
      label: 'Backend',
      items: [
        '.NET 10',
        'ASP.NET Core Web API',
        'PostgreSQL',
        'Entity Framework Core',
        'Redis',
        'Hangfire',
        'MediatR',
        'FluentValidation',
        'Serilog',
        'QuestPDF',
        'Scalar (OpenAPI)',
        'JWT',
      ],
    },
    {
      label: 'Frontend',
      items: [
        'React 19',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
        'Zustand',
        'Axios',
        'React Router',
        'React Three Fiber',
        'Three.js',
        'Framer Motion',
      ],
    },
    {
      label: 'Test',
      items: ['xUnit', 'Testcontainers', 'Vitest', 'React Testing Library'],
    },
    {
      label: 'Deployment',
      items: ['Docker', 'GitHub Actions', 'Railway', 'Vercel'],
    },
  ],
  screens: [
    {
      name: 'homePage',
      caption:
        'Açılış ekranı uçuşların, mürettebat atamalarının ve CRM raporlarının tek bir operasyon kaydında toplandığını, her uçuşun METAR verisinin arka planda otomatik alındığını anlatıyor.',
    },
    {
      name: 'homePage2',
      caption:
        'CRM raporlarının tanıtıldığı bölümde uçuş bazlı raporlama, isteğe bağlı anonim gönderim, rütbe dağılımı ve son altı ayın trendi yer alıyor.',
    },
    {
      name: 'newFlight',
      caption:
        'Yeni uçuş oluşturma formunda kalkış ve varış ICAO kodu, tarih, uçuş süresi ve uçak tipi giriliyor. METAR bilgisi uçuş kaydedildikten sonra sistem tarafından otomatik olarak alınıyor.',
    },
    {
      name: 'dashboard',
      caption:
        'Uçuş kaydı detayında rota, tarih, süre ve uçak tipinin yanında o uçuşun METAR satırı görünüyor. Sağdaki panelden pilot seçilip PIC veya SIC görevi ile mürettebata atanıyor.',
    },
    {
      name: 'profile',
      caption:
        'Pilot profilinde toplam uçuş, toplam saat ve uçak tipi çeşidi özetleniyor, uçak tipine göre saatler ve sertifikalar listeleniyor. Kayıtlar CSV veya PDF olarak indirilebiliyor.',
    },
    {
      name: 'statistics',
      caption:
        'Yönetim panelindeki operasyon istatistiklerinde toplam uçuş, toplam pilot ve CRM rapor sayıları, rütbeye göre pilot dağılımı ve son altı ayın CRM trendi görünüyor.',
    },
  ],
}

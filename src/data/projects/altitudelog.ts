// Content here is owner-supplied. The Turkish is verbatim; the English is a
// translation of that same copy, not a second draft of it - no claim appears
// in one language that is absent from the other. Do not edit, embellish, or
// add fields (tech-stack chips, dates, repo links) without the owner - see
// CLAUDE.md's no-fabrication rule.
import type { ProjectInput } from './index'

export const altitudelog: ProjectInput = {
  slug: 'altitudelog',
  title: 'AltitudELog',
  subtitle: {
    tr: 'Uçuş & Mürettebat Yönetim Sistemi',
    en: 'Flight & Crew Management System',
  },
  liveUrl: 'https://altitudelog.vercel.app',
  description: {
    tr: [
      'Pilotların rütbeleriyle sisteme kayıt olduğu, uçuş kaydı oluşturduğu, her uçuşa mürettebat üyelerini görev rolleriyle atadığı ve isteğe bağlı olarak anonim CRM (Crew Resource Management) güvenlik raporu doldurabildiği bir uçuş ve mürettebat yönetim platformu. Hedef basit bir kayıt ekranı değil, rol tabanlı yetkilendirmeyi, arka plan işlerini, önbellek katmanını ve gerçek bir dağıtım sürecini bir araya getiren uçtan uca bir uygulamaydı.',
      'Proje Clean Architecture prensipleriyle katmanlara ayrıldı. Domain katmanı Pilot, Flight, Crew ve CRMReport gibi çekirdek varlıkları hiçbir dış bağımlılık olmadan taşıyor. Application katmanı CQRS komut ve sorgularını MediatR üzerinden yürütüyor, doğrulama kurallarını ve önbellek soyutlamalarını barındırıyor. Infrastructure katmanı veritabanı erişimini, JWT üretimini, Redis bağlantısını ve METAR servisini üstleniyor.',
      'Bir uçuş oluşturulduğunda kalkış havalimanının METAR hava durumu raporu arka planda tetiklenen bir Hangfire işiyle dış servisten çekilip uçuşa işleniyor. Dış API çağrısı yazma işleminden ayrıştırıldığı için kullanıcı raporun gelmesini beklemeden devam ediyor.',
      'Pilotun rütbesi aynı zamanda sistemdeki yetki seviyesini belirliyor. Uçuş ve mürettebat oluşturma gibi yazma işlemleri komuta rütbeleriyle sınırlı ve bu bilgi JWT üzerinde rol olarak taşınıyor. Aynı kurallar arayüzde de rota koruması olarak uygulanıyor. Kayda özel kurallar controller katmanında değil işleyicinin içinde duruyor, böylece arayüzden dolaşılamıyor. Bir pilotun uçuş kaydı dökümünü yalnızca kendisi ya da bir komuta rütbesi indirebiliyor.',
      'Sık sorgulanan veriler Redis üzerinde önbelleğe alınıyor, güncelliğini yitirdiğinde ilgili kayıtlar otomatik geçersiz kılınıyor. Önbellek servisi çökse dahi sistem doğrudan veritabanına düşerek çalışmaya devam ediyor. Pilot uçuş kayıtları CSV olarak ya da QuestPDF ile üretilen bir PDF olarak dışa aktarılabiliyor. API dokümantasyonu Scalar üzerinden gezilebiliyor, arka plan iş kuyruğu paneli parola korumalı bir uçta duruyor.',
    ],
    en: [
      'A flight and crew management platform where pilots register with their ranks, create flight records, assign crew members to each flight with their duty roles and optionally fill in an anonymous CRM (Crew Resource Management) safety report. The target was not a simple record screen, but an end-to-end application bringing together role-based authorisation, background jobs, a caching layer and a real deployment process.',
      'The project is separated into layers along Clean Architecture principles. The Domain layer carries core entities such as Pilot, Flight, Crew and CRMReport with no external dependency at all. The Application layer runs CQRS commands and queries through MediatR and holds the validation rules and the caching abstractions. The Infrastructure layer takes on database access, JWT generation, the Redis connection and the METAR service.',
      'When a flight is created, the METAR weather report for the departure airport is pulled from an external service by a Hangfire job triggered in the background and written onto the flight. Because the external API call is separated from the write, the user carries on without waiting for the report to arrive.',
      'The rank of a pilot is at the same time their authorisation level in the system. Write operations such as creating flights and crews are limited to command ranks, and that information travels on the JWT as a role. The same rules are applied in the interface as route protection. Record-specific rules sit inside the handler rather than in the controller layer, so they cannot be walked around from the interface. Only a pilot themselves or a command rank can download the logbook export for that pilot.',
      'Frequently queried data is cached on Redis, and the related records are invalidated automatically once they go stale. Even if the cache service goes down the system falls through to the database and carries on working. Pilot flight records can be exported as CSV or as a PDF produced with QuestPDF. The API documentation can be browsed through Scalar, and the background job queue panel sits behind a password-protected endpoint.',
    ],
  },
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
      caption: {
        tr: 'Açılış ekranı uçuşların, mürettebat atamalarının ve CRM raporlarının tek bir operasyon kaydında toplandığını, her uçuşun METAR verisinin arka planda otomatik alındığını anlatıyor.',
        en: 'The landing screen explains that flights, crew assignments and CRM reports are gathered into a single operation record, and that the METAR data for each flight is pulled automatically in the background.',
      },
    },
    {
      name: 'homePage2',
      caption: {
        tr: 'CRM raporlarının tanıtıldığı bölümde uçuş bazlı raporlama, isteğe bağlı anonim gönderim, rütbe dağılımı ve son altı ayın trendi yer alıyor.',
        en: 'The section introducing CRM reports covers flight-based reporting, optional anonymous submission, rank distribution and the trend of the last six months.',
      },
    },
    {
      name: 'newFlight',
      caption: {
        tr: 'Yeni uçuş oluşturma formunda kalkış ve varış ICAO kodu, tarih, uçuş süresi ve uçak tipi giriliyor. METAR bilgisi uçuş kaydedildikten sonra sistem tarafından otomatik olarak alınıyor.',
        en: 'The new flight form takes the departure and arrival ICAO codes, the date, the flight time and the aircraft type. METAR information is pulled automatically by the system once the flight is saved.',
      },
    },
    {
      name: 'dashboard',
      caption: {
        tr: 'Uçuş kaydı detayında rota, tarih, süre ve uçak tipinin yanında o uçuşun METAR satırı görünüyor. Sağdaki panelden pilot seçilip PIC veya SIC görevi ile mürettebata atanıyor.',
        en: 'The flight record detail shows the METAR line for that flight alongside the route, date, duration and aircraft type. From the panel on the right a pilot is picked and assigned to the crew with a PIC or SIC duty.',
      },
    },
    {
      name: 'profile',
      caption: {
        tr: 'Pilot profilinde toplam uçuş, toplam saat ve uçak tipi çeşidi özetleniyor, uçak tipine göre saatler ve sertifikalar listeleniyor. Kayıtlar CSV veya PDF olarak indirilebiliyor.',
        en: 'The pilot profile summarises total flights, total hours and the number of aircraft types, and lists hours by aircraft type along with certificates. Records can be downloaded as CSV or PDF.',
      },
    },
    {
      name: 'statistics',
      caption: {
        tr: 'Yönetim panelindeki operasyon istatistiklerinde toplam uçuş, toplam pilot ve CRM rapor sayıları, rütbeye göre pilot dağılımı ve son altı ayın CRM trendi görünüyor.',
        en: 'The operation statistics in the admin panel show total flights, total pilots and CRM report counts, the distribution of pilots by rank and the CRM trend of the last six months.',
      },
    },
  ],
}

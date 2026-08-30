// Content here is owner-supplied. The Turkish is verbatim; the English is a
// translation of that same copy, not a second draft of it - no claim appears
// in one language that is absent from the other. Do not edit, embellish, or
// add fields (tech-stack chips, dates, repo links) without the owner - see
// CLAUDE.md's no-fabrication rule.
import type { ProjectInput } from './index'

export const dolfin: ProjectInput = {
  slug: 'dolfin',
  title: 'DOLFIN',
  subtitle: {
    tr: 'Finansal Portföy Yönetim Platformu',
    en: 'Financial Portfolio Management Platform',
  },
  liveUrl: 'https://dol-fin.com',
  // Paragraphs, not one block: these descriptions run several hundred words
  // now, and the detail page renders one <p> per entry. description[0] is
  // also the source of the route's meta description, so it must stand alone
  // as a summary of the whole project.
  description: {
    tr: [
      'Kullanıcıların sanal bir cüzdanla hisse senedi alıp satabildiği, portföylerinin dağılımını ve performansını izleyebildiği, hisse sayfalarına yorum bırakabildiği kurumsal odaklı bir finansal yönetim platformu. Uygulama harici bir piyasa verisi servisine bağlı değil. TSLA, NVDA, AAPL, GOOGL ve MSFT için elle hazırlanmış yerel bir veri seti üzerinde çalışıyor.',
      'Portföy tarafında alım, satım, para yatırma ve çekme işlemleri tek bir işlem bütünlüğü içinde yürüyor. Maliyet bazına göre hesaplanan gerçekleşmemiş kâr/zarar hem portföy toplamında hem de pozisyon bazında görünüyor. Fiyatları periyodik olarak hareket ettiren bir simülasyon servisi bu rakamları anlamlı kılıyor. Kullanıcı bir hisse için hedef fiyat ve yön belirleyip alarm kurabiliyor, arka planda dakikada bir çalışan servis koşul sağlandığında bildirim üretiyor.',
      'Kimlik doğrulama ASP.NET Core Identity üzerine kurulu. JWT tarayıcıya httpOnly cookie ile taşınıyor, yani JavaScript tarafından okunamıyor. Durum değiştiren her istekte double-submit cookie deseniyle CSRF koruması, giriş ve kayıt uçlarında IP bazlı hız sınırlama uygulanıyor. Yetkilendirme Admin ve User rolleriyle ayrılıyor, yorumlarda sahiplik kontrolü yapılıyor. Hisse arama, şirket profilleri ve tartışma bölümü üye olmadan da okunabiliyor.',
      'Hisse, yorum ve portföy okumaları Redis destekli HybridCache katmanından geçiyor. Bu katman süreç içinde bir L1 ve Redis üzerinde bir L2 katmanından oluşuyor. Yazma işlemlerinde ilgili anahtarlar geçersiz kılınıyor, açılışta önbellek ısıtılıyor. Redis erişilemez hale gelirse sistem doğrudan veritabanına düşerek çalışmaya devam ediyor. API dokümantasyonu Scalar üzerinden, controller dosyalarındaki XML yorumlarından canlı üretiliyor. Elle güncellenen bir dosya olmadığı için gerçek uçlardan sapması mümkün değil. Frontend ve backend, her ikisinin commit geçmişi korunarak tek bir monorepo altında birleştirildi.',
    ],
    en: [
      'A corporate-focused financial management platform where users buy and sell shares with a virtual wallet, follow the distribution and the performance of their portfolio, and leave comments on share pages. The application is not connected to any external market data service. It runs on a hand-prepared local data set covering TSLA, NVDA, AAPL, GOOGL and MSFT.',
      'On the portfolio side, buying, selling, depositing and withdrawing all run inside a single transactional unit. Unrealised profit and loss, calculated against the cost basis, is shown both in the portfolio total and per position. A simulation service that moves prices periodically is what makes those figures mean anything. A user can set a target price and a direction for a share and create an alert, and a background service running once a minute produces a notification when the condition is met.',
      'Authentication is built on ASP.NET Core Identity. The JWT travels to the browser in an httpOnly cookie, which means JavaScript cannot read it. Every state-changing request carries CSRF protection through the double-submit cookie pattern, and the login and registration endpoints are rate limited by IP. Authorisation is split into Admin and User roles, and comments are ownership checked. Share search, company profiles and the discussion section can be read without an account.',
      'Share, comment and portfolio reads pass through a Redis-backed HybridCache layer. That layer is an in-process L1 together with an L2 on Redis. Writes invalidate the related keys, and the cache is warmed at startup. If Redis becomes unreachable the system falls through to the database and carries on working. The API documentation is generated live through Scalar from the XML comments in the controller files. Since there is no hand-maintained file, it cannot drift from the real endpoints. The frontend and the backend were merged under a single monorepo with both commit histories preserved.',
    ],
  },
  // Source: github.com/EnsarAslannn/DOLFIN - the monorepo that merged the
  // former DOL-FIN (frontend) and DOL-FIN-api (backend) repos, keeping both
  // commit histories. README "Kullanılan Teknolojiler" + backend/api.csproj +
  // frontend/package.json + .github/workflows/{frontend,backend}-ci.yml.
  technologies: [
    {
      label: 'Backend',
      items: [
        '.NET 10',
        'ASP.NET Core Web API',
        'PostgreSQL',
        'Entity Framework Core',
        'ASP.NET Core Identity',
        'JWT (httpOnly cookie)',
        'Redis',
        'HybridCache',
        'FluentValidation',
        'Serilog',
        'Scalar (OpenAPI)',
      ],
    },
    {
      label: 'Frontend',
      items: [
        'React 19',
        'TypeScript',
        'Vite',
        'Tailwind CSS',
        'React Router',
        'Axios',
        'React Hook Form',
        'Yup',
        'Framer Motion',
      ],
    },
    {
      label: 'Test',
      items: ['xUnit', 'Moq', 'Testcontainers', 'Vitest', 'React Testing Library', 'Playwright'],
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
        tr: 'Açılış ekranında platformun simüle piyasa verisiyle çalıştığı ve gerçek bir aracı kurum bağlantısı bulunmadığı en başta belirtiliyor.',
        en: 'The landing screen states up front that the platform runs on simulated market data and has no connection to a real brokerage.',
      },
    },
    {
      name: 'homePage2',
      caption: {
        tr: 'Hesap oluşturma bölümü ve altında sıkça sorulan soruların yanıtlandığı yardım merkezi.',
        en: 'The account creation section, with a help centre answering frequently asked questions below it.',
      },
    },
    {
      name: 'searchPage',
      caption: {
        tr: 'Portföy analitiğinde her pozisyon için yatırılan tutar, güncel değer, kâr/zarar ve portföy ağırlığı gösteriliyor. Altında toplam net değer, portföy sağlığı, ağırlıklı sektör ve net değer büyüme grafiği yer alıyor.',
        en: 'Portfolio analytics show the amount invested, the current value, profit and loss, and the portfolio weight for each position. Below them sit total net worth, portfolio health, the weighted sector and a net worth growth chart.',
      },
    },
    {
      name: 'walletPage',
      caption: {
        tr: 'Cüzdan ekranında toplam değer, nakit bakiye ve portföy değeri özetleniyor, simülatör kredisi yatırılabiliyor ve sahip olunan varlıklar listeden satılabiliyor.',
        en: 'The wallet screen summarises total value, cash balance and portfolio value, simulator credit can be deposited, and owned assets can be sold from the list.',
      },
    },
    {
      name: 'companyProfile',
      caption: {
        tr: 'Şirket profilinde fiyat, değişim, piyasa değeri ve beta bilgisinin yanında şirketin ne yaptığı ve son on iki ayın temel metrikleri yer alıyor. Gelir tablosu, bilanço ve nakit akışı ayrı sekmelerde duruyor.',
        en: 'The company profile carries price, change, market capitalisation and beta alongside what the company does and the key metrics of the last twelve months. The income statement, the balance sheet and cash flow sit in separate tabs.',
      },
    },
  ],
}

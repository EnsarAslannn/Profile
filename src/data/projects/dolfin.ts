// Content here is owner-supplied and verbatim (Turkish project copy). Do not
// edit, embellish, or add fields (tech-stack chips, dates, repo links) without
// the owner - see CLAUDE.md's no-fabrication rule.
import type { ProjectInput } from './index'

export const dolfin: ProjectInput = {
  slug: 'dolfin',
  title: 'DOLFIN',
  subtitle: 'Finansal Portföy Yönetim Platformu',
  liveUrl: 'https://dol-fin.com',
  // Paragraphs, not one block: these descriptions run several hundred words
  // now, and the detail page renders one <p> per entry. description[0] is
  // also the source of the route's meta description, so it must stand alone
  // as a summary of the whole project.
  description: [
    'Kullanıcıların sanal bir cüzdanla hisse senedi alıp satabildiği, portföylerinin dağılımını ve performansını izleyebildiği, hisse sayfalarına yorum bırakabildiği kurumsal odaklı bir finansal yönetim platformu. Uygulama harici bir piyasa verisi servisine bağlı değil. TSLA, NVDA, AAPL, GOOGL ve MSFT için elle hazırlanmış yerel bir veri seti üzerinde çalışıyor.',
    'Portföy tarafında alım, satım, para yatırma ve çekme işlemleri tek bir işlem bütünlüğü içinde yürüyor. Maliyet bazına göre hesaplanan gerçekleşmemiş kâr/zarar hem portföy toplamında hem de pozisyon bazında görünüyor. Fiyatları periyodik olarak hareket ettiren bir simülasyon servisi bu rakamları anlamlı kılıyor. Kullanıcı bir hisse için hedef fiyat ve yön belirleyip alarm kurabiliyor, arka planda dakikada bir çalışan servis koşul sağlandığında bildirim üretiyor.',
    'Kimlik doğrulama ASP.NET Core Identity üzerine kurulu. JWT tarayıcıya httpOnly cookie ile taşınıyor, yani JavaScript tarafından okunamıyor. Durum değiştiren her istekte double-submit cookie deseniyle CSRF koruması, giriş ve kayıt uçlarında IP bazlı hız sınırlama uygulanıyor. Yetkilendirme Admin ve User rolleriyle ayrılıyor, yorumlarda sahiplik kontrolü yapılıyor. Hisse arama, şirket profilleri ve tartışma bölümü üye olmadan da okunabiliyor.',
    'Hisse, yorum ve portföy okumaları Redis destekli HybridCache katmanından geçiyor. Bu katman süreç içinde bir L1 ve Redis üzerinde bir L2 katmanından oluşuyor. Yazma işlemlerinde ilgili anahtarlar geçersiz kılınıyor, açılışta önbellek ısıtılıyor. Redis erişilemez hale gelirse sistem doğrudan veritabanına düşerek çalışmaya devam ediyor. API dokümantasyonu Scalar üzerinden, controller dosyalarındaki XML yorumlarından canlı üretiliyor. Elle güncellenen bir dosya olmadığı için gerçek uçlardan sapması mümkün değil. Frontend ve backend, her ikisinin commit geçmişi korunarak tek bir monorepo altında birleştirildi.',
  ],
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
      caption:
        'Açılış ekranında platformun simüle piyasa verisiyle çalıştığı ve gerçek bir aracı kurum bağlantısı bulunmadığı en başta belirtiliyor.',
    },
    {
      name: 'homePage2',
      caption: 'Hesap oluşturma bölümü ve altında sıkça sorulan soruların yanıtlandığı yardım merkezi.',
    },
    {
      name: 'searchPage',
      caption:
        'Portföy analitiğinde her pozisyon için yatırılan tutar, güncel değer, kâr/zarar ve portföy ağırlığı gösteriliyor. Altında toplam net değer, portföy sağlığı, ağırlıklı sektör ve net değer büyüme grafiği yer alıyor.',
    },
    {
      name: 'walletPage',
      caption:
        'Cüzdan ekranında toplam değer, nakit bakiye ve portföy değeri özetleniyor, simülatör kredisi yatırılabiliyor ve sahip olunan varlıklar listeden satılabiliyor.',
    },
    {
      name: 'companyProfile',
      caption:
        'Şirket profilinde fiyat, değişim, piyasa değeri ve beta bilgisinin yanında şirketin ne yaptığı ve son on iki ayın temel metrikleri yer alıyor. Gelir tablosu, bilanço ve nakit akışı ayrı sekmelerde duruyor.',
    },
  ],
}

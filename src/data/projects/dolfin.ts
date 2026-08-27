// Content here is owner-supplied and verbatim (Turkish project copy). Do not
// edit, embellish, or add fields (tech-stack chips, dates, repo links) without
// the owner - see CLAUDE.md's no-fabrication rule.
import type { ProjectInput } from './index'

export const dolfin: ProjectInput = {
  slug: 'dolfin',
  title: 'DOLFIN',
  subtitle: 'Finansal Portföy Yönetim Platformu',
  description:
    'Kullanıcıların sanal cüzdanla hisse senedi alıp satabildiği full-stack bir finansal portföy yönetim platformu. .NET ve PostgreSQL ile geliştirildi. JWT ve CSRF korumalı kimlik doğrulama ile güvenli kullanıcı girişi sağlandı, Redis ile performans artırıcı önbellekleme yapıldı. xUnit ve Playwright ile test edildi, Docker ve GitHub Actions ile CI/CD sürecine entegre edildi.',
  technologies: ['.NET', 'PostgreSQL', 'Redis', 'JWT', 'Playwright', 'Docker'],
  screens: [
    {
      name: 'homePage',
      caption:
        'Açılış ekranı; platformun simüle piyasa verisiyle çalıştığı ve gerçek bir aracı kurum bağlantısı bulunmadığı en başta belirtiliyor.',
    },
    {
      name: 'homePage2',
      caption: 'Hesap oluşturma bölümü ve altında sıkça sorulan soruların yanıtlandığı yardım merkezi.',
    },
    {
      name: 'searchPage',
      caption:
        'Portföy analitiği; her pozisyon için yatırılan tutar, güncel değer, kâr/zarar ve portföy ağırlığı gösteriliyor. Altında toplam net değer, portföy sağlığı, ağırlıklı sektör ve net değer büyüme grafiği yer alıyor.',
    },
    {
      name: 'walletPage',
      caption:
        'Cüzdan ekranı; toplam değer, nakit bakiye ve portföy değeri özetleniyor, simülatör kredisi yatırılabiliyor ve sahip olunan varlıklar listeden satılabiliyor.',
    },
    {
      name: 'companyProfile',
      caption:
        'Şirket profili; fiyat, değişim, piyasa değeri ve beta bilgisinin yanında şirketin ne yaptığı ve son on iki ayın temel metrikleri; gelir tablosu, bilanço ve nakit akışı ayrı sekmelerde.',
    },
  ],
}

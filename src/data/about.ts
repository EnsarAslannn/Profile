// Owner-supplied Hakkımda copy, verbatim. Lives here rather than in Hero.tsx
// so it can be reused (HomePage derives the meta description from the first
// paragraph) without a component file exporting non-component values.
export type AboutParagraph = {
  id: string
  text: string
}

export const ABOUT_PARAGRAPHS: AboutParagraph[] = [
  {
    id: 'intro',
    text: 'Merhaba, ben Ensar Aslan. Karabük Üniversitesi Bilgisayar Mühendisliği %100 İngilizce bölümü mezunu bir yazılım geliştiriciyim. Modern web teknolojileriyle ölçeklenebilir, performanslı ve sürdürülebilir uygulamalar geliştiriyorum.',
  },
  {
    id: 'stack',
    text: 'Backend tarafında C#, .NET, ASP.NET Core ve PostgreSQL; frontend tarafında ise React, TypeScript ve state management araçlarını kullanarak Full Stack çözümler üretiyorum. Projelerimi Clean Architecture, Vertical Slice Architecture, CQRS ve MediatR gibi mimari yaklaşımlarla kurguluyorum. Docker, Redis ve RabbitMQ gibi teknolojilerle sistem performansını ve gerçek zamanlı iletişimi güçlendiriyorum.',
  },
  {
    id: 'tooling',
    text: 'Geliştirme süreçlerimde yapay zeka araçlarını ve AI agent\'larını yoğun ve efektif bir şekilde kullanarak verimliliğimi maksimize ediyorum. Aynı zamanda arka plandaki mimariyi ve sistemin işleyişini derinlemesine anlamaya önem veriyorum.',
  },
  {
    id: 'goals',
    text: 'Gelişimime olan inancım ve yüksek öğrenme motivasyonumla, dahil olacağım yazılım ekiplerinin projelerine ve iş süreçlerine maksimum katkıyı sağlamayı hedefliyorum. Aşağıda üzerinde çalıştığım projelere göz atabilir, ya da doğrudan benimle iletişime geçebilirsiniz.',
  },
]

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
    text: 'Merhaba, ben Ensar Aslan. Karabük Üniversitesi Bilgisayar Mühendisliğinin %100 İngilizce bölümünden mezun oldum. Ağırlıklı olarak C#, .NET ve React kullanarak projeler geliştiriyorum ve zamanla iyi bir Full Stack geliştirici olmayı amaçlıyorum.',
  },
  {
    id: 'goals',
    text: 'Gelişimime olan inancım ve yüksek öğrenme motivasyonumla, dahil olacağım yazılım ekiplerinin projelerine ve iş süreçlerine maksimum katkıyı sağlamayı hedefliyorum. Aşağıda üzerinde çalıştığım projelere göz atabilir, ya da doğrudan benimle iletişime geçebilirsiniz.',
  },
]


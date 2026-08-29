// Owner-supplied Hakkımda copy, verbatim. Lives here rather than in Hero.tsx
// so it can be reused (HomePage derives the meta description from the first
// paragraph) without a component file exporting non-component values.
export type AboutParagraph = {
  id: string
  text: string
}

// A run of copy cut into pieces so the redesign's mixed weights (regular /
// bold / serif-italic) can be painted without putting markup in the data.
// Shared with src/data/hero.ts rather than declared twice.
export type TextSegment = {
  text: string
  emphasis?: 'bold' | 'italic'
  // Set on English fragments inside this otherwise Turkish copy. It fixes
  // two things at once: CSS uppercase casing (Turkish maps i -> İ) and
  // screen-reader pronunciation. See englishLabels.test.tsx.
  lang?: string
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

// The one-line statement the redesign's Hakkımda section opens with (the
// reference design calls for a large claim above the prose). It is the only
// sentence on this site not lifted verbatim from the owner - and it states no
// new fact: "Full Stack .NET Developer" is the title already shown in
// ProfileCard, and the three adjectives are the owner's own, from the intro
// paragraph above. src/data/about.test.ts pins both, so a rewrite that
// smuggles in a fresh claim fails the suite rather than shipping quietly.
export const ABOUT_STATEMENT: TextSegment[] = [
  { text: 'Full Stack .NET Developer', emphasis: 'italic', lang: 'en' },
  { text: ' olarak ' },
  { text: 'ölçeklenebilir, performanslı ve sürdürülebilir', emphasis: 'bold' },
  { text: ' sistemler kuruyorum.' },
]

// Which paragraph the section teases before "Tam metni oku". Index 0 is
// already the hero's paragraph and index 1 is what the Yetenekler section
// covers, so this one is the first that repeats nothing.
export const ABOUT_TEASER = ABOUT_PARAGRAPHS[2]

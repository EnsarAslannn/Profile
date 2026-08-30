import type { Localized } from '../i18n/language'

// Owner-supplied Hakkımda copy, verbatim in Turkish and translated - not
// rewritten - into English. Lives here rather than in Hero.tsx so it can be
// reused (HomePage derives the meta description from the first paragraph)
// without a component file exporting non-component values.
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
  // Set on English fragments inside otherwise Turkish copy. It fixes two
  // things at once: CSS uppercase casing (Turkish maps i -> İ) and
  // screen-reader pronunciation. See englishLabels.test.tsx. In the English
  // copy it is unnecessary and deliberately absent - the document is already
  // lang="en" there, and a redundant attribute is noise.
  lang?: string
}

export const ABOUT_PARAGRAPHS: Localized<AboutParagraph[]> = {
  tr: [
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
  ],
  en: [
    {
      id: 'intro',
      text: 'Hello, I am Ensar Aslan. I am a software developer and a graduate of the fully English-taught Computer Engineering programme at Karabük University. I build scalable, performant and maintainable applications with modern web technologies.',
    },
    {
      id: 'stack',
      text: 'On the backend I work with C#, .NET, ASP.NET Core and PostgreSQL, and on the frontend with React, TypeScript and state management tools, producing full stack solutions. I structure my projects with architectural approaches such as Clean Architecture, Vertical Slice Architecture, CQRS and MediatR. Technologies like Docker, Redis and RabbitMQ are what I use to strengthen system performance and real-time communication.',
    },
    {
      id: 'tooling',
      text: 'I make heavy and effective use of artificial intelligence tools and AI agents in my development process to maximise my output. At the same time I care about understanding the architecture underneath and how the system actually works.',
    },
    {
      id: 'goals',
      text: 'With my belief in my own growth and a high motivation to learn, my aim is to contribute as much as I can to the projects and the working processes of the software teams I join. Below you can look through the projects I have worked on, or get in touch with me directly.',
    },
  ],
}

// The one-line statement the redesign's Hakkımda section opens with (the
// reference design calls for a large claim above the prose). It is the only
// sentence on this site not lifted verbatim from the owner - and it states no
// new fact: "Full Stack .NET Developer" is the title already shown in
// ProfileCard, and the three adjectives are the owner's own, from the intro
// paragraph above. src/data/about.test.ts pins both, so a rewrite that
// smuggles in a fresh claim fails the suite rather than shipping quietly.
export const ABOUT_STATEMENT: Localized<TextSegment[]> = {
  tr: [
    { text: 'Full Stack .NET Developer', emphasis: 'italic', lang: 'en' },
    { text: ' olarak ' },
    { text: 'ölçeklenebilir, performanslı ve sürdürülebilir', emphasis: 'bold' },
    { text: ' sistemler kuruyorum.' },
  ],
  en: [
    { text: 'I build ' },
    { text: 'scalable, performant and maintainable', emphasis: 'bold' },
    { text: ' systems as a ' },
    { text: 'Full Stack .NET Developer', emphasis: 'italic' },
    { text: '.' },
  ],
}

// Which paragraph the section teases before "Tam metni oku". Index 0 is
// already the hero's paragraph and index 1 is what the Stacks section covers,
// so this one is the first that repeats nothing.
export const ABOUT_TEASER: Localized<AboutParagraph> = {
  tr: ABOUT_PARAGRAPHS.tr[2],
  en: ABOUT_PARAGRAPHS.en[2],
}

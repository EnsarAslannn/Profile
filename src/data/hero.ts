import erasmus from '../assets/2023.webp'
import brisa from '../assets/2024.webp'
import altitudelogShot from '../assets/altitudelog/homePage.webp'
import dolfinShot from '../assets/dolfin/homePage.webp'
import portrait from '../assets/ea.webp'
import takeauctionShot from '../assets/takeauction/homePage.webp'
import type { Localized } from '../i18n/language'
import type { TextSegment } from './about'

// Landing-screen content for the redesign. The reference hero is a two-line
// wordmark, one emphasised paragraph and two calls to action.

// Only the second line translates. The first is the owner's name, which is
// the same in every language, and both lines carry whitespace-nowrap - see
// CLAUDE.md's type scale for why "ENSAR ASLAN" must not wrap.
export const HERO_TITLE_LINES: Localized<readonly string[]> = {
  tr: ['ENSAR ASLAN', 'PORTFOLYO'],
  en: ['ENSAR ASLAN', 'PORTFOLIO'],
}

// One CV per language - two genuinely different documents, not a translated
// filename. The Turkish one declares /Lang (tr) and its sections read
// Deneyim / Projeler / Yetenekler; the English one declares /Lang (en) and
// reads Summary / Education / Experience / Projects / Skills. Handing an
// English reader the Turkish PDF would be worse than offering no button.
//
// Served straight from public/, so the paths are literals rather than Vite
// imports: bundling a PDF through the asset pipeline would hash its name, and
// a CV is a thing people expect to land in their downloads folder called
// something recognisable. Neither TypeScript nor Vite can tell you when one of
// these breaks, so src/data/hero.test.ts reads both off disk and checks the
// %PDF- magic bytes - that is what stops a button quietly becoming a 404.
export const CV_FILE: Localized<string> = {
  tr: '/EnsarAslanCV.pdf',
  en: '/EnsarAslanCV-EN.pdf',
}

// Owner-supplied, verbatim. It used to be a slice of the Hakkımda opening;
// the owner replaced it with its own sentence, so this is now the source of
// truth rather than a derivation - and HERO_PARAGRAPH below is what
// src/data/hero.test.ts rejoins the segments against, character for
// character, so the emphasis can never drift into re-worded copy.
export const HERO_PARAGRAPH: Localized<string> = {
  tr: 'Merhaba, ben Ensar Aslan. .NET Developer olarak modern web uygulamaları geliştiriyor, kullandığım teknolojilerin arkasındaki mantığı öğrenmeye ve kendimi sürekli geliştirmeye odaklanıyorum.',
  en: 'Hello, I am Ensar Aslan. I build modern web applications as a .NET Developer, focused on learning the reasoning behind the technologies I use and on improving myself continuously.',
}

export const HERO_DESCRIPTION: Localized<TextSegment[]> = {
  tr: [
    { text: 'Merhaba, ben Ensar Aslan. ' },
    // lang="en": an English job title inside Turkish copy. Not a casing fix
    // here (the hero paragraph is not uppercased) but a pronunciation one.
    { text: '.NET Developer', emphasis: 'bold', lang: 'en' },
    {
      text:
        ' olarak modern web uygulamaları geliştiriyor, kullandığım teknolojilerin arkasındaki mantığı öğrenmeye ve kendimi sürekli geliştirmeye odaklanıyorum.',
    },
  ],
  en: [
    { text: 'Hello, I am Ensar Aslan. I build modern web applications as a ' },
    { text: '.NET Developer', emphasis: 'bold' },
    {
      text:
        ', focused on learning the reasoning behind the technologies I use and on improving myself continuously.',
    },
  ],
}

export type HeroImage = {
  id: string
  src: string
  width: number
  height: number
}

// The six images the owner nominated for the scrolling columns, with true
// measured intrinsic sizes. Deliberately a hand-maintained table rather than
// an import.meta.glob: these are specific files chosen by name, not a folder
// sweep, and the columns need real dimensions.
//
// The ratios run from 0.75 (the portrait) to 1.82 (the project screenshots),
// which is why HeroGallery letterboxes rather than crops - see the note there.
export const HERO_IMAGES: HeroImage[] = [
  { id: 'portrait', src: portrait, width: 640, height: 853 },
  { id: 'dolfin', src: dolfinShot, width: 1600, height: 880 },
  { id: 'altitudelog', src: altitudelogShot, width: 1600, height: 878 },
  { id: 'takeauction', src: takeauctionShot, width: 1600, height: 875 },
  { id: 'erasmus', src: erasmus, width: 614, height: 767 },
  { id: 'brisa', src: brisa, width: 574, height: 767 },
]

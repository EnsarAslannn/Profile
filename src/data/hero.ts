import erasmus from '../assets/2023.webp'
import brisa from '../assets/2024.webp'
import altitudelogShot from '../assets/altitudelog/homePage.webp'
import dolfinShot from '../assets/dolfin/homePage.webp'
import portrait from '../assets/ea.webp'
import takeauctionShot from '../assets/takeauction/homePage.webp'
import type { TextSegment } from './about'

// Landing-screen content for the redesign. The reference hero is a two-line
// wordmark, one emphasised paragraph and two calls to action.

export const HERO_TITLE_LINES = ['ENSAR ASLAN', 'PORTFOLYO'] as const

// Served straight from public/, so the path is a literal rather than a Vite
// import: bundling a PDF through the asset pipeline would hash its name, and
// a CV is a thing people expect to land in their downloads folder called
// something recognisable. src/data/hero.test.ts asserts the file exists.
export const CV_FILE = '/EnsarAslanCV.pdf'

// Owner-supplied, verbatim. It used to be a slice of the Hakkımda opening;
// the owner replaced it with its own sentence, so this is now the source of
// truth rather than a derivation - and HERO_PARAGRAPH below is what
// src/data/hero.test.ts rejoins the segments against, character for
// character, so the emphasis can never drift into re-worded copy.
export const HERO_PARAGRAPH =
  'Merhaba, ben Ensar Aslan. .NET Developer olarak modern web uygulamaları geliştiriyor, kullandığım teknolojilerin arkasındaki mantığı öğrenmeye ve kendimi sürekli geliştirmeye odaklanıyorum.'

export const HERO_DESCRIPTION: TextSegment[] = [
  { text: 'Merhaba, ben Ensar Aslan. ' },
  // lang="en": an English job title inside Turkish copy. Not a casing fix
  // here (the hero paragraph is not uppercased) but a pronunciation one.
  { text: '.NET Developer', emphasis: 'bold', lang: 'en' },
  {
    text:
      ' olarak modern web uygulamaları geliştiriyor, kullandığım teknolojilerin arkasındaki mantığı öğrenmeye ve kendimi sürekli geliştirmeye odaklanıyorum.',
  },
]

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

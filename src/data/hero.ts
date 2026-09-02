import erasmus from '../assets/2023.webp'
import brisa from '../assets/2024.webp'
import altitudelogShot from '../assets/altitudelog/homePage.webp'
import dolfinShot from '../assets/dolfin/homePage.webp'
import portrait from '../assets/ea.webp'
import takeauctionShot from '../assets/takeauction/homePage.webp'
import type { Localized } from '../i18n/language'
import type { TextSegment } from './about'


export const HERO_TITLE_LINES: Localized<readonly string[]> = {
  tr: ['ENSAR ASLAN', 'PORTFOLYO'],
  en: ['ENSAR ASLAN', 'PORTFOLIO'],
}

export const CV_FILE: Localized<string> = {
  tr: '/EnsarAslanCV.pdf',
  en: '/EnsarAslanCV-EN.pdf',
}

export const HERO_PARAGRAPH: Localized<string> = {
  tr: 'Merhaba, ben Ensar Aslan. .NET Developer olarak modern web uygulamaları geliştiriyor, kullandığım teknolojilerin arkasındaki mantığı öğrenmeye ve kendimi sürekli geliştirmeye odaklanıyorum.',
  en: 'Hello, I am Ensar Aslan. I build modern web applications as a .NET Developer, focused on learning the reasoning behind the technologies I use and on improving myself continuously.',
}

export const HERO_DESCRIPTION: Localized<TextSegment[]> = {
  tr: [
    { text: 'Merhaba, ben Ensar Aslan. ' },
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

export const HERO_IMAGES: HeroImage[] = [
  { id: 'portrait', src: portrait, width: 640, height: 853 },
  { id: 'dolfin', src: dolfinShot, width: 1600, height: 880 },
  { id: 'altitudelog', src: altitudelogShot, width: 1600, height: 878 },
  { id: 'takeauction', src: takeauctionShot, width: 1600, height: 875 },
  { id: 'erasmus', src: erasmus, width: 614, height: 767 },
  { id: 'brisa', src: brisa, width: 574, height: 767 },
]

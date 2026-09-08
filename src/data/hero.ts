import erasmus from '../assets/2023.webp'
import brisa from '../assets/2024.webp'
import altitudelogShot from '../assets/altitudelog/homePage.webp'
import dolfinShot from '../assets/dolfin/homePage.webp'
import portrait from '../assets/ea.webp'
import takeauctionShot from '../assets/takeauction/homePage.webp'
import type { Localized } from '../i18n/language'
import type { TextSegment } from './about'
import { SITE_GROUP, srcSetFor } from './imageSrcSet'


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
  srcSet: string | undefined
}

const heroImage = (
  id: string,
  key: string,
  src: string,
  width: number,
  height: number,
): HeroImage => ({ id, src, width, height, srcSet: srcSetFor(key, { src, width }) })

export const HERO_IMAGES: HeroImage[] = [
  heroImage('portrait', `${SITE_GROUP}/ea`, portrait, 640, 853),
  heroImage('dolfin', 'dolfin/homePage', dolfinShot, 1600, 880),
  heroImage('altitudelog', 'altitudelog/homePage', altitudelogShot, 1600, 878),
  heroImage('takeauction', 'takeauction/homePage', takeauctionShot, 1600, 875),
  heroImage('erasmus', `${SITE_GROUP}/2023`, erasmus, 614, 767),
  heroImage('brisa', `${SITE_GROUP}/2024`, brisa, 574, 767),
]

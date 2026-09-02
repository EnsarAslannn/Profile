import type { Localized } from './language'

export type UiStrings = {
  skipToContent: string
  navAriaLabel: string
  languageGroupAriaLabel: string
  languageSwitchTo: string

  sectionAbout: string
  sectionProjects: string
  sectionResume: string
  sectionStacks: string
  sectionContact: string

  resumeSubtitle: string
  contactSubtitle: string

  heroContact: string
  heroProjects: string
  heroCv: string

  aboutReadFull: string
  aboutPageTitle: string

  back: string
  backToProjects: string
  openProject: string
  technologiesUsed: string
  screensLabel: string
  projectScreenshot: (title: string, index: number) => string

  copyAriaLabel: (label: string) => string
  copiedAriaLabel: (label: string) => string
  copyAnnouncement: (label: string) => string
  copyFailedAnnouncement: (label: string) => string

  availability: string
  rightsReserved: string
}

export const UI: Localized<UiStrings> = {
  tr: {
    skipToContent: 'İçeriğe geç',
    navAriaLabel: 'Bölüm gezinmesi',
    languageGroupAriaLabel: 'Dil seçimi',
    languageSwitchTo: 'Türkçe',

    sectionAbout: 'Hakkımda',
    sectionProjects: 'Projeler',
    sectionResume: 'Özgeçmiş',
    sectionStacks: 'Stacks',
    sectionContact: 'İletişim',

    resumeSubtitle:
      'Yazılım yolculuğumda edindiğim eğitim ve iş deneyimlerinin zaman çizelgesi.',
    contactSubtitle: 'Yeni bir proje ya da ekip fırsatı için doğrudan yazabilirsiniz.',

    heroContact: 'İletişime geç',
    heroProjects: 'Projeleri keşfet',
    heroCv: 'CV indir',

    aboutReadFull: 'Tam metni oku',
    aboutPageTitle: 'Hakkımda',

    back: 'Geri',
    backToProjects: 'Projelere dön',
    openProject: 'Projeyi aç',
    technologiesUsed: 'Kullanılan teknolojiler',
    screensLabel: 'Ekran görüntüleri',
    projectScreenshot: (title, index) => `${title} ekran görüntüsü ${index}`,

    copyAriaLabel: (label) => `${label} kopyala`,
    copiedAriaLabel: (label) => `${label} kopyalandı`,
    copyAnnouncement: (label) => `${label} panoya kopyalandı`,
    copyFailedAnnouncement: (label) => `${label} kopyalanamadı`,

    availability: 'Yeni fırsatlara açık',
    rightsReserved: 'Tüm hakları saklıdır.',
  },
  en: {
    skipToContent: 'Skip to content',
    navAriaLabel: 'Section navigation',
    languageGroupAriaLabel: 'Language selection',
    languageSwitchTo: 'English',

    sectionAbout: 'About',
    sectionProjects: 'Projects',
    sectionResume: 'Resume',
    sectionStacks: 'Stacks',
    sectionContact: 'Contact',

    resumeSubtitle:
      'A timeline of the education and work experience gathered along my software journey.',
    contactSubtitle: 'Write to me directly about a new project or a team opportunity.',

    heroContact: 'Get in touch',
    heroProjects: 'Explore projects',
    heroCv: 'Download CV',

    aboutReadFull: 'Read the full text',
    aboutPageTitle: 'About',

    back: 'Back',
    backToProjects: 'Back to projects',
    openProject: 'Open the project',
    technologiesUsed: 'Technologies used',
    screensLabel: 'Screenshots',
    projectScreenshot: (title, index) => `${title} screenshot ${index}`,

    copyAriaLabel: (label) => `Copy ${label}`,
    copiedAriaLabel: (label) => `${label} copied`,
    copyAnnouncement: (label) => `${label} copied to the clipboard`,
    copyFailedAnnouncement: (label) => `${label} could not be copied`,

    availability: 'Open to new opportunities',
    rightsReserved: 'All rights reserved.',
  },
}

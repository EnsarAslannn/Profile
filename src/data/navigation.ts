// Single source of truth for section navigation, in page order. Its consumer
// is Navbar.tsx (the navbar was reinstated at the owner's request for the
// example.mp4 redesign, after having been removed in five-owner-changes
// Task 4 - the reference design has one and the owner asked for it back).
//
// Adding or removing a section means editing this file AND the component that
// renders it - src/pages/HomePage.tsx for the five body sections, or
// src/App.tsx for `iletisim`, which lives in the site chrome so that every
// route ends the same way. See CLAUDE.md's two-edit rule; src/App.test.tsx
// enforces set-equality between these anchors and the rendered sections.
export type NavLink = {
  anchor: string
  label: string
  // Set on labels that are English words. The navbar is CSS-uppercased and
  // the page is lang="tr", where casing maps i -> İ; it also stops a screen
  // reader pronouncing the label as Turkish. Turkish labels leave it unset -
  // "İletişim" -> "İLETİŞİM" is correct because the locale is Turkish.
  lang?: string
}

export const NAV_LINKS: NavLink[] = [
  { anchor: 'anasayfa', label: 'Anasayfa' },
  { anchor: 'hakkimda', label: 'Hakkımda' },
  { anchor: 'projeler', label: 'Projeler' },
  { anchor: 'ozgecmis', label: 'Özgeçmiş' },
  // The anchor stays Turkish (the section-contract slug rule, and it keeps
  // any shared /#yetenekler link alive); only the visible label follows the
  // heading the owner renamed to Stacks.
  { anchor: 'yetenekler', label: 'Stacks', lang: 'en' },
  { anchor: 'iletisim', label: 'İletişim' },
]

// Single source of truth for section navigation. Consumed by Navbar.tsx and
// Footer.tsx (via FooterNav.tsx) so the two never drift apart. Adding or
// removing a section means editing this file AND src/pages/HomePage.tsx -
// see CLAUDE.md's two-edit rule.
export type NavLink = {
  anchor: string
  label: string
}

export const NAV_LINKS: NavLink[] = [
  { anchor: 'hakkimda', label: 'Hakkımda' },
  { anchor: 'projeler', label: 'Projeler' },
  { anchor: 'ozgecmis', label: 'Özgeçmiş' },
]

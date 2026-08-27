// Single source of truth for section navigation. Its only consumer is
// FooterNav.tsx (there is no navbar - it was removed at the owner's request,
// five-owner-changes Task 4). Adding or removing a section means editing
// this file AND src/pages/HomePage.tsx - see CLAUDE.md's two-edit rule.
export type NavLink = {
  anchor: string
  label: string
}

export const NAV_LINKS: NavLink[] = [
  { anchor: 'hakkimda', label: 'Hakkımda' },
  { anchor: 'projeler', label: 'Projeler' },
  { anchor: 'ozgecmis', label: 'Özgeçmiş' },
]

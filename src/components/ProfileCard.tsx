import profilePhoto from '../assets/ea.webp'
import ContactList from './ContactList'
import SocialLinks from './SocialLinks'
import { SITE_NAME, SITE_ROLE } from '../lib/siteMeta'

export default function ProfileCard() {
  return (
    <div
      data-reveal
      className="mx-auto w-full max-w-xs rounded-2xl border border-line-subtle bg-surface-raised p-6 shadow-sm shadow-black/5 sm:p-8 lg:mx-0 lg:max-w-none lg:p-5 xl:p-6"
    >
      <img
        src={profilePhoto}
        alt="Ensar Aslan"
        width={640}
        height={853}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="aspect-[3/4] w-full rounded-xl object-cover ring-1 ring-line-subtle"
      />
      <p className="mt-6 text-xl font-semibold tracking-tight text-ink-strong">{SITE_NAME}</p>
      <p className="mt-1 text-sm font-medium text-accent-base">{SITE_ROLE}</p>
      <div className="mt-6 h-px w-full bg-line-subtle" />
      <ContactList />
      <SocialLinks />
    </div>
  )
}

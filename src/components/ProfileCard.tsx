import profilePhoto from '../assets/ea.webp'
import ContactList from './ContactList'
import SocialLinks from './SocialLinks'

export default function ProfileCard() {
  return (
    <div className="mx-auto w-full max-w-xs rounded-2xl border border-navy-500 bg-navy-900 p-6 shadow-xl shadow-black/30 sm:p-8 lg:mx-0 xl:max-w-sm">
      <img
        src={profilePhoto}
        alt="Ensar Aslan"
        width={640}
        height={853}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="aspect-[3/4] w-full rounded-xl object-cover"
      />
      <p className="mt-6 text-xl font-semibold tracking-tight text-navy-100">Ensar Aslan</p>
      <p className="mt-1 text-sm font-medium text-accent-400">Full Stack .NET Developer</p>
      <div className="mt-6 h-px w-full bg-navy-700" />
      <ContactList />
      <SocialLinks />
    </div>
  )
}

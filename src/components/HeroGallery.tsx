import { HERO_IMAGES } from '../data/hero'

const LEFT_ORDER = ['portrait', 'takeauction', 'erasmus', 'dolfin', 'brisa', 'altitudelog']
const ROTATE_BY = Math.floor(LEFT_ORDER.length / 2)

const RIGHT_ORDER = [...LEFT_ORDER.slice(ROTATE_BY), ...LEFT_ORDER.slice(0, ROTATE_BY)]

const byId = (id: string) => {
  const image = HERO_IMAGES.find((candidate) => candidate.id === id)
  if (!image) throw new Error(`Unknown hero image: ${id}`)
  return image
}

const COLUMNS = [
  { id: 'up', animation: 'animate-drift-up', order: LEFT_ORDER },
  { id: 'down', animation: 'animate-drift-down', order: RIGHT_ORDER },
]

const MASK =
  '[mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)]'

export default function HeroGallery() {
  return (
    <div
      aria-hidden="true"
      className={`grid h-[60vh] grid-cols-2 gap-4 overflow-hidden sm:gap-5 lg:h-[78vh] ${MASK}`}
    >
      {COLUMNS.map((column) => (
        <div key={column.id} className="min-h-0">
          <div className={`flex flex-col gap-4 sm:gap-5 ${column.animation} motion-reduce:animate-none`}>
            {[0, 1].map((copy) =>
              column.order.map((imageId) => {
                const image = byId(imageId)
                return (
                  <div
                    key={`${copy}-${image.id}`}
                    className="overflow-hidden rounded-2xl border border-line-subtle bg-surface-raised shadow-sm shadow-black/5"
                  >
                    <img
                      src={image.src}
                      alt=""
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full"
                    />
                  </div>
                )
              }),
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

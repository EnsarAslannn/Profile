import { HERO_IMAGES } from '../data/hero'

// The reference hero's two image columns, drifting in opposite directions.
//
// Each column renders its tiles TWICE and travels exactly 50% (see the
// --animate-drift-* note in src/index.css); that is what makes the loop
// seamless, so neither the copy count nor the distance can be changed alone.
//
// LEFT_ORDER is the owner's own running order, written by image id rather
// than by index into HERO_IMAGES - reordering that array must not silently
// reshuffle the columns. The right column is the same sequence rotated by
// half its length, so the two are maximally out of phase: no position holds
// the same image in both columns, which is what keeps a picture from ever
// sitting beside a copy of itself. HeroGallery.test.tsx pins that property
// rather than the literal sequence, so a future reorder cannot line them up.
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

// Fades the strip into the page ground at both ends instead of letting tiles
// be chopped off by a hard edge. Written twice for Safari versions that still
// only take the prefixed property.
const MASK =
  '[mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)]'

export default function HeroGallery() {
  return (
    // Decorative by design: the owner's name is the page h1 and the project
    // shots are reachable as real content in Projeler, so this collage adds
    // no information a screen reader would otherwise miss - and each tile is
    // rendered twice, which would mean hearing the same list through twice.
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
                  // No fixed aspect ratio and no object-fit at all: the tile is
                  // exactly as tall as the image is, so every image fills its
                  // card edge to edge with nothing cropped and nothing
                  // letterboxed. Tiles therefore differ in height - the owner
                  // asked for that explicitly, after rounds of uniform square
                  // tiles that had to crop or letterbox a 0.75 portrait and a
                  // 1.83 screenshot into the same box.
                  //
                  // `h-auto` next to the width/height attributes is what keeps
                  // the browser reserving the right space from the intrinsic
                  // ratio before the image decodes, so nothing shifts.
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

import { SKILL_GROUPS } from './skills'

// The scrolling text strip that separates sections in the reference design
// (example.mp4). It runs the Yetenekler technologies, every one of them, in
// the order the section itself lists them - group by group, entry by entry.
//
// DERIVED, never re-typed. That matters twice over: the strip can never drift
// out of step with the section a few screens further down, and it inherits
// src/components/Skills.test.tsx's vouching rule for free - a technology has
// to be backed up elsewhere in the repo before it can appear anywhere,
// including here.
//
// This replaced a hand-written list of the owner's own adjectives, which was
// the earlier answer to "the reference runs personal mottos here and nobody
// supplied any". Deriving from the stack is the better answer: it needs no
// editorial judgement at all.
export const MARQUEE_WORDS: string[] = SKILL_GROUPS.flatMap((group) => group.items)

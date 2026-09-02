import { SKILL_GROUPS } from './skills'

export const MARQUEE_WORDS: string[] = SKILL_GROUPS.flatMap((group) => group.items)

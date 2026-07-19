import { z } from 'astro/zod';

const entrySchema = z.object({
  handle: z.string(),
  name: z.string().optional(),
  looking: z.string(),
  contact: z.string(),
});
const boardSchema = z.object({ entries: z.array(entrySchema) });

export type TeamEntry = z.infer<typeof entrySchema>;

export function parseTeamBoard(raw: unknown): TeamEntry[] {
  return boardSchema.parse(raw).entries;
}

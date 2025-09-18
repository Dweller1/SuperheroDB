import { z } from "zod";

export const SuperheroSchema = z.object({
  nickname: z.string(),
  realName: z.string(),
  originDescription: z.string(),
  superpowers: z.array(z.string()),
  catchPhrase: z.string(),
  images: z.array(z.string()).default([]),
});

export type SuperheroDto = z.infer<typeof SuperheroSchema>;

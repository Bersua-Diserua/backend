import { z } from "zod"
import { BadRequest } from "../error"

export function validateBadRequest<TSchema extends z.ZodTypeAny>(
  data: unknown,
  schema: TSchema
) {
  const validated = schema.safeParse(data)
  if (!validated.success)
    throw new BadRequest(null, null, { context: validated.error })
  return validated.data as z.infer<typeof schema>
}

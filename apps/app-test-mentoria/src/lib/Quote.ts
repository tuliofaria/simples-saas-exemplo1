import { z } from "zod";

export const QuoteSchema = z.object({ quote: z.string().min(1) });
export const QuoteSchemaEdit = QuoteSchema.extend({ id: z.number() });

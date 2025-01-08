import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amount: z.number().positive().multipleOf(0.01),
  category: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  type: z.enum(["income", "expense"]),
});

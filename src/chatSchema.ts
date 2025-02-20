import { z } from "zod";

export const chatSchema = z.object({
  text: z.string().min(1, "Text cannot be empty").max(500, "Text is too long"),
  language: z.string().min(1, "Please select a language")
});

export type ChatSchema = z.infer<typeof chatSchema>;

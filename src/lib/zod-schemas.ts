import { z } from 'zod'

// Required variables that must appear in the template
const requiredVars = ['{{scores}}', '{{top_category}}', '{{name}}'] as const

// AI Prompts validation schemas (canonical single-column: ai_prompt)
export const aiPromptCreateSchema = z.object({
  quiz_id: z.string().uuid('Invalid quiz ID format'),
  lang: z.string().min(2, 'Language code must be at least 2 characters').max(5, 'Language code too long'),
  ai_prompt: z.string().min(10, 'Prompt must be at least 10 characters').refine(
    (val) => requiredVars.every((v) => val.includes(v)),
    `Prompt must contain required variables: ${requiredVars.join(', ')}`
  ),
})

export const aiPromptUpdateSchema = aiPromptCreateSchema.extend({
  id: z.string().uuid('Invalid prompt ID format').optional()
})

export const aiPromptDeleteSchema = z.object({
  id: z.string().uuid('Invalid prompt ID format'),
  quiz_id: z.string().uuid('Invalid quiz ID format')
})

export type AIPromptCreate = z.infer<typeof aiPromptCreateSchema>
export type AIPromptUpdate = z.infer<typeof aiPromptUpdateSchema>
export type AIPromptDelete = z.infer<typeof aiPromptDeleteSchema>

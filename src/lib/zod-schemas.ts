import { z } from 'zod'

// AI Prompts validation schemas
export const aiPromptCreateSchema = z.object({
  quiz_id: z.string().uuid('Invalid quiz ID format'),
  lang: z.string().min(2, 'Language code must be at least 2 characters').max(5, 'Language code too long'),
  system_prompt: z.string().min(10, 'System prompt must be at least 10 characters'),
  user_prompt: z.string().min(10, 'User prompt must be at least 10 characters')
    .refine(
      (val) => val.includes('{{scores}}') && val.includes('{{top_category}}') && val.includes('{{name}}'),
      'User prompt must contain required variables: {{scores}}, {{top_category}}, {{name}}'
    ),
  ai_provider: z.string().optional().default('openai'),
  ai_model: z.string().optional().default('gpt-4o')
})

export const aiPromptUpdateSchema = aiPromptCreateSchema.extend({
  id: z.string().uuid('Invalid prompt ID format')
})

export const aiPromptDeleteSchema = z.object({
  id: z.string().uuid('Invalid prompt ID format'),
  quiz_id: z.string().uuid('Invalid quiz ID format')
})

export type AIPromptCreate = z.infer<typeof aiPromptCreateSchema>
export type AIPromptUpdate = z.infer<typeof aiPromptUpdateSchema>
export type AIPromptDelete = z.infer<typeof aiPromptDeleteSchema>

// Basic types for quiz functionality
export interface Question {
  id: string
  quiz_id: string
  order: number
  type: 'multiple_choice' | 'text' | 'scale'
  key: string
  help_text?: string
}

export interface Answer {
  question_id: string
  value: string | number
  selected_options?: string[]
}

export interface QuizSession {
  id: string
  quiz_id: string
  answers: Record<string, Answer>
  completed_at?: string
  created_at: string
  updated_at: string
}

export type QuestionType = 'multiple_choice' | 'text' | 'scale'

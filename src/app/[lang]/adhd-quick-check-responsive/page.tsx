import React from 'react'
import QuizPage from './quiz/quiz-client'

export default function Page({ params }: any) {
  return <QuizPage lang={params.lang} />
}

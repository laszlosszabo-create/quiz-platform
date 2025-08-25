import { Database } from '@/types/database'

type Translation = Database['public']['Tables']['quiz_translations']['Row']

/**
 * Get translation value with fallback to default language
 */
export function getTranslation(
  translations: Translation[],
  lang: string,
  fieldKey: string,
  defaultLang: string = 'hu'
): string {
  // Simple in-memory throttle to avoid log spam for missing keys
  const globalAny: any = globalThis as any
  if (!globalAny.__missingTranslationCounts) {
    globalAny.__missingTranslationCounts = {}
  }
  const counter = globalAny.__missingTranslationCounts
  // Try requested language first
  const translation = translations.find(
    t => t.lang === lang && t.field_key === fieldKey
  )
  
  if (translation?.value) {
    return translation.value
  }
  
  // Fallback to default language
  if (lang !== defaultLang) {
    const fallback = translations.find(
      t => t.lang === defaultLang && t.field_key === fieldKey
    )
    
    if (fallback?.value) {
      return fallback.value
    }
  }
  
  // Ultimate fallback - return field key with warning
  const keySig = `${lang}::${fieldKey}`
  counter[keySig] = (counter[keySig] || 0) + 1
  if (counter[keySig] <= 3) {
    console.warn(`❌ Missing translation → fallback to default_lang: ${defaultLang} | field_key: ${fieldKey} | requested_lang: ${lang} (count=${counter[keySig]})`)
    if (counter[keySig] === 3) {
      console.warn('🔇 Further missing translation logs suppressed for', keySig)
    }
  }
  return `[${fieldKey}]`
}

/**
 * Get multiple translations as an object
 */
export function getTranslations(
  translations: Translation[],
  lang: string,
  fieldKeys: string[],
  defaultLang: string = 'hu'
): Record<string, string> {
  const result: Record<string, string> = {}
  
  for (const fieldKey of fieldKeys) {
    result[fieldKey] = getTranslation(translations, lang, fieldKey, defaultLang)
  }
  
  return result
}

/**
 * Get question translations with pattern matching
 */
export function getQuestionTranslations(
  translations: Translation[],
  lang: string,
  questionKey: string,
  defaultLang: string = 'hu'
): {
  text: string
  help?: string
} {
  return {
    text: getTranslation(translations, lang, `question:${questionKey}:text`, defaultLang),
    help: getTranslation(translations, lang, `question:${questionKey}:help`, defaultLang)
  }
}

/**
 * Get option translations for a question
 */
export function getOptionTranslations(
  translations: Translation[],
  lang: string,
  optionKeys: string[],
  defaultLang: string = 'hu'
): Record<string, string> {
  const result: Record<string, string> = {}
  
  for (const optionKey of optionKeys) {
    result[optionKey] = getTranslation(
      translations, 
      lang, 
      `option:${optionKey}:label`, 
      defaultLang
    )
  }
  
  return result
}

// Email template system with i18n support and variable substitution
import { getSupabaseAdmin } from '@/lib/supabase-config'

// Get admin client for template operations
const supabaseAdmin = getSupabaseAdmin()

export interface EmailTemplate {
  template_key: string
  lang: string
  subject: string
  html_content: string
  text_content?: string
  variables: string[] // Required variables like ['name', 'scores', 'result_url']
}

export interface EmailVariables {
  name?: string
  first_name?: string
  scores?: any
  result_url?: string
  download_url?: string
  quiz_title?: string
  quiz_slug?: string
  [key: string]: any
}

// Built-in templates (will be moved to database in Module 6)
const BUILTIN_TEMPLATES: Record<string, Record<string, EmailTemplate>> = {
  day_0: {
    hu: {
      template_key: 'day_0',
      lang: 'hu',
      subject: '🎯 Az ADHD teszted eredménye + Exkluzív ajánlat',
      variables: ['name', 'result_url', 'download_url'],
      html_content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Köszönjük, {{name}}!</h1>
          
          <p>Az ADHD gyorsteszted sikeresen elkészült. Itt találod a részletes eredményedet:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📊 A teszted eredménye</h3>
            <a href="{{result_url}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Eredmény megtekintése
            </a>
          </div>
          
          <h3>🎁 Exkluzív ajánlat számodra</h3>
          <p>Mivel elvégezted a tesztet, <strong>25% kedvezményt</strong> kapasz az ADHD szakértői konzultációra!</p>
          
          <a href="{{download_url}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">
            PDF letöltése + Konzultáció foglalás
          </a>
          
          <hr style="margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6b7280;">
            Ez egy automatikus email. Ha kérdésed van, válaszolj erre az emailre.
          </p>
        </div>
      `,
      text_content: `
Köszönjük, {{name}}!

Az ADHD gyorsteszted sikeresen elkészült. Itt találod a részletes eredményedet:

📊 A teszted eredménye: {{result_url}}

🎁 Exkluzív ajánlat számodra
Mivel elvégezted a tesztet, 25% kedvezményt kapasz az ADHD szakértői konzultációra!

PDF letöltése + Konzultáció foglalás: {{download_url}}

Ez egy automatikus email. Ha kérdésed van, válaszolj erre az emailre.
      `
    },
    en: {
      template_key: 'day_0',
      lang: 'en',
      subject: '🎯 Your ADHD Test Results + Exclusive Offer',
      variables: ['name', 'result_url', 'download_url'],
      html_content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Thank you, {{name}}!</h1>
          
          <p>Your ADHD quick test has been completed successfully. Here are your detailed results:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>📊 Your Test Results</h3>
            <a href="{{result_url}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Results
            </a>
          </div>
          
          <h3>🎁 Exclusive Offer For You</h3>
          <p>Since you completed the test, you get <strong>25% discount</strong> on ADHD expert consultation!</p>
          
          <a href="{{download_url}}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0;">
            Download PDF + Book Consultation
          </a>
          
          <hr style="margin: 30px 0;">
          
          <p style="font-size: 14px; color: #6b7280;">
            This is an automated email. If you have questions, reply to this email.
          </p>
        </div>
      `,
      text_content: `
Thank you, {{name}}!

Your ADHD quick test has been completed successfully. Here are your detailed results:

📊 Your Test Results: {{result_url}}

🎁 Exclusive Offer For You
Since you completed the test, you get 25% discount on ADHD expert consultation!

Download PDF + Book Consultation: {{download_url}}

This is an automated email. If you have questions, reply to this email.
      `
    }
  },
  day_2: {
    hu: {
      template_key: 'day_2',
      lang: 'hu',
      subject: '💡 ADHD tippek + Mit jelent a teszted eredménye?',
      variables: ['name', 'result_url'],
      html_content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Szia {{name}}!</h1>
          
          <p>Pár napja elvégezted az ADHD tesztet. Reméljük, hasznos volt!</p>
          
          <h3>💡 5 praktikus tipp ADHD-val élőknek</h3>
          <ol style="line-height: 1.6;">
            <li><strong>Időkezelés:</strong> Használj timer-t 25 perces munkablokkokhoz (Pomodoro technika)</li>
            <li><strong>Szervezés:</strong> Készíts vizuális emlékeztetőket és listákat</li>
            <li><strong>Mozgás:</strong> Napi 30 perc sport segít a koncentrációban</li>
            <li><strong>Környezet:</strong> Csökkentsd a zavaró tényezőket munka közben</li>
            <li><strong>Rutinok:</strong> Alakíts ki állandó napi rutinokat</li>
          </ol>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🔍 Szeretnéd mélyebben megérteni az eredményedet?</h3>
            <p>Szakértői konzultáción személyre szabott stratégiákat kapsz.</p>
            <a href="{{result_url}}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Konzultáció foglalás 25% kedvezménnyel
            </a>
          </div>
        </div>
      `,
      text_content: `
Szia {{name}}!

Pár napja elvégezted az ADHD tesztet. Reméljük, hasznos volt!

💡 5 praktikus tipp ADHD-val élőknek:
1. Időkezelés: Használj timer-t 25 perces munkablokkokhoz (Pomodoro technika)
2. Szervezés: Készíts vizuális emlékeztetőket és listákat
3. Mozgás: Napi 30 perc sport segít a koncentrációban
4. Környezet: Csökkentsd a zavaró tényezőket munka közben
5. Rutinok: Alakíts ki állandó napi rutinokat

🔍 Szeretnéd mélyebben megérteni az eredményedet?
Szakértői konzultáción személyre szabott stratégiákat kapsz.

Konzultáció foglalás 25% kedvezménnyel: {{result_url}}
      `
    },
    en: {
      template_key: 'day_2',
      lang: 'en',
      subject: '💡 ADHD Tips + Understanding Your Test Results',
      variables: ['name', 'result_url'],
      html_content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Hi {{name}}!</h1>
          
          <p>A few days ago you completed the ADHD test. We hope it was helpful!</p>
          
          <h3>💡 5 Practical Tips for People with ADHD</h3>
          <ol style="line-height: 1.6;">
            <li><strong>Time Management:</strong> Use timers for 25-minute work blocks (Pomodoro technique)</li>
            <li><strong>Organization:</strong> Create visual reminders and lists</li>
            <li><strong>Exercise:</strong> 30 minutes of daily exercise helps concentration</li>
            <li><strong>Environment:</strong> Reduce distracting factors while working</li>
            <li><strong>Routines:</strong> Establish consistent daily routines</li>
          </ol>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🔍 Want to understand your results deeper?</h3>
            <p>Get personalized strategies in an expert consultation.</p>
            <a href="{{result_url}}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Book Consultation with 25% Discount
            </a>
          </div>
        </div>
      `,
      text_content: `
Hi {{name}}!

A few days ago you completed the ADHD test. We hope it was helpful!

💡 5 Practical Tips for People with ADHD:
1. Time Management: Use timers for 25-minute work blocks (Pomodoro technique)
2. Organization: Create visual reminders and lists
3. Exercise: 30 minutes of daily exercise helps concentration
4. Environment: Reduce distracting factors while working
5. Routines: Establish consistent daily routines

🔍 Want to understand your results deeper?
Get personalized strategies in an expert consultation.

Book Consultation with 25% Discount: {{result_url}}
      `
    }
  },
  day_5: {
    hu: {
      template_key: 'day_5',
      lang: 'hu',
      subject: '🚀 Utolsó lehetőség: 25% kedvezmény az ADHD konzultációra',
      variables: ['name', 'download_url'],
      html_content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">⏰ Utolsó nap, {{name}}!</h1>
          
          <p>Ez az utolsó lehetőséged, hogy <strong>25% kedvezménnyel</strong> foglalj ADHD szakértői konzultációt.</p>
          
          <div style="background: #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🎯 Mit kapsz a konzultáción?</h3>
            <ul style="line-height: 1.8;">
              <li>✅ Személyre szabott ADHD stratégiák</li>
              <li>✅ Életstílus optimalizálási tippek</li>
              <li>✅ Koncentráció javító technikák</li>
              <li>✅ Időgazdálkodási módszerek</li>
              <li>✅ Stressz kezelési eszközök</li>
            </ul>
          </div>
          
          <p style="font-size: 18px; font-weight: bold; color: #dc2626;">
            🔥 Csak ma: 25% kedvezmény!
          </p>
          
          <a href="{{download_url}}" style="background: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">
            Konzultáció foglalás most 25% kedvezménnyel
          </a>
          
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            Ez az ajánlat holnap éjfélkor lejár. Ne hagyd ki ezt a lehetőséget!
          </p>
        </div>
      `,
      text_content: `
⏰ Utolsó nap, {{name}}!

Ez az utolsó lehetőséged, hogy 25% kedvezménnyel foglalj ADHD szakértői konzultációt.

🎯 Mit kapsz a konzultáción?
✅ Személyre szabott ADHD stratégiák
✅ Életstílus optimalizálási tippek
✅ Koncentráció javító technikák
✅ Időgazdálkodási módszerek
✅ Stressz kezelési eszközök

🔥 Csak ma: 25% kedvezmény!

Konzultáció foglalás most 25% kedvezménnyel: {{download_url}}

Ez az ajánlat holnap éjfélkor lejár. Ne hagyd ki ezt a lehetőséget!
      `
    },
    en: {
      template_key: 'day_5',
      lang: 'en',
      subject: '🚀 Last Chance: 25% Off ADHD Consultation',
      variables: ['name', 'download_url'],
      html_content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">⏰ Last day, {{name}}!</h1>
          
          <p>This is your last chance to book an ADHD expert consultation with <strong>25% discount</strong>.</p>
          
          <div style="background: #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🎯 What you get in the consultation:</h3>
            <ul style="line-height: 1.8;">
              <li>✅ Personalized ADHD strategies</li>
              <li>✅ Lifestyle optimization tips</li>
              <li>✅ Concentration improvement techniques</li>
              <li>✅ Time management methods</li>
              <li>✅ Stress management tools</li>
            </ul>
          </div>
          
          <p style="font-size: 18px; font-weight: bold; color: #dc2626;">
            🔥 Today only: 25% discount!
          </p>
          
          <a href="{{download_url}}" style="background: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 18px; font-weight: bold;">
            Book Consultation Now with 25% Off
          </a>
          
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            This offer expires tomorrow at midnight. Don't miss this opportunity!
          </p>
        </div>
      `,
      text_content: `
⏰ Last day, {{name}}!

This is your last chance to book an ADHD expert consultation with 25% discount.

🎯 What you get in the consultation:
✅ Personalized ADHD strategies
✅ Lifestyle optimization tips
✅ Concentration improvement techniques
✅ Time management methods
✅ Stress management tools

🔥 Today only: 25% discount!

Book Consultation Now with 25% Off: {{download_url}}

This offer expires tomorrow at midnight. Don't miss this opportunity!
      `
    }
  }
}

/**
 * Get template with fallback to default language
 */
export async function getEmailTemplate(
  templateKey: string, 
  lang: string = 'hu',
  defaultLang: string = 'hu'
): Promise<EmailTemplate | null> {
  // Try requested language first
  let template = BUILTIN_TEMPLATES[templateKey]?.[lang]
  
  // Fallback to default language
  if (!template && lang !== defaultLang) {
    template = BUILTIN_TEMPLATES[templateKey]?.[defaultLang]
    console.log(`Template fallback: ${templateKey}/${lang} → ${templateKey}/${defaultLang}`)
  }
  
  if (!template) {
    console.error(`Template not found: ${templateKey}/${lang} (no fallback available)`)
    return null
  }
  
  return template
}

/**
 * Replace template variables with actual values
 */
export function renderTemplate(template: EmailTemplate, variables: EmailVariables): {
  subject: string
  html_content: string
  text_content: string
  missing_variables: string[]
} {
  const missing_variables: string[] = []
  
  // Check for missing required variables
  for (const requiredVar of template.variables) {
    if (!variables[requiredVar] || variables[requiredVar] === '') {
      missing_variables.push(requiredVar)
    }
  }
  
  // Replace variables in subject
  let subject = template.subject
  let html_content = template.html_content
  let text_content = template.text_content || ''
  
  // Replace all variables
  for (const [key, value] of Object.entries(variables)) {
    if (value !== undefined && value !== null) {
      const placeholder = `{{${key}}}`
      const stringValue = String(value)
      
      subject = subject.replace(new RegExp(placeholder, 'g'), stringValue)
      html_content = html_content.replace(new RegExp(placeholder, 'g'), stringValue)
      text_content = text_content.replace(new RegExp(placeholder, 'g'), stringValue)
    }
  }
  
  return {
    subject,
    html_content,
    text_content,
    missing_variables
  }
}

/**
 * Validate that all required variables are provided
 */
export function validateTemplateVariables(template: EmailTemplate, variables: EmailVariables): {
  isValid: boolean
  missing: string[]
  provided: string[]
} {
  const provided = Object.keys(variables).filter(key => 
    variables[key] !== undefined && variables[key] !== null && variables[key] !== ''
  )
  
  const missing = template.variables.filter(required => !provided.includes(required))
  
  return {
    isValid: missing.length === 0,
    missing,
    provided
  }
}

#!/usr/bin/env node

/**
 * DP RESULT OLDAL FORDÍTÁSOK HOZZÁADÁSA
 * A Product Result oldal hiányzó translation key-einek felvitele
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Hiányzó Supabase környezeti változók!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291' // ADHD Quick Check

// DP Result oldal hiányzó fordítások
const dpResultTranslations = {
  // Hero section
  'purchase_success_title': {
    'hu': 'Sikeres Vásárlás!',
    'en': 'Purchase Successful!'
  },
  'access_granted': {
    'hu': 'Hozzáférés Aktiválva',
    'en': 'Access Granted'
  },
  
  // Action cards
  'download_materials': {
    'hu': 'Anyagok Letöltése',
    'en': 'Download Materials'
  },
  'download_materials_desc': {
    'hu': 'Töltsd le a személyre szabott anyagaidat',
    'en': 'Download your personalized materials'
  },
  'book_consultation': {
    'hu': 'Konzultáció Foglalás',
    'en': 'Book Consultation'
  },
  'book_consultation_desc': {
    'hu': 'Foglalj időpontot személyre szabott konzultációra',
    'en': 'Book an appointment for personalized consultation'
  },
  'premium_access': {
    'hu': 'Premium Hozzáférés',
    'en': 'Premium Access'
  },
  'premium_access_desc': {
    'hu': 'Exkluzív tartalmak és szolgáltatások',
    'en': 'Exclusive content and services'
  },
  'download_button': {
    'hu': 'Letöltés',
    'en': 'Download'
  },
  'booking_button': {
    'hu': 'Időpont Foglalás',
    'en': 'Book Appointment'
  },
  'premium_button': {
    'hu': 'Megnyitás',
    'en': 'Open'
  },
  
  // Analysis sections
  'your_analysis': {
    'hu': 'Az Ön Eredménye',
    'en': 'Your Analysis'
  },
  'analysis_description': {
    'hu': 'Részletes elemzés a quiz eredményei alapján',
    'en': 'Detailed analysis based on quiz results'
  },
  'ai_analysis_title': {
    'hu': 'AI Személyre Szabott Elemzés',
    'en': 'AI Personalized Analysis'
  },
  'ai_analysis_description': {
    'hu': 'Mesterséges intelligencia által készített részletes értékelés',
    'en': 'Detailed assessment created by artificial intelligence'
  },
  'ai_generating': {
    'hu': 'AI elemzés generálása folyamatban...',
    'en': 'AI analysis generation in progress...'
  },
  'points_label': {
    'hu': 'pont',
    'en': 'points'
  },
  'category_label': {
    'hu': 'kategória',
    'en': 'category'
  },
  
  // Booking section
  'booking_title': {
    'hu': 'Időpont Foglalás',
    'en': 'Book Appointment'
  },
  'booking_description': {
    'hu': 'Válasszon időpontot a személyre szabott konzultációra',
    'en': 'Choose a time for personalized consultation'
  },
  
  // Messages
  'purchase_success_message': {
    'hu': 'Sikeres vásárlás! Köszönjük a bizalmat.',
    'en': 'Successful purchase! Thank you for your trust.'
  },
  'payment_cancelled': {
    'hu': 'Fizetés megszakítva.',
    'en': 'Payment cancelled.'
  },
  'ai_error_language': {
    'hu': 'Az AI eredmény generálása nem elérhető ehhez a nyelvhez.',
    'en': 'AI result generation is not available for this language.'
  },
  'ai_error_failed': {
    'hu': 'Az AI eredmény generálása sikertelen.',
    'en': 'AI result generation failed.'
  },
  'ai_error_unavailable': {
    'hu': 'Az AI eredmény generálása nem érhető el.',
    'en': 'AI result generation is not available.'
  }
}

// Admin interface fordítások
const adminTranslations = {
  // Product Config Editor
  'product_config_title': {
    'hu': 'Termék Konfiguráció',
    'en': 'Product Configuration'
  },
  'product_config_description': {
    'hu': 'Válaszd ki a terméket, amelyhez beállításokat szeretnél módosítani',
    'en': 'Select the product you want to configure'
  },
  'select_product': {
    'hu': 'Termék kiválasztása',
    'en': 'Select Product'
  },
  'choose_product_placeholder': {
    'hu': 'Válassz terméket...',
    'en': 'Choose product...'
  },
  'theme_settings': {
    'hu': 'Téma Beállítások',
    'en': 'Theme Settings'
  },
  'theme_settings_desc': {
    'hu': 'Termék-specifikus design és színek',
    'en': 'Product-specific design and colors'
  },
  'feature_settings': {
    'hu': 'Funkció Beállítások',
    'en': 'Feature Settings'
  },
  'feature_settings_desc': {
    'hu': 'Termék-specifikus funkciók ki/bekapcsolása',
    'en': 'Enable/disable product-specific features'
  },
  'content_settings': {
    'hu': 'Tartalom Beállítások',
    'en': 'Content Settings'
  },
  'content_settings_desc': {
    'hu': 'Termék-specifikus szövegek és üzenetek',
    'en': 'Product-specific texts and messages'
  },
  'primary_color': {
    'hu': 'Elsődleges szín',
    'en': 'Primary Color'
  },
  'secondary_color': {
    'hu': 'Másodlagos szín',
    'en': 'Secondary Color'
  },
  'accent_color': {
    'hu': 'Kiemelés szín',
    'en': 'Accent Color'
  },
  'background_gradient': {
    'hu': 'Háttér gradient',
    'en': 'Background Gradient'
  },
  'analysis_type': {
    'hu': 'Elemzés típusa',
    'en': 'Analysis Type'
  },
  'only_score': {
    'hu': 'Csak pontszám',
    'en': 'Score Only'
  },
  'only_ai': {
    'hu': 'Csak AI elemzés',
    'en': 'AI Only'
  },
  'both_analysis': {
    'hu': 'Mindkettő',
    'en': 'Both'
  },
  'show_booking': {
    'hu': 'Időpont foglalás',
    'en': 'Show Booking'
  },
  'show_download': {
    'hu': 'Letöltés gomb',
    'en': 'Show Download'
  },
  'show_premium': {
    'hu': 'Premium hozzáférés',
    'en': 'Premium Access'
  },
  'enable_ai': {
    'hu': 'AI elemzés',
    'en': 'AI Analysis'
  },
  'save_theme': {
    'hu': 'Téma Mentése',
    'en': 'Save Theme'
  },
  'save_features': {
    'hu': 'Funkciók Mentése',
    'en': 'Save Features'
  },
  'save_content': {
    'hu': 'Tartalom Mentése',
    'en': 'Save Content'
  },
  'success_message_label': {
    'hu': 'Sikeres vásárlás üzenet',
    'en': 'Success Message'
  },
  'download_text_label': {
    'hu': 'Letöltés gomb szöveg',
    'en': 'Download Button Text'
  },
  'booking_text_label': {
    'hu': 'Foglalás gomb szöveg',
    'en': 'Booking Button Text'
  },
  'config_saved': {
    'hu': 'Konfiguráció sikeresen mentve!',
    'en': 'Configuration saved successfully!'
  },
  'config_deleted': {
    'hu': 'Konfiguráció törölve!',
    'en': 'Configuration deleted!'
  },
  'save_failed': {
    'hu': 'Mentés sikertelen!',
    'en': 'Save failed!'
  },
  'delete_failed': {
    'hu': 'Törlés sikertelen!',
    'en': 'Delete failed!'
  },
  'no_products_warning': {
    'hu': 'Nincsenek termékek ehhez a quiz-hez. Először hozz létre termékeket a Termékek tab-ban.',
    'en': 'No products for this quiz. Please create products in the Products tab first.'
  },
  'loading_configs': {
    'hu': 'Konfigurációk betöltése...',
    'en': 'Loading configurations...'
  }
}

async function seedDPTranslations() {
  console.log('🌐 DP RESULT OLDAL FORDÍTÁSOK HOZZÁADÁSA')
  console.log('================================================')
  
  try {
    // Combine all translations
    const allTranslations = { ...dpResultTranslations, ...adminTranslations }
    
    let insertedCount = 0
    let updatedCount = 0
    
    // Insert each translation
    for (const [key, translations] of Object.entries(allTranslations)) {
      for (const [lang, value] of Object.entries(translations)) {
        // Check if translation already exists
        const { data: existing } = await supabase
          .from('quiz_translations')
          .select('id')
          .eq('quiz_id', QUIZ_ID)
          .eq('field_key', key)
          .eq('lang', lang)
          .single()
        
        if (existing) {
          // Update existing
          const { error } = await supabase
            .from('quiz_translations')
            .update({ 
              value,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id)
          
          if (error) {
            console.error(`❌ Frissítés hiba: ${key} (${lang})`, error.message)
          } else {
            console.log(`🔄 Frissítve: ${key} (${lang}) = "${value}"`)
            updatedCount++
          }
        } else {
          // Insert new
          const { error } = await supabase
            .from('quiz_translations')
            .insert({
              quiz_id: QUIZ_ID,
              field_key: key,
              lang,
              value
            })
          
          if (error) {
            console.error(`❌ Beszúrás hiba: ${key} (${lang})`, error.message)
          } else {
            console.log(`✅ Új: ${key} (${lang}) = "${value}"`)
            insertedCount++
          }
        }
      }
    }
    
    console.log('\n📊 ÖSSZESÍTŐ:')
    console.log(`✅ Új fordítások: ${insertedCount}`)
    console.log(`🔄 Frissített fordítások: ${updatedCount}`)
    console.log(`📝 Összes kulcs: ${Object.keys(allTranslations).length}`)
    console.log(`🌐 Támogatott nyelvek: hu, en`)
    console.log('\n🎉 DP RESULT FORDÍTÁSOK KÉSZ!')
    
  } catch (error) {
    console.error('❌ Fordítások hozzáadása sikertelen:', error)
    process.exit(1)
  }
}

// Script indítása
if (require.main === module) {
  seedDPTranslations()
}

module.exports = { dpResultTranslations, adminTranslations }

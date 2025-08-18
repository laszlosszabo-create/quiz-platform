'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Quiz } from '@/types/database'
import { tracker } from '@/lib/tracking'

interface LandingPageClientProps {
  quiz: Quiz
  translations: Record<string, string>
  featureFlags: Record<string, any>
  theme: Record<string, any>
  lang: string
}

export function LandingPageClient({
  quiz,
  translations,
  featureFlags,
  theme,
  lang
}: LandingPageClientProps) {
  
  // Track page view on mount
  useEffect(() => {
    tracker.trackPageView(quiz.id)
  }, [quiz.id])

  const handleCTAClick = () => {
    // For now, we'll track page view on CTA click as well until we implement proper CTA tracking
    tracker.trackPageView(quiz.id)
  }

  // Get theme values with fallbacks
  const logoUrl = theme.logo_url || '/logo-placeholder.svg'
  const heroImageUrl = theme.hero_image_url || '/hero-placeholder.jpg'
  const primaryColor = theme.primary_color || '#3B82F6'
  const secondaryColor = theme.secondary_color || '#10B981'

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="h-8 w-auto"
            onError={(e) => {
              // Fallback to text logo if image fails
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Image */}
          <div className="mb-8">
            <img 
              src={heroImageUrl}
              alt="Quiz Hero"
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          {/* Headlines */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {translations.landing_headline || 'Welcome to the Quiz'}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {translations.landing_sub || 'Discover insights about yourself with our interactive quiz.'}
          </p>

          {/* Description */}
          {translations.landing_description && (
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              {translations.landing_description}
            </p>
          )}

          {/* Main CTA */}
          <Link
            href={`/${lang}/${quiz.slug}/quiz`}
            onClick={handleCTAClick}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors duration-200"
            style={{ backgroundColor: primaryColor }}
          >
            {translations.landing_cta_text || translations.cta_text || 'Start Quiz'}
          </Link>

          {/* Social Proof */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => {
              const socialProofText = translations[`social_proof_${num}`]
              if (!socialProofText) return null
              
              return (
                <div key={num} className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 italic">&quot;{socialProofText}&quot;</p>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

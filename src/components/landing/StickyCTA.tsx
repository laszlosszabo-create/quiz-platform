'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api-utils'

export default function StickyCTA({ quizId, lang, href, label }: { quizId: string; lang: string; href: string; label: string }) {
  useEffect(() => {
    try {
      apiFetch('/api/tracking', {
        method: 'POST',
        body: JSON.stringify({
          event: 'page_view',
          page_type: 'landing',
          quiz_id: quizId,
          timestamp: new Date().toISOString(),
          metadata: { lang, action_alias: 'CTA_IMPRESSION', cta_position: 'sticky', cta_position_group: 'sticky' }
        })
      })
    } catch {}
  }, [quizId, lang])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 backdrop-blur border-t border-zinc-200 p-3">
      <div className="max-w-5xl mx-auto">
        <Link href={href} className="block text-center bg-emerald-600 text-white font-semibold py-3 rounded-md" onClick={() => {
          try {
            apiFetch('/api/tracking', {
              method: 'POST',
              body: JSON.stringify({
                event: 'cta_click',
                quiz_id: quizId,
                timestamp: new Date().toISOString(),
                cta_id: 'sticky',
                cta_position: 'sticky',
                metadata: { lang, action_alias: 'LP_CTA_CLICK', cta_position_group: 'sticky' }
              })
            })
          } catch {}
        }}>
          {label}
        </Link>
      </div>
    </div>
  )
}

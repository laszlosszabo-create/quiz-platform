"use client"

export function initScrollDepthTracking(opts: { quizId: string; lang?: string }) {
  if (typeof window === 'undefined') return
  const sent: Record<number, boolean> = {}
  const thresholds = [50, 75, 90]
  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    )
    const winHeight = window.innerHeight
    const pct = Math.min(100, Math.round(((scrollTop + winHeight) / docHeight) * 100))
    for (const t of thresholds) {
      if (!sent[t] && pct >= t) {
        sent[t] = true
        try {
          fetch('/api/tracking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'page_view',
              page_type: 'landing',
              quiz_id: opts.quizId,
              timestamp: new Date().toISOString(),
              metadata: { lang: opts.lang, scroll_pct: t, action_alias: `SCROLL_${t}` }
            })
          })
        } catch {}
      }
    }
    if (thresholds.every((t) => sent[t])) {
      window.removeEventListener('scroll', onScroll, { passive: true } as any)
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true } as any)
}

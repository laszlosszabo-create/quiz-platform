"use client"

import Link from "next/link"
import { useCallback } from "react"

export interface CTAButtonProps {
  href: string
  label: string
  variant?: "primary" | "secondary"
  size?: "md" | "lg"
  trackingId?: string // optional tracking id for analytics (position/context)
  quizId?: string
  lang?: string
  position?: string // e.g., hero | checklist | how | testimonials | final | sticky
}

export function CTAButton({ href, label, variant = "primary", size = "lg", trackingId, quizId, lang, position }: CTAButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const color =
    variant === "primary"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-600"
      : "bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 focus:ring-zinc-400"
  const sz = size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"

  const onClick = useCallback(() => {
    // lightweight tracking hook (optional, best-effort)
    if (typeof window !== "undefined" && quizId) {
      try {
    const group = position === 'hero' ? 'hero' : position === 'final' || position === 'footer' ? 'footer' : 'mid'
    const payload = {
          event: "cta_click",
          quiz_id: quizId,
          timestamp: new Date().toISOString(),
          cta_id: trackingId || position || label,
          cta_position: position || trackingId || "unknown",
          metadata: {
            lang,
      action_alias: "LP_CTA_CLICK",
      cta_position_group: group
          }
        }
        fetch("/api/tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
      } catch {}
    }
  }, [trackingId, quizId, lang, position, label])

  return (
    <Link href={href} className={`${base} ${color} ${sz}`} onClick={onClick}>
      {label}
    </Link>
  )
}

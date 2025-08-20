// Egyszerű dev cron: percenként meghívja az email queue feldolgozó végpontot
// Beállítások környezeti változókkal:
// - NEXT_PUBLIC_BASE_URL (alapértelmezett: http://localhost:3000)
// - EMAIL_SAFE_RATE (alapértelmezett: 5)
// - EMAIL_CRON_INTERVAL_MS (alapértelmezett: 60000)

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const SAFE_RATE = process.env.EMAIL_SAFE_RATE || '5'
const INTERVAL = parseInt(process.env.EMAIL_CRON_INTERVAL_MS || '60000', 10)

let running = false
let timer = null

async function tick() {
  if (running) return
  running = true
  const started = new Date()
  const url = `${BASE_URL}/api/cron/process-email-queue?safe=true&backfill=true&retry=true&rate=${SAFE_RATE}`
  try {
    const res = await fetch(url)
    const json = await res.json().catch(() => ({}))
    const finished = new Date()
    const summary = `processed=${json.processed ?? 0} sent=${json.succeeded ?? 0} failed=${json.failed ?? 0} skipped=${json.skipped ?? 0}`
    console.log(`[DEV EMAIL CRON] ${started.toISOString()} -> ${finished.toISOString()} ${summary}`)
  } catch (err) {
    console.error('[DEV EMAIL CRON] hiba:', err?.message || err)
  } finally {
    running = false
  }
}

function start() {
  console.log(`[DEV EMAIL CRON] indul. BASE_URL=${BASE_URL} SAFE_RATE=${SAFE_RATE} INTERVAL=${INTERVAL}ms`)
  // Azonnali első futás, majd időzítve
  tick()
  timer = setInterval(tick, INTERVAL)
}

function stop() {
  if (timer) clearInterval(timer)
  console.log('[DEV EMAIL CRON] leállítva.')
}

process.on('SIGINT', () => { stop(); process.exit(0) })
process.on('SIGTERM', () => { stop(); process.exit(0) })

start()

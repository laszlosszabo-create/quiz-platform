# Admin Panel Quality Gates and Bug Ledger (2025-08-16)

Use this living checklist to track readiness across the critical areas. Status legend: [x]=Green, [~]=Yellow, [ ]=Red.

## 1) Database integrations (CRUD is real, no placeholders)
- [x] AI Prompts CRUD writes/reads `quiz_ai_prompts` deterministically (POST/PUT/DELETE)
- [~] Questions CRUD stable (no silent failures; all fields persist)
- [~] Translations CRUD stable (HU/EN saved and retrieved)
- [ ] Admin listing totals/derived counts (no hardcoded zeros like questionCount)

Notes: Products endpoints still contain TODOs for Stripe validation (non-blocking for quiz admin).

## 2) Translations system (HU/EN editable in admin; public updates immediately)
- [~] Admin translation editors cover landing, quiz, result strings
- [~] Public pages resolve from `quiz_translations` with fallback to default lang
- [ ] Loading/progress and edge labels fully covered (no missing keys, no hardcoded UI text)

Verification: SSR pages fetch from DB; changes reflect on next request. Add smoke tests for critical keys.

## 3) Question editor (no infinite loading/silent errors; saves/loads correctly)
- [~] Create/update/delete works; error surfaced in UI
- [ ] Reorder/save uses batched upsert (no N+1 per item)
- [ ] E2E test coverage: create > edit > reorder > delete

## 4) Scoring rules (results computed from DB, not hardcoded)
- [ ] Result page uses `quiz_scoring_rules` and session answers to compute category scores
- [ ] AI generation uses computed scores as variables; fallback safe path in absence of AI
- [ ] Unit tests for scoring combinators (sum/weighted/composite)

Current: AI result route uses `session.scores` + prompt. Rules editor exists, but not wired to result calculation.

## 5) AI Prompts canonicalization
- [x] Canonical single column `ai_prompt` in DB
- [~] API/UI fully use `ai_prompt` (no legacy `user_prompt_template` writes)
- [~] Test endpoint supports canonical input; admin Test button works locally w/o key
- [ ] Remove legacy fallbacks from read paths (`user_prompt_template`)

## 6) Save performance (<2s, batched; no N+1)
- [ ] Question reorder/save batched by quiz (single RPC/upsert)
- [ ] Scoring rules save batched (insert/update in one call)
- [~] AI prompt save/update single round-trip

Add timings to audit logs for slow ops (>1.5s).

## 7) Schemas, routes, and audit_logs hygiene
- [~] Single canonical audit_logs shape used everywhere (server writes unified)
- [ ] No PostgREST schema cache errors (e.g., missing `action` column)
- [~] RLS and policies validated for admin + public tracking paths

Observation: Two shapes in use: `user_id/user_email/resource_*` vs `actor_id/action/entity/diff`. Unify.

## 8) Metrics/aggregations (no placeholder/demo values)
- [ ] Admin lists and dashboards read live DB counts (questions, prompts, rules)
- [ ] Remove hardcoded defaults like `questionCount: 0`

## 9) QA and acceptance
- [~] Phase 1 acceptance validated (AI Prompts Test, Health, CRUD)
- [ ] Phase 2+ acceptance suites for Questions, Translations, Scoring, Metrics
- [ ] Scripted smoke tests + CI job

---

# Prioritized Fix Plan

Phases are short, incremental, and independently verifiable. Owners: BE=Backend, UI=Admin UI, DB=Schema/SQL/Policies.

## Phase A — Audit logs unification and noise removal (Owner: DB/BE)
Goals:
- Migrate to one audit_logs schema (columns: user_id, user_email, action, resource_type, resource_id, details, created_at)
- Remove/adapter for legacy inserts using `actor_id/entity/diff` (view or migration)
- Refresh PostgREST schema cache; add regression check hitting `/api/tracking`
Acceptance:
- No PGRST204 or schema cache errors in logs under load
- Inserts succeed from: admin editors + tracking API
ETA: 0.5–1 day

Progress (2025-08-16):
- Updated server routes to use canonical helper: tracking API, AI result route, admin products endpoints rely on `createAuditLog`.
- Replaced legacy `actor_id/entity/diff` write path in `logAdminAction` with canonical shape.
- Added migration `20250816100000_audit_logs_unification.sql` to drop legacy columns if present and trigger PostgREST cache reload.

Next:
- Run migrations and verify: POST /api/tracking returns 200 and creates audit_logs without schema errors.
- Grep for any remaining direct writes to `audit_logs` and clean up client-only fallbacks (UI uses /api/admin/audit-log already).

## Phase B — AI prompts canonicalization cleanup (Owner: BE/UI)
Goals:
- Remove `user_prompt_template` fallbacks from read paths (`/api/ai/generate-result`, admin quiz fetch)
- Keep one UI field labeled "User Prompt" backed by `ai_prompt`
- Add unit test: payload uses only `ai_prompt`
Acceptance:
- Grep shows zero references to `user_prompt_template` in runtime code
- Generate-result works with `ai_prompt` only
ETA: 0.5 day

## Phase C — Save performance (Owner: BE/UI)
Goals:
- Batch question reorder/save via RPC: `upsert_questions_order(json)`
- Batch scoring rules save (single `upsert` with `on conflict`)
- Add timing to audit logs and show toast if >2s
Acceptance:
- Reordering 20 items ≤ 400ms; saving 10 rules ≤ 800ms locally
- No client loops issuing N separate updates
ETA: 1–1.5 days

## Phase D — Scoring engine wiring to results (Owner: BE)
Goals:
- Compute `session.scores` from questions + rules on quiz completion (server API)
- Result page reads computed scores; AI route uses them; offline fallback renders DB-defined messages
- Minimal tests for sum/weighted/composite
Acceptance:
- Disabling AI still yields deterministic DB-based result
- Unit tests pass for calculators
ETA: 1.5–2 days

## Phase E — Translations coverage + live preview (Owner: UI)
Goals:
- Inventory keys for landing/loading/result; fill missing; remove hardcoded UI copies
- Admin translation editor shows live preview for current quiz/lang
Acceptance:
- No fallback English strings in HU; no console warnings from `getTranslation`
ETA: 1 day

## Phase F — Metrics/aggregations (Owner: UI/BE)
Goals:
- Replace placeholders with DB counts (questions, prompts, rules, sessions)
- Add lightweight `/api/admin/metrics` source
Acceptance:
- Admin lists show real counts within 500ms
ETA: 0.5 day

## Phase G — QA suite and CI (Owner: BE/UI)
Goals:
- Add Playwright smoke for: CRUD prompts, CRUD questions, translations save, scoring save, result render
- Add `npm run test:acceptance` task in CI
Acceptance:
- Green run in CI; artifacts with screenshots/logs
ETA: 1 day

---

# Execution Order and Milestones
1) A (audit logs) → unblock logs + tracking (critical infra)
2) B (prompts cleanup) → reduce drift risk
3) C (performance) → remove N+1 hotspots before scaling
4) D (scoring engine) → correctness on result page w/o AI
5) E (translations coverage) → UX polish + i18n readiness
6) F (metrics) → admin truthfulness
7) G (QA/CI) → guardrails

---

# Quick Status Matrix
- Green: AI Prompts CRUD/Test; Health endpoint
- Yellow: Translations CRUD/coverage; Question CRUD; Prompts canonical read paths; Acceptance docs
- Red: Audit logs unification; Scoring engine wiring; Save performance batching; Metrics placeholders

# Verification hooks
- Health: GET /api/health → 200
- AI Test: POST /api/admin/ai-prompts/openai-test → 200 (mocked w/o key)
- Tracking: POST /api/tracking → 200 and audit_logs insert w/o cache errors
- Result: POST /api/ai/generate-result → 200 with scores injected

Update this file at the end of each phase with evidence links (commit SHAs, logs, screenshots).

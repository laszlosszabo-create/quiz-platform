# Email Operations Runbook

This document describes how to run the email cron in safe mode, perform backfills, and monitor quality gates in production.

## Safe-mode live delivery (rate-limited)

- API: `GET /api/cron/process-email-queue?safe=true&rate=5&backfill=true&retry=false`
- Behavior:
  - Processes up to 5 emails per run (adjust `rate` as needed)
  - Performs backfill for legacy items missing `recipient_email` before sending
  - Disables retries on first pass (set `retry=true` later)
  - Logs include: queue_id, recipient_email, template_id, status, provider_message_id

Environment:
- `RESEND_API_KEY` must be set
- `FROM_EMAIL` recommended; `REPLY_TO_EMAIL` optional

## Backfill legacy items (missing recipients)

- API: `POST /api/admin/email-queue/backfill`
- Logic:
  - For each pending item with missing/empty `recipient_email`, try to resolve from `quiz_sessions` (user_email/email) and `quiz_leads` by `session_id`.
  - If still missing, mark `status=cancelled` with `error_message=missing_recipient`.

## Idempotency and duplication protection

- Queue processing uses an atomic `pending -> processing` update to lock a row.
- Items with existing `external_id` or `status=sent` are skipped.
- Webhook writes to `email_analytics` with `external_id`, allowing uniqueness constraints to dedupe.

## Retry and error handling

- Classification:
  - Retryable: 5xx, 408, 429, network timeouts/errors
  - Non-retryable: 4xx invalid address or hard bounces
- Backoff schedule: 5m, 30m, 6h (max 3 attempts)

## Template and variable validation

- Prior to sending, required variables are parsed from both subject and body (`{{var}}` tokens).
- Missing variables cause `status=failed` with `error_message=VALIDATION_ERROR ...` before send.

## Observability and report

- API: `GET /api/admin/email-metrics?hours=24`
- Returns:
  - Queue sizes by status
  - Success rate in the window
  - Average delivery time
  - Top failure reasons

## Incident response

- To pause sending: avoid calling the cron endpoint or set `safe=true&rate=0` (no-op) while investigating.
- To disable provider: unset `RESEND_API_KEY` from the environment in your platform.
- To resume: re-enable the environment variable and gradually increase `rate`.

## Quality gates

- Capture last run summary from cron response: PASS = sent, FAIL = failed, SKIPPED = lock/missing/validation.
- Include UTC timestamps and provider IDs in change logs or release notes as needed.

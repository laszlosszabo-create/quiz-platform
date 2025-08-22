Template usage and import instructions

Files included:
- `questions.csv` — technical question definitions (keys, types, order, active flag, options JSON).
- `translations.csv` — human-readable texts per language (question and option labels).

Quick steps for the psychologist (Google Sheets / Excel):
1. Open Google Sheets -> File -> Import -> Upload -> choose `questions.csv`.
2. When prompted, select "Replace current sheet" and import. Do the same for `translations.csv` on a second sheet (or create a new spreadsheet and import both into separate tabs named "questions" and "translations").
3. Fill the `questions` sheet: every row is one question. Keep `key` simple (q1, q2...), and option keys as `<questionKey>_o1` etc.
4. For `options_json`, keep the JSON array intact in the cell. Example: `[{"key":"q1_o1","score":0},{"key":"q1_o2","score":1}]`.
5. Fill the `translations` sheet: one row per translation entry. Use `field_key` conventions described below.

Field conventions (required):
- questions.csv
  - quiz_id: replace with your quiz UUID (ask developer if unknown).
  - key: unique question key (no spaces).
  - type: one of `single`, `multi`, `scale`.
  - order: integer (1 = first).
  - active: `true` or `false`.
  - options_json: JSON array of option objects. Each option must have `key` and `score`.
  - help_text: optional free text.

- translations.csv
  - quiz_id: same quiz UUID.
  - lang: language code, e.g. `hu`, `en`.
  - field_key: one of:
    - `question:<questionKey>:text`  (the question text)
    - `question:<questionKey>:help`  (optional help text shown under the question)
    - `option:<optionKey>:label`     (option label text)
  - value: the translated string.

Import back into the system (developer instructions):
1. Ensure `questions.csv` rows are inserted into `quiz_questions` table. The `options_json` cell must be parsed as JSON and stored into the `options` column (as JSONB).
2. Insert all `translations.csv` rows into `quiz_translations` table with columns (`quiz_id`, `lang`, `field_key`, `value`). Use `upsert` to avoid duplicates.
3. Run in this order: questions -> translations. Questions must exist so option keys referenced in translations match.

Validation checklist before import:
- Every question `key` is unique within the file.
- Option keys referenced in `options_json` match the `option:<optionKey>:label` entries in `translations.csv`.
- `type` values are valid.
- `options_json` is valid JSON (use a JSON validator if needed).

If you want, I can also:
- Generate a ready-to-use Google Sheets file (ask and I will create a shareable link or a downloadable `.xlsx`).
- Build a small Node.js script that reads these CSVs and imports them to Supabase (requires admin key).

Contact me which follow-up you prefer (Sheets file / import script).

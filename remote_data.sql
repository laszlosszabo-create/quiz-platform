SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '92c0e51c-024a-4fe2-877d-6799be3e65a2', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"admin@test.com","user_id":"d9b68034-4844-446e-8aa5-874273fcb942","user_phone":""}}', '2025-08-14 12:53:03.511132+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fba49ed7-81d2-4df6-bf7b-8fb23ca28481', '{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"admin@test.com","user_id":"d9b68034-4844-446e-8aa5-874273fcb942","user_phone":""}}', '2025-08-14 13:14:45.308742+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc7a24f4-f5a7-4a56-9816-ead0a4276d74', '{"action":"user_modified","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"user","traits":{"user_email":"admin@test.com","user_id":"d9b68034-4844-446e-8aa5-874273fcb942","user_phone":""}}', '2025-08-14 13:16:26.594351+00', ''),
	('00000000-0000-0000-0000-000000000000', '0068cc76-3464-43fb-93af-15419d72f029', '{"action":"login","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-14 13:18:10.026323+00', ''),
	('00000000-0000-0000-0000-000000000000', '51a257b6-5325-426a-9c94-54a563214dd1', '{"action":"login","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-14 13:18:30.14343+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3c3d3d1-b907-4f0a-ba49-f6c925bb7474', '{"action":"logout","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"account"}', '2025-08-14 13:18:30.453922+00', ''),
	('00000000-0000-0000-0000-000000000000', '671f712c-cd76-460f-80ce-32b6a603d291', '{"action":"login","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-14 13:19:47.162188+00', ''),
	('00000000-0000-0000-0000-000000000000', '4f7ed024-1cc1-4be4-851a-aef035323ea6', '{"action":"logout","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"account"}', '2025-08-14 13:19:47.340035+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a58f239-6c67-4b3d-a267-e19788dfb118', '{"action":"login","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-14 13:19:59.594967+00', ''),
	('00000000-0000-0000-0000-000000000000', '552c4ddc-3e73-457f-90dd-5464adaf31a9', '{"action":"logout","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"account"}', '2025-08-14 13:19:59.745355+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b71d4f11-859d-444a-8991-febc0632a740', '{"action":"login","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-14 13:20:44.583143+00', ''),
	('00000000-0000-0000-0000-000000000000', '7e6ebd56-f17a-4350-ac62-fac0cc8089b7', '{"action":"login","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-08-14 14:16:30.335795+00', ''),
	('00000000-0000-0000-0000-000000000000', '1956b886-00ac-489e-9297-3f1ebad37db7', '{"action":"token_refreshed","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"token"}', '2025-08-14 14:19:17.454876+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2531e88-b886-48ba-a574-a547a08640d9', '{"action":"token_revoked","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"token"}', '2025-08-14 14:19:17.457019+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b662a0f-d2ed-4d41-8668-0977285352d1', '{"action":"token_refreshed","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"token"}', '2025-08-14 16:15:01.902755+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f5bb1bc3-ba65-4b4f-941e-4cbd86b2155c', '{"action":"token_revoked","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"token"}', '2025-08-14 16:15:01.932268+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ae7669b-4214-4d27-a952-ffa6e499eeb8', '{"action":"token_refreshed","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"token"}', '2025-08-15 07:11:44.709039+00', ''),
	('00000000-0000-0000-0000-000000000000', '93d4e4d5-1327-4de4-a11c-fc671aaef7a1', '{"action":"token_revoked","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"token"}', '2025-08-15 07:11:44.736094+00', ''),
	('00000000-0000-0000-0000-000000000000', '91afaaa7-32e4-4c0c-8aa8-e4148ba3c591', '{"action":"token_refreshed","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"token"}', '2025-08-15 07:11:44.80971+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aafc8296-4b45-4a2c-bb0e-b2c84320a359', '{"action":"token_refreshed","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"token"}', '2025-08-15 07:11:45.69072+00', ''),
	('00000000-0000-0000-0000-000000000000', 'baa14f9e-74f8-4f57-9bce-86850fe0d0f7', '{"action":"token_refreshed","actor_id":"d9b68034-4844-446e-8aa5-874273fcb942","actor_username":"admin@test.com","actor_via_sso":false,"log_type":"token"}', '2025-08-15 07:11:46.443731+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'd9b68034-4844-446e-8aa5-874273fcb942', 'authenticated', 'authenticated', 'admin@test.com', '$2a$10$8Sn1YplatFEEx0QeazXYHeh.TenUoztOcsPGH5QSQIQOEpsrwPafe', '2025-08-14 13:16:26.58692+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-08-14 14:16:30.360826+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-08-14 12:53:03.454822+00', '2025-08-15 07:11:44.772235+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('d9b68034-4844-446e-8aa5-874273fcb942', 'd9b68034-4844-446e-8aa5-874273fcb942', '{"sub": "d9b68034-4844-446e-8aa5-874273fcb942", "email": "admin@test.com", "email_verified": false, "phone_verified": false}', 'email', '2025-08-14 12:53:03.491227+00', '2025-08-14 12:53:03.492676+00', '2025-08-14 12:53:03.492676+00', '3607450d-60b2-46df-9501-d551e7a8e2da');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('b8419eaa-047f-4b76-832b-56a5fb209c6b', 'd9b68034-4844-446e-8aa5-874273fcb942', '2025-08-14 14:16:30.362489+00', '2025-08-14 14:16:30.362489+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.103.1 Chrome/138.0.7204.100 Electron/37.2.3 Safari/537.36', '80.98.185.72', NULL),
	('221d09f6-27be-4f33-819a-70345851ad85', 'd9b68034-4844-446e-8aa5-874273fcb942', '2025-08-14 13:20:44.583917+00', '2025-08-15 07:11:46.446125+00', NULL, 'aal1', NULL, '2025-08-15 07:11:46.445453', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', '80.98.185.72', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('221d09f6-27be-4f33-819a-70345851ad85', '2025-08-14 13:20:44.586629+00', '2025-08-14 13:20:44.586629+00', 'password', 'ac06eccb-c656-4714-85d7-54477fdf44b8'),
	('b8419eaa-047f-4b76-832b-56a5fb209c6b', '2025-08-14 14:16:30.424999+00', '2025-08-14 14:16:30.424999+00', 'password', 'eeb844a8-549c-41e7-9fcd-f8fbb27d6dc8');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 6, '5ok5houq6rux', 'd9b68034-4844-446e-8aa5-874273fcb942', false, '2025-08-14 14:16:30.377849+00', '2025-08-14 14:16:30.377849+00', NULL, 'b8419eaa-047f-4b76-832b-56a5fb209c6b'),
	('00000000-0000-0000-0000-000000000000', 5, 'hecnvrleawfa', 'd9b68034-4844-446e-8aa5-874273fcb942', true, '2025-08-14 13:20:44.584698+00', '2025-08-14 14:19:17.457534+00', NULL, '221d09f6-27be-4f33-819a-70345851ad85'),
	('00000000-0000-0000-0000-000000000000', 7, 'wyqd5xvj7qut', 'd9b68034-4844-446e-8aa5-874273fcb942', true, '2025-08-14 14:19:17.461919+00', '2025-08-14 16:15:01.936052+00', 'hecnvrleawfa', '221d09f6-27be-4f33-819a-70345851ad85'),
	('00000000-0000-0000-0000-000000000000', 8, 'seizckjxfldl', 'd9b68034-4844-446e-8aa5-874273fcb942', true, '2025-08-14 16:15:01.957505+00', '2025-08-15 07:11:44.739119+00', 'wyqd5xvj7qut', '221d09f6-27be-4f33-819a-70345851ad85'),
	('00000000-0000-0000-0000-000000000000', 9, 'dh2onhulmxoi', 'd9b68034-4844-446e-8aa5-874273fcb942', false, '2025-08-15 07:11:44.762185+00', '2025-08-15 07:11:44.762185+00', 'seizckjxfldl', '221d09f6-27be-4f33-819a-70345851ad85');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: admin_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."admin_settings" ("id", "setting_key", "setting_value", "description", "updated_at", "created_at") VALUES
	(1, 'chatgpt_prompt_short', 'Te egy profi párkapcsolati pszichológus vagy, aki empatikusan és támogatóan elemzi mások viselkedésmintáit. A felhasználó neve: {user_name}. Ne adj megoldásokat vagy gyakorlati technikákat, csak az önszabotáló minták felismerésére és megértésére koncentrálj. Tegeződj a felhasználóval, mindig szólítsd a nevén és tartsd a hangnemet barátságosnak.
Elemezd a következő kvíz kérdéseket és a hozzájuk adott válaszokat. Adj egy részletes, maximum 300 szavas elemzést arról, hogyan jelennek meg ezek a válaszokban az önszabotáló minták, mit jeleznek a kötődési stílus, a kommunikációs stratégiák és a konfliktuskezelés szempontjából. Ne adj javaslatokat vagy megoldásokat, csak az elemzésre és megértésre fókuszálj. ÉS kérlek ne elmezz minden választ inkább összesítve elemzd a válaszokat, nem kell részletesen mindegyiket. 
Formázás: Használj Markdown formátumot, címsorokat, listákat és emojikkal tedd vizuálisan vonzóvá. és nem említs semmit a prompt-ból pl hogy maximum hány szóban kell váalszolni stb. az olvasó higyje azt hogy ez nem egy generált szöveg, hanem személyesen neki készült.', 'ChatGPT prompt for short analysis', '2025-08-08 21:36:41.035315+00', '2025-08-07 12:07:39.230002+00'),
	(12, 'openai_model', 'gpt-5-nano', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:41.266671+00', '2025-08-07 12:07:39.230002+00'),
	(105, 'short_analysis_token_limit', '1024', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:41.39205+00', '2025-08-08 21:31:04.858706+00'),
	(108, 'long_analysis_max_output_tokens', '1400', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:41.641605+00', '2025-08-08 21:31:05.041287+00'),
	(111, 'long_analysis_verbosity', 'high', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:41.869968+00', '2025-08-08 21:31:05.219621+00'),
	(114, 'long_analysis_reasoning_effort', 'minimal', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:42.09222+00', '2025-08-08 21:31:05.388182+00'),
	(36, 'action_plan_prompt', 'Készíts egy részletes, személyre szabott AKCIÓTERVET az alábbi kvíz eredmények alapján.

KVÍZ ADATOK:
- Név: {USER_NAME}
- Életkor: {USER_AGE}
- Nem: {USER_GENDER}
- Email: {USER_EMAIL}

VÁLASZOK:
{USER_ANSWERS}

ALAPVETŐ ELEMZÉS:
{SHORT_ANALYSIS}

FELADAT: Készíts egy gyakorlatias, konkrét AKCIÓTERVET, ami tartalmazza:

1. **SZEMÉLYISÉGANALÍZIS** (300-400 szó)
   - Részletes betekintés a válaszadó párkapcsolati mintáiba
   - Erősségek és fejlesztendő területek azonosítása
   - Hogyan hatnak ezek a jelenlegi/jövőbeli kapcsolataira

2. **SZABOTÁLÓ MINTÁK FELISMERÉSE** (200-300 szó)
   - Konkrét példák a destruktív mintákra
   - Kiváltó helyzetek és trigger-ek
   - Hogyan ismerheti fel ezeket a jövőben

3. **30 NAPOS AKCIÓTERV** (400-500 szó)
   - 1. hét: Tudatosítás és megfigyelés
   - 2. hét: Új szokások kialakítása
   - 3. hét: Kommunikációs készségek fejlesztése
   - 4. hét: Integráció és értékelés
   - Minden hétre 3-4 konkrét feladat

4. **GYAKORLATI ESZKÖZTÁR** (300-400 szó)
   - Napi rutinok és reflexiós kérdések
   - Kommunikációs sablonok és mondatok
   - Stresszkezelési technikák
   - Önbizalom építő gyakorlatok

5. **KAPCSOLATI STRATÉGIÁK** (250-350 szó)
   - Hogyan javítsa jelenlegi kapcsolatait
   - Mit keressen új kapcsolatokban
   - Konfliktuskezelési tippek
   - Határok kijelölése

6. **BONUS TARTALOM** (200-250 szó)
   - Ajánlott olvasnivalók és források
   - Meditációs és légzőgyakorlatok
   - Motivációs tippek a nehéz időszakokra

FONTOS:
- Használj személyes megszólítást ({USER_NAME})
- Konkrét, megvalósítható lépéseket adj
- Legyen empatikus és bátorító a hangvét
- Minden tanács legyen gyakorlatias
- Használj emoji-kat és vizuális elemeket
- Hosszúság: 3000-4000 szó

Formázás: Használj Markdown formátumot, címsorokat, listákat és emojikkal tedd vizuálisan vonzóvá.', 'ChatGPT prompt for premium action plan generation', '2025-08-08 21:36:41.119458+00', '2025-08-07 12:07:39.230002+00'),
	(106, 'action_plan_token_limit', '2048', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:41.464984+00', '2025-08-08 21:31:04.918924+00'),
	(109, 'action_plan_max_output_tokens', '2000', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:41.73989+00', '2025-08-08 21:31:05.105761+00'),
	(112, 'action_plan_verbosity', 'high', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:41.961889+00', '2025-08-08 21:31:05.271536+00'),
	(115, 'action_plan_reasoning_effort', 'minimal', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:42.209657+00', '2025-08-08 21:31:05.442381+00'),
	(42, 'action_plan_price_current', '300', 'Current price of action plan in HUF (cents format)', '2025-08-07 16:50:58.946065+00', '2025-08-07 12:07:39.230002+00'),
	(43, 'action_plan_price_original', '9990', 'Original price of action plan in HUF (cents format)', '2025-08-07 16:50:59.014703+00', '2025-08-07 12:07:39.230002+00'),
	(44, 'action_plan_currency', 'HUF', 'Currency for action plan pricing', '2025-08-07 16:50:59.092022+00', '2025-08-07 12:07:39.230002+00'),
	(45, 'action_plan_discount_enabled', 'true', 'Whether discount pricing is currently active', '2025-08-07 16:50:59.179264+00', '2025-08-07 12:07:39.230002+00'),
	(37, 'action_plan_fixed_content', 'Kiskacsa fürdik', 'Fixed content to append to all action plans', '2025-08-08 21:36:41.193751+00', '2025-08-07 12:07:39.230002+00'),
	(107, 'short_analysis_max_output_tokens', '2000', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:41.57647+00', '2025-08-08 21:31:04.983969+00'),
	(110, 'short_analysis_verbosity', 'low', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:41.802793+00', '2025-08-08 21:31:05.157417+00'),
	(113, 'short_analysis_reasoning_effort', 'minimal', 'OpenAI model selection for cost optimization', '2025-08-08 21:36:42.027484+00', '2025-08-08 21:31:05.325656+00');


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."admin_users" ("id", "email", "role", "created_at", "updated_at") VALUES
	('39dbcd16-6976-402c-92a4-7e2f9f09ba9b', 'admin@test.com', 'owner', '2025-08-14 13:13:23.206025+00', '2025-08-14 13:13:23.206025+00');


--
-- Data for Name: quiz_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_submissions" ("id", "user_name", "user_email", "user_age", "user_relationship_status", "answers", "submitted_at", "user_gender", "email_sent", "email_sent_at", "detailed_email_sent", "detailed_email_sent_at", "email_delivered", "email_delivered_at", "email_opened", "email_opened_at", "email_clicked", "email_clicked_at", "email_bounced", "email_bounced_at", "email_external_id", "detailed_email_delivered", "detailed_email_delivered_at", "detailed_email_opened", "detailed_email_opened_at", "detailed_email_clicked", "detailed_email_clicked_at", "detailed_email_bounced", "detailed_email_bounced_at", "detailed_email_external_id", "action_plan_email_sent") VALUES
	('9c95bb35-2e7a-4991-ac61-c7b89725a8dc', 'suti', 'suti@segitettem.hu', 36, 'dating', '{"1": "Ritkán", "2": "Kicsit féltékeny vagyok", "3": "Ritkán", "4": "Közömbös vagyok, jól érzem magam egyedül is", "5": "Ritkán", "6": "Elemzem, hogy tudnám őt egy életen át szeretni?", "7": "Ritkán", "8": "Támogatom", "9": "Ritkán", "10": "Megélem", "11": "Ritkán", "12": "Megpróbálom visszaszerezni", "13": "Ritkán", "14": "Sokat gondolkodom rajta", "15": "Kicsit nehéz", "16": "Ilyen nem fordul már elő.", "17": "Időnként", "18": "Nem szoktam félni", "19": "Időnként", "20": "hogy nem a megfelelő társsal vagyok most együtt."}', '2025-08-06 10:42:04.35965+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('ef6b06e7-a100-439e-a3f6-32799d8f9eb7', 'Suti', 'suti@segitettem.hu', 36, 'relationship', '{"1": "Ritkán", "2": "Kicsit féltékeny vagyok", "3": "Ritkán", "4": "de", "5": "Ritkán", "6": "de", "7": "Ritkán", "8": "Kicsit féltékeny vagyok", "9": "Ritkán", "10": "de", "11": "Ritkán", "12": "de", "13": "Ritkán", "14": "Kicsit aggódom", "15": "Kicsit nehéz", "16": "de", "17": "Ritkán", "18": "de", "19": "Ritkán", "20": "de"}', '2025-08-06 10:48:13.688201+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('b6374cf4-8005-43f9-93bc-dd4455608d14', 'Suti', 'suti@segitettem.hu', 36, 'relationship', '{"1": "Ritkán", "2": "Kicsit féltékeny vagyok", "3": "Ritkán", "4": "de", "5": "Ritkán", "6": "de", "7": "Ritkán", "8": "Kicsit féltékeny vagyok", "9": "Ritkán", "10": "de", "11": "Ritkán", "12": "de", "13": "Ritkán", "14": "Kicsit aggódom", "15": "Kicsit nehéz", "16": "de", "17": "Ritkán", "18": "de", "19": "Ritkán", "20": "de"}', '2025-08-06 10:48:32.827654+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('9075514f-0646-49c7-a50a-9847075aed34', 'Suti', 'suti@segitettem.hu', 36, 'relationship', '{"1": "Ritkán", "2": "Kicsit féltékeny vagyok", "3": "Ritkán", "4": "de", "5": "Ritkán", "6": "de", "7": "Ritkán", "8": "Kicsit féltékeny vagyok", "9": "Ritkán", "10": "de", "11": "Ritkán", "12": "de", "13": "Ritkán", "14": "Kicsit aggódom", "15": "Kicsit nehéz", "16": "de", "17": "Ritkán", "18": "de", "19": "Ritkán", "20": "de"}', '2025-08-06 10:49:20.416207+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('8009202f-e58c-4fea-adcc-da06e9dcc402', 'Stui', 'laszlo.s.szabo@ecomxpert.hu', 36, 'dating', '{"1": "Ritkán", "2": "Kicsit féltékeny vagyok", "3": "Ritkán", "4": "de", "5": "Ritkán", "6": "de", "7": "Ritkán", "8": "Kicsit féltékeny vagyok", "9": "Időnként", "10": "de", "11": "Ritkán", "12": "de", "13": "Ritkán", "14": "Sokat gondolkodom rajta", "15": "Közepesen nehéz", "16": "de", "17": "Ritkán", "18": "de", "19": "Ritkán", "20": "de"}', '2025-08-06 11:09:20.131438+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('ff0add43-e4c6-4036-8eef-ddb8683fe6eb', 'Stui', 'laszlo.s.szabo@ecomxpert.hu', 36, 'dating', '{"1": "Ritkán", "2": "Kicsit féltékeny vagyok", "3": "Ritkán", "4": "de", "5": "Ritkán", "6": "de", "7": "Ritkán", "8": "Kicsit féltékeny vagyok", "9": "Időnként", "10": "de", "11": "Ritkán", "12": "de", "13": "Ritkán", "14": "Sokat gondolkodom rajta", "15": "Közepesen nehéz", "16": "de", "17": "Ritkán", "18": "de", "19": "Ritkán", "20": "de"}', '2025-08-06 11:27:24.559295+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('a482e07f-a295-4fb7-a51d-cdd78be63112', 'Stui', 'laszlo.s.szabo@ecomxpert.hu', 36, 'dating', '{"1": "Ritkán", "2": "Kicsit féltékeny vagyok", "3": "Ritkán", "4": "de", "5": "Ritkán", "6": "de", "7": "Ritkán", "8": "Kicsit féltékeny vagyok", "9": "Időnként", "10": "de", "11": "Ritkán", "12": "de", "13": "Ritkán", "14": "Sokat gondolkodom rajta", "15": "Közepesen nehéz", "16": "de", "17": "Ritkán", "18": "de", "19": "Ritkán", "20": "de"}', '2025-08-06 11:47:37.279888+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('3d7cbf87-ebbf-43aa-ab73-17a34107270b', '43', '43', 4, 'single', '{"82": "Időnként", "83": "Nagyon zavarja", "84": "Időnként"}', '2025-08-06 11:53:15.660437+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('e607365c-e6a3-495e-85e0-4e42c5b78c93', '43', '43', 43, 'dating', '{"82": "Időnként", "83": "Nagyon zavarja", "84": "Időnként"}', '2025-08-06 11:56:37.762364+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('c2506e6c-bdac-4239-bd51-46a8968ee21f', '43', '43', 43, 'dating', '{"82": "Időnként", "83": "Nagyon zavarja", "84": "Időnként"}', '2025-08-06 12:05:18.239467+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('0d9b8b8a-8a46-4dba-b99f-62505cb980dd', '323', '32', 32, 'relationship', '{"82": "Ritkán", "83": "Nagyon zavarja", "84": "Ritkán"}', '2025-08-06 12:16:17.176055+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('f174515f-c0b9-4097-b6e7-a78dc68ff812', '43', '43', 43, 'dating', '{"82": "Időnként", "83": "Nagyon zavarja", "84": "Időnként"}', '2025-08-06 12:21:23.956749+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('44c41fcd-ac33-4656-aca5-4e686c6705b1', '43', '43', 34, 'single', '{"82": "Időnként", "83": "Nagyon zavarja", "84": "Időnként"}', '2025-08-06 12:21:46.749367+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('03c043a2-391f-43cf-8620-9fa3a5ec3564', '43', '43', 43, 'dating', '{"82": "Időnként", "83": "Nagyon zavarja", "84": "Időnként"}', '2025-08-06 12:33:41.855047+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('235b7a15-e500-4e38-8da6-760bb880855d', '43', 'suti@segitettem.hu', 35, 'dating', '{"82": "Időnként", "83": "Kicsit féltékeny vagyok", "84": "Időnként"}', '2025-08-06 12:52:42.918688+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('26282a72-8e04-464b-afc6-82f411c4edf1', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'married', '{"82": "Ritkán", "83": "Kicsit féltékeny vagyok", "84": "Ritkán"}', '2025-08-06 13:13:29.992226+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('36dadf12-b66d-45d4-9e2e-f12d38633e3d', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'relationship', '{"82": "Ritkán", "83": "Kicsit féltékeny vagyok", "84": "Ritkán"}', '2025-08-06 13:19:41.42009+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('f6e075b0-95b4-4573-a1d7-de2aa3771f1b', 'Kriszti', 'mullerkriszti335@gmail.com', 25, 'relationship', '{"82": "Időnként", "83": "Dühös leszek", "84": "Időnként"}', '2025-08-06 13:55:15.575279+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('cca42479-991f-47d9-afb5-e5c21377b1f1', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'relationship', '{"82": "Soha", "83": "Természetesnek tartom", "84": "Soha"}', '2025-08-06 14:08:31.000861+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('a1fe50e4-4692-45d7-9586-fdb0d97740ee', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'dating', '{"82": "Soha", "83": "Természetesnek tartom", "84": "Soha"}', '2025-08-06 14:36:16.946505+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('8a0051a8-81a7-4516-8c66-23c261166f93', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 34, 'dating', '{"82": "Soha", "83": "Természetesnek tartom", "84": "Soha"}', '2025-08-06 14:37:54.79131+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('5c3645a1-39f0-45e3-9d7c-c05168363013', 'Stui', 'suti@segitettem.hu', 36, NULL, '{"82": "Soha", "83": "Természetesnek tartom", "84": "Soha"}', '2025-08-06 15:30:21.959778+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('19870241-1a49-4e93-bd47-510f60bfafc0', 'Bél', 'suti@segitettem.hu', 37, NULL, '{"82": "Soha", "83": "Természetesnek tartom", "84": "Soha"}', '2025-08-06 15:35:43.222651+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('a89ba6af-50d0-40bf-8176-363db935089a', 'Suti', 'suti@segitettem.hu', 37, 'relationship', '{"82": "Soha", "83": "Természetesnek tartom", "84": "Soha"}', '2025-08-06 18:25:51.273382+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('1882a205-3d05-4d5e-bca9-3d975f31a9e4', 'Sui', 'suti@segitettem.hu', 36, 'relationship', '{"122": "Soha", "123": "Természetesnek tartom", "124": "Soha", "125": "Nem félek"}', '2025-08-07 06:22:19.334282+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('56f9265a-0874-4bac-9e77-4fbe7b961539', 'suti', 'suti@segittt.hu', 35, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 06:27:47.538154+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('e6e7d60e-a407-4cc8-8c75-3730c8a867fb', 'Suti', 'suti@segitettem.hu', 36, 'dating', '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 07:53:21.446423+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('6bad892a-32d1-4baa-931c-4b29ae7d2a73', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 37, 'divorced', '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 08:20:37.811102+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('dde04a6c-8d6b-4c98-846f-a7a6ab38a8fb', 'suti', 'laszlo.s.szabo@ecomxpert.hu', 33, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 08:31:37.902722+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('b36f6913-f5f6-4e89-a399-05d608147529', 'Suti', 'suti@segitettem.hu', 36, 'relationship', '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 08:52:13.562377+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, true),
	('810a0af2-822c-48d3-9041-255a5c583ffd', 'suti', 'suti@segitettem.hu', 434, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 09:04:16.464718+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, true),
	('ae7c2340-bd00-4074-902d-83a3df7aa22d', 'Suti', 'suti@segitettem.hu', 36, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 09:19:01.667249+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('f1c1da90-6200-4f24-916e-d8fd07b125ee', 'suti', 'suti@segitettem.hu', 34, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 09:25:53.345812+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('69eba058-dce3-4fb9-8202-dce7c690e7fb', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 37, 'dating', '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 09:48:44.637116+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('3cd24171-c50c-4eae-8c8a-b5cd91e37472', 'Suti', 'suti@segitettem.hu', 39, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 09:57:02.909806+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('1cb4a64d-ca6a-4f1e-be55-a5bf14978032', 'Laci', 'suti@segitettem.hu', 39, 'relationship', '{"142": "Soha", "143": "Természetesnek tartom", "144": "Gyakran"}', '2025-08-07 10:00:11.766714+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('871cc7b5-ef05-4a71-9150-e05dc5846113', 'Suti', 'suti@segitettem.hu', 37, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 10:13:45.835105+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('1e87e016-6628-4fbc-9fab-6c346d1d8e17', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'relationship', '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 11:36:59.739247+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('b64db0a0-6b2f-4bc2-9dca-7c63c8f08d44', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, NULL, '{"142": "Ritkán", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 11:46:40.503375+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, true),
	('86135fc1-9014-465e-a9c4-41e003db65cb', 'de', 'ede@fe.hu', 36, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 11:58:06.297175+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('4685df62-d4f6-47d5-b2ba-4b8e9c665797', 'dede', 'laszlo.s.szabo@ecomxpert.hu', 43, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 12:08:29.198188+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('009d8766-0e57-4648-8d60-ba1a2e89e22c', 'Andras', 'hello@perenyiandras.com', 44, 'married', '{"142": "Mindig", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 12:11:32.251814+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('922bd66b-74e1-4676-a0b0-6bec19a2c86f', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 15:51:35.78259+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('72a991a7-1ec8-424a-a683-8a4584ac2693', 'sss', 'sww@de.hu', NULL, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 15:55:34.522102+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('45279de3-abde-447b-addb-1ff765597f8f', 'Suti', 'sss@sss.hu', NULL, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 16:10:47.758116+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('fa48b9bd-a4c8-4817-bb52-b60056571a18', 'sefs', 'sef@sef.hu', NULL, NULL, '{"142": "Soha", "143": "Természetesnek tartom", "144": "Soha"}', '2025-08-07 16:14:42.005468+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('865dc790-533f-444c-9714-65068f7b2731', 'Kriszti', 'mullerkriszti335@gmail.com', 25, 'relationship', '{"182": "Időnként", "183": "Dühös leszek", "184": "Gyakran", "185": "bezárok", "186": "Mindig", "187": "örülök", "188": "Soha", "189": "Támogatom", "190": "Mindig", "191": "örülök", "192": "Gyakran", "193": "ingerlékeny leszek", "194": "Mindig", "195": "Várok türelmesen", "196": "Közepesen nehéz", "197": "jól", "198": "Mindig", "199": "kitalálok valamit", "200": "Mindig", "201": "hogy nem vagyok elég jó"}', '2025-08-07 16:32:13.217399+00', 'female', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('e46849de-5632-4d8d-9d4b-c71ec506de61', 'suti', 'suti@segitettem.hu', 343, NULL, '{"202": "Soha", "203": "Természetesnek tartom"}', '2025-08-07 16:43:35.561834+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('dd6bc371-e83f-45af-9bf1-907eefd118ed', 'stui', 'suti@segitettem.hu', NULL, NULL, '{"202": "Soha", "203": "Természetesnek tartom"}', '2025-08-07 16:45:40.705711+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('9e6c894e-9631-4345-9b56-6e05378eaae8', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Soha", "203": "Természetesnek tartom"}', '2025-08-07 16:58:17.369029+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, true),
	('9e9ae457-b510-4c31-9552-1022f04b0bb8', 'suti', 'suti@segitettem.hu', 36, 'relationship', '{"202": "Soha", "203": "Természetesnek tartom"}', '2025-08-08 18:52:39.700771+00', 'male', false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('d735f65b-3ebc-44b3-b274-ea4f7ca4d145', 'suti', 'suti@segitettem.hu', 37, NULL, '{"202": "Soha", "203": "Természetesnek tartom"}', '2025-08-08 20:20:56.088657+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('34e3a35f-a02b-46c8-87de-1db93d44f6f2', 'suti', 'suti@segitettem.hu', 37, NULL, '{"202": "Soha", "203": "Természetesnek tartom"}', '2025-08-08 20:28:51.004873+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('b87927e4-678c-442b-88dc-d99a80d9c16d', 'suti', 'suti@segitettem.hu', 37, NULL, '{"202": "Soha", "203": "Természetesnek tartom"}', '2025-08-08 20:29:51.710376+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('18578191-468a-44ad-8a46-1dc73d794d9d', 'suti', 'suti@segitettem.hu', 37, NULL, '{"202": "Soha", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 20:38:37.035799+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('6da74cb2-8de6-454d-aa69-c588a56aef1b', 'suti', 'suti@segitettem.hu', 35, NULL, '{"202": "Gyakran", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 20:43:38.35806+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('c9c2980a-e9f0-4207-8d0c-9df437916c86', 'suti', 'suti@segitettem.hu', 35, NULL, '{"202": "Időnként", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 20:49:57.953619+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('fcfe003a-90b2-4ecc-9d8e-cad50bf584cd', 'suti', 'suti@segitettem.hu', 22, NULL, '{"202": "Gyakran", "203": "Természetesnek tartom"}', '2025-08-08 21:00:39.993147+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('b11404df-ad28-4b63-ab92-d422fa1ea17d', 'suti', 'suti@segitettem.hu', 33, NULL, '{"202": "Ritkán", "203": "Nagyon zavarja"}', '2025-08-08 21:06:25.079209+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('0f28505a-7471-45fd-b34c-1107f817ba4b', 'suti', 'suti@segitettem.hu', 44, NULL, '{"202": "Gyakran", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 21:09:12.488138+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('d98e1335-678e-4c28-bdd2-2704b867bc70', 'suti', 'suti@segitettem.hu', 44, NULL, '{"202": "Gyakran", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 21:11:38.824454+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('146004eb-efda-4a10-a4aa-c6b780f8c492', 'suti', 'suti@segitettem.hu', 44, NULL, '{"202": "Gyakran", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 21:13:13.637148+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('a85f4cb7-deba-415a-91d4-18fda0c9e205', 'suti', 'suti@segitettem.hu', 44, NULL, '{"202": "Mindig", "203": "Pánikba esem"}', '2025-08-08 21:13:37.597871+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('d4525edd-8341-4490-9f1f-73cfddca1393', 'suti', 'suti@segitettem.hu', 44, NULL, '{"202": "Mindig", "203": "Pánikba esem"}', '2025-08-08 21:16:11.542488+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('1b8952f1-9ae7-4489-b728-df3c09cb6770', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Gyakran", "203": "Nagyon zavarja"}', '2025-08-08 21:16:35.248097+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('81c33145-dbf7-4986-ad3f-1efea2b2a2e5', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Gyakran", "203": "Nagyon zavarja"}', '2025-08-08 21:19:39.097649+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('157ff688-09a3-4bd0-b042-5397da6a143d', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Gyakran", "203": "Nagyon zavarja"}', '2025-08-08 21:23:29.482398+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('711d74b6-8f0f-4ff4-9642-552b8eb0d996', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Időnként", "203": "Nagyon zavarja"}', '2025-08-08 21:25:08.409672+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('7b11b943-eace-4dff-8f76-2bab21a6e7f1', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Gyakran", "203": "Dühös leszek"}', '2025-08-08 21:27:46.510022+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('7b8d4a07-37f5-4595-83b0-dcb7f0e058de', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Időnként", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 21:31:20.115277+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('bd393273-acbd-42a6-ae17-617300d9ba28', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Gyakran", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 21:32:40.4833+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('8e0350ed-3c01-40db-a1ac-c514de3ab296', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Gyakran", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 21:34:25.255582+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('19060095-0a3f-4d8c-8c8c-784cf6177a0e', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Gyakran", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 21:35:22.922987+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('3dc8702b-ce94-4d0e-a3b6-7c3c6fd350e6', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Gyakran", "203": "Kicsit féltékeny vagyok"}', '2025-08-08 21:36:53.624978+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('c5e852c9-571a-45e2-94a1-0e375f2f9056', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Időnként", "203": "Kicsit féltékeny vagyok"}', '2025-08-10 08:58:58.447808+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('e2ebb90b-dfb4-4159-9daf-d1c762c4c448', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Ritkán", "203": "Dühös leszek"}', '2025-08-10 17:55:45.070601+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('2c54baa0-d08e-4ded-8737-eba519378735', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Gyakran", "203": "Dühös leszek"}', '2025-08-10 20:32:47.668376+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('9cdfa571-efce-4d20-968d-d5ca94bf8932', 'suti', 'suti@segitettem.hu', NULL, NULL, '{"202": "Időnként", "203": "Kicsit féltékeny vagyok"}', '2025-08-11 20:13:24.082662+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('5b0f9ac1-a295-410f-9268-26f7e8e664b0', 'hjk', 'laszlo.s.szabo@ecomxpert.hu', NULL, NULL, '{"202": "Gyakran", "203": "Nagyon zavarja"}', '2025-08-13 17:23:20.143149+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false),
	('1ef68b42-1e33-4cb6-89ca-0ffa4975d570', 'suti', 'suti@segitettem.hu', 32, 'relationship', '{"202": "Ritkán", "203": "Dühös leszek"}', '2025-08-13 18:25:51.486173+00', NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false, NULL, false, NULL, false, NULL, false, NULL, NULL, false);


--
-- Data for Name: analysis_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."analysis_results" ("id", "submission_id", "short_analysis", "long_analysis", "created_at") VALUES
	('8b226614-5a60-4340-bcab-2c91d23da167', 'c2506e6c-bdac-4239-bd51-46a8968ee21f', 'A válaszaid alapján úgy tűnik, hogy időnként tapasztalsz olyan érzéseket vagy gondolatokat, amelyek zavarják a párkapcsolati dinamikádat. Az, hogy ezeket az érzéseket észleled, már egy fontos lépés a tudatosság felé, de érdemes lenne mélyebben megvizsgálni, mi okozza ezeket a zavarokat. Talán érdemes lenne egy szakember segítségét kérni, hogy jobban megértsd ezeket az érzéseket és megtaláld a módját, hogyan tudnád pozitívan befolyásolni a kapcsolataidat.', '### Párkapcsolati önszabotáló viselkedés elemzése

Az alábbiakban részletesen elemezzük a felhasználó párkapcsolati önszabotáló viselkedését, figyelembe véve a kvíz válaszait és az azokból levonható következtetéseket.

#### 1) Azonosított minták

A kvíz válaszai alapján három fő mintát azonosíthatunk:

- **Időnkénti aggodalom**: Az "Időnként" válasz arra utal, hogy a felhasználó nem mindig képes kezelni a párkapcsolati helyzeteket, ami feszültséget és szorongást okoz számára. Ez a minta arra utalhat, hogy a felhasználó küzd a bizalommal, és időnként megjelenik benne a kétség a partner iránt.

- **Zavaró érzések**: A "Nagyon zavarja" válasz arra utal, hogy a felhasználó érzései és gondolatai a párkapcsolati helyzetek kapcsán gyakran negatívak, ami tovább erősíti az önszabotáló viselkedést. A zavaró érzések gyakran megakadályozzák a pozitív élmények átélését, és a felhasználó számára nehezen kezelhető helyzeteket eredményeznek.

- **Kétségek és önértékelés**: Az "Időnként" válasz ismétlődése a párkapcsolati helyzetekben arra utal, hogy a felhasználó kétségekkel küzd a kapcsolat értékének és a saját értékének megítélésében. Ez a minta a múltbeli tapasztalatok és a jelenlegi helyzetek által generált félelmek eredménye lehet.

#### 2) Konkrét technikák

Ahhoz, hogy a felhasználó hatékonyan szembenézzen a párkapcsolati önszabotáló viselkedésével, érdemes megfontolnia az alábbi technikákat:

- **Megállj technika**: Ez a technika abban segít, hogy a felhasználó tudatosan megálljon, mielőtt reagálna a zavaró érzéseire. Amikor a negatív gondolatok vagy érzések megjelennek, a felhasználó mondja ki magának: "Megállok és átgondolom a helyzetet." Ez segíthet az impulzív reakciók csökkentésében.

- **Naplózás**: A gondolatok és érzések naplózása segíthet a felhasználónak abban, hogy jobban megértse a belső folyamatait. Ezen kívül, a naplózás lehetőséget ad arra, hogy a felhasználó nyomon kövesse a fejlődését és az önszabotáló mintáit.

- **Pozitív megerősítés**: A felhasználónak érdemes tudatosan keresnie a pozitív dolgokat a párkapcsolatában, és ezeket megerősítenie magában. Például: "Tudom, hogy a kapcsolatunk fontos, és érdemes küzdenem érte."

#### 3) Gyakorlati lépések

A következő lépések segíthetnek a felhasználónak abban, hogy megbirkózzon a párkapcsolati önszabotáló viselkedésével:

1. **Önreflexió**: Szánjon napi 10-15 percet arra, hogy átgondolja a párkapcsolati helyzeteit, és írjon le minden zavaró érzést és gondolatot. Ezt követően próbáljon meg azonosítani a mögöttes okokat.

2. **Kommunikáció a partnerrel**: Nyitott és őszinte beszélgetés a partnerrel a zavaró érzésekről és gondolatokról segíthet a feszültségek oldásában. Fontos, hogy a felhasználó kifejezze, mit érez, és hogyan hatnak rá a párkapcsolati helyzetek.

3. **Célok kitűzése**: Határozzon meg konkrét, elérhető célokat a párkapcsolatában. Ezek lehetnek akár apró lépések is, mint például egy közös program megszervezése vagy a partner támogatása egy nehéz időszakban.

4. **Önmagával való együttérzés**: A felhasználónak fontos, hogy megértse, hogy a párkapcsolati nehézségek normálisak, és hogy nem egyedül van a küzdelmeivel. Legyen kedves önmagához, és fogadja el, hogy a fejlődés időbe telik.

Ezek a lépések és technikák segíthetnek a felhasználónak abban, hogy tudatosan kezelje a párkapcsolati önszabotáló viselkedését, és egy egészséges, támogató kapcsolatot építsen ki a partnerével. Ne feledje, hogy a fejlődés folyamatos folyamat, és a legfontosabb az, hogy lépésről lépésre haladjon.', '2025-08-06 12:05:59.348972+00'),
	('a65481c0-5fe6-4cce-94cc-fd3d749bfb7c', '0d9b8b8a-8a46-4dba-b99f-62505cb980dd', 'Kedves 323,

A kvíz válaszaid alapján úgy tűnik, hogy időnként önszabotáló viselkedésre hajlamos vagy a párkapcsolatodban. Azt jelzi, hogy bizonyos helyzetek, amelyek zavaróak számodra, ritkán okoznak problémát, de amikor ez mégis megtörténik, az komoly hatással lehet a kapcsolatodra. Fontos lenne, hogy felfedezd, miért zavar téged annyira a partnereddel való kommunikáció, és hogyan tudnád ezt nyíltan kezelni. Érdemes lenne egy szakember segítségével mélyebben is foglalkoznod ezzel, hogy pozitív irányba tudj haladni a kapcsolatodban.', 'Kedves 323,

Köszönöm, hogy megosztottad velem a kvíz eredményeit. Az elemzés célja, hogy jobban megértsük a párkapcsolati önszabotáló viselkedésedet, és hogy közösen találjunk hatékony módszereket a megoldására. 

### 1) Azonosított minták

A kvíz válaszaiból úgy tűnik, hogy bizonyos minták figyelhetők meg a kapcsolati dinamikádban. Az alábbiakat azonosítottam:

- **Zavaró tényezők:** A második kérdésre adott válaszod ("Nagyon zavarja") arra utal, hogy a párkapcsolatodban előforduló problémák, konfliktusok vagy érzelmi feszültségek komoly mértékben befolyásolják a közérzetedet. Ezt a zavaró tényezőt valószínűleg nehezen kezeled, ami önszabotáló viselkedéshez vezethet, például elkerülni a nehéz beszélgetéseket vagy elfojtani az érzéseidet.

- **Korlátozott kifejezés:** Az, hogy a zavaró tényezőket ritkán érzed, arra utalhat, hogy nem mindig tudod vagy akarod kifejezni az érzéseidet, ami hosszú távon feszültséget és bűntudatot okozhat. Ez a viselkedés az önszabotálás egyik formája, mert megakadályozza a nyílt kommunikációt a partnered felé.

### 2) Konkrét technikák

Az önszabotáló viselkedésed kezelésére az alábbi "megállj" technikákat javaslom:

- **Érzelmi napló:** Kezdj el naplót írni, amelyben rögzíted az érzéseidet és gondolataidat a párkapcsolatoddal kapcsolatban. Ez segíthet tisztábban látni, mi zavar, és miért. Amikor megérzed, hogy valami zavar, írd le, és reflektálj rá.

- **Kérdések önmagadhoz:** Amikor zavarodott vagy, állj meg egy pillanatra, és kérdezd meg magadtól: "Miért zavar ez most?" vagy "Miért érzem úgy, hogy el kell fojtanom ezt az érzést?" Ezek a kérdések segíthetnek a mélyebb megértésben és a feszültség kezelésében.

- **Kommunikációs gyakorlat:** Gyakorolj olyan helyzeteket, ahol nyíltan tudod kifejezni az érzéseidet. Képzeld el, hogy beszélsz a partnereddel egy érzékeny témáról, és próbáld meg elmondani a gondolataidat és érzéseidet anélkül, hogy elkerülnéd a konfliktust.

### 3) Gyakorlati lépések

1. **Naplózás:** Kezdd el az érzelmi naplózást heti rendszerességgel. Rögzítsd, hogyan érzed magad a kapcsolatodban, és azokat az eseményeket, amelyek zavaróak számodra.

2. **Reflexió:** Válassz ki egy napot a héten, amikor visszanézed a naplódat. Nézd meg, hogy vannak-e ismétlődő minták az érzéseidben, és mit tanulsz belőlük.

3. **Beszélgess a partnereddel:** Válassz ki egy alkalmas időt, amikor nyugodtan beszélgethettek. Kezdj el nyíltan kommunikálni az érzéseidről, és próbáld meg kifejezni, mi zavar téged anélkül, hogy vádaskodnál. Használj "én" üzeneteket, mint például "Én úgy érzem, hogy…" 

4. **Önfejlesztés:** Fontos, hogy folyamatosan dolgozz magadon. Olvass könyveket a párkapcsolati kommunikációról, vagy vegyél részt workshopokon, ahol a kapcsolati dinamikák javítására összpontosítanak.

5. **Keresd a támogatást:** Ha úgy érzed, hogy a problémák túl nagyok ahhoz, hogy egyedül kezeld őket, fontold meg, hogy párterápiát keress fel. Egy szakember segíthet abban, hogy jobban megértsd a dinamikákat, és a megfelelő eszközöket adja a kezedbe a fejlődéshez.

Kérlek, tudd, hogy nem vagy egyedül ezzel a helyzettel, és az önszabotáló viselkedés felismerése már egy fontos lépés a változás felé. Bízom benne, hogy ezek a technikák és tanácsok segítenek a fejlődésedben és a párkapcsolati elégedettséged növelésében.

Sok sikert kívánok az utadhoz!

Üdvözlettel,
[Professzionális Pszichológus]', '2025-08-06 12:16:22.880499+00'),
	('542b0bc0-e2d6-4904-8414-1d86690743a7', 'f174515f-c0b9-4097-b6e7-a78dc68ff812', 'Az Ön válaszai alapján úgy tűnik, hogy időnként küzd a párkapcsolati elköteleződéssel, és a kapcsolatokban felmerülő feszültségek zavaróak lehetnek Ön számára. Fontos lenne, hogy mélyebben átgondolja, miért tapasztal ilyen érzéseket, és hogyan lehetne ezeket kezelni. Javaslom, hogy keressen támogatást, például egy párkapcsolati tanácsadót, hogy jobban megérthesse saját szükségleteit és félelmeit.', '### 1) Azonosított minták

A kvíz válaszai alapján néhány fontos mintát tudunk azonosítani, amelyek a felhasználó párkapcsolati önszabotáló viselkedésére utalnak. 

- **Időnkénti szorongás:** Az "Időnként" válaszok azt jelzik, hogy a felhasználó időnként tapasztal szorongást a párkapcsolatai során. Ez a szorongás lehet a közelgő elköteleződés, a másik fél iránti érzések, vagy akár a személyes múltbeli tapasztalatokból fakadó félelmekből adódóan is megjelenhet. 

- **Zavartság:** A "Nagyon zavarja" válasz arra utal, hogy a felhasználó számára zavaró, ha a párkapcsolati helyzet nem egyértelmű. Ez a zavarodottság fokozhatja a szorongást, és ezzel hozzájárulhat a párkapcsolati önszabotáló viselkedéshez. 

- **Változó érzések:** Az "Időnként" válasz arra is utal, hogy a felhasználó érzelmei a párkapcsolatokban nem stabilak. Ez a bizonytalanság és a változékony érzések gyakran vezetnek önszabotáló döntésekhez, például elkerülő viselkedéshez vagy a kapcsolat megszakításához, amikor a dolgok nehezebbé válnak. 

### 2) Konkrét technikák

A felhasználónak érdemes olyan technikákat alkalmaznia, amelyek segítenek a szorongás és a zavarodottság kezelésében. Íme néhány konkrét "megállj" technika:

- **Önreflexió:** Készítsen egy naplót, ahol leírja az érzéseit és gondolatait a kapcsolataival kapcsolatban. Ez segíthet tisztábban látni a mintákat és a kiváltó okokat, amelyek a szorongást okozzák.

- **Pozitív megerősítés:** Minden nap mondjon magának pozitív megerősítéseket a párkapcsolati helyzetéről. Például: "Értékes vagyok, és megérdemlem a szeretetet." Ez segíthet megerősíteni az önértékelését.

- **Lélegző gyakorlatok:** Amikor úgy érzi, hogy a szorongás fokozódik, próbáljon ki mély légzőgyakorlatokat. Lélegezzen be mélyen az orrán, tartsa bent néhány másodpercig, majd fújja ki a levegőt a száján. Ezt ismételje meg többször.

### 3) Gyakorlati lépések

Most, hogy azonosítottuk a mintákat és a technikákat, itt van néhány gyakorlati lépés, amely segíthet a felhasználónak a párkapcsolati önszabotáló viselkedések csökkentésében:

1. **Naplózás elkezdése:** Kezdjen el rendszeresen naplót írni a párkapcsolati élményeiről és érzéseiről. Ez lehetővé teszi a reflexiót és a gondolatok rendezését.

2. **Keresés a kiváltó okok után:** Azonosítsa azokat a helyzeteket vagy eseményeket, amelyek szorongást okoznak. Kérdezze meg magát, hogy miért reagál így, és próbáljon meg alternatív megoldásokat keresni.

3. **Kommunikáció a partnerrel:** Ha van partnere, próbáljon nyíltan beszélni az érzéseiről és szorongásairól. A kommunikáció segíthet megérteni egymást, és csökkentheti a zavarodottságot.

4. **Kisebb lépések:** Ha úgy érzi, hogy a kapcsolat túl gyorsan halad, próbáljon meg kisebb lépéseket tenni a közeljövőbeli elköteleződések felé. Ez csökkentheti a szorongást, és lehetőséget ad a fejlődésre.

5. **Folyamatos önfejlesztés:** Vegyen részt önfejlesztő workshopokon vagy terápián, ahol szakemberek segíthetnek a párkapcsolati minták feltárásában és a szorongás kezelésében.

Empatikusan bátorítom Önt, hogy lépjen a változás útjára. A párkapcsolati önszabotálás felismerése és kezelése egy hosszú folyamat, de a tudatos lépések és a megfelelő technikák segítségével képes lesz erősebb és egészségesebb kapcsolatok kialakítására. Ne feledje, hogy nem egyedül van, és hogy a fejlődéshez idő és türelem szükséges.', '2025-08-06 12:21:54.723384+00'),
	('a6feb387-6486-41a4-a539-ecf7b4e85a7e', '44c41fcd-ac33-4656-aca5-4e686c6705b1', 'A válaszaid alapján úgy tűnik, hogy időnként küzdesz a párkapcsolatokkal kapcsolatos zavarodottsággal, és ez befolyásolja az érzéseidet és viselkedésedet. Azt is jelzi, hogy a kapcsolatokban való elköteleződés vagy egy bizonyos szintű közelség zavarhat téged, ami arra utalhat, hogy félelmeid vagy bizonytalanságaid lehetnek a párkapcsolatokkal kapcsolatban. Érdemes lenne mélyebben megvizsgálni ezeket az érzéseket, és esetleg beszélni egy szakemberrel, hogy jobban megérthesd a saját szükségleteidet és elkerülhesd az önszabotáló mintázatokat.', '**Párkapcsolati önszabotáló viselkedés elemzése**

Kedves Felhasználó! Köszönöm, hogy megosztottad velem a kvíz válaszaidat. Az alábbiakban részletes elemzést készítek a párkapcsolati önszabotáló viselkedésedről, amely segíthet abban, hogy tudatosabban kezeld a kapcsolataidat és elkerüld a negatív mintákat. Az elemzést három fő részre bontom: azonosított minták, konkrét technikák és gyakorlati lépések.

### 1) Azonosított minták

A kvíz válaszaid alapján az alábbi mintákat azonosítottam:

- **Időnkénti zavar**: Az a tény, hogy időnként zavar a kapcsolatokban tapasztalt nehézségek, arra utal, hogy lehet, hogy nem vagy teljesen elégedett a párkapcsolati helyzeteddel, de nem mindig tudod, hogyan kezeld ezt a zavart. Ez a félelem a kudarcoktól, a kapcsolatokban való elköteleződéstől, valamint a múltbeli negatív tapasztalatokból eredhet.
  
- **Önszabotáló gondolatok**: Az "időnként" válaszok azt jelzik, hogy a párkapcsolati önszabotálás nem folyamatos, hanem ciklikusan jelentkezik. Ezért fontos felismerni azokat a helyzeteket, amelyek kiváltják ezt a viselkedést, és megérteni, hogy ezek a gondolatok és érzések nem tükrözik a valóságot, csupán a belső félelmeid kivetítései.

### 2) Konkrét technikák

A helyzeted javítása érdekében javaslom az alábbi "megállj" technikákat, amelyek segíthetnek a pozitív irányú változás elérésében:

- **Önreflexió**: Készíts egy listát azokról a gondolatokról és érzésekről, amelyeket a párkapcsolatokkal kapcsolatban tapasztalsz. Mikor és miért érzed magad zavarban? Milyen helyzetek váltják ki a szabotáló viselkedést?

- **Pozitív megerősítés**: Hozd létre a saját pozitív megerősítéseidet, amelyek segíthetnek a negatív gondolatok helyettesítésében. Például: "Képes vagyok egy boldog és egészséges kapcsolatra." Ismételd ezeket a megerősítéseket naponta.

- **Jelenlét gyakorlása**: A mindfulness technikák alkalmazása segíthet abban, hogy tudatosabb legyél a pillanatban, és jobban megértsd a saját érzéseidet és reakcióidat. Próbálj meg napi 10 percet meditálni vagy légzőgyakorlatokat végezni.

### 3) Gyakorlati lépések

Most nézzük meg, hogyan tudod ezeket a technikákat a gyakorlatba ültetni:

1. **Napi napló vezetése**: Kezdj el naplót vezetni, amelyben rögzíted a párkapcsolati érzéseidet és gondolataidat. Ez segíthet abban, hogy tudatosítsd magadban az önszabotáló mintákat és a kiváltó okokat.

2. **Külső támogatás**: Ne félj segítséget kérni barátoktól, családtagoktól vagy akár egy szakembertől. A társas támogatás nagyon fontos, amikor a párkapcsolati nehézségekkel foglalkozol.

3. **Kapcsolati célok kitűzése**: Határozz meg konkrét célokat a párkapcsolataiddal kapcsolatban. Például, ha érdekel egy új kapcsolat, tűzd ki célként, hogy hetente legalább egyszer ismerkedsz új emberekkel.

4. **Pozitív tapasztalatok keresése**: Próbálj meg tudatosan olyan helyzeteket keresni, amelyek örömet okoznak számodra a kapcsolatok terén. Lehet ez egy közös program a barátokkal, vagy egy új hobbi, amely új emberekkel való találkozást kínál.

Ezek a lépések segíthetnek abban, hogy tudatosan lépj a párkapcsolati önszabotáló viselkedésed ellen, és elérd a vágyott boldog és egészséges kapcsolatokat. Ne feledd, hogy a változás időt és türelmet igényel, de minden kis lépés számít. Bízom benne, hogy ezek a javaslatok támogatni fognak az utadon.', '2025-08-06 12:21:51.261402+00'),
	('f6a78853-2074-4f00-b3f3-7241cc821240', '03c043a2-391f-43cf-8620-9fa3a5ec3564', 'A válaszaid alapján úgy tűnik, hogy időnként küzdesz a párkapcsolati dinamikákkal, és ez zavarja is a lelki békédet. Ez a fajta önszabotáló viselkedés gyakran a félelem vagy a bizonytalanság jele, amelyek megakadályozhatják, hogy teljes mértékben megéld a kapcsolatot. Érdemes lenne mélyebben megvizsgálni ezeket az érzéseket, és talán szakember segítségével dolgozni rajtuk, hogy egészségesebb módon tudj kapcsolódni másokhoz.', '### 1) Azonosított minták

A kvíz válaszaiból egyértelműen kiderül, hogy a felhasználó időnként tapasztal önszabotáló viselkedést a párkapcsolatok terén. Az "Időnként" válasz arra utal, hogy a felhasználó tudatában van ennek a viselkedésnek, de nem minden alkalommal tapasztalja. A "Nagyon zavarja" válasz jelzi, hogy ez a minta komoly frusztrációt okoz számára, ami arra utal, hogy szeretne változtatni a helyzetén, de a belső gátak és félelmek akadályozzák ebben.

A párkapcsolati önszabotálás gyakran a következő mintákban nyilvánul meg:

- **Félelem a közelségtől**: A felhasználó esetében valószínű, hogy a kapcsolatokban való elköteleződés vagy a mélyebb érzelmi kapcsolódás elkerülésének mechanizmusai működnek. Ez megjelenhet például abban, hogy a felhasználó elkerüli a mély beszélgetéseket, vagy elhúzódik a partnerétől, amikor a kapcsolat komolyabbá válik.

- **Önbizalomhiány**: A frusztráció érzete arra utalhat, hogy a felhasználó nem hiszi el, hogy megérdemli a boldogságot egy párkapcsolatban, ami szintén önszabotáló viselkedéshez vezethet.

- **Túlzott idealizálás**: A felhasználó hajlamos lehet arra, hogy túl nagy elvárásokat támaszt a potenciális partnerekkel szemben, ami miatt könnyen csalódik és eltávolodik tőlük.

### 2) Konkrét technikák

A "megállj" technikák célja, hogy segíthetnek a felhasználónak tudatosítani az önszabotáló gondolatokat és viselkedéseket, és lehetőséget adjanak a változtatásra:

- **Önreflexió**: Minden alkalommal, amikor a felhasználó észleli, hogy elkerüli a partnerét, vagy negatív gondolatok merülnek fel benne, álljon meg egy pillanatra. Kérdezze meg magától: "Miért érzem így magam? Mi az, ami valóban aggaszt?" Ezzel a technikával a felhasználó képes lehet a valódi érzéseit és félelmeit feltárni.

- **Pozitív megerősítés**: Készítsen egy listát a saját erősségeiről és pozitív tulajdonságairól. Minden nap olvassa el ezt a listát, hogy megerősítse az önértékelését és csökkentse az önbizalomhiányt.

- **Jelen pillanat tudatosítása**: Gyakorolja a mindfulness-t, amely során a felhasználó a jelen pillanatra összpontosít, ahelyett hogy aggódna a jövőbeli lehetőségek vagy a múltbeli csalódások miatt. Ez segíthet csökkenteni a szorongást és a félelmeket.

### 3) Gyakorlati lépések

1. **Naplóírás**: Kezdjen el naplót vezetni a párkapcsolati élményeiről, érzéseiről és gondolatairól. Írja le a tapasztalatait, amikor úgy érzi, hogy önszabotáló viselkedést tanúsít. Ez segít a minták azonosításában és a tudatosításban.

2. **Célok kitűzése**: Határozzon meg konkrét, elérhető célokat a párkapcsolatai terén, például: "Minden héten elmegyek egy randira, és próbálok nyitott lenni." Ez segít a felhasználónak a fókuszálásban és a fejlődés nyomon követésében.

3. **Beszélgessen valakivel**: Fontolja meg, hogy szakemberhez fordul, aki segíthet a mélyebb problémák feltárásában és a félelmek kezelésében. A párterápia vagy az egyéni terápia nagyszerű lehetőség lehet a fejlődésre.

4. **Támogató közeg**: Kereszen támogató barátokat vagy csoportokat, ahol megoszthatja tapasztalatait és érzéseit. A közösség ereje segíthet a felhasználónak abban, hogy ne érezze magát egyedül a küzdelmeiben.

Ezek a lépések és technikák segíthetnek a felhasználónak abban, hogy felismerje és kezelje az önszabotáló viselkedését, valamint elinduljon egy támogató, egészséges párkapcsolat irányába. Ne feledje, a változás időbe telik, és fontos, hogy türelmes legyen önmagával.', '2025-08-06 12:33:46.000308+00'),
	('e62fbfd0-9164-4ee2-81e2-a08350e01ddf', '235b7a15-e500-4e38-8da6-760bb880855d', 'Kedves Felhasználó,

Az általad megosztott válaszok alapján úgy tűnik, hogy időnként érzed, hogy nem vagy elég jó a partnered számára, ami arra utalhat, hogy bizonyos önértékelési problémákkal küzdesz. A kicsit féltékeny reakció a partnered másokkal való interakciójára, valamint a konfliktusok utáni kérdőjelezés, azt jelzi, hogy van benned egyfajta szorongás a kapcsolati dinamikával kapcsolatban. Ezek a viselkedések önszabotáló mintákat hordozhatnak, amelyek gátolhatják a kapcsolat fejlődését. Fontos lenne, hogy foglalkozz a saját érzéseiddel és önértékeléseddel, lehetőleg egy szakember segítségével, hogy egészségesebb megközelítést találj a párkapcsolatokban.', '### 1) Azonosított minták

A kvíz válaszai alapján néhány lényeges önszabotáló mintát azonosíthatunk, amelyek befolyásolják a párkapcsolati dinamikádat. 

- **Önbecsülés és önértékelés**: Az, hogy időnként úgy érzed, nem vagy elég jó a partnered számára, azt mutatja, hogy küzdesz az önértékeléseddel. Ez a gondolat nemcsak a saját magaddal kapcsolatos érzéseidet befolyásolja, hanem a kapcsolatodban való bizalomra is hatással van. Az ilyen gondolatok gyakran vezetnek ahhoz, hogy visszahúzódj, vagy túlságosan megfelelni próbálj a másik elvárásainak.

- **Féltékenység**: Az, hogy kicsit féltékeny vagy, amikor a partnered mással beszélget, arra utal, hogy bizonyos mértékig szorongsz a kapcsolat stabilitása miatt. Ez a féltékenység gyakran a saját önbizalomhiányodból fakad, és a kapcsolat feszültségeit is növelheti.

- **Konfliktuskezelés**: Az, hogy időnként kérdőjelezed meg a kapcsolatotokat konfliktus után, arra utal, hogy nem vagy biztos a kapcsolat jövőjében, és hajlamos vagy a negatív gondolatokra. Ez a viselkedés önszabotáló, mivel nem segít a problémák megoldásában, hanem inkább fokozza a feszültséget.

### 2) Konkrét technikák

A következő "megállj" technikák segíthetnek abban, hogy tudatosan változtass a negatív mintákon:

- **Önértékelés javítása**: Minden nap írj le három dolgot, amiben jó vagy, vagy amit szeretsz magadban. Ez segít abban, hogy pozitívabban lásd magadat, és csökkentsd a "nem vagyok elég jó" érzést.

- **Féltékenység kezelése**: Amikor féltékeny érzéseket tapasztalsz, állj meg, és kérdezd meg magadtól, mi az, ami valójában zavar. Próbáld meg beszélni a partnered érzéseivel, hogy jobban megértsd a helyzetet, és csökkentsd a szorongásodat.

- **Konfliktus utáni reflexió**: Konfliktus után írj le egy naplót arról, hogy mit éreztél, és miért kérdőjeleződött meg a kapcsolat. Ez segíthet abban, hogy objektívebben lásd a helyzetet, és elkerüld a felesleges aggodalmakat.

### 3) Gyakorlati lépések

1. **Önértékelési gyakorlatok**: Kezdj el egy önértékelési naplót. Minden este írj le három dolgot, amikért hálás vagy, vagy amik jól sikerültek. Esetleg tarts egy "önértékelő" havonta egyszer, ahol megünnepled a fejlődésedet.

2. **Féltékenység tudatosítása**: Készíts egy "féltékenység naplót", ahol leírod a féltékeny gondolataidat, és azt, hogy miért érezted ezt. Ez segít abban, hogy jobban megértsd, mi váltja ki ezeket az érzéseket, és lehetőséged lesz a kommunikációra a partnered felé.

3. **Konfliktuskezelési terv**: Készíts egy tervet arról, hogyan szeretnél reagálni konfliktusok során. Például, amikor konfliktus merül fel, írd le a gondolataidat, és várj egy napot, mielőtt beszélnél a partnereddel, hogy tisztábban lásd a helyzetet.

Ezek a lépések nemcsak a kapcsolatodat erősítik, hanem a saját önértékelésedet is. Ne feledd, hogy a változás időbe telik, és fontos, hogy türelmes legyél magaddal. Mindig keresd a lehetőségeket a fejlődésre, és ne habozz segítséget kérni, ha szükséged van rá. A párkapcsolat egy közös utazás, amelyben mindkettőtöknek részt kell vennie a fejlődésben.', '2025-08-06 12:52:53.051484+00'),
	('a585df84-5f14-4c88-a86e-eccb2c72f83a', '26282a72-8e04-464b-afc6-82f411c4edf1', 'Suti, az általad megosztott válaszok alapján úgy tűnik, hogy általában pozitívan látod a helyzetedet a párkapcsolatban, hiszen ritkán érzed magad nem elég jónak. Ugyanakkor a féltékenységed jelezheti, hogy mélyebb szinten bizonytalanságok is jelen lehetnek. Érdemes lehet ezeket a érzéseket alaposabban megvizsgálni, hiszen a féltékenység hosszú távon önszabotáló viselkedéshez vezethet. Ajánlom, hogy nyitott párbeszédet folytass a partnereddel az érzéseidről, hogy erősíthessétek a kapcsolatotokat.', '### 1) Azonosított minták

Suti válaszai alapján néhány fontos mintát észlelhetünk, amelyek a párkapcsolati önszabotáló viselkedést tükrözhetik. Az első válasz alapján, miszerint "ritkán" érzi úgy, hogy nem elég jó a párja számára, arra utal, hogy van egy bizonyos szintű önértékelése és önbizalma. Ugyanakkor a második válasz, amely szerint "kicsit féltékeny" a partner másokkal való interakciója miatt, arra figyelmeztet, hogy Suti érzései és reakciói a féltékenység irányába is elmozdulhatnak. Ez a féltékenység számos párkapcsolatban konfliktusok forrása lehet, és ha nem kezelik megfelelően, önszabotáló viselkedéshez vezethet.

A harmadik válasz, amelyben Suti ritkán kérdőjelezi meg a kapcsolatot konfliktus után, arra utal, hogy hajlamos lehet elnyomni az érzéseit, vagy nem szembesülni a problémákkal, ami hosszú távon feszültséget generálhat a kapcsolatban. Az ilyen típusú viselkedés gyakran eredményezheti, hogy a problémák felhalmozódnak, és végül robbanáshoz vezetnek, ami szintén önszabotáló mintának számít.

### 2) Konkrét technikák

A következő "megállj" technikák segíthetnek Sutinak a párkapcsolati önszabotáló viselkedésének kezelésében:

1. **Féltékenység kezelése**:
   - Azonosítsd a féltékenység forrását. Kérdezd meg magadtól, hogy miért érzed ezt? Milyen önértékelési problémák állhatnak a háttérben?
   - Amikor féltékenységet érzel, állj meg egy pillanatra, és lélegezz mélyeket. Képzeld el, hogy megosztod a félelmeidet a partnereddel, és kérj tőle megerősítést a kapcsolatotokat illetően.

2. **Önértékelés fejlesztése**:
   - Készíts listát azokról a tulajdonságaidról és eredményeidről, amelyekre büszke vagy! Ez segíthet növelni az önbizalmadat.
   - Naponta szánj időt arra, hogy pozitív megerősítéseket mondj magadnak, például: "Én értékes vagyok és megérdemlem a szeretetet."

3. **Konfliktuskezelés**:
   - Használj "időzítőt" a konfliktusok során: adj magadnak és a partnerednek időt, hogy megnyugodjatok, majd beszéljétek meg az érzéseiteket.
   - Vezess naplót a párkapcsolati érzéseidről és gondolataidról, így jobban megértheted a saját reakcióidat és érzéseidet.

### 3) Gyakorlati lépések

1. **Hétfői önértékelő pillanatok**: Minden hétfőn szánj időt arra, hogy áttekintsd, hogyan érezted magad a kapcsolatodban az előző héten. Milyen gondolatok és érzések merültek fel? Írd le őket, és keress rájuk megoldásokat.

2. **Féltékenységi napló**: Készíts egy naplót, amelyben nyomon követed a féltékenységedet. Mikor és miért érezted ezt? Milyen helyzetek váltották ki? Ez segíteni fog a tudatosság növelésében.

3. **Kommunikációs nap**: Válassz ki egy napot a héten, amikor a partneredet megkérdezed az érzéseiről, és megosztod a sajátjaidat. Ez lehetőséget ad arra, hogy nyíltan beszéljetek a kapcsolatotokról, és megerősítse a köztetek lévő bizalmat.

4. **Félelem leküzdése**: Amikor féltékenységet érzel, próbálj meg egy "megállj" technikát alkalmazni. Mondj magadnak: "Megállok! Mi az, ami valóban zavar? Hogyan tudom ezt megoldani?" Ez segít, hogy ne reagálj impulzívan, hanem tudatosan kezeld a helyzetet.

Suti, fontos, hogy tudd, hogy a párkapcsolatok mindennapos munka és elköteleződés kérdései. Az érzéseid és reakcióid teljesen normálisak, és a tudatos munkával javíthatod a kapcsolatodat. Ne félj segítséget kérni, ha úgy érzed, hogy szükséged van rá. Te is képes vagy a fejlődésre és a változásra!', '2025-08-06 13:13:36.775187+00'),
	('7306ae14-1e19-4d25-b3b1-deb2651c34a1', '36dadf12-b66d-45d4-9e2e-f12d38633e3d', 'Suti, a válaszaid alapján úgy tűnik, hogy a párkapcsolatodban viszonylag stabil alapokon állsz, hiszen ritkán érzed magad nem elég jónak a partnered számára, és a konfliktusok után is gyorsan túllépsz. Ugyanakkor a féltékenység, amit a partnered másokkal való beszélgetésekor érzel, jelezheti, hogy van benned egyfajta insecurities, ami befolyásolhatja a kapcsolatotokat. Érdemes lenne ezen érzéseidet mélyebben megvizsgálni, hogy még harmonikusabbá tudd tenni a párkapcsolatot.', '### 1) Azonosított minták

Az Ön válaszai alapján néhány fontos mintát azonosíthatunk, amelyek a párkapcsolati önszabotáló viselkedéshez kapcsolódhatnak. Először is, bár ritkán érzi úgy, hogy nem elég jó a partnerének, a féltékenység érzése, amikor a partner mással beszélget, arra utal, hogy lehetnek mélyebb, rejtettebb önértékelési problémái. A féltékenység sok esetben a saját bizonytalanságunk és a másik iránti bizalom hiányának jele. 

Továbbá, a kapcsolat utáni kérdőjelezés ritkasága azt jelzi, hogy Ön talán hajlamos elnyomni az érzéseit vagy a konfliktusokat, ahelyett hogy azokkal szembenézne. Ez a viselkedés önszabotáló lehet, mivel a problémák elhanyagolása hosszú távon feszültséget és frusztrációt okozhat a kapcsolatban. 

### 2) Konkrét technikák

A "megállj" technikák alkalmazása segíthet az önszabotáló gondolatok és viselkedések kezelésében:

- **Féltékenység kezelése**: Amikor féltékenységet érez, álljon meg egy pillanatra, és kérdezze meg magát: "Miért érzem ezt? Milyen önértékelési problémák állhatnak a háttérben?" Írja le a gondolatait egy naplóba, hogy tisztábban lássa, mi váltja ki ezt az érzést.

- **Konfliktuskezelés**: Amikor konfliktus után megkérdőjelezi a kapcsolatot, vegyen egy mély lélegzetet, és próbáljon meg egy "megállj" pillanatot beiktatni. Kérdezze meg magát: "Ez a kérdés valóban a kapcsolatunkat érinti, vagy inkább az én belső félelmeimről van szó?" 

- **Önértékelés**: Rendszeresen szánjon időt arra, hogy reflektáljon a saját értékeire és erősségeire. Használjon pozitív megerősítéseket, mint például: "Én értékes vagyok, és megérdemlem a szeretetet."

### 3) Gyakorlati lépések

A következő lépések segíthetnek Önnek abban, hogy aktívan dolgozzon a párkapcsolati önszabotáló viselkedések leküzdésén:

1. **Naponta szánjon időt az önértékelésre**: Minden nap írjon le három dolgot, amiért büszke önmagára. Ezzel fokozatosan növelheti az önértékelését.

2. **Beszélgessen a partnerével**: Nyíltan beszéljen a féltékeny érzéseiről a partnerével. Kérjen visszajelzést arról, hogy mit érez, és próbáljon meg közösen megoldásokat találni. Ez megerősíti a bizalmat.

3. **Konfliktuskezelő gyakorlatok**: Tanuljon meg hatékony konfliktuskezelési technikákat, mint például az aktív hallgatás. Amikor a partnerével beszélget, összpontosítson arra, hogy ténylegesen meghallgassa őt, anélkül, hogy azonnal reagálna.

4. **Kérjen szakmai segítséget**: Ha úgy érzi, hogy a féltékenység és az önértékelési problémák túlságosan megterhelik a kapcsolatát, fontolja meg, hogy szakember segítségét kéri. A párterápia vagy egyéni terápia segíthet a mélyebb belső problémák feltárásában.

Ezek a lépések nemcsak a párkapcsolat javításában segítenek, hanem Önnek is lehetőséget adnak a személyes fejlődésre. Ne feledje, hogy a változás időt igényel, de a tudatos munka és a szeretet segíthet Önnek abban, hogy jobban érezze magát a bőrében és a kapcsolatában.', '2025-08-06 13:19:48.975292+00'),
	('7de06932-b449-4a29-9131-684f378677c0', 'f6e075b0-95b4-4573-a1d7-de2aa3771f1b', 'Kriszti, a válaszaid alapján úgy tűnik, hogy némi önértékelési problémával küzdesz, ami hatással lehet a párkapcsolatodra. Az, hogy időnként nem érzed magad elég jónak a partnered számára, és a dühöd, amikor ő mással beszélget, arra utal, hogy a bizalom és az önértékelés terén érdemes lenne dolgozni. Fontos, hogy nyíltan kommunikálj a partnered felé az érzéseidről, és próbálj meg tudatosan dolgozni a félelmeiden, hogy a kapcsolatotok egészségesebbé és boldogabbá váljon.', 'Kedves Kriszti!

Örülök, hogy megosztottad velem a kvíz válaszaidat, és lehetőséget adtál arra, hogy segítsek neked a párkapcsolati önszabotáló viselkedésed elemzésében. Az alábbiakban részletesen kifejtem az azonosított mintáidat, konkrét "megállj" technikákat, valamint gyakorlati lépéseket, amelyek segítségedre lehetnek a fejlődésben és a kapcsolatod javításában.

### 1) Azonosított minták

**Önbizalomhiány:** Az a tény, hogy időnként úgy érzed, nem vagy elég jó a partnered számára, arra utal, hogy lehet, hogy alacsony önértékeléssel küzdesz. Ez a gondolat negatív spirált indíthat el, amely folyamatosan aláássa a kapcsolatotokat.

**Düh és féltékenység:** A partnered másokkal való interakciójára adott dühös reakcióid arra utalnak, hogy nehezen birkózol meg a féltékenységgel és az elutasítással. Ez a fajta reakció nemcsak a saját érzelmi állapotodat rontja, hanem a kapcsolat dinamikáját is.

**Kérdőjelezés:** Az, hogy időnként megkérdőjelezed a kapcsolatotokat konfliktus után, arra utal, hogy nem mindig bízol a kapcsolat stabilitásában. Ez a gondolatmód szintén hozzájárulhat a feszültség és az érzelmi távolság növekedéséhez.

### 2) Konkrét technikák

**"Megállj" technika:** 
- **Önreflexió:** Amikor úgy érzed, hogy nem vagy elég jó, állj meg egy pillanatra, és kérdezd meg magadtól: "Milyen bizonyítékaim vannak erre?" Esetleg írd le a pozitív tulajdonságaidat is, hogy emlékeztesd magadat az értékedre.
  
- **Féltékenység kezelése:** Ha dühöt érzel, amikor a partnered mással beszélget, próbáld meg tudatosítani ezt az érzést. Mondj magadnak "megállj", majd kérdezd meg: "Miért érzem ezt? Mi történt a múltban, ami ezt az érzést kiváltja?" Így elkerülheted a hirtelen reakciókat.

- **Kapcsolati kérdések:** Amikor megkérdőjelezed a kapcsolatotokat, tedd fel magadnak a kérdést: "Valóban a kapcsolatunk a probléma, vagy valami más okozza a feszültséget?" Ez segíthet abban, hogy ne a kapcsolatot hibáztasd a belső feszültségeidért.

### 3) Gyakorlati lépések

1. **Napi naplózás:** Írj naponta egy rövid bejegyzést arról, hogy hogyan érezted magad a kapcsolatban. Mitől érezted jól magad? Mik voltak a nehéz pillanatok? Ez segít tisztábban látni a mintákat.

2. **Önbizalom fejlesztése:** Figyelj oda a pozitív megerősítésekre. Minden reggel mondj magadnak három olyan dolgot, amiért büszke vagy magadra. Ezzel növelheted az önértékelésedet.

3. **Nyílt kommunikáció:** Beszélj a partnerednek az érzéseidről. Mondd el neki, hogy néha úgy érzed, nem vagy elég jó, és hogy a féltékenységed nem róla szól, hanem rólad. Az ő megértése segíthet a kapcsolat megerősítésében.

4. **Konfliktuskezelési technikák:** Amikor konfliktus merül fel, próbálj meg higgadtan kommunikálni. Használj "én" üzeneteket, például: "Én úgy érzem, hogy..." Ez segíthet abban, hogy ne támadóan fogalmazz, hanem kifejezd az érzéseidet.

5. **Terápiás támogatás:** Ha úgy érzed, hogy a problémák mélyebben gyökereznek, érdemes lehet pszichológushoz fordulni. Szakszerű támogatással könnyebben átléphetsz a nehézségeken.

Kriszti, bízom benne, hogy ez az elemzés és a javasolt technikák segítenek számodra a fejlődésben és a párkapcsolatod erősítésében. Légy türelmes magaddal, és ne feledd, hogy a változás időbe telik. Minden lépés, amit megteszel, közelebb visz a boldogabb és egészségesebb kapcsolathoz.', '2025-08-06 13:55:21.959683+00'),
	('d1f738f4-e7fb-4bcc-8df0-7e0b3d8386b2', 'cca42479-991f-47d9-afb5-e5c21377b1f1', 'Suti, a válaszaid alapján úgy tűnik, hogy magabiztosan éled meg a párkapcsolatodat, és nem vagy hajlamos az önszabotálásra. Az, hogy soha nem érzed magad elég jónak a partnered számára, és természetesnek tartod, hogy ő másokkal is beszélget, arra utal, hogy egészséges önértékeléssel rendelkezel. A konfliktusok utáni kérdőjelezés hiánya pedig azt mutatja, hogy stabil alapokon áll a kapcsolatotok. Továbbra is érdemes figyelni a kommunikációra és a kölcsönös támogatásra, hogy megőrizzétek ezt a pozitív dinamikát.', 'Kedves Suti,

Köszönöm, hogy megosztottad velem a kvíz válaszaidat. Ez egy fontos lépés a saját párkapcsolati dinamikáid megértéséhez. Az alábbiakban részletes elemzést készítek a válaszaid alapján, amely segíthet felismerni a párkapcsolati önszabotáló viselkedésed mintáit, és javaslatokat teszek arra, hogyan teheted egészségesebbé a kapcsolatodat.

### 1) Azonosított minták

A válaszaid alapján úgy tűnik, hogy a párkapcsolatodban nincsenek olyan kifejezett önszabotáló viselkedések, amelyek gyakran megjelennek. Az alábbi minták figyelhetők meg:

- **Önbecsülés:** Az, hogy soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, arra utal, hogy stabil önértékeléssel rendelkezel. Ez pozitív alapot ad a kapcsolatotok számára.

- **Bizalom:** A partnered mással való beszélgetésének természetesnek tartása azt jelzi, hogy bízol benne, és képes vagy elengedni a féltékenységet, ami szintén egészséges magatartás.

- **Konfliktuskezelés:** Az, hogy soha nem kérdőjelezed meg a kapcsolatotokat konfliktus után, arra utal, hogy képes vagy a problémák kezelésére anélkül, hogy kétségeket ébresztenél magadban vagy a kapcsolatban.

Bár a válaszaid pozitív képet festenek, érdemes észben tartani, hogy a párkapcsolatok dinamikusak, és időnként előfordulhat, hogy mélyebb, rejtett minták is megjelennek. Ezen minták tudatosítása segíthet elkerülni a jövőbeli önszabotálást.

### 2) Konkrét technikák

A következő technikák segíthetnek abban, hogy elkerüld a lehetséges önszabotáló viselkedéseket, amelyek idővel megjelenhetnek, vagy akár már most is jelen lehetnek, de nem tudatosultak:

- **Önreflexió:** Rendszeresen szánj időt arra, hogy átgondold a párkapcsolati dinamikákat. Kérdezd meg magadtól: "Miért érzem ezt így?", vagy "Mik a valódi érzéseim a kapcsolatunkkal kapcsolatban?"

- **Kommunikáció:** Beszélj a partnered érzéseiről, aggodalmairól, és arról, hogy mit szeretnél a jövőben. Az őszinte kommunikáció segít elkerülni a félreértéseket.

- **Határok felállítása:** Fontos, hogy tudd, mikor van szükséged egy kis térre, és mikor kell a másiknak támogatást nyújtanod. Ezen határok tiszteletben tartása segít a kapcsolatotok egyensúlyának megőrzésében.

### 3) Gyakorlati lépések

A javasolt lépések segíthetnek a párkapcsolati önszabotáló viselkedés elkerülésében és a kapcsolat erősítésében:

1. **Napi naplózás:** Írj naponta néhány sort a kapcsolatodról és a saját érzéseidről. Ez segít tudatosítani a gondolataidat és érzelmeidet.

2. **Heti beszélgetések:** Állíts be egy időpontot a partnered számára, amikor csak a kapcsolatotokról beszélgettek. Ez lehetővé teszi, hogy nyíltan megosszátok egymással a gondolataitokat és érzéseiteket.

3. **Önértékelés:** Készíts egy listát azokról a dolgokról, amiket szeretsz magadban, és amiket a partnered is értékel. Ez segíthet a pozitív önértékelés fenntartásában.

4. **Párterápia:** Ha úgy érzed, hogy a kapcsolatban mélyebb problémák merülnek fel, érdemes szakember segítségét kérni. A párterápia lehetőséget ad a mélyebb közös munka elvégzésére.

Suti, a párkapcsolatok folyamatos tanulási folyamatok, és a tudatosság növelése segíthet abban, hogy elkerüld a potenciális önszabotáló viselkedéseket. Ne feledd, hogy a fejlődés időbe telik, és a legfontosabb lépés az, hogy hajlandó vagy dolgozni a kapcsolatodon. Kívánom, hogy a jövőben is sikeresen erősítsd a párkapcsolatodat!', '2025-08-06 14:08:40.158087+00'),
	('b83394cc-736a-4b91-804e-fa9da9cf5e0f', 'a1fe50e4-4692-45d7-9586-fdb0d97740ee', 'Suti, az általad adott válaszok azt mutatják, hogy egészséges önértékeléssel és magabiztossággal rendelkezel a párkapcsolatodban. Az, hogy soha nem érzed magad elég jónak a partnered számára, és természetesnek tartod, hogy ő másokkal is kommunikál, arra utal, hogy bízol magadban és a kapcsolatban. Ezen túlmenően, a konfliktusok utáni megkérdőjelezés hiánya azt jelzi, hogy képes vagy a stabilitásra és a harmóniára fókuszálni. Folytasd így, és ne habozz kommunikálni a gondolataidról és érzéseidről a kapcsolatodban!', 'Kedves Suti!

Köszönöm, hogy megosztottad velem a kvíz válaszaidat, és hogy itt vagy, hogy jobban megértsd a párkapcsolati önszabotáló viselkedésedet. Az önreflexió és a fejlődés iránti hajlandóság már önmagában is egy fontos lépés. Az alábbiakban részletesen kifejtem az általad bemutatott mintákat, ajánlok konkrét technikákat és gyakorlati lépéseket, amelyek segíthetnek a kapcsolatod megerősítésében és a negatív viselkedési minták elkerülésében.

### 1) Azonosított minták

A kvíz válaszaid alapján a következő mintákat tudtam azonosítani:

- **Önbizalom és önértékelés**: Az, hogy soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, pozitív önértékelésre utal, ami egy erősséged. Ez segíthet abban, hogy bizalommal lépj be a kapcsolatba, és egyenlő partnerként viselkedj.

- **Egészséges távolságtartás**: Az, hogy természetesnek tartod, ha a partnered mással beszélget, arra utal, hogy tiszteletben tartod a másik személy szabadságát, ami szintén pozitív aspektus.

- **Konfliktuskezelés**: Az, hogy soha nem kérdőjelezed meg a kapcsolatotokat konfliktus után, lehet jele annak, hogy nem szeretnél feszültséget kelteni vagy elkerülöd a nehéz beszélgetéseket. Ez viszont hosszú távon problémákhoz vezethet, mivel a konfliktusok elkerülése nem segít a fejlődésben és a kapcsolat mélyítésében.

### 2) Konkrét technikák

A következő technikák segíthetnek abban, hogy tudatosabban kezeld a párkapcsolati dinamikákat:

- **Megállj technika**: Amikor észleled, hogy egy nehéz érzés vagy gondolat kezd kialakulni (például a konfliktusok utáni kérdőjelezés), állj meg egy pillanatra. Kérdezd meg magadtól: "Miért érzem ezt? Valóban igaz ez, vagy csak a félelmeim beszélnek?" Ez a tudatosság segíthet elkerülni a túlzott önkritikát és a felesleges aggodalmakat.

- **Szavak és kifejezések tudatosítása**: Figyelj arra, hogyan beszélsz a kapcsolatodról és a partneredről. Használj pozitív megerősítéseket, amelyek erősítik az önbizalmadat és a kapcsolatotokat.

- **Felelősségvállalás**: Tedd fel a kérdést magadnak: "Mik azok a dolgok, amiket én is tehetek a kapcsolatunk érdekében?" Ez a felelősségvállalás segíthet abban, hogy aktívan részt vegyél a kapcsolatod fejlődésében.

### 3) Gyakorlati lépések

Itt van néhány gyakorlati lépés, amelyet elkezdhetsz követni:

1. **Napi reflektálás**: Minden nap szánj pár percet arra, hogy átgondold, hogyan érezted magad a kapcsolatban. Írd le a pozitív és negatív érzéseidet. Ez segít tisztábban látni a helyzetet.

2. **Beszélgessetek a konfliktusokról**: Amikor konfliktus merül fel, próbálj meg nyitottan és őszintén beszélni a gondolataidról és érzéseidről. Ne félj kifejezni, ami bánt, hiszen a kommunikáció kulcsfontosságú a kapcsolatokban.

3. **Kérj visszajelzést**: Kérdezd meg a partneredet, hogyan érzi magát a kapcsolatban. A kölcsönös visszajelzés segíthet a mélyebb megértésben és a kapcsolat erősítésében.

4. **Önfejlesztés**: Vegyél részt önfejlesztő programokon, olvass könyveket a párkapcsolati kommunikációról, vagy keress fel egy szakembert, aki segíthet a párkapcsolati dinamikák mélyebb megértésében.

Ezek a lépések és technikák nem csupán a párkapcsolatod minőségét javíthatják, hanem a személyes fejlődésedet is támogatják. Ne feledd, hogy a változás időbe telik, és az önismeret egy folyamatos folyamat. Légy türelmes önmagaddal, és adj időt magadnak a fejlődésre. Te képes vagy arra, hogy egy egészséges és boldog kapcsolatot építs!', '2025-08-06 14:36:23.600774+00'),
	('4d5fe51b-efea-4ff3-af78-c34d6048d550', '5b0f9ac1-a295-410f-9268-26f7e8e664b0', 'Szia hjk! 😊 Látom, hogy két kérdésre adtál válaszokat. Először is, szeretném kiemelni: nem adok megoldásokat vagy gyakorlati technikákat, csak az önszabotáló minták felismerésére és megértésére koncentrálok. Most összefoglaló elemzést adok a válaszokról, kiemelve, hogyan tükröződnek ezek a dinamikák a kötődés, a kommunikáció és a konfliktuskezelés keretében.

Összegző elemzés a válaszokról
- Gyakran érzed úgy, hogy nem vagy elég jó a partnered számára
  - Önszabotáló minták: A személyes értékelés folyamatos önkritikája, állandó bizonytalanságérzet, és a megfelelési kényszer. A belső kelletlenség, hogy “nem vagyok elég jó” gyakran gátolja a spontaneitást és a bizalomépítést a kapcsolatban. Ez a minta tipikusan az önértékelés és a bizalom összefonódására utal.
  - Kötődési jelzések: Lehet szorongó vagy mérsékelt ambivalens kötődést is jelezni: a megfelelésért folyamatos ellenőrzés és a visszajelzések nagy jelentősége áll előtérben. A félelem attól, hogy elhagynak vagy nem értékelik, meghatározhatja a viselkedésedet.
  - Kommunikációs stratégia: Alávetettség vagy közvetlen önbizalomhiány: gyakran kisebb hangnemben vagy bizonytalan tónussal kommunikálsz; a visszajelzéseket szinte személyes támadásként értelmezed.
  - Konfliktuskezelés: Konfliktusoknál könnyen elbizonytalanodsz, és a reakcióidő nőhet, mivel a saját értékelésedet a partner reakciója határozza meg.

- Reagálsz, amikor a partnered mással beszélget
  - Önszabotáló minták: A “nagyon zavarja” reakció intenzív érzelmi válasz, amely gyors általánosításokhoz vezethet (például hirtelen féltékenység vagy fenyegetettség érzet). Ez a mintázat a kontroll igény és az önálló értékelés közötti feszültséget tükrözi.
  - Kötődési jelzések: Ez gyakran hátterében strong szorongó kötődést vagy bizonytalan kötődésű mintát jelezhet: a kapcsolati jelenlét féltékenységet, kielégíthetetlen szükségletet ébreszt.
  - Kommunikációs stratégia: Reakcióid gyakran lehetnek védőek vagy túlzottan érzelmiek; a határok tisztázása hiányozhat, vagy a kommunikáció személyes sérülésként jelenik meg.
  - Konfliktuskezelés: A konfliktuskerülés vagy az azonnali, intenzív reakciók jellemzőek lehetnek; a probléma mélyebb feltárása helyett a külső ingerre reagálsz, nem pedig a tartalomra fókuszálsz.

Összegzés
- A két válasz együtt azt sugallja, hogy belső bizonytalanság, félelem a nem elég jó vagy nem értékeltség érzetétől formálhat megközelítést a partner és a beszélgetések kapcsán. A kötődési mintázat valószínűleg szorongó vagy bizonytalan kezdeteket mutat, ahol a kommunikáció érzelmileg intenzív, és a konfliktusoknál könnyen személyes érintettségbe kerül a téma. Ezáltal előtérbe kerül a kontroll vagy a védekező álláspont, ahelyett, hogy a tartalmi megoldásra összpontosítanátok.

Ha szeretnéd, beszélhetünk arról, hogyan érzékelheted ezeknek a mintáknak a hatását a saját érzelmi állapotodra és kapcsolati dinamikádra, anélkül, hogy konkrét technikákat vagy gyakorlatokat javasolnék. A nevemmel szólnak hozzám, és itt vagyok, hogy együtt értsük meg jobban ezeket a mintákat.

Ha szeretnéd, adj még néhány kérdést vagy részletet, hogy mélyebben elemezzem a dinamikát.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-13 17:23:30.569979+00'),
	('92f84d14-6d41-4314-b3f6-1dec0468b17c', '8a0051a8-81a7-4516-8c66-23c261166f93', 'Suti, az általad megadott válaszok azt mutatják, hogy stabil és egészséges önértékeléssel rendelkezel a párkapcsolatodban. Az, hogy soha nem érzed magad elég jónak a partnered számára, és természetesnek tartod, ha ő másokkal is beszélget, pozitív jelek arra nézve, hogy bízol önmagadban és a kapcsolat dinamikájában. A konfliktusokat követő kérdőjelezés hiánya arra utal, hogy képes vagy a helyzeteket konstruktívan kezelni, ami szintén erős alapot ad a párkapcsolatodnak. Folytasd ezt a nyitott és bizalommal teli hozzáállást, hiszen ez segít elkerülni az önszabotáló viselkedéseket.', '### 1) Azonosított minták

Suti, a kvíz válaszaid alapján úgy tűnik, hogy egy egészséges önértékeléssel rendelkezel, és stabil alapokra építed a párkapcsolatodat. Az, hogy soha nem érzed, hogy nem vagy elég jó a partnered számára, valamint hogy természetesnek tartod, ha a partnered másokkal beszélget, arra utal, hogy bízol saját értékeidben és a kapcsolatotok dinamikájában. Továbbá, hogy soha nem kérdőjelezed meg a kapcsolatotokat konfliktus után, azt mutatja, hogy képes vagy a konfliktusokat kezelni, és nem engeded meg, hogy azok a kapcsolat többi aspektusára negatívan hassanak.

Azonban az is fontos, hogy tudatosítsd: a konfliktus utáni megkérdőjelezés hiánya, illetve a partnerrel való interakciók természetesnek tartása, néha önszabotáló viselkedéshez vezethet. Ha nem foglalkozol a saját érzéseiddel és igényeiddel, az idővel feszültségeket okozhat a kapcsolatban. Fontos, hogy a kapcsolatban mindkét fél érzései és szükségletei fontosak legyenek, és ha ezek háttérbe szorulnak, akkor az hosszú távon problémákhoz vezethet.

### 2) Konkrét technikák

Az alábbi "megállj" technikák segíthetnek abban, hogy tudatosan kezelj néhány esetlegesen önszabotáló mintát:

1. **Érzelemérzékelés**: Minden alkalommal, amikor feszültséget vagy szorongást érzel a kapcsolatban, állj meg egy pillanatra. Kérdezd meg magadtól, miért érzed így magad? Milyen konkrét gondolatok merülnek fel benned?

2. **Reflektálás**: Írj naplót a kapcsolati tapasztalataidról. Amikor konfliktusok merülnek fel, ne csak a partnered reakcióira figyelj, hanem a saját érzéseidre is. Milyen érzések, gondolatok merülnek fel benned? Ezzel segítheted a saját érzelmi feldolgozásodat.

3. **Kérdésfeltevés**: Amikor a partnered másokkal beszélget, kérdezd meg magadtól, hogy miért érzel feszültséget. Az a képesség, hogy másokkal beszélget, nem csökkenti a te értékedet vagy a kapcsolatotok minőségét.

### 3) Gyakorlati lépések

1. **Napi önreflexió**: Minden este szánj időt arra, hogy átgondold a nap eseményeit. Írd le, mi történt, és hogyan érezted magad. Ez segíthet abban, hogy tudatosabb legyél a saját érzéseiddel és reakcióiddal kapcsolatban.

2. **Kapcsolati check-in**: Hetente egyszer ülj le a partnereddel, és beszéljétek meg, hogyan érzitek magatokat a kapcsolatban. Kérdezd meg, hogy ő hogyan éli meg a kapcsolatot, és oszd meg a saját érzéseidet is. Ez a nyitott kommunikáció erősítheti a köztetek lévő bizalmat.

3. **Támogató közeg**: Keresd meg a barátaidat vagy családtagjaidat, akikkel megoszthatod a kapcsolati tapasztalataidat. Néha hasznos lehet külső perspektívát kapni, és a támogató közeg segíthet az önértékelésed erősítésében.

4. **Önértékelés fejlesztése**: Tartsd szem előtt, hogy a kapcsolatban való magabiztosság kulcsfontosságú. Dolgozz az önbizalmadon különböző módszerekkel, például pozitív megerősítések alkalmazásával vagy új készségek elsajátításával, amelyek növelhetik az önértékelésedet.

Suti, fontos, hogy a saját érzéseid és igényeid érvényesüljenek a kapcsolatban. Az önreflexió és a nyitott kommunikáció segíthet abban, hogy elkerüld az önszabotáló mintákat, és erősebb és egészségesebb kapcsolatot építs. Az utad során légy türelmes magaddal, és ne felejtsd el, hogy minden kapcsolat dinamikus, és folyamatosan fejlődik. Te képes vagy arra, hogy egy boldog, támogató és szeretetteljes kapcsolatot alakíts ki!', '2025-08-06 14:38:00.122405+00'),
	('6c51573e-0e19-4a52-ad95-699b83b7e81a', '5c3645a1-39f0-45e3-9d7c-c05168363013', 'Stui, a válaszaid alapján úgy tűnik, hogy stabil önértékeléssel rendelkezel, ami kedvező a párkapcsolatokban. Az, hogy soha nem érzed magad elég jónak a partnered számára, illetve természetesnek tartod, ha ő másokkal beszélget, azt mutatja, hogy bízol a kapcsolatodban és a partneredben. Az is pozitív jel, hogy a konfliktusok után nem kérdőjelezed meg a kapcsolatotokat; ez a bizalom és az elköteleződés jele. Ám érdemes figyelni arra, hogy a harmónia fenntartása érdekében időnként érdemes lehet a saját érzéseidet és szükségleteidet is kifejezni.', '### 1) Azonosított minták

Stui válaszai alapján úgy tűnik, hogy a párkapcsolati önszabotálás nem jellemző rá. A "Soha" válasz a "nem vagyok elég jó" kérdésre arra utal, hogy Stui valószínűleg magabiztos a saját értékében és abban, hogy mit tud nyújtani a partnerének. A kérdés arra utal, hogy nem szenved az önértékelési problémáktól, ami pozitív jel. Az is kedvező, hogy a partnerével való interakciókat természetesnek tartja, ami azt mutatja, hogy bízik a kapcsolatában és a partnerével való kommunikációban. Végül a konfliktus utáni kérdések megkérdőjelezésének hiánya szintén azt jelzi, hogy Stui stabilan kezeli a kapcsolatát, és nem hajlamos a felesleges aggodalomra.

Ezek a válaszok arra utalnak, hogy Stui valószínűleg egészséges érzelmi keretek között mozog a párkapcsolatában, és nem mutatja a klasszikus önszabotáló viselkedés jeleit, mint például a folyamatos önértékelés, a partner iránti féltékenység, vagy a konfliktusok utáni krízishelyzetek.

### 2) Konkrét technikák

Bár Stui nem mutatja a tipikus önszabotáló mintákat, hasznos lehet néhány "megállj" technikát alkalmazni a stabilitás fenntartása érdekében:

- **Önértékelési gyakorlatok**: Készítsen egy listát azokról a dolgokról, amelyeket önértékesnek tart. Ez segíthet megerősíteni az önbizalmát, és tudatosítani, hogy mit hoz a kapcsolatba.
  
- **Mindfulness és jelenlét**: Gyakorolja a mindfulness technikákat, hogy jobban jelen legyen a pillanatban. Ez segíthet elkerülni a felesleges aggodalmakat és félelmeket, amelyek nem alapozottak.

- **Pozitív megerősítések**: Használjon napi pozitív megerősítéseket, mint például "Megérdemlem a szeretetet és a boldogságot", hogy erősítse a belső értékét.

### 3) Gyakorlati lépések

1. **Önértékelési napló vezetése**: Írjon le naponta legalább három pozitív dolgot magáról és a kapcsolatáról. Ez segít tudatosítani az erősségeit és a kapcsolat pozitív aspektusait.

2. **Rendszeres kommunikáció a partnerrel**: Tartsanak heti "kávézó estét", ahol megoszthatják egymással érzéseiket, aggodalmaikat és örömeiket. Ez erősíti a kapcsolatukat és megakadályozza a felesleges félreértéseket.

3. **Mindfulness gyakorlatok bevezetése**: Naponta szánjon legalább 10 percet mindfulness gyakorlatokra, például légzőgyakorlatokra vagy meditációra. Ez segíthet a stressz csökkentésében és a jelen pillanatban való tudatosság növelésében.

4. **Önértékelő szokások kialakítása**: Állítson be havi célokat a kapcsolatban, és értékelje ki, hogy mit tudott elérni. Ez segít abban, hogy folyamatosan fejlődjön és reflektáljon a saját érzéseire.

Ezek a lépések és technikák segíthetnek Stuinak abban, hogy még inkább megerősítse a pozitív kapcsolati dinamikákat, és elkerülje a jövőbeli önszabotáló viselkedést. Fontos, hogy mindig figyeljünk a saját érzéseinkre, és tudatosan törekedjünk a fejlődésre, hiszen a párkapcsolatokban a bizalom és az önértékelés kulcsszerepet játszik.', '2025-08-06 15:30:28.418755+00'),
	('46cb1f96-e14e-49f8-91cf-c3fe2da33626', '19870241-1a49-4e93-bd47-510f60bfafc0', 'Bél, az általad adott válaszok alapján úgy tűnik, hogy magabiztos vagy a párkapcsolati dinamikában, és nem hordozol magadban erős önértékelési problémákat. Az, hogy soha nem érzed magad elég jónak a partnered számára, és természetesnek tartod, hogy a partnered mással is beszélgessen, azt jelzi, hogy bízol a kapcsolatban. Azonban fontos figyelni arra, hogy a konfliktusok után is fenntartsd ezt a stabilitást, hiszen a problémák kezelése kulcsfontosságú a tartós kapcsolatokban. Érdemes lehet néha elgondolkodnod azon, hogy miért nem kérdőjelezed meg a kapcsolatotokat, mert a nyílt kommunikáció és az érzések kifejezése segíthet megerősíteni a köteléketeket.', '### 1) Azonosított minták

Bél válaszai alapján úgy tűnik, hogy a párkapcsolati önszabotáló viselkedés nem jellemző rá. Az, hogy soha nem érzi magát elég jónak a partnerének, és természetesnek tartja, hogy a párja mással is beszélget, valamint hogy soha nem kérdőjelezi meg a kapcsolatukat konfliktus után, arra utal, hogy Bél stabil önértékeléssel és bizalommal rendelkezik a kapcsolata iránt. Ezek a minták pozitívak, azonban fontos megvizsgálni, hogy van-e olyan terület, ahol Bél esetleg nem teljesít a legjobban, vagy ahol a jövőbeli kapcsolatokban önszabotáló viselkedés megjelenhet.

Bél viselkedései alapján valószínű, hogy nem hajlamos a konfliktuskerülésre vagy a kapcsolat folyamatos megkérdőjelezésére, ami általában egészséges alapot ad egy párkapcsolathoz. Azonban érdemes megfontolni, hogy az önértékelés és a párkapcsolati dinamikák sokszor rejtett mintákat és korábbi tapasztalatokat is magukban foglalnak, amelyeket érdemes felfedezni.

### 2) Konkrét technikák

**Megállj technikák:**
- **Önreflexió:** Kérd meg magadtól, hogy milyen érzelmeket váltanak ki belőled a párkapcsolati helyzetek. Írj naplót a benned felmerülő érzésekről, hogy jobban megérthesd a saját reakcióidat.
- **Pozitív megerősítés:** Minden nap mondj el magadnak három pozitív dolgot, amit a kapcsolatodban értékelsz. Ez segíthet fenntartani a pozitív szemléletet.
- **Határok felállítása:** Ha bármilyen helyzet kényelmetlenül érint, állíts fel világos határokat a kapcsolatban. Ez növelheti az önbizalmadat és a biztonságérzetedet.

### 3) Gyakorlati lépések

1. **Önértékelés:** Szánj időt arra, hogy felfedezd, mit jelent számodra a párkapcsolat. Milyen értékeket és elvárásokat támasztasz magaddal és a partnereddel szemben? 
   
2. **Kommunikáció:** Beszélj a partnereddel a kapcsolatotokról, a közös élményeitekről és arról, hogy mit szeretnél elérni. A nyílt párbeszéd segíthet megerősíteni a köteléketek.

3. **Képességek fejlesztése:** Ha úgy érzed, hogy a jövőbeli kapcsolataidban önszabotáló viselkedés megjelenhet, érdemes különböző önfejlesztő könyveket vagy tanfolyamokat keresned a kommunikációról és az érzelmi intelligenciáról.

4. **Támogató közeg:** Keresd meg a barátaidat vagy családtagjaidat, akikkel megoszthatod a gondolataidat. Egy támogató közeg segíthet megerősíteni az önbizalmadat és csökkenteni a feszültséget.

5. **Reflektálj a konfliktusokra:** Ha konfliktus merül fel, próbáld meg nem azonnal reagálni. Adj magadnak időt átgondolni a helyzetet, és kérdezd meg magadtól, miért érezted úgy, ahogy érezted. 

Bél, a legfontosabb az, hogy minden kapcsolat más és más, és ami működik egy kapcsolatra, az nem biztos, hogy működik egy másikra. Légy bátor az önfelfedezésben, és ne félj megkérdőjelezni saját reakcióidat és érzéseidet. A fejlődéshez vezető út tele van kihívásokkal, de ezek a kihívások segítenek abban, hogy jobban megértsd magadat és a kapcsolataidat.', '2025-08-06 15:35:49.585032+00'),
	('8556dd83-f880-4467-825c-aae90bf94de3', 'a89ba6af-50d0-40bf-8176-363db935089a', 'Suti, a válaszaid alapján úgy tűnik, hogy stabil önértékeléssel rendelkezel, és képes vagy egészséges módon kezelni a kapcsolatodban felmerülő helyzeteket. Azt, hogy soha nem érzed magad elég jónak a partnered számára, és a konfliktusokat is magabiztosan kezeled, arra utal, hogy erős alapokon áll a kapcsolatotok. Fontos azonban figyelni arra, hogy a természetes reakcióid, mint például a partnered másokkal való beszélgetése iránti nyitottság, ne csökkentsék a kommunikációt és az intimitást, mivel ezek kulcsszerepet játszanak a hosszú távú kapcsolatokban. Érdemes lehet időnként önmagad érzéseit és a kapcsolat dinamikáját is átgondolni, hogy még inkább erősíthesd a köztetek lévő köteléket.', 'Kedves Suti,

Örömmel látom, hogy megosztottad a kvíz válaszaidat, és szeretném, ha tudnád, hogy a párkapcsolati önszabotáló viselkedés megértése és kezelése rendkívül fontos lépés a személyes fejlődésed és a kapcsolati dinamika javítása szempontjából. Az alábbiakban részletesen elemezni fogom a válaszaid alapján azonosított mintákat, konkrét technikákat és gyakorlati lépéseket osztok meg, hogy támogassalak a fejlődésedben.

### 1) Azonosított minták

A kvíz válaszaid alapján azt látom, hogy nem tapasztalsz magadban önértékelési problémákat, és ez nagyon pozitív. Azt mondod, hogy soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, és természetesnek tartod, ha a partnered mással beszélget. Mindez arra utal, hogy magabiztos vagy a kapcsolatodban, és nyitott kommunikációval rendelkezel.

A konfliktusok utáni kérdőjelezés hiánya is azt jelzi, hogy stabilnak érzed a kapcsolatodat, és nem húzol le magadban felesleges kérdéseket, ami szintén kedvező. Ugyanakkor fontos megfigyelni, hogy a túlzott magabiztosság vagy a konfliktusok elkerülése néha önszabotáló viselkedéshez vezethet, ha a problémákat nem kezeljük megfelelően.

### 2) Konkrét technikák

Annak érdekében, hogy még inkább erősíteni tudd a kapcsolatodat, érdemes bevezetned néhány "megállj" technikát, amelyek segítenek a potenciális önszabotáló viselkedések megelőzésében:

- **Önreflexió**: Minden héten szánj időt arra, hogy átgondold a kapcsolatotokat. Kérdezd meg magadtól, hogy mi az, amit jól csináltok, és mi az, ami esetleg nem működik. Írd le a gondolataidat, hogy tisztábban lásd a helyzetet.

- **Kommunikációs gyakorlatok**: Beszélj a partnered érzéseiről és igényeiről nyíltan, és bátorítsd őt arra, hogy osztozzon a gondolataiban. Ez segít abban, hogy mindketten jobban megértsétek egymást, és elkerüljetek olyan helyzeteket, amikor esetleg nem mondjátok el egymásnak, ami bánt.

### 3) Gyakorlati lépések

1. **Heti önértékelő napló**: Minden hét végén írj egy rövid összefoglalót arról, hogy mi ment jól a kapcsolatotokban, és voltak-e olyan helyzetek, amikor feszültséget éreztél. Ez segít abban, hogy tudatosítsd az érzéseidet és gondolataidat.

2. **Nyílt beszélgetések**: Tervezz be egy rendszeres időpontot, amikor csak a kapcsolatotokról beszélgettek. Ezzel lehetőséget teremtetek arra, hogy mindketten kifejezzétek az érzéseiteket és aggályaitokat, ami megerősíti a köztetek lévő kapcsolatot.

3. **Konfliktuskezelés gyakorlása**: Mivel nem kérdőjelezed meg a kapcsolatotokat konfliktus után, fontos, hogy megtanulj kezelni és megoldani a konfliktusokat. Gyakorold a "tükörtechnikát", ami azt jelenti, hogy a partnered szavainak visszatükrözésével próbálod megérteni az érzéseit.

Suti, a lényeg az, hogy a kapcsolatod erős alapokra épül, és a fent említett technikák és lépések segíthetnek abban, hogy még inkább megerősítsd a köteléketeket. Ne feledd, hogy minden kapcsolat fejlődik, és a nyitott kommunikáció és a tudatos önreflexió kulcsfontosságú a harmonikus és boldog párkapcsolathoz. Bátorítalak, hogy tedd meg az első lépést, és élvezd a folyamatot!

Üdvözlettel,
[Neved]', '2025-08-06 18:26:00.014224+00'),
	('07a4d64b-4a20-405d-82e1-122029882d3d', '1882a205-3d05-4d5e-bca9-3d975f31a9e4', 'Sui, a válaszaid alapján úgy tűnik, hogy stabil és magabiztos vagy a párkapcsolatodban. Az, hogy soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, és hogy természetesnek tartod, amikor ő másokkal beszélget, arra utal, hogy bízol magadban és a kapcsolatodban. Ezek a pozitív érzések segíthetnek abban, hogy elkerüld az önszabotáló viselkedéseket, és egészséges, támogató dinamikát alakíts ki a kapcsolatodban. Fontos azonban, hogy folyamatosan figyelj a kommunikációra és a kölcsönös érzésekre, hogy a jövőben is megőrizhesd ezt az egészséges hozzáállást.', 'Kedves Sui!

Örömmel látom, hogy a kvíz válaszaid alapján stabil és egészséges párkapcsolatban élsz. Az alábbiakban részletes elemzést adok a párkapcsolati önszabotáló viselkedésről, figyelembe véve a válaszaidat.

### 1) Azonosított minták
A válaszaid alapján nem mutatsz olyan klasszikus önszabotáló mintákat, mint a folyamatos önértékelési problémák vagy a félelem a partner elvesztésétől. Ezek a válaszok arra utalnak, hogy magabiztos vagy a kapcsolatodban, és képes vagy egészségesen kezelni a konfliktusokat. Az önszabotáló viselkedés általában akkor jelentkezik, amikor a személy nem bízik a kapcsolat stabilitásában, vagy amikor a saját érzelmi szükségleteit nem tudja kifejezni.

### 2) Konkrét technikák
Bár jelenleg nem tűnsz önszabotáló viselkedésnek, érdemes előre felkészülni arra, hogy a jövőben esetlegesen felmerülhetnek ilyen helyzetek. Alábbi technikák segíthetnek, ha a jövőben bármilyen szorongás vagy kétség merülne fel:

- **Önreflexió**: Készíts naplót arról, hogyan érzed magad a kapcsolatban, és hogyan reagálsz különböző helyzetekre. Ez segít észlelni a mintákat.
- **Pozitív megerősítések**: Használj napi megerősítéseket, amelyek emlékeztetnek arra, hogy értékes vagy a kapcsolatodban.
- **Kommunikáció**: Mindig nyíltan beszélj a partnered érzéseiről és félelmeiről. Ez segít elkerülni a félreértéseket és a feszültséget.

### 3) Gyakorlati lépések
Az alábbi lépések segíthetnek abban, hogy tudatosan erősítsd a kapcsolatodat és elkerüld az önszabotálást:

1. **Folyamatos párbeszéd**: Rendszeresen beszélgessetek a kapcsolatotokról, akár heti rendszerességgel is. Ez lehetőséget ad a felmerülő problémák azonnali kezelésére.
   
2. **Közös élmények**: Tölts időt együtt, tapasztaljatok meg új dolgokat. Ez erősíti a köteléket és növeli az intimitást.

3. **Önértékelés**: Rendszeresen nézz szembe a saját érzéseiddel, és értékeld a saját hozzájárulásodat a kapcsolathoz. Tudd, hogy a te érzéseid és szükségleteid is fontosak.

4. **Képzés és fejlődés**: Ha úgy érzed, hogy a kapcsolatban bármilyen szorongás merülhet fel, keress fel szakirodalmat vagy vegyél részt párkapcsolati workshopokon, ahol új technikákat tanulhatsz.

Bízom benne, hogy ezek a lépések segítenek abban, hogy még erősebb és egészségesebb kapcsolatot építsetek. Mindig fontos, hogy figyelj a saját érzéseidre, és bátran kérj támogatást, ha szükséged van rá. Sok sikert kívánok a kapcsolatodhoz!', '2025-08-07 06:22:26.673117+00'),
	('e5ff551d-a39d-43c5-a623-c3d49b2d015e', '56f9265a-0874-4bac-9e77-4fbe7b961539', 'Kedves Suti! Az általad megadott válaszok azt mutatják, hogy erős önértékeléssel rendelkezel, és magabiztosan kezeled a kapcsolatodat. Az, hogy soha nem érzed magad elég jónak a partnered számára, és természetesnek tartod, hogy ő másokkal is beszélget, azt jelzi, hogy bízol a kapcsolatotokban és a saját értékedben. A konfliktusok utáni kételyek hiánya szintén pozitív jel; ez azt mutatja, hogy stabil alapokon áll a kapcsolatotok. Ügyelj arra, hogy ezeket a pozitív érzéseket megőrizd, és ne engedd, hogy a múltbeli tapasztalatok vagy külső hatások megkérdőjelezzék a magabiztosságodat.', '### 1) Azonosított minták

Az eddig megismert válaszaid alapján úgy tűnik, hogy nem mutatsz klasszikus önszabotáló viselkedést a párkapcsolatodban. Az, hogy soha nem érzed magad elég jónak a partnered számára, és a konfliktusok után sem kérdőjelezed meg a kapcsolatotokat, arra utal, hogy stabil önértékeléssel rendelkezel, és magabiztosan állsz a kapcsolatodhoz. Emellett az is dicséretes, hogy természetesnek tartod a partnered másokkal való interakcióját, ami a bizalom és a nyitottság jele.

Mindezek a pozitív minták azt mutatják, hogy a kapcsolatodban nem vagy hajlamos a féltékenységre, vagy az önértékelési problémákra. Ugyanakkor érdemes lehet felfedezni, hogy van-e más területe a párkapcsolati dinamikának, ahol esetleg önszabotáló tendenciák jelentkezhetnek, például elkerülő viselkedés, vagy a kapcsolat mélyebb szintű elköteleződésének megfélemlítése.

### 2) Konkrét technikák

- **Önreflexió:** Szánj időt arra, hogy átgondold, milyen érzéseid és gondolataid vannak a kapcsolatról. Kérdezd meg magadtól, miért érzed jól magad, és miért bízol a partneredben. Ez segíthet megerősíteni a pozitív érzéseidet.
  
- **Kommunikációs gyakorlatok:** Próbálj meg nyíltan beszélni a partnered érzéseiről és gondolatairól. Ez nemcsak a kapcsolatotokat erősíti, hanem segít kifejezni a saját érzéseidet is.

- **Megállj technika:** Amikor negatív gondolatok támadnak (pl. „Miért nem beszél velem többet?”), állj meg egy pillanatra, és tedd fel magadnak a kérdést: „Ez a gondolat mennyire reális?” Pár percre zárd ki a gondolataidat, majd térj vissza a valósághoz.

### 3) Gyakorlati lépések

1. **Napi napló:** Kezdj el egy naplót vezetni, amiben rögzíted a párkapcsolatoddal kapcsolatos pozitív élményeidet és érzéseidet. Ez segíthet tudatosítani a kapcsolat erősségeit.

2. **Heti „beszélgető esték”:** Tervezz be heti rendszerességgel, amikor a partneredel csak egymásra figyeltek. Beszéljétek át, mi működik jól, és mi az, amiben még fejlődhetnétek. 

3. **Önértékelés fejlesztése:** Fedezd fel a saját erősségeidet, és gondolj arra, hogy milyen értékeket hozol a kapcsolatba. Készíts egy listát azokról a dolgokról, amiket értékesnek tartasz magadban.

4. **Külső támogatás:** Ha úgy érzed, hogy mélyebb önszabotáló minták is lehetnek a háttérben, fontold meg, hogy szakember segítségét kéred. 

Ezekkel a lépésekkel nemcsak a kapcsolatodat erősítheted, hanem a saját önértékelésedet is fokozhatod. Ne feledd, hogy a fejlődés folyamata időt igényel, és ez teljesen rendben van. Hidd el, hogy képes vagy a szeretetteljes és támogató kapcsolatra!', '2025-08-07 06:27:52.3357+00'),
	('25ca048f-55d1-4f55-9711-8b987b5ebd77', 'e6e7d60e-a407-4cc8-8c75-3730c8a867fb', 'Suti, a válaszaid alapján úgy tűnik, hogy magabiztos vagy a kapcsolatodban, és nem szenvedsz az önértékelési problémáktól, ami nagyon pozitív jel. Az, hogy természetesnek tartod a partnered másokkal való kommunikációját, és a konfliktusok után is stabilan állsz a kapcsolat mellett, arra utal, hogy egészséges alapokon áll a viszonyotok. Fontos azonban, hogy figyelj a kommunikációra és a kölcsönös támogatásra, hiszen ezek segíthetnek elkerülni a jövőbeli önszabotáló gondolatokat vagy érzéseket.', 'Kedves Suti!

Örömmel látom, hogy nyitott vagy a párkapcsolati önszabotáló viselkedésed megértésére és javítására. Az alábbi elemzés segíthet abban, hogy jobban megértsd a saját mintáidat, és cselekvésre ösztönözzön a fejlődés útján.

### 1) Azonosított minták

A kvíz válaszaid alapján úgy tűnik, hogy a párkapcsolati önszabotáló viselkedés nem jellemző rád, ami nagyon pozitív! Nem érzed úgy, hogy nem vagy elég jó a partnered számára, és nem reagálsz féltékenyen, amikor a partnered mással beszélget. Ezen kívül a konfliktusok utáni megkérdőjelezés is hiányzik, ami arra utal, hogy stabilan és magabiztosan látod a kapcsolatotokat.

Ez a stabilitás és önbizalom alapvetően jó alapot ad a kapcsolatokhoz. Ugyanakkor, ha valaha is tapasztaltál olyan helyzetet, ahol a bizonytalanság vagy a szorongás megjelent, fontos, hogy tudj róla, hogyan kezelheted ezeket a helyzeteket.

### 2) Konkrét technikák

A "megállj" technikák közé tartozik az alábbiak:

- **Önreflexió**: Amikor úgy érzed, hogy a szorongás vagy a féltékenység jelei megjelennek, állj meg egy pillanatra, és kérdezd meg magadtól, hogy mitől félsz valójában. 
- **Pozitív megerősítések**: Ismételd el magadban, hogy "Én értékes vagyok, és megérdemlem a boldogságot" vagy "A kapcsolatunk erős és egészséges".
- **Légzőgyakorlatok**: Ha stresszes helyzetben vagy, próbálj ki mély lélegzetvételt. Számolj négyig, lélegezz be, tartsd bent négyig, majd lélegezz ki négyig.

### 3) Gyakorlati lépések

1. **Napi napló**: Írj le minden nap egy-két dolgot, amiért hálás vagy a kapcsolatodban. Ez segíthet abban, hogy a pozitív élményekre összpontosíts.
   
2. **Kommunikáció a partnereddel**: Oszd meg a partnered érzéseidet, és beszéljétek meg, hogy mi működik jól, és mi az, ahol esetleg fejlődhetnétek.
   
3. **Fókuszálj a jövőre**: Gondolj arra, hogy mit szeretnél elérni a kapcsolatban, és tűzz ki közös célokat a pároddal. Készítsetek közösen terveket, amelyek mindkettőtöket boldoggá tesznek.

Ezek a lépések segíthetnek abban, hogy még inkább megerősítsd a kapcsolatodat, és elkerüld a jövőbeli önszabotáló viselkedéseket. Légy türelmes magaddal, és emlékezz arra, hogy a fejlődés egy folyamat. 

Bízom benne, hogy ez az elemzés és a javasolt technikák támogatni fognak a boldogabb és egészségesebb párkapcsolat elérésében!

Sok sikert kívánok neked!', '2025-08-07 07:53:27.099777+00'),
	('889f475a-0adb-4b7e-83c9-692bb6a7dee7', '6bad892a-32d1-4baa-931c-4b29ae7d2a73', 'Suti, a válaszaid alapján úgy tűnik, hogy magabiztosan kezeled a kapcsolatokat, és nem érzed úgy, hogy nem lennél elég jó a partnered számára. Ez pozitív jel, mivel a magabiztosság és az egészséges önértékelés alapja lehet egy sikeres párkapcsolatnak. Emellett az is biztató, hogy természetesnek tartod, ha a partnered másokkal is beszélget, és nem kérdőjelezed meg a kapcsolatotokat konfliktusok után. Ez a megközelítés segíthet abban, hogy elkerüld a párkapcsolati önszabotálást, de érdemes figyelned arra is, hogy nyitott és őszinte kommunikációval támogasd a kapcsolatot, hogy ne alakuljanak ki rejtett feszültségek.', 'Kedves Suti,

Örömmel segítek neked az önszabotáló viselkedésed megértésében és a párkapcsolati dinamikák javításában. Az alábbiakban részletes elemzést találsz az általad megadott kvíz válaszai alapján.

### 1) Azonosított minták
Az eddigi válaszaid alapján úgy tűnik, hogy pozitív önértékeléssel rendelkezel, ami fontos a párkapcsolatokban. Az, hogy soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, és természetesnek tartod, ha ő másokkal beszélget, arra utal, hogy magabiztos vagy a kapcsolatodban. Az is figyelemre méltó, hogy soha nem kérdőjelezed meg a kapcsolatotokat konfliktus után, ami a stabilitásra és a bizalomra utal.

Azonban a válaszaid tükrözhetnek egyfajta elkerülő magatartást is, amely a problémák és konfliktusok elkerüléséhez vezethet. Ez a viselkedés hosszú távon gátolhatja a kommunikációt és a kapcsolat mélyebb megértését. Ha a konfliktusok után soha nem kérdőjelezed meg a kapcsolatot, elképzelhető, hogy nem foglalkozol a felmerülő problémákkal, ami későbbi feszültségekhez vezethet.

### 2) Konkrét technikák
- **Megállj technika**: Amikor érzed, hogy egy konfliktus után a problémák elkerülésére készülsz, állj meg egy pillanatra. Kérdezd meg magadtól: "Miért nem akarom megbeszélni a problémát? Miért érzem, hogy ez nem fontos?" Ez segíthet abban, hogy tudatosan szembenézz a helyzettel.
  
- **Önreflexió**: Írj naplót arról, hogyan érzed magad a kapcsolatban, és miért reagálsz így bizonyos helyzetekben. Ez segíthet abban, hogy jobban megértsd a belső motívumaidat.

### 3) Gyakorlati lépések
1. **Nyílt kommunikáció**: Próbálj meg nyíltan beszélni a partnerednek a kapcsolatotokról. Ha van valami, ami aggaszt, ne félj megosztani vele.

2. **Konfliktuskezelés**: Amikor konfliktus merül fel, ne kerüld el a beszélgetést. Kérd meg a partneredet, hogy legyen nyitott a problémák megvitatására, és határozzatok meg egy időpontot, amikor mindketten foglalkozhattok a helyzettel.

3. **Támogatás keresése**: Ha úgy érzed, hogy a viselkedésed további mélyebb problémákra vezethető vissza, érdemes lehet egy szakember segítségét igénybe venni, aki segíthet az önértékelés és a kapcsolati dinamikák javításában.

4. **Pozitív megerősítések**: Minden nap mondj magadnak pozitív megerősítéseket arról, hogy milyen értékes vagy a kapcsolatban, és hogy megérdemled a boldogságot.

Ezek a lépések segíthetnek abban, hogy tudatosabbá válj a párkapcsolati viselkedésedben, és hogy elkerüld az önszabotáló mintákat. Ne feledd, hogy a fejlődés időt és türelmet igényel, de a lényeg az, hogy elindultál a megfelelő úton. Bátorság és kitartás!', '2025-08-07 08:20:42.767077+00'),
	('2b1cb3de-f2f3-41d4-9bf3-e1beba267845', 'dde04a6c-8d6b-4c98-846f-a7a6ab38a8fb', 'Kedves Suti,

A válaszaid alapján úgy tűnik, hogy magabiztos vagy a kapcsolatodban, és nincs benned önértékelési probléma. Ez pozitív jele annak, hogy egészséges önképpel rendelkezel, ami alapvető a tartós kapcsolatokhoz. Ugyanakkor érdemes figyelni arra, hogy a kapcsolat dinamikáját ne csak a saját érzéseid alapján ítéld meg. Biztosítsd, hogy a kommunikáció mindig nyitott legyen, és ne félj kifejezni a gondolataidat, ha a helyzet ezt megkívánja.', 'Kedves Suti,

Örömmel olvastam a kvíz válaszaidat, és szeretném segíteni abban, hogy mélyebben megértsd a párkapcsolati önszabotáló viselkedés mintáit, ha jelen vannak. Az alábbiakban három fő részre bontva foglalom össze az elemzést: azonosított minták, konkrét technikák és gyakorlati lépések.

### 1) Azonosított minták

A válaszaid alapján úgy tűnik, hogy a párkapcsolati önszabotáló viselkedés nem jellemző rád, hiszen a következőket mutatják a válaszaid:

- **Önbecsülés**: Az, hogy soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, pozitív önértékelésre utal.
- **Bizalom**: A partnered másokkal való beszélgetését természetesnek tartod, ami azt jelzi, hogy bízol önmagadban és a kapcsolatodban.
- **Konfliktuskezelés**: Az, hogy soha nem kérdőjelezed meg a kapcsolatotokat konfliktus után, arra utal, hogy stabilnak és biztonságosnak érzed a kapcsolatot, vagy nem hajlamos vagy a múltbeli nézeteltérések miatt kétségeket táplálni.

Ezek a válaszok azt jelzik, hogy a párkapcsolatodban erős és pozitív alapokra építkezel, viszont érdemes lehet figyelni arra, hogy ne alakuljanak ki elnyomott érzések vagy megoldatlan problémák.

### 2) Konkrét technikák

Mivel jelenleg nem mutatsz klasszikus önszabotáló mintákat, javaslom a következő technikákat, amelyek segíthetnek a tudatos kapcsolati fejlődésedben:

- **Önreflexió**: Rendszeresen szánj időt arra, hogy átgondold a saját érzéseidet és reakcióidat a kapcsolatban. Kérdezd meg magadtól, hogy miért érzel vagy reagálsz bizonyos módon.
- **Nyitott kommunikáció**: Beszélgess a partnereddel az érzéseidről és a kapcsolat jövőjéről. Ez erősíti a köztetek lévő bizalmat és érzelmi kötődést.

### 3) Gyakorlati lépések

Íme néhány javasolt lépés, amelyek segíthetnek a párkapcsolatod tudatosabbá tételében:

1. **Naplózás**: Tarts egy kapcsolatnaplót, ahol rögzítheted a gondolataidat és érzéseidet. Írd le, hogy mit érzel a kapcsolat során, és hogyan reagálsz különböző helyzetekre.
   
2. **Rendszeres párbeszéd**: Hozz létre egy heti "kapcsolati állapotfelmérőt", ahol te és a partnered megoszthatjátok egymással az érzéseiteket és tapasztalataitokat, ez segíthet a kapcsolati dinamika folyamatos figyelemmel kísérésében.

3. **Pozitív megerősítés**: Minden héten keress egy dolgot, amit a partnerednél értékelsz, és mondd el neki! Ez erősíti a pozitív érzelmi köteléket köztetek.

Bízom benne, hogy ezek a javaslatok segítenek a tudatos kapcsolati fejlődésedben! Ne feledd, a párkapcsolat egy folyamatos fejlődési folyamat, és minden lépés, amit megteszel, hozzájárul a boldogabb és egészségesebb kapcsolathoz. Ha bármelyik kérdésed van, szívesen válaszolok rá!

Sok sikert kívánok a fejlődésedhez!', '2025-08-07 08:31:41.73542+00'),
	('44df48ed-1748-42cc-9059-fc32b42e356a', 'b36f6913-f5f6-4e89-a399-05d608147529', 'Suti, az általad megosztott válaszok alapján úgy tűnik, hogy stabil önértékeléssel rendelkezel, ami pozitív hatással van a párkapcsolatodra. Az, hogy soha nem érzed magad elég jónak a partnered számára, és természetesnek tartod, hogy ő másokkal is beszélget, azt jelzi, hogy bízol a kapcsolatban és magadban is. Ez a magabiztosság segíthet elkerülni az önszabotáló viselkedéseket, de érdemes figyelni arra, hogy a konfliktusok után is megőrizzük a kapcsolat tiszteletét és a kommunikációt. Ha bármikor kétségeid támadnak, fontos, hogy nyíltan beszélj a partnered érzéseiről és aggodalmairól.', 'Kedves Suti,

Örömmel segítek neked abban, hogy jobban megértsd a párkapcsolati dinamikáidat, és hogy elkerüld az önszabotáló viselkedést. Az alábbiakban részletesen elemzem a kvíz válaszaidat, és gyakorlati tanácsokat adok, hogy erősíthesd a kapcsolatodat.

### 1) Azonosított minták

A válaszaid alapján pozitív és stabil alapokon áll a kapcsolatod. Az alábbiakat figyeltem meg:

- **Önbecsülés:** Az, hogy soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, azt jelzi, hogy egészséges önbecsüléssel rendelkezel.
  
- **Bizalom:** Hogy természetesnek tartod, amikor a partnered másokkal beszélget, azt mutatja, hogy bízol benne, és nem vagy féltékeny. Ez a bizalom alapvető a kapcsolat sikerességéhez.

- **Konfliktuskezelés:** Az, hogy soha nem kérdőjelezed meg a kapcsolatotokat konfliktus után, arra utal, hogy stabilan látod a kapcsolatot, és nem hagyod, hogy a viták felnagyítsák a problémákat.

### 2) Konkrét technikák

Bár a válaszaid pozitívak, fontos, hogy folyamatosan támogasd a kapcsolatot és elkerüld az esetleges önszabotáló viselkedéseket. Íme néhány technika:

- **"Megállj" technika:** Amikor úgy érzed, hogy egy negatív gondolat felmerül (pl. "vajon elég jó vagyok?"), állj meg egy pillanatra, és tudatosítsd magadban, hogy ez csak egy gondolat, nem a valóság. Kérdezd meg magadtól: "Miért érzem ezt, és mi a bizonyíték arra, hogy ez igaz?" 

- **Pozitív megerősítés:** Minden nap mondj el magadnak három pozitív dolgot, amit a kapcsolatodban értékelsz. Ez segít fenntartani a pozitív gondolkodást.

### 3) Gyakorlati lépések

1. **Napi reflexió:** Minden este szánj 5 percet arra, hogy átgondold a nap eseményeit. Írd le, mit tettél, ami erősítette a kapcsolatot, és hogyan érezted magad.

2. **Kommunikáció erősítése:** Beszélj a partnered érzéseiről és tapasztalatairól. Kérdezd meg tőle, hogy mit értékel a kapcsolatban, és oszd meg vele a saját érzéseidet is.

3. **Közös időtöltés:** Tölts el minél több minőségi időt a pároddal, próbáljatok ki új programokat együtt, hogy fokozzátok a kapcsolatotokat.

4. **Tudatos jelenlét:** Gyakorold a tudatos jelenlétet, amikor a pároddal vagy, figyelj arra, hogy teljes figyelmeddel rá összpontosíts, és ne gondolj másra.

Remélem, hogy ezek a tanácsok és technikák segítenek abban, hogy még erősebbé tedd a kapcsolatodat, és elkerüld az önszabotáló minták kialakulását. Ne feledd, hogy minden kapcsolatban van helye a fejlődésnek, és ez a folyamat egy izgalmas utazás!', '2025-08-07 08:52:17.94641+00'),
	('5e097073-cb4d-4f29-81c9-e3b90c55d573', '810a0af2-822c-48d3-9041-255a5c583ffd', 'Kedves Suti,

A válaszaid alapján úgy tűnik, hogy magabiztosan állsz a párkapcsolatodhoz, és képes vagy egészségesen kezelni a partnereddel való interakciókat. Az, hogy soha nem érzed magad nem elég jónak, és természetesnek tartod, ha a partnered másokkal is beszélget, pozitív jel, hogy bízol magadban és a kapcsolatodban. Ugyanakkor, ha a konfliktusokat soha nem kérdőjelezed meg, érdemes lehet átgondolni, hogy van-e helye a kommunikációnak a nehéz helyzetek után, hiszen ez segíthet a fejlődésben és a kapcsolat mélyülésében is.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 09:04:19.048682+00'),
	('01e62835-990d-4f79-b92e-5e606e7edb4a', 'ae7c2340-bd00-4074-902d-83a3df7aa22d', 'Suti, az általad megadott válaszok arra utalnak, hogy stabil és magabiztos hozzáállással közelíted meg a párkapcsolatodat. Az, hogy soha nem érzed magad elég jónak a partnered számára, valamint a természetes reakciód a társadalmi interakciókra, pozitív jelzések a kapcsolatod egészséges dinamikájáról. Ugyanakkor érdemes figyelni arra, hogy a konfliktusokat követően is érdemes időnként reflektálni a kapcsolat minőségére, mert ez segíthet a fejlődésben és a kommunikáció javításában. Ha bármikor úgy érzed, hogy a kapcsolatban rejtett feszültségek vannak, érdemes lehet nyíltan beszélgetni a partnered érzéseiről is.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 09:19:05.145387+00'),
	('e677fd42-1d56-4bf1-8ee9-1bc4eda52fb6', 'f1c1da90-6200-4f24-916e-d8fd07b125ee', 'Az eredményeid alapján úgy tűnik, hogy egészséges önértékeléssel és bizalommal rendelkezel a partnered iránt, ami a párkapcsolati önszabotálás jeleitől távol áll. Az, hogy soha nem érzed magad elég jónak, nem aggódsz a partnered másokkal való beszélgetése miatt, és nem kérdőjelezed meg a kapcsolatotokat konfliktus után, mind arra utal, hogy stabil és biztonságos alapokon áll a kapcsolatod. Érdemes lehet ezeket a pozitív érzelmeket és attitűdöket mélyebben megvizsgálni, hogy még inkább erősíthesd a kapcsolatodat.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 09:25:57.118508+00'),
	('e7d8bab4-b2c0-4c6b-a40f-8aa972cc519d', '69eba058-dce3-4fb9-8202-dce7c690e7fb', 'Suti, az általad adott válaszok azt mutatják, hogy magabiztos vagy a kapcsolatodban, és képes vagy egészséges perspektívából szemlélni a dolgokat. Az, hogy soha nem érzed magad elég jónak, és természetesnek tartod, hogy a partnered mással is kommunikál, azt jelzi, hogy bízol a kapcsolatban és a partneredben. Az is pozitív, hogy a konfliktusok után nem kérdőjelezed meg a kapcsolatotokat, amely a stabilitásra és a bizalomra utal. Azonban érdemes figyelni arra, hogy ez a magabiztosság ne csapjon át önfeladásba; a nyitott kommunikáció és a saját érzéseid kifejezése mindig fontos a hosszú távú kapcsolatokban.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 09:48:49.234667+00'),
	('bbaf4fc3-bb9a-429b-a20e-d4c0f7938fd7', '3cd24171-c50c-4eae-8c8a-b5cd91e37472', 'Suti, a válaszaid alapján úgy tűnik, hogy magabiztos vagy a kapcsolatodban, és ez nagyon pozitív jel. Az, hogy soha nem érzed magad kevésnek a partnered számára, valamint a másokkal való beszélgetésre adott természetes reakciód, arra utal, hogy egészséges önértékeléssel rendelkezel. Ezen kívül a konfliktusok utáni kérdőjelezés hiánya azt jelzi, hogy stabilnak és megbízhatónak tartod a kapcsolatot. Fontos azonban, hogy mindig figyelj a saját érzéseidre és a kapcsolat dinamikájára, hogy elkerüld a lehetséges önszabotáló viselkedéseket a jövőben.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 09:57:07.917526+00'),
	('db42dd47-a456-4743-8cd1-6fc3082d850f', '1cb4a64d-ca6a-4f1e-be55-a5bf14978032', 'Laci, az alapján, amit megosztottál, a kapcsolatodban megjelenik egyfajta belső feszültség, különösen a konfliktusok után. Az, hogy soha nem érzed magad elég jónak a partnered számára, pozitív jel, de a gyakori kérdőjelezés a kapcsolatotokat a konfliktusok hatására azt jelzi, hogy lehet, hogy nem érzed eléggé stabilnak a kapcsolat alapjait. Érdemes lenne mélyebben foglalkozni az érzéseiddel és a konfliktuskezelési módszereiddel, hogy erősebb és biztonságosabb alapokra helyezhesd a kapcsolatotokat.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 10:00:16.181613+00'),
	('0e8ad788-8c39-429b-8af6-bf5210e137a8', '871cc7b5-ef05-4a71-9150-e05dc5846113', 'Sutiként úgy tűnik, hogy egészséges önértékeléssel és bizalommal rendelkezel a kapcsolatodban, hiszen soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, és természetesnek tartod, ha a partnered másokkal is beszélget. Az is pozitív jel, hogy a konfliktusok után nem kérdőjelezed meg a kapcsolatotokat. Ezek a válaszok azt mutatják, hogy képes vagy a stabilitásra és a bizalomra a párkapcsolatban, ami alapvető fontosságú a fejlődéshez. Érdemes lehet a jövőben is fenntartani ezt a nyitott és pozitív hozzáállást, hiszen ez segíthet elkerülni a párkapcsolati önszabotálást.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 10:13:50.379613+00'),
	('b1cfae23-20f5-4385-b6a2-3ed773f9b7f5', '1e87e016-6628-4fbc-9fab-6c346d1d8e17', 'Kedves Suti! Az adataid és válaszaid alapján úgy tűnik, hogy egészséges önértékeléssel rendelkezel a kapcsolatodban, és ez nagyon pozitív. Az, hogy soha nem érzed magad nem elég jónak a partnered számára, valamint a természetes reakciód a másokkal való beszélgetésre, azt mutatja, hogy bízol a kapcsolatotokban. Az a tény, hogy nem kérdőjelezed meg a kapcsolatotokat konfliktus után, szintén arra utal, hogy stabilnak és biztonságosnak érzed a kapcsolatotokat, ami kulcsfontosságú a hosszú távú boldogsághoz. Javaslom, hogy ezt a bizalmat és biztonságot ápoljátok közösen, hogy tovább erősíthessétek a köztetek lévő köteléket.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 11:37:06.203034+00'),
	('530d49d6-a0fd-4afe-b7ba-29019e237446', 'b64db0a0-6b2f-4bc2-9dca-7c63c8f08d44', 'Suti, az Ön válaszai azt mutatják, hogy általában magabiztosan és egészséges módon viszonyul a párkapcsolatához. Ritkán érzi úgy, hogy nem lenne elég jó a partnerének, és természetesnek tartja, ha a partnere másokkal is beszélget. Az, hogy soha nem kérdőjelezi meg a kapcsolatot konfliktus után, arra utal, hogy stabil alapokra építi a kapcsolatát, azonban érdemes lehet figyelni arra, hogy ne hagyja figyelmen kívül a saját érzéseit és szükségleteit a jövőbeni nehéz helyzetekben. Az egészséges párkapcsolat érdekében fontos a kommunikáció és a saját határok megértése.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 11:46:45.828613+00'),
	('21124b00-2542-4470-87a2-22bab2baf4fd', '86135fc1-9014-465e-a9c4-41e003db65cb', 'Az általad adott válaszok alapján úgy tűnik, hogy egészségesen éled meg a párkapcsolatodat, és nincs benned önszabotáló érzés vagy gondolat. Az, hogy soha nem érzed magad elég jónak, és természetesnek tartod, ha a partnered mással is beszélget, azt mutatja, hogy bízol a kapcsolatban és a partneredben. Fontos azonban, hogy mindig figyelj a saját érzéseidre és szükségleteidre, hiszen a kapcsolatokban a kommunikáció kulcsfontosságú a további fejlődéshez.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 11:58:10.344349+00'),
	('903fb520-08ff-4f81-a1c4-4c1d4ec93d30', '4685df62-d4f6-47d5-b2ba-4b8e9c665797', 'Kedves Dede,

Az általad megadott válaszok azt mutatják, hogy magabiztos vagy a kapcsolatodban, és nem érzed úgy, hogy rosszul teljesítenél a partnered számára. Az, hogy természetesnek tartod a partnered másokkal való beszélgetését, és nem kérdőjelezed meg a kapcsolatot konfliktusok után, azt jelzi, hogy stabil alapokra építed a kapcsolatodat, ami rendkívül pozitív. Fontos azonban figyelni arra, hogy ebből a stabilitásból ne alakuljon ki a közöny vagy a figyelem hiánya; érdemes időnként reflektálni a kapcsolat dinamikájára, hogy elkerüld a lehetséges önszabotáló viselkedéseket a jövőben.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 12:08:33.908647+00'),
	('c7a6829f-4261-4458-8514-d1006076ccbe', '009d8766-0e57-4648-8d60-ba1a2e89e22c', 'András, az általad megadott válaszok alapján úgy tűnik, hogy mélyen érzed a saját értékedet a kapcsolatban, ami a "mindig" jelzővel kifejezett gondolatodban nyilvánul meg. Ez az önértékelés azonban gátolhatja a kapcsolatod fejlődését, hiszen ha nem érzed magad elég jónak, hajlamos lehetsz visszahúzódni vagy elkerülni a nyílt kommunikációt. Fontos lenne, hogy felfedezd, mi állhat a bizonytalanságaid mögött, és hogyan tudnád megerősíteni a kapcsolatodat a pároddal való nyílt párbeszédeken keresztül.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 12:11:39.123367+00'),
	('6e4f2d9b-03e2-4242-b2a6-d8a54ca85918', '922bd66b-74e1-4676-a0b0-6bec19a2c86f', 'Az általad megadott válaszok alapján úgy tűnik, hogy elégedett vagy a párkapcsolati helyzeteddel, és egészséges módon kezeled a partnereddel való interakciókat. Az, hogy soha nem érzed úgy, hogy nem vagy elég jó, és természetesnek tartod a partnered másokkal való beszélgetését, azt jelzi, hogy magabiztos vagy és bízol a kapcsolatotokban. Ugyanakkor érdemes lehet figyelni arra, hogy a konfliktusok után is megőrizzük a kapcsolat stabilitását, és nyitottak legyünk a kommunikációra, hogy elkerüljük a jövőbeni önszabotáló viselkedést.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 15:51:41.399965+00'),
	('4bde45d2-3e3d-43b3-bc4f-f03ad5965242', '72a991a7-1ec8-424a-a683-8a4584ac2693', 'Az eredményeid alapján úgy tűnik, hogy magabiztos vagy a kapcsolatodban, ami pozitív jel. Soha nem érzed azt, hogy nem vagy elég jó a partnered számára, és természetesnek tartod, hogy ő másokkal is beszélget. Ezek a válaszok arra utalnak, hogy nem mutatsz jeleket a párkapcsolati önszabotázsra, ami jótékony hatással lehet a kapcsolatodra. Érdemes azonban mindig figyelni arra, hogy a kommunikáció nyitott maradjon, így elkerülheted a jövőbeni félreértéseket.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 15:55:39.623153+00'),
	('6c6691b7-b559-4fc1-bf6b-5ec555cb2123', '45279de3-abde-447b-addb-1ff765597f8f', 'Suti, a válaszaid azt mutatják, hogy stabil önértékeléssel rendelkezel, és magabiztosan kezeled a partnered interakcióit másokkal. Az, hogy soha nem érzed úgy, hogy nem vagy elég jó, és nem kérdőjelezed meg a kapcsolatotokat konfliktusok után, arra utal, hogy egészséges alapokon áll a kapcsolatod. Fontos azonban figyelni arra is, hogy a konfliktusok során ne válj túlságosan elzárkózóvá, hiszen a nyílt kommunikáció segíthet a még erősebb kapcsolati kötelék kialakításában.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 16:10:51.855645+00'),
	('ae0db475-41ef-4f2e-a0e8-d853596a5eb6', 'fa48b9bd-a4c8-4817-bb52-b60056571a18', 'Kedves Sefs,

A kvíz válaszaid alapján úgy tűnik, hogy magabiztosan és egészségesen közelíted meg a párkapcsolatodat. Az, hogy soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, és természetesnek tartod, ha ő másokkal is beszélget, arra utal, hogy stabil önértékeléssel rendelkezel. A konfliktusok utáni kérdőjelezés hiánya pedig arra enged következtetni, hogy jól kezeled a nehéz helyzeteket, és bízol a kapcsolatotokban. Ezek mind pozitív jegyek, amelyek segítenek a párkapcsolati dinamikád erősítésében.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 16:14:46.854484+00'),
	('abbb4d94-e85c-46ba-9988-fc9fb0928ca9', '865dc790-533f-444c-9714-65068f7b2731', 'Kriszti, az általad megosztott válaszok számos olyan önszabotáló mintát tükröznek, amelyek a párkapcsolati dinamikákban és az érzelmi állapotban is jelentős hatással bírnak. Az alábbiakban részletesebben elemezlek, hogy mit jelezhetnek ezek a válaszok a kötődési stílusodról, a kommunikációs stratégiáidról és a konfliktuskezelési módjaidról.

### Kötődési stílus

A válaszaid alapján úgy tűnik, hogy a kötődési stílusod bizonyos mértékben elkerülő és szorongó elemeket is tartalmaz. Az "Időnként" válasz arra a kérdésre, hogy nem érzed magad elég jónak a partnered számára, arra utal, hogy időnként képes vagy arra, hogy önmagadban kételkedj, ami a szorongó kötődési stílus jele lehet. A "Mindig" válasz a "mindig el fogom rontani" kérdésre pedig azt mutatja, hogy a kapcsolatokban tapasztalható szorongás is jelen van, ami gyakran az önértékelési problémákra és a bizonytalanságra vezethető vissza.

', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 16:32:24.885087+00'),
	('54d12a16-6f24-4a65-9ddb-87cc24d25e35', 'e46849de-5632-4d8d-9d4b-c71ec506de61', 'Suti, köszönöm, hogy megosztottad velem a kvíz kérdéseidet és válaszaidat. Nézzük meg, hogy milyen önszabotáló minták, kötődési stílus és kommunikációs stratégiák jelennek meg ezekben a válaszokban.

Az első kérdésre adott válaszod, miszerint „soha” nem érzed úgy, hogy nem vagy elég jó a partnered számára, első pillantásra pozitív önértékelésre utal. Azonban érdemes mélyebben is megnézni ezt a választ. Az, hogy soha nem érzed ezt, akár azt is jelezheti, hogy nem teljesen vagy tudatában a saját érzéseidnek, vagy lehet, hogy elnyomod ezeket az érzéseket. Az önértékelésed és a másikhoz való viszonyod így egyfajta védekezési mechanizmusként működhet. Ez a fajta reakció arra is utalhat, hogy elkerülöd a sebezhetőséget, ami megnehezítheti a mélyebb kötődést.

A második kérdésre adott válaszod, miszerint természetesnek tartod, hogy a partnered mással beszélget, szintén érdekes. Ez a válasz azt mutathatja,', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 16:43:41.850041+00'),
	('8429f238-905e-481a-82f8-53fc45639285', 'dd6bc371-e83f-45af-9bf1-907eefd118ed', 'Szia, stui! Nézzük meg a válaszaidat és azt, hogy mit árulnak el rólad az önszabotáló minták és a kötődési stílus szempontjából.

Az első kérdésre adott válaszod, miszerint "soha" nem érzed úgy, hogy nem vagy elég jó a partnered számára, pozitív önértékelésről árulkodik. Ez azt jelzi, hogy van egy egészséges szintű önbizalmad, ami segíthet abban, hogy stabilan és magabiztosan lépj be a kapcsolatokba. Azonban érdemes megvizsgálni, hogy ez a "soha" valóban a valóságod-e, vagy esetleg egy védekező mechanizmus, amellyel elnyomod a kétségeidet. Az emberek gyakran elkerülik a sebezhetőséget, és ha valaki soha nem érzi így, lehet, hogy nem is enged meg magának olyan mély érzelmeket, amelyekkel szembesülnie kellene. 

A második kérdésre adott válaszod, miszerint "természetesnek tartod", hogy a partnered mással beszélget, szintén az önértékelésed és a bizalmad szempontjából fontos. Ez a', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 16:45:47.488896+00'),
	('6cd09c75-3a9f-426b-aa52-919e15a54881', '9e6c894e-9631-4345-9b56-6e05378eaae8', 'Suti, örülök, hogy itt vagy, és megosztottad a kvíz kérdéseidet és válaszaidat! Ezek a válaszok sok mindent elárulnak arról, hogyan gondolkodsz a kapcsolataidról és a saját magadról. Nézzük meg részletesebben, mit is jelenthetnek ezek a válaszok az önszabotáló minták, a kötődési stílus, a kommunikációs stratégiák és a konfliktuskezelés szempontjából.

Az első kérdés, amely arról szól, hogy milyen gyakran érzed úgy, hogy nem vagy elég jó a partnered számára, és a válaszod, hogy "soha", érdekes perspektívát mutat. Ez a válasz önbizalomra utal, és azt jelezheti, hogy stabil önértékeléssel rendelkezel a kapcsolatodban. Azonban az önszabotáló minták szempontjából érdemes elgondolkodni azon, hogy vajon ez a "soha" valóban őszinte-e, vagy esetleg egyfajta védekezési mechanizmus. Néha az emberek hajlamosak elnyomni az érzéseiket, hogy elkerüljék a fájdalmas gondolatokat, így lehet, hogy valójában vannak kéts', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-07 16:58:24.594697+00'),
	('6a089a39-d512-48b4-bf4e-dc9d65044eeb', '9e9ae457-b510-4c31-9552-1022f04b0bb8', 'Suti, nézzük meg a kvíz válaszaidat, és hogyan tükrözik az önszabotáló mintákat, a kötődési stílusodat, valamint a kommunikációs és konfliktuskezelési stratégiáidat.

### 1. Milyen gyakran érzed úgy, hogy nem vagy elég jó a partnered számára?
**Válasz: Soha**

Ez a válasz első pillantásra nagyon pozitívnak tűnik, hiszen azt sugallja, hogy magabiztos vagy a kapcsolatodban, és nem küzdesz a saját értéked megkérdőjelezésével. Azonban érdemes megvizsgálni, hogy mi állhat a "soha" mögött. 

A "soha" kifejezés használata arra utalhat, hogy a kapcsolaton belül nem érezted a hiányérzetet, de ez egyben jelezheti az érzelmek elfojtását is. Lehetséges, hogy a mélyebb önértékelési problémák vagy a félelem attól, hogy megmutasd a gyengeségeidet, vezethetnek ahhoz, hogy megpróbálod elkerülni azokat a helyzeteket, ahol kétségeid támadhatnak. Ha soha nem érzed úgy, hogy nem vagy elég jó', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 18:52:49.597909+00'),
	('105c76e9-6c48-4a27-be40-7126f726cb12', 'd735f65b-3ebc-44b3-b274-ea4f7ca4d145', 'Suti, olyan érdekes és árnyalt válaszokat adtál a kvíz kérdéseire, amelyek különböző önszabotáló mintákat és a kötődési stílusodra utaló jeleket is tükröznek. Nézzük meg részletesebben, mit is jelenthetnek ezek a válaszok, és hogyan hatnak a párkapcsolati dinamikádra.

Az első kérdés, miszerint milyen gyakran érzed úgy, hogy nem vagy elég jó a partnered számára, és a válaszod, hogy "soha", első pillantásra pozitívnak tűnik. Az önértékelésed erősebbnek látszik, mintha folyamatosan kételkednél magadban. Ez a válasz azt jelezheti, hogy stabil önértékeléssel rendelkezel, ami a kötődési stílusod szempontjából biztonságos kötődést sugall. Azonban érdemes figyelni arra, hogy a "soha" válasz nem feltétlenül fedi a valóságot. Néha az emberek elfojtják a negatív érzéseiket, mert nem akarják azokat megélni vagy megosztani. Ez egyfajta önszabotáló minta lehet, amely arra utal, hogy tal', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 20:21:03.158187+00'),
	('b29ffb41-f367-48a9-800c-baee5bd0de0a', '34e3a35f-a02b-46c8-87de-1db93d44f6f2', 'Szia, Suti! Örülök, hogy itt vagy, és hogy megosztottad velem a kvíz kérdéseidet és a válaszaidat. Az önszabotáló minták megértése nagyon fontos, és a válaszaid alapján érdekes dolgokat figyelhetünk meg.

Az első kérdésre adott válaszod, miszerint "soha" nem érzed úgy, hogy nem vagy elég jó a partnered számára, azt mutatja, hogy valószínűleg van egy erős önértékelésed. Ez a válasz arra utalhat, hogy nem vagy hajlamos arra, hogy alacsony önértékelés miatt kétségeket táplálj a kapcsolatodban. Az önértékelésed pozitív mivolta, azonban felvetheti azt a kérdést is, hogy mennyire vagy tudatában a kapcsolati dinamikáknak. Lehet, hogy a partnered felé irányuló elvárásaid egy kicsit idealizáltak, vagy esetleg nem vizsgálod meg eléggé a saját érzéseidet és azokat a szempontokat, amelyek az önértékelésedre hatással lehetnek. Az, hogy soha nem érzed magad elég jónak, jól mutathatja azt is, hogy nem hagy', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 20:28:57.734087+00'),
	('a2618310-bd25-4148-a1ce-58c200b38636', 'b87927e4-678c-442b-88dc-d99a80d9c16d', 'Suti, nézzük meg alaposan a válaszaidat, és próbáljuk megérteni, milyen önszabotáló minták és viselkedésformák rejlenek mögöttük.

### 1. "Milyen gyakran érzed úgy, hogy nem vagy elég jó a partnered számára?" - Válasz: Soha

Ez a válasz első ránézésre pozitívnak tűnik, hiszen azt jelzi, hogy nem szenvedsz az önértékelés hiányától a kapcsolatodban. Azonban érdemes mélyebbre ásni, mert a "soha" kifejezés mögött többféle jelentés is megbújhat. Lehet, hogy valóban magabiztos vagy a kapcsolatodban, de lehet, hogy ennek az érzésnek van egy másik oldala is.

A kötődési stílusod esetleg azt mutatja, hogy elkerülöd a sebezhetőséget, és nem engeded meg magadnak, hogy megkérdőjelezd a saját értékedet a partnered szemében. Ez a fajta védekezés lehetővé teszi számodra, hogy elkerüld a mélyebb érzelmi kapcsolódást, hiszen az önértékelésed védelme érdekében nem engeded', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 20:30:00.159073+00'),
	('ee4432f3-fed9-4d85-8957-606bd4e5eda8', '18578191-468a-44ad-8a46-1dc73d794d9d', 'Suti, az általad megadott válaszok mélyebb megértése érdekében nézzük meg, hogyan tükrözik ezek az önszabotáló mintákat, és mit árulnak el a kötődési stílusodról, kommunikációs stratégiáidról, valamint a konfliktuskezelésedről.

### 1. "Milyen gyakran érzed úgy, hogy nem vagy elég jó a partnered számára?" – Válasz: Soha

Ez a válasz első pillantásra pozitívnak tűnik, hiszen azt sugallja, hogy magabiztos vagy a kapcsolatban, és nincs önértékelési problémád. Az azonban érdekes, hogy a "soha" kifejezés mögött milyen érzelmek és gondolatok húzódhatnak meg. Lehet, hogy a válaszod azt jelzi, hogy elkerülöd a sebezhetőséget, vagy nem akarsz szembenézni azzal a lehetőséggel, hogy nem elég jó vagy. Az önértékelésed talán annyira erős, hogy nem engeded meg magadnak, hogy kétségeid legyenek, vagy lehet, hogy a belső hangod azt sugallja, hogy nem szabad ilyen gondolatokkal foglalkoznod.

Ez a viselkedés', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 20:38:43.594238+00'),
	('96ec62db-056a-4088-b4e4-91d83fbce467', '6da74cb2-8de6-454d-aa69-c588a56aef1b', 'Suti, az általad megosztott kvíz kérdések és válaszok mélyebb elemzése érdekes betekintést nyújt az önszabotáló mintákba, a kötődési stílusba, a kommunikációs stratégiákba és a konfliktuskezelésbe. 

Az első kérdésre adott válaszod – azaz hogy gyakran érzed úgy, hogy nem vagy elég jó a partnered számára – az önértékelésed és önbizalmad területén világít rá egy potenciálisan problémás mintára. Ez a gondolat nemcsak a kapcsolatokra, hanem az életed más területeire is kihatással lehet. Az, hogy gyakran érzed, hogy nem vagy elég jó, arra utalhat, hogy a kötődési stílusod valószínűleg szorongó, vagyis hajlamos vagy a partneri elfogadás keresésére, ugyanakkor félsz attól, hogy elutasítanak. 

Ez a szorongó kötődési stílus gyakran megjelenik olyan gondolatokban, mint a "nem vagyok elég jó" vagy "nem érdemlem meg a szeretetet". Ezek a belső üzenetek erősen befolyásolják a kapcsolati dinamikát, mivel folyamatos', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 20:43:46.036032+00'),
	('4a579dc6-1343-4f09-8dcd-362c1a8812d3', 'c9c2980a-e9f0-4207-8d0c-9df437916c86', 'Szia, Suti! Örülök, hogy itt vagy, és hogy megosztod velem a kvíz kérdéseidet és válaszaidat. Nézzük meg együtt, mit árulnak el ezek a válaszok az önszabotáló mintáidról, a kötődési stílusodról, a kommunikációs stratégiáidról és a konfliktuskezelési módszereidről.

Az első kérdésre adott válaszod – „Időnként érzem, hogy nem vagyok elég jó a partnered számára” – erőteljesen utalhat az önértékelési problémákra és egy esetleges alacsony önbizalomra. Az, hogy időnként ezt érzed, azt jelzi, hogy lehetnek olyan pillanatok, amikor a külső megerősítések vagy a partner viselkedése alapján kezded megkérdőjelezni a saját értékedet. Ez a gondolkodásmód sokszor az önszabotáló minták egyik gyökere, mivel a negatív önértékelés megnehezíti a kapcsolatban való bizalom kiépítését.

Emellett a „nem vagyok elég jó” érzés gyakran összefonódik a teljesítményelvű kötődési stílussal. Lehets', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 20:50:04.891913+00'),
	('2a365ed7-d4b1-4524-9588-47f47e289eb3', 'fcfe003a-90b2-4ecc-9d8e-cad50bf584cd', 'Suti, nézzük meg a válaszaid mögött rejlő mintázatokat és azok lehetséges jelentéseit. Az önszabotáló minták, amelyeket a válaszaid tükröznek, sok szempontból érdekesek, és különböző aspektusai vannak a kötődési stílusnak, kommunikációnak és konfliktuskezelésnek.

### 1. "Gyakran érzem, hogy nem vagyok elég jó a partnered számára"

Ez a válasz egyértelműen tükröz egy alacsony önértékelést, amely sokszor az önszabotáló minták része. Az, hogy "gyakran" érzed ezt, arra utal, hogy egyfajta belső kritikus hang folyamatosan jelen van számodra, amely megkérdőjelezi az értékedet a kapcsolatban. 

Egy lehetséges háttér, ami ezt a mintát táplálhatja, a kötődési stílus. Ha például egy bizonytalansági vagy elutasítástól való félelemmel teli kötődési stílusod van, az megnehezítheti, hogy pozitívan lásd magad a kapcsolatban. A félelem attól, hogy nem vagy elég jó, gyakran társul a', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:00:46.947127+00'),
	('fe0e5897-bd2e-4d23-89b3-a0330e0194e5', 'b11404df-ad28-4b63-ab92-d422fa1ea17d', 'Suti, örülök, hogy megosztottad velem a kvíz kérdéseidet és a válaszaidat. Ezek az információk nagyon fontosak ahhoz, hogy megértsük a kapcsolati dinamikáidat és az esetleges önszabotáló mintáidat. 

Az első kérdésedre adott válaszod – „Ritkán érzem úgy, hogy nem vagyok elég jó a partnered számára” – az önértékelésed szempontjából érdekes. Az, hogy ritkán érzed ezt, azt jelezheti, hogy alapvetően magabiztos vagy, és pozitívan viszonyulsz a saját értékedhez. Ugyanakkor fontos figyelni arra, hogy a „ritkán” is egy viszonylagos kifejezés. Lehet, hogy a múltban tapasztaltál olyan helyzeteket, amelyek során a párkapcsolatodban vagy a társas kapcsolataidban felerősödtek ezek az érzések. A ritkán azt is jelezheti, hogy van benned egyfajta szorongás, és lehet, hogy a jövőben esetleg külső tényezők vagy a partnered viselkedése befolyásolhatja az önértékelésedet.

A második kérdésedre adott', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:06:30.925375+00'),
	('c4b834ef-d3e3-4f37-b904-bb0a5310c2d4', '81c33145-dbf7-4986-ad3f-1efea2b2a2e5', '{"format":{"type":"text"},"verbosity":"medium"}', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:19:45.008804+00'),
	('b6130e96-7cc6-4d03-b48f-e39397ab5563', '157ff688-09a3-4bd0-b042-5397da6a143d', '{"format":{"type":"text"},"verbosity":"medium"}', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:23:33.269083+00'),
	('6b7e0f80-f8e9-4193-bbb9-fd6770981d9b', '711d74b6-8f0f-4ff4-9642-552b8eb0d996', '{"format":{"type":"text"},"verbosity":"medium"}', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:25:12.190376+00'),
	('ae67eac5-6c3d-45be-8625-9d0a89671d7f', '7b11b943-eace-4dff-8f76-2bab21a6e7f1', 'Szia suti! Köszönöm, hogy megosztottad a kvíz kérdéseket és válaszokat. Megértem, hogy szeretnéd ezeket a válaszokat önszabotáló minták szemszögéből elemezni. Fontos, hogy ezt barátságos, empatikus és non-megoldás-központú módon tegyem. A célom most csak megértésed támogatása: mit jelenthetnek ezek a válaszok a kötődésed, kommunikációs stílusod és a konfliktuskezelésed szempontjából, és milyen belső mintákat sejtethetnek.

Először összefoglalnám a két válasz azonosítását:
- Válasz 1: “Gyakran” érzed úgy, hogy nem vagy elég jó a partnered számára.
- Válasz 2: “Dühös leszek”, amikor a partnered mással beszélget.

Most menjünk végig részletesen, hogyan jelenhetnek meg ezek az önszabotáló minták a mélyebb működésedben, és mit mondhatnak a kötődési stílusodról, a kommunikációs stratégiáidról és a konfliktuskezelésedről.

1) Az “Gyakran érzed úgy, hogy nem vagy elég jó a partnered számára.” válasz mögötti mintázatok

- Érzelem-értékelés és önkritika: A gyakori érzelem, hogy nem vagy elég jó, gyakran összefügg az önértékelés bizonytalanságával. Az ilyen automatizmusok akkor alakulnak ki, amikor a saját értékdíjadat erősen a partner visszajelzéseihez kötöd. Ha a belső megerősítésed hiányzik vagy külső megerősítésre támaszkodik, akkor a partner reakcióit (kedvetlen, tetszés, kudarcélmény) saját értéked jelölőnévként értelmezheted.
- Dependencia a külső megerősítésben: Ez a gondolkod', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:27:52.327372+00'),
	('de73ff0b-26ae-412f-92e6-86f881bbfa21', '7b8d4a07-37f5-4595-83b0-dcb7f0e058de', 'Suti, köszi, hogy megosztod ezeket a kérdéseket és válaszokat. Mint profi párkapcsolati pszichológus, célom az, hogy az önszabotáló mintákat felismerjük és megértsük, anélkül javaslatokat vagy konkrét technikákat adva. A szöveg alapján az alábbiakban részletes elemzést nyújtok.

Összefoglaló kontextus
- A válaszok rövid, tömör visszajelzést adnak arról, hogyan értékelik magukat és hogyan reagálnak a múlt vagy jelenlegi kapcsolati élményekre. A két válasz együttesen egy olyan mintát vetít elő, amely gyakran összefügg az önértékelés és a másokhoz való viszonyulás mélyebb dinamikáival.
- Az önszabotáló minták közvetítői: negatív önértékelés és féltékenység, mint elsődleges érzelem-kezelési válaszok egy intimitás-képes kapcsolati helyzetben. Ezek a minták bejósolhatják a kötődési stílusokra és a kommunikációs stratégiákra gyakorolt hatást.

1) Önértékelés és elégség érzet
Kérdés: Milyen gyakran érzed úgy, hogy nem vagy elég jó a partnered számára?
Válasz: Időnként

Elemzés:
- Időnkénti érzelem alapján a személyes önértékelés hullámzó, nem pedig egységesen negatív vagy pozitív. Ez a hullámzás gyakran a „bizonytalanság szorításában” élményének megnyilvánulása: néha megtalálja a saját értékét, máskor pedig belép egy belső kritikus állapotba, amely a kapcsolati státuszért felelősséget tulajdonít számára. 
- Önszabotáló minták közé sorolható a teljesítmény és érték összekapcsolása a párkapcsolati elfogadással: úgy érezheted, hogy a szeretet és a jó kapcsolat csak akkor marad fenn, ha bizonyos szinten „megfelelsz” vagy „bizonyítasz” a partnered felé.
- Kötődési következmények: az ilyen válasz tünetei lehetnek egy bizonytalan-közép kötődési stílushoz kapcsolódó megközelítéshez. A bizonytalan/ambivalens kötődési stílus gyakran jellemzi azt, hogy az egyén belső bizonytalanságát külső értékelésekkel próbálja igazolni. A „nem vagy elég jó” érzés többletet és nehezebb kontrollt jelez a saját értékében, amelyhez a partner értékelésének külső forrása szolgálhat visszacsatolásként.
- Kommunikációs hatás: ez a megközelítés automatizált csendes visszacsatolást generálhat – a partneredől szóló észleléstől való félelem, és a beszélgetésekben való részvétel visszafogása lehet a következmény. A kommunikációban akkor jelenik meg, amikor a személy úgy érzi, hogy a „jó/elfogadható” viselkedést tanúsítva adhatja meg, amit a másik elvár, vagyis a megfelelésen keresztül nyeri vissza a szeretetet.
- Konfliktuskezelésben megnyilvánuló jelenségek: a bizonytalanság és az önmagába vetett kétségek konfliktusoknál könnyen átfordulhatnak az elkerülés vagy az elásás szükségleteiben. A személy talán próbálja minimalizálni a feszültséget, hogy ne hagyjon nyitva kérdőjeleket partner felé, vagy éppen ellenkezőleg, fokozhatja a belső kritikát, ha a konfliktusban úgy érzi, nem felel meg.

2) Reakció a partnered mással folytatott beszélgetésére
Kérdés: Hogyan reagálsz, amikor a partnered mással beszélget?
Válasz: Kicsit féltékeny vagyok', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:31:30.572774+00'),
	('b0b31bec-8671-48eb-a90a-fdcc850a8a0f', 'bd393273-acbd-42a6-ae17-617300d9ba28', 'Szia suti! Köszönöm, hogy megosztottad a kvíz kérdéseket és a válaszokat. Most az önszabotáló minták felismerésére és megértésére koncentrálok, konkrét megoldások vagy gyakorlati technikák nélkül. 

Részletes elemzés (készülve az adott válaszokra)

1) Kérdés: Milyen gyakran érzed úgy, hogy nem vagy elég jó a partnered számára? Válasz: Gyakran

- Nemi észlelés: A gyakori gondolat, hogy “nem vagyok elég jó” visszavetíti a kapcsolatra vonatkozó önértékelési dilemmákat. Az ismétlődő attitűd, hogy nem elég jó, gyakran mélyebb viselkedési mintákat mozgat meg: rugalmatlan következmények nélkül, de kifejezetten terhet visel a párkapcsolatban.
- Kapcsolati kötődés és bizonytalanság: Az állandó bizonytalanság a saját értékét illetően arra utalhat, hogy a kötődési stílus inkább lié a bizonytalanság-központú (szorongó) oldal felé tendál. A “gyakran” jellegű megfogalmazás készséget ad a negatív önkép fenntartására, amely a kapcsolati állapotok értelmezésében torzítást hozhat, és fenntartja a kétértelműséget arról, hogyan alakítja ki a partneredhez fűződő kötődést.
- Kommunikációs következetlenségek: Ha valaki gyakran érzi úgy, hogy nem elég jó, az gyakran kódolja a belső elvárásokat és a szégyenérzetet. Ennek kommunikációja lehet feléledő bizonytalanság, amely kedvezőtlenül befolyásolja az egymásra adott jelzéseket: félreértett és túlzott érzékenységgel reagált vagy éppen szerényítő mód megnyilvánulásokat vált ki.
- Önbecsmérlés és versengés: A “gyakran” jellegű válasz arra utalhat, hogy az önértékelés belső dialektikája versengő lehet a párkapcsolat kontextusában: megkérdőjelezed a saját érdemeidet a partner igényeihez viszonyítva, ami belső kritikát és megfelelési kényszert élesít ki.
- Konfliktuskezelésre gyakorolt hatás: A tartós önértékelési kétségek megnehezíthetik azt, hogy nyíltan és autonóm módon kommunikáld saját igényeidet és határaidat. Az érzelemszint emelkedésével járó válaszok sietőssé tehetik a védelmet vagy a visszavonulást, minimalizálva a valódi problémák feltárását.

2) Kérdés: Hogyan reagálsz, amikor a partnered mással beszélget? Válasz: Kicsit féltékeny vagyok

- Érzelemszabályozás és internalizált félelem: A féltékenység jelzi, hogy a belső biztonsági rendszerek könnyen előtérbe kerülnek a kapcsolati interakciók során. A “kicsit” jelző lehet afelől, hogy a zavaró érzelem beszédben is jelen van, de gyakorlati megnyilvánulásban mérsékelten kerül kifejezésre.
- Kötődés és bizalom viszonya: A féltékenység arról árulkodik, hogy a kötődésben található bizalom dinamikája instabil vagy kiszámíthatatlan lehet. A belső bizonytalanság és a másik személyhez fűződő kapcsolatok érzékelése gyakran a saját érték- és biztonságérzetre hat vissza.
- Kommunikációs stílus: A féltékenység megnyilvánulása jelzi, hogy érzések és félelmek kifejezése a kontroll és figyelem igényével társulhat. Enélkül', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:32:46.919019+00'),
	('1ffe54d0-7aee-4963-b0ec-8c5d748a495e', '8e0350ed-3c01-40db-a1ac-c514de3ab296', 'Szia suti! Köszönöm, hogy megosztod a kvíz kérdéseket és a válaszokat. Most azokat a mintákat nézzük, amelyek az önszabotáló viselkedés részét képezhetik, és hogyan tükrözik a kötődési mintázatot, a kommunikációs stratégiákat és a konfliktuskezelést. Nem adok gyakorlatokat vagy megoldásokat, csak megértést nyújtok.

Összegezve a két válaszból látható tendenciákat:

- Gyakran érzed úgy, hogy nem vagy elég jó a partnered számára.
- Kicsit féltékeny vagy, amikor a partnered mással beszélget.

1) Önszabotáló minták felismerése és megértése

- Önértékelési bizonytalanság és folyamatos kétely: A „Gyakran” válasz jelzi, hogy a belső önértékelés megingása rendszeresen jelen van. Az önértékelési instabilitás egy olyan mintázat, amely a kapcsolatokban állandó teljesítménykényszerként vagy folytonos önkritikusként manifesztálódhat. Ezek a gondolatok gyakran a múltbeli kritikákról vagy meg nem adott visszajelzésekről szólnak, és a jelenlegi kapcsolati dinamika helyezkedését is torzíthatják.
- Túlfunkcionális kontrolligény és bizonytalanság: A féltékenység közlése („kicsit féltékeny vagyok”) gyakran a kontroll iránti vágyat és a bizonytalanság enyhítésére tett kísérletet jelzi. A kontrollérzethez kapcsolódó igény az egészséges határokra és a partner felé közvetített bizalom távolságát is jelzi, s ez hozzájárulhat ahhoz, hogy a kapcsolati szétesésétől való félelem erősebb legyen.
- Értékrend és összevetés másokkal: A „nem vagy elég jó” érzés nemcsak önmagában jelenthet bizonytalanságot, hanem egy belső összefüggést is: az érzelmi érintkezés és elköteleződés minőségének folyamatos mérését igényli. Ez tükrözheti a belső perfekcionizmust vagy a saját teljesítménymagyarázatot, amely a kapcsolatis energiát kivonhatja.

2) Kötődési stílusra utaló jelzések

- Bizonytalanság a kötődési mintázatban: Ezek a válaszok arra utalhatnak, hogy a kötődési rendszered bizonytalansággal működik. A „mindenkinek lehet szüksége a társra” körüli félelem és az elvesztés miatti aggódás erősödhet, amikor a partner másokkal beszélget. Ez a félelem a elérés és a megértés hiányát jelzi, amit a gyermekkorból származó biztonságérzet vagy attól való félelem táplálhat.
- Idegi és érzelmi reaktivitás: A féltékenység gyakran érzelmi reaktivitást mutat. A kötődési modell szerint ez lehet elkerülő-ambivalens vagy szorongó-stílushoz köthető reakció, ahol a személy egyszerre vágyik kötelékre és fél attól, hogy reked a kapcsolatban vagy megcsalják.
- A belső párbeszéd mintázata: Gyakori „én-úgyérzem” jellegű belső beszéd, amely megerősíti a bizonytalanságot, és megkérdőjelezi a partner szándékait. Ez a belső narratív világ, amely nem feltétlenül a valóságot tükrözi, de erősen befolyásolja a kapcsolati döntéseket.

3) Kommunikációs stratégiák és konfliktuskezelés

- Kommunikációs vörös zászlók: A válaszokból kiolvasható, hogy a kommunikációban a bizonytalanság és a féltékenység gyakori témaként jelenik meg. Ahelyett, hogy nyílt és feltáró beszélgetések lennének, a belső félelmek külső jelek formájában érkeznek (pl. féltékenység kifejezése). Ez megnehezíti a konstruktív konfliktuskezelést, mert a vita gyakran érzelmi megnyilvánulásokra korlátozódik, és nem a konkrét szükségletek tisztázására.
- Szerep- és énkép: Az „én” központú belső beszéd és a másik viselkedésének értelmezése körül gyakran alakul ki félreértés. A partner szándékai helyett a saját félelmeidet és az önértékelésedet helyezed előtérbe, ami tovább fokozza a konfliktusokat.
- Reaktív vs. proaktív mintázatok: Ha a válaszok tükrözik, hogy kevésbé vagy képzett a priorizált, vállalható kommunikációban, előfordulhat, hogy a konfliktusok megoldásának mechanizmusai reaktívak, vagyis akkor lépünk be beszélgetésbe, amikor a helyzet már érzelmileg felhevílt.

4) Összegzés

- A válaszok alapján suti esetében egy komplex önszabotáló mintázat látszik, amelyben a bizonytalanság, az önértékelés instabilitása és a féltékenység kölcsönhatásban áll. Ez a dinamika erősen kapcsolódik a kötődési szorongás és a bizonytalan kommunikációkhoz: a partner iránti bizalom és árnyalt határok kialakítása lehet a legnagyobb kihívás. A válaszok azt jelzik, hogy a belső narratívák és érzelmi reaktivitás határozzák meg, hogyan értelmezed a partnered viselkedését, és hogyan reagálsz rájuk.
- Konfliktuskezelésben a féltékenység és az önértékelés bizonytalansága gyakran olyan helyzeteket teremt, ahol a kommunikáció nem érinti a konkrét szükségleteket, hanem az érzelmi szintre rezonál. Ennek eredményeként a kapcsolati dinamika folyamatosan visszaveri a saját bizonytalanságodat, és nehezíti a mélyebb kötődést.

Ha szeretnéd, beszélhetünk az összefüggésekről anélkül, hogy konkrét tanácsokat adnánk. Mondd csak, hogyan érzed magad ezzel kapcsolatban, suti.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:34:33.729914+00'),
	('02de1c55-59d3-4ba9-9e88-bdb281955eb5', '19060095-0a3f-4d8c-8c8c-784cf6177a0e', 'Suti, köszönöm, hogy megosztottad a kvíz kérdéseit és válaszokat. Most az önszabotáló minták felismerésére és megértésére koncentrálok, nem javaslatokra vagy megoldásokra. 

Összevont elemzés (max 300 szó)

Az első válasz: „Gyakran érzed úgy, hogy nem vagy elég jó a partnered számára?” – „Gyakran.” Ez az önbizalom- és megkérdőjelezett önértékelés tipikus jele. A gyakori bizonytalanság felerősítheti a kötődési félelmeket: az elhagyatottság vagy értékalapú bizonytalanság késztetheti a folyamatos ellenőrzést vagy tökéletességre törekvést. Az ilyen mintában a belső kritika hangja erősen jelen lehet, és a kapcsolati visszajelzéseket torzítja úgy, hogy az egyén mindig úgy értelmezze: „nem ér valakit eléggé.” Ez a dinamika gyakran a kötődési sztereotípiából fakad: lehet, hogy a személy a biztonságot a teljesítmény és a megmérettetés által keresi, nem pedig az elfogadás és a kölcsönös megértés által.

A második válasz: „Kicsit féltékeny vagyok” a partnered beszélgetése közben. A féltékenység ebben a formában szorosan kapcsolódik a kontrollvágyhoz és az értékelés bizonytalanságához. Konfliktuskezelésben és kommunikációban gyakran megjelenik a tulajdonosi attitűd: „védjem meg a kapcsolatomat az elvesztéstől”, ami gyakran a kommunikációs stratégiákban a gyanakvás és a visszatérő kérdések felé mutat. A féltékenység jelzi a korábbi kapcsolati csalódásokból származó megragadt mintákat: a másik érintése vagy interakciója automatikusan fenyegetésként értelmezhető. Ez kapcsolatban az empátia és az interperszonális bizalom felépítésének hiányát is tükrözheti, miközben a személy önkéntelenül a saját belső biztonsági rendszeréhez (bizonytalanság, félelem az elhagyástól) fordul.

Összegzés: mindkét válasz mutatja az önszabotáló mintákat, amelyek a belső kritikával, a bizonytalansággal és a bizonytalan kötődési igényekkel kapcsolódnak. Ezek a minták befolyásolják a kötődési stílust (bizonytalan/aggódó) és a kommunikációt (túlzott önvédelem, reagálás féltékenységgel), valamint a konfliktuskezelésben megnyilvánuló mintákat (távolságtartás vagy kontrollvágy a bizonytalanságra reagálva).', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:35:28.573536+00'),
	('1aa17c6b-a680-44f4-af3a-6bae5ee3f1c0', '3dc8702b-ce94-4d0e-a3b6-7c3c6fd350e6', 'Suti, köszönöm, hogy megosztottad ezt a kvízt. Alaposan nézzük meg, mit árulhatnak a válaszaid az önszabotáló mintákról, kötődési stílusról és a kommunikációról.

Közös összefüggések a válaszokban
- Bizonytalanság és belső kritika: Gyakran érzed úgy, hogy nem vagy elég jó a partnered számára. Ez a mintázat gyakran belső, önértékelési kérdésekhez kötődik: a saját értékedet külső megerősítéshez kötöd, és a partnered árnyékában keresed a saját értékedet.
- Megtévesztő morális mérlegelés és kontrollvágy: Amikor a partnered mással beszélget, a válasz szerint a féltékenység jelenik meg. Ez a kontroll iránti igényt és a félelemhez társuló bizonytalanság megnyilvánulása lehet—az érzés, hogy a másik “túl közel kerülhet” a másikhoz, és te elveszítheted az érzelmi teret.

Kötődési stílus szempontjából
- Bizonytalan (ambivalens) kötődésre utalhat, amelyben az egyén egyszerre vágyik a kapcsolatra és fél is attól, hogy a kapcsolat elveszti az autonómiáját vagy jelentőségét. Gyakran ez jár együtt fokozott önelemzéssel és belső kritikai monológokkal.
- A kifejezett féltékenység utalhat arra, hogy a partnered megfigyelésére és értékelésére törekszel: a másik price of affection érzetét azonnali, helyzethez kötött érzelmi reagálásokkal próbálod priorizálni.

Kommunikációs stratégiák
- Ha a partnered beszélgetését féltékenység kíséri, a kommunikáció priorizált végpontja lehet az önvédelmi, sietős válasz vagy a védő falak emelése. Ez gyakran abból fakad, hogy a te biztonságérzetedet a partneri figyelem és visszajelzés erősíti meg, de a módja lehet, hogy rejtett vagy nyílt kontroll igényű.
- A „gyakran” érés jelzi, hogy az önértékelésed erősen külső visszajelzéseken múlik: ez a folyamatos megmérettetés érzéséhez vezethet, és megakadályozhatja az érzelmi biztonságot a kapcsolatban.

Konfliktuskezelés szempontjai
- Az állandó féltékenység és az érzelmi bizonytalanság konfliktushelyzetekben gyakran védő mechanizmusokra késztethet: reagálhatsz azonnali feloldhatatlan állapotokat keresve, ahelyett hogy közös megértésre törekednél.
- Az önszabotáló minták miatt a konfliktusokban előfordulhat, hogy kevesebb nyitottság marad a másik szempontjainak meghallgatására, és inkább a saját belső eseményedre fókuszálsz.

Ha szeretnéd, beszélhetünk arról, hogyan érthető ez a dinamika, és mely belső hangok kísértenek, hogy jobban megértsd a saját mintáidat – mindezt néma megoldások nélkül. Szívesen együtt nézzük át, mit jelent ez a te esetedben.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-08 21:36:59.023373+00'),
	('14a74fac-227e-47d8-be01-f9efd2d6d04c', 'c5e852c9-571a-45e2-94a1-0e375f2f9056', 'Kedves suti! Szeretném józanul és együttérzően végigvenni a kvíz kérdéseket, hogy meglásd, milyen önszabotáló minták lehetnek benned. Nem adok megoldásokat, csak a megértést segítő elemzést. 

Elemzés összegzés: önszabotáló minták és kötődési jelzések

- Kérdés 1: Milyen gyakran érzed úgy, hogy nem vagy elég jó a partnered számára? Válasz: Időnként

- Kérdés 2: Hogyan reagálsz, amikor a partnered mással beszélget? Válasz: Kicsit féltékeny vagyok

Elemzés:

- Önértékelés és belső kritika
  - Az "időnként" válasz rezonálhatóvá teszi, hogy gyakran átéli a bizonytalanságot, de nem ítéli el túl drasztikusan önmagát. Ugyanakkor a kiszögellő bizonytalanság is megmutatkozhat érzelmi hullámzásként, amely automatikusan visszahúzza őt attól, hogy teljes mértékben megengedje magának a bizalmat és a spontaneitást. Ez the modal problémája lehet a belső kritikus hangok erősödése és az önbizalom ingadozása.

- Bizalom és kötődési stílus
  - A félelem, hogy nem vagy elég jó partner számára, vagy a párkapcsolat felé mutató elégedetlenség bizonytalanságot jelezhet. Az ilyen érzelmi válaszok gyakran kötődési bizonytalanságból erednek: aggódó vagy bizonytalan kötődéssel társulhat, ahol a bizalom érzése gyakran ingadozik, és a másik élettársi vagy romantikus interakciókban fennálló fenyegetés érzetét erősíti.

- Kommunikációs megnyilvánulás és konfliktuskezelés
  - A kérdés második fele alapján, hogy partnered mással beszélget, te féltékenységet élsz meg, ami érzelmi reakciót vált ki. Ez jelzi, hogy gyakran reagálsz érzelmi automatikussággal, amely a kontroll vagy a bizonytalanság redukálására irányulhat. A féltékenység lehet védő mechanizmus is: megpróbáljául erőközpontot vagy közelséget visszaállítani, de egyben kommunikációs kihívást is jelenthet, mert féltékenység esetén könnyen adódhat félreértés vagy elhallgatás.

- Önszabotáló minták összefüggései
  - Önbizalomhiány és a teljesítményen alapuló értékelés: úgy érzed, hogy "nem vagy elég jó", ami erősen a belső teljesítmény- és értéktudatosságra épül, és ez visszatükröződik a kapcsolati dinamikában. 
  - Féltékenység mint kontrollkészület: a féltékenység átmeneti megoldásként működhet, de egyúttal blokkolhatja a nyílt, őszinte kommunikációt, és nehezíti a közös probléma-megoldást.

- Hatás a kötődésre és a kapcsolati dinamikára
  - Ezek a minták átjárhatók lehetnek: a partner felé mutatott bizonytalanság növeli a konfliktuskészséget és a távolságot; a nyílt beszélgetés helyett érzelmi reakciók dominálnak, ami a kapcsolati rezilitást gyengítheti.

Ha szeretnéd, folytathatjuk e részletesebb megértés felé, és finomhangolhatjuk, hogyan jelennek meg ezek a mintázatok a hétköznapi szituációkban. Szeretnéd, hogy beszéljük meg konkrét példákon keresztül, hogyan ilyenkor történik az észlelés és a reakció?', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-10 08:59:03.993586+00'),
	('6e90fcec-78f6-4914-9070-c13d009f6afe', 'e2ebb90b-dfb4-4159-9daf-d1c762c4c448', 'Suti, köszönöm, hogy megosztottad a kérdéseket és válaszokat. Most az önszabotáló mintákat, a kötődési stílust és a kommunikációs konfliktus-kezelési dinamikákat próbálom megérteni, a konkrét válaszokra összpontosítva.

Összegző elemzés 🧠💬
- Hogyan jelennek meg az önszabotáló minták a válaszokban:
  - Bizonytalanság érzése: “Nem vagyok elég jó a partnerem számára” – ezt ritkán érzed, de még ez a ritkaság is feszültséget tükrözhet, mivel a belső mércék szigorúak lehetnek, és a megfelelésre való fókusz átcsaphat kontroll- és teljesítménykényszerbe.
  - Reaktív védekezés: “Dühös leszek, amikor a partnered mással beszél” – a düh itt nem csak érzelem, hanem mechanizmus a saját értékérzet védelmére. A hirtelen, impulzív reakciók a kapcsolaton belüli határkértékek feszességét jelenthetik.
- Kötődési stílus szempontjai:
  - A két válasz együtt utalhat bizonytalan-aggasztó kötődésre (anxious attachment): a belső érzés, hogy nem elég jó, erős résárnyaként jelenik meg, és a partner más társaságának észlelt jelenléte riadalmat, fenyegetést kelt, ami a kapcsolati bizalmat megkérdőjelezheti.
  - A dühreakció pedig a külső ingerre adott gyors arousalválasz lehet, amely a belső védelmi rendszer aktiválását mutathatja, amikor a kontroll illúziója meginog.
- Kommunikációs stratégiák és konfliktuskezelés:
  - Önkifejezés vs. védekezés közti feszültség: a “nem vagyok elég jó” érzelemének artikulálása növelheti a sebezhetőséget, ugyanakkor a következményekkel szembeni félelem miatt a kommunikáció stemperált vagy elhárító módon történhet.
  - Düh mint kijátszó mechanizmus: a partnerrel szembeni beszélgetések során a düh jelzi, hogy a kapcsolaton belüli határok vagy félelmek nem elég biztonságosak; a konfrontációt válaszlépésként éledheted meg, ami hosszú távon a távolodás felé lökheti a kapcsolatot.

Közös értelmezés
- A két válasz összegzésében egy belső bizonytalanság és az ebből fakadó védelmi, illetve reaktív viselkedési mintázat rajzolódik ki.
- A kapcsolaton belüli bizalom és a biztonság érzete kulcs lehet; a dühreakció pedig arra utal, hogy a határok és a biztonságérzet karban tartása nélkül könnyen átrendeződik a dinamika, és a párbeszéd helyett védekező állapotba kerül a kommunikáció.

Ha szeretnéd, beszélhetünk arról, hogyan érzed magad a kapcsolataidban általánosságban, és milyen helyzetek váltanak ki belőled ilyen mintákat. Kérlek, mondd el, hogyan érzel most a kapcsolatodban.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-10 17:55:52.230956+00'),
	('f262cba6-c7ba-46d8-858c-b2e35b9399b9', '2c54baa0-d08e-4ded-8737-eba519378735', 'Suti, köszönöm, hogy megosztottad ezt a két kérdést és válaszokat. Íme egy összegző, önszabotáló mintákat és kötődési, kommunikációs dinamika szerinti értelmezés.

## Összegzés az önszabotáló mintákról 🔍💬

- Gyakran érzed úgy, hogy nem vagy elég jó a partnered számára (1. kérdés: válasz „Gyakran”)
  - Szelekciós minták: Frequent kisebb vagy nagyobb bizonytalanság a partnered felé, önértékelési bizonytalanság. Ez általában belső elvárásokból, múltbéli kritikákból vagy belső kritikától eredhet.
  - Kötődési jelzés: Ez a minta gyakran a bizonytalan kötődési stílus jele lehet, ahol a személy továbbra is a kapcsolathoz való összehasonlító mércét tartja, és állandóan a saját értékét a kapcsolati sikerhez viszonyítja.
  - Kommunikációs stratégia: Az önértékelés külső visszajelzésekkel történő mérésére irányul. Hajlam, hogy belső negatív narratívák felülírják a valós, közvetlen jeleket.
  - Konfliktuskezelés: Könnyen felmerülhet a félelem attól, hogy a hibáztatás vagy elutasítás körforgását idézi elő, ami tovább fokozhatja a bizonytalanságot és a szorongást.

- Reagálsz, amikor a partnered mással beszélgetsz: „Dühös leszek”
  - Szelekciós minták: Az érzelmi reakció rögtönző védőfalként jelenik meg: a düh maszként szolgálhat az alárendelt vagy zavart érzelmek elnyomására. Ez az impulsus gyakran reflexív, automatikus válaszfájdalomra.
  - Kötődési jelzés: Düh lehet egy ambivalens kötődési válasz: egyszerre vágyik biztonságra/kapcsolatra, és fél a sebezhető állapot megnyilvánulásától. A düh „védő mechanizmus” a sebezhetőség elkerülésére szolgálhat.
  - Kommunikációs stratégia: A konfliktusdiagnosztizálás helyett az érzelmet kifelé töltjük: a partnerhez intézett érzelmi reakciók dominálnak, nem pedig a konkrét problémára fókuszáló beszélgetés.
  - Konfliktuskezelés: A düh eluralkodása megakadályozhatja a konstruktív párbeszédet, és erőltetett oldódást hozhat, ahol a megértés helyett a védekezés kerül előtérbe.

---

Ha szeretnéd, beszélhetünk arról, hogyan jelennek meg ezek a minták a mindennapi helyzetekben, és hogyan lehet ennek tudatosításával megérteni a viselkedésed mozgatórugóit. Szívesen hallgatom a további példákat vagy részleteket.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-10 20:32:53.774417+00'),
	('aed3ace3-19cd-46d6-a6cb-059c510b3a7c', '9cdfa571-efce-4d20-968d-d5ca94bf8932', 'Szia suti! 😊 Köszönöm, hogy megosztod ezt a kvízt. Az alábbi elemzés a válaszok mögötti önszabotáló mintákat és kapcsolati dinamikákat igyekszik feltárni, anélkül hogy konkrét megoldásokat adnánk.

Összegző elemzés a válaszokról
- Helyzet és belső hang: "Időnként" érzi, hogy nem elég jó a partnered számára. Ez az önbizalmi bizonytalanság, amely gyakran a saját értékrend és a kötődési biztonságának hiányosságából ered. A bizonytalanság ritkán konkrét, hanem szabálytalan, hullámzó érzelmi állapotként tör elő.
- Reakció a kapcsolati ingerre: A partnered mással való beszélgetésére adott reakció "kicsit féltékeny" észlelése. Ez a féltékenység jelzi, hogy a személy a kötődési szükségleteket erősen éli meg, és könnyen összehasonlítja magát másokkal. Ebben megnyilvánulhat a kontroll és a tulajdonlás igénye, amely a kapcsolatban belső bizonytalanságot tükröz.
- Megfelelési és értékítélet-szint: A féltékenység és az identitás kérdéses állapota együtt vezethet ahhoz, hogy belső kritika és az aktív önmegvetés erősödik. Hajlamos lehet arra, hogy többször kérdőjelezze meg saját értékét a párkapcsolat kontextusában, vagyis külső visszajelzésekre építse az önértékelését.
- Kötődési stílus lehetőségei: Ilyen válaszok gyakran kötődési bizonytalanságra utalhatnak (ambivalens vagy elkerülő-szorító elemek keveréke). A partnerhez fűződő érzelmi kötelékben ingataggá válik a biztonságérzet: egyszerre vágyik intimitásra és fél a sebezhetőségtől.
- Kommunikációs stratégia: A féltékenység és az önbizalomhiány kommunikációs oldalán gyakran feltűnő, hogy kevesebb nyitottság és közvetlen megfogalmazás jelenik meg; a belső feszültség nem feltétlenül kerül deklarálásra, inkább rejtetten vagy türelmetlenül érkezik a partner felé.
- Konfliktuskezelés: Az önbizalom és biztonság hiányában a konfliktusokhoz való hozzáállás könnyen reagálás-alapú lehet: gyors érzelmi kilengések, belső megkérdőjelezés és nehezített empátia megjelenése. A nyílt kommunikáció helyett a belső félelmek vezérelhetik a viselkedést.

Fontos megérteni, hogy ezek a minták nem egyetlen személy jellegzetességei önmagában, hanem mintázatok, amelyek a kötődés és a személyes történelem összefüggéseiben érthetők meg leginkább. Ha szeretnéd, beszélhetünk az, hogy ezek hogyan jelenhetnek meg különböző helyzetekben, és hogyan lehet rájuk empatikusan reagálni a párkapcsolatodon belül.

Ha szeretnéd, folytathatjuk a másik kérdés feldolgozását vagy konkrét példákat adhatsz a kapcsolati helyzetekre.', 'A részletes elemzés elkészítése folyamatban... Kérjük, frissítsd az oldalt néhány perc múlva.', '2025-08-11 20:13:31.020731+00');


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quizzes" ("id", "slug", "status", "default_lang", "feature_flags", "theme", "created_at", "updated_at") VALUES
	('474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'adhd-quick-check', 'active', 'hu', '{"layout_version": 1, "ai_result_enabled": true, "email_gate_position": "end"}', '{"logo_url": "/logo-placeholder.svg", "calendly_url": "https://calendly.com/demo-account", "primary_color": "#3B82F6", "hero_image_url": "/hero-placeholder.jpg", "secondary_color": "#10B981"}', '2025-08-15 07:26:16.832689+00', '2025-08-15 07:26:16.832689+00');


--
-- Data for Name: quiz_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_sessions" ("id", "quiz_id", "client_token", "state", "answers", "current_question", "email", "lang", "started_at", "completed_at", "created_at", "updated_at") VALUES
	('7d12cf33-8b69-4bc7-b9f5-0c70b5cc7a2c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '1stfqyim5eshuqsa1s7m9of', 'started', '{"impulsivity": "impulse_balanced", "organization": "3", "hyperactivity": "hyper_low", "attention_span": "3", "time_management": "time_good", "daily_functioning": "3", "social_situations": "social_adaptive", "emotional_regulation": "3"}', 1, NULL, 'hu', '2025-08-15 07:30:23.442406+00', NULL, '2025-08-15 07:30:23.442406+00', '2025-08-15 07:30:23.442406+00'),
	('83dec47e-d16a-47db-bea3-227123cc86e0', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '5reuofjqdqal8t2i8gbtd', 'started', '{}', 1, NULL, 'hu', '2025-08-15 07:59:51.331801+00', NULL, '2025-08-15 07:59:51.331801+00', '2025-08-15 07:59:51.331801+00'),
	('e9f07915-64e4-414a-ad61-6c097889adbe', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '8qud836cv18f6hoqhwsj8', 'completed', '{"impulsivity": "impulse_balanced", "organization": "2", "hyperactivity": "hyper_low", "attention_span": "3", "time_management": "time_good", "daily_functioning": "3", "social_situations": "social_adaptive", "emotional_regulation": "2"}', 1, NULL, 'hu', '2025-08-15 07:59:51.323966+00', NULL, '2025-08-15 07:59:51.323966+00', '2025-08-15 07:59:51.323966+00'),
	('0977f2cf-a645-482d-b427-23160fa21fe7', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'sakxg8buy8rkvq8p6hj0sq', 'started', '{}', 1, NULL, 'hu', '2025-08-15 08:04:45.089279+00', NULL, '2025-08-15 08:04:45.089279+00', '2025-08-15 08:04:45.089279+00'),
	('cdf6da58-1d9a-4103-a04f-2f731e3d587c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'ds9p8bvgnkh1cdhfc2wm3m', 'started', '{}', 1, NULL, 'hu', '2025-08-15 07:27:37.605598+00', NULL, '2025-08-15 07:27:37.605598+00', '2025-08-15 07:27:37.605598+00'),
	('81c14478-7683-4eef-bd94-cde14cf8fdda', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'zidfyaqztuxswtecd70lg', 'started', '{"impulsivity": "impulse_planned", "organization": "3", "hyperactivity": "hyper_low", "attention_span": "3", "time_management": "time_good", "daily_functioning": "3", "social_situations": "social_adaptive", "emotional_regulation": "3"}', 1, NULL, 'hu', '2025-08-15 07:27:37.624444+00', NULL, '2025-08-15 07:27:37.624444+00', '2025-08-15 07:27:37.624444+00'),
	('e61f09bd-ef78-4258-ba55-274db8d450d8', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'zwltrln0fnxsnw3fh4bh', 'started', '{}', 1, NULL, 'hu', '2025-08-15 07:30:23.418308+00', NULL, '2025-08-15 07:30:23.418308+00', '2025-08-15 07:30:23.418308+00'),
	('e391dbd7-d747-441a-8e86-fa327f29309a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'etdjowt2em4uvm33v0ub8', 'completed', '{"impulsivity": "impulse_quick", "organization": "3", "hyperactivity": "hyper_mild", "attention_span": "3", "time_management": "time_excellent", "daily_functioning": "4", "social_situations": "social_adaptive", "emotional_regulation": "4"}', 1, NULL, 'hu', '2025-08-15 08:04:45.140698+00', NULL, '2025-08-15 08:04:45.140698+00', '2025-08-15 08:04:45.140698+00'),
	('2aac3ad7-797e-466d-8f27-ddac3ab37b62', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '4356omxadn934xrpi5de9q', 'started', '{}', 1, NULL, 'hu', '2025-08-15 08:07:03.568132+00', NULL, '2025-08-15 08:07:03.568132+00', '2025-08-15 08:07:03.568132+00'),
	('11e99634-27fb-4b5d-a7cc-580ce5876962', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'otdj7w2sf0jigfdfva4ss', 'completed', '{"impulsivity": "impulse_planned", "organization": "3", "hyperactivity": "hyper_mild", "attention_span": "3", "time_management": "time_good", "daily_functioning": "3", "social_situations": "social_challenging", "emotional_regulation": "2"}', 1, NULL, 'hu', '2025-08-15 08:07:03.57962+00', NULL, '2025-08-15 08:07:03.57962+00', '2025-08-15 08:07:03.57962+00');


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: email_events; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: premium_action_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."premium_action_plans" ("id", "submission_id", "stripe_session_id", "action_plan", "plan_type", "created_at", "updated_at") VALUES
	('51f8aea6-68cb-49db-b814-a74dca6356a2', 'b36f6913-f5f6-4e89-a399-05d608147529', 'cs_test_a1sWkE6I9qGV1O1qejPkZQUTwtVNwTBSmIP2qs7PseCYjt0HdTgplCk0Gn', '# Személyre szabott akcióterv Suti számára

## 1. Személyiséganalízis

### Párkapcsolati minták

Suti, a válaszaid alapján úgy tűnik, hogy stabil önértékeléssel rendelkezel, ami a párkapcsolatodat pozitívan befolyásolja. Az, hogy soha nem érzed magad elég jónak a partnered számára, és természetesnek tartod, hogy ő másokkal is beszélget, azt mutatja, hogy bízol a kapcsolatodban és önmagadban is. Ez a magabiztosság egy erősség, amely segíthet elkerülni az önszabotáló viselkedéseket.

### Erősségek

- **Önbizalom:** A magabiztosságod alapja a stabil önértékelés. Ez segít abban, hogy ne engedd meg a féltékenység vagy a bizonytalanság érzéseit.
- **Nyitottság:** Az, hogy természetesnek tartod a partnered másokkal való interakcióját, azt jelzi, hogy képes vagy elfogadni a párkapcsolat dinamikáját.
- **Kommunikációs készségek:** Mivel bízol a partnered érzéseiben, könnyebben tudsz beszélni a nehézségekről és érzéseidről.

### Fejlesztendő területek

- **Konfliktuskezelés:** Bár magabiztos vagy, érdemes figyelmet fordítani arra, hogy a konfliktusok során miként kommunikálsz és hogyan őrzöd meg a kapcsolat tiszteletét.
- **Önreflexió:** Néha érdemes mélyebben megvizsgálni, hogy miért érzel bizonyos dolgokat a kapcsolatodban. Ez segíthet a fejlődésben.

### Jelenlegi és jövőbeli kapcsolatokra gyakorolt hatás

A stabil önértékelés és a nyitottság a jövőbeli kapcsolatokban is segíthet. Az önbizalmad alapján képes leszel egészséges határokat kijelölni, és elkerülni a destruktív mintákat, amelyek korlátozhatják a boldogságodat.

---

## 2. Szabotáló minták felismerése

### Konkrét példák

- **Túlzott önkritika:** Lehet, hogy néha túl szigorúan értékeled a saját teljesítményedet a kapcsolatban, ami feszültséget okozhat.
- **Féltékenység:** Bár nem érzed magad elég jónak, a jövőben előfordulhat, hogy a partnered másokkal való interakciója féltékenységet válthat ki belőled.

### Kiváltó helyzetek

- **Új emberekkel való találkozás:** Ha a partnered új barátokat szerez, előfordulhat, hogy kétségek merülnek fel benned.
- **Konfliktusok:** A feszültségek és nézeteltérések során a bizalom meginghat, és ez féltékenységet szülhet.

### Hogyan ismerheted fel ezeket a jövőben

- **Önreflexiós napló:** Írd le az érzéseidet és a reakcióidat különböző helyzetekben. Ez segít észrevenni a mintákat.
- **Kommunikáció a partnereddel:** Beszéljétek meg a félelmeidet és aggodalmaidat, ezzel megerősíthetitek a bizalmat.

---

## 3. 30 napos akcióterv

### 1. hét: Tudatosítás és megfigyelés

- **Naponta 10 perc önreflexió:** Ülj le egy csendes helyre, és gondolkodj el a napod során tapasztalt érzéseiden. Mi váltotta ki őket?
- **Felismerés:** Amikor feszültséget érzel, írd le, mi váltotta ki. Figyeld meg, hogyan reagálsz.
- **Érzelmi napló:** Kezdj el vezetni egy naplót, ahol leírod a pozitív és negatív érzéseidet a kapcsolatodban.

### 2. hét: Új szokások kialakítása

- **Napi 5 perc pozitív megerősítés:** Ismételd meg magadnak, hogy „Én értékes vagyok, és megérdemlem a boldogságot.”
- **Új kommunikációs szokások:** Minden nap próbálj meg kifejezni egy pozitív gondolatot a partnered felé.
- **Határok kijelölése:** Beszéljétek meg, hol vannak a határaitok, és tisztázzátok, mi az, ami elfogadható számotokra.

### 3. hét: Kommunikációs készségek fejlesztése

- **Aktív hallgatás:** Gyakorold, hogy amikor a partnered beszél, figyelj rá teljes figyelemmel, és ne szakítsd meg.
- **Érzelmek kifejezése:** Minden nap próbálj meg legalább egyszer kifejezni az érzéseidet, akár egy pozitív, akár egy negatív érzelemről van szó.
- **Közös aktivitások:** Tervezzetek be egy közös programot, amely lehetőséget ad a nyílt kommunikációra.

### 4. hét: Integráció és értékelés

- **Tükrözés:** Ülj le a partnereddel, és beszéljétek meg, mi változott az utóbbi hónapban. Melyik új szokás működött jól?
- **Célok felülvizsgálata:** Nézd át a hónap során kitűzött céljaidat, és értékeld, mennyire sikerült őket megvalósítani.
- **Jövőbeli tervek:** Tervezzetek közösen, hogy a jövőben hogyan szeretnétek tovább fejlődni együtt.

---

## 4. Gyakorlati eszköztár

### Napi rutinok és reflexiós kérdések

- **Reggeli rutin:** Mielőtt elkezdenéd a napot, szánj 5 percet a légzőgyakorlatokra, hogy tudatosan indítsd a napot.
- **Reflexiós kérdések:**
  - Milyen érzéseket tapasztaltam ma?
  - Mi váltotta ki ezeket az érzéseket?
  - Hogyan reagáltam?

### Kommunikációs sablonok és mondatok

- „Amikor ezt mondtad, úgy éreztem, hogy...”
- „Számomra fontos, hogy...”
- „Kérlek, mondd el, mit gondolsz erről.”

### Stresszkezelési technikák

- **Meditáció:** Naponta 10 perc csendes meditáció a belső nyugalom megteremtésére.
- **Fizikai aktivitás:** Hetente legalább 3 alkalommal végezz valamilyen sportot, hogy a stresszt levezethesd.

### Önbizalom építő gyakorlatok

- **Pozitív megerősítések:** Minden reggel mondj magadnak 3 pozitív dolgot, amit elértél.
- **Sikerlisták:** Írd össze azokat a dolgokat, amiket elértél az életedben, hogy emlékeztesd magad a képességeidre.

---

## 5. Kapcsolati stratégiák

### Hogyan javítsd a jelenlegi kapcsolataidat

- **Nyílt kommunikáció:** Kérj meg a partneredet, hogy ossza meg veled az érzéseit, és te is oszd meg a sajátjaidat. Ez erősíti a köteléket.
- **Minőségi idő:** Tölts el több időt együtt, és próbáljatok ki új tevékenységeket, amelyek megerősítik a kapcsolatotokat.

### Mit keress új kapcsolatokban

- **Támogató partner:** Olyan személyt keress, aki értékeli a nyitottságot és a bizalmat.
- **Kölcsönös tisztelet:** A kapcsolat alapja legyen a kölcsönös tisztelet és a bizalom.

### Konfliktuskezelési tippek

- **„Én” üzenetek használata:** Az érzéseid kifejezésekor mindig használj „én” üzeneteket, hogy elkerüld a védekezést.
- **Aktív hallgatás:** Figyelj a partneredre, és próbáld megérteni az ő nézőpontját is.

### Határok kijelölése

- **Határok tisztázása:** Minden kapcsolatban fontos, hogy tisztában legyetek a személyes határokkal. Beszéljétek meg, mi az, ami elfogadható és mi az, ami nem.

---

## 6. Bonus tartalom

### Ajánlott olvasmányok és források

- **„A párkapcsolatok művészete”** - E könyv segít megérteni a kapcsolatok dinamikáját.
- **„Az önértékelés fejlesztése”** - Hasznos technikák a magabiztosság növelésére.

### Meditációs és légzőgyakorlatok

- **Légzőgyakorlat:** Ülj le egy csendes helyre, és 5 percig lélegezz mélyeket. Belégzésre számolj 4-ig, tartsd bent 4-ig, majd lélegezz ki 4-ig.

### Motivációs tippek a nehéz időszakokra

- **Pozitív kijelentések:** Minden nap mondj magadnak pozitív mondatokat, mint például: „Megérdemlem a boldogságot” vagy „Képes vagyok a fejlődésre.”

---

Ez az akcióterv segíteni fog neked, Suti, hogy még erősebb és boldogabb kapcsolatokat építs. Ne feledd, hogy a fejlődés időbe telik, és fontos, hogy türelmes legyél magaddal. 💪❤️', 'premium', '2025-08-07 08:53:49.924+00', '2025-08-07 08:53:50.232959+00'),
	('b9839657-94b3-4e43-8cf6-5b7f0316a4d4', '810a0af2-822c-48d3-9041-255a5c583ffd', 'cs_test_a1brYHB00C03Krpw8ZbaNx0eAeJWI2dKIO2bTFCmEfNLhHhNsxOUvrcNX9', '# Személyre szabott akcióterv Suti számára

Kedves Suti! 🌟

Örömmel segítek neked egy részletes akcióterv kidolgozásában, amely a párkapcsolati mintáidra és a válaszaidra épít. Célunk, hogy még magabiztosabbá válj a kapcsolataidban, és fejleszd a kommunikációs készségeidet. 

## 1. Személyiséganalízis

A válaszaid alapján világosan látszik, hogy magabiztosan állsz a párkapcsolataidhoz. Az, hogy soha nem érzed magad nem elég jónak, azt mutatja, hogy pozitívan látod saját értékeidet és hozzájárulásodat a kapcsolatban. A másokkal való kommunikáció természetesnek tartása azt jelzi, hogy bízol a partneredben és a kapcsolatotokban. Ez a bizalom kulcsfontosságú egy egészséges kapcsolatban.

### Erősségek
- **Önbizalom:** Képes vagy a saját értékeidet felismerni és tiszteletben tartani.
- **Nyitottság:** Elfogadod, hogy a partnered másokkal is kommunikálhat, ami segít a szociális kapcsolatok szélesítésében.
- **Pozitív hozzáállás:** A magabiztosságod és a nyitottságod lehetőséget ad arra, hogy könnyebben kezelj nehéz helyzeteket.

### Fejlesztendő területek
- **Konfliktuskezelési készségek:** Ha soha nem kérdőjelezed meg a konfliktusokat, lehet, hogy elkerülöd a nehéz beszélgetéseket, ami hosszú távon feszültségeket okozhat. Érdemes lenne megtanulnod, hogyan lehet egészségesen kommunikálni a nehéz helyzetekről.
- **Önreflexió:** Szánj időt arra, hogy átgondold, milyen érzéseid vannak a konfliktusok során, és hogyan lehetne ezeket kifejezni.

Az erősségeid és a fejlesztendő területeid együttesen formálják a jövőbeli kapcsolataidat, hiszen a magabiztosság és a nyitottság mellett fontos, hogy a kommunikációra is hangsúlyt fektess.

---

## 2. Szabotáló minták felismerése

### Konkrét példák
- **Konfliktusok elkerülése:** Ha mindig elkerülöd a nehéz beszélgetéseket, akkor feszültségek halmozódhatnak fel, ami később nagyobb problémákhoz vezethet.
- **Túlzott önértékelés:** Bár a magabiztosság fontos, ha nem vagy hajlandó megkérdőjelezni a saját érzéseidet, akkor a partnered érzéseit is figyelmen kívül hagyhatod.

### Kiváltó helyzetek
- **Tervek eltérülése:** Ha a dolgok nem a tervek szerint alakulnak, hajlamos lehetsz elkerülni a beszélgetéseket.
- **Feszültség a munkahelyen:** A stresszes napok után a feszültség kirobbanhat a párkapcsolatban is.

### Hogyan ismerd fel?
- **Figyeld meg a reakcióidat:** Mikor érzed, hogy feszültség alakul ki a kapcsolatban? Milyen érzelmeket tapasztalsz ilyenkor?
- **Kérdezd meg magadtól:** Miért nem kommunikálsz a partnereddel a nehézségekről? Milyen félelmeid vannak?

---

## 3. 30 napos akcióterv

### 1. hét: Tudatosítás és megfigyelés
- **Feladat 1:** Írj naplót a napi érzéseidről és a kapcsolatodról. Milyen konfliktusok merültek fel? Hogyan reagáltál?
- **Feladat 2:** Készíts listát a nehéz helyzetekről, amelyeket elkerültél, és gondold át, miért tetted.
- **Feladat 3:** Kérd meg a partneredet, hogy ossza meg veled, hogyan éli meg a kapcsolatotokat. Figyelj figyelmesen!

### 2. hét: Új szokások kialakítása
- **Feladat 1:** Válassz ki egy nehéz helyzetet, amit szeretnél megbeszélni a partnereddel. Készíts elő egy nyitott, őszinte beszélgetést.
- **Feladat 2:** Gyakorold a "Én érzem..." kifejezést, amikor a saját érzéseidről beszélsz.
- **Feladat 3:** Tűzz ki egy napi „érzelem-időt”, amikor beszélgetsz a partnered érzéseiről is.

### 3. hét: Kommunikációs készségek fejlesztése
- **Feladat 1:** Olvass el egy könyvet a konfliktuskezelésről, és írd le a legfontosabb tanulságokat.
- **Feladat 2:** Gyakorolj egy barátoddal vagy családtagoddal nehéz beszélgetéseket. Kérj visszajelzést!
- **Feladat 3:** Tanulj meg aktívan hallgatni. Kérdezd meg a partneredet, hogy mit gondol, és figyelj a válaszaira.

### 4. hét: Integráció és értékelés
- **Feladat 1:** Írd le, hogyan változott a kapcsolatod az utolsó három hét során. Milyen eredményeket értél el?
- **Feladat 2:** Készíts egy terve a jövőbeni kommunikációs szokásaidról.
- **Feladat 3:** Üljetek le a partnereddel, és beszéljetek meg egy új szokást, ami segít a kapcsolatotok fejlődésében.

---

## 4. Gyakorlati eszköztár

### Napi rutinok és reflexiós kérdések
- **Reggeli reflexió:** Milyen érzéseid vannak a mai napra? Milyen kihívásokra számítasz?
- **Esti összegzés:** Mi ment jól a mai napon? Milyen érzések merültek fel a kapcsolatban?

### Kommunikációs sablonok
- **"Én érzem, hogy..."** – Ezzel kifejezheted, hogyan hatnak rád a helyzetek.
- **"Szeretném tudni, hogy te mit érzel..."** – Ezzel megnyithatod a beszélgetést a partnered érzései felé.

### Stresszkezelési technikák
- **Légzőgyakorlatok:** Naponta 5 percet szánj a mély légzésre, hogy csökkentsd a stresszt.
- **Jóga vagy meditáció:** Hetente legalább egyszer végezz valamilyen relaxáló tevékenységet.

### Önbizalom építő gyakorlatok
- **Pozitív affirmációk:** Naponta ismételj meg 3-5 pozitív mondatot magadról.
- **Célkitűzések:** Tűzz ki kis célokat a párkapcsolatodban, és ünnepeld meg az elért eredményeket!

---

## 5. Kapcsolati stratégiák

### Hogyan javítsd jelenlegi kapcsolataidat
- **Nyitott kommunikáció:** Mindig keresd a lehetőséget a beszélgetésekre, még ha a téma nehéz is.
- **Empátia:** Próbáld meg megérteni a partnered érzéseit és motivációit.

### Mit keress új kapcsolatokban
- **Hasonló értékek:** Fontos, hogy a potenciális partnered osztozzon a számodra lényeges értékeken.
- **Nyitottság:** Olyan személyt keress, aki szintén hajlandó a kommunikációra és a fejlődésre.

### Konfliktuskezelési tippek
- **Időzítés:** Válaszd ki a megfelelő időt a nehéz beszélgetésekhez; amikor mindketten nyugodtak vagytok.
- **Aktív hallgatás:** Engedd, hogy a partnered kifejezze magát, és próbálj meg ne megszakítani.

### Határok kijelölése
- **Elvárások tisztázása:** Beszéljétek meg, hogy mit vártok el egymástól a kapcsolatban, és hol vannak a határok.
- **Tisztelet:** Mindkettőtök számára fontos, hogy tiszteletben tartsátok egymás határait.

---

## 6. Bonus tartalom

### Ajánlott olvasnivalók és források
- **"A párkapcsolatok pszichológiája"** - Dr. John Gottman
- **"A konfliktusok művészete"** - Dr. Harriet Lerner

### Meditációs és légzőgyakorlatok
- **5-4-3-2-1 technika:** Figyeld meg, mit látsz, hallasz, érzel, ízlelsz és szagolsz. 
- **Mély légzés:** Belégzés 4 másodpercig, majd kilégzés 4 másodpercig. Ismételd 5-ször.

### Motivációs tippek a nehéz időszakokra
- **Emlékezz a céljaidra:** Tartsd szem előtt, miért fontos a kapcsolatod.
- **Bízz a folyamatban:** Ne felejtsd el, hogy a fejlődés időt igényel. Légy türelmes önmagaddal! 🌈

---

Kedves Suti, remélem, hogy ez az akcióterv segít neked a párkapcsolati fejlődésedben. Ne feledd, hogy minden lépés, amit megteszel, közelebb visz a céljaidhoz! 💪❤️', 'premium', '2025-08-07 09:05:33.733+00', '2025-08-07 09:05:34.042955+00'),
	('942597f7-e391-4b67-8ec2-a94e7d2f4e50', 'ae7c2340-bd00-4074-902d-83a3df7aa22d', 'cs_test_a1BW57fO0BS2yknXMstKLorYocHqMBu1qPrF7jj2CRTyVnqnC1JvyJ4n3x', '# Személyre szabott akcióterv Suti számára

## 1. Személyiséganalízis

Kedves Suti! 😊 A kvíz eredményeid azt mutatják, hogy stabil és magabiztos hozzáállással közelíted meg a párkapcsolatodat. Az, hogy soha nem érzed magad elég jónak a partnered számára, arra utal, hogy a kapcsolatban való önértékelésed nem az elvárásokon alapul, hanem a kölcsönös tiszteleten és szereteten. A természetes reakcióid a társadalmi interakciókra jelzik, hogy nyitott vagy a kapcsolatokra és az új tapasztalatokra.

**Erősségek:**
- **Önértékelés:** Az önértékelésed stabilitása lehetővé teszi, hogy a párkapcsolatot egészséges módon közelítsd meg.
- **Nyitottság:** A természetes reakcióid segítenek abban, hogy könnyedén létesíts kapcsolatokat másokkal.

**Fejlesztendő területek:**
- **Konfliktuskezelés:** Bár stabil vagy, érdemes időnként reflektálni a kapcsolat minőségére, hogy elkerüld a rejtett feszültségeket.
- **Nyitott kommunikáció:** A partnered érzéseiről való nyílt beszélgetés segíthet a konfliktusok során.

Ezek a minták mind a jelenlegi, mind a jövőbeli kapcsolataidra hatással lehetnek. Ha tudatosan figyelsz a kommunikációra és a konfliktuskezelésre, akkor a kapcsolataid még erősebbé válhatnak. Ne feledd: a fejlődés és a személyes növekedés mindig lehetséges! 🌱

---

## 2. Szabotáló minták felismerése

A párkapcsolati minták felismerése és a destruktív szokások azonosítása kulcsfontosságú a fejlődésed szempontjából. 

**Konkrét példák:**
- **Elkerülés:** Amikor konfliktusok merülnek fel, lehet, hogy hajlamos vagy elkerülni a problémákat, ami hosszú távon feszültséghez vezethet.
- **Önmagad alábecsülése:** Ha soha nem érzed magad elég jónak a partnered számára, az alááshatja az önbizalmadat és a kapcsolatot is.

**Kiváltó helyzetek:**
- **Feszültség:** Amikor feszültség vagy stressz van a kapcsolatban, lehet, hogy hajlamos vagy elrejteni az érzéseidet, ami csak súlyosbítja a helyzetet.
- **Változások:** Új helyzetek, mint például költözés vagy munkahelyváltás, feszültséget okozhatnak a kapcsolatban.

**Hogyan ismerheted fel ezeket a jövőben:**
- Legyél tudatos a saját érzéseidre, és figyeld meg, hogyan reagálsz különböző helyzetekre.
- Kérdezd meg magadtól: „Miért érzem ezt most?” vagy „Mi a legrosszabb, ami történhet?” Ezek a kérdések segíthetnek a helyzet tisztázásában.

---

## 3. 30 napos akcióterv

### 1. hét: Tudatosítás és megfigyelés

- **Napi napló:** Kezdj el naplót vezetni az érzéseidről és a párkapcsolatodról. Minden nap írd le, mit éreztél, és miért.
- **Figyeld meg a reakcióidat:** Gondolj át napi interakciókat, és figyeld meg, mikor és miért reagálsz úgy, ahogy.
- **Reflektálj a konfliktusokra:** Amikor konfliktus merül fel, próbáld meg leírni, mi váltotta ki azt, és hogyan reagáltál.

### 2. hét: Új szokások kialakítása

- **Pozitív megerősítés:** Minden reggel mondj el magadnak 3 pozitív dolgot, amit szeretsz magadban.
- **Hétfői időpont:** Tarts egy heti „kapcsolati időt” a partnerednek, ahol nyíltan beszélhettek a kapcsolatotokról.
- **Közös program:** Tervezd meg a hétvégi közös programot, amely erősíti a köteléketeket.

### 3. hét: Kommunikációs készségek fejlesztése

- **Aktív hallgatás:** Gyakorold az aktív hallgatást a beszélgetések során; figyelj arra, amit a partnered mond, és tükrözd vissza az érzéseit.
- **Érzelemkifejezés:** Tanulj meg nyíltan beszélni az érzéseidről, és bátorítsd a partneredet is erre.
- **Kérdezd meg:** Amikor konfliktus van, kérdezd meg a partneredet, hogy mit szeretne, és hogyan érzi magát.

### 4. hét: Integráció és értékelés

- **Havi értékelés:** Írd össze, mit tanultál az elmúlt hónapban, és hogyan fejlődtél.
- **Kapcsolati célok:** Tűzz ki új célokat a kapcsolatotok számára, és beszéljétek meg, hogyan érhetitek el őket.
- **Jutalmazd meg magad:** Ünnepeld meg a fejlődésedet egy különleges programmal, amit a partnered választ.

---

## 4. Gyakorlati eszköztár

### Napi rutinok és reflexiós kérdések

- **Reggeli rutin:** Kezd a napot 5 perc meditációval vagy légzőgyakorlattal.
- **Reflexiós kérdések:** Mielőtt aludni térnél, kérdezd meg magadtól: „Mi volt a legjobb dolog, ami ma történt?” és „Mit tanultam ma a kapcsolatomból?”

### Kommunikációs sablonok és mondatok

- **Kérdések:** „Hogyan érzed magad ezzel kapcsolatban?” vagy „Mit gondolsz, hogyan tudnánk ezt jobban kezelni?”
- **Kifejezések:** „Én érzem, hogy…” vagy „Nekem fontos lenne, hogy…”

### Stresszkezelési technikák

- **Légzőgyakorlatok:** Használj 4-7-8 légzési technikát: 4 másodpercig lélegezz be, tartsd bent 7 másodpercig, majd 8 másodperc alatt lélegezz ki.
- **Mozgás:** Válassz ki egy kedvenc sportot, és iktasd be a heti rutinodba.

### Önbizalom építő gyakorlatok

- **Pozitív affimációk:** Írj össze 5 pozitív affimációt, amelyeket naponta elmondasz magadnak.
- **Kihívások:** Tűzz ki magad elé egy célt, amit szeretnél elérni, és tervezd meg a lépéseket.

---

## 5. Kapcsolati stratégiák

### Hogyan javítsd a jelenlegi kapcsolataidat

- **Nyílt kommunikáció:** Mindig beszélj a partnered érzéseiről és gondolatairól, támogasd őt a kifejezésben.
- **Idő együtt:** Tölts időt együtt, és keress közös érdeklődési köröket, amelyek erősítik a köteléket.

### Mit keress új kapcsolatokban

- **Tisztelet és támogatás:** Keresd azokat, akik tisztelik az érzéseidet és támogatnak a céljaidban.
- **Nyitottság:** Olyan embereket válassz, akik nyitottak a kommunikációra és az érzések kifejezésére.

### Konfliktuskezelési tippek

- **Aktív hallgatás:** Mindig hallgasd meg a partneredet, mielőtt választ adsz.
- **Kompromisszum:** Keresd a középutat, amely mindkettőtök számára elfogadható.

### Határok kijelölése

- **Közös megállapodás:** Beszéljétek meg, mi az, ami elfogadható számodra, és mi az, ami nem.
- **Tisztelet:** Mindig tiszteljétek egymás határait, és ne lépjátok át azokat.

---

## 6. Bonus tartalom

### Ajánlott olvasnivalók és források

- **„A párkapcsolatok művészete”** – Gary Chapman
- **„A női lélek titkai”** – Estelle Frankel

### Meditációs és légzőgyakorlatok

- **Meditáció:** Használj alkalmazásokat, mint a Headspace vagy a Calm, amelyek segítenek a relaxációban.
- **Légzőgyakorlatok:** Naponta legalább 5 percet szánj légzőgyakorlatokra, hogy csökkentsd a stresszt.

### Motivációs tippek a nehéz időszakokra

- **Naplóírás:** Írj le minden nehézséget, amit átéltél, és keresd meg a tanulságokat.
- **Pozitív környezet:** Tölts időt olyan emberekkel, akik inspirálnak és támogatnak.

---

Remélem, Suti, hogy ez az akcióterv hasznos lesz számodra a párkapcsolatod fejlesztésében! Ne feledd, hogy a fejlődés egy folyamat, és minden lépés számít. 🌟 Kívánok sok sikert és boldogságot az utadon!', 'premium', '2025-08-07 09:20:05.596+00', '2025-08-07 09:20:05.649542+00'),
	('186b55a1-e926-4668-8de6-30ece5138f6f', 'f1c1da90-6200-4f24-916e-d8fd07b125ee', 'cs_test_a1cKUlxwQKY05Uh2D0RMv0kgJFLnSbbKbRtaZtghYS4sBzomD189khZV4E', '# Személyre Szabott Akcióterv Suti Számára

## 1. Személyiséganalízis

Kedves Suti! 🌟 Az eddigi válaszaid alapján egyértelmű, hogy egészséges önértékeléssel és bizalommal rendelkezel a partnered iránt. Ez a stabilitás rendkívül fontos a párkapcsolatokban, és alapvetően pozitív hatással van a kapcsolataidra.

### Párkapcsolati Minták
A válaszaid alapján úgy tűnik, hogy nem szenvedsz az önértékelési problémáktól. Soha nem érzed magad elég jónak, és nem aggódsz a partnered másokkal való interakciói miatt. Ez azt jelzi, hogy képes vagy megélni a bizalmat és a szeretetet a kapcsolatodban, ami erős alapot ad a jövőbeni kapcsolataidnak is.

### Erősségek
- **Magabiztosság**: A kapcsolatodban való bizalom és önértékelés képes vagy a pozitív érzelmeket megélni.
- **Nyitottság**: Képes vagy őszintén kommunikálni a partnered felé.
- **Stabilitás**: A konfliktusok után nem kérdőjelezed meg a kapcsolatot, ami segít a fejlődésben.

### Fejlesztendő Területek
- **Érzelmi mélység**: Érdemes lenne még jobban felfedezned a saját érzelmeidet és azt, hogy ezek hogyan hatnak a partneredre.
- **Több idő a kapcsolat minőségi javítására**: Szánj több időt a közös élményekre, amelyek még inkább megerősíthetik a köteléketeket.

Ezek az erősségek és fejlesztendő területek hozzájárulnak ahhoz, hogy a jövőbeli kapcsolataidban még inkább tudatosan tudj jelen lenni, és elkerüld a régi destruktív mintákat. 💖

---

## 2. Szabotáló Minták Felismerése

### Destruktív Minták
Bár jelenleg nem mutatsz destruktív mintákat, fontos tisztában lenni azokkal, amelyek a jövőben megjelenhetnek. Ilyen például:
- **Túlzott aggódás a partnered másokkal való kapcsolata miatt**: Ez a bizalom hiányát jelezheti.
- **Folyamatos önkritika**: Még ha most nem is érzed így, a jövőben lehetnek olyan pillanatok, amikor kétségeid támadhatnak.

### Kiváltó Helyzetek
- **Új emberek megjelenése az életetekben**: Ilyen helyzetekben érdemes tudatosan figyelni az érzéseidre.
- **Konfliktusok**: Ha a konfliktusok nem kerülnek megfelelő kezelésre, ezek a régi minták aktiválódhatnak.

### Hogyan Ismerd Fel
- Figyelj a belső érzéseidre, és jegyezd fel azokat a pillanatokat, amikor kétségek merülnek fel benned.
- Használj naplót a gondolataid rögzítésére, így könnyebben észreveheted a mintákat.

---

## 3. 30 Napos Akcióterv

### 1. Hét: Tudatosítás és Megfigyelés
1. **Naplózás**: Kezdj el naplót vezetni az érzelmeidről és gondolataidról, különösen a konfliktusok után.
2. **Önreflexió**: Naponta szánj 10 percet arra, hogy átgondold, hogyan érezted magad a nap folyamán.
3. **Partnered megkérdezése**: Kérdezd meg a partnered, hogyan érezte magát a közös időtöltések után, és figyeld meg az ő perspektíváját is.

### 2. Hét: Új Szokások Kialakítása
1. **Közös idő**: Tervezz hetente legalább egy közös programot, ami csak rólatok szól.
2. **Pozitív megerősítések**: Minden nap mondj valami jót magadról és a partneredről.
3. **Képességek fejlesztése**: Válassz ki egy új hobbit, amit közösen élvezhettek, például főzés vagy sport.

### 3. Hét: Kommunikációs Készségek Fejlesztése
1. **Aktív hallgatás**: Gyakorold az aktív hallgatást, figyelj a partneredre, és ne csak a válaszaidra összpontosíts.
2. **Érzelmi kifejezés**: Minden este beszéljétek meg, mi volt a legfontosabb érzelem a nap során.
3. **Kérdezd meg a partnered**: Kérdezd meg, mit szeretne a kapcsolatban még jobban, és hogyan tudnál segíteni.

### 4. Hét: Integráció és Értékelés
1. **Értékeljétek a hónapot**: Üljetek le együtt, és beszéljétek meg, mi működött, és mi nem.
2. **Összegző napló**: Írd le a tapasztalataidat, és hogyan változott a kapcsolatod a hónap során.
3. **Tervezzétek a jövőt**: Készítsetek közösen egy listát a jövőbeli céljaitokról.

---

## 4. Gyakorlati Eszköztár

### Napi Rutinok és Reflexiós Kérdések
- **Reggel**: Milyen érzésekkel ébredtem? Miért?
- **Este**: Mi volt a legjobb dolog a napomban? Mit tanultam?

### Kommunikációs Sablonok
- "Én úgy érzem, hogy…"
- "Számomra fontos, hogy…"
- "Mit gondolsz erről…?"

### Stresszkezelési Technikák
- **Meditáció**: Naponta 5-10 perc csendes ülés a gondolatok rendezésére.
- **Légzőgyakorlatok**: 4-7-8 légzés: 4 másodpercig belélegzel, 7 másodpercig megtartod, majd 8 másodpercig kifújod.

### Önbizalom Építő Gyakorlatok
- Minden nap írd le három dolgot, amiért hálás vagy.
- Képzelj el egy helyzetet, ahol a legjobbat hozod ki magadból, és törekedj rá.

---

## 5. Kapcsolati Stratégiák

### Jelenlegi Kapcsolatok Javítása
- **Nyíltság**: Mindig legyél nyitott a partnered érzéseire, és bátorítsd őt is, hogy ossza meg a gondolatait.
- **Csapatmunka**: Közösen oldjátok meg a problémákat, és támogassátok egymást a céljaitok elérésében.

### Mit Keress Új Kapcsolatokban
- **Bizalom**: Olyan partnert keress, aki szintén megbízható és nyitott.
- **Érzelmi intelligencia**: Fontos, hogy a másik fél is képes legyen az érzelmeit tudatosítani és kifejezni.

### Konfliktuskezelési Tippek
- **Aktív hallgatás**: Figyelj a másik félre, mielőtt reagálnál.
- **Higgadt beszélgetés**: Ha feszültség van, tartsatok szünetet, majd térjetek vissza a beszélgetéshez.

### Határok Kijelölése
- **Jó határok**: Beszéljétek meg, mi az, amit mindketten elfogadhatónak tartotok.
- **Közös megegyezés**: Minden határt közösen alakítsatok ki, hogy a bizalom megmaradjon.

---

## 6. Bonus Tartalom

### Ajánlott Olvasnivalók
- "Az érzelmi intelligencia" - Daniel Goleman
- "Kapcsolatok művészete" - John Gottman

### Meditációs és Légzőgyakorlatok
- **Meditáció**: Használj guided meditációkat, amelyek segítenek a stressz csökkentésében.
- **Légzőgyakorlatok**: Próbáld ki a "4-7-8" légzést a stresszes pillanatokban.

### Motivációs Tippek
- Emlékeztesd magad a céljaidra és azokra a pozitív érzelmekre, amelyeket a kapcsolatod ad.
- Képzeld el, milyen érzés lesz, amikor a céljaidat elérted, és ez motiválni fog a nehéz időkben.

---

Kedves Suti, remélem, hogy ez az akcióterv segíteni fog neked a kapcsolataid fejlődésében! Ne feledd, hogy a változás időbe telik, de a tudatosság és a fáradozás mindig meghozza a gyümölcsét! 🌈💪', 'premium', '2025-08-07 09:27:03.283+00', '2025-08-07 09:27:03.34404+00'),
	('ab4855f1-4431-427e-8ba5-8f758441691f', '69eba058-dce3-4fb9-8202-dce7c690e7fb', 'cs_test_a11cQuUNkwHXz0Arhjnnh3zpyPmusYI7j5Hg0KCUMMtBF35cRwMclcqvmu', '# Személyre szabott akcióterv Suti számára

## 1. Személyiségelemzés 🧠

Suti, az eddigi válaszaid alapján megállapítható, hogy magabiztosan állsz a párkapcsolataidhoz. Az, hogy soha nem érzed magad elég jónak, és természetesnek tartod, hogy a partnered mással is kommunikál, azt jelzi, hogy bízol a kapcsolatban és a partneredben. Ez egy erős alap, amely lehetővé teszi számodra, hogy egészséges keretek között éld meg a párkapcsolataidat.

### Erősségeid:
- **Bizalom**: A partnered iránti bizalom alapvető fontosságú, és úgy tűnik, jól kezeled ezt a területet.
- **Nyitottság**: Az, hogy természetesnek tartod a partnered másokkal való kommunikációját, nyitott és elfogadó hozzáállást mutat.
- **Stabilitás**: Az a képesség, hogy a konfliktusok után nem kérdőjelezed meg a kapcsolatot, stabilitást kölcsönöz a kapcsolataidnak.

### Fejlesztendő területek:
- **Önfogadás**: Fontos, hogy ne csak a kapcsolatodra, hanem saját magadra is figyelj. Ne érezd, hogy elég jó vagy, ha ez nem így van. 
- **Saját érzések kifejezése**: Gyakorold, hogy kifejezd az érzéseidet és szükségleteidet a partnered felé.
- **Határok kijelölése**: Tanulj meg egészséges határokat szabni, hogy megvédd a saját érdekeidet is.

Ezek a minták és erősségek hatással vannak a jelenlegi és jövőbeli kapcsolataidra. Egészséges önértékelés és a kommunikációs készségek fejlesztése kulcsfontosságú az egészséges és boldog kapcsolatok fenntartásához.

## 2. Szabotáló minták felismerése 🔍

### Destruktív minták:
- **Önfogadás hiánya**: Azt tapasztalhatod, hogy gyakran a saját értéked kérdőjelezed meg, ami a kapcsolatod minőségére is hatással van.
- **Túlzott alkalmazkodás**: Előfordulhat, hogy a partnered igényeit helyezed előtérbe a sajátjaid elé, ami hosszú távon frusztrációt okozhat.

### Kiváltó helyzetek és trigger-ek:
- **Konfliktusok**: Amikor nézeteltérés merül fel, könnyen érezheted, hogy nem vagy elég jó, vagy hogy a partnered másokkal való kapcsolatai veszélyeztetik a tiédet.
- **Szociális helyzetek**: Ha a partnered másokkal beszélget, megjelenhet benned a féltékenység vagy az önértékelési problémák.

### Hogyan ismerheted fel ezeket a jövőben:
- Figyeld meg, mikor érzel szorongást vagy féltékenységet. Kérdezd meg magadtól, mi váltotta ki ezt az érzést, és próbáld megérteni, hogy ez a saját önértékelésedre utal-e.
- Használj naplót, hogy rögzítsd az érzéseidet és a reakcióidat, így könnyebben észlelheted a mintákat.

## 3. 30 napos akcióterv 📅

### 1. hét: Tudatosítás és megfigyelés
1. **Napi naplóírás**: Kezdj el naplózni a napi érzéseidet és tapasztalataidat, különösen a párkapcsolati helyzetekben. 
2. **Önértékelési gyakorlatok**: Minden nap írd le három dolgot, amiért büszke vagy magadra.
3. **Fókuszálj a pozitívumokra**: Minden este gondolj vissza a napra, és írd le, mi volt jónak a kapcsolatodban.

### 2. hét: Új szokások kialakítása
1. **Határok kijelölése**: Határozd meg, mi az, ami számodra elfogadható, és mi az, ami már nem. Kommunikáld ezt a partnerednek.
2. **Saját igények kifejezése**: Gyakorolj egy mondatot, amellyel kifejezheted az érzéseidet a partnered felé. Például: "Szeretném, ha többet beszélnénk arról, ami zavar."
3. **Tarts egy "én-időt"**: Szánj minden nap legalább 30 percet arra, hogy csak magaddal foglalkozz, legyen az olvasás, sport vagy meditáció.

### 3. hét: Kommunikációs készségek fejlesztése
1. **Aktív hallgatás gyakorolása**: Amikor a partnered beszél, figyelj teljes figyelmeddel rá, és fogalmazd meg, amit mond, hogy biztos legyél benne, hogy megértetted.
2. **Érzések kifejezése**: Gyakorold, hogy nyíltan megfogalmazd az érzéseidet. Használj "én" üzeneteket, mint például: "Én úgy érzem, hogy..."
3. **Kérdezd a partneredet**: Kérdezd meg a partnered véleményét és érzéseit a kapcsolatotokról, hogy közösen dolgozhassatok a fejlődésen.

### 4. hét: Integráció és értékelés
1. **Értékeld a hónapot**: Nézd át a naplódat, és írd le, milyen változásokat tapasztaltál az érzéseidben és a kommunikációdban.
2. **Beszélj a partnerednek**: Oszd meg vele a tapasztalataidat, és kérd meg, hogy ő is ossza meg az érzéseit.
3. **Jövőbeli célok kitűzése**: Határozz meg új célokat a következő hónapra, amelyeken szeretnél dolgozni.

## 4. Gyakorlati eszköztár 🛠️

### Napi rutinok és reflexiós kérdések:
- **Reggeli rutin**: Minden reggel szánj 10 percet meditációra vagy légzőgyakorlatokra.
- **Reflexiós kérdések**:
  - Milyen érzéseim voltak ma a kapcsolatomban?
  - Milyen igényeim merültek fel, és kifejeztem őket?

### Kommunikációs sablonok és mondatok:
- "Én úgy érzem, hogy..."
- "Szeretném, ha tudnád, hogy számomra fontos az…"
- "Kérlek, segítsetek megérteni…"

### Stresszkezelési technikák:
- **Meditáció**: Tölts naponta 5-10 percet csendben, figyelve a légzésedre.
- **Fizikai aktivitás**: Válassz ki egy sportágat, amely tetszik, és építsd be a heti rutinodba.

### Önbizalom építő gyakorlatok:
- **Pozitív megerősítések**: Írj le 5 pozitív dolgot magadról, és olvasd el őket naponta.
- **Célok kitűzése**: Határozz meg kis célokat, amelyeket elérve növelheted az önbizalmadat.

## 5. Kapcsolati stratégiák 💑

### Hogyan javítsd a jelenlegi kapcsolataidat:
- **Nyílt kommunikáció**: Mindig törekedj arra, hogy nyíltan beszélj a érzéseidről és igényeidről.
- **Közös programok**: Tölts időt a partnered társaságában, és fedezzetek fel új közös érdeklődési köröket.

### Mit keress új kapcsolatokban:
- **Támogató partner**: Olyan valakit keress, aki tiszteletben tartja a határaidat és értékeli a bizalmat.
- **Közös értékek**: Fontos, hogy a közös értékek és célok összhangban legyenek.

### Konfliktuskezelési tippek:
- **Érzelmi távolság**: Amikor konfliktus merül fel, próbálj meg egy kis időt adni magadnak, hogy lehiggadj, mielőtt reagálsz.
- **Kompromisszumkészség**: Keresd meg a középutat, amely mindkettőtök számára elfogadható.

### Határok kijelölése:
- **Kérdések feltevése**: Fogalmazd meg előre, milyen határokat szeretnél megszabni, és oszd meg a partnerednek.
- **Következetesség**: Tartsd be a határaidat, és ne félj emlékeztetni a partneredet, ha átlépi őket.

## 6. Bonus tartalom 🎁

### Ajánlott olvasmányok és források:
- "Az érzelmi intelligencia" - Daniel Goleman
- "A kommunikáció művészete" - Dale Carnegie

### Meditációs és légzőgyakorlatok:
- **5-4-3-2-1 gyakorlat**: Figyelj az öt dologra, amit látsz, négy dologra, amit hallasz, három dologra, amit érzel, kettő dologra, amit szagolsz, és egy dologra, amit ízlelsz.
- **Légzőgyakorlat**: Lélegezz be mélyen 4 másodpercig, tartsd bent 4 másodpercig, lélegezz ki 4 másodpercig, és tartsd ki a lélegzeted 4 másodpercig.

### Motivációs tippek a nehéz időszakokra:
- **Emlékeztesd magad a céljaidra**: Írd le a céljaidat és tedd ki a falra, hogy mindig láthasd őket.
- **Keress támogató közösséget**: Csatlakozz csoportokhoz vagy közösségi platformokhoz, ahol hasonló érdeklődésű emberekkel találkozhatsz.

Suti, emlékezz arra, hogy a fejlődés egy folyamat, és minden lépés, amit megteszel, közelebb visz a céljaidhoz. Bízom benne, hogy ez az akcióterv hasznos és inspiráló számodra. 🌟

---

Szabad a gazda, kiskacsa', 'premium', '2025-08-07 09:56:03.214+00', '2025-08-07 09:56:03.248765+00'),
	('cc063ab3-1d33-4dcc-aab4-2a3bd6bf3a78', '3cd24171-c50c-4eae-8c8a-b5cd91e37472', 'cs_test_a1tYCs3sZjbH9tVGmFbUS2MVwy9ujDTSb1fhZvk5iTnQXqLGhzjvJzWkDj', '# Személyre szabott Akcióterv Suti számára

Kedves Suti! 😊 Örömmel segítek neked egy részletes akciótervet készíteni, amely segíthet a párkapcsolati dinamikád javításában és az önfejlesztésben. Az alábbiakban olvashatod a javaslataimat, amelyek segítségedre lehetnek a következő 30 napban.

## 1. Személyiséganalízis

### Párkapcsolati minták
A válaszaid alapján magabiztos vagy a párkapcsolatodban. Az, hogy soha nem érzed magad kevésnek a partnered számára, azt mutatja, hogy erős önértékeléssel rendelkezel. Az, hogy természetesnek tartod a másokkal való beszélgetést, azt jelzi, hogy könnyedén tudsz kapcsolódni másokhoz, ami jótékonyan hat a szociális kapcsolataidra.

### Erősségek
- **Önbizalom:** Az önértékelésed stabilitása segít abban, hogy pozitívan állj a kapcsolatokhoz.
- **Kommunikációs képességek:** Az, hogy természetesnek tartod a másokkal való beszélgetést, jelzi, hogy jól tudsz kapcsolódni másokhoz, ami kulcsfontosságú egy egészséges kapcsolatban.

### Fejlesztendő területek
- **Önreflexió:** Fontos, hogy figyelj a saját érzéseidre, és időnként állj meg, hogy átgondold, mit is szeretnél a kapcsolatodban.
- **Konfliktuskezelés:** Bár a válaszaid alapján stabilnak érzed a kapcsolatot, érdemes a konfliktuskezelési technikáidat is fejleszteni, hogy még erősebb kapcsolatot építhess.

### Jelenlegi és jövőbeli kapcsolatok hatása
A magabiztosságod és a természetes kommunikációs stílusod pozitívan befolyásolja a kapcsolataidat. Ezen erősségek révén könnyebben tudsz új ismeretségeket kötni, és a meglévő kapcsolataidat is stabilizálni tudod. Az önreflexió és a konfliktuskezelés fejlesztése révén azonban még inkább elkerülheted a potenciális problémákat.

---

## 2. Szabotáló minták felismerése

### Destruktív minták
Bár a válaszaid alapján nem mutatsz destruktív viselkedést, érdemes figyelni a következő helyzetekre, amelyek esetleg szabotáló mintákhoz vezethetnek:

- **Túlzott megfelelés:** Ha mindig próbálsz megfelelni a partnered elvárásainak, elveszítheted a saját identitásodat.
- **Elkerülés:** Ha konfliktus esetén inkább elkerülöd a beszélgetést, az hosszú távon feszültséget szülhet.

### Kiváltó helyzetek
- **Feszültség:** Amikor stresszes vagy, hajlamos lehetsz visszahúzódni.
- **Különböző vélemények:** Ha a partnered és a te nézőpontod eltérő, érezheted a nyomást, hogy ne beszélj a véleményedről.

### Hogyan ismerheted fel ezeket
- **Önmegfigyelés:** Figyeld meg, mikor érzed azt, hogy elkerülnéd a konfliktusokat. Kérdezd meg magadtól, miért nem szeretnél beszélni a problémáról.
- **Reflexiós napló:** Írd le a napjaidat, hogy észrevehesd a mintákat és a kiváltó helyzeteket.

---

## 3. 30 napos akcióterv

### 1. hét: Tudatosítás és megfigyelés
- **Naponta 10 perc önreflexió:** Írd le a nap végén, hogyan érezted magad a kapcsolatodban.
- **Kérdezd meg a partnered:** Hetente egyszer beszélgessetek arról, hogy mit érzel a kapcsolatban.
- **Figyeld a kommunikációt:** Figyeld meg, hogyan kommunikálsz másokkal, különösen a partnered esetében.

### 2. hét: Új szokások kialakítása
- **Napi 5 perc relaxáció:** Gyakorolj légzőgyakorlatokat, hogy csökkentsd a stresszt.
- **Határidőnapló:** Írd le a határaidat a kapcsolatodban, és tartsd magad hozzájuk.
- **Pozitív megerősítések:** Minden reggel mondj el 3 pozitív dolgot magadról.

### 3. hét: Kommunikációs készségek fejlesztése
- **Aktív hallgatás:** Gyakorold, hogy figyelmesen hallgatsz, amikor a partnered beszél.
- **Kérdések:** Minden nap tegyél fel egy nyitott kérdést a partnerednek, hogy jobban megértsd az érzéseit.
- **Sablon hasznosítása:** Használj előre megírt kommunikációs sablonokat a konfliktusok kezelésére.

### 4. hét: Integráció és értékelés
- **Összegzés:** Írd le, mit tanultál az elmúlt 30 napban. Miben változtál?
- **Kérdezd meg a partnered véleményét:** Mi változott a kapcsolatotokban az elmúlt hónapban?
- **Jövőbeli célok:** Tűzz ki új célokat a kapcsolatodban.

---

## 4. Gyakorlati eszköztár

### Napi rutinok és reflexiós kérdések
- **Reggeli kérdés:** Mi az, amiért hálás vagy a partneredben?
- **Esti kérdés:** Milyen érzések merültek fel benned ma a kapcsolatodban?

### Kommunikációs sablonok
- „Én úgy érzem, hogy…”
- „Szeretném, ha…”
- „Mi lenne, ha…?”

### Stresszkezelési technikák
- **Meditáció:** Naponta 5-10 perc meditáció, hogy csökkentsd a stresszt.
- **Fizikai aktivitás:** Hetente legalább 3 alkalommal végezz valamilyen sportot.

### Önbizalom építő gyakorlatok
- **Tükörgyakorlat:** Minden reggel nézz tükörbe, és mondj el 3 pozitív dolgot magadról.
- **Célok kitűzése:** Írj le 3 célt, amelyet el szeretnél érni a kapcsolatodban.

---

## 5. Kapcsolati stratégiák

### Hogyan javítsd a jelenlegi kapcsolataidat
- **Nyílt kommunikáció:** Kérj rendszeres időt a partneredtől, hogy beszélgessetek a kapcsolatról.
- **Közös programok:** Tervezzetek közös programokat, hogy erősítsétek a kapcsolatotokat.

### Mit keress új kapcsolatokban
- **Önazonosság:** Keresd azokat, akik értékelik a hitelességedet.
- **Nyitottság:** Fontos, hogy nyitottak legyenek a különböző nézőpontokra.

### Konfliktuskezelési tippek
- **Nyugodt helyzet:** Amikor konfliktus van, próbálj meg nyugodtan beszélni a problémáról.
- **Kompromisszum:** Legyél nyitott a kompromisszumokra, hogy mindkét fél elégedett legyen.

### Határok kijelölése
- **Határok kommunikálása:** Mondd el a partnerednek, mik a határaid, és mi az, ami számodra elfogadhatatlan.
- **Tartsd tiszteletben a határokat:** Figyelj arra, hogy a partnered határait is tiszteletben tartsd.

---

## 6. Bonusz tartalom

### Ajánlott olvasnivalók és források
- **„A párkapcsolatok pszichológiája”** – egy könyv, amely segít mélyebben megérteni a kapcsolati dinamikákat.
- **Online kurzusok:** Számos platformon elérhetők kommunikációs és önfejlesztő kurzusok.

### Meditációs és légzőgyakorlatok
- **5-4-3-2-1 technika:** 5 dolog, amit látsz, 4 dolog, amit érzel, 3 dolog, amit hallasz, 2 dolog, amit szagolsz, 1 dolog, amit ízlelsz.
- **Légzőgyakorlat:** Lélegezz be mélyen 4 másodpercig, tartsd bent 4 másodpercig, lélegezz ki 4 másodpercig.

### Motivációs tippek a nehéz időszakokra
- **Pozitív affirmációk:** Minden reggel ismételj meg egy inspiráló mondatot, mint pl. „Erős vagyok és képes vagyok a változásra.”
- **Képzeld el a sikereidet:** Vizualizáld, ahogyan elérsz egy nehezen megvalósítható célt a kapcsolataidban.

---

Suti, bátorítalak, hogy lépj a következő lépésekre, és használd ezt az akciótervet a fejlődésed érdekében. Emellett ne feledd, hogy a fejlődés egy folyamat, és minden lépés, amit teszel, közelebb visz a céljaidhoz! 🌟 Ha bármikor kérdésed lenne, vagy további támogatásra van szükséged, ne habozz keresni!

---

Szabad a gazda, kiskacsa', 'premium', '2025-08-07 09:58:07.74+00', '2025-08-07 09:58:07.794818+00'),
	('e07899c9-14c4-4877-819f-cd98edd29255', '1cb4a64d-ca6a-4f1e-be55-a5bf14978032', 'cs_test_a1PSfPPFSk7gwto2OLl8rdwiXPmFZS0S8ej3WF1TEItTfWIlb4Px4kO8j5', '# Laci Párkapcsolati Akcióterve

## 1. Személyiséganalízis

Laci, a kvíz eredményei alapján úgy tűnik, hogy a párkapcsolataidban egyfajta belső feszültség tapasztalható, amely különösen a konfliktusok után jelentkezik. Az, hogy soha nem érzed magad elég jónak a partnered számára, arra utal, hogy lehet, hogy mélyen gyökerező önértékelési problémákkal küzdesz. A válaszaid arra is rámutatnak, hogy a konfliktusok során gyakran kérdőjelezed meg a kapcsolat stabilitását, ami a bizonytalanság és a feszültség forrása lehet.

### Erősségek:
- **Önreflexió**: A válaszaid alapján képes vagy reflektálni az érzéseidre és a kapcsolati dinamikákra.
- **Érzelmi intelligencia**: Érzed a feszültségeket és a problémákat, ami alapot ad a fejlődéshez.

### Fejlesztendő területek:
- **Önbizalom**: A magabiztosság növelése segíthet abban, hogy jobban érezd magad a kapcsolatodban.
- **Konfliktuskezelés**: Hasznos lenne elsajátítani olyan technikákat, amelyek segítenek a feszültségek kezelésében.

### Jelenlegi/jövőbeli kapcsolatokra gyakorolt hatás:
A jelenlegi feszültségek és az önértékelési problémák megnehezíthetik a tartós és egészséges kapcsolatok kialakítását. Ha nem dolgozol ezeken a területeken, a jövőbeli kapcsolataid is hasonló mintákat követhetnek.

---

## 2. Szabotáló minták felismerése

### Destruktív minták
- **Önértékelés hiánya**: Gyakran kérdőjelezed meg a saját értékedet a kapcsolatban, ami a feszültségekhez vezet.
- **Elkerülő viselkedés**: Konfliktusok során hajlamos lehetsz elkerülni a problémák megbeszélését, ami további feszültséget szülhet.

### Kiváltó helyzetek és trigger-ek
- **Konfliktusok**: Bármilyen nézeteltérés, amely a kapcsolatodat érinti, erős feszültséget generálhat.
- **Összehasonlítás másokkal**: Ha mások kapcsolatait nézed, könnyen elhitted, hogy a te kapcsolatod nem elég jó.

### Hogyan ismerheted fel ezeket a jövőben
- Figyelj a belső monológodra: Mikor kezdesz el negatívan gondolkodni magadról a kapcsolatban?
- Tarts naplót a konfliktusokról: Írd le, mi váltotta ki a feszültséget, és hogyan reagáltál. Ez segíthet a minták felismerésében.

---

## 3. 30 napos akcióterv

### 1. hét: Tudatosítás és megfigyelés
- **Feladat 1**: Tarts naplót az érzéseidről, amikor konfliktusba kerülsz. Írd le, mit érzel, mi váltotta ki az érzéseidet.
- **Feladat 2**: Készíts listát azokról a pozitív tulajdonságaidról, amelyek értékesek a kapcsolatodban.
- **Feladat 3**: Kérdezd meg a partneredet, hogy mit értékel benned, és írd le a válaszokat.

### 2. hét: Új szokások kialakítása
- **Feladat 1**: Kezdj el napi 5 percet meditálni, hogy csökkentsd a stresszt és növeld az önértékelésed.
- **Feladat 2**: Próbálj meg hetente legalább egyszer nyíltan beszélni a érzéseidről a partnerednek.
- **Feladat 3**: Válassz ki egy pozitív megerősítést, amit minden reggel elmondasz magadnak.

### 3. hét: Kommunikációs készségek fejlesztése
- **Feladat 1**: Tanulmányozd a "nem agresszív kommunikáció" technikáit, és alkalmazd őket a következő konfliktus során.
- **Feladat 2**: Gyakorolj aktív hallgatást: amikor a partnered beszél, figyelj rá, és tedd fel a megfelelő kérdéseket.
- **Feladat 3**: Készíts kommunikációs sablonokat a konfliktusokhoz, például: "Én úgy érzem, hogy..." kezdetű mondatokkal.

### 4. hét: Integráció és értékelés
- **Feladat 1**: Írd le, hogyan változott a kapcsolatod az elmúlt 30 napban. Milyen új szokásokat sikerült beépítened?
- **Feladat 2**: Beszélj a partnerednek a tapasztalataidról, és kérdezd meg őt is, hogy észrevett-e változásokat.
- **Feladat 3**: Készíts egy újabb listát az elért eredményeidről, és ünnepeld meg a sikereidet!

---

## 4. Gyakorlati eszköztár

### Napi rutinok és reflexiós kérdések
- Minden reggel kezdd a napot egy pozitív megerősítéssel!
- Este írd le, mi volt a legjobb dolog a napodban, és mit tanultál a kapcsolataidról.

### Kommunikációs sablonok és mondatok
- "Én úgy érzem, hogy... amikor..."
- "Szeretném, ha tudnád, hogy..."

### Stresszkezelési technikák
- **Meditáció**: Naponta 5-10 perc csendes meditáció a belső béke megteremtésére.
- **Légzőgyakorlatok**: 4-7-8 légzőgyakorlat, ahol 4 másodpercig belélegzel, 7 másodpercig bent tartod, majd 8 másodpercig kiengeded a levegőt.

### Önbizalom építő gyakorlatok
- Készíts vizuális táblázatot a céljaidról és az elért eredményeidről!
- Ünnepeld meg a kis sikereidet, és írd le, miért vagy büszke magadra.

---

## 5. Kapcsolati stratégiák

### Hogyan javítsa jelenlegi kapcsolatait
- Kommunikálj nyíltan a szükségleteidről és érzéseidről.
- Kérdezd meg a partneredet, mit szeretne változtatni a kapcsolatban.

### Mit keressen új kapcsolatokban
- Olyan partnert, aki támogatja az önfejlesztésed és a céljaidat.
- Valakit, akivel könnyedén tudsz kommunikálni, és akivel megoszthatod a gondolataidat.

### Konfliktuskezelési tippek
- Mindig próbálj meg nyugodt maradni, és kerüld a vádaskodást.
- Használj "én" üzeneteket a feszültségek csökkentése érdekében.

### Határok kijelölése
- Tudd meg, mikor van szükséged időre magadnak, és azt kommunikáld a partnered felé.
- Határozd meg, mi az, ami számodra elfogadhatatlan a kapcsolatban.

---

## 6. Bonus tartalom

### Ajánlott olvasnivalók és források
- "A párkapcsolatok művészete" - John Gottman
- "Önbizalom: hogyan legyünk magabiztosak" - Nathaniel Branden

### Meditációs és légzőgyakorlatok
- **Meditáció**: Használj alkalmazásokat, mint a Headspace vagy a Calm.
- **Légzőgyakorlatok**: Youtube-on keress légzőgyakorlatokat, amik segítenek a stressz kezelésében.

### Motivációs tippek a nehéz időszakokra
- Emlékeztesd magad, hogy minden nehézség lehetőség a fejlődésre.
- Beszélj valakivel, akiben megbízol, és oszd meg vele a nehézségeidet.

---

Laci, ez az akcióterv egy remek lehetőség arra, hogy fejlődj a párkapcsolataidban. Ne feledd, a változás időt és türelmet igényel, de minden egyes lépés közelebb visz a céljaidhoz! 🌟💪

---

Szabad a gazda, kiskacsa', 'premium', '2025-08-07 10:01:26.841+00', '2025-08-07 10:01:26.88397+00'),
	('f4b6649c-a766-45fc-9e10-41a25b306aa8', '871cc7b5-ef05-4a71-9150-e05dc5846113', 'cs_test_a1lvZ2P0vKwPnhqMYXPJmFpjVfhbviyRkriQNIPHqCjcPfIoe97v2Tz2z0', '# Személyre Szabott Akcióterv Suti Számára

Kedves Suti! 🌟

Örömmel segítek neked egy akcióterv kidolgozásában, hogy még sikeresebbé tedd a párkapcsolati életedet. A kvíz eredményei alapján látható, hogy stabil és egészséges önértékeléssel rendelkezel. Az alábbiakban részletesen kifejtem az elemzéseket és az akciótervet.

## 1. Személyiségelemzés

### Kapcsolati Minták

A kérdőív alapján a válaszaid azt mutatják, hogy erős önértékelésed és bizalmad van a párkapcsolatodban. Soha nem érzed úgy, hogy nem vagy elég jó a partnered számára, ami arra utal, hogy nem vagy hajlamos az önszabotálásra. Sőt, természetesnek tartod, ha a partnered másokkal is beszélget, ami azt jelzi, hogy nyitott és magabiztos vagy a kapcsolatodban. Ez a hozzáállás segíti a bizalom erősítését és a konfliktusok utáni helyreállást.

### Erősségek

- **Magas önértékelés**: Képes vagy értékelni önmagad, ami hozzájárul a kapcsolati stabilitásodhoz.
- **Nyitottság**: Elfogadod, hogy a partnered másokkal is beszélgethet, ami a bizalom jele.
- **Konfliktuskezelés**: Nem kérdőjelezed meg a kapcsolatot a nehézségek után, ami segít a problémák hatékony kezelésében.

### Fejlesztendő Területek

- **További önismeret**: Érdemes tovább mélyíteni az önismeretedet, hogy jobban megértsd a saját szükségleteidet és határaidat.
- **Kommunikációs készségek**: Az érzelmek kifejezése és a nyitott kommunikáció fejlesztése segíthet még inkább elmélyíteni a kapcsolatokat.

### Hatások a Jelenlegi/Jövőbeli Kapcsolatokra

A jelenlegi erősségeid segítenek a stabil és boldog kapcsolatok kialakításában. A jövőbeli kapcsolataidban is fontos lesz, hogy ezeket az erősségeket megőrizd, miközben dolgozol a fejlesztendő területeken.

---

## 2. Szabotáló Minták Felismerése

### Destruktív Minták

Bár a kvíz alapján nem mutatsz destruktív mintákat, fontos figyelni a következő helyzetekre, amikor a bizalom megrendülhet:

- **Túlzott féltékenység**: Bármikor, amikor úgy érzed, hogy a partnered másokkal szorosabb kapcsolatot alakít ki, érdemes figyelni, hogy ne lépj be egy féltékenységi spirálba.
- **Önértékelési krízisek**: Ha egy konfliktus során megkérdőjelezed magad, az jelezheti, hogy önértékelési problémák merülhetnek fel.

### Kiváltó Helyzetek és Triggelek

- **Új emberek megjelenése** a partnered életében.
- **Konfliktusok**: Még ha nem is kérdőjelezed meg a kapcsolatot, fontos, hogy ne engedd meg, hogy a viták befolyásolják az önértékelésedet.

### Hogyan Ismerheted Fel Ezokat a Jövőben

- Figyeld meg a belső monológodat, amikor feszültség van a kapcsolatban.
- Ha a féltékeny vagy önértékelési gondolatok felmerülnek, tedd fel magadnak a kérdést: "Valóban van okom így érezni?"

---

## 3. 30 Napos Akcióterv

### 1. Hét: Tudatosítás és Megfigyelés

**Feladatok:**

1. **Napi naplóírás**: Írd le, hogyan érzed magad a párkapcsolatodban, és figyeld meg a változásokat.
2. **Önértékelési gyakorlat**: Minden nap írj le három dolgot, amit jónak tartasz magadban a kapcsolatban.
3. **Kapcsolati helyzetek elemzése**: Elemezd a múltbeli konfliktusokat, és írd le, hogyan hatottak a kapcsolatodra.

### 2. Hét: Új Szokások Kialakítása

**Feladatok:**

1. **Pozitív megerősítések**: Indítsd a napodat három pozitív kijelentéssel önmagadról.
2. **Nyitott kommunikáció**: Hetente egyszer beszélgess a partnereddel a kapcsolatotokról, és ossz meg vele érzéseket.
3. **Határok kijelölése**: Gondold végig, mik a számodra fontos határok a kapcsolatban, és oszd meg ezeket a partnereddel.

### 3. Hét: Kommunikációs Készségek Fejlesztése

**Feladatok:**

1. **Aktív hallgatás**: Gyakorold az aktív hallgatást a beszélgetések során, és tedd fel a kérdéseidet.
2. **Érzelemkifejezés**: Minden nap szánj időt arra, hogy kifejezd a partnered felé, mit érzel – akár egy üzenetben is.
3. **Konfliktuskezelési technikák**: Tanulj meg egy új konfliktuskezelési technikát, például a „fogalmazd meg újra” módszert.

### 4. Hét: Integráció és Értékelés

**Feladatok:**

1. **Összegzés**: Írd le, mit tanultál a hónap során, és hogyan változott a kapcsolati dinamikád.
2. **Közös értékelés**: Beszéljétek meg a partneredével, mit tapasztaltatok a hónap alatt.
3. **Terv a jövőre**: Készítsetek egy közös tervet, hogy mely új szokásokat szeretnétek fenntartani.

---

## 4. Gyakorlati Eszköztár

### Napi Rutinszerű Reflexiós Kérdések

- Milyen érzéseim voltak ma a kapcsolatomban?
- Milyen pozitív élmények érték a partneremmel?

### Kommunikációs Sablonok

- „Most éppen úgy érzem…”
- „Azt szeretném, ha…”
- „Hogyan érezted magad a múltkori beszélgetés során?”

### Stresszkezelési Technikák

- **Légzőgyakorlatok**: Naponta 5 perc mély légzés, amikor stresszesnek érzed magad.
- **Meditáció**: Hetente legalább egyszer szánj időt a meditációra az elme megnyugtatására.

### Önbizalom Építő Gyakorlatok

- **Tükörgyakorlat**: Minden reggel állj a tükör elé, és mondj magadnak három pozitív dolgot.
- **Célok kitűzése**: Tűzz ki heti, könnyen elérhető célokat, és ünnepeld meg az eléréseket.

---

## 5. Kapcsolati Stratégiák

### Hogyan Javítsd Jelenlegi Kapcsolataidat

- **Folyamatos kommunikáció**: Tartsd a kapcsolatot a partnered érzéseivel, és ne félj a sebezhetőségtől.
- **Közös programok**: Szervezzetek közös programokat, hogy erősítsétek a köteléket.

### Mit Keress Új Kapcsolatokban

- **Nyitottság**: Olyan partnert keress, aki nyitott és őszinte a kommunikációban.
- **Közös értékek**: Fontos, hogy a jövőbeli partnered hasonló értékeken alapuló kapcsolatot keressen.

### Konfliktuskezelési Tippek

- **Kezeld a problémákat azonnal**: Ne halogasd a konfliktusok kezelését.
- **Lépj hátra**: Néha érdemes egy lépést hátra tenni, hogy tisztábban lásd a helyzetet.

### Határok Kijelölése

- **Beszéljétek meg**: Mindig beszéljétek meg a határokat, és figyeljetek egymásra.
- **Tartsd tiszteletben**: Ha a partnered határokat állít, tartsd tiszteletben azokat.

---

## 6. Bonus Tartalom

### Ajánlott Olvasnivalók

- **„A Párkapcsolati Intimitás”** - John Gottman
- **„A Boldogság Művészete”** - Dalai Láma

### Meditációs és Légzőgyakorlatok

- **Napi 5 perc meditáció**: Ülj le csendben, és figyeld a légzésed.
- **Légzőgyakorlat**: Belégzés 4 másodpercig, majd 4 másodpercig tartsd bent, végül 6 másodpercig lélegezz ki.

### Motivációs Tippek

- **Napló**: Írd le a sikereidet és az elért céljaidat, hogy láthasd a fejlődést.
- **Inspiráló idézetek**: Minden nap keress egy motiváló idézetet, és gondolkodj el rajta.

---

Kedves Suti, bátorítsd magad az úton! Az akcióterv célja, hogy segítsen neked még inkább kibővíteni és elmélyíteni a kapcsolataidat. Ne feledd, hogy a fejlődés egy folyamat, és minden lépés számít! 💪💖

---

Szabad a gazda, kiskacsa', 'premium', '2025-08-07 10:15:02.778+00', '2025-08-07 10:15:03.073472+00'),
	('b445b07e-b1bd-4c92-9b30-72ab0af85edb', '1e87e016-6628-4fbc-9fab-6c346d1d8e17', 'cs_test_a1YDwy13Zb7v6hw8257vvzzH5ON5VNYXAvwHnHxrEwoPJxvVstZw8ZPGcx', '# Személyre szabott Akcióterv Suti számára

Kedves Suti! 🎉 Örömmel segítek neked egy részletes akcióterv kialakításában, amely segít megerősíteni a párkapcsolatodat és fejleszteni a kommunikációs készségeidet. Az alábbiakban megtalálod a személyiségelemzést, a destruktív minták felismerését, egy 30 napos akciótervet, gyakorlati eszköztárat, kapcsolati stratégiákat, valamint bónusz tartalmat.

## 1. Személyiséganalízis

### Párkapcsolati minták
Suti, az eddigi válaszaid alapján világosan látszik, hogy stabil és egészséges önértékeléssel rendelkezel a párkapcsolatodban. Azt, hogy soha nem érzed magad nem elég jónak a partnered számára, valamint a természetes reakciód a másokkal való beszélgetésre, arra utal, hogy bízol a kapcsolatotokban. Ez a bizalom alapvető fontosságú a hosszú távú boldogsághoz. Az a tény, hogy nem kérdőjelezed meg a kapcsolatotokat konfliktusok után, azt jelzi, hogy a kapcsolatotok biztonságosnak és stabilnak tűnik számodra.

### Erősségek
1. **Önértékelés**: Nagyon jó önértékeléssel rendelkezel, ami segít a kapcsolatokban való boldogulásban.
2. **Kommunikáció**: A természetes beszélgetési készséged másokkal segíti a kapcsolatok kiépítését.
3. **Belső bizalom**: Az, hogy nem aggódsz a kapcsolatod miatt, erősíti a köteléket a partnered és közted.

### Fejlesztendő területek
1. **Konfliktuskezelés**: Bár a jelenlegi kapcsolatod stabilnak tűnik, fontos a konfliktusok kezelése, hogy ne halmozódjanak fel a feszültségek.
2. **Szociális interakciók**: Bár természetesen beszélsz másokkal, érdemes lenne tudatosan gyakorolni a mélyebb kapcsolatok kialakítását.

### Hatások a jövőbeli kapcsolatokra
A pozitív önértékelés és a bizalom segíthet abban, hogy könnyen alakíts ki új kapcsolatokat, miközben a konfliktuskezelési készségeid fejlesztése biztosítja, hogy a jövőbeli kapcsolataid is stabilabbak legyenek. Az egészséges minták követésével elkerülheted a destruktív helyzeteket.

---

## 2. Szabotáló minták felismerése

### Destruktív minták
Annak ellenére, hogy jelenleg stabil kapcsolatban élsz, érdemes megfigyelni néhány gyakori destruktív mintát, amelyek a jövőben problémákat okozhatnak.

1. **Elkerülő magatartás**: Ha konfliktusok során hajlamos vagy a problémák elkerülésére, ez hosszú távon feszültséget szülhet.
2. **Önértékelés csökkenése**: Még ha most jól is vagy, a nehéz helyzetek során képes vagy megkérdőjelezni az értékedet.

### Kiváltó helyzetek
- **Tudatosan nehéz beszélgetések**: Amikor fontos témákról van szó (pl. pénz, jövő), hajlamos lehetsz elkerülni a szembenézést.
- **Feszültség a munkahelyen**: A munkahelyi stressz hatással lehet a párkapcsolatodra is, és feszültséget szülhet.

### Hogyan ismerheted fel ezeket
- **Reflexió**: Figyeld meg, hogyan reagálsz konfliktusokra. Készíthetsz egy naplót, ahol leírod a reakcióidat.
- **Gyakorlás**: Kérd meg a partnered, hogy segítsen az érzéseid kifejezésében, amikor feszültség támad.

---

## 3. 30 Napos Akcióterv

### 1. hét: Tudatosítás és megfigyelés
- **1. nap**: Készíts naplót a napi érzelmeidről és a kapcsolati dinamikáról. 📓
- **2. nap**: Figyeld meg a konfliktushelyzetekben való reakcióidat, és írd le azokat.
- **3. nap**: Beszélgess a partneredről arról, hogy mit érzel, és kérdezd meg őt is az érzéseiről. 🗣️
- **4. nap**: Nézz utána a konfliktuskezelési technikáknak; válassz ki egyet, amit a következő hetekben gyakorolni fogsz.

### 2. hét: Új szokások kialakítása
- **5. nap**: Készíts egy „konfliktus naplót”, ahol nyomon követed a problémákat és a megoldásokat. 📖
- **6. nap**: Minden nap gyakorolj egy új kommunikációs technikát, például az „én üzeneteket”.
- **7. nap**: Tarts egy heti „érzelmi kört” a partnereddel, ahol megosztjátok a tapasztalataitokat. 💬

### 3. hét: Kommunikációs készségek fejlesztése
- **8. nap**: Olvass el egy könyvet a hatékony kommunikációról. 📚
- **9. nap**: Tarts egy szünetet, amikor feszültséget érzel, és próbáld meg kifejezni az érzéseidet.
- **10. nap**: Kérdezd meg a partnered, mit szeretne, hogy jobban kifejezd az érzéseidet. 
- **11. nap**: Szánj időt a kapcsolatotok értékelésére, és írd le, mit szeretnétek közösen fejleszteni.

### 4. hét: Integráció és értékelés
- **12. nap**: Nézd át a konfliktus naplódat, és elemezd az előrehaladást. 🔄
- **13. nap**: Kérd meg a partnered, hogy adjon visszajelzést a kommunikációs fejlődésedről.
- **14. nap**: Készítsetek közösen egy jövőbeli tervet, amely tartalmazza a kapcsolatotok céljait.
- **15. nap**: Ünnepeljétek meg a fejlődéseteket egy közös program keretében! 🎉

---

## 4. Gyakorlati Eszköztár

### Napi rutinok és reflexiós kérdések
- **Reggel**: Mielőtt elkezded a napot, tölts el 5 percet meditációval vagy légzőgyakorlatokkal.
- **Este**: Tölts el időt a napod reflexiójával; írd le, mi ment jól és mi nem.

### Kommunikációs sablonok
- „Én úgy érzem, hogy...”
- „Azt szeretném, ha...”
- „Kérlek, mondd el, mit gondolsz erről...”

### Stresszkezelési technikák
- **Légzőgyakorlat**: 4-7-8 technika (4 másodperc belégzés, 7 másodperc visszatartás, 8 másodperc kilégzés).
- **Fizikai aktivitás**: Próbálj ki heti három alkalommal sportolni vagy sétálni a szabadban.

### Önbizalom építő gyakorlatok
- **Pozitív megerősítések**: Minden nap mondj magadnak három pozitív dolgot.
- **Új kihívások**: Tűzz ki magad elé kisebb célokat, amelyeket elérsz, hogy növeld az önbizalmadat.

---

## 5. Kapcsolati stratégiák

### Jelenlegi kapcsolatok javítása
- Legyél nyitott a kommunikációra, és oszd meg a félelmeidet a partnered előtt.
- Kérdezd meg, hogyan éli meg a kapcsolatot, és mit szeretne változtatni.

### Mit keressen új kapcsolatokban
- Olyan embereket, akik hasonló értékeket és célokat képviselnek.
- Akitől inspirációt meríthetsz a fejlődésedhez.

### Konfliktuskezelési tippek
- Ne hagyd, hogy a feszültség felhalmozódjon; beszélj a problémákról, amint felmerülnek.
- Használj „én üzeneteket”, hogy kifejezd az érzéseidet anélkül, hogy a másik felet támadnád.

### Határok kijelölése
- Határozd meg, mi az, ami számodra elfogadható, és tudasd a partnereddel.
- Ne félj nemet mondani, ha valami nem megfelelő számodra.

---

## 6. Bónusz tartalom

### Ajánlott olvasnivalók
- „Az érzelmi intelligencia” - Daniel Goleman
- „A hatékony kommunikáció művészete” - Dale Carnegie

### Meditációs és légzőgyakorlatok
- **Meditáció**: Próbálj ki napi 10 perc csendes meditációt.
- **Légzőgyakorlatok**: Koncentrálj a légzésedre, és próbálj meg mindent elengedni.

### Motivációs tippek
- Ne feledd, hogy a fejlődés egy folyamat, és minden kis lépés számít. 🌱
- Ünnepeld meg a kis győzelmeket, és légy türelmes önmagaddal.

Suti, remélem, hogy ez az akcióterv segít neked a párkapcsolatod megerősítésében és a jövőbeni fejlődésedben. Ne feledd, hogy minden nap egy új lehetőség a tanulásra és a növekedésre! 💪❤️', 'premium', '2025-08-07 11:38:13.616+00', '2025-08-07 11:38:13.657596+00'),
	('66c495ec-cfd0-4ce4-8f0b-078554222e81', 'b64db0a0-6b2f-4bc2-9dca-7c63c8f08d44', 'cs_test_a1buh48dFhNri0MV4j0aav1IegZznMks4U8tG0H1SNlgS2blVFD6n3r0wg', '# Személyre szabott Akcióterv Suti számára

Kedves Suti! 🌟

Örömmel segítek neked egy részletes akciótervvel, amely segít a párkapcsolati mintáid tudatosításában, fejlesztésében és a jövőbeni kapcsolataid erősítésében. Lépjünk be együtt ebbe az izgalmas folyamatba!

## 1. Személyiséganalízis

### Párkapcsolati minták

A válaszaid alapján úgy tűnik, hogy magabiztosan és egészségesen viszonyulsz a párkapcsolathoz. Ritkán érzed úgy, hogy nem vagy elég jó a partnered számára, ami azt jelzi, hogy pozitív önértékeléssel rendelkezel. Azt is természetesnek tartod, hogy a partnered másokkal is kommunikál, ami nyitottságot és bizalmat tükröz a kapcsolatban. Ez az attitűd erős alapja lehet a kapcsolati dinamikádnak.

### Erősségek

- **Magabiztosság**: Az önértékelésed jónak tűnik, ami segít abban, hogy egészséges határokat állíts fel.
- **Nyitottság**: A partnered baráti kapcsolatai iránti megértésed elősegíti a bizalmat és a kommunikációt.
- **Stabilitás**: A konfliktus utáni kérdőjelezés elkerülése a kapcsolat stabilitására utal.

### Fejlesztendő területek

- **Saját érzések figyelembe vétele**: Fontos, hogy a jövőbeli nehéz helyzetekben ne hagyd figyelmen kívül a saját szükségleteidet.
- **Kommunikációs készségek**: Még ha a kapcsolat stabil is, a kommunikáció folyamatos fejlesztése elengedhetetlen.

### Hatások a kapcsolatokra

Ezek a minták segíthetnek abban, hogy a kapcsolatod stabil és boldog legyen, de fontos, hogy tudatosan figyelj a saját érzéseidre is. Ha képes vagy kifejezni, amit érzel, az még inkább megerősíti a kapcsolatotokat.

---

## 2. Szabotáló minták felismerése

### Destruktív minták

Bár a válaszaid alapján nem tűnik úgy, hogy jelenleg komolyabb szabotáló minták lennének a kapcsolatodban, érdemes figyelni a következőkre:

- **Önbizalomhiány**: Ha valaha úgy érzed, hogy nem vagy elég jó, az a kapcsolat dinamikáját negatívan befolyásolhatja.
- **Túlzott aggodalom**: A másokkal való kommunikáció miatt érzett aggodalom feszültséget okozhat.

### Kiváltó helyzetek

- **Konfliktusok utáni érzések**: Ha a konfliktus után kétségeid támadnak, figyelj arra, hogy hogyan reagálsz.
- **Mások véleménye**: Ha mások véleménye befolyásolja az érzéseidet a kapcsolatoddal kapcsolatban.

### Hogyan ismerd fel ezeket a jövőben

- **Önelemzés**: Minden konfliktus után tedd fel magadnak a kérdést: "Miért érzem ezt, és mi váltotta ki?"
- **Reflexió**: Írd le az érzéseidet és gondolataidat, hogy könnyebben észre tudd venni a mintákat.

---

## 3. 30 napos akcióterv

### 1. hét: Tudatosítás és megfigyelés 

- **Napi napló**: Írj naponta a kapcsolataidról, érzéseidről és a napi eseményekről.
- **Érzések azonosítása**: Minden nap szánj időt arra, hogy azonosítsd, mit érzel különböző helyzetekben.
- **Kérdések**: Tedd fel magadnak: "Milyen hatással van rám, amikor a partnerem másokkal beszél?"

### 2. hét: Új szokások kialakítása

- **Pozitív megerősítés**: Minden reggel mondj el 3 dolgot, amiért hálás vagy a kapcsolatodban.
- **Határok kijelölése**: Beszélj a partnerednek az érzéseidről, és állítsatok fel közösen határokat.
- **Képzés**: Olvass el egy könyvet a párkapcsolati kommunikációról.

### 3. hét: Kommunikációs készségek fejlesztése

- **Aktív hallgatás**: Gyakorolj aktívan hallgatni, amikor a partnered beszél, és próbálj meg válaszolni az érzéseire.
- **Kifejezés**: Minden héten ossz meg a partnereddel egy érzést vagy gondolatot, amit eddig nem mondtál el.
- **Konfliktuskezelés**: Tanulj meg egy új konfliktuskezelési technikát, és alkalmazd a következő vitátok során.

### 4. hét: Integráció és értékelés

- **Visszatekintés**: Nézd át a naplódat, és azonosítsd a fejlődéseidet és az esetleges nehézségeket.
- **Értékelés**: Beszélj a partnerednek az elmúlt hónap tapasztalatairól.
- **Tervkészítés**: Készítsetek együtt egy hosszú távú tervet a kapcsolatotok további fejlesztésére.

---

## 4. Gyakorlati eszköztár

### Napi rutinok és reflexiós kérdések

- **Reggeli rutin**: Mielőtt elkezded a napod, szánj 5 percet a légzőgyakorlatokra, hogy fókuszálj.
- **Reflexiós kérdések**: "Mit tanultam ma a kapcsolatomból?", "Milyen érzéseket váltottak ki belőlem a mai események?"

### Kommunikációs sablonok

- **Kifejezés**: "Amikor [helyzet], akkor én [érzés] érzem, mert [ok]."
- **Kérdezés**: "Hogyan érezted magad, amikor [helyzet] történt?"

### Stresszkezelési technikák

- **Meditáció**: Naponta 10 perc meditáció a stressz csökkentésére.
- **Fizikai aktivitás**: Rendszeres testmozgás, például heti 3-szor 30 perc séta vagy sport.

### Önbizalom építő gyakorlatok

- **Pozitív megerősítések**: Minden nap mondj el 3 pozitív dolgot magadról.
- **Célok kitűzése**: Készíts egy listát a céljaidról, és dolgozz rajtuk lépésről lépésre.

---

## 5. Kapcsolati stratégiák

### Hogyan javítsd a jelenlegi kapcsolataidat

- **Nyitott kommunikáció**: Rendszeresen beszéljétek át a kapcsolatotokat, hogy mindig tudjátok, hol álltok.
- **Közös programok**: Tervezettek közös programokat, hogy elmélyítsétek a kapcsolatot.

### Mit keress új kapcsolatokban

- **Közös értékek**: Győződj meg róla, hogy a leendő partnered hasonló értékekkel rendelkezik.
- **Nyitottság**: Olyan partnert keress, aki nyitott a kommunikációra és a fejlődésre.

### Konfliktuskezelési tippek

- **Higgadt hozzáállás**: Mielőtt reagálnál, szánj egy kis időt az érzéseid feldolgozására.
- **Megértés**: Próbáld meg megérteni a partnered nézőpontját, mielőtt kifejeznéd a sajátodat.

### Határok kijelölése

- **Beszélj nyíltan**: Kifejezd, hol vannak a határaid, és figyelj a partnered határaira is.
- **Közös megbeszélés**: Rendszeresen beszéljétek át, hogy milyen határokat állítottatok fel, és szükség esetén módosítsátok őket.

---

## 6. Bonusz tartalom

### Ajánlott olvasnivalók és források

- **"A párkapcsolatok művészete"** - John Gottman
- **"Két lépés a szeretet felé"** - Gary Chapman

### Meditációs és légzőgyakorlatok

- **5-4-3-2-1 technika**: Az érzékszerveid segítségével térj vissza a jelenbe (5 dolog, amit látsz, 4 dolog, amit hallasz, stb.).
- **Légzőgyakorlat**: Lélegezz be 4 másodpercig, tartsd bent 4 másodpercig, majd lélegezz ki 4 másodpercig.

### Motivációs tippek a nehéz időszakokra

- **Emlékeztesd magad**: Írj egy levelet a jövőbeli önmagadnak, amelyben bátorítod őt, hogy a nehéz időkben is kitartson.
- **Jutalmazás**: Minden apró siker után jutalmazd meg magad valamivel, ami örömet okoz.

---

Kedves Suti, remélem, hogy ez az akcióterv segít a párkapcsolati fejlődésedben! Ne feledd, hogy a fejlődés folyamata nem mindig egyszerű, de a kitartásod és az önismereted által elérheted a céljaidat. Ha bármilyen kérdésed van, vagy további támogatásra van szükséged, ne habozz keresni! 💪❤️

---

Kiskacsa fürdik', 'premium', '2025-08-07 11:47:46.553+00', '2025-08-07 11:47:46.602427+00'),
	('7658b9d4-0312-40b9-9fa0-09f2979ef477', '9e6c894e-9631-4345-9b56-6e05378eaae8', 'cs_live_a1Dulx2RdQb1GAlQii3sp8N9BuEZ6aseYKeEFLW10pqt55z1nq4vRlZEQU', '# Személyre szabott Akcióterv Suti számára 🌟

## 1. Személyiségelemzés 🔍

Kedves Suti! Örömmel látom, hogy érdeklődsz a párkapcsolati dinamikák iránt. A kvíz válaszaid alapján egyértelmű, hogy stabil önértékeléssel rendelkezel, hiszen soha nem érzed úgy, hogy nem vagy elég jó a partnered számára. Ez az önbizalom nagyszerű alap a kapcsolatokhoz, és azt jelzi, hogy képes vagy egészséges határokat húzni és értékelni saját magadat.

### Erősségek:
- **Önbizalom:** Azt mutatja, hogy tisztában vagy az értékeiddel, és nem engeded, hogy mások véleménye befolyásolja az önértékelésedet.
- **Stabilitás:** Képes vagy fenntartani a mentális stabilitást a kapcsolataidban, ami segíti a konfliktusok egészséges kezelését.

### Fejlesztendő területek:
- **Önreflexió:** Érdemes mélyebben megvizsgálnod, hogy a "soha" válasz mögött nincsenek-e elnyomott érzések vagy kétségek. Esetleg érdemes lehet naplót vezetni az érzéseidről és gondolataidról.
- **Kommunikációs készségek:** Még ha jól is érzed magad a bőrödben, fontos, hogy nyitottan tudj beszélni a szükségleteidről és érzéseidről a partnered előtt.

### Hatások a kapcsolatokra:
Jelenlegi és jövőbeli kapcsolataidban ez a stabil önértékelés segíthet abban, hogy ne engedd meg, hogy mások manipuláljanak vagy érzelmileg bántsanak. Azonban figyelned kell arra, hogy ne zárkózz el az érzéseid elől, mert ez a jövőbeli konfliktusok forrása lehet.

---

## 2. Szabotáló minták felismerése ⚠️

Suti, az önbizalom ellenére is érdemes észben tartanod, hogy a kapcsolatainkban rejlő destruktív minták bármikor felüthetik a fejüket. Íme néhány lehetséges példa:

### Konkrét példák:
- **Elkerülés:** Ha kényelmetlenül érzed magad egy helyzetben, könnyen elkerülheted a beszélgetéseket vagy a konfliktusokat, ami a problémák elhúzódásához vezethet.
- **Túlzott megfelelés:** Bár nem érzed, hogy nem vagy elég jó, lehet, hogy hajlamos vagy túlságosan alkalmazkodni másokhoz, hogy elkerüld a konfliktusokat.

### Kiváltó helyzetek:
- Intenzív érzelmi beszélgetések, ahol a partnered kifejezheti a kritikáit.
- Olyan szituációk, ahol a saját határaidat kellene megvédened.

### Hogyan ismerheti fel ezeket:
- **Önmegfigyelés:** Figyeld meg, hogyan reagálsz különböző helyzetekre. Naplózz, amikor elkerülöd a beszélgetéseket, vagy amikor úgy érzed, hogy nem vagy elég jó.
- **Érzelmi állapotok:** Ha stresszes vagy, próbáld meg kideríteni, mi váltotta ki az érzéseidet, és hogy ez hogyan befolyásolja a kommunikációdat.

---

## 3. 30 napos akcióterv 📅

### 1. Hét: Tudatosítás és megfigyelés
- **Nap 1:** Kezdj naplót írni az érzéseidről és a közelmúltbeli kapcsolati interakcióidról.
- **Nap 3:** Figyeld meg, mikor érzed magad kényelmetlenül egy beszélgetés során, és írd le az érzéseid.
- **Nap 5:** Készíts listát azokról a helyzetekről, ahol hajlamos vagy elkerülni a konfrontációt.
- **Nap 7:** Tarts egy önértékelő beszélgetést egy barátoddal, és kérdezd meg őt az érzéseiről veled kapcsolatban.

### 2. Hét: Új szokások kialakítása
- **Nap 8:** Válassz ki egy helyzetet, ahol eddig elkerülted a kommunikációt, és határozd el, hogy nyíltan beszélsz róla.
- **Nap 10:** Gyakorolj egy 5-10 perces napi reflektálást, ahol átgondolod a nap eseményeit.
- **Nap 12:** Készítsd el a „megoldási lehetőségek” listádat, ahol leírod, hogyan tudnál hatékonyan válaszolni egy konfliktushelyzetre.
- **Nap 14:** Gyakorolj egy új kommunikációs technikát, például az „én-üzeneteket”.

### 3. Hét: Kommunikációs készségek fejlesztése
- **Nap 15:** Olvass el egy cikket a hatékony kommunikációról, és írd le a legfontosabb szempontokat.
- **Nap 17:** Tarts egy nyílt beszélgetést a partnered vagy egy közeli baráttal a te érzéseidről.
- **Nap 19:** Kérj visszajelzést a kommunikációdra, és figyeld meg, milyen érzéseket vált ki belőled.
- **Nap 21:** Készíts egy „pozitív megerősítések” listát, amelyet naponta elmondasz magadnak.

### 4. Hét: Integráció és értékelés
- **Nap 22:** Írd le, hogy milyen változásokat tapasztaltál az elmúlt hetekben.
- **Nap 24:** Készíts egy akciótervet a következő hónapra, amiben a tapasztalataid alapján új célokat tűzöl ki.
- **Nap 26:** Beszélj a partnerednek a fejlődésedről, és kérdezd meg, ő hogyan látja a helyzetet.
- **Nap 30:** Tarts egy önértékelő beszélgetést, és ünnepeld meg a sikereidet!

---

## 4. Gyakorlati eszköztár 🛠️

### Napi rutinok és reflexiós kérdések:
- **Reggeli rutin:** Mielőtt elkezdenéd a napodat, végezz egy 5 perces meditációt, ahol összpontosítasz az önértékelésedre.
- **Reflexiós kérdések:** 
  - Milyen érzéseket tapasztaltam ma a kapcsolataim során?
  - Milyen helyzeteket kerültem el, és miért?

### Kommunikációs sablonok és mondatok:
- „Én úgy érzem, hogy…”
- „Szeretném, ha…”
- „Nehéz volt számomra, amikor…”

### Stresszkezelési technikák:
- **Légzőgyakorlatok:** Inhale, hold, exhale – 4-4-4 taktusban.
- **Fizikai aktivitás:** Válassz ki egy sportágat, amit szeretsz, és heti 3 alkalommal végezd.

### Önbizalom építő gyakorlatok:
- **Pozitív napló:** Minden este írj le három dolgot, amire büszke vagy a nap során.
- **Kreatív tevékenységek:** Fedezd fel a rajzolás, festés vagy írás örömét, hogy kifejezhesd az érzéseidet.

---

## 5. Kapcsolati stratégiák 🤝

### Hogyan javítsd jelenlegi kapcsolataidat:
- **Nyitott kommunikáció:** Mindig tartsd szem előtt, hogy fontos a nyílt és őszinte beszélgetés a szükségleteidről.
- **Határok kijelölése:** Ne félj megosztani a határaidat, és kommunikálj azokról a dolgokról, amik számodra fontosak.

### Mit keress új kapcsolatokban:
- **Támogató partner:** Olyan embert keress, aki támogatja az önfejlődésedet, és akivel képes vagy nyíltan kommunikálni.
- **Közös értékek:** Figyelj arra, hogy a közös értékek és célok jelen legyenek a kapcsolatban.

### Konfliktuskezelési tippek:
- **Aktív hallgatás:** Figyelj arra, amit a partnered mond, és próbálj meg empatikusan reagálni.
- **„Én-üzenetek” használata:** Beszélj az érzéseidről, ne a másik fél hibáztatásáról.

### Határok kijelölése:
- **Határok tisztelete:** Mindkét félnek tiszteletben kell tartania a másik határait, és közösen kell dolgozniuk a jó kommunikáció érdekében.

---

## 6. Bonus tartalom 🎁

### Ajánlott olvasnivalók és források:
- „A szeretet nyelvei” – Gary Chapman
- „Könnyű kommunikáció” – Marshall B. Rosenberg

### Meditációs és légzőgyakorlatok:
- **Meditáció a jelenben:** Képzeld el, hogy a légzésed minden egyes szívverésével egyre nyugodtabb leszel.
- **Légzőgyakorlat:** Számolj 4-ig belégzés közben, tartsd bent 4 másodpercig, majd számolj 4-ig kilégzés közben.

### Motivációs tippek a nehéz időszakokra:
- **Saját mantra:** Használj egy személyes mantrát, például: „Minden nap fejlődöm és tanulok.”
- **Pozitív környezet:** Töltsd az idődet olyan emberekkel, akik inspirálnak és támogatnak.

---

Kedves Suti, remélem, hogy ez az akcióterv segít abban, hogy tudatosabban élj a kapcsolataidban, és hogy fejlődj a személyes utadon! Ne feledd, hogy ez egy folyamatos folyamat, és a legfontosabb, hogy tartsd szem előtt a saját értékeidet és szükségleteidet. 💪✨

---

Kiskacsa fürdik', 'premium', '2025-08-07 17:00:06.004+00', '2025-08-07 17:00:06.193337+00');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."questions" ("id", "question_text", "question_type", "options", "order_index", "is_active", "created_at", "updated_at") VALUES
	(202, 'Milyen gyakran érzed úgy, hogy nem vagy elég jó a partnered számára?', 'multiple_choice', '"[\"Soha\",\"Ritkán\",\"Időnként\",\"Gyakran\",\"Mindig\"]"', 1, true, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(203, 'Hogyan reagálsz, amikor a partnered mással beszélget?', 'multiple_choice', '"[\"Természetesnek tartom\",\"Kicsit féltékeny vagyok\",\"Nagyon zavarja\",\"Dühös leszek\",\"Pánikba esem\"]"', 2, true, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(204, 'Milyen gyakran kérdőjelezed meg a kapcsolatotokat konfliktus után?', 'multiple_choice', '"[\"Soha\",\"Ritkán\",\"Időnként\",\"Gyakran\",\"Mindig\"]"', 3, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(205, 'Hogyan viselkedsz, amikor félsz attól, hogy a partnered elhagy?', 'text', NULL, 4, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(206, 'Mennyire hajlamos vagy arra, hogy visszavonulj, amikor problémák vannak?', 'multiple_choice', '"[\"Egyáltalán nem\",\"Ritkán\",\"Időnként\",\"Gyakran\",\"Mindig\"]"', 5, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(207, 'Mit teszel, amikor úgy érzed, hogy túl közel kerültél valakihez?', 'text', NULL, 6, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(208, 'Milyen gyakran kritizálod magad egy veszekedés után?', 'multiple_choice', '"[\"Soha\",\"Ritkán\",\"Időnként\",\"Gyakran\",\"Mindig\"]"', 7, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(209, 'Hogyan reagálsz, amikor a partnered időt akar tölteni a barátaival?', 'multiple_choice', '"[\"Támogatom\",\"Kicsit féltékeny vagyok\",\"Nagyon zavarja\",\"Megpróbálom megakadályozni\",\"Veszekedést indítok\"]"', 8, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(210, 'Milyen gyakran érzed úgy, hogy mindent el fogsz rontani?', 'multiple_choice', '"[\"Soha\",\"Ritkán\",\"Időnként\",\"Gyakran\",\"Mindig\"]"', 9, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(211, 'Mit csinálsz, amikor boldognak érzed magad a kapcsolatban?', 'text', NULL, 10, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(212, 'Mennyire hajlamos vagy arra, hogy a múlt hibáit folyton emlegeted?', 'multiple_choice', '"[\"Egyáltalán nem\",\"Ritkán\",\"Időnként\",\"Gyakran\",\"Mindig\"]"', 11, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(213, 'Hogyan viselkedsz, amikor úgy érzed, hogy elveszted a kontrollt?', 'text', NULL, 12, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(214, 'Milyen gyakran hasonlítod össze magad mások partnereivel?', 'multiple_choice', '"[\"Soha\",\"Ritkán\",\"Időnként\",\"Gyakran\",\"Mindig\"]"', 13, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(215, 'Mit teszel, amikor a partnered nem válaszol azonnal az üzeneteidre?', 'multiple_choice', '"[\"Várok türelmesen\",\"Kicsit aggódom\",\"Sokat gondolkodom rajta\",\"Több üzenetet küldök\",\"Pánikba esem\"]"', 14, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(216, 'Mennyire nehéz számodra megbocsátani a kapcsolatban?', 'multiple_choice', '"[\"Egyáltalán nem nehéz\",\"Kicsit nehéz\",\"Közepesen nehéz\",\"Nagyon nehéz\",\"Szinte lehetetlen\"]"', 15, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(217, 'Hogyan kezeled, amikor úgy érzed, hogy túl függő vagy a partneridtől?', 'text', NULL, 16, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(218, 'Milyen gyakran érzed úgy, hogy mások boldogabbak a kapcsolatukban?', 'multiple_choice', '"[\"Soha\",\"Ritkán\",\"Időnként\",\"Gyakran\",\"Mindig\"]"', 17, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(219, 'Mit csinálsz, amikor félsz az intimitástól?', 'text', NULL, 18, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(220, 'Mennyire hajlamos vagy arra, hogy a legrosszabbra gondolj?', 'multiple_choice', '"[\"Egyáltalán nem\",\"Ritkán\",\"Időnként\",\"Gyakran\",\"Mindig\"]"', 19, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00'),
	(221, 'Mi a legnagyobb félelmeid a párkapcsolatokban?', 'text', NULL, 20, false, '2025-08-07 16:37:45.903938+00', '2025-08-07 16:37:45.903938+00');


--
-- Data for Name: quiz_ai_prompts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_ai_prompts" ("id", "quiz_id", "lang", "ai_prompt", "fallback_results", "created_at", "updated_at") VALUES
	('1ef1adc6-a001-4316-892a-a8862705eb5b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'Te egy tapasztalt klinikai pszichológus vagy, aki ADHD diagnosztikával és kezeléssel foglalkozik. A felhasználó kitöltött egy ADHD tünetek felmérésére szolgáló kérdőívet.

Az eredmények alapján adj személyre szabott, empatikus és szakmailag megalapozott visszajelzést. Hangsúlyozd, hogy ez nem orvosi diagnózis, csak egy kezdeti felmérés.

Használj barátságos, de szakszerű hangnemet. Tartalmazza a válaszod:
1. Az eredmények rövid összefoglalását
2. A főbb területeket, ahol tünetek mutatkoznak
3. Gyakorlati tanácsokat a mindennapi élethez  
4. Ajánlást szakorvosi konzultációra, ha indokolt

A felhasználó eredményei: {attention_score} pont figyelmi nehézségek, {hyperactivity_score} pont hiperaktivitás, {impulsivity_score} pont impulzivitás.

Válaszolj HTML formátumban, használj <h3> címeket és <p> bekezdéseket.', '[{"html": "<h3>Alacsony kockázat</h3><p>Az eredmények alapján kevés ADHD tünet mutatkozik. Folytassa jelenlegi életvitelét és forduljon orvoshoz, ha tünetek változnak.</p>", "score_range": [0, 10]}, {"html": "<h3>Közepes kockázat</h3><p>Néhány ADHD tünet jelen van. Érdemes megfigyelni a tüneteket és szakorvosi konzultációt fontolni.</p>", "score_range": [11, 20]}, {"html": "<h3>Magas kockázat</h3><p>Számos ADHD tünet mutatkozik. Javasoljuk szakorvosi vizsgálatot a pontos diagnózis érdekében.</p>", "score_range": [21, 72]}]', '2025-08-15 07:26:17.267975+00', '2025-08-15 07:26:17.267975+00'),
	('24482bde-bbc9-4979-9dbd-a0044d5f4dcd', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'You are an experienced clinical psychologist specializing in ADHD diagnostics and treatment. The user has completed a questionnaire designed to assess ADHD symptoms.

Based on the results, provide personalized, empathetic, and professionally grounded feedback. Emphasize that this is not a medical diagnosis, just an initial assessment.

Use a friendly but professional tone. Include in your response:
1. Brief summary of results
2. Main areas where symptoms are present
3. Practical advice for daily life
4. Recommendation for medical consultation if appropriate

User results: {attention_score} points attention difficulties, {hyperactivity_score} points hyperactivity, {impulsivity_score} points impulsivity.

Respond in HTML format using <h3> headers and <p> paragraphs.', '[{"html": "<h3>Low Risk</h3><p>Based on the results, few ADHD symptoms are present. Continue your current lifestyle and consult a doctor if symptoms change.</p>", "score_range": [0, 10]}, {"html": "<h3>Moderate Risk</h3><p>Some ADHD symptoms are present. Consider monitoring symptoms and consulting a healthcare professional.</p>", "score_range": [11, 20]}, {"html": "<h3>High Risk</h3><p>Multiple ADHD symptoms are present. We recommend professional medical evaluation for accurate diagnosis.</p>", "score_range": [21, 72]}]', '2025-08-15 07:26:17.267975+00', '2025-08-15 07:26:17.267975+00');


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_attempts" ("id", "user_name", "user_email", "user_age", "user_relationship_status", "status", "created_at", "updated_at", "submission_id", "user_gender") VALUES
	('04047eb8-1631-4345-b206-94ee94ee4d4b', 'Suti', 'suti@segitettem.hu', 36, NULL, 'complete', '2025-08-07 09:18:58.274107+00', '2025-08-07 09:19:01.808955+00', 'ae7c2340-bd00-4074-902d-83a3df7aa22d', NULL),
	('9c936982-58e7-44b1-95a6-b0331ea129b2', 'Suti', 'suti@segitettem.hu', 36, 'relationship', 'complete', '2025-08-06 10:47:52.046057+00', '2025-08-06 10:49:20.494222+00', '9075514f-0646-49c7-a50a-9847075aed34', NULL),
	('5de2bea7-beb9-4bc1-ba52-e9309dab17d9', 'suti', 'suti@segitettem.hu', 34, NULL, 'complete', '2025-08-07 09:25:40.15351+00', '2025-08-07 09:25:53.490493+00', 'f1c1da90-6200-4f24-916e-d8fd07b125ee', NULL),
	('0752acf8-1a09-4cde-80e8-1ac3c0597dc5', 'Stui', 'laszlo.s.szabo@ecomxpert.hu', 36, 'dating', 'complete', '2025-08-06 11:00:50.990722+00', '2025-08-06 11:47:37.446676+00', 'a482e07f-a295-4fb7-a51d-cdd78be63112', NULL),
	('0b7ba977-0c7e-468e-9573-d4badeaac8eb', 'teszt', 'teszt@teszt', 35, 'dating', 'incomplete', '2025-08-06 11:47:53.375125+00', '2025-08-06 11:47:53.375125+00', NULL, NULL),
	('fd4e0a62-db91-4f7b-a147-d7d6443ca668', 'dede', 'de', 34, 'dating', 'incomplete', '2025-08-06 11:52:49.128871+00', '2025-08-06 11:52:49.128871+00', NULL, NULL),
	('4164dd2d-10ec-4a4d-a68a-204e7279109d', '43', '43', 4, 'single', 'complete', '2025-08-06 11:53:11.931006+00', '2025-08-06 11:53:16.129574+00', '3d7cbf87-ebbf-43aa-ab73-17a34107270b', NULL),
	('15e17f22-2124-4d12-8741-dbce6a3797a3', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 37, 'dating', 'complete', '2025-08-07 09:48:39.649017+00', '2025-08-07 09:48:44.764677+00', '69eba058-dce3-4fb9-8202-dce7c690e7fb', NULL),
	('e29a30eb-28c7-4178-8ca9-4e0679ad55da', '43', '43', 43, 'dating', 'complete', '2025-08-06 11:56:34.154616+00', '2025-08-06 12:05:18.639499+00', 'c2506e6c-bdac-4239-bd51-46a8968ee21f', NULL),
	('4e7c4be6-9ee3-4534-92aa-683c7ae0e8ed', '323', '32', 32, 'relationship', 'complete', '2025-08-06 12:16:13.206512+00', '2025-08-06 12:16:17.304893+00', '0d9b8b8a-8a46-4dba-b99f-62505cb980dd', NULL),
	('8d957616-2a1a-429e-8c55-46529f528b0e', '3', '43', 183, 'dating', 'incomplete', '2025-08-06 12:21:02.954342+00', '2025-08-06 12:21:02.954342+00', NULL, NULL),
	('4db4890a-0aed-4bda-8535-85d57b6add18', '43', '43', 43, 'dating', 'complete', '2025-08-06 12:21:20.626145+00', '2025-08-06 12:21:24.061296+00', 'f174515f-c0b9-4097-b6e7-a78dc68ff812', NULL),
	('18c05d32-8b1d-4f25-8e6d-5ee42ddd14a8', '43', '43', 34, 'single', 'complete', '2025-08-06 12:21:43.809969+00', '2025-08-06 12:21:46.931761+00', '44c41fcd-ac33-4656-aca5-4e686c6705b1', NULL),
	('d7ebd4c4-41b6-4ac3-bb62-8458ecc68298', '43', '43', 43, 'dating', 'complete', '2025-08-06 12:33:38.065423+00', '2025-08-06 12:33:42.036447+00', '03c043a2-391f-43cf-8620-9fa3a5ec3564', NULL),
	('0478ff3a-475d-41b3-a24c-aa869fd18a07', '43', 'suti@segitettem.hu', 35, 'dating', 'complete', '2025-08-06 12:52:22.614203+00', '2025-08-06 12:52:43.074068+00', '235b7a15-e500-4e38-8da6-760bb880855d', NULL),
	('5039dd23-1788-4a01-853e-53698fed517d', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'married', 'complete', '2025-08-06 13:13:21.438041+00', '2025-08-06 13:13:30.293858+00', '26282a72-8e04-464b-afc6-82f411c4edf1', NULL),
	('4586a084-4c11-4d84-b869-c74ddc15454e', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'relationship', 'complete', '2025-08-06 13:19:37.416141+00', '2025-08-06 13:19:41.541807+00', '36dadf12-b66d-45d4-9e2e-f12d38633e3d', NULL),
	('4f4b4dea-4838-4e65-ac01-7b267d80796d', 'Kriszti', 'mullerkriszti335@gmail.com', 25, 'relationship', 'complete', '2025-08-06 13:54:53.739469+00', '2025-08-06 13:55:15.716104+00', 'f6e075b0-95b4-4573-a1d7-de2aa3771f1b', NULL),
	('0fe57f30-4ec3-47b5-9553-c878e198fd23', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'relationship', 'complete', '2025-08-06 14:08:26.59597+00', '2025-08-06 14:08:31.250577+00', 'cca42479-991f-47d9-afb5-e5c21377b1f1', NULL),
	('3ce3e801-b995-4d38-8c19-654f14a4eaaf', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'dating', 'complete', '2025-08-06 14:36:12.720608+00', '2025-08-06 14:36:17.065074+00', 'a1fe50e4-4692-45d7-9586-fdb0d97740ee', NULL),
	('f25f74a3-7f2b-42a2-bc4c-8ce155ae657d', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 34, 'dating', 'complete', '2025-08-06 14:37:50.992523+00', '2025-08-06 14:37:54.94518+00', '8a0051a8-81a7-4516-8c66-23c261166f93', NULL),
	('bf1c1ea0-fb10-487d-b22a-3b4fa7f21b9a', 'Stui', 'suti@segitettem.hu', 36, NULL, 'complete', '2025-08-06 15:30:17.611496+00', '2025-08-06 15:30:22.088951+00', '5c3645a1-39f0-45e3-9d7c-c05168363013', NULL),
	('211fa8a6-6678-460c-9f98-5d51fdc70b4c', 'Bél', 'suti@segitettem.hu', 37, NULL, 'complete', '2025-08-06 15:35:39.401022+00', '2025-08-06 15:35:43.345871+00', '19870241-1a49-4e93-bd47-510f60bfafc0', NULL),
	('3c871d02-dc8a-4bf5-9c6e-fe9017998be3', 'Suti', 'suti@segitettem.hu', 37, 'relationship', 'complete', '2025-08-06 18:25:46.978342+00', '2025-08-06 18:25:51.45213+00', 'a89ba6af-50d0-40bf-8176-363db935089a', NULL),
	('4b8c37c1-d41b-44d8-a7bd-73849ee19be0', 'Sut', 'ed@dd.hu', NULL, NULL, 'incomplete', '2025-08-06 18:42:58.33826+00', '2025-08-06 18:42:58.33826+00', NULL, NULL),
	('f5de6ca1-f250-443e-a83e-94fe3224e648', 'Sui', 'suti@segitettem.hu', 36, 'relationship', 'complete', '2025-08-07 06:22:09.29037+00', '2025-08-07 06:22:19.455739+00', '1882a205-3d05-4d5e-bca9-3d975f31a9e4', NULL),
	('6d2a1128-69fc-457e-aadd-4917709eca7d', 'suti', 'suti@segittt.hu', 35, NULL, 'complete', '2025-08-07 06:27:43.759794+00', '2025-08-07 06:27:47.669139+00', '56f9265a-0874-4bac-9e77-4fbe7b961539', NULL),
	('070de65c-126e-4d7d-8bde-055056b30072', 'Suti', 'suti@segitettem.hu', 36, 'dating', 'complete', '2025-08-07 07:53:17.569046+00', '2025-08-07 07:53:21.552165+00', 'e6e7d60e-a407-4cc8-8c75-3730c8a867fb', NULL),
	('df7d9d08-38d3-45e9-9e3b-859e5810def3', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 37, 'divorced', 'complete', '2025-08-07 08:20:22.348219+00', '2025-08-07 08:20:37.921794+00', '6bad892a-32d1-4baa-931c-4b29ae7d2a73', NULL),
	('54f4d03a-b57b-4d30-978d-9d4eabe351df', 'suti', 'laszlo.s.szabo@ecomxpert.hu', 33, NULL, 'complete', '2025-08-07 08:31:33.990572+00', '2025-08-07 08:31:38.06957+00', 'dde04a6c-8d6b-4c98-846f-a7a6ab38a8fb', NULL),
	('36ec16d0-a375-41f9-9963-5d9d9ae1a592', 'Suti', 'suti@segitettem.hu', 36, 'relationship', 'complete', '2025-08-07 08:52:00.119135+00', '2025-08-07 08:52:13.677367+00', 'b36f6913-f5f6-4e89-a399-05d608147529', NULL),
	('f7520e51-59e3-4a35-b439-1768010688dd', 'suti', 'suti@segitettem.hu', 434, NULL, 'complete', '2025-08-07 09:04:12.774528+00', '2025-08-07 09:04:16.553869+00', '810a0af2-822c-48d3-9041-255a5c583ffd', NULL),
	('f6c92ec0-d491-4fde-aea1-e3716d2bc7a1', 'Suti', 'suti@segitettem.hu', 39, NULL, 'complete', '2025-08-07 09:56:59.254622+00', '2025-08-07 09:57:03.025003+00', '3cd24171-c50c-4eae-8c8a-b5cd91e37472', NULL),
	('0c0444b3-2f46-4561-9445-bdcb1b592832', 'Laci', 'suti@segitettem.hu', 39, 'relationship', 'complete', '2025-08-07 10:00:07.896935+00', '2025-08-07 10:00:11.894433+00', '1cb4a64d-ca6a-4f1e-be55-a5bf14978032', NULL),
	('d92b592c-1b65-4db2-a583-9bbc4e222a2e', 'Suti', 'suti@segitettem.hu', 37, NULL, 'complete', '2025-08-07 10:13:42.650546+00', '2025-08-07 10:13:45.947037+00', '871cc7b5-ef05-4a71-9150-e05dc5846113', NULL),
	('21faf750-748a-4488-9a60-354c2c5d10e4', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, 'relationship', 'complete', '2025-08-07 11:36:55.949075+00', '2025-08-07 11:36:59.885935+00', '1e87e016-6628-4fbc-9fab-6c346d1d8e17', NULL),
	('23dcb6b1-25bb-4933-8ef2-3fff088c33f8', 'Suti', 'laszlo.s.szabo@ecomxpert.hu', 36, NULL, 'complete', '2025-08-07 11:46:36.618064+00', '2025-08-07 11:46:40.891029+00', 'b64db0a0-6b2f-4bc2-9dca-7c63c8f08d44', NULL),
	('6af44c7a-8488-4df6-87da-784c64834189', 'de', 'ede@fe.hu', 36, NULL, 'complete', '2025-08-07 11:58:03.202961+00', '2025-08-07 11:58:06.439001+00', '86135fc1-9014-465e-a9c4-41e003db65cb', NULL),
	('942a2046-266a-4bcd-b368-43b1a6bb6bf5', 'ded', 'laszlo.s.szabo@ecomxpert.hu', 43, NULL, 'incomplete', '2025-08-07 12:06:31.481932+00', '2025-08-07 12:06:31.481932+00', NULL, NULL),
	('28e1e776-e5ac-41ec-8910-1ee7ece627ab', 'dede', 'laszlo.s.szabo@ecomxpert.hu', 43, NULL, 'complete', '2025-08-07 12:08:26.087179+00', '2025-08-07 12:08:29.303856+00', '4685df62-d4f6-47d5-b2ba-4b8e9c665797', NULL),
	('9040f66f-17d7-4ea7-bde9-f6d15eb4f351', 'Andras', 'hello@perenyiandras.com', 44, 'married', 'complete', '2025-08-07 12:11:05.957571+00', '2025-08-07 12:11:32.5585+00', '009d8766-0e57-4648-8d60-ba1a2e89e22c', NULL),
	('039f1687-0e69-4f2e-9932-797bc2e26005', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-07 15:51:29.60145+00', '2025-08-07 15:51:35.96375+00', '922bd66b-74e1-4676-a0b0-6bec19a2c86f', NULL),
	('acc36713-360b-4a90-8a65-6f5f20056ad6', 'Suti', 'suti@segitettem.hh', NULL, NULL, 'incomplete', '2025-08-07 15:55:12.028302+00', '2025-08-07 15:55:12.028302+00', NULL, NULL),
	('68dc735d-5fb1-4e40-a900-aea63627f806', 'sss', 'sww@de.hu', NULL, NULL, 'complete', '2025-08-07 15:55:30.920126+00', '2025-08-07 15:55:34.623036+00', '72a991a7-1ec8-424a-a683-8a4584ac2693', NULL),
	('bd90cc9c-76f6-4da6-b8bb-7fcfebbc19aa', 'Suti', 'sss@sss.hu', NULL, NULL, 'complete', '2025-08-07 16:10:44.730496+00', '2025-08-07 16:10:47.869687+00', '45279de3-abde-447b-addb-1ff765597f8f', NULL),
	('3c172917-e276-4780-9463-96cb47b4ebb2', 'set', 'suti@sef.hu', NULL, NULL, 'incomplete', '2025-08-07 16:14:11.344767+00', '2025-08-07 16:14:11.344767+00', NULL, NULL),
	('4041ba8d-cd9e-4b30-9b91-024ff18d5f18', 'sefs', 'sef@sef.hu', NULL, NULL, 'complete', '2025-08-07 16:14:38.879089+00', '2025-08-07 16:14:42.117597+00', 'fa48b9bd-a4c8-4817-bb52-b60056571a18', NULL),
	('c7e4a170-92f7-46ec-bdc5-0a2471784709', 'Kriszti', 'mullerkriszti335@gmail.com', 25, 'relationship', 'complete', '2025-08-07 16:28:21.301615+00', '2025-08-07 16:32:13.371676+00', '865dc790-533f-444c-9714-65068f7b2731', NULL),
	('9012e5b7-484f-4cbd-b5fc-9a45aa93df41', 'suti', 'suti@segitettem.hu', 343, NULL, 'complete', '2025-08-07 16:43:32.198159+00', '2025-08-07 16:43:35.72827+00', 'e46849de-5632-4d8d-9d4b-c71ec506de61', NULL),
	('d1b5f780-90bc-41bb-aadf-c939e945181c', 'stui', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-07 16:45:37.438628+00', '2025-08-07 16:45:40.860013+00', 'dd6bc371-e83f-45af-9bf1-907eefd118ed', NULL),
	('7db15166-64ed-480f-83a2-a6ea85801a07', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-07 16:58:14.59144+00', '2025-08-07 16:58:17.494979+00', '9e6c894e-9631-4345-9b56-6e05378eaae8', NULL),
	('6e5e4baa-f453-4baf-9fb8-3e87819caf52', 'suti', 'suti@segitettem.hu', 36, 'relationship', 'complete', '2025-08-08 18:52:36.925343+00', '2025-08-08 18:52:39.850036+00', '9e9ae457-b510-4c31-9552-1022f04b0bb8', NULL),
	('9b43bcd3-fc61-4414-9d41-29acfdae84c4', 'suti', 'suti@segitettem.hu', 37, NULL, 'complete', '2025-08-08 20:20:52.489576+00', '2025-08-08 20:20:56.250426+00', 'd735f65b-3ebc-44b3-b274-ea4f7ca4d145', NULL),
	('3a2266aa-4f82-4cb3-b349-7e803cdf1df1', 'suti', 'suti@segitettem.hu', 37, NULL, 'complete', '2025-08-08 20:28:47.925601+00', '2025-08-08 20:28:51.109672+00', '34e3a35f-a02b-46c8-87de-1db93d44f6f2', NULL),
	('651a20e0-64b6-4912-9e21-311528ae9414', 'suti', 'suti@segitettem.hu', 37, NULL, 'complete', '2025-08-08 20:29:48.557301+00', '2025-08-08 20:29:51.813942+00', 'b87927e4-678c-442b-88dc-d99a80d9c16d', NULL),
	('36efb415-e942-498f-8b89-70c2a598a1b8', 'suti', 'suti@segitettem.hu', 37, NULL, 'complete', '2025-08-08 20:38:34.415268+00', '2025-08-08 20:38:37.146698+00', '18578191-468a-44ad-8a46-1dc73d794d9d', NULL),
	('c834e0b1-406b-4340-b387-8ba5505e0626', 'suti', 'suti@segitettem.hu', 35, NULL, 'complete', '2025-08-08 20:43:36.122184+00', '2025-08-08 20:43:38.504683+00', '6da74cb2-8de6-454d-aa69-c588a56aef1b', NULL),
	('d7cfe0bd-6114-48da-be29-e0df116ea8a3', 'suti', 'suti@segitettem.hu', 35, NULL, 'complete', '2025-08-08 20:49:54.845088+00', '2025-08-08 20:49:58.069416+00', 'c9c2980a-e9f0-4207-8d0c-9df437916c86', NULL),
	('879253c5-784a-48d6-b135-f4d81a54cd83', 'suti', 'suti@segitettem.hu', 22, NULL, 'complete', '2025-08-08 21:00:37.639536+00', '2025-08-08 21:00:40.087633+00', 'fcfe003a-90b2-4ecc-9d8e-cad50bf584cd', NULL),
	('f1412360-6c77-451e-bed3-912c1d8837e0', 'suti', 'suti@segitettem.hu', 33, NULL, 'complete', '2025-08-08 21:06:22.168816+00', '2025-08-08 21:06:25.241744+00', 'b11404df-ad28-4b63-ab92-d422fa1ea17d', NULL),
	('cb9a1864-dbc1-4fa9-84c4-ba7e080c3803', 'suti', 'suti@segitettem.hu', 44, NULL, 'complete', '2025-08-08 21:09:10.285719+00', '2025-08-08 21:09:12.595782+00', '0f28505a-7471-45fd-b34c-1107f817ba4b', NULL),
	('cd412440-aeb5-4805-b7b3-d8377c30e559', 'suti', 'suti@segitettem.hu', 44, NULL, 'complete', '2025-08-08 21:11:36.368561+00', '2025-08-08 21:13:13.798361+00', '146004eb-efda-4a10-a4aa-c6b780f8c492', NULL),
	('b7858f64-389b-4f67-9b0a-0d1fa1fa9000', 'suti', 'suti@segitettem.hu', 44, NULL, 'complete', '2025-08-08 21:13:34.916429+00', '2025-08-08 21:16:11.633908+00', 'd4525edd-8341-4490-9f1f-73cfddca1393', NULL),
	('02ac324c-ad57-43f3-b912-466a6af6e026', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-08 21:16:33.052276+00', '2025-08-08 21:19:39.19665+00', '81c33145-dbf7-4986-ad3f-1efea2b2a2e5', NULL),
	('2b139f9c-f0a2-4d0a-b1a5-d4cadfd2f7d8', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-08 21:23:26.958551+00', '2025-08-08 21:23:29.613609+00', '157ff688-09a3-4bd0-b042-5397da6a143d', NULL),
	('3757618f-d659-426b-97e4-b1c73302a9e1', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-08 21:25:05.443108+00', '2025-08-08 21:25:08.548977+00', '711d74b6-8f0f-4ff4-9642-552b8eb0d996', NULL),
	('04a92522-9f7c-42b1-a8b2-02124e8c21ae', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-08 21:27:44.23046+00', '2025-08-08 21:27:46.634258+00', '7b11b943-eace-4dff-8f76-2bab21a6e7f1', NULL),
	('5ca7ba28-3c96-4ba6-a105-00d4a8239643', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-08 21:31:16.996368+00', '2025-08-08 21:31:20.208558+00', '7b8d4a07-37f5-4595-83b0-dcb7f0e058de', NULL),
	('4f434fe4-adad-45c8-a6cd-3aa7a47cf9ca', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-08 21:32:37.645963+00', '2025-08-08 21:32:40.628287+00', 'bd393273-acbd-42a6-ae17-617300d9ba28', NULL),
	('f2b962c8-807b-403b-b18d-06dd049884b0', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-08 21:34:22.938758+00', '2025-08-08 21:34:25.373609+00', '8e0350ed-3c01-40db-a1ac-c514de3ab296', NULL),
	('a092cd44-4e19-48de-8e68-fac46b610de9', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-08 21:35:20.363036+00', '2025-08-08 21:35:23.004199+00', '19060095-0a3f-4d8c-8c8c-784cf6177a0e', NULL),
	('9018e0ef-2a6a-4a2e-b752-32a794eefcfa', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-08 21:36:51.181556+00', '2025-08-08 21:36:53.719553+00', '3dc8702b-ce94-4d0e-a3b6-7c3c6fd350e6', NULL),
	('896a260d-a670-4235-82f4-b8656c72d0d4', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-10 08:58:54.571469+00', '2025-08-10 08:58:58.671042+00', 'c5e852c9-571a-45e2-94a1-0e375f2f9056', NULL),
	('99c4d9ae-8358-4b0f-a5f5-6a3329bf6933', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-10 17:55:41.976354+00', '2025-08-10 17:55:45.291658+00', 'e2ebb90b-dfb4-4159-9daf-d1c762c4c448', NULL),
	('4312d7bd-3550-45b6-a6ce-df65caa72369', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-10 20:32:19.299117+00', '2025-08-10 20:32:47.785667+00', '2c54baa0-d08e-4ded-8737-eba519378735', NULL),
	('35040acb-dc5b-4381-8e3a-328ca1df58d7', 'suti', 'suti@segitettem.hu', NULL, NULL, 'incomplete', '2025-08-10 20:34:10.986902+00', '2025-08-10 20:34:10.986902+00', NULL, NULL),
	('a92d5da6-3586-4fed-b60e-507c6da39869', 'stui', 'sut@sf.gu', NULL, NULL, 'incomplete', '2025-08-10 20:35:50.541273+00', '2025-08-10 20:35:50.541273+00', NULL, NULL),
	('3cb53a2c-308c-4e40-908f-be3deee49663', 'suti', 'suti@segitettem.hu', NULL, NULL, 'complete', '2025-08-11 20:13:19.921738+00', '2025-08-11 20:13:24.273805+00', '9cdfa571-efce-4d20-968d-d5ca94bf8932', NULL),
	('928aa450-4d7a-45a7-b128-b239d5ff7896', 'hjk', 'laszlo.s.szabo@ecomxpert.hu', NULL, NULL, 'complete', '2025-08-13 17:23:14.684443+00', '2025-08-13 17:23:20.288698+00', '5b0f9ac1-a295-410f-9268-26f7e8e664b0', NULL),
	('51aa8bab-50f0-476d-b152-33594d202f63', 'suti', 'suti@segitettem.hu', 32, 'relationship', 'complete', '2025-08-13 18:25:48.27143+00', '2025-08-13 18:25:51.64551+00', '1ef68b42-1e33-4cb6-89ca-0ffa4975d570', NULL);


--
-- Data for Name: quiz_leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_leads" ("id", "session_id", "quiz_id", "email", "lang", "created_at") VALUES
	('941d8155-6d1d-44d4-b794-e812ccc34c1b', 'e9f07915-64e4-414a-ad61-6c097889adbe', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'laszlo.s.szabo@ecomxpert.hu', 'hu', '2025-08-15 08:01:36.73074+00');


--
-- Data for Name: quiz_product_offers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: quiz_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_questions" ("id", "quiz_id", "order", "type", "key", "help_text", "options", "scoring", "created_at", "updated_at") VALUES
	('6ca71134-6fd6-420b-8e9f-2a18f186c893', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 1, 'scale', 'attention_span', NULL, '[{"key": "scale_1", "score": 1}, {"key": "scale_2", "score": 2}, {"key": "scale_3", "score": 3}, {"key": "scale_4", "score": 4}, {"key": "scale_5", "score": 5}]', '{"type": "direct", "weight": 1}', '2025-08-15 07:26:17.118455+00', '2025-08-15 07:26:17.118455+00'),
	('f07e0be0-9692-4178-b08f-571024a63da6', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 2, 'single', 'hyperactivity', NULL, '[{"key": "hyper_low", "score": 1}, {"key": "hyper_mild", "score": 2}, {"key": "hyper_moderate", "score": 3}, {"key": "hyper_high", "score": 4}]', '{"type": "direct", "weight": 1}', '2025-08-15 07:26:17.118455+00', '2025-08-15 07:26:17.118455+00'),
	('ab5dc405-1bff-4c98-9e38-4beeb5669d0a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 3, 'single', 'impulsivity', NULL, '[{"key": "impulse_planned", "score": 1}, {"key": "impulse_balanced", "score": 2}, {"key": "impulse_quick", "score": 3}, {"key": "impulse_hasty", "score": 4}]', '{"type": "direct", "weight": 1}', '2025-08-15 07:26:17.118455+00', '2025-08-15 07:26:17.118455+00'),
	('ded86517-bdd7-405b-a9d4-0e07b7a526d3', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 4, 'scale', 'organization', NULL, '[{"key": "scale_1", "score": 5}, {"key": "scale_2", "score": 4}, {"key": "scale_3", "score": 3}, {"key": "scale_4", "score": 2}, {"key": "scale_5", "score": 1}]', '{"type": "reverse", "weight": 1}', '2025-08-15 07:26:17.118455+00', '2025-08-15 07:26:17.118455+00'),
	('5f9a34a1-0ba9-4306-aecc-d57243391d8c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 5, 'single', 'time_management', NULL, '[{"key": "time_excellent", "score": 1}, {"key": "time_good", "score": 2}, {"key": "time_struggling", "score": 3}, {"key": "time_chaotic", "score": 4}]', '{"type": "direct", "weight": 1}', '2025-08-15 07:26:17.118455+00', '2025-08-15 07:26:17.118455+00'),
	('cf2e4308-c0ca-4958-b365-69133fc0e564', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 6, 'scale', 'emotional_regulation', NULL, '[{"key": "scale_1", "score": 5}, {"key": "scale_2", "score": 4}, {"key": "scale_3", "score": 3}, {"key": "scale_4", "score": 2}, {"key": "scale_5", "score": 1}]', '{"type": "reverse", "weight": 1}', '2025-08-15 07:26:17.118455+00', '2025-08-15 07:26:17.118455+00'),
	('df156ec2-c919-4278-a8f1-2cb63d25f4b6', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 7, 'single', 'social_situations', NULL, '[{"key": "social_comfortable", "score": 1}, {"key": "social_adaptive", "score": 2}, {"key": "social_challenging", "score": 3}, {"key": "social_difficult", "score": 4}]', '{"type": "direct", "weight": 1}', '2025-08-15 07:26:17.118455+00', '2025-08-15 07:26:17.118455+00'),
	('adeda58b-63f8-4445-a70e-6d3300256500', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 8, 'scale', 'daily_functioning', NULL, '[{"key": "scale_1", "score": 1}, {"key": "scale_2", "score": 2}, {"key": "scale_3", "score": 3}, {"key": "scale_4", "score": 4}, {"key": "scale_5", "score": 5}]', '{"type": "direct", "weight": 1}', '2025-08-15 07:26:17.118455+00', '2025-08-15 07:26:17.118455+00');


--
-- Data for Name: quiz_results; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: quiz_scoring_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_scoring_rules" ("id", "quiz_id", "rule_type", "weights", "thresholds", "created_at", "updated_at") VALUES
	('f15edc93-b8a3-468c-98bd-7c24afd81ee9', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'sum', '{}', '{"low": {"max": 15, "min": 8, "label": "low"}, "high": {"max": 33, "min": 25, "label": "high"}, "medium": {"max": 24, "min": 16, "label": "medium"}}', '2025-08-15 07:26:17.201618+00', '2025-08-15 07:26:17.201618+00');


--
-- Data for Name: quiz_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quiz_translations" ("id", "quiz_id", "lang", "field_key", "value", "created_at", "updated_at") VALUES
	('98801a8a-598d-4a59-84bc-94430e804bbc', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'landing_headline', 'ADHD Gyorsteszt - Ismerd meg magad!', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('136bb8a9-ebe6-40a9-ae83-05a666bec04e', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'landing_sub', 'Egy 5 perces teszt, amely segít feltérképezni az ADHD tüneteit. Tudományosan megalapozott kérdések, személyre szabott eredmény.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('6eb714a1-d402-499a-865c-375e0e5abc55', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'landing_description', 'Tudományosan megalapozott ADHD teszt 5 perc alatt. Ismerd meg jobban magad és kapj személyre szabott visszajelzést a tüneteidről.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('99abfc0b-7ad8-4a55-924c-74924cfe673b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'landing_cta_text', 'Teszt indítása', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('16626863-ab5b-4c49-8ab8-2eb5cbad4c2e', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'social_proof_1', '5,000+ kitöltő', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('4714e9b2-4296-49a4-9070-a7aa4bcc06b5', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'social_proof_2', '98% elégedettség', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('096d1eab-3058-4729-93cc-00772f95c071', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'social_proof_3', 'Tudományos alapok', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('33820ccf-cede-4ded-8e88-89de33322dd5', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'cta_text', 'Teszt indítása', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('8bc62493-3b75-4e7a-914b-019f182d8205', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'meta_title', 'ADHD Gyorsteszt - Ingyenes Online Felmérés', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('6963f249-6529-4d34-8dfe-7872394628cd', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'meta_description', 'Tudományosan megalapozott ADHD teszt 5 perc alatt. Személyre szabott eredmény és javaslatok.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('1d0a3f47-dfbb-43b9-96c5-d1dcf1cfae9f', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'email_gate_headline', 'Kapd meg személyre szabott eredményedet!', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('76428b33-584a-4cc1-80f8-6764d9b2a11b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'email_gate_description', 'Add meg az email címedet és a nevedet, hogy elküldhessük a részletes elemzést és hasznos tippeket.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('59f35031-ca0e-4ebf-93f9-b3412a3182d3', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'email_field_placeholder', 'Email címed', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('edc172f2-81f8-4d0a-b4cc-55ff9d3f2017', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'name_field_placeholder', 'Neved', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('1c2b2041-061a-4ce9-aedb-59be2e70437c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'email_gate_submit_button', 'Eredmény megjelenítése', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('e37ff436-bc96-4048-b6b4-57ba19b2cf2f', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'email_gate_privacy_text', 'Adataidat biztonságban tartjuk és nem adjuk át harmadik félnek.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('dc3df6b8-c3fd-4474-9f1e-c5843998f101', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'landing_headline', 'ADHD Quick Assessment - Know Yourself Better!', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('d1b33b39-90b3-4b88-9385-4b52623e26f5', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'landing_sub', 'A 5-minute test that helps map ADHD symptoms. Scientifically based questions with personalized results.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('e54c9216-0d50-4eb4-a59f-cede8fcb0b02', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'landing_description', 'Scientifically based ADHD test in 5 minutes. Get to know yourself better and receive personalized feedback about your symptoms.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('c85ea1d2-85eb-4108-bc2b-adaf6f896f1d', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'landing_cta_text', 'Start Assessment', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('78d312b7-ddca-433b-a593-cd1ca2a4110f', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'social_proof_1', '5,000+ completed', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('c0bdd449-417c-4ef3-82bf-ec4811948195', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'social_proof_2', '98% satisfaction', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('cd673058-29ce-4444-bc49-8e7e5ca7eff4', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'social_proof_3', 'Scientific foundation', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('4d1e5889-02db-48b8-bb2f-128e2857f6ca', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'cta_text', 'Start Assessment', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('fb926034-35f8-4d31-8bb4-366d44629084', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'meta_title', 'ADHD Quick Test - Free Online Assessment', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('3ab225e5-8a82-4e30-853a-ac17474c346b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'meta_description', 'Scientifically based ADHD test in 5 minutes. Personalized results and recommendations.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('d050a72d-4a86-428a-b440-b388d278de0a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'email_gate_headline', 'Get your personalized results!', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('d587ad48-115b-4b73-94b9-06304c3a60f6', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'email_gate_description', 'Enter your email and name to receive detailed analysis and helpful tips.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('0ac5abe3-8f48-40ca-be4c-55fe7a400911', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'email_field_placeholder', 'Your email', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('2282c156-02f3-465e-95c7-8dc27b7b60c5', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'name_field_placeholder', 'Your name', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('88489f73-5126-49ee-bcce-e1f8273fac09', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'email_gate_submit_button', 'Show Results', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('00d0bf7a-39b1-4a45-a2c0-8eb0ea28b024', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'email_gate_privacy_text', 'We keep your data secure and do not share it with third parties.', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('ecd1af70-c272-4b6b-a789-6657da369f1b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:attention_span:text', 'Mennyire nehéz koncentrálnod hosszabb feladatok során?', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('b256353f-ab9f-43a2-a336-9f4dee287fba', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:attention_span:help', 'Gondolj olyan helyzetekre, amikor 30+ percig kellett egy dologra figyelned', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('4d9e4ff3-769b-48b6-bf75-e29ed0400a0c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:hyperactivity:text', 'Gyakran érzed magad nyugtalannak vagy "pörögősnek"?', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('9683836d-7318-4e3e-9644-711f70770190', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:hyperactivity:help', 'Belső nyugtalanság, mozgásigény, nehéz egy helyben maradni', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('95a82d27-87e4-4d9a-a93c-a518bf2fad71', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:impulsivity:text', 'Mi jellemző rád döntéshozatal során?', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('23379a9b-458e-4bc5-bd5c-f2bdd9d687ec', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:impulsivity:help', 'Gondolj a mindennapi kis és nagy döntéseidre', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('46419261-a09c-483b-b963-01f789fadfb6', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:organization:text', 'Mennyire szervezett vagy a mindennapi életben?', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('3f14f092-4594-46ac-a474-ffe451bcaf7c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:organization:help', 'Tárgyak rendben tartása, tervezés, határidők betartása', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('c1fd8725-a2ea-4b8e-83ce-7096a418fcb4', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:time_management:text', 'Hogyan állsz az időbeosztással?', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('cc8ac544-b859-4b49-bb40-680fc0fdb65b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:time_management:help', 'Időérzék, pontosság, tervezés', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('987f79a6-612d-43d1-b67c-2dfd7f457e7a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:emotional_regulation:text', 'Mennyire tudod kezelni az érzelmeidet?', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('18b1d484-b60b-433d-b55c-6ec021197412', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:emotional_regulation:help', 'Düh, frusztráció, stressz kezelése', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('ab834393-87ce-46a2-8c1d-032c300e86be', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:social_situations:text', 'Mi jellemző rád társaságban?', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('699b3385-1a96-4210-a95b-92533a4ea5d8', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:social_situations:help', 'Beszélgetések, társas helyzetek kezelése', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('e8815655-de98-480c-afa4-df07e3b06f2c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:daily_functioning:text', 'Mennyire befolyásolják a tünetek a mindennapi életedet?', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('c9dd4dc9-8e35-4cf8-8fc7-13ccf5337ccc', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'question:daily_functioning:help', 'Munka, tanulás, kapcsolatok, hobbik', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('17aa7e55-848b-439e-b166-dfbd71c0cb87', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:attention_span:text', 'How difficult is it for you to concentrate during longer tasks?', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('f0e36f79-baa7-4c3d-a185-8eedb3eaadf4', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:attention_span:help', 'Think about situations requiring 30+ minutes of focused attention', '2025-08-15 07:26:16.907131+00', '2025-08-15 07:26:16.907131+00'),
	('3fcca049-592e-4cf5-a900-a49031166402', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'email:welcome_body', 'Köszönjük, hogy kitöltötted az ADHD gyorstesztünket! Az eredményeidet itt találod: {{result_url}}. Ha kérdéseid vannak, írj nekünk: hello@quizplatform.com', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('5b13a5de-ca72-4220-8c55-9110e00c4aa8', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'email:welcome_subject', 'Your ADHD Quick Test Results Have Arrived', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('019175e7-1232-417f-afc4-03a2987c08d5', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:hyperactivity:text', 'Do you often feel restless or "wired"?', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('2eb224cb-b66f-4fd9-bbda-ad8276349c62', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:hyperactivity:help', 'Inner restlessness, need to move, difficulty staying still', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('11909cb6-499c-4d10-8941-b26784aae277', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:impulsivity:text', 'What characterizes your decision-making?', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('7b820a48-efc3-45e4-94eb-81545087da93', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:impulsivity:help', 'Think about your daily small and big decisions', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('973501cc-d9b6-4a0d-9dc1-c9386d78241c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:organization:text', 'How organized are you in daily life?', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('32579ff2-cc4f-42b7-8055-9efc1176c481', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:organization:help', 'Keeping things tidy, planning, meeting deadlines', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('ce7dd748-f745-4fbd-b054-44132ad8633e', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:time_management:text', 'How do you handle time management?', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('b1aab483-2610-4639-a4c9-f6d9739f640d', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:time_management:help', 'Time awareness, punctuality, planning', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('a3ba6d7a-d61f-48e7-a896-0ee22ee101fc', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:emotional_regulation:text', 'How well can you manage your emotions?', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('5f5b3741-aea8-4866-b129-b31227781c21', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:emotional_regulation:help', 'Handling anger, frustration, stress', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('0608a248-f30c-44e8-8648-4cf8dff341af', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:social_situations:text', 'What characterizes you in social settings?', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('900e425c-650f-486f-adc4-94b52ddc1c11', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:social_situations:help', 'Conversations, handling social situations', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('ff9bdb88-4ceb-4a38-8c4e-229f40f5c28b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:daily_functioning:text', 'How much do symptoms affect your daily life?', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('61e73727-de2b-452d-8aa7-c361349dbf96', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'question:daily_functioning:help', 'Work, study, relationships, hobbies', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('5f8c2d03-1c96-486c-9345-603568a9c786', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:scale_1:label', '1 - Egyáltalán nem', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('9512d1dd-a0cb-4ff0-869e-cb7a1d7c3d51', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:scale_2:label', '2 - Ritkán', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('ff24550d-23cf-4948-a04e-713be4336e9a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:scale_3:label', '3 - Néha', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('4ce3c661-c9a7-4f13-a5a2-1f6271daee52', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:scale_4:label', '4 - Gyakran', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('53f73b5c-04d2-4502-bd72-efb04809f205', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:scale_5:label', '5 - Majdnem mindig', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('3442bacd-a001-4d46-af1b-2b6c21bf8887', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:hyper_low:label', 'Ritkán érzem magam nyugtalannak', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('6d5f491c-8527-4b98-bd71-1c6a3aee16d1', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:hyper_mild:label', 'Néha pörgős vagyok', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('54147dc9-d075-4b88-a056-417e640bb2d7', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:hyper_moderate:label', 'Gyakran nehéz megnyugodnom', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('17d9eefd-be18-45aa-8ad5-79ad671b59ab', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:hyper_high:label', 'Állandóan belső feszültséget érzek', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('2d159704-aa7b-4d2c-9c3a-6d581ae4da87', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:impulse_planned:label', 'Mindig átgondolom a döntéseimet', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('79b36e15-f797-4f38-978a-5726f5a37c45', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:impulse_balanced:label', 'Általában megfontolt vagyok', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('158bdee8-1095-40b3-8d8e-a3262dead9cb', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:impulse_quick:label', 'Gyakran gyorsan döntök', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('019466fe-ed1e-4221-814d-01c653ac6c54', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:impulse_hasty:label', 'Sokat csinálok meggondolatlanul', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('1ce0b0fc-5228-4db8-b1b3-032e9999e091', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:time_excellent:label', 'Mindig pontosan tervezek', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('17855dbf-a280-469d-83f0-fc47eac3851d', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:time_good:label', 'Általában jól beosztom az időt', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('b42bb32c-40a9-491c-84a0-6aba95d69681', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:time_struggling:label', 'Gyakran késésben vagyok', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('5ee92748-3544-44f3-81d2-7824fed61d6b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:time_chaotic:label', 'Az időbeosztás állandó küzdelem', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('28217333-b1cd-4763-b9f2-fe9fdac4bd7f', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:social_comfortable:label', 'Könnyen beilleszkedem bárhol', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('a3fb7d79-bae7-4115-a9e0-a2521dc13361', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:social_adaptive:label', 'Általában jól kezelem a helyzeteket', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('67e96832-aeb5-45ae-87cd-f3bb59204792', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:social_challenging:label', 'Néha nehéz társaságban', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('286d008a-0578-4eff-a3a2-3fba2fbd7f55', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'option:social_difficult:label', 'Gyakran kínosan érzem magam', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('eabb07a5-1330-4cee-a0f4-8c63537ef535', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:scale_1:label', '1 - Not at all', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('4902c634-27eb-45e0-909e-0e8cda76d006', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:scale_2:label', '2 - Rarely', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('0fceb1ae-1435-4d5c-a554-38f7709901b2', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:scale_3:label', '3 - Sometimes', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('f15a89c0-bc41-4f14-962c-ad0c4503291b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:scale_4:label', '4 - Often', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('59f5c3de-bb39-4c03-89a2-50d1e656ce4c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:scale_5:label', '5 - Almost always', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('151880aa-e015-4bbf-a9bb-d0b8183e9b2b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:hyper_low:label', 'I rarely feel restless', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('f54a45d2-a0ac-46b6-a2d8-2b2f791447c4', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:hyper_mild:label', 'Sometimes I feel wired', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('9f5f38f0-fc0d-4734-8aa5-1b6051ad9442', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:hyper_moderate:label', 'Often hard to calm down', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('1b21c5b6-691b-4d92-843f-2f00cebe1612', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:hyper_high:label', 'Constantly feel inner tension', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('fa905439-bdd3-4621-9e9a-7769db4ff13a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:impulse_planned:label', 'I always think through my decisions', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('c0af1135-4b0e-4697-8a10-d668e3f76cfa', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:impulse_balanced:label', 'Generally I''m thoughtful', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('ad4fe6a7-ffcc-43b6-82ae-1fb4e79f8b29', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:impulse_quick:label', 'I often decide quickly', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('fff9b98a-ead7-413b-9714-62e9d919e751', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:impulse_hasty:label', 'I do many things impulsively', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('7288be26-0ce7-4cc2-afa1-6039395435e0', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:time_excellent:label', 'I always plan precisely', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('30bcb626-8e21-4fac-b727-d26a92ee232a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:time_good:label', 'Generally good at time management', '2025-08-15 07:26:16.975249+00', '2025-08-15 07:26:16.975249+00'),
	('39efc3d8-39ac-41cc-a37f-3225f7880287', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'email:welcome_body', 'Thank you for completing our ADHD quick test! You can find your results here: {{result_url}}. If you have questions, contact us: hello@quizplatform.com', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('a8e1ba7c-bf4b-4537-ab87-8c48bee926e5', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:time_struggling:label', 'Often running late', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('0090fe60-8a9d-4b48-a075-a62ad1786830', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:time_chaotic:label', 'Time management is constant struggle', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('d5a1904f-868d-45a2-bba1-1b615d288bb8', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:social_comfortable:label', 'I easily fit in anywhere', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('61870e40-b168-47b1-b79c-3f3bd9d15fe1', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:social_adaptive:label', 'Generally handle situations well', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('2ffbe1bb-6054-4c7c-a0ac-3c5cc3097e44', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:social_challenging:label', 'Sometimes difficult in company', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('e45665ae-25a5-47bd-8d36-e0458fdc3fe8', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'option:social_difficult:label', 'Often feel awkward', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('b4391e24-fc53-4aea-ae83-a24aff386ff7', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'result_static_low_title', 'Alacsony kockázat', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('737ea22d-7ce2-497d-9af2-dd4cdb9537a4', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'result_static_low_description', 'Az eredményeid alapján kevés ADHD-specifikus tünet jellemez. Ez nem zárja ki teljesen a diagnózist, de jelenleg az életminőséged nem jelentősen érintett.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('5cd1dc9f-28b8-4213-9f22-3ce94a878ae7', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'result_static_low_recommendations', 'Ha mégis úgy érzed, hogy vannak nehézségeid, érdemes szakemberrel beszélned a részletekről.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('da47ad78-11fd-476f-82ab-969d917dcf32', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'result_static_medium_title', 'Közepes kockázat', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('86919a23-dc14-4b2f-a666-0dd88e33c755', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'result_static_medium_description', 'Több ADHD-specifikus tünet is felismerhető nálad. Érdemes lehet szakorvosi konzultáció és részletesebb felmérés.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('a4102703-5e52-416a-86ad-45bebf72eb60', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'result_static_medium_recommendations', 'Javasoljuk, hogy beszélj háziorvosoddal vagy keress fel egy ADHD-specialistát a további lépések megbeszéléséhez.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('d418f23b-07bd-4f0f-9d85-1d83be20e1cb', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'result_static_high_title', 'Magas kockázat', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('48097b79-757f-49c4-9490-4040fab3b4ad', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'result_static_high_description', 'Az eredmények jelentős ADHD tünetegyüttest mutatnak, amely valószínűleg befolyásolja a mindennapi életedet.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('e5c7f85c-0a0f-45a1-adfe-058ceacee0d1', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'result_static_high_recommendations', 'Határozottan javasoljuk szakorvosi vizsgálatot és lehetséges kezelési opciók megbeszélését.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('41063fec-902a-46d7-a882-01e0c80b7862', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'result_static_low_title', 'Low Risk', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('d0ce6fe6-5919-4a58-b2cd-b2bf56b74354', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'result_static_low_description', 'Based on your results, few ADHD-specific symptoms characterize you. This doesn''t completely rule out a diagnosis, but currently your quality of life isn''t significantly affected.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('ac6b6e01-02d1-49b4-8d93-25ee851db150', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'result_static_low_recommendations', 'If you still feel you have difficulties, it''s worth discussing details with a professional.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('90cbd68a-482b-4b0c-b12f-cdfe4db6625a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'result_static_medium_title', 'Moderate Risk', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('65193674-c02d-45b7-a4ad-c23699ee80cb', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'result_static_medium_description', 'Several ADHD-specific symptoms are recognizable in you. Medical consultation and detailed assessment might be worthwhile.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('f69e69b5-8d4f-42ac-aa56-43a452e547f9', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'result_static_medium_recommendations', 'We recommend talking to your GP or consulting an ADHD specialist about next steps.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('82971dab-b5bc-46b1-b754-622a19fef826', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'result_static_high_title', 'High Risk', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('ed985d9b-bb0e-4715-8c97-8ee9cf9bcdb6', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'result_static_high_description', 'Results show significant ADHD symptom cluster that likely affects your daily life.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('da0ea80d-23b8-49aa-b174-f1f22a66255f', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'en', 'result_static_high_recommendations', 'We strongly recommend medical examination and discussion of possible treatment options.', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00'),
	('cba1be30-af55-4dda-8f28-1bf441e3fa0e', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'hu', 'email:welcome_subject', 'ADHD Gyorsteszt Eredményed Megérkezett', '2025-08-15 07:26:17.052298+00', '2025-08-15 07:26:17.052298+00');


--
-- Data for Name: user_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_events" ("id", "quiz_id", "session_id", "event_type", "event_data", "user_agent", "url", "ip_address", "created_at") VALUES
	('f9f15e22-2152-497d-b247-92bc0b840d15', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', NULL, 'page_view', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:49.339Z"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check', NULL, '2025-08-15 07:59:49.531599+00'),
	('09286d46-baca-4e64-b4f3-3fd6b866ebb8', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', NULL, 'page_view', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:50.357Z"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check', NULL, '2025-08-15 07:59:50.427216+00'),
	('aeca67c3-273b-45d6-a65b-f657f491c8ec', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '83dec47e-d16a-47db-bea3-227123cc86e0', 'quiz_start', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:51.355Z", "session_id": "83dec47e-d16a-47db-bea3-227123cc86e0"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:51.418862+00'),
	('03907a28-f19e-4fde-abf7-c0a2183169f0', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'quiz_start', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:51.359Z", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:51.455386+00'),
	('1332ff1e-b355-4e76-aa6d-c0ad25d318fa', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:52.797Z", "answer_key": "3", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe", "question_key": "attention_span"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:52.863162+00'),
	('fdc15ebf-1248-4215-aede-ca5e62a302b3', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:53.486Z", "answer_key": "hyper_low", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe", "question_key": "hyperactivity"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:53.542919+00'),
	('0b21b303-969d-4ee9-ba50-39d31cdcb875', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:54.662Z", "answer_key": "impulse_balanced", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe", "question_key": "impulsivity"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:54.722853+00'),
	('576525e2-9ac6-4f14-bd92-e4bd00aff0f3', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:55.903Z", "answer_key": "2", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe", "question_key": "organization"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:55.962603+00'),
	('c74a4242-3a51-400d-b889-3379028a1af5', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:56.793Z", "answer_key": "time_good", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe", "question_key": "time_management"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:56.85453+00'),
	('30fbdfc1-2b0d-4a95-b0da-7bab69bb6caa', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:57.521Z", "answer_key": "2", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe", "question_key": "emotional_regulation"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:57.585952+00'),
	('8d81ba8d-b4fe-4082-8f72-e5c9a740c210', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:58.300Z", "answer_key": "social_adaptive", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe", "question_key": "social_situations"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:58.361271+00'),
	('b1b89151-a687-482f-a7f6-c4ad981de401', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T07:59:59.321Z", "answer_key": "3", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe", "question_key": "daily_functioning"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 07:59:59.387278+00'),
	('306f23df-e6da-48c1-9c9c-2e25247cafcc', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', NULL, 'page_view', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:01:27.970Z"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.103.1 Chrome/138.0.7204.100 Electron/37.2.3 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check?id=56ffd9af-2ae1-4320-b26a-7a63bba0ea08&vscodeBrowserReqId=1755244886885', NULL, '2025-08-15 08:01:28.120764+00'),
	('13648fd0-b0af-4197-a391-a7522ff9191e', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'email_submitted', '{"lead_id": "941d8155-6d1d-44d4-b794-e812ccc34c1b", "quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:01:36.762Z", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:01:36.901859+00'),
	('542e51c5-2efa-410b-bd49-010b475812ac', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e9f07915-64e4-414a-ad61-6c097889adbe', 'quiz_complete', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "metadata": {"total_score": 0}, "timestamp": "2025-08-15T08:01:37.063Z", "session_id": "e9f07915-64e4-414a-ad61-6c097889adbe"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:01:37.114142+00'),
	('8d07c864-8dfa-4888-8a0a-1a33ae89ea31', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', NULL, 'page_view', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:25.505Z"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Code/1.103.1 Chrome/138.0.7204.100 Electron/37.2.3 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check?id=56ffd9af-2ae1-4320-b26a-7a63bba0ea08&vscodeBrowserReqId=1755245064562', NULL, '2025-08-15 08:04:25.60518+00'),
	('eb33757c-9a69-4c56-8e27-ebf41697495b', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', NULL, 'page_view', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:43.203Z"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check', NULL, '2025-08-15 08:04:43.295931+00'),
	('042d8e27-8a3c-433e-a172-dde8caf58f5c', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', NULL, 'page_view', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:44.040Z"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check', NULL, '2025-08-15 08:04:44.106627+00'),
	('defac45f-158b-48c6-a0de-373ea90610c7', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '0977f2cf-a645-482d-b427-23160fa21fe7', 'quiz_start', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:45.102Z", "session_id": "0977f2cf-a645-482d-b427-23160fa21fe7"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:45.157983+00'),
	('40f765e6-9f9c-4d3f-8dfc-370e605614fc', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:45.710Z", "answer_key": "3", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a", "question_key": "attention_span"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:45.766486+00'),
	('6bffa96a-8ad3-41a9-bf97-5d7601531d03', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:48.051Z", "answer_key": "3", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a", "question_key": "organization"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:48.129971+00'),
	('83f5b365-9fe3-4fd8-9732-59808bb1811a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:48.624Z", "answer_key": "time_excellent", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a", "question_key": "time_management"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:48.679694+00'),
	('f5cffbe8-b65b-412a-af40-481c150c24a7', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:51.020Z", "answer_key": "4", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a", "question_key": "daily_functioning"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:51.078607+00'),
	('22c7e2f1-852e-4058-b549-01d75f097588', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'email_submitted', '{"lead_id": "941d8155-6d1d-44d4-b794-e812ccc34c1b", "quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:55.103Z", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:55.156161+00'),
	('1981b01b-a82e-43bd-9915-18f8af3ba1db', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'quiz_complete', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "metadata": {"total_score": 0}, "timestamp": "2025-08-15T08:04:55.252Z", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:55.297636+00'),
	('14e9ed94-13eb-4f67-8d55-d53a52e553f3', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'quiz_start', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:45.150Z", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:45.208892+00'),
	('f58b4f01-2759-4cde-b2bc-0c39d972dd17', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:46.400Z", "answer_key": "hyper_mild", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a", "question_key": "hyperactivity"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:46.470762+00'),
	('890044e5-040f-4cf7-a2ab-290a58a129dc', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:47.171Z", "answer_key": "impulse_quick", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a", "question_key": "impulsivity"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:47.228446+00'),
	('14a1c0d9-03c2-450c-a0a2-05b552bab360', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:49.547Z", "answer_key": "4", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a", "question_key": "emotional_regulation"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:49.599776+00'),
	('d6fd6976-5a0b-4b39-bef8-c8867984dab1', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 'e391dbd7-d747-441a-8e86-fa327f29309a', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:04:50.136Z", "answer_key": "social_adaptive", "session_id": "e391dbd7-d747-441a-8e86-fa327f29309a", "question_key": "social_situations"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:04:50.19626+00'),
	('b4773e2e-845a-4e5a-bc2c-458276845cca', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', NULL, 'page_view', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:02.102Z"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check', NULL, '2025-08-15 08:07:02.208935+00'),
	('27073db6-fcee-4fbe-8680-595c5f4ad9c3', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', NULL, 'page_view', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:03.014Z"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check', NULL, '2025-08-15 08:07:03.067252+00'),
	('15d633fb-6324-4210-abd9-cc0eeb7daa06', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '2aac3ad7-797e-466d-8f27-ddac3ab37b62', 'quiz_start', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:03.581Z", "session_id": "2aac3ad7-797e-466d-8f27-ddac3ab37b62"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:03.632208+00'),
	('4f3b546b-961f-48a8-9d66-2eddbf937732', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'quiz_start', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:03.590Z", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:03.638549+00'),
	('117ab82b-c7e6-43db-88e1-7d181026bbfa', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:04.164Z", "answer_key": "3", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962", "question_key": "attention_span"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:04.224466+00'),
	('bf2fdbe9-768a-49f2-97a8-fd8616140559', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:04.858Z", "answer_key": "hyper_mild", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962", "question_key": "hyperactivity"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:04.920069+00'),
	('0f46b334-e543-409f-ad46-4cd676e69171', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:05.500Z", "answer_key": "impulse_planned", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962", "question_key": "impulsivity"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:05.550671+00'),
	('b12c4536-8561-4548-a576-d5e07de56902', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:06.193Z", "answer_key": "3", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962", "question_key": "organization"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:06.25494+00'),
	('8d974df9-7f63-4ffa-8cd2-e563eb0d9f3a', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:06.665Z", "answer_key": "time_good", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962", "question_key": "time_management"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:06.720074+00'),
	('c1c89ea7-d2c8-4660-aca2-f01704bce49d', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:07.659Z", "answer_key": "2", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962", "question_key": "emotional_regulation"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:07.720981+00'),
	('6c12b14e-0be3-4ebd-bd1b-f9bb0968b573', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:08.282Z", "answer_key": "social_challenging", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962", "question_key": "social_situations"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:08.349703+00'),
	('b7a9afa4-16b0-4283-acf1-e2fa3a1eb464', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'answer_select', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:08.847Z", "answer_key": "3", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962", "question_key": "daily_functioning"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:08.909021+00'),
	('61012cc2-24ed-4024-aac6-9246a0e832fc', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'email_submitted', '{"lead_id": "941d8155-6d1d-44d4-b794-e812ccc34c1b", "quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "timestamp": "2025-08-15T08:07:13.506Z", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:13.556291+00'),
	('ced85abe-37a8-4f59-bddd-e445f9cabc7e', '474c52bb-c907-40c4-8cb1-993cfcdf2f38', '11e99634-27fb-4b5d-a7cc-580ce5876962', 'quiz_complete', '{"quiz_id": "474c52bb-c907-40c4-8cb1-993cfcdf2f38", "metadata": {"total_score": 0}, "timestamp": "2025-08-15T08:07:13.649Z", "session_id": "11e99634-27fb-4b5d-a7cc-580ce5876962"}', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36', 'http://localhost:3000/hu/adhd-quick-check/quiz', NULL, '2025-08-15 08:07:13.699785+00');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 9, true);


--
-- Name: admin_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."admin_settings_id_seq"', 190, true);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."questions_id_seq"', 221, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;

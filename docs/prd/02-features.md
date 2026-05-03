# Features

Tend has two surfaces — a clinician web portal and a patient mobile app — bridged by a privacy-preserving share-up layer. Features are inventoried below by surface, then by capability, with mockups embedded next to the features they illustrate.

::: info Convention
Each feature lists a one-line description, a user story, acceptance criteria (AC), and a priority — **must** for the v1 wedge, **should** for v1 nice-to-have, **could** for later. Cross-specialty notes flag where the same feature behaves differently in nutrition or drug adherence.
:::

---

## Clinician portal

### CL-1 · Pre-session brief (the glance) — `must`

A patient panel that's readable in under a minute and actionable in another. The single surface that makes Tend prescribable.

![Clinician — Patient panel — Chen Avraham overview](../mockups/clinician-patient-overview.png)

**User story.** *As a clinician about to start a session, I want a one-screen brief on this patient — adherence, what's flagged, the active prescription, a draft session note — so I can walk in prepared without a new inbox to clear.*

**Acceptance criteria:**
- Above-the-fold "At a glance" tile showing: adherence % within plan, episodes shared in the last N days, key continuous-behavior averages (e.g., 7-day sleep average), all calibrated against the prescription.
- "Latest signals" feed showing only what the patient explicitly shared, with timestamps and one-line summaries.
- "Active prescription" panel showing each prescribed task/behavior with cadence and the AI-assistance level configured per task.
- "AI assistance" tile making the configured guidance level visible (e.g., *Maya may guide grounding and exposure steps. May not initiate trauma processing. Hands off on crisis to human protocol.*).
- "Pre-session note draft" auto-generated from shared signals — clinician edits before signing; never sent to the patient without approval.
- "Pending share requests" tile showing summaries the system prepared but the patient hasn't yet decided to share.
- All fields read in under 60 seconds for an experienced user; common actions (acknowledge a flag, draft a prescription update) take under 60 seconds each.

::: info Cross-specialty
- **Nutrition:** "At a glance" swaps adherence-to-plan / weight-trend / GI-flare-count. Active prescription = meal plan, fluid targets, food avoidances.
- **Drug adherence:** "At a glance" swaps refill-on-time / missed-dose density / breakthrough-symptom log. Active prescription = regimen + timing + with/without-food rules.
:::

---

### CL-2 · Prescription authoring — `must`

The clinician writes the contract that the rest of the system serves. Discrete tasks, continuous behaviors, constraints, escalation thresholds, AI-assistance level — all structured.

![Clinician — Prescription authoring — Step 1: session notes → AI draft → review](../mockups/clinician-prescription-authoring.png)

**User story.** *As a clinician finishing a session, I want to paste or upload my session notes and have Tend draft a structured prescription I can review and approve, so I get a usable prescription out without typing a structured form from scratch.*

**Acceptance criteria:**
- Three-step flow: **Session notes → AI draft → Review & approve.**
- Session notes accept paste, .docx upload, or transcribed audio (pluggable EHR sources).
- AI draft extracts: discrete tasks (exposures, thought records, medication doses), continuous behaviors (sleep window, caffeine cut-off), constraints (no alcohol while titrating), check-in cadence, escalation thresholds, AI-assistance level.
- Every extracted field is editable; the clinician must approve before the prescription is sent to the patient device.
- Tend never sends a prescription without explicit clinician sign-off — verbatim copy: *"You will edit every field before signing. Tend never sends a prescription Chen-side without your approval."*
- Versioning: every saved prescription gets a version number, an approval date, and a "gentle pace" / "standard" / "intensive" tag for context.
- "Draft prescription" CTA disabled until at least the first task and one continuous behavior are populated.

**Why structured matters.** The prescription is what the channel knows about. If the prescription isn't structured, the channel can't safely operate.

::: info Cross-specialty
- **Nutrition:** AI draft extracts the meal plan, fluid targets, weighing cadence, food avoidances.
- **Drug adherence:** integrates with HMO pharmacy data (Israeli HMOs are a candidate) to pre-populate the regimen.
:::

---

### CL-3 · Inbox of shares — `must`

The clinician's view of *only* what each patient chose to share, across the panel. Not raw conversation, not surveillance — bullet-level summaries with patient-set scope.

![Clinician — Inbox of shares (cross-panel)](../mockups/clinician-inbox-shares.png)

**User story.** *As a clinician between sessions, I want a single feed of "patients chose to share these things with me" so I can triage what needs a reply, what informs next session, and what is just useful background — without raw transcripts I never asked for.*

**Acceptance criteria:**
- One feed across the whole panel; rows are share-events, not conversation messages.
- Each row shows: patient name + avatar, share-type tag (`episode`, `adherence`, `mood`, etc.), one-line summary, time received, "Open" CTA.
- Flagged shares (escalation tree fired, patient marked urgent) get a `flagged` tag and sort to the top.
- Filter by patient, type, and time window.
- Opening a share shows the bullet-level summary, never the raw transcript — unless the patient explicitly attached the transcript.
- Empty state copy reflects the philosophy: *"Nothing leaves the patient's device unless they approve it. Quiet inboxes are a feature."*

---

### CL-4 · Adherence & deterioration signal — `should`

The dashboard's most defensible value: alerting the clinician when a patient is drifting, even when sharing preferences keep raw data on-device.

**User story.** *As a clinician carrying 30 patients, I want at minimum an on-track / off-track signal for every patient — even the ones who share very little — so I don't miss deterioration during a quiet stretch.*

**Acceptance criteria:**
- For every patient on Tend, at least a binary on-track / off-track signal flows up by default — even if the patient shares nothing else.
- Adherence is computed objectively where possible (regimen timestamps, exercise completion, exposure recordings present), self-reported where not (patient marks task done with a one-line note).
- Deterioration risk uses validated-instrument trajectories scoped to the specialty (PHQ-9 / GAD-7 / SPIN for MH; weight/labs/ED-behavior count for nutrition; symptom recurrence / refill gaps for drug adherence).
- "Not on-track" alerts are based on Delgadillo's not-on-track effect — they earn their place clinically.
- The clinician can configure alert thresholds per patient as part of the prescription.

---

### CL-5 · Cross-panel patient list (the workspace) — `must`

The portal's home — every patient on Tend, with smart filters and a peripheral view of who needs attention.

**User story.** *As a clinician opening Tend in the morning, I want to see who's drifted, who's flagged, and who has shares waiting — without clicking into ten dashboards.*

**Acceptance criteria:**
- Left-rail patient list grouped by today's sessions, then panel-wide.
- Smart filters: *flagged*, *off-track*, *new shares*, *prescription expiring*.
- Inline adherence indicator and unread shares count per patient.
- Search by name; keyboard shortcut to jump-to-patient.

---

## Patient app

### PT-1 · Today + the companion (Maya) — `must`

The home screen and the conversational channel. Pull-first by design — the patient initiates the conversation.

![Patient — Today (pull-first home) and Maya companion chat](../mockups/patient-today-and-maya.png)

**User story.** *As a patient living between sessions, I want a calm home that reminds me of the work my clinician asked for, and a companion I can pull into when I need help — that knows my plan, talks like my clinician, and never pushes me unless I asked.*

**Acceptance criteria:**
- Home screen ("Today") shows: a contextual greeting, pending shares the patient hasn't reviewed yet, the named companion's standing line *("Whenever you're ready, I'm here")*, today's plan items pulled from the active prescription, and a footer link to the full plan.
- Plan items show prescribed cadence (e.g., 30 min, flexible) and source tag (`exposure`, `continuous`, etc.).
- The companion ("Maya" in the mockup — clinician-named) is a chat surface scoped to the prescription. It can walk the patient through prescribed activities (e.g., the 3-2-1 grounding sequence on screen), answer scope-appropriate questions, and de-escalate within the configured AI-assistance level.
- The companion **does not push proactively.** It's available; the patient opens it.
- Inline share-prompts appear in-flow, not as interruption: e.g., *"Tend prepared a summary of last night's episode for Dr. Levin. Want to review what would be shared?"* — never auto-sent.
- The companion is honest about its boundaries: *"On-device. Maya summarizes only what you approve."*
- Suggestion chips offer the next reasonable move (e.g., *"Walk me through the exposure"*, *"Something's off"*, *"I need a minute"*) — no infinite scroll of canned prompts.

::: info Continuity-as-treatment
In mental health, the clinician's voice staying present in the patient's life *is* part of the therapeutic mechanism. The named companion (Maya), the cloned-voice option (with consent — see Open Questions), and the way the LLM remembers prior sessions all carry weight here. This is where MH demands more design care than nutrition or drug adherence.
:::

---

### PT-2 · Plan and tracking — `must`

The patient's own view of what was prescribed and how they're actually doing — not as surveillance, as ownership.

![Patient — Plan (this week) and How you're tracking](../mockups/patient-plan-and-tracking.png)

**User story.** *As a patient, I want to see exactly what my clinician prescribed, this week's view of it, and a non-judgmental read on how I'm tracking — so I can take ownership without shame.*

**Acceptance criteria:**
- "Plan" tab shows the active prescription, version-stamped (*"Approved Apr 28 · v3 · gentle pace"*), grouped by week.
- Each prescribed item displays: title, type tag (`exposure` / `continuous` / `task`), cadence, duration, and clinician-written instructions verbatim (e.g., *"Listen to the recorded narrative. SUDS log before/after. Maya can guide if SUDS ≥ 7"*).
- "How you're tracking" tab shows a 14-day rhythm tile per practice — small heatmap-style grid, **never** ranked, **never** with streak counters.
- Headline copy is reflective, not gamified: *"Some pieces happened, others didn't. Worth talking through."*
- Clinician quote-back at the bottom personalizes the feedback in the clinician's voice (*"The mornings are the strong place. We'll build from there."*).
- No badges, no streaks, no points. Adherence is measured, not gamified — see decision in `04-open-questions.md`.

::: info Cross-specialty
- **Nutrition:** "Plan" = meal plan with swappable recipes; "How you're tracking" = adherence to plan + flag rate, never a weight-loss leaderboard.
- **Drug adherence:** "Plan" = regimen view; "How you're tracking" = on-time-dose %, missed-dose log, refill status.
:::

---

### PT-3 · Share with the clinician (the consent moment) — `must`

The load-bearing privacy surface. Bullet-level approval before anything leaves the device. Reversible until the next session.

![Patient — Share with Dr. Levin · Shares list and consent moment](../mockups/patient-share-consent.png)

**User story.** *As a patient, I want to see exactly what Tend has prepared to send my clinician, edit it, and choose what goes — so I can be honest without the cost of being surveilled.*

**Acceptance criteria:**
- "Today" view of the share queue: *waiting on you* and *already shared (last 7 days)*.
- Each waiting item shows type tag (`episode`, `adherence`), one-line summary, count of bullets, and "summary only · no transcript" disclosure.
- Opening a waiting item enters the **consent moment**:
  - Bullets are individually checkable. Default state varies by item type (e.g., adherence items default-on; transcript default-off).
  - "Also include?" section asks separately about full transcript inclusion. Default off, recommended off unless the clinician specifically asked.
  - Footer assurance: *"Encrypted, sent only to Dr. Levin. You can revoke before Tuesday's session and it disappears from her view."*
  - "Not now" and "Share with [clinician]" CTAs are equally weighted — declining is not friction.
- Already-shared items remain in the patient's transparency log indefinitely; the patient can see exactly what reached the clinician.
- **At-minimum signal exception:** even if the patient declines all shares, an on-track / off-track adherence boolean still flows up. This exception is disclosed during onboarding, not buried.

---

### PT-4 · Profile (transparency surface) — `must`

"What Tend knows about you" — every piece of context the system holds, where it came from, and what's on-device only vs. shared with the clinician.

![Patient — Profile · Transparency surface](../mockups/patient-profile-transparency.png)

**User story.** *As a patient, I want a single page that shows everything Tend knows about me — what came from my clinician, what came from me, what's on my phone only — and I want to be able to change any of it.*

**Acceptance criteria:**
- "From [Clinician]" card shows what the clinician shared *down* to the device: diagnosis & phase (e.g., *PTSD · Phase 2 (processing)*), trigger themes, preferred grounding techniques, what the AI-assistance level allows the companion to guide on.
- "From you" card shows on-device only: sleep average, episodes logged, mood check-ins, "things you don't want to talk about", any other patient-curated notes.
- Every field shows provenance and direction (down from clinician / up to clinician / on-device only).
- Every field is editable — the patient can rewrite trigger descriptions, refuse topics, and the change propagates immediately to the companion's behavior.
- Quick action: "Stop the companion entirely" — single tap, with confirm — even when the prescription enabled it, the patient retains an off switch.

---

### PT-5 · Notifications & nudges — `must`

Only what the patient and clinician set up in session. No proactive "how are you?" pings.

**User story.** *As a patient, I want reminders for the things I asked to be reminded about — and nothing else — so my phone doesn't become another source of pressure.*

**Acceptance criteria:**
- Notification types are limited to: prescribed activity windows (exposure window, sleep wind-down, med time, journal cue), share-decisions waiting, escalation events from the clinician.
- **No "how are you doing?" pings** — empirical basis: Elmer 2025.
- Each notification type can be toggled in settings.
- Notification copy is soft-imperative, not anxious-friendly (*"Café Albert window opens in 20 min"*, not *"How are you feeling about your exposure today? 😊"*).
- Quiet hours respected by default (22:30–07:30) unless prescription explicitly overrides for clinical reasons (e.g., a panic-protocol exposure scheduled for 02:00).

---

### PT-6 · In-the-moment activity walk-through — `should`

The companion guides the patient through a prescribed activity step-by-step, scoped to the AI-assistance level set in the prescription.

**User story.** *As a patient hitting a difficult moment at 11pm — the panic, the exposure, the spiral — I want my clinician's plan walked through with me, in their tone, without overstepping.*

**Acceptance criteria:**
- Activity walk-throughs are pre-authored per technique (3-2-1 grounding, imaginal exposure, thought record, BA scheduling) and bound to specific prescription items.
- The walk-through honors the AI-assistance level: e.g., *guided* allows the companion to lead step-by-step; *prompts-only* limits it to surfacing the patient's own next-step library; *off* disables walk-throughs entirely (the patient sees the prescription, no companion guidance).
- After the walk-through, the companion offers (never forces) to draft a share for the clinician.
- No step in any walk-through includes diagnostic or prognostic language — the system has no independent treatment opinion.

::: info Cross-specialty
- **Nutrition:** walk-through is a meal-plan substitution conversation (*"I'm at this restaurant — what works?"*), bounded by the meal plan, not generic nutrition.
- **Drug adherence:** walk-through is the catch-up rule (*"I forgot my morning dose — take it now or skip?"*), bounded by the regimen's escalation rules.
:::

---

### PT-7 · Integrations — `should`

Health-data integrations on the patient side; HMO/EHR integrations on the clinician side.

**User story.** *As a patient, I want my Apple Health / Fitbit data to feed sleep and activity context to Tend — locally — so I'm not retyping what my phone already knows.*

**Acceptance criteria:**
- Patient-side integrations: Apple Health, Google Health, Fitbit, MyFitnessPal (nutrition), smart pill bottles (drug adherence). All sync into on-device storage; share-up rules apply.
- Clinician-side integrations: EHR session-note import, HMO pharmacy data (Israeli HMOs as v1 candidate — Clalit / Maccabi / Meuhedet).
- Every integration is opt-in per patient and per data type.
- Provenance is preserved: a sleep number from Apple Health vs. a self-reported one is visibly distinct.

---

## Cross-cutting capabilities

### CC-1 · Per-patient gating — `must`

The clinician decides whether between-session AI conversation is therapeutically appropriate for this patient. May be wrong for someone working on tolerating distress without external regulation, or with dependency tendencies.

**Acceptance criteria:**
- Three configurable states per patient as part of the prescription: *full companion*, *prescription view only* (no conversational LLM, just plan + tracking), *fully disabled* (signal-only — adherence flows up, nothing else).
- Gating decision is captured in the prescription record with rationale; clinician can change it any time and the patient device reflects within minutes.

### CC-2 · Escalation engine — `must`

A safety-tree authored per specialty and per prescription. What the channel handles alone vs. what triggers in-app or out-of-band escalation.

**Acceptance criteria:**
- Tiers: in-flow handling (companion stays in scope), in-app escalation (companion narrows scope, switches to safety language, surfaces resources), out-of-band escalation (clinician notified, crisis hotline surfaced, emergency-services pathway).
- Mental health tree includes: suicidal ideation language → 988 / clinician notify; acute psychosis cues → emergency contact path; sustained avoidance → flag to clinician (non-emergency).
- Patient sees what escalation just happened and why — no silent surveillance.

::: info Cross-specialty
- **Nutrition:** signs of disordered eating → clinician notify, drop the plan-tracking gamification (gamification was already off — this is belt-and-braces).
- **Drug adherence:** dose-stacking risk, suspected overdose, severe side-effect language → poison control / ER referral.
:::

### CC-3 · Audit log — `must`

Every flow up, every flow down, every share decision, every escalation event — visible to the patient indefinitely.

**Acceptance criteria:**
- Patient can see: every share they approved, every share they declined, every prescription update from the clinician, every escalation event.
- Clinician can see: their own actions and their own configuration history. They cannot see the patient's declined shares.
- Logs are local-first; an integrity hash flows up so neither side can rewrite history without the other knowing.

---

## Priority summary

| ID | Feature | Priority |
|----|---------|----------|
| CL-1 | Pre-session brief (the glance) | must |
| CL-2 | Prescription authoring | must |
| CL-3 | Inbox of shares | must |
| CL-4 | Adherence & deterioration signal | should |
| CL-5 | Cross-panel patient list | must |
| PT-1 | Today + the companion (Maya) | must |
| PT-2 | Plan and tracking | must |
| PT-3 | Share with the clinician | must |
| PT-4 | Profile (transparency surface) | must |
| PT-5 | Notifications & nudges | must |
| PT-6 | In-the-moment activity walk-through | should |
| PT-7 | Integrations | should |
| CC-1 | Per-patient gating | must |
| CC-2 | Escalation engine | must |
| CC-3 | Audit log | must |

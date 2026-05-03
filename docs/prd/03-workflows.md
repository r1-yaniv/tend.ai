# Workflows

This section covers the end-to-end flows, the data model that backs them, the trust architecture that makes the flows defensible, and the per-specialty plug-in layer.

---

## 1. The system at a glance

Tend has **five core components** and a **per-specialty plug-in layer** that swaps in the specifics. The same product runs across mental health, nutrition, and drug adherence — only the contents of the plug-in change.

| # | Component | What it owns |
|---|-----------|--------------|
| 01 | **Contract** — Prescription model | Discrete tasks, continuous behaviors, constraints, check-in cadence, escalation thresholds, AI-assistance level. Authored in the clinician portal. |
| 02 | **Channel** — Conversational interface | LLM-mediated patient channel scoped to the prescription. Speaks in the clinician's tone — optionally cloned voice. |
| 03 | **Trust** — Local-first share-up | Conversation and detailed logs live on-device. A separate local service extracts shareable summaries the patient explicitly approves. |
| 04 | **Signal** — Adherence tracking | Objective where possible, self-reported where not. Two outputs: patient progress view, clinician adherence signal. |
| 05 | **Glance** — Clinician dashboard | Pre-session brief, not new inbox. Glance-readable in under 60 seconds. |
| + | **Per-specialty plug-in** | The five things that vary by specialty (see §6). |

---

## 2. The lifecycle (high level)

```
   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
   │  Session N       │ →  │  Between-visit   │ →  │  Session N+1     │
   │  (clinician)     │    │  (patient + AI)  │    │  (clinician)     │
   └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
            │                       │                       │
   prescription written       prescription executed      pre-session brief read
   prescription approved      shares queued + reviewed   prescription updated
   shared down to device      consented summaries up     loop closes
```

Each cycle ends with the next session's prescription, version-stamped and shared back down.

---

## 3. Workflow A — Prescription authoring (clinician)

**Trigger.** Clinician finishes a session.

**Steps.**

1. **Open the patient panel** (CL-1). Click "Update prescription".
2. **Step 1 of 3 · Session notes.** Paste, upload (.docx), or transcribe from a connected EHR source. The session-notes panel shows the clinician's raw text alongside a sidebar listing what Tend will produce: discrete tasks, continuous behaviors, constraints, escalation thresholds, AI-assistance level.
3. **Click "Draft prescription".** An LLM extracts a structured prescription from the session notes. The clinician never sees this draft on the patient device — it is staged for review.
4. **Step 2 of 3 · AI draft & edit.** Every extracted field is editable. The clinician can add, remove, retitle, change cadence, change escalation thresholds, and configure AI-assistance level per task.
5. **Step 3 of 3 · Review & approve.** Final read-through with a diff against the previous version. The clinician signs.
6. **Sync down.** The new prescription syncs to the patient device. The companion's behavior updates to match the new contract.

**Pre-conditions.** Patient is enrolled. Clinician has a session note (or uses dictation).

**Post-conditions.** Patient device holds an active prescription with a version number, an approval date, and the clinician's notes. The previous prescription is retained for audit and quote-back.

**Failure modes.**
- *AI extraction misses a field.* The clinician must complete it manually before signing — Tend never sends a partial prescription.
- *Clinician declines AI draft entirely.* They can author the prescription manually using the same structured form.
- *Patient device offline.* Prescription queues; syncs on next online window. Companion uses the previous version until the new one lands.

---

## 4. Workflow B — Between-visit loop (patient)

The default mode is **pull-first**. Push exists only for things the patient explicitly asked for in session.

### 4.1 The morning

1. Patient opens the app. Lands on **Today** (PT-1).
2. Greeting + pending shares prompt + today's plan items pulled from the active prescription.
3. The companion's standing line is visible: *"Whenever you're ready, I'm here."* It does not push.

### 4.2 A scheduled prescribed activity

1. Notification fires inside the agreed window (e.g., the imaginal-exposure window, the med time). **No "how are you?"** pings — only prescribed activity windows, share decisions, and clinician escalations qualify.
2. Patient opens the activity from the notification or the plan tab.
3. If AI-assistance level is *guided*, the companion offers to walk through it (PT-6); if *prompts-only*, the companion surfaces the patient's library and steps back; if *off*, the companion is invisible and the patient sees only the prescription content.
4. After the activity, the patient marks adherence (objective or self-reported, see §7) and optionally writes a one-line note.
5. The system prepares a share summary the patient may review later (PT-3).

### 4.3 An unscheduled difficult moment

1. Patient pulls the companion in (taps "Maya" tab or types from any screen).
2. Companion reads the active prescription, the on-device context, and the live message; routes to:
   - **In-flow handling** — within scope, in the clinician's tone.
   - **Activity walk-through** — if the patient asks for one and AI-assistance level allows it.
   - **In-app escalation** — narrows scope, surfaces grounding resources, says so.
   - **Out-of-band escalation** — surfaces crisis hotline / clinician-notify path; tells the patient what is happening.
3. Patient sees the companion's boundary disclosure when relevant: *"On-device. Maya summarizes only what you approve."*

### 4.4 Closing the loop

1. Tend prepares share summaries from the activity / episode / mood data captured.
2. Patient sees them in the **Share** tab (PT-3) — *waiting on you* and *already shared*.
3. Patient opens a waiting summary, enters the **consent moment**: bullet-level approval, optional transcript inclusion, encrypted send.
4. The summary syncs to the clinician's inbox of shares (CL-3) and the patient's audit log (CC-3).
5. **Default path even if the patient declines all shares**: an on-track / off-track adherence boolean still flows up. This is disclosed during onboarding.

---

## 5. Workflow C — The consent moment (load-bearing)

This is the privacy guarantee that makes the rest of the platform trustworthy. It deserves its own section.

```
  ┌─────────────────┐     ┌────────────────────┐     ┌───────────────────┐
  │ Local capture   │  →  │ Local share-up     │  →  │ Patient consent   │
  │ (channel + logs)│     │ classifier         │     │ moment            │
  └─────────────────┘     └────────────────────┘     └─────────┬─────────┘
                                                                │
                                                       ┌────────┴─────────┐
                                                       │                  │
                                              ┌────────▼─────┐  ┌─────────▼────────┐
                                              │ Approved →   │  │ Declined →       │
                                              │ E2E encrypt  │  │ stays on device  │
                                              │ + send       │  │ (or revocable)   │
                                              └──────────────┘  └──────────────────┘
```

**Two services on the device, deliberately separated.**

1. **Conversation service** — runs the channel, holds the live transcript and detailed logs. Its scope is "talk to the patient inside the prescription." It does not decide what to share.
2. **Share-up classifier** — a narrower, audited service whose only job is to extract bullet-level, summary-only outputs that match the share-up schema. It cannot exfiltrate raw transcripts. Its outputs surface in the consent moment.

**At the consent moment**, the patient sees:

- Every bullet the classifier extracted, individually checkable.
- A separate "Also include?" prompt for the full transcript — default off, recommended off unless the clinician specifically asked.
- Send / Not now CTAs of equal visual weight.
- An assurance line: *"Encrypted, sent only to [Clinician]. You can revoke before the next session and it disappears from their view."*

**Reversibility.** Until the next session, the patient can revoke any share. Revocation removes the share from the clinician's inbox and replaces it with a tombstone (so the clinician knows something was withdrawn — the existence of the share, not its contents, is part of the audit log).

**At-minimum signal exception.** The on-track / off-track adherence boolean is the only thing that flows up unconditionally. This exception is part of onboarding consent and the prescription contract, not buried.

---

## 6. The plug-in layer — five slots, filled differently

Five things vary by specialty. Nothing else does.

| Slot | Mental health | Nutrition | Drug adherence |
|------|---------------|-----------|----------------|
| **Prescription contents** | Exposures, thought records, BA, journaling | Meal plan, fluid targets, food avoidances, weighing cadence | Regimen, timing, with/without food, taper steps |
| **Compliance signal** | Self-report + SUDS, completion of structured tasks, frequency of practice | Meal logs / photos | Dose timestamps, refill data, smart-pillbox |
| **Deterioration signal** | PHQ-9 / GAD-7 / SPIN climbing; avoidance broadening; alliance ruptures | Weight, labs, energy, GI symptoms, ED behaviors | Symptom recurrence, missed-dose density, refill gaps |
| **Safety tree** | Suicidality, self-harm, acute psychosis, dissociative crisis, substance-use relapse | Disordered-eating cues, hypoglycemia, severe restriction | Overdose, dangerous interactions, severe side effects |
| **Clinical evidence base shaping the LLM** | CBT, IFS, ERP, BA, DBT skills — bounded by the prescription | Registered-dietitian counseling conventions | Pharmacist-counseling conventions |

The **Channel**, **Prescription model**, **Trust layer**, **Signal pipeline**, and **Glance dashboard** are the same product across specialties. Only the slots above are repackaged.

---

## 7. Data model (sketch)

The model below is illustrative — not a final schema. It is structured enough to keep design decisions consistent.

### Prescription (the contract)

```
Prescription
├─ id, version, approvedAt, approvedBy
├─ patientId, clinicianId
├─ specialty                        // mental-health | nutrition | drug-adherence
├─ assistanceLevel                  // off | prompts-only | guided
├─ pace                             // gentle | standard | intensive
├─ tasks: DiscreteTask[]
│   └─ { title, type, instructions, cadence, durationMin, walkThroughKey }
├─ behaviors: ContinuousBehavior[]
│   └─ { title, target, window, instructions }
├─ constraints: Constraint[]        // "no alcohol while titrating"
├─ checkinCadence
├─ escalationThresholds             // see SafetyTree
└─ contextSharedDown                // what the LLM is allowed to know
    ├─ diagnosis, phase
    ├─ triggerThemes
    ├─ groundingPreferences
    └─ topicsOff                    // patient-curated "don't talk about"
```

### Adherence record (the signal, on-device)

```
AdherenceEvent
├─ id, prescriptionId, taskId | behaviorId
├─ at, durationActualMin
├─ method: objective | self-report
├─ result                           // completed | partial | skipped
├─ difficulty                       // SUDS for exposures, 1-10 for others
├─ note                             // free-text, on-device only
└─ source                           // companion-walkthrough | manual-mark | integration
```

### Share record (what flows up)

```
Share
├─ id, prescriptionId, patientId, clinicianId
├─ preparedAt, decidedAt
├─ status                           // waiting | approved | declined | revoked
├─ type                             // episode | adherence | mood | summary
├─ bullets: SharedBullet[]
│   └─ { text, included: bool, defaultIncluded: bool }
├─ transcriptIncluded: bool         // separate decision
└─ scope                            // bullet-level | summary | with-transcript
```

### Signal (the always-on minimum)

```
OnTrackSignal
├─ patientId, clinicianId, prescriptionId
├─ window                           // rolling 7d / 14d
├─ adherencePctWithinPlan
├─ deteriorationFlags               // PHQ-9 climb, avoidance broadening, etc.
└─ status                           // on-track | drifting | off-track
```

The **OnTrackSignal** is the only object that flows up by default. Everything else flows up only via an approved Share.

---

## 8. Trust architecture

The privacy guarantee has to be load-bearing, not aspirational. Three structural choices make it real.

### 8.1 Local-first by default

Conversation transcripts, in-the-moment logs, and detailed adherence events live on-device, encrypted. The patient's keys never leave the device.

### 8.2 Two services, deliberately separated

The conversation service and the share-up classifier are isolated processes with distinct scopes. The classifier cannot reach the raw transcript except via the share-up schema. The conversation service cannot send anything outbound.

### 8.3 Audit by integrity hash

Every share decision and every prescription update is hashed; the hash flows up as part of the OnTrackSignal envelope. Neither side can rewrite history without the other noticing.

::: info Inheriting Intersession-Online's pattern
Gablonski 2019's Intersession-Online keeps private notes local and never syncs them. Tend extends that pattern: not just notes, but the entire conversation and detailed logs. The only path up is through the consent moment.
:::

---

## 9. Onboarding flow

A patient lands in Tend by **prescription**, not download. The onboarding sequence is shaped by that.

1. **Prescription event in clinic.** Clinician adds the patient to Tend during a session, generates an enrollment code or sends a link.
2. **App install + verify.** Patient installs Tend, enters the enrollment code, completes a phone-number verify.
3. **Read the prescription.** First screen is the prescribed plan, not a feature tour. Patient reads what their clinician asked them to do and the AI-assistance level configured.
4. **Trust disclosures, in plain language.**
   - "Your conversations live on this phone."
   - "Nothing leaves the phone unless you approve it — except an on-track / off-track signal to your clinician."
   - "Your clinician can change the AI's role at any time. You can stop the AI at any time."
5. **Optional: integrations.** Apple Health / Fitbit / pharmacy data connections — patient picks per data type.
6. **First Today screen.**

Time-to-first-useful-screen target: **under 3 minutes**.

---

## 10. Failure & recovery

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Patient device offline at sync time | Local sync queue retries on next online window | Companion uses the previous prescription until the new one lands. The clinician is informed via the dashboard if a prescription update has been pending > 24h. |
| Clinician revokes prescription mid-cycle | Patient device receives the revocation; companion rolls back to a maintenance state (plan view only, no walk-throughs) | Patient sees what changed and is told the clinician will follow up next session. |
| Escalation event when clinician is offline | Out-of-band path triggers (crisis hotline, emergency-services pathway). Clinician sees a delayed flag on next login | Out-of-band path is the safety net; clinician notification is the audit, not the primary safety mechanism. |
| Patient revokes a previously approved share | Clinician's view replaces the share with a tombstone "Withdrawn by patient" | The withdrawal itself is logged; the original contents are not retained on the clinician side. |
| Share-up classifier misclassifies | Patient sees the bullets at the consent moment and edits them | Patient is the last line of defense; the consent moment is intentionally adversarial to the classifier. |

---

## 11. Cross-specialty workflow checks

Before any feature ships, it is checked against the cross-specialty translation. If a behavior makes sense in MH but breaks in nutrition or drug adherence, it is either generalized or pushed into the plug-in layer.

::: info Worked example
**Streak counters.** Worked in a generic adherence app — clean dopamine loop. **Breaks** in nutrition (pro-ED dynamic), **breaks** in MH (perfectionism / shame loop). Verdict: streak counters are out of the universal core. The "How you're tracking" view uses neutral 14-day rhythm tiles instead — the same primitive without the gamified ranking.
:::

::: info Worked example
**"How are you?" push notifications.** Tested poorly in MH (Elmer 2025 — patients ignored). Tested poorly in nutrition (felt like food-shaming). Tested poorly in drug adherence (alarm fatigue). Verdict: removed from the universal core; only consented, concrete reminders push proactively.
:::

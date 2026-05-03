# Overview

## What Tend is

Tend is a clinician-prescribed software-as-a-medicine (SaaM) platform that operates in the **between-visit half of care**. The clinician writes the plan and shapes the channel; the channel speaks in their voice; the patient's data stays on the patient's device. Inside that frame, Tend helps the patient execute the prescribed work, surfaces deterioration earlier, and feeds an on-track / off-track signal — at minimum — back to the clinician.

We start with **outpatient mental health** (psychotherapy and psychiatry). The architecture is designed to generalize to **nutrition** and **drug adherence**, which we use as cross-specialty design checks throughout the PRD.

::: info Terminology
**Causal arc the product operates on:**

> between visits → prescription execution → adherence / compliance / deviation → deterioration

- **Between visits** — days/weeks between clinician encounters (1–4 weeks in psychotherapy).
- **Prescription execution** — the patient actually doing the prescribed work.
- **Adherence / compliance** — used interchangeably: did the patient do the work?
- **Deviation** — gap between prescribed and done.
- **Deterioration** — the negative outcome of sustained deviation.
- **Symptoms / relapses** — separately, fluctuations that aren't part of the therapeutic process (the 2am panic, the rumination spiral, a GI flare). Real things happening in the gap that the system has to accommodate even when the prescription doesn't directly address them.
:::

## The problem

In outpatient mental health, treatment is delivered as 45–60 minute sessions, typically 1–4 weeks apart. Between any two sessions, the patient lives roughly 99% of their life. That 99% is where:

- **The prescribed therapeutic work is meant to happen** — exposures, thought records, behavioral activation, journaling, practice. It's the load-bearing mechanism by which session content becomes durable change (Bennett-Levy 2003; Kazantzis 2000, 2010, 2016).
- **The actual symptoms occur** — the panic at 2am, the rumination spiral, the dissociative episode, the urge to drink.

Right now this between-visit half of care is:

- **Unsupported.** The patient has no scaffolding. Partial compliance is the default. The treatment plan exists but has nowhere to live between Tuesdays.
- **Invisible.** The clinician inherits a curated retrospective at the next session, not a continuous picture. Recall bias trims the signal before it arrives.
- **Unmeasured.** Trends that should trigger action — adherence drift, avoidance broadening, instrument scores climbing — don't surface until the patient has been off-track for weeks.

::: info Cross-specialty
The same structure exists in **nutrition** (inter-session work = meal plan, deviation = off-plan meal, deterioration = labs / weight / ED behaviors trending wrong) and **drug adherence** (inter-session work = the regimen, deviation = missed/doubled dose, deterioration = the underlying condition recurring).
:::

## Target users

| Role | Who | What they need from Tend |
|------|-----|--------------------------|
| **Clinician** (lead) | Outpatient psychologist, psychiatrist, social worker, dietitian, prescribing physician | A pre-session brief, not a new inbox. Time saved per patient — never more time spent. |
| **Patient** | Outpatient under active care, sees their clinician on a 1–4 week cadence | A place to handle a real moment between visits, do the prescribed work, and decide what to share — without 24/7 surveillance. |
| **Clinic / HMO admin** *(downstream)* | Israeli HMO, US group practice, German DiGA-track clinic | Reimbursement story. Outcome data. Compliance with the local DTx / SaMD regulatory category. |

The primary buyer is the **clinician** (or the clinic that prescribes for them). The patient is the primary user but never the buyer of record — Tend is prescribed, not downloaded off an app store.

## Goals (honest claims)

Tend is designed to:

1. **Improve adherence** to clinician-prescribed inter-session work — measurably, against a documented baseline.
2. **Surface deterioration earlier** — when validated-instrument trajectories climb, when avoidance broadens, when sustained deviation appears.
3. **Reduce friction** in the loop the clinical literature already validates (homework + outcome feedback + alliance) without adding clinician workload.
4. **Stay safely within the prescription** — the system has no independent treatment opinion. Every behavior either executes the clinician's plan, supports the patient inside it, or surfaces a signal the clinician asked to see.

## What we are explicitly NOT claiming

To stay honest and to keep the regulatory path clean:

- ❌ NOT that the app reduces depression or anxiety symptoms on its own.
- ❌ NOT that it substitutes for therapy.
- ❌ NOT that it provides 24/7 AI counseling.
- ❌ NOT that it has an independent treatment opinion.

The claim is **force-multiplier on the clinician**, not **replacement for the clinician**.

## Why this is newly tractable

The gap isn't open because the field hasn't noticed. It's open because closing it has, until now, been operationally impossible:

- **Clinicians cannot scale themselves.** A typical caseload is 20–40 patients. Per-patient between-session attention beyond a single short message is not viable on standard reimbursement.
- **Existing tools are either generic or surveilling.** Self-help apps don't know your treatment plan and don't talk to your clinician. Symptom-trackers record but don't intervene. Always-on monitoring crosses a line patients are right to defend.
- **Privacy is structurally undersolved.** Patients won't be honest if they think the therapist sees everything; therapists won't engage if they can't trust the data. The Intersession-Online project (Gablonski 2019) flags this and partially solves it via local-only private notes — a pattern we inherit and extend.
- **Effect sizes for general digital MH are small.** The field has been burned by overclaiming. The honest claim — better adherence, earlier deterioration detection — is harder to market and easier to dismiss, so it hasn't been the headline.

Three things changed:

1. **LLMs that can hold a clinician-personalized therapeutic conversation** (and can be tightly scoped to what the clinician shared).
2. **Local-first cryptography** that genuinely keeps secrets on-device while still letting summaries flow up by consent.
3. **A regulatory category** — Software as a Medical Device, prescription DTx, FDA SaMD, Germany DiGA, Israeli HMO formularies — that supports a clinician-prescribed model.

## Architecture summary

Five components and a plug-in layer. Detailed in `03-workflows.md`.

| # | Component | One-liner |
|---|-----------|-----------|
| 01 | **Contract** — Prescription model | Discrete tasks, continuous behaviors, constraints, check-in cadence, escalation thresholds, AI-assistance level. |
| 02 | **Channel** — Conversational interface | LLM-mediated patient channel. Knows only what the clinician shared. Speaks in the clinician's tone. |
| 03 | **Trust** — Local-first share-up | Conversation and detailed logs live on-device. A separate local service extracts shareable summaries the patient explicitly approves. |
| 04 | **Signal** — Adherence tracking | Objective where possible, self-reported where not. Two outputs: patient progress view, clinician adherence signal. |
| 05 | **Glance** — Clinician dashboard | Glance-readable before a session. Pre-session brief, not new inbox. |
| + | **Per-specialty plug-in** | Swaps in the specifics: MH uses exposures & PHQ-9; nutrition uses meal plans & weight; drug adherence uses regimens & pharmacy data. |

## Constraints

These are non-negotiables that shape every design decision:

- **No extra clinician workload.** If using Tend costs the clinician more time than it saves, the platform fails — regardless of how good the patient experience is.
- **Patient data stays on-device by default.** Conversations, in-the-moment notes, detailed logs are encrypted on the patient's device. Only what the patient explicitly approves flows up. **At minimum, an on-track / off-track signal always reaches the clinician.**
- **Pull-first.** No "how are you doing?" surveillance pings. Proactive nudges only for things the patient and clinician explicitly set up in session (an exposure window, a med time, a journal cue).
- **No independent treatment opinion.** The LLM acts only on what the clinician shared (context + prescription). It does not invent therapy, regimens, or meal plans.
- **Per-patient gating.** The clinician can enable, restrict, or fully disable the conversational layer per patient. It may be wrong for a patient working on tolerating distress without external regulation, or for one with dependency tendencies.
- **Cross-specialty by design.** Mental health first, but the architecture must not lock to psych-only.

## Positioning

| Existing tool | What it does | What Tend adds |
|---|---|---|
| Self-help / journaling apps (Headspace, Calm, BetterHelp) | Generic content, off-prescription | Ties to the specific plan the clinician wrote; reports back to that clinician |
| Symptom-tracking apps (mood diaries, daylio) | Records, doesn't intervene | Acts inside the prescribed work; alerts on deterioration |
| Generic AI companions (ChatGPT, character.ai) | Open-ended, no clinical context | Bounded by the clinician's prescription; no independent opinion |
| Intersession-Online (Gablonski 2019) | Closest research prototype; local notes pattern; 7×3 intervention matrix | LLM-native conversation, modern UX, US/Israeli clinical distribution |
| Smart-pillbox / refill-reminder DTx | Single-modality compliance | Universal channel + plug-in for the specialty |

Tend's defensible position is **between-visit infrastructure**, not a competing therapy or a competing AI companion.

## Evidence base

This isn't a hypothesis. The clinical literature is clear that the inter-session half is where outcome is decided.

| Paper | What it gave us |
|---|---|
| **Kazantzis 2010, 2016; De Araujo 1996; Wheaton 2020** | Homework adherence is the strongest single predictor of outcome in CBT/exposure therapy. The mediator effect is large enough that other predictors are often *fully* mediated by adherence (Simpson 2011). |
| **Tuerk 2023 — RCT of OC-Go for childhood OCD** | Strongest evidence for the homework-app wedge. Adherence 68% → 83%. *d* = 0.72 on CYBOCS at week 12. |
| **Delgadillo 2018, Lancet Psychiatry (n=2,233)** | Outcome-feedback specifically helps not-on-track patients (*d* ≈ 0.23 PHQ-9) and reduces deterioration. The signal works; clinicians just don't have it. |
| **Elmer 2025, JMIR — JITAI feasibility** | Patient-asked "do you want support?" trigger beat fixed cutoffs and personalized SPC controls. Distress-based pings annoy people; explicit-need pings get used. Empirical basis for **pull-first**. |
| **Gablonski 2019 / Stach 2020 / Hu 2019** | Intersession-Online — closest existing system. iOS+Android+web, 7×3 intervention algorithm, **private-notes-stay-local privacy pattern we inherit.** |
| **Wang/Passmore 2026 SLR; Bennett-Levy 2003** | Inter-session activity is a recognized therapeutic primitive (CBT, experiential learning, Fitts/Posner). Coaching clients resent the word "homework" — informs patient-facing copy ("practice", "between-session work"). |
| **Das & Singh 2025** | DTx regulatory landscape (FDA SaMD, Germany DiGA, India ABDM). MH = 25% of DTx market. Confirms SaaM is a viable, regulatable category. |

We are not inventing a new therapeutic mechanism. We are operationalizing a known one that the field already knows drives outcomes.

PDFs of cited research live in `docs/assets-and-research/`.

## Document map

- **`01-overview.md`** *(this file)* — problem, users, goals, constraints, evidence.
- **`02-features.md`** — feature inventory by role, with mockups.
- **`03-workflows.md`** — end-to-end flows, data model, trust architecture, plug-in layer.
- **`04-open-questions.md`** — unresolved decisions and the trade-offs behind them.
- **`05-ui-ux.md`** — design direction, screen inventory, mockup gallery.

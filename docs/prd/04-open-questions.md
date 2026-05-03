# Open Questions

This is the parking lot for unresolved decisions, gaps, and assumptions that need validation. Each row in the summary tables references a detail section below with options and trade-offs.

::: info Convention
- **Open** = unresolved.
- **~~Resolved~~** = decided; row is struck through and the **Decision** column is filled in. The detail section is converted from `::: warning` to `::: info`.
- **Never delete a row.** Strikethrough preserves the history of what was considered.
:::

---

## Summary tables

### S — Strategy & wedge

| # | Question | Status | Decision |
|---|----------|--------|----------|
| S1 | Which specialty proves the platform fastest? | Open | — |
| S2 | What is the v0 / POC scope? | Open | — |
| S3 | Israeli HMO go-to-market — first customer? | Open | — |
| S4 | Naming — is "Tend" the final answer? | Open | — |

### P — Product & UX

| # | Question | Status | Decision |
|---|----------|--------|----------|
| P1 | Delphi-style cloned voice — opt-in for both parties? | Open | — |
| P2 | Engagement vs. motivation — gamification posture? | ~~Resolved~~ | ~~No streaks, no badges, no points. Neutral 14-day rhythm tiles instead.~~ |
| P3 | Where do "symptoms / relapses" sit in the causal arc? | Open | — |
| P4 | What's the right name for the conversational companion? | Open | — |
| P5 | Persona tuning surface — clinician control of tone? | Open | — |

### A — Architecture & trust

| # | Question | Status | Decision |
|---|----------|--------|----------|
| A1 | At-minimum signal — exactly what's the floor? | ~~Resolved~~ | ~~Binary on-track / off-track adherence boolean. No clinical content.~~ |
| A2 | Where does the share-up classifier run — fully on-device? | Open | — |
| A3 | Voice cloning — Delphi cooperation vs. in-house? | Open | — |
| A4 | Audit-log retention on the clinician side after revocation? | Open | — |

### R — Regulatory & clinical

| # | Question | Status | Decision |
|---|----------|--------|----------|
| R1 | Regulatory category — FDA SaMD, DiGA, or HMO formulary first? | Open | — |
| R2 | Clinical pilot design — what does v1 measure? | Open | — |
| R3 | What's the prescription-update review SLA? | Open | — |
| R4 | Liability when the escalation tree fails? | Open | — |

### E — Engagement & objective measurement

| # | Question | Status | Decision |
|---|----------|--------|----------|
| E1 | What's objective vs. self-reported per specialty? | Open | — |
| E2 | How do we keep self-reporting honest without gamifying? | Open | — |

---

## S — Strategy & wedge

### S1 — Which specialty proves the platform fastest?

::: warning GAP
Three candidates, each with a different evidence cycle and reimbursement story:

- **(a) Mental health.** Biggest gap. Hardest to prove (small effect sizes on distress; messy outcome measurement). But it's where continuity-as-treatment makes the architecture *most* differentiated — the named persona / voice / narrative continuity pieces have outsized therapeutic weight. Domain authority is strongest here.
- **(b) Nutrition.** Cleaner behavioral endpoints (weight, labs, ED behaviors). Faster pilot. Narrower continuity story — the dietitian's voice in your head is real but less load-bearing than the therapist's.
- **(c) Drug adherence.** Cleanest signal of all (refill data + smart caps + pharmacy integration). Fastest reimbursement (especially via Israeli HMOs). But the narrowest conversational story — closer to a smart pillbox than a co-therapist.

**Trade-off.** MH is where Tend is most architecturally differentiated, but where proving outcome takes longest. Drug adherence is the inverse. Nutrition is in between.

**Why it matters.** A wrong wedge wastes 12–24 months. Yaniv has explicitly raised this: *"What if we need to be provably better just to get licences? Maybe then it is wrong to start with mental health because it will be really hard to prove."*

**Possible resolution path.** Start MH for design depth (continuity-as-treatment shapes the platform), but instrument from day one to make the cross-specialty option live — explicitly run a parallel drug-adherence pilot with an Israeli HMO if a clinical / regulatory signal lags.
:::

### S2 — What is the v0 / POC scope?

::: warning GAP
Yaniv's slim POC suggestion: **prescription compliance + did-the-prescribed-thing-happen + clinician signaling.** Everything else stacks on top.

- **Option A — Slim:** Prescription model + adherence tracking + on-track / off-track signal. No conversational layer. Prove the dashboard is useful before investing in the channel.
- **Option B — Channel-first:** Prescription model + the companion (PT-1) + share-up consent (PT-3). Prove the patient experience before building the clinician dashboard depth.
- **Option C — Vertical slice:** All five components, but for one specialty and one disorder profile (e.g., MH / OCD with ERP — the OC-Go evidence base is cleanest).

**Trade-off.** A is fastest to clinical pilot but doesn't differentiate from Intersession-Online. B differentiates immediately but harder to prove without the clinician glance. C is the most defensible product story but the longest road.
:::

### S3 — Israeli HMO go-to-market — first customer?

::: warning GAP
Israel has four HMOs (Clalit, Maccabi, Meuhedet, Leumit), enrollment is mandatory, and HMOs already operate chronic-disease programs and pharmacy data systems.

- **For:** Cleaner B2B sale than US clinic-by-clinic. Pharmacy integration unlocks objective drug-adherence signal. Health-tech-friendly regulator.
- **Against:** Slow procurement. HMO pilots can take 12–18 months. May not align with MH wedge if HMO interest is in chronic-disease compliance.

**Possible resolution path.** Pursue HMO conversations in parallel with US/private-clinic pilots; let the first signed pilot decide the wedge.
:::

### S4 — Naming — is "Tend" the final answer?

::: warning GAP
Three top candidates surfaced during naming exploration:

- **Tend.** Warm, single-syllable verb. Wins both the clipboard test and the 2am test. Most ownable. Trademark TBD.
- **Cadence.** Rhythm-of-care metaphor. Likely trademark blocker (Cadence Health exists in remote patient monitoring).
- **Throughline.** Precise on the continuity thesis, but cold for the 2am moment.

Other directions explored: Latin/Greek roots (Praxis, Continua, Iter), warm verbs (Keep, Mend), compound names (Carepath).

**Resolution gate.** Trademark search → .com availability → Hebrew/English readability check → final.

The current artifacts (deck, mockups, this PRD) use **Tend** as a working name.
:::

---

## P — Product & UX

### P1 — Delphi-style cloned voice — opt-in for both parties?

::: warning GAP
Delphi (delphi.ai) clones a clinician's voice/persona so the companion can sound like *your* clinician between visits. Clinically powerful (continuity-as-treatment), ethically fraught.

**For:**
- Empirical and theoretical support for continuity-as-treatment (Orlinsky/Geller intersession process; working alliance internalization).
- Differentiates Tend from any generic-AI competitor.

**Against:**
- A patient hearing their clinician's voice say something the clinician didn't write is a serious failure mode.
- Clinicians may not consent to having their voice modeled, even for their own patients.
- Disclosure cadence — when do we re-prompt for consent?

**Probable resolution.** Opt-in for both parties. Explicit AI disclosure on every interaction. Periodic re-consent (e.g., every prescription update). Hard-coded boundaries: cloned voice never delivers diagnostic or prognostic content; only walks through prescribed protocols and returns the patient to clinician contact for anything outside scope.

**Open.** Whether to ship voice cloning in v1 or defer to v2.
:::

### ~~P2 — Engagement vs. motivation — gamification posture?~~

::: info Decision
**No streaks, no badges, no points. Neutral 14-day rhythm tiles instead.**

**Reasoning:**
- Streaks break in nutrition (pro-ED dynamic).
- Streaks break in MH (perfectionism / shame loop on a missed day).
- Wang/Passmore 2026 SLR: coaching clients resent the word "homework" for the same power-imbalance reason.
- Yaniv's stated preference: "no consumer-app tactics in clinical contexts."

**How to apply.** The "How you're tracking" view (PT-2) uses 14-day rhythm tiles — the same primitive that lets the patient see their pattern, without the gamified ranking. Clinician quote-back personalizes the feedback in their voice rather than via badges.

The honest framing for engagement is: **the system is opened because something real happened**, not because the patient is chasing a streak.
:::

### P3 — Where do "symptoms / relapses" sit in the causal arc?

::: warning GAP
The current arc (`between visits → prescription execution → adherence / compliance / deviation → deterioration`) doesn't have a slot for symptoms. Symptoms / relapses are real things happening in the gap (the 2am panic, the GI flare, the urge to drink) that are not part of the therapeutic process per se.

- **Option A — Add a parallel track.** `symptoms` is a separate input that the channel handles, signal pipeline measures, and that *can* drive deterioration without first driving deviation.
- **Option B — Treat symptoms as deviation triggers.** A 2am panic is the moment where deviation is most likely; the channel's job is to prevent the deviation. Don't add a slot — bake it into the channel's definition.

**Why it matters.** Affects the data model (do we have a `Symptom` entity?) and the channel's escalation logic.
:::

### P4 — What's the right name for the conversational companion?

::: warning GAP
The mockups use **Maya** as a placeholder ("Maya · Dr. Levin's companion · here for you"). This is the name on the patient device, not the brand name.

- **Option A — Per-clinician name.** The clinician picks the companion's name. Carries the continuity-as-treatment design weight.
- **Option B — Per-patient name.** The patient picks. Maximum personalization but breaks the clinician's-voice pattern.
- **Option C — Single brand-wide name.** "Tend" the companion. Simple, but loses the personalization argument.

**Probable resolution.** Per-clinician with the clinician choosing during onboarding the patient. Patient can override only with clinician consent.
:::

### P5 — Persona tuning surface — clinician control of tone?

::: warning GAP
The clinician should be able to tune the companion's persona:
- Tone (warm / clinical / direct).
- Verbosity.
- Whether to use the clinician's first or last name when quoted.
- Cultural / linguistic adaptations (Hebrew vs. English, religious context).

**Open.** Whether this is a separate "persona settings" surface in the portal, or embedded in the prescription authoring flow.
:::

---

## A — Architecture & trust

### ~~A1 — At-minimum signal — exactly what's the floor?~~

::: info Decision
**Binary on-track / off-track adherence boolean. No clinical content.**

The minimum signal that always flows up — even when the patient declines all shares — is a single boolean per patient per rolling window. It carries no episode detail, no transcript, no mood.

**Why.** Without a floor, a quiet patient looks identical to an off-track patient. With a floor, the clinician can detect deterioration during quiet stretches without surveillance.

**How to apply.** Disclosed during onboarding consent (in plain language, not buried). Captured as part of the prescription contract. Implemented as `OnTrackSignal` in the data model (see `03-workflows.md` §7).
:::

### A2 — Where does the share-up classifier run — fully on-device?

::: warning GAP
The share-up classifier extracts shareable summaries from on-device data. Two architectural options:

- **Option A — Fully on-device.** A small/medium LLM runs the classifier locally. Highest privacy floor. Constrained by device compute (especially older Android devices).
- **Option B — Ephemeral server with E2E encryption.** Conversation never persists server-side; classifier runs in a sealed enclave per request. Better classification quality. Adds attack surface.

**Trade-off.** A is the cleanest privacy story; B may be needed for nuanced classification, especially in MH where the difference between "concerning rumination" and "ordinary venting" is subtle.

**Possible resolution path.** Start with A; allow patient opt-in to B if classification quality drives a meaningful patient-experience gap.
:::

### A3 — Voice cloning — Delphi cooperation vs. in-house?

::: warning GAP
If voice cloning ships (P1), where does it run?

- **Delphi cooperation.** Faster to ship. Their model is purpose-built for cloned-persona conversations. Cost: a third party in the trust loop.
- **In-house.** Slower; requires investment in voice-cloning capability. Keeps the trust loop inside Tend.

**Open.** Strategic call — partner-friendly path or own-the-stack path.
:::

### A4 — Audit-log retention on the clinician side after revocation?

::: warning GAP
When a patient revokes a share, the share contents disappear from the clinician's view and a tombstone replaces them. But audit-log questions remain:

- Do we keep the *fact of revocation* in the clinician's view permanently, or expire it after the next session?
- Do we let the clinician know *what type* was revoked, or just *that* something was revoked?

**Trade-off.** More clinician transparency vs. more patient autonomy / less weaponization of the audit log.
:::

---

## R — Regulatory & clinical

### R1 — Regulatory category — FDA SaMD, DiGA, or HMO formulary first?

::: warning GAP
Three viable regulatory paths:

- **FDA SaMD (US).** Largest market. Slowest path. Requires significant clinical evidence.
- **Germany DiGA.** Europe's prescription DTx fast track. Requires CE marking + DiGA-specific evidence requirements. Fast reimbursement once listed.
- **Israeli HMO formulary.** Smallest market but mandatory enrollment makes it a clean B2B sale; aligns with S3.

**Trade-off.** US ROI is biggest, Israeli ROI is fastest, German ROI is in between. The wedge specialty (S1) constrains this.
:::

### R2 — Clinical pilot design — what does v1 measure?

::: warning GAP
The honest claim is *adherence + earlier deterioration detection*, not symptom reduction. Pilot design has to match.

- **Primary endpoints.** Adherence to clinician-prescribed activities (objective where possible) and time-to-deterioration-detection.
- **Secondary endpoints.** Validated-instrument trajectories (PHQ-9, GAD-7, etc.), patient-reported alliance quality, clinician time-saved.
- **Decoy endpoints.** Don't measure "symptom reduction" as primary — it sets up the field's familiar disappointment with digital MH effect sizes.

**Open.** Sample size, control arm design, pre-registration plan.
:::

### R3 — What's the prescription-update review SLA?

::: warning GAP
When a clinician updates a prescription mid-cycle, how fast does it propagate to the patient device?

- Online: target < 5 minutes.
- Offline: queue + retry; alert clinician if pending > 24h.

**Open.** Whether the patient is notified about every update, or only "material" ones (and what counts as material).
:::

### R4 — Liability when the escalation tree fails?

::: warning GAP
The escalation tree (CC-2) is the safety mechanism. Failure modes:

- False negative: companion fails to escalate when it should.
- False positive: companion escalates when it shouldn't (e.g., panics a patient into ER who didn't need it).

**Open.** Liability framework. Likely lives between the prescription contract (clinician-authored thresholds) and standard SaaM disclaimers, but legal review is required before pilot.
:::

---

## E — Engagement & objective measurement

### E1 — What's objective vs. self-reported per specialty?

::: warning GAP
Adherence tracking has two halves: what we can measure objectively, and what we have to ask the patient. The split varies by specialty.

| | Objective | Self-reported |
|---|---|---|
| Mental health | Time spent in companion-walked-through activity, recording-listened-through, sleep window via Apple Health | SUDS, mood, "did the in-vivo exposure happen" |
| Nutrition | Weight (scale integration), photo-logged meals (verifiable but not objective) | Cravings, urges, off-plan meals not photographed |
| Drug adherence | Smart-pillbox events, refill timestamps, pharmacy data | Side effects, breakthrough symptoms |

**Open.** What's the minimum objective floor for each specialty? Is photo-logging "objective" or "verifiable self-report"?
:::

### E2 — How do we keep self-reporting honest without gamifying?

::: warning GAP
Streaks would gamify and break (P2). But honest self-reporting still needs scaffolding.

- **Option A — Pure neutral.** Patient marks task done with a one-line note. No feedback loop.
- **Option B — Reflective feedback.** The "How you're tracking" view shows patterns ("Mornings landed. Evenings drifted") that invite reflection without ranking.
- **Option C — Clinician quote-back.** The clinician's voice in-app quotes back the pattern ("The mornings are the strong place. We'll build from there.") — already in the mockup.

**Probable resolution.** B + C. A leaves no scaffolding; B + C provide reflection without the streak/badge dynamic.
:::

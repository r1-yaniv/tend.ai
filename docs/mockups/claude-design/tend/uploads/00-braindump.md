
# Synthesised Braindump

## Notes

:::info A note on terminology
**Between visits**: the days or weeks between clinician encounters (1–4 weeks in psychotherapy). 
**Prescription execution**: the patient actually doing the work the clinician prescribed. 
**Symptoms**: a fluctuation in the patient's condition that is not part of the therapeutic process. 
**Adherence/Complaince**: are used interchangeably here to mean "did the patient do the work?"
**Deviation**: the gap between what was prescribed and what was done. 
**Deterioration**: the negative outcome of deviation.
:::

:::info A note on scope

We start with **mental health** — specifically outpatient psychotherapy and psychiatry where care is delivered through periodic sessions with a single clinician. Explanations below are written with that in mind. However, the underlying primitive — *the half of care that happens between visits* — is universal across clinician–patient relationships. We therefore cross-check the concepts against two other specialties:

- **Nutrition / dietetics** — where the prescription is a meal plan, the deviation is an off-plan meal or unhealthy eating, and the deterioration is outcome regressing (weight, labs, energy, gut symptoms, eating-disorder behaviors — whatever the plan was written to move).
- **Drug adherence** — where the prescription is a regimen, the deviation is a missed dose, and the deterioration is the underlying condition recurring.
:::


## The problem space

In outpatient mental health, treatment is delivered as a series of 45–60 minute sessions, typically 1–4 weeks apart. Between any two sessions, the patient lives roughly 99% of their life. That 99% is where:

- **The prescribed therapeutic work is meant to happen** — exposures, thought records, behavioral activation, journaling, practice. It's the load-bearing mechanism by which session content becomes durable change (Bennett-Levy 2003; Kazantzis et al. 2000, 2010, 2016).
- **The actual symptoms occur** — the panic at 2am, the rumination spiral, the dissociative episode, the urge to drink.

Right now, this between-visit half of care is **unsupported** - the patient has no scaffolding, leading to partial compliance/adherence, which drives deviation and over time deterioration and suboptimal effectiveness of the treatment. 
It's also **invisible** and **unmeasured** so the clinician depends on retrospective self-report that is prone to recall bias, and misses an opportunity to act on meaningful, accurate signals.

::: info Cross-specialty
The same structure exists outside mental health. In **nutrition**, the inter-session work is the meal plan; the "symptoms" are cravings, binge urges, energy crashes, GI flares; deviation is an off-plan meal or skipped log; deterioration is weight, labs, or eating-disorder behaviors trending wrong. In **drug adherence**, the inter-session work is the regimen; the symptoms are side effects and breakthrough symptoms of the underlying condition; deviation is a missed or doubled dose.
:::


## The core vision

**We build the infrastructure for the between-visit half of care.** Allowing a feasible way for the clinitian to maintain oversight and in the moment communication with the patient, without adding a significant workload.

1. **The clinician is the lead.** The app is a co-therapist "prescribed" by the clinician where it can be an effective tool in the treatment. Every behavior of the system either executes the clinician's plan, supports the patient inside that plan, or surfaces a signal the clinician asked to see. The system does not have an independent treatment opinion.
2. **The patient owns their data.** Raw conversation, in-the-moment notes, and detailed logs live on the patient's device. What flows up to the clinician is *only* what the patient has approved. Vice versa, patient context shared to their device (for personalization, for example) is only what the clinitian has explicitily shared.
3. **Pull-first, with directed push.**


## Solution architecture and components

### Core Components

<!-- TODO: Redo the writing here. -->

**1. Prescription model.** A structured representation of what the clinician asked the patient to do between sessions, including: discrete tasks (do an exposure, complete a thought record), continuous behaviors (sleep window, no caffeine after 2pm), constraints (no alcohol while titrating), check-in cadence, and explicit escalation thresholds. Authored in the clinician portal, optionally drafted by an AI from session notes (with clinician sign-off). The prescription is the contract that the rest of the system serves.

The prescription includes configuration of the assistance level the app is expected to provide, with the most prominent example being whether or not the LLM should guide the patient thorugh crisis, or let the patient handle it himself.

::: info Cross-specialty examples
- *Nutrition:* meal plan, fluid targets, food avoidances, weighing cadence.
- *Drug adherence:* regimen, timing, with/without food, taper steps. We can integrate with the HMOs directly to pull prescription data.
:::

**2. Conversational interface with customizable persona.** An LLM-mediated patient-facing channel that knows the prescription, knows the patient's recent context (only what the clinitian shared), and speaks in a tone the clinician has tuned (or, with consent, a voice modeled on the clinician themselves — like Delphi-style cloning). It is the surface for guiding the patient through prescribed activities in the moment, answering questions, and de-escalating distress without overstepping.

The LLM knows only what the doctor has shared in terms of context and prescription. It will act on that data only.

In mental health, this means walking a patient through an exposure step-by-step at 11pm; helping them work through a thought record; offering grounding in a panic moment. A *pull-first approach* here means the only proactive nudges to enter the channel are consented, concrete reminders the patient and clinician set up in session (an exposure window, a med time, a journal cue).

::: info Cross-specialty examples
- *Nutrition:* "I'm at this restaurant, what works on the plan?" — answered against the prescribed meal plan, not generic nutrition advice.
- *Drug adherence:* "I forgot my morning dose, do I take it now or skip?" — answered per the prescribed regimen's catch-up rule, escalating if outside it.
:::

**3. Local-first data + permissioned share-up layer.** Conversation transcripts and detailed in-the-moment data, including adherence and compliance information, live on-device, encrypted. A separate local serivce extract *summaries* and *signals* that are then classified and presented to the user for explicit approval before they sync. This way the patient approves what leaves the device. Transparency is acheived by keeping a record of everything that was shared accessible to the patient within the app.

**4. Adherence and compliance tracking.** Objective where possible, self-reported where not (see appendix A for further definitions and clarifications)
The system records whether prescribed activities happened, with what difficulty, and with what effect. This feeds two outputs: (a) the patient's own adherence and progress view, (b) the clinician's adherence signal.

::: info Cross-specialty examples
- In *Drug adherence*, for example, we can cross-referenced with smart pill bottles, refill data, or pharmacy integration (in Israel, HMO pharmacy data is a candidate).
:::

**5. Clinician dashboard.** A clinician-facing view designed to be readable in a glance before a session and allow quick actions between sessions. High Level Overview shows, per patient: name, adherence signal, current prescription summary.
In depth view elaborates on prescription, also shows more information - depending on sharing preferences of the patient - regarding adherenc and conversations (including themes the patient surfaced).


### Per Specialty Features

A specialty may have *patient-facing primitives* that pure conversation can't deliver well. In nutrition, beyond answering "what should I eat at this restaurant?", the patient also wants to see the week's meal plan as a structured view, swap a recipe they don't like, generate a grocery list, and photo-log what they actually ate.

Each specialty may therfore plug in a thin patient-facing module on top of the universal core.

### Summary of Key Screens and Flows

**Clinicitian side**:
1. How the clinican inputs prescriptions in a structured way (upload session notes, auto-analyze and suggest, but allow manual tweaks. final approval always up to the clinician)
2. How the clinician feeds context into the patient app (i.e. sharing patient data with patient app -h what data goes where, etc.).
3. How the clinician sees everything that was shared with him from the patient.
4. How the clinitan sees the adherence and compliance view. Both a rich view (patient shared detailed information), or a quick view ("on/off track" only).
5. Main dashboard with view of all patients (smart filters) - high level view
6. in depth patient view with all the extra information, context, prescriptions, conversations the patient shared, etc.


**Patient side**:
1. converstaion + how it asks you what information it wants to share.
2. See your profile - what the app knows about you.
3. See your prescriptions, what the doctor prescribed.
4. How it all looks and is customized to feel like your clinitian with his voice etc.
5. Notification system - nudges that maintain the "pull-first" nature of the system, but still call to action.
6. See everything that you allowed to share.
7. Requests for sharing certain information from local to the clinitian.
8. Adherence and Compliance view.
9. Settings where integrations can be added.

## Notes on Mental Health

:::info Continuity-as-treatment.
In mental health, *the clinician's voice staying present in the patient's life between visits* is itself part of the therapeutic mechanism (working alliance, internalization, intersession process per Orlinsky/Geller). It deserves outsized design weight: named persona, voice, narrative continuity, the LLM remembering and referencing past conversations the way a therapist would. Consider a cooporation with Delphi-style voice/persona modelling.
:::

:::info The "is the patient stable enough to use this between sessions?" gating decision.
The clinician decides per-patient whether between-session AI conversation is therapeutically appropriate. It may be wrong for a patient working on tolerating distress without external regulation, or for a patient with dependency tendencies. This gating is built into the prescription model from day one — the clinician can enable, restrict, or fully disable the conversational layer per patient.
:::


## General Notes

::: info A note on integrations
Integrations can be done in the patient app (e.g. Fitbit, MyFitnessPal, smart pill bottles, Apple health, Google Health, etc.) or in the clinician portal (e.g. Pulling prescription data from HMOs).
:::

# Appendix A: -

<!-- TODO: What can be objective and automated. What can only be self-reported and how is that kept engaging (gamification?) -->


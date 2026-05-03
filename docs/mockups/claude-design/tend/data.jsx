// Shared mock data for Tend prototype.
// Centered around Chen, an Israeli patient with PTSD, and his clinician
// Shari B. Kaplan, LCSW. Other patients populate the dashboard.

const CLINICIAN = {
  id: 'kaplan',
  name: 'Shari B. Kaplan, LCSW',
  shortName: 'Shari Kaplan',
  firstName: 'Shari',
  title: 'Licensed Clinical Social Worker · Trauma & PTSD',
  initials: 'SK',
  photo: 'shari.png',
  tone: 'warm-direct',
  companionName: 'Shari', // patient-facing AI name (clinician's voice clone)
  voiceProvider: 'Delphi',
};

const CHEN = {
  id: 'chen',
  name: 'Chen Avraham',
  age: 28,
  pronouns: 'he/him',
  initials: 'CA',
  diagnosis: 'PTSD (combat-related)',
  phase: 'Active treatment · Phase 2 (processing)',
  lastSession: 'Apr 28, 2026',
  nextSession: 'May 5, 2026 · 10:00',
  protocol: 'Prolonged Exposure (PE) + sleep stabilization',
  startedCare: 'Jan 12, 2026',
  notes: 'Reservist · 8 mo since discharge · single, lives alone in Tel Aviv',
};

// Roster for the clinician dashboard. Mix of states. (Chen is the only Israeli name.)
const PATIENTS = [
  {
    id: 'chen', name: 'Chen Avraham', initials: 'CA', condition: 'PTSD',
    adherence: 64, trend: 'down', status: 'attention',
    lastContact: '2h ago', nextSession: 'Tue · May 5',
    summary: 'Skipped 2 of 3 prescribed exposures. Sleep avg 4.2h. 3 nighttime episodes this week.',
    flag: 'Episode at 02:14 last night — patient declined AI guidance, requested space.',
  },
  {
    id: 'rachel', name: 'Rachel Bennett', initials: 'RB', condition: 'GAD',
    adherence: 91, trend: 'up', status: 'on-track',
    lastContact: '1d ago', nextSession: 'Wed · May 6',
    summary: 'Thought records completed 6/7 days. Worry-time adherence high.',
  },
  {
    id: 'marcus', name: 'Marcus Hill', initials: 'MH', condition: 'OCD',
    adherence: 78, trend: 'flat', status: 'on-track',
    lastContact: '4h ago', nextSession: 'Thu · May 7',
    summary: 'ERP hierarchy step 4/8. Two ritual-resistance wins logged.',
  },
  {
    id: 'tyler', name: 'Tyler Brooks', initials: 'TB', condition: 'Depression',
    adherence: 45, trend: 'down', status: 'attention',
    lastContact: '3d ago', nextSession: 'Mon · May 11',
    summary: 'Behavioral activation lapsing. No journal entries since Sat.',
    flag: 'No engagement 72h. Auto-nudge sent.',
  },
  {
    id: 'jenna', name: 'Jenna Reed', initials: 'JR', condition: 'Panic',
    adherence: 82, trend: 'up', status: 'on-track',
    lastContact: '6h ago', nextSession: 'Fri · May 8',
    summary: 'Interoceptive exposure 3× this week. Panic-attack frequency ↓.',
  },
  {
    id: 'devon', name: 'Devon Carter', initials: 'DC', condition: 'PTSD',
    adherence: 71, trend: 'flat', status: 'on-track',
    lastContact: '1d ago', nextSession: 'Tue · May 12',
    summary: 'Trauma narrative sessions ongoing. Sleep stable.',
  },
  {
    id: 'paige', name: 'Paige Harlow', initials: 'PH', condition: 'GAD',
    adherence: 88, trend: 'up', status: 'on-track',
    lastContact: '12h ago', nextSession: 'Wed · May 13',
    summary: 'Worry postponement working. Caffeine cutoff held 7/7.',
  },
  {
    id: 'ethan', name: 'Ethan Walsh', initials: 'EW', condition: 'Depression',
    adherence: 58, trend: 'flat', status: 'attention',
    lastContact: '2d ago', nextSession: 'Thu · May 14',
    summary: 'Activity scheduling partial. Sleep window drift.',
  },
];

// Chen's prescription (the "contract")
const PRESCRIPTION = {
  version: 'v3 · approved Apr 28',
  approvedBy: 'Shari B. Kaplan, LCSW',
  protocol: 'Prolonged Exposure + sleep stabilization',
  tasks: [
    {
      id: 'imag-exp', title: 'Imaginal exposure recording',
      cadence: '4× / week', duration: '~30 min',
      detail: 'Listen to the recorded narrative. SUDS log before/after. Shari can guide if SUDS ≥ 7.',
      type: 'exposure',
    },
    {
      id: 'in-vivo', title: 'In-vivo exposure: crowded café',
      cadence: 'Mon, Thu', duration: '20 min',
      detail: 'Café Albert, mid-morning. Stay until SUDS drops by 50%.',
      type: 'exposure',
    },
    {
      id: 'sleep', title: 'Sleep window 23:30 – 06:30',
      cadence: 'nightly', duration: '7h',
      detail: 'No screens after 22:30. If awake >20 min, get out of bed.',
      type: 'continuous',
    },
    {
      id: 'journal', title: 'Morning grounding + log',
      cadence: 'daily', duration: '5 min',
      detail: '3-2-1 grounding, then one line on last night.',
      type: 'continuous',
    },
  ],
  constraints: [
    'No alcohol while in active PE phase',
    'Caffeine cut-off 14:00',
  ],
  escalation: [
    'SUDS sustained ≥ 8 for >30 min during exposure → notify clinician',
    'Two consecutive nights <4h sleep → notify clinician',
    'Any SI ideation → immediate handoff to crisis protocol',
  ],
  aiAssistance: {
    level: 'guided',
    crisisGuidance: true,
    description: 'Shari may guide Chen through grounding and exposure steps. May not initiate trauma processing. Hands off on crisis to human protocol.',
  },
};

const ADHERENCE_14D = {
  days: ['Apr 20','Apr 21','Apr 22','Apr 23','Apr 24','Apr 25','Apr 26','Apr 27','Apr 28','Apr 29','Apr 30','May 1','May 2','May 3'],
  rows: [
    { task: 'Imaginal exposure', values: [1, null, 1, null, 0.5, null, 0, 1, null, 0, null, 1, null, 0] },
    { task: 'In-vivo exposure',  values: [null, null, 1, null, null, 1, null, null, null, 1, null, null, null, 0] },
    { task: 'Sleep window',      values: [1, 1, 0.5, 1, 0, 0.5, 0, 0, 1, 0, 0.5, 0, 0, 0] },
    { task: 'Morning log',       values: [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0.5, 1, 1, 0] },
  ],
};

const SHARED_LOG = [
  { id:'s1', when:'Today · 03:42', kind:'episode', summary:'Nighttime episode · ~22 min · grounding used', detail:'Approved sharing: time, duration, grounding technique used, post-SUDS. Withheld: full conversation transcript.' },
  { id:'s2', when:'May 2 · 21:10', kind:'adherence', summary:'In-vivo exposure: skipped (Mon)', detail:'Reason given: "couldn\'t leave the apartment today"' },
  { id:'s3', when:'May 1 · 08:30', kind:'mood', summary:'Morning check-in: mood 3/10', detail:'Approved 1-line note: "feels heavy, didn\'t sleep"' },
  { id:'s4', when:'Apr 30 · 22:14', kind:'episode', summary:'Episode summary · 14 min', detail:'Approved summary; declined to share transcript.' },
  { id:'s5', when:'Apr 29 · 17:50', kind:'adherence', summary:'Imaginal exposure complete · SUDS 8→4', detail:'Auto-summary approved.' },
];

const PENDING_SHARES = [
  {
    id:'p1', kind:'episode', when:'about 30 min ago',
    title:'Last night\'s episode',
    bullets:[
      'Started 02:14, lasted ~22 min',
      'Used 3-2-1 grounding (worked partially)',
      'Declined Shari\'s help mid-way',
      'Final SUDS: 5',
    ],
    transcript:false,
  },
  {
    id:'p2', kind:'adherence', when:'this morning',
    title:'In-vivo exposure: skipped',
    bullets:[
      'Mon café exposure not done',
      'Reason: "couldn\'t leave the apartment"',
    ],
  },
];

Object.assign(window, { CLINICIAN, CHEN, PATIENTS, PRESCRIPTION, ADHERENCE_14D, SHARED_LOG, PENDING_SHARES });

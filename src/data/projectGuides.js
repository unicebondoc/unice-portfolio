import { PRACTICAL_GUIDES } from './projectGuidesPractical.js'
import { CREATIVE_GUIDES } from './projectGuidesCreative.js'
import { CAUSECONNECT_GUIDE } from './projectGuidesCauseConnect.js'

// Public explanations distilled from the owning product documentation.
// Keep internal sources, private examples and paid story material out of this data.
export const PROJECT_GUIDES = {
  ...PRACTICAL_GUIDES,
  ...CREATIVE_GUIDES,
  causeconnect: CAUSECONNECT_GUIDE,
  'what-was-drawn': {
    overview: 'What Was Drawn brings a 44-card reflection deck into a touch-first reading experience. People can draw digitally, optionally scan physical cards, and return to their journal.',
    demo: {
      kind: 'image',
      intro: 'This is the actual public web homepage. Open the web app to try the reading flow; the still preview does not demonstrate camera recognition or a purchase.',
      steps: [
        { title: 'Begin a reading', text: 'Choose Begin a reading. Add a question or skip it, then shuffle and select three cards.' },
        { title: 'Reveal and reflect', text: 'Tap each card to reveal it. Read its Past, Present or Future perspective and upright or reversed meaning.' },
        { title: 'Return to the journal', text: 'Revisit completed readings. Start as a guest without an account, or use the optional account route.' },
      ],
    },
    workflow: [
      { title: 'Choose your input', text: 'Touch completes the main journey. Optional hand gestures supplement it; camera permission is not a requirement for drawing digital cards.' },
      { title: 'Keep the reading consistent', text: 'The selected card, position and orientation stay together through reveal and interpretation. Readings use included authored reflection text.' },
      { title: 'Confirm a physical card', text: 'The optional scanner suggests a match. Confirm or correct the card and orientation before using it; manual selection provides a route when recognition is uncertain.' },
      { title: 'Save with the right identity', text: 'Guest and account journals stay separate. Recovery and retry checks address interrupted saves and account switching, rather than silently assigning guest history to another user.' },
    ],
    technical: [
      { title: 'Web and native delivery', text: 'React powers the interface, with Capacitor for native packaging. The public web frontend runs on private S3 behind CloudFront; shared Supabase services support accounts and data.' },
      { title: 'Billing and recovery', text: 'Python on AWS Lambda, behind API Gateway, handles the billing API. Provider checks cover duplicate events, retries, cancellation and account-scoped access.' },
      { title: 'Camera without certainty claims', text: 'Optional MediaPipe gestures and card matching are separate from the ordinary reading. Synthetic recognition tests support regression checks; real printed-card performance still needs physical-camera testing.' },
    ],
    built: [
      { area: 'Frontend & native packaging', text: 'I built the React question, shuffle, three-card selection, reveal and interpretation flow, with touch/keyboard controls and journal navigation, and packaged it with Capacitor for iOS and retained Android builds.' },
      { area: 'Billing backend', text: 'I developed the Python billing service on AWS Lambda and API Gateway and migrated it from Railway, preserving its domain. It integrates Stripe, RevenueCat, authenticated requests and duplicate-event/retry handling.' },
      { area: 'Journal & account data', text: 'I implemented separate guest and account journals, Supabase synchronization, pending-save feedback, retry and export, with lifecycle guards against stale requests and cross-account reading exposure.' },
      { area: 'Camera interaction', text: 'I integrated optional MediaPipe gestures and physical-card matching, with card/orientation confirmation, camera recovery and a manual 44-card picker. Touch remains the default.' },
    ],
    status: 'The web app is public. iOS review remains pending; native Android publication is paused. Physical-card camera performance, screen-reader journeys and completed Apple transactions remain separate testing work.',
  },
}

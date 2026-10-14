export const CREATIVE_GUIDES = {
  steeped: {
    overview: 'Steeped is a quiet Unity tea-and-focus game set in Uji. My development work spans C# session logic, tea interactions, the room interface and persistent player progress.',
    demo: {
      kind: 'video',
      intro: 'This eight-second silent excerpt shows actual r13j tea gameplay. It is a small interaction sample; the focus session and wider story need their own playthrough.',
      steps: [
        { title: 'Play the tea excerpt', text: 'Watch the preparation motion in the actual development build.' },
        { title: 'Look for feedback', text: 'Notice the utensil, drink and room responding to the action.' },
        { title: 'Read the wider loop', text: 'The guide below explains how tea, company and saved progress fit together.' },
      ],
    },
    workflow: [
      { title: 'Settle into the room', text: 'The Uji setting holds the tea tools, visitors and study controls together. The room is designed to remain a place to spend time.' },
      { title: 'Work with quiet company', text: 'Start, pause or end a focus session. Current checks cover a genuine half-hour with reading company and preserved session state.' },
      { title: 'Make tea and meet a guest', text: 'Prepare and serve a cup through visible ritual steps. Visits connect conversation, choices and keepsakes with the room.' },
      { title: 'Return to your progress', text: 'Saved session, cup and story state let the experience continue. The approved rebuild connects work, breaks, tea and story; deeper arcs remain in development.' },
    ],
    technical: [
      { title: 'Unity and C#', text: 'Session, tea and guest state connect the room interface to the gameplay logic. Checkpoints preserve the progress needed to resume interrupted interactions.' },
      { title: 'Interrupted interactions', text: 'Recovery checks exercise partial tea preparation and story transitions. Existing saves are preserved while fixes are qualified on an exact local candidate.' },
      { title: 'Physical feedback', text: 'A spoon repair measured whole-tool clearance and powder landing after a simpler orientation check missed the visible problem.' },
    ],
    built: [
      { area: 'Unity & C# gameplay', text: 'I implemented focus-session timers, pause/resume, break transitions and guest-arrival logic, with persisted progress and an incense-timer interface.' },
      { area: 'Tea interaction & feedback', text: 'I implemented pointer and assisted tea preparation, staged pouring and whisking, cup completion rules, and mesh-based spoon clearance with powder-landing feedback.' },
      { area: 'Save & recovery', text: 'I implemented validated JSON checkpoints for partial cups and visits, atomic save replacement, backup recovery and protection against loading newer save versions.' },
    ],
    status: 'A tested local owner preview is available. Story, acting, listening and physical-device acceptance remain open. Store release is pending. This public gameplay excerpt is intentionally silent.',
  },
  'princess-of-alemio': {
    overview: 'Princess of Alemio is my romantic-fantasy story, developed as a visual novel and a separate audio drama. I write the story and build its Ren’Py reading experience, choice state and scene/audio delivery.',
    demo: {
      kind: 'image',
      intro: 'The main image is an actual visual-novel development scene. The separate 2-minute-58-second audio player presents the opening of the fixed Part One drama.',
      steps: [
        { title: 'Read the scene', text: 'Look at Alicia in Kimilar and the dialogue presentation in the current development imagery.' },
        { title: 'Listen to the opening', text: 'Start the separate audio preview explicitly. Its original synthetic voices and published sound mix are retained.' },
        { title: 'Choose an edition', text: 'ONQST explains the editions and links to the available audio. The visual novel remains in development.' },
      ],
    },
    workflow: [
      { title: 'Begin the local VN proof', text: 'In Kimilar 0.5, choose Begin, then click dialogue or press Space or Enter. This playable proof covers the opening encounter.' },
      { title: 'Investigate in your chosen order', text: 'One choice changes which question or inspection comes first. Both routes retain the same opening facts and converge; the full five-choice design is proposed.' },
      { title: 'Review and return', text: 'Evidence, History, Back, Save, Load and Settings support reading and revisiting the local scene. Large text and reduced motion are available.' },
      { title: 'Listen to the separate drama', text: 'The available Part One audio contains nine numbered English chapters and a transcript/guide. Download, unzip and play the MP3s in order; Part Two is excluded.' },
    ],
    technical: [
      { title: 'Ren’Py narrative states', text: 'The local scene preserves authored words while changing investigation order. Route checks verify the opening units, character names, evidence and save/load behaviour.' },
      { title: 'Purposeful scene presentation', text: 'Dedicated character shots and held event illustrations focus attention. Bounded mouth, blink and breathing motion accompany ordinary dialogue; this is limited 2D acting.' },
      { title: 'Distinct media delivery', text: 'The VN uses scene-aligned audio cuts. The fixed drama has its own complete chapter files, transcript and credits, with source preservation and package checks.' },
    ],
    built: [
      { area: 'Ren’Py narrative logic', text: 'I implemented the voiced opening, one investigation-order choice, two converging routes and evidence states that distinguish observed facts from a character’s account.' },
      { area: 'Reading interface & saves', text: 'I built custom dialogue and choice screens, Back, History, Evidence, manual save/load, auto-read, skip-read, text-size and reduced-motion controls.' },
      { area: 'Scene & audio pipeline', text: 'I prepared scene-aligned artwork and voiced opening units, generated route data and source-hash checks, and produced the separate audio chapters, transcript, credits and delivery package.' },
    ],
    status: 'The full visual novel is in development; the current proof is local. VN creative and physical-device acceptance remain open. Audio publication is recorded separately; sales and buyer playback are unverified.',
  },
};

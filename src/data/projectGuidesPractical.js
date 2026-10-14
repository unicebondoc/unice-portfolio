export const PRACTICAL_GUIDES = {
  flatsync: {
    overview: "FlatSync gives housemates one place for chores, shopping and shared costs. The aim is to make the next action clear and keep everyone's recorded household state consistent.",
    demo: {
      kind: "video",
      intro: "This 27-second narrated web preview introduces a fictional household, with captions and optional sound.",
      steps: [
        { title: "Share the work", text: "Watch how chores show who is responsible, rather than relying on one person to keep reminding the home." },
        { title: "Keep one list", text: "The shopping view brings household needs together. Marking a purchase bought does not automatically record its cost." },
        { title: "Understand the balance", text: "The costs screen shows who owes whom from household entries. Payments take place outside FlatSync." },
      ],
    },
    workflow: [
      { title: "Start or join a home", text: "Use an email code to create or join a home. Invited guests can join with a private invitation and link an email later to keep their history across devices." },
      { title: "Choose the next action", text: "Today brings chores into focus; Shopping holds shared and personal items. A buying claim signals a plan, while chore recurrence can rotate or stay with one person." },
      { title: "Record money clearly", text: "An expense records a provider payment; a repayment records money exchanged between housemates. A $120 expense shared equally creates $60 owed; recording the external $60 repayment settles it." },
      { title: "Recover an uncertain save", text: "Check the retained save reference before trying again. Scheduled bills remain due until explicitly recorded paid, and affected schedules pause when a participant leaves." },
    ],
    technical: [
      { title: "One shared household", text: "React and TypeScript power the interface, with Supabase/PostgreSQL for shared records. The service checks membership, permissions and the record version before accepting changes." },
      { title: "Safe retries", text: "Durable action references and server receipts help resolve a lost response without creating a second record. Conflicting changes recover the newer household state." },
    ],
    built: [
      { area: "Frontend", text: "I built the React and TypeScript chore, shopping and bill interfaces: My day, the house board, quick shopping capture, and forms that preserve unfinished input." },
      { area: "Backend", text: "I implemented household joining, invitations and owner/admin/member permissions through Supabase Edge APIs and PostgreSQL, with membership and record-version checks on shared changes." },
      { area: "Money & recurring work", text: "I implemented expense splits, repayments and scheduled-bill recording, including exact-cent allocation, duplicate-occurrence protection and review when a housemate leaves." },
      { area: "Data & recovery", text: "I added durable save references and transactional server receipts, so an uncertain save can be checked, retried or cancelled without creating duplicate household records." },
    ],
    status: "The free web app is public; native iOS and Android public releases remain pending. Shared-web checks cover a two-account household. Further testing with households and physical devices remains in progress.",
  },
  landlit: {
    overview: "LandLIT connects property records, contracts, rent, utilities and monthly reporting for small rental operators. Its workflow makes balances and unresolved decisions traceable to the records behind them.",
    demo: {
      kind: "image",
      intro: "A screenshot of the Philippine fictional-data dashboard. Open the interactive demo below to explore sample records and try its receipt workflow. Changes reset on reload; no money or message is sent.",
      steps: [
        { title: "Read the snapshot", text: "Compare recorded receipts with the remaining balance. The sample dashboard keeps those figures separate from tenancies and items awaiting review." },
        { title: "Find the exception", text: "The next-decisions area highlights a partial receipt, an unconfirmed processing state and a held account. Each points to a different review need." },
        { title: "Explore the sample", text: "Open the public demo to try the fictional receipt workflow. Sample changes stay within that browser tab and reset on reload; no money or message is sent." },
      ],
    },
    workflow: [
      { title: "Connect the starting records", text: "Link a property, unit, tenancy and reviewed contract terms. Import preparation checks source identities and starting totals before records are confirmed." },
      { title: "Prepare and review charges", text: "Rent follows reviewed terms. Philippine utility allocations use actual full-period readings and an approved pool; missing or unsupported inputs stay as review exceptions." },
      { title: "Record receipts and corrections", text: "Keep charges, confirmed cash, allocations and credit distinct. Corrections retain the original record and explain how the current balance changed." },
      { title: "Review and export the month", text: "Compare obligations with receipts and unresolved cases. Monthly evidence and readable exports preserve the history behind the figures for the operator's review." },
    ],
    technical: [
      { title: "Connected application", text: "Next.js, React and TypeScript support the application. Server-side workspace membership governs records, documents and exports; the public showcase uses separate fictional sample data." },
      { title: "Traceable financial state", text: "Transactional revisions, linked adjustments and separate allocation records preserve original charges and receipts. A payment claim or processing state cannot by itself confirm cash received." },
      { title: "Recovery evidence", text: "Local verification includes persistence, authenticated access, encrypted inactive restore and document/export integrity. That evidence is kept separate from hosted activation and genuine operator use." },
    ],
    built: [
      { area: "Frontend", text: "I built the Next.js, React and TypeScript workspace for properties, tenancies, contracts, utilities, the rent ledger and monthly review, with forms that explain pending decisions and preserve failed edits." },
      { area: "Backend", text: "I implemented authenticated workspace APIs, email verification and account recovery. Membership, session assurance and revision checks protect stored records and changes." },
      { area: "Financial data", text: "I implemented reviewed rent and utility charges, receipt allocation, credit and linked corrections, preserving original records and keeping confirmed cash separate from pending claims." },
      { area: "Storage & recovery", text: "I implemented managed PostgreSQL persistence and encrypted recovery, plus original-document uploads and frozen monthly evidence. Cloud activation and final verification of the new document flow are in progress." },
    ],
    status: "A fictional public showcase and a protected Philippine manual-beta deployment exist. Signup is closed; real customer intake and live rent collection remain pending. Cloud document-storage and recovery verification is in progress.",
  },
};

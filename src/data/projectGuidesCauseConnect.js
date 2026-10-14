export const CAUSECONNECT_GUIDE = {
  overview: 'CauseConnect helps people discover community causes, submit campaigns and follow their participation. I contribute as Developer / Programmer in a ten-person ACS WIL internship team, July 2026–present, connecting clear interfaces with permissions and review rules.',
  demo: {
    kind: 'image',
    intro: 'This interface preview shows the actual hosted homepage with fictional campaigns. Use it to understand the layout; the workflow below explains the integrated application. The still image does not demonstrate login, uploads or saved data.',
    steps: [
      { title: 'Discover a campaign', text: 'Scan campaign cards, use search and filters, then open the details.' },
      { title: 'Follow the workflow', text: 'Read how a member submits a campaign and an admin reviews it before public display.' },
      { title: 'Explore the engineering', text: 'See how ownership, visibility and saved changes are enforced beyond the interface.' },
    ],
  },
  workflow: [
    { title: 'Browse approved campaigns', text: 'Visitors can search and open approved campaigns. Pending and rejected submissions stay private.' },
    { title: 'Submit and manage', text: 'A signed-in member submits validated details and an optional photo. My campaigns shows saved status, feedback and edit/resubmission options.' },
    { title: 'Review before publication', text: 'An admin approves or rejects a submission. Approval exposes the campaign and photo publicly; editing approved content returns it to pending.' },
    { title: 'Keep participation clear', text: 'Members can join, withdraw and see their history. Business enquiries use a private owner inbox; the complete business posting journey still awaits profile integration.' },
  ],
  technical: [
    { title: 'Connected application', text: 'React and Vite connect to a Node.js/Express API with MySQL and Sequelize migrations. Nginx serves HTTPS on AWS EC2; database and uploaded files remain private.' },
    { title: 'Rules enforced by the server', text: 'Authenticated creation assigns the owner and pending status. Photo access follows campaign visibility. Version checks prevent older edits or review decisions from silently overwriting newer changes.' },
  ],
  built: [
    'React campaign forms, validation, My campaigns, review screens and shared API/session handling.',
    'Node.js/Express campaign submission and supporting APIs for photos, owner changes, participation, enquiries and admin controls, building on team backend work.',
    'MySQL persistence, backend/integration checks and AWS deployment support.',
  ],
  status: 'As of 14 October 2026, the community submission, private review and public photo-display journey is deployed and browser-verified. Business posting still depends on business-profile APIs. Independent team testing, final manuals and the demonstration video remain open; later review fixes are local work awaiting release.',
}

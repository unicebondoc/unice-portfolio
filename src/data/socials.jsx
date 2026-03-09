/**
 * Social links for bottom bar and HUD.
 */
export const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/lifeofmooni',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/unicebondoc/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="3" ry="3" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="7" y1="10" x2="7" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="7" y1="7" x2="7" y2="7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M11 17v-3.5c0-1.5 2.5-1.5 2.5 0V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="11" y1="10" x2="11" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/unicebondoc',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.49v-1.7C6.73 20.25 6.14 18 6.14 18c-.46-1.18-1.13-1.5-1.13-1.5-.92-.64.07-.62.07-.62 1.02.07 1.55 1.07 1.55 1.07.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.24-.26-4.6-1.14-4.6-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.27 2.75 1.05A9.45 9.45 0 0 1 12 7.85c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.95-2.37 4.82-4.63 5.07.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.22 10.22 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: 'Contact',
    href: 'mailto:unicebondoc@gmail.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

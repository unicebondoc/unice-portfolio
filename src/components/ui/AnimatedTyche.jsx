import { useId } from 'react'
import styles from './AnimatedTyche.module.css'

/**
 * A tiny cutout rig for the approved Tyche artwork. The body stays anchored;
 * only the separated tail, ear tips and eyelids move. One shared image resource,
 * no video decoder, scene pointer listener, canvas or animation timer.
 */
export default function AnimatedTyche({ reducedMotion = false, className = '' }) {
  const id = `tyche-${useId().replace(/:/g, '')}`
  const ref = name => `${id}-${name}`
  const url = name => `url(#${ref(name)})`
  return (
    <svg
      className={`${styles.tyche} ${className}`}
      viewBox="0 0 1280 1280"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-still={reducedMotion ? 'true' : undefined}
    >
      <defs>
        <image id={ref('art')} href="/world/tyche-guide.webp" width="1280" height="1280" />
        {/* Cuts meet in the thick fur, not across the face or collar. */}
        <path id={ref('tail-shape')} d="M0 410H410L548 555L553 715L484 798L484 1028L432 1158H0Z" />
        <path id={ref('left-ear-shape')} d="M389 144L666 231L593 284L467 354L409 284Z" />
        <path id={ref('right-ear-shape')} d="M698 210L764 56L848 0L950 205L927 258L821 220Z" />
        <clipPath id={ref('tail')}><use href={`#${ref('tail-shape')}`} /></clipPath>
        <clipPath id={ref('left-ear')}><use href={`#${ref('left-ear-shape')}`} /></clipPath>
        <clipPath id={ref('right-ear')}><use href={`#${ref('right-ear-shape')}`} /></clipPath>
        <mask id={ref('body')} maskUnits="userSpaceOnUse" x="0" y="0" width="1280" height="1280">
          <rect width="1280" height="1280" fill="white" />
          <use href={`#${ref('tail-shape')}`} fill="black" />
          <use href={`#${ref('left-ear-shape')}`} fill="black" />
          <use href={`#${ref('right-ear-shape')}`} fill="black" />
        </mask>
        {/* A fixed seam patch keeps the root of the tail connected as it turns. */}
        <clipPath id={ref('tail-root')}><path d="M473 830L516 871L520 1066L434 1138L448 990Z" /></clipPath>
        <linearGradient id={ref('lid')} x1="650" y1="330" x2="755" y2="458" gradientUnits="userSpaceOnUse">
          <stop stopColor="#dfdceb" /><stop offset=".55" stopColor="#f5edf1" /><stop offset="1" stopColor="#ddd6e7" />
        </linearGradient>
      </defs>
      <g className={styles.tail}>
        <use href={`#${ref('art')}`} clipPath={url('tail')} />
      </g>
      <g className={styles.leftEar}>
        <use href={`#${ref('art')}`} clipPath={url('left-ear')} />
      </g>
      <g className={styles.rightEar}>
        <use href={`#${ref('art')}`} clipPath={url('right-ear')} />
      </g>
      <use href={`#${ref('art')}`} mask={url('body')} />
      <use href={`#${ref('art')}`} clipPath={url('tail-root')} />
      <g className={styles.blink}>
        <path d="M634 398C651 366 704 352 743 390C734 425 679 437 643 413Z" fill={url('lid')} />
        <path d="M638 396Q693 418 741 389" stroke="#5c424e" strokeWidth="5" strokeLinecap="round" />
        <path d="M804 347C795 309 825 290 858 296C882 320 862 356 815 369Z" fill="#eee6ed" />
        <path d="M805 343Q834 353 864 319" stroke="#5c424e" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g className={styles.spark} transform="translate(969 1026)">
        <path d="M0-27L5-5L27 0L5 5L0 27L-5 5L-27 0L-5-5Z" fill="#e6ffff" />
      </g>
    </svg>
  )
}

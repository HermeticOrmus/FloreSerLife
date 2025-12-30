import { SVGProps } from "react";

export const ArchetypeIcons = {
  Bee: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      {...props}
    >
      {/* Bee icon based on uploaded asset */}
      <path d="M50 20c-8 0-15 7-15 15 0 3 1 6 3 8l-8 8c-2-1-4-2-7-2-8 0-15 7-15 15s7 15 15 15c3 0 6-1 8-3l8 8c-2 2-3 5-3 8 0 8 7 15 15 15s15-7 15-15c0-3-1-6-3-8l8-8c2 2 5 3 8 3 8 0 15-7 15-15s-7-15-15-15c-3 0-6 1-8 3l-8-8c2-2 3-5 3-8 0-8-7-15-15-15z" />
      <circle cx="50" cy="50" r="8" />
    </svg>
  ),

  Hummingbird: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      {...props}
    >
      {/* Hummingbird icon based on uploaded asset */}
      <path d="M20 50c0-5 2-10 6-13l15-10c3-2 7-2 10 0l15 10c4 3 6 8 6 13v20c0 8-6 14-14 14h-24c-8 0-14-6-14-14V50z" />
      <path d="M30 35c0-3 2-5 5-5h30c3 0 5 2 5 5v5H30v-5z" />
      <circle cx="40" cy="45" r="3" />
      <circle cx="60" cy="45" r="3" />
      <path d="M45 55h10v5H45z" />
    </svg>
  ),

  Butterfly: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      {...props}
    >
      {/* Butterfly icon based on uploaded asset */}
      <path d="M50 10v80M25 30c-10 0-15 10-10 20 3 6 10 8 16 6l9-2M75 30c10 0 15 10 10 20-3 6-10 8-16 6l-9-2M25 60c-10 0-15-10-10-20 3-6 10-8 16-6l9 2M75 60c10 0 15-10 10-20-3-6-10-8-16-6l-9 2" />
      <circle cx="50" cy="25" r="3" />
      <circle cx="50" cy="50" r="3" />
      <circle cx="50" cy="75" r="3" />
    </svg>
  ),

  Beetle: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      {...props}
    >
      {/* Beetle icon based on uploaded asset */}
      <ellipse cx="50" cy="50" rx="20" ry="30" />
      <ellipse cx="50" cy="35" rx="15" ry="10" />
      <path d="M35 40l-8-8M65 40l8-8M35 50l-10 0M65 50l10 0M35 60l-8 8M65 60l8 8" strokeWidth="2" stroke="currentColor" fill="none" />
      <circle cx="45" cy="30" r="2" />
      <circle cx="55" cy="30" r="2" />
    </svg>
  )
};

export type Event = {
  id: number,
  title: string,
  description: string,
  date: string,
  location: string
}

export const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Bad Bunny in Medellín',
    description: 'Experience Bad Bunny Live at Atanasio Girardot Stadium on Friday, January 23, 2026! The countdown has begun! Bad Bunny is taking over Atanasio Girardot Stadium on Friday, January 23, 2026, and with hits January 23, 2026, and with hits like PERRO NEGRO, un x100to and ADIVINO and a following of 83.9M+ strong, you´ll want to be front and center for this. ',
    date: 'Fri, 23 Jan, 2026 at 8:00 pm - Sat, 24 Jan, 2026 at 12:00 am (COT)',
    location: 'Atanasio Girardot Stadium, Medellín, Colombia',
  },
  {
    id: 2,
    title: 'Guns N´Roses in Medellín',
    description: 'It´s that time of the year where everyone wants to have a musical breath! Your favorite, Guns N´Roses is hitting Atanasio Girardot Stadium on Saturday, October 11, 2025, and with a setlist that includes chart-toppers like Sweet Child O´Mine, Welcome To The Jungle and Paradise City and 31.3M+ fans backing them, you´re in for a night of epic proportions.',
    date: 'Sat, 11 Oct, 2025 at 07:00 pm to 11:00 pm (COT)',
    location: 'Atanasio Girardot Stadium, Medellin, AN, Colombia',
  },
];
import { Event, Comment } from '@/types';

const mockComments: Comment[] = [
  {
    id: 'c1',
    user: 'Juan Pérez',
    message: '¡Excelente evento! Muy bien organizado.',
    date: '2024-01-15T14:30:00Z'
  },
  {
    id: 'c2',
    user: 'María García',
    message: 'Me gustó mucho la presentación principal.',
    date: '2024-01-15T15:45:00Z'
  },
  {
    id: 'c3',
    user: 'Carlos López',
    message: 'Gran networking, conocí gente muy interesante.',
    date: '2024-01-15T16:20:00Z'
  }
];

const mockComments2: Comment[] = [
  {
    id: 'c4',
    user: 'Ana Martín',
    message: 'El workshop fue muy práctico y útil.',
    date: '2024-01-20T10:15:00Z'
  },
  {
    id: 'c5',
    user: 'Roberto Silva',
    message: 'Aprendí mucho sobre las nuevas tecnologías.',
    date: '2024-01-20T11:30:00Z'
  }
];

export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Conferencia de Tecnología 2024',
    description: 'Una conferencia sobre las últimas tendencias en tecnología y desarrollo de software.',
    date: '2024-01-15T09:00:00Z',
    comments: mockComments
  },
  {
    id: 'e2',
    title: 'Workshop de React Avanzado',
    description: 'Taller práctico sobre patrones avanzados en React y mejores prácticas.',
    date: '2024-01-20T10:00:00Z',
    comments: mockComments2
  },
  {
    id: 'e3',
    title: 'Meetup de JavaScript',
    description: 'Encuentro mensual de la comunidad JavaScript local.',
    date: '2024-01-25T18:00:00Z',
    comments: []
  }
];
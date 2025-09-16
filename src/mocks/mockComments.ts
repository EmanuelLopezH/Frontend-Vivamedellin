export type EventComment = {
  id: number;
  eventId?: number; // para filtrar comentarios por evento
  author: string;
  createdAt: string;
  content: string;
  avatarUrl?: string; //opcional
};

export let mockComments: EventComment[] = [
  {
    id: 1,
    eventId: 1,
    author: "Lucas Hernández",
    content: "I can’t wait for Bad Bunny’s concert in Medellín this January 2026! it’s going to be amazing to see him live with all my friends. Counting down the days!",
    createdAt: "2025-09-10T14:30:00Z",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    eventId: 1,
    author: "Clara Ocampo",
    content: "I’ve never been to a Bad Bunny concert before, but everyone says the atmosphere is incredible . Can’t wait to experience it in Medellín!",
    createdAt: "2025-09-11T09:15:00Z",
  },
  {
    id: 3,
    eventId: 2, // ejemplo otro evento
    author: "Stiven Herrera",
    content: "¿Alguien va al meet & greet?",
    createdAt: "2025-09-12T10:00:00Z",
    avatarUrl: "https://github.com/shadcn.png",
  },
  {
    id: 4,
    eventId: 2, // ejemplo otro evento
    author: "Andrés Pérez",
    content: "Guns N’ Roses coming to Medellín? This is going to be the loudest night the Atanasio has ever seen!",
    createdAt: "2025-09-11T09:15:00Z",
  },
  {
    id: 4,
    eventId: 2, // ejemplo otro evento
    author: "Margarita Gómez",
    content: "October can’t come soon enough. Sweet Child O’ Mine live in Medellín will be legendary!",
    createdAt: "2025-09-10T14:30:00Z",
  },
];

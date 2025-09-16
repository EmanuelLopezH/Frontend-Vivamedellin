export type EventComment = {
  id: number;
  eventId?: number; // opcional, para futuros usos
  author: string;
  createdAt: string;
  content: string;
  avatarUrl?: string; // opcional, para futuros usos
};

export const mockComments: EventComment[] = [
  {
    id: 1,
    author: "Lucas Hernández",
    content: "I can’t wait for Bad Bunny’s concert in Medellín this January 2026! it’s going to be amazing to see him live with all my friends. Counting down the days!",
    createdAt: "2025-09-10T14:30:00Z",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    author: "Clara Ocampo",
    content: "I’ve never been to a Bad Bunny concert before, but everyone says the atmosphere is incredible . Can’t wait to experience it in Medellín!",
    createdAt: "2025-09-11T09:15:00Z",
  },
];

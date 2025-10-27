export type EventComment = {
  id: number;
  eventId?: number; // para filtrar comentarios por evento
  name: string;
  createdAt: string;
  content: string;
  avatarUrl?: string; //opcional
  parentId?: number; // para respuestas a comentarios
};

export type CommentWithActions = EventComment & {
  onReply?: () => void;
};

export const mockComments: EventComment[] = (() => {
  const stored = localStorage.getItem("mockComments");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Verificar que sea un array válido
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      console.warn("Error parsing stored comments, using defaults:", error);
    }
  }
  
  // Datos por defecto
  const defaultComments = [
      { id: 1, 
        eventId: 1, 
        name: "Lucas Hernández", 
        content: "I can’t wait for Bad Bunny’s concert in Medellín this Juary 2026! it’s going to be amazing to see him live with all my friends. Counting down the days!", 
        createdAt: "2025-09-10T14:30:00Z",
        avatarUrl: "https://i.pravatar.cc/150?img=3",
      },
    {
      id: 2,
      eventId: 1,
      name: "Clara Ocampo",
      content: "I’ve never been to a Bad Bunny concert before, but everyone says the atmosphere is incredible . Can’t wait to experience it in Medellín!",
      createdAt: "2025-09-11T09:15:00Z",
    },
    {
      id: 3,
      eventId: 2,
      name: "Stiven Herrera",
      content: "¿Alguien va al meet & greet?",
      createdAt: "2025-09-12T10:00:00Z",
      avatarUrl: "https://github.com/shadcn.png",
    },
    {
      id: 4,
      eventId: 2,
      name: "Andrés Pérez",
      content: "Guns N’ Roses coming to Medellín? This is going to be the loudest night the Atanasio has ever seen!",
      createdAt: "2025-09-11T09:15:00Z",
    },
    {
      id: 5,
      eventId: 2,
      name: "Margarita Gómez",
      content: "October can't come soon enough. Sweet Child O' Mine live in Medellín will be legendary!",
      createdAt: "2025-09-10T14:30:00Z",
    },
    // Comentarios con respuestas anidadas para probar eliminación
    {
      id: 6,
      eventId: 1,
      name: "Steven Herrera", // Administrador
      content: "Este comentario tiene respuestas. Al eliminarlo, deberían desaparecer todas las respuestas también.",
      createdAt: "2025-10-27T10:00:00Z",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 7,
      eventId: 1,
      name: "Dahiana Ruiz",
      content: "Esta es una respuesta al comentario de Steven.",
      createdAt: "2025-10-27T10:05:00Z",
      parentId: 6, // Respuesta al comentario 6
    },
    {
      id: 8,
      eventId: 1,
      name: "Andrés Pérez",
      content: "Esta es otra respuesta al mismo comentario.",
      createdAt: "2025-10-27T10:10:00Z",
      parentId: 6, // Respuesta al comentario 6
    },
    ];
  
  // Guardar datos por defecto en localStorage
  localStorage.setItem("mockComments", JSON.stringify(defaultComments));
  return defaultComments;
})();
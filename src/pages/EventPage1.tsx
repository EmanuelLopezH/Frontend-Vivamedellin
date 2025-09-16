"use client";

import {useState } from "react";
import EventBanner from "@/components/EventBanner";
import { Button } from "@/components/ui/button";
import { Calendar, Share2, Star } from "lucide-react"
import { CommentSection } from "@/components/CommentSection";

export default function EventPage() {
  //const [comments, setComments] = useState<EventComment[]>([]);
  //const [loading, setLoading] = useState(true);
  // ID del evento (simulado, en producción vendría de la URL o props)
  const eventId = 1;
  // Estado para simular si el usuario está logueado o no
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  /*useEffect(() => {
    commentService.getCommentsByEventId(1).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, []);*/

/*  // Handler para agregar comentario (simulado)
  const handleAddComment = (content: string) => {
    const newComment: EventComment = {
      id: Date.now(), // id numérico único temporal
      author: "Guest User", // aquí vendría el nombre del usuario autenticado
      content,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [newComment, ...prev]);
    // opcional: llamar a commentService.addComment(...) cuando lo implementes
  };*/

/*  // Handler para "log in" (simulación). En producción vendría del flujo de auth.
  const handleLogin = () => {
    // ejemplo simple: marcar como logueado
    setIsLoggedIn(true);
    // o redirigir a /login: router.push('/login')
  };*/

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <EventBanner />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-semibold">Bad Bunny in Medellín</h2>
        
        <Button className="bg-white text-slate-900 mr-4 shadow-lg">
          <Star className="mr-2 h-4 w-4" /> I'm Interested</Button>
        <Button className="bg-white text-slate-900 mr-4 shadow-lg">
          <Calendar className="mr-2 h-4 w-4" /> Add to Calendar</Button>
        <Button className="bg-white text-slate-900 mr-4 shadow-lg">
          <Share2 className="mr-2 h-4 w-4" /> Share Event</Button>

        <div className="text-slate-600 space-y-4">
          <p>
            Experience Bad Bunny Live at Atanasio Girardot Stadium on Friday, January 23, 2026!
            The countdown has begun! Bad Bunny is taking over Atanasio Girardot Stadium on Friday, 
            January 23, 2026, and with hits like PERRO NEGRO, un x100to and ADIVINO and a 
            following of 83.9M+ strong, you'll want to be front and center for this. 
          </p>
          <p>
            Does Bad Bunny have multiple events lined up? Yes. But this one is the one that will stand out.
            Get ready for a performance that will leave you with goosebumps, memories, and probably a few 
            tears (happy ones, we promise).
          </p>
          <p>
            The night will feature live renditions of their top hits and some exclusive performances that 
            will have you texting all your friends about what they missed.
            Why You Need to Be There?!
          </p>
          <p>
            With 64.8M+ jamming to their tracks every month, Bad Bunny is the artist of the moment. 
            Their viral hits are defining a generation—and this concert is your chance to catch them live.
            Also check out other Concerts in Medellin, Music events in Medellin, Arts events in Medellin.
          </p>
        </div>
        <h2 className="text-2xl font-semibold">Date & Location</h2>
        <div className="text-slate-600 space-y-4">
          <p>
            Fri, 23 Jan, 2026 at 8:00 pm - Sat, 24 Jan, 2026 at 12:00 am (COT) <br />
            Atanasio Girardot Stadium, Medellín, Colombia
          </p>
        </div>

        <CommentSection
          eventId={eventId}
          isLoggedIn={isLoggedIn}
          currentUserName="Demo User"
          onLogin={() => setIsLoggedIn(true)}
        />
      </div>
    </div>
  );
}

        /*<section>
          {loading ? (
            <p className="text-slate-500">Cargando comentarios...</p>
          ) : (
            <CommentSection
              comments={comments}
              isLoggedIn={isLoggedIn}
              onAddComment={handleAddComment}
              onLogin={handleLogin}
            />
          )}
        </section>*/
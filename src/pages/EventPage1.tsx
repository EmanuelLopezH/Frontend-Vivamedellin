"use client";

import {useState } from "react";
import EventBanner from "@/components/EventBanner";
import { Button } from "@/components/ui/button";
import { Calendar, Share2, Star } from "lucide-react"
import { CommentSection } from "@/components/CommentSection";
import { LoginDialog } from "@/components/LoginDialog"
import { useEvent } from "@/hooks/useEvents";

export default function EventPage() {
  // ID del evento (simulado, en producción vendría de la URL o props)
  const eventId = 1;
  // Estado para simular si el usuario está logueado o no
  const { Event, loading, error } = useEvent(eventId);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState(false)

  if (loading) return <div>Cargando evento...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Event) return <div>Evento no encontrado</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <EventBanner />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-semibold">{Event.title}</h2>
        
        <Button className="bg-white text-slate-900 mr-4 shadow-lg">
          <Star className="mr-2 h-4 w-4" /> I'm Interested</Button>
        <Button className="bg-white text-slate-900 mr-4 shadow-lg">
          <Calendar className="mr-2 h-4 w-4" /> Add to Calendar</Button>
        <Button className="bg-white text-slate-900 mr-4 shadow-lg">
          <Share2 className="mr-2 h-4 w-4" /> Share Event</Button>

        <div className="text-slate-600 space-y-4">
          <p>{Event.description}</p>
        </div>
        <h2 className="text-2xl font-semibold">Date & Location</h2>
        <div className="text-slate-600 space-y-4">
          <p>{Event.date}</p>
          <p>{Event.location}</p>
        </div>

        <CommentSection
          eventId={eventId}
          isLoggedIn={isLoggedIn}
          name="Demo User"
          onLogin={() => setLoginOpen(true)}
        />

        {/* Modal de login */}
        <LoginDialog
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onLoginSuccess={() => setIsLoggedIn(true)}
        />
      </div>
    </div>
  );
}
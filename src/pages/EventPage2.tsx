"use client";

import {useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Share2, Star } from "lucide-react"
import { CommentSection } from "@/components/CommentSection";
import EventBanner2 from "@/components/EventBanner2";

export default function EventPage() {
  // ID del evento (simulado, en producción vendría de la URL o props)
  const eventId = 2;
  // Estado para simular si el usuario está logueado o no
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <EventBanner2 />
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-semibold">Guns N' Roses in Medellín</h2>
        
        <Button className="bg-white text-slate-900 mr-4 shadow-lg">
          <Star className="mr-2 h-4 w-4" /> I'm Interested</Button>
        <Button className="bg-white text-slate-900 mr-4 shadow-lg">
          <Calendar className="mr-2 h-4 w-4" /> Add to Calendar</Button>
        <Button className="bg-white text-slate-900 mr-4 shadow-lg">
          <Share2 className="mr-2 h-4 w-4" /> Share Event</Button>

        <div className="text-slate-600 space-y-4">
          <p>
            It's that time of the year where everyone wants to have a musical breath! 
            Your favorite, Guns N' Roses is hitting Atanasio Girardot Stadium on Saturday, 
            October 11, 2025, and with a setlist that includes chart-toppers like 
            Sweet Child O' Mine, Welcome To The Jungle and Paradise City and 31.3M+ 
            fans backing them, you're in for a night of epic proportions. 
          </p>
          <p>
           With multiple shows planned, this event is the one you don't want to miss. 
           Whether you're a superfan or just curious, Guns N' Roses will take you on a 
           ride that will leave you breathless.
          </p>
          <p>
            Why You Shouldn't Miss It
            With over 31.1M+ monthly listeners and hits ruling the charts, Guns N' Roses is the artist 
            you need to see live. This concert is your chance to witness their greatness in person.
          </p>
        </div>
        <h2 className="text-2xl font-semibold">Date & Location</h2>
        <div className="text-slate-600 space-y-4">
          <p>
            Sat, 11 Oct, 2025 at 07:00 pm to 11:00 pm (COT)<br />
            Atanasio Girardot Stadium, Medellin, AN, Colombia
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
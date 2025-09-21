import { useEffect, useState } from "react";
import { eventService } from "@/services/eventService";
import type { Event } from "@/mocks/mockEvents";

export function useEvent(eventId: number) {
  const [Event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    eventService
      .getEventById(eventId)
      .then((data) => {
        setEvent(data || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error fetching events");
        setLoading(false);
      });
  }, [eventId]);

  return { Event, loading, error };
}
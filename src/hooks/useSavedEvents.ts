import { useState, useEffect, useCallback } from "react";
import { eventService, type SavedEvent } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

interface UseSavedEventsReturn {
  savedEvents: SavedEvent[];
  savedEventIds: Set<number>;
  loading: boolean;
  error: string | null;
  saveEvent: (eventId: number) => Promise<void>;
  unsaveEvent: (eventId: number) => Promise<void>;
  isEventSaved: (eventId: number) => boolean;
  loadSavedEvents: () => Promise<void>;
}

export function useSavedEvents(): UseSavedEventsReturn {
  const { toast } = useToast();
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSavedEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const events = await eventService.getSavedEvents();
      setSavedEvents(events);
      const ids = new Set(events.map(event => event.eventId));
      setSavedEventIds(ids);
      console.log('📋 Eventos guardados cargados:', events.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar eventos guardados";
      setError(errorMessage);
      console.error("Error en useSavedEvents:", err);
      if (!errorMessage.includes("401") && !errorMessage.includes("403")) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los eventos guardados",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveEvent = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      const savedEvent = await eventService.saveEvent(eventId);
      setSavedEvents(prev => [...prev, savedEvent]);
      setSavedEventIds(prev => new Set([...prev, eventId]));
      toast({
        title: "✓ Evento guardado",
        description: "El evento se agregó a tus favoritos",
      });
      console.log('✓ Evento guardado:', eventId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar evento";
      console.error("Error al guardar evento:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const unsaveEvent = useCallback(async (eventId: number) => {
    try {
      setLoading(true);
      await eventService.unsaveEvent(eventId);
      setSavedEvents(prev => prev.filter(event => event.eventId !== eventId));
      setSavedEventIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      toast({
        title: "✓ Evento removido",
        description: "El evento se quitó de tus favoritos",
      });
      console.log('✓ Evento removido:', eventId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al quitar evento";
      console.error("Error al quitar evento:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const isEventSaved = useCallback((eventId: number): boolean => {
    return savedEventIds.has(eventId);
  }, [savedEventIds]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadSavedEvents();
    }
  }, [loadSavedEvents]);

  return {
    savedEvents,
    savedEventIds,
    loading,
    error,
    saveEvent,
    unsaveEvent,
    isEventSaved,
    loadSavedEvents,
  };
}
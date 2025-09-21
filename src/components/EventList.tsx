import { useEvent } from '@/hooks/useEvents';

const EventList = () => {
  const { Event, loading, error } = useEvent(eventId);

  if (loading) {
    return <div>Cargando eventos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Lista de Eventos</h2>
      <ul>
        {Event.map((Event) => (
          <li key={Event.id}>
            <h3>{Event.title}</h3>
            <p>Fecha: {new Date(Event.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
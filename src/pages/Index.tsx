import EventList from '@/components/EventList';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sistema de Eventos</h1>
        <EventList />
      </div>
    </div>
  );
};

export default Index;

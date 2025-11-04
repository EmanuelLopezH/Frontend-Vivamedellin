"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoginDialog } from '@/components/LoginDialog';
import { RegisterDialog } from '@/components/RegisterDialog';
import { 
  MapPin, 
  Calendar, 
  Music, 
  Users, 
  Sparkles, 
  Heart,
  ArrowRight,
  Globe,
  Star
} from 'lucide-react';

const Index = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLoginSuccess = () => {
    console.log("✅ Login exitoso");
  };

  const handleRegisterSuccess = () => {
    console.log("✅ Registro exitoso");
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header / Navbar */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ViveMedellín
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              onClick={() => window.location.href = '/event-01'}
              className="hidden md:inline-flex"
            >
              Eventos
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLoginOpen(true)}
              className="hover:bg-blue-50"
            >
              Iniciar Sesión
            </Button>
            <Button 
              onClick={() => setRegisterOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Descubre Medellín como nunca antes
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Tu guía inteligente para
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              vivir Medellín
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explora eventos, descubre lugares increíbles y conecta con la vibrante cultura de la ciudad de la eterna primavera
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => setRegisterOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8"
            >
              Comenzar ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 hover:bg-white"
            >
              Ver eventos
              <Calendar className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">500+</div>
              <div className="text-sm text-slate-600">Eventos activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">50K+</div>
              <div className="text-sm text-slate-600">Usuarios activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900">100+</div>
              <div className="text-sm text-slate-600">Lugares únicos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos Destacados Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Eventos Destacados</h2>
            <p className="text-xl text-slate-600">Los conciertos más esperados en Medellín</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Evento 1: Bad Bunny */}
            <div 
              onClick={() => window.location.href = '/event-01'}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="h-64 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Music className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold">Bad Bunny</h3>
                  <p className="text-lg mt-2 opacity-90">Conejo Malo Tour 2026</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Viernes, 23 Enero 2026</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Estadio Atanasio Girardot</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Experimenta el show más esperado del año con Bad Bunny en vivo. Un x100to, PERRO NEGRO, ADIVINO y más hits.
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Ver Detalles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Evento 2: Guns N' Roses */}
            <div 
              onClick={() => window.location.href = '/event-02'}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="h-64 bg-gradient-to-br from-red-500 to-black flex items-center justify-center">
                <div className="text-center text-white p-6">
                  <Music className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold">Guns N' Roses</h3>
                  <p className="text-lg mt-2 opacity-90">World Tour 2025</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Sábado, 11 Octubre 2025</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Estadio Atanasio Girardot</span>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  La leyenda del rock regresa a Medellín. Sweet Child O' Mine, Welcome To The Jungle y todos los clásicos.
                </p>
                <Button className="w-full bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900">
                  Ver Detalles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">¿Qué puedes hacer?</h2>
            <p className="text-xl text-slate-600">Todo lo que necesitas para disfrutar Medellín al máximo</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Descubre Eventos</h3>
              <p className="text-slate-600">
                Conciertos, festivales, teatro y mucho más. Encuentra el evento perfecto para ti.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Explora Lugares</h3>
              <p className="text-slate-600">
                Museos, parques, restaurantes y sitios turísticos recomendados por la comunidad.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Conecta</h3>
              <p className="text-slate-600">
                Conoce personas con tus mismos intereses y crea experiencias inolvidables juntos.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cultura Paisa</h3>
              <p className="text-slate-600">
                Sumérgete en la rica cultura local con experiencias auténticas y tradicionales.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Personalizado</h3>
              <p className="text-slate-600">
                Recomendaciones inteligentes basadas en tus gustos y preferencias personales.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Favoritos</h3>
              <p className="text-slate-600">
                Guarda tus eventos y lugares favoritos para acceder a ellos cuando quieras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Globe className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Comienza tu aventura hoy
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a miles de paisas y visitantes que ya están descubriendo lo mejor de Medellín
          </p>
          <Button 
            size="lg" 
            onClick={() => setRegisterOpen(true)}
            className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8"
          >
            Crear cuenta gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ViveMedellín</span>
            </div>
            <div className="text-sm text-slate-400">
              © 2025 ViveMedellín. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>

      {/* Modales */}
      <LoginDialog 
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setLoginOpen(false)
          setRegisterOpen(true)
        }}
      />

      <RegisterDialog 
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => {
          setRegisterOpen(false)
          setLoginOpen(true)
        }}
      />
    </div>
  );
};

export default Index;
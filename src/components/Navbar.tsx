import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoginDialog } from "@/components/LoginDialog"
import { RegisterDialog } from "@/components/RegisterDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Search,
  Plus,
  Bell,
  User,
  BookMarked,
  Settings,
  LogOut,
  Shield,
  Menu,
  Calendar,
  Home,
} from "lucide-react"

interface UserData {
  id: number
  name: string
  email: string
  roles?: string[]
  profileImage?: string | null
}

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notificationsCount] = useState(0) // TODO: Conectar con backend de notificaciones
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  // Verificar sesión
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userString = localStorage.getItem("user")

    if (token && userString) {
      try {
        const userData: UserData = JSON.parse(userString)
        setUser(userData)
        setIsLoggedIn(true)
      } catch (error) {
        console.error("Error al parsear usuario:", error)
        handleLogout()
      }
    }
  }, [])

  // Cerrar menú mobile al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUser(null)
    navigate("/")
  }

  const handleLoginSuccess = () => {
    setLoginOpen(false)
    // Recargar usuario
    const userString = localStorage.getItem("user")
    if (userString) {
      const userData: UserData = JSON.parse(userString)
      setUser(userData)
      setIsLoggedIn(true)
    }
  }

  const handleRegisterSuccess = () => {
    setRegisterOpen(false)
    setLoginOpen(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const isAdmin = user?.roles?.includes("ROLE_ADMIN")

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img src="/LOGO VIVAMEDELLIN.png" alt="ViveMedellín" className="h-16 sm:h-20 object-contain" />
          </div>

          {/* Botones de navegación (centro) */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
            {!isLoggedIn && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="text-slate-600 hover:text-blue-600"
              >
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/posts")}
              className="text-slate-600 hover:text-purple-600"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Comunidad
            </Button>
          </div>

          {/* Barra de búsqueda (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex max-w-md mx-4"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </form>

          {/* Botones Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLoginOpen(true)}
                >
                  Iniciar sesión
                </Button>
                <Button
                  onClick={() => setRegisterOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Registrarse
                </Button>
              </>
            ) : (
              <>
                {/* Botón Crear Evento */}
                <Button
                  onClick={() => navigate("/create-post")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">Crear evento</span>
                </Button>

                {/* Notificaciones */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="h-5 w-5" />
                  {notificationsCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notificationsCount > 9 ? "9+" : notificationsCount}
                    </Badge>
                  )}
                </Button>

                {/* Avatar + Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-slate-100"
                    >
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-medium text-slate-900 leading-none">
                          {user.name}
                        </span>
                        {isAdmin && (
                          <Badge variant="secondary" className="text-xs mt-0.5 h-4">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-slate-500">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Mi perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-posts")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Mis eventos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/saved-posts")}>
                      <BookMarked className="mr-2 h-4 w-4" />
                      Eventos guardados
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate("/admin")}>
                          <Shield className="mr-2 h-4 w-4" />
                          Panel Admin
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <img src="/logo-icon.svg" alt="ViveMedellín" className="h-8 w-8" />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ViveMedellín
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {/* Búsqueda Mobile */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="search"
                        placeholder="Buscar eventos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  {!isLoggedIn ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          setLoginOpen(true)
                        }}
                      >
                        Iniciar sesión
                      </Button>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          setRegisterOpen(true)
                        }}
                      >
                        Registrarse
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* Usuario Info */}
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          {isAdmin && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Botón Crear Evento */}
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                        onClick={() => navigate("/create-post")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear evento
                      </Button>

                      {/* Menu Items */}
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate("/notifications")}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Notificaciones
                          {notificationsCount > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {notificationsCount}
                            </Badge>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate("/profile")}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Mi perfil
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate("/my-posts")}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Mis eventos
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate("/saved-posts")}
                        >
                          <BookMarked className="h-4 w-4 mr-2" />
                          Eventos guardados
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => navigate("/admin")}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Panel Admin
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate("/settings")}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configuración
                        </Button>
                      </div>

                      {/* Logout */}
                      <Button
                        variant="outline"
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar sesión
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Modales de Login y Registro */}
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
      />
    </nav>
  )
}

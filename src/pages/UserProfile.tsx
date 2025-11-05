import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { PostCardGrid } from "@/components/PostCardGrid";
import {
  Calendar,
  BookMarked,
  MessageSquare,
  Settings,
  Loader2,
  MapPin,
} from "lucide-react";
import { getUserById, getUserPosts, type User } from "@/services/userService";
import type { Post } from "@/types/post";
import { useToast } from "@/hooks/use-toast";

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  // Verificar usuario actual
  useEffect(() => {
    const userString = localStorage.getItem("user");
    console.log("🔍 UserProfile - localStorage user:", userString);
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        console.log("✅ UserProfile - Parsed user:", userData);
        setCurrentUser(userData);
      } catch (error) {
        console.error("❌ Error al parsear usuario:", error);
      }
    } else {
      console.warn("⚠️ No hay usuario en localStorage");
    }
  }, []);

  // Cargar datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      console.log("🔍 UserProfile - fetchUser called with userId:", userId);
      
      if (!userId) {
        console.warn("⚠️ No userId provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Si es mi perfil y el backend falla, usar datos de localStorage
        const isMyProfile = currentUser?.id === parseInt(userId);
        console.log("🔍 Is my profile?", isMyProfile, "currentUser.id:", currentUser?.id, "userId:", userId);
        
        try {
          console.log("📡 Fetching user from backend...");
          const userData = await getUserById(parseInt(userId));
          console.log("✅ User data from backend:", userData);
          setUser(userData);
        } catch (error) {
          console.error("❌ Error al cargar usuario desde backend:", error);
          
          // Fallback: Si es mi perfil, usar datos de localStorage
          if (isMyProfile && currentUser) {
            console.log("🔄 Usando datos de localStorage como fallback");
            setUser(currentUser);
          } else {
            throw error; // Re-throw si no es mi perfil
          }
        }
      } catch (error) {
        console.error("❌ Error final al cargar usuario:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar el perfil del usuario",
          variant: "destructive",
        });
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser, toast]);

  // Cargar posts del usuario
  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;

      try {
        setPostsLoading(true);
        const data = await getUserPosts(parseInt(userId));
        setPosts(data.content || data);
      } catch (error) {
        console.error("Error al cargar posts:", error);
        // No mostrar toast aquí, solo dejar el array vacío
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    if (activeTab === "posts") {
      fetchPosts();
    }
  }, [userId, activeTab]);

  const handleEditSuccess = (updatedUser: User) => {
    setUser(updatedUser);
    toast({
      title: "¡Perfil actualizado!",
      description: "Tus cambios se han guardado correctamente",
    });
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isOwnProfile = currentUser?.id === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600">Usuario no encontrado</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del perfil */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Foto de perfil */}
            <div className="flex-shrink-0">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            {/* Info del usuario */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">
                    {user.name}
                  </h1>
                  <p className="text-slate-600 mb-2">{user.email}</p>
                  {user.about && (
                    <p className="text-slate-700 mt-3 max-w-2xl">{user.about}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Medellín, Colombia</span>
                  </div>
                </div>

                {/* Botón editar perfil (solo si es mi perfil) */}
                {isOwnProfile && (
                  <Button
                    onClick={() => setEditDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="ml-4"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Editar perfil
                  </Button>
                )}
              </div>

              {/* Badges de roles */}
              <div className="flex gap-2 mt-3">
                {user.roles?.includes("ROLE_ADMIN") && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Admin
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Miembro desde 2024
                </Badge>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{posts.length}</div>
              <div className="text-sm text-slate-600">Eventos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">0</div>
              <div className="text-sm text-slate-600">Guardados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">0</div>
              <div className="text-sm text-slate-600">Comentarios</div>
            </div>
          </div>
        </div>

        {/* Tabs de contenido */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="posts" className="gap-2">
              <Calendar className="h-4 w-4" />
              Mis Eventos
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <BookMarked className="h-4 w-4" />
              Guardados
            </TabsTrigger>
            <TabsTrigger value="comments" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Comentarios
            </TabsTrigger>
          </TabsList>

          {/* Tab: Mis Eventos */}
          <TabsContent value="posts">
            {postsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-slate-600">Cargando eventos...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">
                  {isOwnProfile
                    ? "Aún no has creado eventos"
                    : "Este usuario no ha creado eventos"}
                </p>
                {isOwnProfile && (
                  <Button
                    onClick={() => navigate("/create-post")}
                    className="mt-4"
                  >
                    Crear mi primer evento
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCardGrid
                    key={post.id}
                    post={post}
                    onUpdate={() => {
                      // Recargar posts después de actualizar
                      if (userId) {
                        getUserPosts(parseInt(userId)).then((data) => {
                          setPosts(data.content || data);
                        });
                      }
                    }}
                    isLoggedIn={!!currentUser}
                    isAdmin={currentUser?.roles?.includes("ROLE_ADMIN")}
                    currentUserId={currentUser?.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab: Eventos Guardados */}
          <TabsContent value="saved">
            <div className="text-center py-12 bg-white rounded-lg">
              <BookMarked className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">
                {isOwnProfile
                  ? "No tienes eventos guardados"
                  : "Este usuario no tiene eventos guardados públicos"}
              </p>
            </div>
          </TabsContent>

          {/* Tab: Comentarios */}
          <TabsContent value="comments">
            <div className="text-center py-12 bg-white rounded-lg">
              <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">
                No hay comentarios para mostrar
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de editar perfil */}
      {isOwnProfile && user && (
        <EditProfileDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          user={user}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

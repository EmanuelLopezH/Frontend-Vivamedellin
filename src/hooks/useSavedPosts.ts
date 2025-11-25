import { useState, useEffect, useCallback } from "react";
import { savedPostService, type SavedPost } from "@/services/savedPostService";
import { useToast } from "@/hooks/use-toast";

interface UseSavedPostsReturn {
  savedPosts: SavedPost[];
  savedPostIds: Set<number>;
  loading: boolean;
  error: string | null;
  savePost: (postId: number) => Promise<void>;
  unsavePost: (postId: number) => Promise<void>;
  isPostSaved: (postId: number) => boolean;
  checkIfSaved: (postId: number) => Promise<boolean>;
  loadSavedPosts: () => Promise<void>;
}

export function useSavedPosts(): UseSavedPostsReturn {
  const { toast } = useToast();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [savedPostIds, setSavedPostIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSavedPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const posts = await savedPostService.getSavedPosts();
      setSavedPosts(posts);
      const ids = new Set(posts.map(post => post.postId));
      setSavedPostIds(ids);
      console.log('📋 Posts guardados cargados:', posts.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar posts guardados";
      setError(errorMessage);
      console.error("Error en useSavedPosts:", err);
      if (!errorMessage.includes("401") && !errorMessage.includes("403")) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los posts guardados",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const savePost = useCallback(async (postId: number) => {
    try {
      setLoading(true);
      const response = await savedPostService.savePost(postId);
      
      // Actualizar estado local
      setSavedPostIds(prev => new Set([...prev, postId]));
      
      // Recargar la lista completa para tener los datos actualizados
      await loadSavedPosts();
      
      toast({
        title: "✓ Post guardado",
        description: response.message || "El post se agregó a tus favoritos",
      });
      console.log('✓ Post guardado:', postId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al guardar post";
      console.error("Error al guardar post:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast, loadSavedPosts]);

  const unsavePost = useCallback(async (postId: number) => {
    try {
      setLoading(true);
      const response = await savedPostService.unsavePost(postId);
      
      // Actualizar estado local
      setSavedPosts(prev => prev.filter(post => post.postId !== postId));
      setSavedPostIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      
      toast({
        title: "✓ Post removido",
        description: response.message || "El post se quitó de tus favoritos",
      });
      console.log('✓ Post removido:', postId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al quitar post";
      console.error("Error al quitar post:", err);
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

  const checkIfSaved = useCallback(async (postId: number): Promise<boolean> => {
    try {
      return await savedPostService.checkIfSaved(postId);
    } catch (error) {
      console.error("Error verificando post guardado:", error);
      return false;
    }
  }, []);

  const isPostSaved = useCallback((postId: number): boolean => {
    return savedPostIds.has(postId);
  }, [savedPostIds]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadSavedPosts();
    }
  }, [loadSavedPosts]);

  return {
    savedPosts,
    savedPostIds,
    loading,
    error,
    savePost,
    unsavePost,
    isPostSaved,
    checkIfSaved,
    loadSavedPosts,
  };
}
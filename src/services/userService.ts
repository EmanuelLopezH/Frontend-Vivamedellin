const API_URL = "http://localhost:8081/api";

export interface User {
  id: number;
  name: string;
  email: string;
  about?: string;
  profileImage?: string | null;
  roles?: string[];
}

export interface UpdateUserData {
  name: string;
  email: string;
  about?: string;
}

/**
 * Obtener información de un usuario
 */
export async function getUserById(userId: number): Promise<User> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener usuario");
  }

  return response.json();
}

/**
 * Actualizar perfil de usuario
 */
export async function updateUser(userId: number, data: UpdateUserData): Promise<User> {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar usuario");
  }

  return response.json();
}

/**
 * Subir imagen de perfil
 */
export async function uploadProfileImage(userId: number, imageFile: File): Promise<string> {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_URL}/users/profile-image/upload/${userId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir imagen de perfil");
  }

  // El backend retorna la URL de la imagen
  return response.text();
}

/**
 * Obtener posts de un usuario
 */
export async function getUserPosts(userId: number, pageNumber = 0, pageSize = 10) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(
    `${API_URL}/user/${userId}/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error al obtener posts del usuario");
  }

  return response.json();
}

import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/superheroes`,
});

export interface Superhero {
  id: string;
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string[];
  catchPhrase: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResponse {
  data: Superhero[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const superheroApi = {
  // Отримати всіх супергероїв з пагінацією
  getAll: (
    page: number = 1,
    limit: number = 5,
    search?: string
  ): Promise<PaginationResponse> =>
    api
      .get("", { params: { page, limit, search } })
      .then((response) => response.data),

  // Отримати одного супергероя
  getOne: (id: string): Promise<Superhero> =>
    api.get(`/${id}`).then((response) => response.data),

  // Створити супергероя
  create: (
    hero: Omit<Superhero, "id" | "createdAt" | "updatedAt">
  ): Promise<Superhero> => api.post("", hero).then((response) => response.data),

  // Оновити супергероя - ВИПРАВЛЕНО: використовуємо PATCH замість PUT
  update: (id: string, hero: Partial<Superhero>): Promise<Superhero> =>
    api.patch(`/${id}`, hero).then((response) => response.data),

  // Видалити супергероя
  delete: (id: string): Promise<void> =>
    api.delete(`/${id}`).then((response) => response.data),

  // Додати зображення (новий метод з FormData)
  addImage: (id: string, imageFile: File): Promise<Superhero> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    return api
      .post(`/${id}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data);
  },

  // Видалити зображення
  removeImage: (id: string, imageUrl: string): Promise<Superhero> =>
    api
      .delete(`/${id}/images`, { data: { imageUrl } })
      .then((response) => response.data),
};

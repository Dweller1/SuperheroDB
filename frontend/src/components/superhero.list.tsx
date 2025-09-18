import { useState, useEffect, useCallback } from "react";
import SuperheroCard from "./superhero.card";
import { superheroApi } from "../services/api.service";
import type { Superhero } from "../services/api.service";

// Debounce функція
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SuperheroList = () => {
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms затримка

  const fetchSuperheroes = useCallback(
    async (page: number = 1, search?: string) => {
      try {
        setLoading(true);
        const response = await superheroApi.getAll(page, 5, search);
        setSuperheroes(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError("Не вдалося завантажити супергероїв");
        console.error("Error fetching superheroes:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSuperheroes(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchSuperheroes]);

  const handleDeleteSuperhero = async (id: string) => {
    try {
      await superheroApi.delete(id);
      setSuperheroes((prev) => prev.filter((hero) => hero.id !== id));
      // Оновити дані, якщо на поточній сторінці залишилось мало елементів
      if (superheroes.length === 1 && pagination.page > 1) {
        fetchSuperheroes(pagination.page - 1, debouncedSearchTerm);
      } else {
        fetchSuperheroes(pagination.page, debouncedSearchTerm);
      }
    } catch (err) {
      setError("Не вдалося видалити супергероя");
      console.error("Error deleting superhero:", err);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    fetchSuperheroes(newPage, debouncedSearchTerm);
  };

  if (loading && superheroes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <button
          onClick={() => fetchSuperheroes(1, debouncedSearchTerm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          Спробувати знову
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-indigo-900 text-center">
        База даних супергероїв
      </h1>

      {/* Пошук */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Пошук супергероїв..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10 shadow-sm bg-white bg-opacity-70 backdrop-blur-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {superheroes.length === 0 ? (
        <div className="text-center py-12 bg-white bg-opacity-70 rounded-xl backdrop-blur-sm mx-4">
          <div className="text-4xl mb-4 text-indigo-400">🦸‍♂️</div>
          <h2 className="text-xl text-indigo-700 mb-2">
            {debouncedSearchTerm ? "Нічого не знайдено" : "Немає супергероїв"}
          </h2>
          <p className="text-indigo-500">
            {debouncedSearchTerm
              ? "Спробуйте інший запит"
              : "Додайте першого героя!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
            {superheroes.map((superhero) => (
              <SuperheroCard
                key={superhero.id}
                superhero={superhero}
                onDelete={handleDeleteSuperhero}
              />
            ))}
          </div>

          {/* Пагінація */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 bg-white bg-opacity-70 py-3 rounded-xl backdrop-blur-sm mx-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Назад
              </button>

              <span className="text-indigo-700">
                Сторінка {pagination.page} з {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-indigo-300 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SuperheroList;

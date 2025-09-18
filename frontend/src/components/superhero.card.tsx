import { Link } from "react-router-dom";
import { useState } from "react";
import type { Superhero } from "../services/api.service";

interface SuperheroCardProps {
  superhero: Superhero;
  onDelete: (id: string) => void;
}

// Функція для генерації унікального кольору на основі нікнейму
const getColorByNickname = (nickname: string) => {
  const colors = [
    "from-blue-500 to-indigo-600", // Синій
    "from-purple-500 to-pink-600", // Фіолетово-рожевий
    "from-emerald-500 to-teal-600", // Зелений
    "from-amber-500 to-orange-600", // Помаранчевий
    "from-rose-500 to-red-600", // Червоний
    "from-violet-500 to-purple-600", // Фіолетовий
    "from-cyan-500 to-blue-600", // Блакитний
  ];

  const index = nickname.length % colors.length;
  return colors[index];
};

const SuperheroCard = ({ superhero, onDelete }: SuperheroCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const gradientClass = getColorByNickname(superhero.nickname);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(superhero.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  // Беремо перше зображення для картки
  const mainImage = superhero.images?.[0] || "";

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/superhero/${superhero.id}`} className="block h-full">
        <div
          className={`border border-gray-200 p-4 rounded-xl hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br ${gradientClass} text-white h-full flex flex-col group hover:border-opacity-30 transition-all duration-300`}
        >
          {/* Зображення героя */}
          <div className="flex justify-center mb-4">
            <div className="w-32 h-32 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden border-4 border-white border-opacity-30 group-hover:border-opacity-50 transition-colors backdrop-blur-sm">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={superhero.nickname}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {superhero.nickname.charAt(0)}
                </span>
              )}
            </div>
          </div>

          {/* Інформація про героя */}
          <div className="flex flex-col flex-grow space-y-2 min-h-[180px]">
            <div className="text-lg font-bold text-center group-hover:text-white transition-colors">
              {superhero.nickname}
            </div>

            <div className="text-sm text-white text-opacity-80 text-center">
              {superhero.realName}
            </div>

            <div className="text-sm text-white text-opacity-90 line-clamp-3 flex-grow">
              {superhero.originDescription}
            </div>

            <div className="text-sm">
              <span className="font-semibold">Суперсили: </span>
              <span className="text-white text-opacity-90">
                {superhero.superpowers.slice(0, 2).join(", ")}
                {superhero.superpowers.length > 2 && "..."}
              </span>
            </div>
          </div>

          <div className="text-sm italic text-white text-opacity-90 text-center mt-3 pt-3 border-t border-white border-opacity-20 group-hover:text-opacity-100 transition-colors">
            "{superhero.catchPhrase}"
          </div>
        </div>
      </Link>

      {/* Кнопки дій - лише видалення */}
      {isHovered && !showDeleteConfirm && (
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            className="bg-white text-gray-700 p-2 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all border border-white border-opacity-30"
            onClick={handleDelete}
            title="Видалити"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Підтвердження видалення */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-xl p-4 flex flex-col justify-center items-center space-y-3 z-10 border border-gray-200 shadow-lg">
          <div className="text-red-500 text-xl mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-700 text-center">
            Видалити {superhero.nickname}?
          </p>
          <div className="flex space-x-2">
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Так
            </button>
            <button
              onClick={cancelDelete}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors"
            >
              Ні
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperheroCard;

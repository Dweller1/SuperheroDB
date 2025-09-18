import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { superheroApi } from "../services/api.service";

interface SuperheroFormData {
  nickname: string;
  realName: string;
  originDescription: string;
  superpowers: string[];
  catchPhrase: string;
  images: string[];
}

const SuperheroForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SuperheroFormData>({
    nickname: "",
    realName: "",
    originDescription: "",
    superpowers: [],
    catchPhrase: "",
    images: [],
  });

  const [currentPower, setCurrentPower] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSuperpower = () => {
    if (currentPower.trim()) {
      setFormData((prev) => ({
        ...prev,
        superpowers: [...prev.superpowers, currentPower.trim()],
      }));
      setCurrentPower("");
    }
  };

  const removeSuperpower = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      superpowers: prev.superpowers.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await superheroApi.create(formData);
      navigate("/");
    } catch (err) {
      setError("Не вдалося створити супергероя");
      console.error("Error creating superhero:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Перевірка формату файлу
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ];
      if (!validImageTypes.includes(file.type)) {
        setError(
          "Будь ласка, виберіть файл зображення (JPEG, PNG, GIF, WEBP, SVG)"
        );
        return;
      }

      // Перевірка розміру файлу
      if (file.size > 5 * 1024 * 1024) {
        setError("Розмір файлу не повинен перевищувати 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, result],
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Додати нового супергероя
          </h1>
          <p className="text-gray-600">Заповніть інформацію про нового героя</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Псевдонім *
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Наприклад: Супермен"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Справжнє ім'я *
              </label>
              <input
                type="text"
                name="realName"
                value={formData.realName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Наприклад: Кларк Кент"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Опис походження *
            </label>
            <textarea
              name="originDescription"
              value={formData.originDescription}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Опишіть походження героя..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Суперсили
            </label>

            {formData.superpowers.map((power, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {power}
                </span>
                <button
                  type="button"
                  onClick={() => removeSuperpower(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={currentPower}
                onChange={(e) => setCurrentPower(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
                placeholder="Додати суперсилу..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSuperpower())
                }
              />
              <button
                type="button"
                onClick={addSuperpower}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Додати
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Крилата фраза
            </label>
            <input
              type="text"
              name="catchPhrase"
              value={formData.catchPhrase}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder='Наприклад: "Правда, справедливість і американський спосіб життя!"'
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Зображення героя
            </label>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <label className="cursor-pointer inline-block">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                Завантажити фото
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                multiple
              />
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? "Створення..." : "Додати героя"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SuperheroForm;

import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { superheroApi } from "../services/api.service";
import type { Superhero } from "../services/api.service";

const SuperheroDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [superhero, setSuperhero] = useState<Superhero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHero, setEditedHero] = useState<Partial<Superhero> | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (id) {
      fetchSuperhero(id);
    }
  }, [id]);

  useEffect(() => {
    setError(null);
  }, [isEditing]);

  const fetchSuperhero = async (heroId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await superheroApi.getOne(heroId);
      setSuperhero(data);
      setEditedHero(data);
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      }
    } catch (err) {
      setError("Не вдалося завантажити дані супергероя");
      console.error("Error fetching superhero:", err);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    if (!superhero || !editedHero) return false;
    return JSON.stringify(editedHero) !== JSON.stringify(superhero);
  };

  const handleSave = async () => {
    if (!id || !editedHero) return;

    try {
      setError(null);
      const { id: _, createdAt, updatedAt, ...updateData } = editedHero;
      const updatedHero = await superheroApi.update(id, updateData);
      setSuperhero(updatedHero);
      setEditedHero(updatedHero);
      setIsEditing(false);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Не вдалося зберегти зміни";
      setError(errorMessage);
      console.error("Error updating superhero:", err);
    }
  };

  const handleCancel = () => {
    setEditedHero(superhero || null);
    setIsEditing(false);
    setError(null);
    setNewImageUrl("");
  };

  const handleInputChange = (field: keyof Superhero, value: any) => {
    setEditedHero((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSuperpowerChange = (index: number, value: string) => {
    if (!editedHero) return;

    const newSuperpowers = [...(editedHero.superpowers || [])];
    newSuperpowers[index] = value;
    handleInputChange("superpowers", newSuperpowers);
  };

  const addSuperpower = () => {
    if (!editedHero) return;

    handleInputChange("superpowers", [...(editedHero.superpowers || []), ""]);
  };

  const removeSuperpower = (index: number) => {
    if (!editedHero) return;

    const newSuperpowers = [...(editedHero.superpowers || [])];
    newSuperpowers.splice(index, 1);
    handleInputChange("superpowers", newSuperpowers);
  };

  const handleAddImage = async () => {
    if (!id || !newImageUrl.trim()) return;

    try {
      setError(null);

      // Простая валидация URL
      try {
        new URL(newImageUrl);
      } catch (err) {
        setError("Неправильний формат URL");
        return;
      }

      await superheroApi.addImage(id, newImageUrl.trim());
      setNewImageUrl("");
      await fetchSuperhero(id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Не вдалося додати зображення");
      console.error("Error adding image:", err);
    }
  };

  const removeImage = async (imageUrl: string) => {
    if (id) {
      try {
        setError(null);
        await superheroApi.removeImage(id, imageUrl);
        fetchSuperhero(id);

        if (selectedImage === imageUrl && superhero?.images) {
          const remainingImages = superhero.images.filter(
            (img) => img !== imageUrl
          );
          if (remainingImages.length > 0) {
            setSelectedImage(remainingImages[0]);
          } else {
            setSelectedImage("");
          }
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Не вдалося видалити зображення"
        );
        console.error("Error removing image:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !superhero || !editedHero) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {error || "Супергероя не знайдено!"}
        </h2>
        <Link to="/" className="text-blue-500 hover:underline">
          Повернутися до списку
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Назад до списку
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedHero.nickname || ""}
                    onChange={(e) =>
                      handleInputChange("nickname", e.target.value)
                    }
                    className="text-3xl font-bold bg-white/20 rounded px-3 py-2 mb-2 w-full max-w-md"
                  />
                ) : (
                  <h1 className="text-3xl font-bold">{superhero.nickname}</h1>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    value={editedHero.realName || ""}
                    onChange={(e) =>
                      handleInputChange("realName", e.target.value)
                    }
                    className="text-blue-100 bg-white/20 rounded px-3 py-1 w-full max-w-md"
                  />
                ) : (
                  <p className="text-blue-100 mt-1 text-lg">
                    {superhero.realName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                {isEditing ? "Скасувати редагування" : "Редагувати профіль"}
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={superhero.nickname}
                      className="max-h-[380px] max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl font-bold text-gray-400">
                        {superhero.nickname.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {superhero.images && superhero.images.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800">
                      Усі зображення:
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {superhero.images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                            selectedImage === image
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setSelectedImage(image)}
                        >
                          <img
                            src={image}
                            alt={`${superhero.nickname} ${index + 1}`}
                            className="w-20 h-20 object-cover"
                          />
                          {isEditing && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(image);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              title="Видалити зображення"
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Вставте URL зображення"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleAddImage}
                        disabled={!newImageUrl.trim()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Додати
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Вставте URL зображення (наприклад:
                      https://example.com/image.jpg)
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Опис походження *
                      </label>
                      <textarea
                        value={editedHero.originDescription || ""}
                        onChange={(e) =>
                          handleInputChange("originDescription", e.target.value)
                        }
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Суперсили
                      </label>
                      <div className="space-y-2">
                        {editedHero.superpowers?.map((power, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={power}
                              onChange={(e) =>
                                handleSuperpowerChange(index, e.target.value)
                              }
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Назва суперсили"
                            />
                            <button
                              type="button"
                              onClick={() => removeSuperpower(index)}
                              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                              title="Видалити силу"
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSuperpower}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Додати суперсилу
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Крилата фраза
                      </label>
                      <input
                        type="text"
                        value={editedHero.catchPhrase || ""}
                        onChange={(e) =>
                          handleInputChange("catchPhrase", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder='Наприклад: "З правдою, справедливістю..."'
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={!hasChanges()}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          hasChanges()
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        Зберегти зміни
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Скасувати
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Опис походження
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {superhero.originDescription}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Суперсили
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {superhero.superpowers.map((power, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {power}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Крилата фраза
                      </h3>
                      <p className="text-blue-600 italic text-xl">
                        "{superhero.catchPhrase}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Інформація про запис
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Створено:</span>
                          <p>
                            {new Date(superhero.createdAt).toLocaleDateString(
                              "uk-UA"
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Оновлено:</span>
                          <p>
                            {new Date(superhero.updatedAt).toLocaleDateString(
                              "uk-UA"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperheroDetails;

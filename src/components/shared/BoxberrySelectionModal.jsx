import React, { useState, useEffect, useRef } from "react";
import { X, MapPin, Search } from "lucide-react";

export default function BoxberrySelectionModal({
  isOpen,
  onClose,
  onSelectStore,
}) {
  const API_KEY = "275f4252-f50b-4872-91e3-17f3e668263f";
  const BOXBERRY_API_KEY = "ad6fd06b28f7e8d0a94d9e0de47ce1e6";
  const BOXBERRY_API_URL = "https://api.boxberry.ru/json.php";

  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState({ name: "Томск", code: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);

  // Загрузка списка городов из API Boxberry
  useEffect(() => {
    if (isOpen) {
      const loadCities = async () => {
        try {
          const response = await fetch(
            `${BOXBERRY_API_URL}?token=${BOXBERRY_API_KEY}&method=ListCities`
          );
          const data = await response.json();

          if (Array.isArray(data)) {
            setCities(data);
            // Найдем код для Томска (по умолчанию)
            const tomsk = data.find(
              (city) => city.Name.toLowerCase() === "томск"
            );
            if (tomsk) {
              setSelectedCity({ name: "Томск", code: tomsk.Code });
            }
          }
        } catch (error) {
          console.error("Ошибка загрузки городов:", error);
        }
      };

      loadCities();
    }
  }, [isOpen, BOXBERRY_API_KEY]);

  // Загрузка пунктов выдачи по коду города
  const loadBoxberryPoints = async (cityCode) => {
    if (!cityCode) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${BOXBERRY_API_URL}?token=${BOXBERRY_API_KEY}&method=ListPoints&prepaid=1&CityCode=${cityCode}`
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedPoints = data.map((point) => ({
          id: point.Code,
          name: `ПВЗ Boxberry ${point.Name}`,
          address: point.Address,
          schedule: point.WorkSchedule,
          phone: point.Phone,
          coordinates: [
            parseFloat(point.GPS_Latitude),
            parseFloat(point.GPS_Longitude),
          ],
          description: point.TripDescription || "",
          metro: point.Metro || "",
        }));

        setPoints(formattedPoints);
        console.log(`Найдено ${formattedPoints.length} пунктов Boxberry`);

        // Если есть точки и карта, центрируем и добавляем метки
        if (formattedPoints.length > 0 && mapInstance) {
          updateMapWithPoints(formattedPoints, mapInstance);
        }
      } else {
        setPoints([]);
      }
    } catch (error) {
      console.error("Ошибка загрузки ПВЗ:", error);
      setPoints([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление карты с новыми точками
  const updateMapWithPoints = (pointsData, map) => {
    if (!map || !window.ymaps) return;

    // Очистка карты
    map.geoObjects.removeAll();

    // Создаем кластеризатор
    const clusterer = new window.ymaps.Clusterer({
      preset: "islands#redClusterIcons",
      clusterDisableClickZoom: false,
      clusterOpenBalloonOnClick: true,
      clusterBalloonContentLayout: "cluster#balloonCarousel",
      clusterBalloonPagerSize: 5,
    });

    // Создаем метки
    const placemarks = pointsData
      .map((point) => {
        if (!point.coordinates[0] || !point.coordinates[1]) return null;

        return new window.ymaps.Placemark(
          point.coordinates,
          {
            balloonContentHeader: point.name,
            balloonContentBody: `
            <div style="padding: 10px">
              <p><b>Адрес:</b> ${point.address}</p>
              ${point.metro ? `<p><b>Метро:</b> ${point.metro}</p>` : ""}
              <p><b>Режим работы:</b> ${point.schedule}</p>
              ${point.phone ? `<p><b>Телефон:</b> ${point.phone}</p>` : ""}
              ${
                point.description
                  ? `<p><b>Как добраться:</b> ${point.description}</p>`
                  : ""
              }
              <button id="select-point-${point.id}" 
                style="background: #FF3333; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-top: 10px">
                Выбрать этот пункт
              </button>
            </div>
          `,
            clusterCaption: point.address,
          },
          {
            preset: "islands#redDotIcon",
          }
        );
      })
      .filter(Boolean);

    // Добавляем метки в кластеризатор
    clusterer.add(placemarks);
    map.geoObjects.add(clusterer);

    // Добавляем обработчики событий для меток
    placemarks.forEach((placemark, index) => {
      placemark.events.add("balloonopen", () => {
        setTimeout(() => {
          const point = pointsData[index];
          const selectBtn = document.getElementById(`select-point-${point.id}`);
          if (selectBtn) {
            selectBtn.addEventListener("click", () => {
              setSelectedPoint(point);
              placemark.balloon.close();
            });
          }
        }, 100);
      });

      placemark.events.add("click", () => {
        setSelectedPoint(pointsData[index]);
      });
    });

    // Подгоняем карту под все метки
    if (placemarks.length > 1) {
      map.setBounds(clusterer.getBounds(), {
        checkZoomRange: true,
        zoomMargin: 30,
      });
    } else if (placemarks.length === 1) {
      map.setCenter(pointsData[0].coordinates, 15);
    }
  };

  // Инициализация карты
  useEffect(() => {
    if (isOpen && !isMapLoaded) {
      const initYandexMap = () => {
        if (!window.ymaps) {
          const script = document.createElement("script");
          script.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`;
          script.async = true;
          script.onload = () => window.ymaps.ready(initializeMap);
          document.body.appendChild(script);
        } else {
          window.ymaps.ready(initializeMap);
        }
      };

      const initializeMap = () => {
        try {
          const map = new window.ymaps.Map(mapRef.current, {
            center: [56.48, 84.98], // Томск по умолчанию
            zoom: 11,
            controls: ["zoomControl", "fullscreenControl"],
          });

          setMapInstance(map);
          setIsMapLoaded(true);

          // Если у нас уже есть точки к моменту инициализации карты
          if (points.length > 0) {
            updateMapWithPoints(points, map);
          }
        } catch (error) {
          console.error("Ошибка инициализации карты:", error);
        }
      };

      initYandexMap();
    }

    return () => {
      if (mapInstance) {
        mapInstance.destroy();
        setMapInstance(null);
        setIsMapLoaded(false);
      }
    };
  }, [isOpen, API_KEY]);

  // Загрузка точек при изменении выбранного города
  useEffect(() => {
    if (selectedCity.code && isOpen) {
      loadBoxberryPoints(selectedCity.code);
    }
  }, [selectedCity.code, isOpen]);

  // Поиск городов при вводе
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(e.target.value);

    if (query.length >= 2) {
      const filteredCities = cities
        .filter((city) => city.Name.toLowerCase().includes(query))
        .slice(0, 10); // Ограничиваем результаты

      setSearchResults(filteredCities);
    } else {
      setSearchResults([]);
    }
  };

  // Выбор города из списка
  const handleCitySelect = (city) => {
    setSelectedCity({ name: city.Name, code: city.Code });
    setSearchQuery(city.Name);
    setSearchResults([]);
  };

  // Подтверждение выбора пункта
  const handleConfirmSelection = () => {
    if (selectedPoint) {
      onSelectStore(selectedPoint);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://boxberry.ru/upload/iblock/e9b/logo-main.svg"
              alt="Boxberry"
              className="h-8 mr-2"
            />
            <h2 className="text-lg font-medium">Выберите пункт выдачи</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Поисковая строка */}
        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Введите город для поиска ПВЗ Boxberry..."
              className="w-full p-3 pl-10 border border-gray-300 rounded focus:outline-none focus:border-red-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((city) => (
                  <div
                    key={city.Code}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-none"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city.Name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Счетчик найденных пунктов */}
        <div className="px-4 py-2 text-sm text-gray-600">
          {!isLoading && (
            <span>
              Найдено пунктов выдачи: <strong>{points.length}</strong>
            </span>
          )}
        </div>

        {/* Контейнер карты */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={mapRef}
            className="w-full h-[500px] rounded-md"
            style={{ minHeight: "450px" }}
          ></div>

          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* Выбранный пункт */}
        {selectedPoint && (
          <div className="p-4 border-t bg-red-50">
            <div className="flex items-start">
              <MapPin
                className="mr-2 text-red-600 mt-1 flex-shrink-0"
                size={18}
              />
              <div className="flex-1">
                <div className="font-medium">{selectedPoint.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedPoint.address}
                </div>
                {selectedPoint.metro && (
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Метро:</span>{" "}
                    {selectedPoint.metro}
                  </div>
                )}
                {selectedPoint.schedule && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Режим работы:</span>{" "}
                    {selectedPoint.schedule}
                  </div>
                )}
                {selectedPoint.phone && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Телефон:</span>{" "}
                    {selectedPoint.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="p-4 border-t flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded mr-2 text-sm hover:bg-gray-100"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedPoint}
            className={`px-4 py-2 rounded text-white text-sm ${
              selectedPoint
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Выбрать этот пункт
          </button>
        </div>
      </div>
    </div>
  );
}

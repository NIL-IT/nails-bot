import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function BoxberrySelectionModal({
  isOpen,
  onClose,
  onSelectStore,
}) {
  const API_KEY = "275f4252-f50b-4872-91e3-17f3e668263f";
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const mapRef = useRef(null);
  const yandexMapRef = useRef(null);
  const placemarkerRef = useRef(null);

  // Initialize map when component mounts and modal is open
  const initMap = useCallback(() => {
    // Return early if map is already initialized or DOM element is not ready
    if (isMapInitialized || !mapRef.current || !window.ymaps) return;

    window.ymaps.ready(() => {
      // Проверяем, что DOM-элемент существует и имеет размеры
      if (
        mapRef.current &&
        mapRef.current.offsetWidth > 0 &&
        mapRef.current.offsetHeight > 0 &&
        !yandexMapRef.current // Ensure map doesn't already exist
      ) {
        console.log("Creating new map instance");

        // Create map instance
        const map = new window.ymaps.Map(mapRef.current, {
          center: [56.4977, 84.9744], // Tomsk center coordinates
          zoom: 12,
          controls: ["zoomControl"],
        });

        // Create placemarker
        const placemark = new window.ymaps.Placemark(
          [55.76, 37.64],
          {},
          {
            draggable: true,
          }
        );

        // Add placemarker to map
        map.geoObjects.add(placemark);

        // Handle placemarker drag end
        placemark.events.add("dragend", () => {
          const coords = placemark.geometry.getCoordinates();
          setCoordinates(coords);

          // Reverse geocode to get address
          window.ymaps.geocode(coords).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            const address = firstGeoObject.getAddressLine();
            setSelectedAddress(address);
            setSearchQuery(address);
            // Set flag to prevent search results from showing
            setIsAddressSelected(true);
          });
        });

        // Handle map click
        map.events.add("click", (e) => {
          const coords = e.get("coords");
          placemark.geometry.setCoordinates(coords);
          setCoordinates(coords);

          // Reverse geocode to get address
          window.ymaps.geocode(coords).then((res) => {
            const firstGeoObject = res.geoObjects.get(0);
            const address = firstGeoObject.getAddressLine();
            setSelectedAddress(address);
            setSearchQuery(address);
            // Set flag to prevent search results from showing
            setIsAddressSelected(true);
          });
        });

        // Save references
        yandexMapRef.current = map;
        placemarkerRef.current = placemark;
        setIsMapInitialized(true);
      }
    });
  }, [isMapInitialized]);

  // Load Yandex Maps script and initialize map
  useEffect(() => {
    if (!isOpen) return;

    const loadYandexMaps = () => {
      // Проверяем, что скрипт еще не загружен
      let scriptElement = document.querySelector(
        'script[src*="api-maps.yandex.ru"]'
      );

      if (!scriptElement) {
        // Load Yandex Maps script if not already loaded
        scriptElement = document.createElement("script");
        scriptElement.src = `https://api-maps.yandex.ru/2.1/?apikey=${API_KEY}&lang=ru_RU`;
        scriptElement.async = true;
        scriptElement.onload = () => {
          // Initialize map after script is loaded
          initMap();
        };
        document.head.appendChild(scriptElement);
      } else if (window.ymaps) {
        // If the script is already loaded, just initialize the map
        initMap();
      }
    };

    // Даем время модальному окну полностью открыться перед загрузкой карты
    const timer = setTimeout(loadYandexMaps, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, initMap]);

  // Clean up map instance when component unmounts or modal closes
  useEffect(() => {
    if (!isOpen && yandexMapRef.current) {
      // Destroy map when modal closes
      console.log("Destroying map instance");
      yandexMapRef.current.destroy();
      yandexMapRef.current = null;
      placemarkerRef.current = null;
      setIsMapInitialized(false);
    }
  }, [isOpen]);

  // Resize handler
  useEffect(() => {
    if (!mapRef.current || !isOpen || !yandexMapRef.current) return;

    const handleResize = () => {
      if (yandexMapRef.current) {
        yandexMapRef.current.container.fitToViewport();
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mapRef.current);

    // Also handle window resize
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, isMapInitialized]);

  // Search for address
  const searchAddress = (query) => {
    if (!window.ymaps) return;
    window.ymaps.geocode(query).then((res) => {
      const results = [];
      res.geoObjects.each((obj) => {
        results.push({
          address: obj.getAddressLine(),
          coordinates: obj.geometry.getCoordinates(),
        });
      });
      setSearchResults(results);
    });
  };

  // Handle address selection from search results
  const handleAddressSelect = (result) => {
    setSelectedAddress(result.address);
    setSearchQuery(result.address);
    setCoordinates(result.coordinates);
    setSearchResults([]);
    // Set flag to prevent search results from showing
    setIsAddressSelected(true);

    if (yandexMapRef.current && placemarkerRef.current) {
      yandexMapRef.current.setCenter(result.coordinates, 15);
      placemarkerRef.current.geometry.setCoordinates(result.coordinates);
    }
  };

  // Handle input change
  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
    // Reset the selected flag when user manually types
    setIsAddressSelected(false);
  };

  // Debounce search
  useEffect(() => {
    // Only perform search if user is actively typing (not after selection)
    if (isAddressSelected) {
      return;
    }

    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchAddress(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isAddressSelected]);

  // Функция для выбора пункта BoxBerry
  const handleSelectPoint = (point) => {
    setSelectedPoint(point);
    // Центрируем карту на выбранном пункте
    if (yandexMapRef.current && point.coordinates) {
      yandexMapRef.current.setCenter(point.coordinates, 15);
      placemarkerRef.current.geometry.setCoordinates(point.coordinates);
    }
  };

  // Функция для подтверждения выбора точки
  const confirmSelection = () => {
    if (selectedPoint) {
      onSelectStore(selectedPoint);
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="p-4 border-b flex items-center justify-between">
          <Link target="_blank" to={"https://boxberry.ru/"}>
            <img
              src="/img/logo_header_new.png"
              alt="Boxberry"
              className="h-8 mr-2"
            />
          </Link>
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
              onChange={handleSearchQueryChange}
              placeholder="Адрес или объект"
              className="w-full p-3 pl-10 border border-gray-300 rounded focus:outline-none focus:border-red-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            {!isAddressSelected && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-none"
                    onClick={() => handleAddressSelect(result)}
                  >
                    {result.address}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Контейнер карты */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={mapRef}
            className="w-full h-full"
            style={{
              minHeight: "400px",
              height: "100%",
            }}
          ></div>
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
        <div className="p-4 border-t flex justify-center gap-4">
          <button
            onClick={confirmSelection}
            disabled={!selectedPoint}
            className={`px-4 py-2 rounded text-white text-sm ${
              selectedPoint ? "bg-primary " : "bg-primary/80 cursor-not-allowed"
            }`}
          >
            Выбрать этот пункт
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded mr-2 text-sm hover:bg-gray-100"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function StoreSelectionModal({
  isOpen,
  onClose,
  onSelectStore,
}) {
  const [selectedStore, setSelectedStore] = useState(null);

  const stores = [
    {
      id: "leto",
      name: "ТОМСК ТЦ ЛЕТО",
      address: "Томск, ул. Нахимова 8, ст. 13",
      hours: "Пн-Вс с 10:00 до 21:00",
    },
    {
      id: "prospekt",
      name: "ТОМСК ТЦ ПРОСПЕКТ",
      address: "пр. Ленина, 159",
      hours: "Пн-Вс с 10:00 до 21:00",
    },
    {
      id: "manezh",
      name: "ТОМСК ТЦ МАНЕЖ",
      address: "ул. Беринга, 10",
      hours: "Пн-Вс с 10:00 до 21:00",
    },
    {
      id: "marmelait",
      name: "СЕВЕРСК ТЦ МАРМЕЛАЙТ",
      address: "ул. Курчатова, 11А",
      hours: "Пн-Вс с 10:00 до 21:00",
    },
  ];

  // Close on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSelectStore = (store) => {
    setSelectedStore(store);
  };

  const handleConfirm = () => {
    if (selectedStore) {
      onSelectStore(selectedStore);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">
            Выберите магазин, откуда хотите забрать покупку
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="mb-4 border-b pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{store.name}</h3>
                  <p className="text-blue-500 text-sm">{store.address}</p>
                  <p className="text-gray-600 text-sm mt-1">{store.hours}</p>
                </div>
                <button
                  onClick={() => handleSelectStore(store)}
                  className="bg-white border border-pink-500 text-pink-500 hover:bg-primary hover:text-white transition-colors px-4 py-2 rounded text-sm"
                >
                  Выбрать
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleConfirm}
            disabled={!selectedStore}
            className={`w-full py-3 rounded-md font-medium bg-primary text-white ${
              selectedStore ? "" : " cursor-not-allowed opacity-80"
            }`}
          >
            Подтвердить выбор
          </button>
        </div>
      </div>
    </div>
  );
}

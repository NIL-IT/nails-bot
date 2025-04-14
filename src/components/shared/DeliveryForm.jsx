import React from "react";
import { MapPin, ChevronLeft } from "lucide-react";

export default function DeliveryForm({
  formData,
  handleInputChange,
  deliveryOption,
  handleSelectDelivery,
  selectedStore,
  handleOpenModal,
  isDeliveryComplete,
  handleFinalSubmit,
  handlePrevStep,
}) {
  console.log(deliveryOption);
  const isShowForm =
    deliveryOption === "courier" ||
    deliveryOption === "park" ||
    deliveryOption === "south_gate" ||
    deliveryOption === "boxberry";
  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between min-h-[80vh]">
      <div>
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            2
          </div>
          <span className="ml-3 font-medium">Выберите способ доставки</span>
        </div>

        <div className="mb-4">
          <div
            className={`border rounded-lg p-4 mb-3 cursor-pointer transition-colors ${
              deliveryOption === "selfPickup"
                ? "border-secondary"
                : "border-gray-300 hover:border-pink-300"
            }`}
            onClick={() => handleSelectDelivery("selfPickup")}
          >
            <div className="font-medium">Самовывоз из магазина ШТУЧКИ.PRO</div>
            <div className="text-primary text-sm">Бесплатно</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                deliveryOption === "courier"
                  ? "border-secondary"
                  : "border-gray-300 hover:border-pink-300"
              }`}
              onClick={() => handleSelectDelivery("courier")}
            >
              <div className="font-medium text-sm">Курьером по Томску</div>
              <div className="text-primary text-sm">200.00 ₽</div>
            </div>
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                deliveryOption === "south_gate"
                  ? "border-secondary"
                  : "border-gray-300 hover:border-pink-300"
              }`}
              onClick={() => handleSelectDelivery("south_gate")}
            >
              <div className="font-medium text-sm">Курьером в Южные ворота</div>
              <div className="text-primary text-sm">300.00 ₽</div>
            </div>
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                deliveryOption === "park"
                  ? "border-secondary"
                  : "border-gray-300 hover:border-pink-300"
              }`}
              onClick={() => handleSelectDelivery("park")}
            >
              <div className="font-medium text-sm">
                Курьером в Северный Парк
              </div>
              <div className="text-primary text-sm">250.00 ₽</div>
            </div>
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                deliveryOption === "boxberry"
                  ? "border-secondary"
                  : "border-gray-300 hover:border-pink-300"
              }`}
              onClick={() => handleSelectDelivery("boxberry")}
            >
              <div className="font-medium text-sm">
                Самовывоз из ПВЗ Boxberry
              </div>
              <div className="text-primary text-sm">162.00 ₽</div>
            </div>
          </div>
        </div>

        {deliveryOption === "selfPickup" && (
          <div className="mb-4">
            {selectedStore ? (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{selectedStore.name}</h3>
                    <p className="text-blue-500 text-sm">
                      {selectedStore.address}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedStore.hours}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenModal}
                    className="text-primary text-sm font-medium hover:text-pink-600"
                  >
                    Изменить
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <MapPin className="inline-block text-primary mr-2" size={20} />
                <button
                  onClick={handleOpenModal}
                  className="border border-gray-300 rounded px-4 py-2 text-sm font-medium hover:border-secondary transition-colors"
                >
                  Выбрать магазин
                </button>
              </div>
            )}
          </div>
        )}
        {/* 
        {deliveryOption === "boxberry" && (
          <div className="mb-4">
            {selectedStore ? (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{selectedStore.name}</h3>
                    <p className="text-blue-500 text-sm">
                      {selectedStore.address}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedStore.hours}
                    </p>
                  </div>
                  <button
                    onClick={handleOpenModal}
                    className="text-primary text-sm font-medium hover:text-pink-600"
                  >
                    Изменить
                  </button>
                </div>
              </div>
            ) : (
            
                <div className="mb-4">
                  <MapPin className="inline-block text-primary mr-2" size={20} />
                  <button
                    onClick={handleOpenModal}
                    className="border border-gray-300 rounded px-4 py-2 text-sm font-medium hover:border-secondary transition-colors"
                  >
                    Выбрать ПВЗ Boxberry
                  </button>
                </div>
            )}
          </div>
        )} */}

        {isShowForm && (
          <div className="mb-4 border rounded-lg p-4">
            <h3 className="font-medium mb-4">Адрес доставки</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Область
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Индекс</label>
                <input
                  type="text"
                  name="index"
                  value={formData.index}
                  onChange={handleInputChange}
                  placeholder="Ваш индекс"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Город</label>
              <input
                type="text"
                name="city"
                value="Томск"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
                readOnly
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Улица <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Название улицы"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Дом <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="house"
                  value={formData.house}
                  onChange={handleInputChange}
                  placeholder="Номер дома"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Квартира <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                placeholder="Номер квартиры"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-secondary"
                required
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="text-[14px] text-gray-600 mb-6">
          {deliveryOption === "selfPickup" &&
            "Мы обязательно сообщим вам, как только ваш заказ поступит в пункт выдачи"}
          {deliveryOption === "courier" &&
            "Наш курьер свяжется с вами для согласования времени доставки"}
          {deliveryOption === "boxberry" &&
            "Вы получите SMS-уведомление, когда заказ будет доставлен в пункт выдачи Boxberry"}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={!isDeliveryComplete()}
            className={`w-full py-3 px-6 rounded font-medium transition-colors bg-primary text-white ${
              isDeliveryComplete() ? "" : "opacity-50 cursor-not-allowed"
            }`}
          >
            Оформить заказ
          </button>

          <button
            type="button"
            onClick={() => handlePrevStep(1)}
            className="flex
             items-center justify-center py-[9px] rounded-[10px]
               hover:text-primary w-full bg-gray_dark/20"
          >
            <span>Вернуться назад</span>
          </button>
        </div>
      </div>
    </div>
  );
}

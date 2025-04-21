import React from "react";

export default function CustomerForm({
  formData,
  handleInputChange,
  handlePhoneInput,
  validPhone,
  validEmail,
  phoneError,
  emailError,
  formIsValid,
  handleSubmitFirstForm,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          1
        </div>
        <span className="ml-3 font-medium">Получатель</span>
      </div>

      <form onSubmit={handleSubmitFirstForm}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Телефон <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneInput}
            onBlur={() => validPhone()}
            placeholder="+7 (___) ___-__-__"
            className={`w-full p-3 border ${
              phoneError ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:border-secondary`}
            required
          />
          {phoneError && (
            <p className="text-secondary text-[12px] mt-1">{phoneError}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Город <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Ваш город"
            className="w-full p-3 border border-gray-300 
              rounded focus:outline-none focus:border-secondary"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Фамилия <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Ваша фамилия"
            className="w-full p-3 border border-gray-300 rounded 
            focus:outline-none focus:border-secondary"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Имя <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Ваше имя"
              className="w-full p-3 border border-gray-300 rounded 
              focus:outline-none focus:border-secondary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Отчество</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              placeholder="Ваше отчество"
              className="w-full p-3 border border-gray-300 rounded
              focus:outline-none focus:border-secondary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              E-mail <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => validEmail()}
              placeholder="example@example.com"
              className={`w-full p-3 border ${
                emailError ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:border-secondary`}
              required
            />
            {emailError && (
              <p className="text-secondary text-[12px] mt-1">{emailError}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!formIsValid}
          className={`w-full py-3 px-6 rounded font-medium transition-colors bg-primary text-white ${
            formIsValid ? "" : "opacity-50 cursor-not-allowed"
          }`}
        >
          Далее
        </button>
      </form>
    </div>
  );
}

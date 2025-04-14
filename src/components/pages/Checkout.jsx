import { useState, useEffect } from "react";
import CustomerForm from "../shared/CustomerForm";
import DeliveryForm from "../shared/DeliveryForm";
import StoreSelectionModal from "../shared/StoreSelectionModal";
import BoxberrySelectionModal from "../shared/BoxberrySelectionModal"; // Предполагаем, что такой компонент будет создан

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    email: "",
    city: "",
    phone: "+7",
    // Address fields for courier delivery
    region: "Томская",
    index: "",
    street: "",
    house: "",
    apartment: "",
  });

  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);
  const [addressFormIsValid, setAddressFormIsValid] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("selfPickup");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  // Validate the entire form whenever data changes
  useEffect(() => {
    const { lastName, firstName, email, city, phone } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Simplified phone validation - just check if it has the right length and starts with +7
    const isPhoneValid =
      phone.replace(/\D/g, "").length === 11 && phone.startsWith("+7");

    const isEmailValid = email.trim() !== "" && emailRegex.test(email);

    const isFormComplete =
      lastName.trim() !== "" &&
      firstName.trim() !== "" &&
      isEmailValid &&
      city.trim() !== "" &&
      isPhoneValid;

    setFormIsValid(isFormComplete);
  }, [formData]);

  // Validate the address form when delivery option changes or address fields change
  useEffect(() => {
    if (deliveryOption === "courier") {
      const { street, house, apartment } = formData;
      const isAddressComplete =
        street.trim() !== "" && house.trim() !== "" && apartment.trim() !== "";

      setAddressFormIsValid(isAddressComplete);
    } else {
      setAddressFormIsValid(true); // Not needed for other delivery methods
    }
  }, [formData, deliveryOption]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear email error when typing
    if (name === "email") {
      setEmailError("");
    }
  };

  const validatePhoneNumber = (phone) => {
    // Simplified validation - just check if it has the right length and starts with +7
    return phone.replace(/\D/g, "").length === 11 && phone.startsWith("+7");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() !== "" && emailRegex.test(email);
  };

  const validPhone = () => {
    if (!validatePhoneNumber(formData.phone)) {
      setPhoneError(
        "Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX"
      );
    } else {
      setPhoneError("");
    }
  };

  const validEmail = () => {
    if (!validateEmail(formData.email)) {
      setEmailError("Введите корректный адрес электронной почты");
    } else {
      setEmailError("");
    }
  };

  const handleNextStep = () => {
    // Double check phone and email validation before proceeding
    let isValid = true;

    if (!validatePhoneNumber(formData.phone)) {
      setPhoneError(
        "Введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX"
      );
      isValid = false;
    }

    if (!validateEmail(formData.email)) {
      setEmailError("Введите корректный адрес электронной почты");
      isValid = false;
    }

    // If validation passes, proceed to next step
    if (isValid) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSelectDelivery = (option) => {
    setDeliveryOption(option);

    // Reset selected store if switching to another option
    setSelectedStore(null);
  };

  const formatPhoneNumber = (value) => {
    if (!value) return "+7";

    // Remove all non-digits except the leading +
    let phoneNumber = value.replace(/[^\d+]/g, "");

    // Always ensure it starts with +7
    if (!phoneNumber.startsWith("+")) {
      phoneNumber = "+" + phoneNumber;
    }
    if (!phoneNumber.startsWith("+7")) {
      phoneNumber =
        "+7" + phoneNumber.substring(phoneNumber.startsWith("+") ? 1 : 0);
    }

    // Limit to correct length (11 digits total including country code)
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length > 11) {
      phoneNumber = "+7" + digits.substring(1, 11);
    }

    // Format for Russian phone numbers
    if (phoneNumber.startsWith("+7")) {
      let formatted = "+7";

      if (digits.length > 1) {
        formatted += " (" + digits.substring(1, Math.min(4, digits.length));
      }

      if (digits.length > 4) {
        formatted += ") " + digits.substring(4, Math.min(7, digits.length));
      }

      if (digits.length > 7) {
        formatted += "-" + digits.substring(7, Math.min(9, digits.length));
      }

      if (digits.length > 9) {
        formatted += "-" + digits.substring(9, Math.min(11, digits.length));
      }

      return formatted;
    }

    return phoneNumber;
  };

  const handlePhoneInput = (e) => {
    let value = e.target.value;
    setPhoneError(""); // Clear error message when user types

    // Format the phone number properly
    const formattedPhone = formatPhoneNumber(value);

    setFormData({
      ...formData,
      phone: formattedPhone,
    });
  };

  const handleSubmitFirstForm = (e) => {
    e?.preventDefault();
    handleNextStep();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectStore = (store) => {
    setSelectedStore(store);
    handleCloseModal();
  };

  const handleFinalSubmit = () => {
    // Handle final checkout submission logic here
    console.log("Submitting order with:", {
      formData,
      deliveryOption,
      selectedStore: selectedStore ? selectedStore.id : null,
    });

    // Here you would typically call an API to submit the order
    alert("Заказ успешно оформлен!");
  };

  const isDeliveryComplete = () => {
    if (deliveryOption === "selfPickup" || deliveryOption === "boxberry") {
      return !!selectedStore;
    }

    // For courier delivery, check required address fields
    if (deliveryOption === "courier") {
      return addressFormIsValid;
    }

    return false;
  };

  const getModalComponent = () => {
    if (deliveryOption === "boxberry") {
      return (
        <BoxberrySelectionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSelectStore={handleSelectStore}
        />
      );
    } else {
      return (
        <StoreSelectionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSelectStore={handleSelectStore}
        />
      );
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 opacity-70">
          Оформление заказа
        </h1>

        {step === 1 ? (
          <CustomerForm
            formData={formData}
            handleInputChange={handleInputChange}
            handlePhoneInput={handlePhoneInput}
            validPhone={validPhone}
            validEmail={validEmail}
            phoneError={phoneError}
            emailError={emailError}
            formIsValid={formIsValid}
            handleSubmitFirstForm={handleSubmitFirstForm}
          />
        ) : (
          <DeliveryForm
            formData={formData}
            handleInputChange={handleInputChange}
            deliveryOption={deliveryOption}
            handleSelectDelivery={handleSelectDelivery}
            selectedStore={selectedStore}
            handleOpenModal={handleOpenModal}
            isDeliveryComplete={isDeliveryComplete}
            handleFinalSubmit={handleFinalSubmit}
            handlePrevStep={handlePrevStep}
          />
        )}
      </div>

      {getModalComponent()}
    </div>
  );
}

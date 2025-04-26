import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import CustomerForm from "../shared/CustomerForm";
import DeliveryForm from "../shared/DeliveryForm";
import StoreSelectionModal from "../shared/StoreSelectionModal";
import BoxberrySelectionModal from "../shared/BoxberrySelectionModal";
import FinishDesign from "../shared/FinishDesign";

// Cookie configuration
const COOKIE_CONFIG = {
  expires: 30, // Set longer expiration (30 days)
  path: "/", // Make cookies available across the entire site
  sameSite: "strict",
};

// Cookie keys
const COOKIE_KEYS = {
  FORM_DATA: "checkoutFormData",
  DELIVERY_OPTION: "deliveryOption",
  SELECTED_STORE: "selectedStore",
};

export default function Checkout({ user }) {
  const [shops, setShops] = useState([]);
  // Initialize state from cookies immediately with default values as fallback
  const [formData, setFormData] = useState(() => {
    try {
      const savedData = Cookies.get(COOKIE_KEYS.FORM_DATA);
      return savedData
        ? JSON.parse(savedData)
        : {
            lastName: "",
            firstName: "",
            middleName: "",
            email: user?.email || "", // Use user email if available
            city: "",
            phone: "+7",
            region: "",
            index: "",
            street: "",
            house: "",
            apartment: "",
          };
    } catch (error) {
      console.error("Error loading form data from cookies:", error);
      return {
        lastName: "",
        firstName: "",
        middleName: "",
        email: user?.email || "", // Use user email if available
        city: "",
        phone: "+7",
        region: "",
        index: "",
        street: "",
        house: "",
        apartment: "",
      };
    }
  });

  const [deliveryOption, setDeliveryOption] = useState(() => {
    try {
      const savedDelivery = Cookies.get(COOKIE_KEYS.DELIVERY_OPTION);
      return savedDelivery ? JSON.parse(savedDelivery) : { id: "selfPickup" };
    } catch (error) {
      return { id: "selfPickup" };
    }
  });

  const [selectedStore, setSelectedStore] = useState(() => {
    try {
      const savedStore = Cookies.get(COOKIE_KEYS.SELECTED_STORE);
      return savedStore ? JSON.parse(savedStore) : null;
    } catch (error) {
      console.error("Error loading selected store from cookies:", error);
      return null;
    }
  });

  const [step, setStep] = useState(1);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);
  const [addressFormIsValid, setAddressFormIsValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceDelivery, setPriceDelivery] = useState();

  // Helper function to safely save data to cookies
  const saveToCookie = (key, value) => {
    try {
      const valueToStore =
        typeof value === "object" ? JSON.stringify(value) : value;
      Cookies.set(key, valueToStore, COOKIE_CONFIG);
    } catch (error) {
      console.error(`Error saving to cookie ${key}:`, error);
    }
  };

  // Save form data when it changes
  useEffect(() => {
    saveToCookie(COOKIE_KEYS.FORM_DATA, formData);
  }, [formData]);

  // Save delivery option when it changes
  useEffect(() => {
    saveToCookie(COOKIE_KEYS.DELIVERY_OPTION, deliveryOption);
  }, [deliveryOption]);

  // Save selected store when it changes
  useEffect(() => {
    if (selectedStore) {
      saveToCookie(COOKIE_KEYS.SELECTED_STORE, selectedStore);
    } else {
      Cookies.remove(COOKIE_KEYS.SELECTED_STORE);
    }
  }, [selectedStore]);

  // Calculate delivery price
  // useEffect(() => {
  //   let price =
  //     deliveryOption === "selfPickup"
  //       ? 0
  //       : deliveryOption === "courier"
  //       ? 200.0
  //       : deliveryOption === "south_gate"
  //       ? 300.0
  //       : deliveryOption === "park"
  //       ? 250.0
  //       : deliveryOption === "boxberry"
  //       ? 162.0
  //       : 0;

  //   setPriceDelivery(price);
  // }, [deliveryOption]);

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
    if (deliveryOption.id !== "selfPickup") {
      const { street, house, apartment } = formData;
      const isAddressComplete =
        street.trim() !== "" && house.trim() !== "" && apartment.trim() !== "";

      setAddressFormIsValid(isAddressComplete);
    } else {
      setAddressFormIsValid(true); // Not needed for other delivery methods
    }
  }, [formData, deliveryOption]);

  // When user data is available, update the form
  useEffect(() => {
    if (user && user.email && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [user]);
  console.log(selectedStore);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "city") {
      setSelectedStore(null);
      Cookies.remove(COOKIE_KEYS.SELECTED_STORE);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        region: "",
        index: "",
        street: "",
        house: "",
        apartment: "",
      }));
    }
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

  const handleSelectDelivery = (option) => {
    if (option.id !== "Самовывоз из магазина ШТУЧКИ.PRO") {
      setSelectedStore(null);
      // When changing delivery option, also remove the selected store cookie
      Cookies.remove(COOKIE_KEYS.SELECTED_STORE);
    }

    setDeliveryOption(option);
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

    setFormData((prevData) => ({
      ...prevData,
      phone: formattedPhone,
    }));
  };

  const handleSubmitFirstForm = (e) => {
    e?.preventDefault();
    handleNextStep();
  };

  const handleOpenModal = (data) => {
    setShops(data);
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

    // Clear cookies after successful order submission
    // clearSavedData();

    setStep(3);
    // Here you would typically call an API to submit the order
  };

  // Add method to clear saved form data (useful for adding a "Reset Form" button)
  const clearSavedData = () => {
    Cookies.remove(COOKIE_KEYS.FORM_DATA, { path: "/" });
    Cookies.remove(COOKIE_KEYS.DELIVERY_OPTION, { path: "/" });
    Cookies.remove(COOKIE_KEYS.SELECTED_STORE, { path: "/" });

    setFormData({
      lastName: "",
      firstName: "",
      middleName: "",
      email: user?.email || "", // Keep user email if available
      city: "",
      phone: "+7",
      region: "Томская",
      index: "",
      street: "",
      house: "",
      apartment: "",
    });
    setDeliveryOption("selfPickup");
    setSelectedStore(null);
  };

  const isDeliveryComplete = () => {
    if (deliveryOption.id === "selfPickup") {
      return !!selectedStore;
    } else {
      return addressFormIsValid;
    }
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
          setSelectedStore={setSelectedStore}
          selectedStore={selectedStore}
          shops={shops}
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
            clearSavedData={clearSavedData}
          />
        ) : step === 2 ? (
          <DeliveryForm
            formData={formData}
            handleInputChange={handleInputChange}
            deliveryOption={deliveryOption}
            handleSelectDelivery={handleSelectDelivery}
            selectedStore={selectedStore}
            handleOpenModal={handleOpenModal}
            isDeliveryComplete={isDeliveryComplete}
            handleFinalSubmit={handleFinalSubmit}
            handlePrevStep={setStep}
            setPriceDelivery={setPriceDelivery}
          />
        ) : (
          <FinishDesign
            deliveryOption={deliveryOption}
            priceDelivery={priceDelivery}
            formData={formData}
            selectedStore={selectedStore}
            handlePrevStep={setStep}
            user={user}
          />
        )}
      </div>

      {getModalComponent()}
    </div>
  );
}

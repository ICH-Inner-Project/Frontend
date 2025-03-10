export const usernameValidate = (value: string) => {
  if (!value) {
    return "This value should not be blank";
  }

  const usernamePattern = /^[A-Za-z0-9]+$/;
  if (!usernamePattern.test(value)) {
    return "Incorrect login. It can only consist of Latin letters and digits, without special characters";
  }

  if (value.length < 3 || value.length > 20) {
    return "From 3 to 20 symbols";
  }

  return true;
};
export const passwordValidate = (value: string) => {
  if (!value) {
    return "This value should not be blank";
  }
  if (value.length < 3 || value.length > 20) {
    return "From 3 to 20 symbols";
  }
  return true;
};

export const yournameValidate = (value: string) => {
  if (!value) {
    return "This value should not be blank";
  }

  if (value.length > 30) {
    return "Your Name should not exceed 30 characters";
  }

  return true;
};

export const emailValidate = (value: string) => {
  if (!value) {
    return "This value should not be blank";
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(value)) {
    return "Please enter a valid email address";
  }

  return true;
};

export const contentValidate = (value: string) => {
  if (!value) {
    return "Please enter your message";
  }

  if (value.length < 3) {
    return "Content should be at least 3 characters";
  }

  if (value.length > 1000) {
    return "Content should not exceed 1000 characters";
  }

  return true;
};

export const firstAndLastNameValidate = (value: string) => {
  if (!value) {
    return "This value should not be blank";
  }

  if (value.length < 3 || value.length > 20) {
    return "From 3 to 20 symbols";
  }

  return true;
};

export const birthdayValidate = (value: string) => {
  if (!value) {
    return "This value should not be blank";
  }
  const birthDate = new Date(value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 7 || age > 100) return "Incorrect birthdate";

  return true;
};

export const genderValidate = (value: string) => {
  if (!value) {
    return "This value should not be blank";
  }
  return true;
};

export const phoneValidate = (value: string) => {
  if (!value) {
    return "This value should not be blank";
  }

  if (!/^\+?\d{10,12}$/.test(value)) return "This value is not valid";
  return true;
};

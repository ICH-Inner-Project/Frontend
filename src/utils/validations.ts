export const usernameValidate = (value: string) => {
  if (!value) {
    return "The field cannot be empty";
  }

  const usernamePattern = /^[A-Za-z0-9]+$/;
  if (!usernamePattern.test(value)) {
    return "Incorrect login. It can only consist of Latin letters and digits, without special characters";
  }

  if (value.length < 3) {
    return "The login must contain at least 3 characters";
  }

  if (value.length > 20) {
    return "The login must not exceed 20 characters";
  }

  return true;
};
export const passwordValidate = (value: string) => {
  if (!value) {
    return "The field cannot be empty";
  }
  if (value.length < 3) {
    return "The password must contain at least 3 characters";
  }

  if (value.length > 20) {
    return "The password must not exceed 20 characters";
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

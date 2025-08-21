export const emailValidation = (email: string) => {
  // - basic email format validation: something@something.something
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const passwordValidation = (password: string) => {
  // - min. 8 characters
  // - at least one lowercase letter
  // - at least one uppercase letter
  // - at least one digit
  // - at least one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()\-_=+{}[\]:;"'<>,.?\/|\\]).{8,}$/;
  return passwordRegex.test(password);
};

export const validateExportOrdersQuery = (query: any) => {
  const { minWorth, maxWorth, orderId } = query;

  if (minWorth !== undefined && isNaN(Number(minWorth))) {
    return { valid: false, error: 'minWorth needs to be a number' };
  }
  if (maxWorth !== undefined && isNaN(Number(maxWorth))) {
    return { valid: false, error: 'maxWorth needs to be a number' };
  }
  if (Number(minWorth) > Number(maxWorth)) {
    return {
      valid: false,
      error: 'minWorth cannot be greater than maxWorth',
    };
  }
  if (orderId !== undefined && typeof orderId !== 'string') {
    return { valid: false, error: 'orderId needs to be a string' };
  }

  return { valid: true };
};

// Add validation functions on for users here.
const validateId = (id) => {
  if (!id) return { isValid: false, message: "Expected id field is not provided" };
  if (typeof id !== "string") return { isValid: false, message: "Expected id field is in invalid format" };
  if (id.length === 0 || id.trim().length === 0) return { isValid: false, message: "Expected id entry is invalid" };
  return { isValid: true };
};

const validateEmailAddress = (email) => {
  // Email according to RFC2822
  if (!email) return { isValid: false, message: `Email address not provided.` };
  if (typeof email !== "string")
    return { isValid: false, message: "Expected emailAddress field is in invalid format." };
  if (email.length === 0 || email.trim().length === 0)
    return { isValid: false, message: `Expected emailAddress field is invalid.` };
  const emailRegex = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  if (!emailRegex.test(email)) {
    return { isValid: false, message: `Email address format is incorrect.` };
  }
  return { isValid: true };
};

const validatePassword = (password) => {
  if (!password) return { isValid: false, message: `Password not provided.` };
  if (typeof password !== "string") return { isValid: false, message: `Expected password field is in invalid format.` };
  if (password.length === 0 || password.trim().length === 0)
    return { isValid: false, message: `Expected password field is invalid.` };
  return { isValid: true };
};

module.exports = {
  validateId,
  validateEmailAddress,
  validatePassword,
};

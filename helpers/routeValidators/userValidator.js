// Add validation functions on for users here.
const validateId = (id) => {
  if (!id) return { isValid: false, message: "Expected id field is not provided" };
  if (typeof id !== "string") return { isValid: false, message: "Expected id field is in invalid format" };
  if (id.length === 0 || id.trim().length === 0) return { isValid: false, message: "Expected id entry is invalid" };
  return { isValid: true };
};

module.exports = {
  validateId,
};

// This is a routeValidator. All routeValidators functions are supposed to return the following object:
// { isValid: <boolean>, message: <string>, status: 200/400/... }
// isValid is true/false based on whether the input is good or bad, message is a string given based on the error.

const validateSearchBody = (body) => {
  if (!body) return { isValid: false, message: "Expected keyword for search not provided." };
  if (!(typeof body === "object" && body instanceof Object)) {
    return { isValid: false, message: "Given search payload is invalid." };
  }
  const providedKeys = Object.keys(body);
  const expectedKeys = ["keyword"];
  const remainingKeys = providedKeys.filter((item) => !expectedKeys.includes(item));
  if (!(remainingKeys.length === 0)) {
    return { isValid: false, message: `Unexpected/Invalid field(s) ${remainingKeys} in request.` };
  }
  if (!body.keyword) return { isValid: false, message: "Expected keyword for search not provided." };
  if (typeof body.keyword !== "string") return { isValid: false, message: "Given search payload is invalid." };
  // If everything passes without conflict
  return { isValid: true };
};

module.exports = {
  validateSearchBody,
};

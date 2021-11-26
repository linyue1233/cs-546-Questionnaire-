const validateId = (id) => {
  if (!id) throw "Expected id field is not provided";
  if (typeof id !== "string") throw "Expected id field is in invalid format";
  if (id.length === 0 || id.trim().length === 0) throw "Expected id entry is invalid";
};

module.exports = {
  validateId,
};

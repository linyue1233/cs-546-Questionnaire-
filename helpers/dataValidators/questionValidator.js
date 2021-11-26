const validateId = (id) => {
  if (!id) throw "Expected id field is not provided";
  if (typeof id !== "string") throw "Expected id field is in invalid format";
  if (id.length === 0 || id.trim().length === 0) throw "Expected id entry is invalid";
};

const validateSearchBody = (body) => {
  if (!body) throw "Expected keyword for search not provided.";
  if (!(typeof body === "object" && body instanceof Object)) {
    throw "Given search payload is invalid.";
  }
  const providedKeys = Object.keys(body);
  const expectedKeys = ["keyword"];
  const remainingKeys = providedKeys.filter((item) => !expectedKeys.includes(item));
  if (!(remainingKeys.length === 0)) {
    throw `Unexpected/Invalid field(s) ${remainingKeys} in request.`;
  }
  if (!body.keyword) throw "Expected keyword for search not provided.";
  if (typeof body.keyword !== "string") throw "Given search payload is invalid.";
};

const validateUpdateBody = (body) => {
  if (!body) throw "Expected description for update not provided.";
  if (!(typeof body === "object" && body instanceof Object)) {
    throw "Given description is invalid.";
  }
  const providedKeys = Object.keys(body);
  const expectedKeys = ["description", "_method"];
  const remainingKeys = providedKeys.filter((item) => !expectedKeys.includes(item));
  if (!(remainingKeys.length === 0)) {
    throw `Unexpected/Invalid field(s) ${remainingKeys} in request.`;
  }
  if (!body.description) throw "Expected keyword for search not provided.";
  if (typeof body.description !== "string") throw "Given search payload is invalid.";
};

module.exports = {
  validateId,
  validateSearchBody,
  validateUpdateBody,
};

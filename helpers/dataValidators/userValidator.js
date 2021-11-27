const validateId = (id) => {
  if (!id) throw "Expected id field is not provided";
  if (typeof id !== "string") throw "Expected id field is in invalid format";
  if (id.length === 0 || id.trim().length === 0) throw "Expected id entry is invalid";
};

const validateEmailAddress = (email) => {
  // Email according to RFC2822
  if (!email) throw `Email address not provided.`;
  if (typeof email !== "string") throw "Expected emailAddress field is in invalid format.";
  if (email.length === 0 || email.trim().length === 0) throw `Expected emailAddress field is invalid.`;
  const emailRegex = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  if (!emailRegex.test(email)) {
    throw `Email address format is incorrect.`;
  }
};

const validatePassword = (password) => {
  if (!password) throw `Password not provided.`;
  if (typeof password !== "string") throw `Expected password field is in invalid format.`;
  if (password.length === 0 || password.trim().length === 0) throw `Expected password field is invalid.`;
};

module.exports = {
  validateId,
  validateEmailAddress,
  validatePassword,
};

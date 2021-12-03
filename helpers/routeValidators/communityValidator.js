const validateId = (id) => {
  if (!id) return { isValid: false, messge: "Expected id field is not provided" };
  if (typeof id !== "string") return { isValid: false, message: "Expected id field is in invalid format" };
  if (id.length === 0 || id.trim().length === 0) return { isValid: false, message: "Expected id entry is invalid" };
  return { isValid: true };
};

const validateCommunityId = (communityId) => {
  if (!communityId) return { isValid: false, message: `Community Id is required.` };
  if (typeof communityId !== "string") return { isValid: false, message: `Community Id is not a string` };
  if (communityId.length === 0) return { isValid: false, message: `Community Id is empty.` };
  if (communityId.trim().length === 0) return { isValid: false, message: `Community Id is invalid.` };
  return { isValid: true };
};

const validateCommunityEditPayload = (editPayload) => {
  if (!editPayload) return { isValid: false, message: `No edit payload provided.` };
  if (typeof editPayload !== "object" || !(editPayload instanceof Object))
    return { isValid: false, message: `Edit payload is of incorrect type.` };
  // validate keys
  let acceptedKeys = ["description", "title", "administrator", "_method"];
  let existingKeys = Object.keys(editPayload);
  existingKeys = existingKeys.filter((item) => {
    if (!acceptedKeys.includes(item)) return item;
  });
  if (existingKeys.length !== 0)
    return { isValid: false, message: `Given edit payload schema is invalid. Expected <description: String>.` };
  if (typeof editPayload.description !== "string" || typeof editPayload.title !== "string")
    return { isValid: false, message: `Given edit payload schema is invalid. Expected <description: String>` };

  return { isValid: true };
};

module.exports = {
  validateId,
  validateCommunityId,
  validateCommunityEditPayload,
};

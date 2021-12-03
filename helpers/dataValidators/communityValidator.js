const validateId = (id) => {
  if (!id) throw "Expected id field is not provided";
  if (typeof id !== "string") throw "Expected id field is in invalid format";
  if (id.length === 0 || id.trim().length === 0) throw "Expected id entry is invalid";
};

const validateCommunityId = (communityId) => {
  if (!communityId) throw `Community Id is required.`;
  if (typeof communityId !== "string") throw `Community Id is not a string`;
  if (communityId.length === 0) throw `Community Id is empty.`;
  if (communityId.trim().length === 0) throw `Community Id is invalid.`;
};

const validateCommunityEditPayload = (editPayload) => {
  if (!editPayload) throw `No edit payload provided.`;
  if (typeof editPayload !== "object" || !(editPayload instanceof Object)) throw `Edit payload is of incorrect type.`;
  // validate keys
  let acceptedKeys = ["description", "title", "administrator", "_method"];
  let existingKeys = Object.keys(editPayload);
  existingKeys = existingKeys.filter((item) => {
    if (!acceptedKeys.includes(item)) return item;
  });
  if (existingKeys.length !== 0) throw `Given edit payload schema is invalid. Expected <description: String>.`;
  if (typeof editPayload.description !== "string")
    throw `Given edit payload schema is invalid. Expected <description: String, title: String, administrator: String>`;
  if (typeof editPayload.title !== "string")
    throw `Given edit payload schema is invalid. Expected <description: String, title: String, administrator: String>`;
};

module.exports = {
  validateId,
  validateCommunityId,
  validateCommunityEditPayload,
};

const validateId = (id) => {
  if (!id) throw "Expected id field is not provided";
  if (typeof id !== "string") throw "Expected id field is in invalid format";
  if (id.length === 0 || id.trim().length === 0) throw "Expected id entry is invalid";
};

const validateEmailAddress = (emailAddress) =>{
  if (!emailAddress) throw "Expected emailAddress field is not provided";
  if (typeof id !== "string") throw "Expected emailAddress field is in invalid format";
  if (emailAddress.length === 0 || emailAddress.trim().length === 0) throw "Expected emailAddress entry is invalid";
  let regstr = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
  if(!regstr.test(emailAddress)){
    throw `Expected emailAddress doesn't meet spectifications(RFC2822).`;
  }
}

module.exports = {
  validateId,
  validateEmailAddress
};

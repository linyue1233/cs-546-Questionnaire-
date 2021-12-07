let changeMethodToPutForAnswerUpdate = (req, res, next) => {
  // for now, we have this middleware that changes the method to PUT
  // we will look at implementing this through AJAX asap though.
  if (req.body._method === "PUT") {
    req.method = "put";
  }
  next();
};
let changeMethodToPutForUserprofileUpdate = (req, res, next) => {
  if (req.method === "POST") {
    req.method = "put";
  }
  next();
};
let questionEditMiddleware = (req, res, next) => {
  if (req.method === "POST") {
    req.method = "put";
  }
  next();
};
let questionDeleteMiddleware = (req, res, next) => {
  if (req.method === "GET") {
    req.method = "delete";
  }
  next();
};
module.exports = {
  changeMethodToPutForAnswerUpdate,
  changeMethodToPutForUserprofileUpdate,
  questionEditMiddleware,
  questionDeleteMiddleware,
};

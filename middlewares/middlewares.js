let changeMethodToPutForAnswerUpdate = (req, res, next) => {
  // for now, we have this middleware that changes the method to PUT
  // we will look at implementing this through AJAX asap though.
<<<<<<< HEAD
  console.log(req.method, req.originalUrl);
  if (req.body._method === "PUT") {
    req.method = "put";
  }
  console.log(req.method);
=======
  if (req.body._method === "PUT") {
    req.method = "put";
  }
>>>>>>> 0bc2950270babc9de215ba528c45507ba5432efd
  next();
};

let changeMethodToPutForUserprofileUpdate = (req, res, next) => {
  if (req.method === "POST") {
    req.method = "put";
  }
  next();
};
let questionEditMiddleware = (req, res, next) => {
  if (req.body._method === "PUT") {
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
let changeMethodToPutForCommunityEdit = (req, res, next) => {
  if (req.body._method === "PUT") {
    req.method = "put";
  }
  next();
};

module.exports = {
  changeMethodToPutForAnswerUpdate,
  changeMethodToPutForUserprofileUpdate,
  questionEditMiddleware,
  questionDeleteMiddleware,
  changeMethodToPutForCommunityEdit,
};

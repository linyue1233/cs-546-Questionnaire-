let changeMethodToPutForAnswerUpdate = (req, res, next) => {
  // for now, we have this middleware that changes the method to PUT
  // we will look at implementing this through AJAX asap though.
  console.log(req.method, req.originalUrl)
  if (req.body._method === "PUT") {
    req.method = "put";
  }
  console.log(req.method)
  next();
};

// let changeMethodToPutForUserprofileUpdate = (req, res, next) => {
//   console.log(req.method)
//   if (req.method === "POST") {
//     req.method = "put";
//   }
//   console.log(req.method)
//   next();
// };

// let questionEditMiddleware = (req, res, next) => {
//   console.log(req.method)
//   if (req.method === "POST") {
//     req.method = "put";
//   }
//   next();
// };
// let questionDeleteMiddleware = (req, res, next) => {
//   console.log(req.method)
//   if (req.method === "GET") {
//     req.method = "delete";
//   }
//   next();
// };
// let changeMethodToPutForCommunityEdit = (req, res, next) => {
//   console.log(req.method)
//   if (req.method === "GET") {
//     req.method = "put";
//   }
//   next();
// };

module.exports = {
  changeMethodToPutForAnswerUpdate,
  // changeMethodToPutForUserprofileUpdate,
  // questionEditMiddleware,
  // questionDeleteMiddleware,
  // changeMethodToPutForCommunityEdit,
};

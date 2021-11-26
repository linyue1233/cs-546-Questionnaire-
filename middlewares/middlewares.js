let changeMethodToPutForAnswerUpdate = (req, res, next) => {
  // for now, we have this middleware that changes the method to PUT
  // we will look at implementing this through AJAX asap though.
  if (req.body._method === "PUT") {
    req.method = "put";
  }
  next();
};

module.exports = {
  changeMethodToPutForAnswerUpdate,
};
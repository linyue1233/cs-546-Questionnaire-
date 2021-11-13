const questionRoutes = require("./questions");

const constructorMethod = (app) => {
  app.use("/questions", questionRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'invalid request' });
  });
};

module.exports = constructorMethod;

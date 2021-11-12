const questionRoutes = require("./questions");

const constructorMethod = (app) => {
  app.use("/questions", questionRoutes);
  app.use("*", async (req, res) => {
    // TODO fill in incorrect route information
  });
};

module.exports = constructorMethod;

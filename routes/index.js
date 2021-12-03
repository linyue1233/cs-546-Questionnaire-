const questionRoutes = require("./questions");
const userRoutes = require("./users");
const communityRoutes = require("./communities");

const constructorMethod = (app) => {
  app.use("/questions", questionRoutes);
  app.use("/users", userRoutes);
  app.use("/communities", communityRoutes);
  app.use("*", async (req, res) => {
    // TODO fill in incorrect route information
  });
};

module.exports = constructorMethod;

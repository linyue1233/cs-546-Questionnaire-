const questionRoutes = require("./questions");
const userRoutes = require("./users");
const entryRoutes = require("./entry");
const communityRoutes = require("./communities");
const frontPage = require("./frontPage");


const constructorMethod = (app) => {
  app.use("/site", entryRoutes);
  app.use("/questions", questionRoutes);
  app.use("/users", userRoutes);
  app.use("/communities", communityRoutes);
  app.use("/", frontPage);
  app.use("*", async (req, res) => {
    // TODO fill in incorrect route information
  });
};

module.exports = constructorMethod;

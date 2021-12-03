const express = require("express");
const router = express.Router();
const communities = require("../data/communities");

router.get("/create/new", async (req, res) => {
  if (req.session.userId) {
    res.render("communities/new-community", {
      loginError: false,
      session: req.session,
    });
  } else {
    res.redirect("/site/login");
  }
});

router.post("/create/new", async (req, res) => {
  if (!req.session.userId) {
    res.redirect("/communities/create/new");
  } else if (!req.body.name || !req.body.description) {
    res.render("communities/new-community", {
      message: "Fill all the fields to create a community",
      error: true,
    });
  } else {
    try {
      let name = req.body.name;
      let description = req.body.description;
      const done = communities.createCom(name, description, req.session.userId);
      if (done) {
        res.render("communities/success", {
          message: name + " Community successfully created",
          success: true,
          error: false,
          session: req.session,
        });
      }
    } catch (e) {
      res.render("communities/new-community", {
        message: e,
        error: true,
      });
    }
  }
});

module.exports = router;

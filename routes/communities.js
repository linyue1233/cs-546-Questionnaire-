const express = require("express");
const router = express.Router();
const communities = require("../data/communities");

router.get("/create/new", async (req, res) => {
  if (req.session.userId) {
    res.render("communities/new-comunity", {
      error: false,
    });
  } else {
    res.render("communities/new-community", {
      message: "You need to login to create a community",
      error: true,
    });
  }
});

router.post("/", async (req, res) => {
  if (!req.session.userId) {
    res.render("communities/new-community", {
      message: "Unauthorized Access",
      error: true,
    });
  } else if (!req.body) {
    res.render("communities/new-community", {
      message: "Fill all the fields to create a community",
      error: true,
    });
  } else {
    try {
      let name = req.body.name;
      let description = req.body.description;
      const res = communities.createCom(name, description, req.session.userId);
      if (res) {
        res.render("communities/new-community", {
          message: "Community successfully created",
          success: true,
          error: false,
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

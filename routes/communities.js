const express = require("express");
const router = express.Router();
const communities = require("../data/communities");

router.get("/", async (req, res) => {
    try{
        let com= await communities.getAllcommunities()
        console.log(com)
        res.render("communities/getAllcommunity",{com:com})

    }catch(e){
        res.render("communities/getAllcommunity",e)

    }
  });

  module.exports = router;
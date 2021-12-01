const express = require("express");
const router = express.Router();
const communities = require("../data/communities");


router.get("/:id",async(req,res)=>{
    console.log("111");
    console.log(req.params.id);
    if(!req.params.id){
        res.status(400).json({ error: "No communityId found" });
        return;
    }
    try{
        const communityInfo = await communities.getCommunityById(req.params.id);
        console.log("111");
        if(!communityInfo){
            res.status(400).json({ error: "No community for the Id" });
            return;
        }
        console.log(communityInfo);
        res.render("communities/view_community_details",{communityInfo:communityInfo});
    }catch(e){
        console.log(e);
        res.status(400).json({error:e});
    }
})

module.exports = router;


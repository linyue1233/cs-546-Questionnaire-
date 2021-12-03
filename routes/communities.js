const express = require("express");
const router = express.Router();
const communities = require("../data/communities");


router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: "No communityId found" });
        return;
    }
    try {
        const communityInfo = await communities.getCommunityById(req.params.id);
        if (!communityInfo) {
            res.status(400).json({ error: "No community for the Id" });
            return;
        }
        let currentUser = req.session.userId;
        // check user if they subscribe the community
        if (currentUser === null) {
            res.render("communities/view_community_details", { communityInfo: communityInfo, isSubscribed: false });
            return;
        }else{
            let allCommunityUser = communityInfo.community.subscribedUsers;
            for(let item of allCommunityUser){
                if(currentUser === item){
                    res.render("communities/view_community_details", { communityInfo: communityInfo, isSubscribed: true });
                    return;
                }
            }
            res.render("communities/view_community_details", { communityInfo: communityInfo, isSubscribed: false });
        }
    } catch (e) {
        res.status(400).json({ error: e });
    }
})

module.exports = router;


const express = require("express");
const router = express.Router();
const users = require("../data/users");
const validator = require("../helpers/routeValidators/userValidator");

const path = require("path");
const multer  = require('multer')

// This will store the image first in temorrarydisk called storage
let storage= multer.diskStorage({
  destination:"/public/images/",
  filename: (req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));  
  }
})
// defining multer middleware

let upload=multer({
  storage:storage
}).single('profileImage');
// profileImage is the name atribute of html form
router.delete("/:id", async (req, res) => {
  let userId = req.params.id;
  let validate = validator.validateId(userId);
  if (!validate.isValid) {
    res.render("users/get_specific_user", { error: validate.message });
    return;
  }
  try {
    const deletedUser = await users.deleteUser(userId);
    if (deletedUser.deleted) {
      // Maybe throw a success prompt, but delete the user and log them out
      // for now, redirecting to questions
      // TODO: revisit with logout code
      res.redirect("/questions/all");
      return;
    }
    res.status(400).render("users/get_specific_user", { error: "Something went wrong." });
    return;
  } catch (e) {
    res.status(400).render("users/get_specific_user", { error: e });
    return;
  }
});


router.get('/:id/edit', async (req, res) => {
  let userId = req.params.id;
  // Kindly verify below function name with data functions
  const User = await users.getUserbyId(userId);


  res.status(200).render('users/Update_userForm',User);
});
router.put("/:id", upload, async (req, res, next) => {

 
/*   let validate = validator.validateId(userId);
  if (!validate.isValid) {
    res.render("users/get_specific_user", { error: validate.message });
    return;
  } */
  try {
    if (!req.body.firstName|| !req.body.lastName || !req.params.id || !req.file.filename) throw " error : Incomplete Data received";
     
  let userId = req.params.id;
  let firstName=req.body.firstName;
  let lastName=req.body.lastName;
  let profileImage= req.file.filename;
  if (
    typeof userId !== 'string' ||
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof profileImage !== 'string'
  ) {
    throw ' not a valid inputs';
  }

    const updateUser = await users.updateUser(userId,firstName,lastName,profileImage);
   // updateuser returns the updated user from users collection
  //  let success = req.file.filename+ "uploaded successfully"
    res.status(200).render("users/get_specific_user", updateUser);
    return;
  } catch (e) {
    res.status(400).render("users/get_specific_user", { error: e });
    return;
  }
});

module.exports = router;

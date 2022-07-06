const express = require("express");
const {
  registerUser,
  login,
  logout,
  updateUser,
  deleteUser,
  getAllUsers,
  getUser,
} = require("./contollers");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);
router.get("/get-all-users", getAllUsers);
router.get("/get-user/:id", getUser);

module.exports = router;
